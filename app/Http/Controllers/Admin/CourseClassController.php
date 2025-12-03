<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseClass;
use App\Models\Course;
use App\Models\User;
use App\Models\Room;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseClassController extends Controller
{
    /**
     * Menampilkan daftar jadwal kelas.
     */
    public function index(Request $request)
    {
        $classes = CourseClass::query()
            ->with(['course', 'lecturer', 'room', 'semester']) // Eager loading relasi
            ->when($request->input('search'), function ($query, $search) {
                // Cari berdasarkan nama mata kuliah
                $query->whereHas('course', function($q) use ($search){
                    $q->where('course_name', 'like', "%{$search}%")
                      ->orWhere('course_code', 'like', "%{$search}%");
                });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Classes/Index', [
            'classes' => $classes,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Menampilkan form tambah jadwal.
     */
    public function create()
    {
        return Inertia::render('Admin/Classes/Create', [
            'courses' => Course::all(['course_id', 'course_name', 'course_code']),
            // Ambil user yang rolenya Dosen (role_id = 2)
            'lecturers' => User::where('role_id', 2)->get(['user_id', 'full_name']),
            'rooms' => Room::all(['room_id', 'room_name', 'capacity']),
            // Ambil semester yang aktif saja agar relevan
            'semesters' => Semester::where('is_active', true)->get(),
        ]);
    }

    /**
     * Menyimpan jadwal baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,course_id',
            'lecturer_id' => 'required|exists:users,user_id',
            'semester_id' => 'required|exists:semesters,semester_id',
            'room_id' => 'required|exists:rooms,room_id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Ambil data tambahan dari relasi untuk mengisi kolom redundan (jika ada di desain)
        $course = Course::find($request->course_id);
        $semester = Semester::find($request->semester_id);

        // Persiapkan data untuk disimpan
        $data = $request->all();

        // Isi kolom redundan (sesuai desain database Anda)
        $data['course_code'] = $course->course_code;
        $data['year'] = (int) substr($semester->academic_year, 0, 4); // Ambil tahun awal (misal 2025)

        CourseClass::create($data);

        return to_route('admin.classes.index');
    }

    /**
     * Menampilkan form edit jadwal.
     */
    public function edit(CourseClass $class) // Perhatikan model binding 'class' (bukan $courseClass)
    {
        return Inertia::render('Admin/Classes/Edit', [
            'classSchedule' => $class, // Kirim data jadwal yang mau diedit
            'courses' => Course::all(['course_id', 'course_name', 'course_code']),
            'lecturers' => User::where('role_id', 2)->get(['user_id', 'full_name']),
            'rooms' => Room::all(['room_id', 'room_name', 'capacity']),
            'semesters' => Semester::all(), // Kirim semua semester untuk edit (bukan cuma yang aktif)
        ]);
    }

    /**
     * Menyimpan perubahan jadwal.
     */
    public function update(Request $request, CourseClass $class)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,course_id',
            'lecturer_id' => 'required|exists:users,user_id',
            'semester_id' => 'required|exists:semesters,semester_id',
            'room_id' => 'required|exists:rooms,room_id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        // Update data redundan juga jika berubah
        $course = Course::find($request->course_id);
        $semester = Semester::find($request->semester_id);

        $data = $request->all();
        $data['course_code'] = $course->course_code;
        $data['year'] = (int) substr($semester->academic_year, 0, 4);

        $class->update($data);

        return to_route('admin.classes.index');
    }

    /**
     * Menghapus jadwal.
     */
    public function destroy(CourseClass $class)
    {
        $class->delete();
        return to_route('admin.classes.index');
    }
}
