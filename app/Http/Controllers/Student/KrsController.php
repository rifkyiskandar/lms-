<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\KrsRequest;
use App\Models\KrsItem;
use App\Models\Curriculum;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KRSController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $studentProfile = $user->studentProfile;

        // ------------------------------------------------------------------
        // PERBAIKAN 1: Ambil Semester yang SEDANG AKTIF di Sistem
        // Bukan semester masuk mahasiswa ($studentProfile->semester_id)
        // ------------------------------------------------------------------
        $activeSemester = Semester::where('is_active', true)->first();

        if (!$activeSemester) {
            return back()->with('error', 'Tidak ada semester aktif saat ini.');
        }

        // 1. Cek / Buat Draft KRS (Gunakan Semester Aktif)
        $krs = KrsRequest::firstOrCreate(
            [
                'student_id' => $user->user_id,
                'semester_id' => $activeSemester->semester_id // <-- PERBAIKAN: Pakai Semester Aktif
            ],
            [
                'status' => 'draft',
                'total_sks' => 0
            ]
        );
        $krs->load(['items.class.course', 'items.class.room', 'items.class.lecturer']);

        // 2. AMBIL HISTORY NILAI
        $gradeHistory = \App\Models\Grade::where('student_id', $user->user_id)
            ->get()
            ->keyBy('course_id');

        // 3. Logic Filter Kurikulum
        // Ambil Level Semester Mahasiswa (Misal: Semester 3)
        $currentSemesterLevel = $studentProfile->current_semester_level;

        // Ambil Course yang BOLEH diambil:
        // 1. Matkul paket semester ini atau bawahnya (Semester <= 3)
        // 2. ATAU Matkul MKU
        $curriculums = Curriculum::where('major_id', $studentProfile->major_id)
            ->where(function($query) use ($currentSemesterLevel) {
                $query->where('semester', '<=', $currentSemesterLevel)
                      ->orWhere('category', 'MKU');
            })
            ->get();

        $courseCategories = $curriculums->pluck('category', 'course_id');
        $courseIds = $curriculums->pluck('course_id');

        // 4. Ambil Jadwal Kelas
        $availableClasses = CourseClass::with(['course', 'lecturer', 'room'])
            ->whereIn('course_id', $courseIds) // Filter Course yang boleh diambil

            // --------------------------------------------------------------
            // PERBAIKAN 2: Filter Jadwal berdasarkan SEMESTER AKTIF
            // Agar jadwal kelas remedial (semester 1 yang dibuka di semester 3)
            // bisa muncul di sini.
            // --------------------------------------------------------------
            ->where('semester_id', $activeSemester->semester_id)

            ->get()
            ->map(function ($class) use ($courseCategories, $krs, $gradeHistory) {

                $enrolledCount = KrsItem::where('class_id', $class->class_id)->count();
                $isTakenInCurrentKrs = $krs->items->contains('class_id', $class->class_id);

                // --- LOGIC STATUS NILAI ---
                $history = $gradeHistory[$class->course_id] ?? null;
                $academicStatus = 'Normal';
                $pastGrade = null;

                if ($history) {
                    $pastGrade = $history->grade_char; // A, B, C, D, E
                    if (in_array($pastGrade, ['A', 'B', 'C'])) {
                        $academicStatus = 'Passed'; // Sudah lulus (Disable tombol nanti)
                    } elseif (in_array($pastGrade, ['D', 'E', 'F'])) {
                        $academicStatus = 'Retake'; // Gagal (Muncul badge kuning)
                    }
                }

                return [
                    'id' => $class->class_id,
                    'courseCode' => $class->course->course_code,
                    'courseName' => $class->course->course_name,
                    'className' => $class->class_name ?? 'A',
                    'category' => $courseCategories[$class->course_id] ?? 'PILIHAN',
                    'sks' => $class->course->sks,
                    'lecturer' => $class->lecturer->full_name,
                    'day' => $class->day,
                    'start_time' => substr($class->start_time, 0, 5),
                    'end_time' => substr($class->end_time, 0, 5),
                    'room' => $class->room->room_name,
                    'quota' => $class->room->capacity,
                    'enrolled' => $enrolledCount,
                    'isFull' => $enrolledCount >= $class->room->capacity,
                    'isTaken' => $isTakenInCurrentKrs,

                    // Data Status Akademik
                    'academicStatus' => $academicStatus,
                    'pastGrade' => $pastGrade
                ];
            });

        return Inertia::render('Student/KRS/Create', [
            'krs' => $krs,
            'availableClasses' => $availableClasses,
            'maxSks' => 24,
            'studentSemester' => $currentSemesterLevel
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $classId = $request->input('class_id');

        // 1. Ambil Data Kelas & KRS
        $classToAdd = CourseClass::with(['course', 'semester'])->findOrFail($classId);
        $krs = KrsRequest::where('student_id', $user->user_id)
                         ->where('status', 'draft')
                         ->firstOrFail();

        $studentProfile = $user->studentProfile;
        $currentSemesterLevel = $studentProfile->current_semester_level;

        // --- VALIDASI AKADEMIK (The "Brains") ---

        // A. Cek Kurikulum Matkul Ini
        $curriculumInfo = Curriculum::where('course_id', $classToAdd->course_id)
            ->where('major_id', $studentProfile->major_id)
            ->first();

        if ($curriculumInfo) {
            $courseSemester = $curriculumInfo->semester;

            // Aturan 1: DILARANG AMBIL ATAS (Strict)
            // Matkul semester 5 tidak boleh diambil oleh mahasiswa semester 3
            if ($courseSemester > $currentSemesterLevel) {
                return back()->withErrors([
                    'error' => "Anda belum berhak mengambil mata kuliah Semester {$courseSemester}. (Posisi Anda: Semester {$currentSemesterLevel})"
                ]);
            }

            // Aturan 2: GANJIL-GENAP COMPATIBILITY (Untuk Retake)
            // Semester 1 (Ganjil) hanya boleh diambil di Semester 3 (Ganjil)
            // Semester 2 (Genap) TIDAK BOLEH diambil di Semester 3 (Ganjil)
            $isStudentOdd = ($currentSemesterLevel % 2) != 0;
            $isCourseOdd  = ($courseSemester % 2) != 0;

            if ($isStudentOdd !== $isCourseOdd) {
                return back()->withErrors([
                    'error' => "Mata kuliah Semester {$courseSemester} (" . ($isCourseOdd ? 'Ganjil' : 'Genap') . ") tidak dibuka di semester ini (" . ($isStudentOdd ? 'Ganjil' : 'Genap') . ")."
                ]);
            }
        }

        // --- VALIDASI TEKNIS (Sama seperti sebelumnya) ---

        // B. Cek SKS Limit
        if (($krs->total_sks + $classToAdd->course->sks) > 24) {
            return back()->withErrors(['error' => 'Batas SKS terlampaui (Max 24).']);
        }

        // C. Cek Course Duplikat
        $existingCourseIds = KrsItem::where('krs_id', $krs->krs_id)
            ->join('course_classes', 'krs_items.class_id', '=', 'course_classes.class_id')
            ->pluck('course_classes.course_id')
            ->toArray();

        if (in_array($classToAdd->course_id, $existingCourseIds)) {
            return back()->withErrors(['error' => 'Anda sudah mengambil mata kuliah ini.']);
        }

        // D. Cek Tabrakan Jadwal
        $myClasses = KrsItem::where('krs_id', $krs->krs_id)->with('class.course')->get()->pluck('class');
        foreach ($myClasses as $myClass) {
            if ($myClass->day == $classToAdd->day) {
                if (
                    ($classToAdd->start_time >= $myClass->start_time && $classToAdd->start_time < $myClass->end_time) ||
                    ($classToAdd->end_time > $myClass->start_time && $classToAdd->end_time <= $myClass->end_time)
                ) {
                    return back()->withErrors(['error' => "Jadwal bentrok dengan {$myClass->course->course_name}."]);
                }
            }
        }

        // E. Cek Kapasitas
        $enrolled = KrsItem::where('class_id', $classId)->count();
        if ($enrolled >= $classToAdd->room->capacity) {
            return back()->withErrors(['error' => 'Kelas penuh.']);
        }

        // --- EKSEKUSI ---
        DB::transaction(function () use ($krs, $classToAdd) {
            KrsItem::create([
                'krs_id' => $krs->krs_id,
                'class_id' => $classToAdd->class_id,
                'sks' => $classToAdd->course->sks,
                'status' => 'draft'
            ]);
            $krs->increment('total_sks', $classToAdd->course->sks);
        });

        return back()->with('success', 'Mata kuliah berhasil ditambahkan.');
    }

    public function destroy($itemId)
    {
        // Logic Hapus: Cek apakah matkul wajib paket? (Opsional, kalau mau strict gabisa drop)
        // Untuk sekarang kita izinkan drop agar mahasiswa bisa tukar kelas.

        $item = KrsItem::findOrFail($itemId);
        $krs = KrsRequest::findOrFail($item->krs_id);

        DB::transaction(function () use ($item, $krs) {
            $sks = $item->sks;
            $item->delete();
            $krs->decrement('total_sks', $sks);
        });

        return back()->with('success', 'Mata kuliah dihapus dari KRS.');
    }

    public function submit()
    {
        $user = Auth::user();

        // 1. Ambil KRS Draft
        $krs = KrsRequest::where('student_id', $user->user_id)
            ->where('status', 'draft')
            ->firstOrFail();

        // Validasi (Opsional)
        if ($krs->total_sks < 1) {
            return back()->withErrors(['error' => 'Pilih mata kuliah terlebih dahulu.']);
        }

        DB::transaction(function () use ($krs, $user) {
            // --- AMBIL KOMPONEN BIAYA ---
            $biayaSksComp = \App\Models\CostComponent::where('billing_type', 'PER_SKS')->first();
            $biayaSmtComp = \App\Models\CostComponent::where('billing_type', 'PER_SEMESTER')->first();

            $dueDate = now()->addWeeks(2); // Jatuh tempo 2 minggu lagi

            // 2. Generate Billing 1: Biaya SKS (Jika ada settingannya)
            if ($biayaSksComp) {
                $totalSksAmount = $krs->total_sks * $biayaSksComp->amount;

                \App\Models\Billing::create([
                    'student_id' => $user->user_id,
                    'semester_id' => $krs->semester_id,
                    'cost_component_id' => $biayaSksComp->cost_component_id,
                    'description' => "Biaya SKS ({$krs->total_sks} SKS x " . number_format($biayaSksComp->amount) . ")",
                    'amount' => $totalSksAmount,
                    'due_date' => $dueDate,
                    'status' => 'unpaid'
                ]);
            }

            // 3. Generate Billing 2: Biaya Tetap Semester (Jika ada)
            if ($biayaSmtComp) {
                \App\Models\Billing::create([
                    'student_id' => $user->user_id,
                    'semester_id' => $krs->semester_id,
                    'cost_component_id' => $biayaSmtComp->cost_component_id,
                    'description' => "Biaya Tetap Semester (BPP)",
                    'amount' => $biayaSmtComp->amount,
                    'due_date' => $dueDate,
                    'status' => 'unpaid'
                ]);
            }

            // 4. Update Status KRS
            // Status jadi 'submitted', menunggu pembayaran lunas baru 'approved' (oleh sistem/dosen)
            $krs->update([
                'status' => 'submitted',
                'submitted_at' => now()
            ]);
        });

        // Redirect ke halaman Tagihan Saya
        return to_route('student.bills.index')->with('success', 'KRS Berhasil Di-Checkout. Tagihan telah dibuat.');
    }
}
