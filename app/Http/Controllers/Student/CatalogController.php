<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\KrsItem;
use App\Models\Grade;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $studentProfile = $user->studentProfile;

        // 1. Ambil Peta Kurikulum Jurusan
        $curriculums = Curriculum::with('course')
            ->where('major_id', $studentProfile->major_id)
            ->orderBy('semester')
            ->get();

        // 2. Ambil History Nilai (Lulus/Gagal)
        $grades = Grade::where('student_id', $user->user_id)
            ->get()
            ->keyBy('course_id');

        // 3. Ambil KRS Semester INI (Sedang Diambil)
        $currentKrsCourses = KrsItem::whereHas('krsRequest', function($q) use ($user, $studentProfile) {
                $q->where('student_id', $user->user_id)
                  ->where('semester_id', $studentProfile->semester_id) // Hanya cek semester aktif
                  ->whereIn('status', ['draft', 'submitted', 'approved']);
            })
            ->with('class')
            ->get()
            ->pluck('class.course_id')
            ->toArray();

        // 4. Mapping Data
        $catalog = $curriculums->map(function ($curr) use ($grades, $currentKrsCourses) {
            $courseId = $curr->course_id;

            $status = 'Available';
            $gradeChar = '-';

            // Cek History Nilai
            if ($grades->has($courseId)) {
                $history = $grades[$courseId];

                if (in_array($history->grade_char, ['A', 'B', 'C'])) {
                    $status = 'Passed';
                    $gradeChar = $history->grade_char;
                } else if (in_array($history->grade_char, ['D', 'E', 'T'])) {
                    $status = 'Available'; // Gagal = Available untuk retake
                    $gradeChar = $history->grade_char;
                }
            }

            // Cek Sedang Diambil
            if ($status !== 'Passed' && in_array($courseId, $currentKrsCourses)) {
                $status = 'Taken';
            }

            return [
                'id' => $curr->course_id,
                'code' => $curr->course->course_code,
                'name' => $curr->course->course_name,
                'sks' => $curr->course->sks,
                'semester' => $curr->semester,
                'category' => $curr->category, // WAJIB_PRODI, dll
                'status' => $status, // Passed, Taken, Available
                'grade' => $gradeChar,
                'prerequisite' => '-' // Bisa dikembangkan nanti
            ];
        });

        return Inertia::render('Student/Catalog/Index', [
            'catalog' => $catalog
        ]);
    }
}
