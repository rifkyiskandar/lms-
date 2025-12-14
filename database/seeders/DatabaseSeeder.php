<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Faculty;
use App\Models\Major;
use App\Models\Semester;
use App\Models\Room;
use App\Models\Course;
use App\Models\CourseClass;
use App\Models\Grade;
use App\Models\Curriculum;
use App\Models\CostComponent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Semester & Biaya
        // Semester Aktif (Semester 3 bagi mahasiswa ini)
        $sem3 = Semester::create([
            'semester_name' => 'Ganjil 2025/2026', 'academic_year' => '2025/2026', 'term' => 'Ganjil',
            'start_date' => '2025-09-01', 'end_date' => '2026-01-31', 'is_active' => true,
        ]);

        // Semester Lalu (Genap - Sem 2)
        $sem2 = Semester::create([
            'semester_name' => 'Genap 2024/2025', 'academic_year' => '2024/2025', 'term' => 'Genap',
            'start_date' => '2025-02-01', 'end_date' => '2025-06-30', 'is_active' => false,
        ]);

        // Semester Paling Awal (Ganjil - Sem 1)
        $sem1 = Semester::create([
            'semester_name' => 'Ganjil 2024/2025', 'academic_year' => '2024/2025', 'term' => 'Ganjil',
            'start_date' => '2024-09-01', 'end_date' => '2025-01-31', 'is_active' => false,
        ]);

        // Biaya
        CostComponent::create(['component_code' => 'SKS', 'component_name' => 'Biaya per SKS', 'billing_type' => 'PER_SKS', 'amount' => 250000]);
        CostComponent::create(['component_code' => 'BPP', 'component_name' => 'Biaya Tetap Semester', 'billing_type' => 'PER_SEMESTER', 'amount' => 4000000]);


        // 2. Organisasi Kampus
        $faculty = Faculty::create(['faculty_name' => 'Faculty of Computer Science']);
        $major = Major::create(['major_name' => 'Informatics', 'faculty_id' => $faculty->faculty_id]);
        $room = Room::create(['room_name' => 'LAB-A', 'building' => 'Gedung TI', 'floor' => '2', 'capacity' => 40]);

        // 3. User
        // Admin
        User::create([
            'full_name' => 'Super Admin', 'email' => 'admin@lms.com', 'password_hash' => Hash::make('password'), 'role_id' => 1
        ]);

        // Dosen
        $lecturer = User::create([
            'full_name' => 'Dr. Alan Turing', 'email' => 'dosen@lms.com', 'password_hash' => Hash::make('password'), 'role_id' => 2
        ]);
        $lecturer->lecturerProfile()->create(['lecturer_number' => 'D001', 'faculty_id' => $faculty->faculty_id, 'title' => 'Dr.', 'position' => 'Lecturer']);

        // Mahasiswa (Semester 3)
        $student = User::create([
            'full_name' => 'John Doe', 'email' => 'student@lms.com', 'password_hash' => Hash::make('password'), 'role_id' => 3
        ]);
        $student->studentProfile()->create([
            'student_number' => '2024001',
            'faculty_id' => $faculty->faculty_id,
            'major_id' => $major->major_id,
            'semester_id' => $sem1->semester_id, // Masuk saat Semester 1
            'batch_year' => 2024,
            'gpa' => 2.00, // IPK Rendah karena banyak gagal
        ]);
        $student->profileInfo()->create(['nickname' => 'John', 'dream_job' => 'Software Engineer']);


        // 4. MATA KULIAH & KURIKULUM & NILAI

        // --- A. SEMESTER 1 (Kalkulus & Algoritma -> GAGAL) ---

        // Kalkulus I
        $cKalkulus = Course::create(['course_code' => 'MAT101', 'course_name' => 'Kalkulus I', 'sks' => 4, 'faculty_id' => $faculty->faculty_id, 'major_id' => $major->major_id]);
        Curriculum::create(['major_id' => $major->major_id, 'course_id' => $cKalkulus->course_id, 'semester' => 1, 'category' => 'WAJIB_FAKULTAS']);

        Grade::create([
            'student_id' => $student->user_id, 'course_id' => $cKalkulus->course_id, 'semester_id' => $sem1->semester_id,
            'grade_char' => 'E', 'grade_point' => 0.00, 'is_passed' => false // GAGAL
        ]);

        // Algoritma
        $cAlgo = Course::create(['course_code' => 'CS101', 'course_name' => 'Algoritma & Pemrograman', 'sks' => 4, 'faculty_id' => $faculty->faculty_id, 'major_id' => $major->major_id]);
        Curriculum::create(['major_id' => $major->major_id, 'course_id' => $cAlgo->course_id, 'semester' => 1, 'category' => 'WAJIB_PRODI']);

        Grade::create([
            'student_id' => $student->user_id, 'course_id' => $cAlgo->course_id, 'semester_id' => $sem1->semester_id,
            'grade_char' => 'E', 'grade_point' => 0.00, 'is_passed' => false // GAGAL
        ]);


        // --- B. SEMESTER 2 (Pancasila -> LULUS) ---

        $cPancasila = Course::create(['course_code' => 'MKU001', 'course_name' => 'Pancasila', 'sks' => 2, 'faculty_id' => $faculty->faculty_id, 'major_id' => $major->major_id]);
        Curriculum::create(['major_id' => $major->major_id, 'course_id' => $cPancasila->course_id, 'semester' => 2, 'category' => 'MKU']);

        Grade::create([
            'student_id' => $student->user_id, 'course_id' => $cPancasila->course_id, 'semester_id' => $sem2->semester_id,
            'grade_char' => 'A', 'grade_point' => 4.00, 'is_passed' => true // LULUS
        ]);


        // --- C. SEMESTER 3 (Artificial Intelligence -> TARGET) ---

        $cAI = Course::create(['course_code' => 'CS301', 'course_name' => 'Artificial Intelligence', 'sks' => 3, 'faculty_id' => $faculty->faculty_id, 'major_id' => $major->major_id]);
        Curriculum::create(['major_id' => $major->major_id, 'course_id' => $cAI->course_id, 'semester' => 3, 'category' => 'WAJIB_PRODI']);


        // 5. JADWAL KELAS (YANG DIBUKA SEKARANG - SEMESTER 3)
        // Agar mahasiswa bisa ambil, matkul harus punya jadwal di semester aktif (Sem 3)

        // Jadwal AI (Normal)
        CourseClass::create([
            'course_id' => $cAI->course_id, 'lecturer_id' => $lecturer->user_id, 'semester_id' => $sem3->semester_id, 'room_id' => $room->room_id,
            'class_name' => 'A', 'day' => 'Monday', 'start_time' => '08:00:00', 'end_time' => '10:30:00'
        ]);

        // Jadwal Kalkulus (Remedial / Kelas Bawah)
        // Admin membuka kelas Kalkulus di Semester 3 untuk mahasiswa yang mengulang
        CourseClass::create([
            'course_id' => $cKalkulus->course_id, 'lecturer_id' => $lecturer->user_id, 'semester_id' => $sem3->semester_id, 'room_id' => $room->room_id,
            'class_name' => 'Remedial', 'day' => 'Tuesday', 'start_time' => '13:00:00', 'end_time' => '16:00:00'
        ]);

        // Jadwal Algoritma (Remedial / Kelas Bawah)
        CourseClass::create([
            'course_id' => $cAlgo->course_id, 'lecturer_id' => $lecturer->user_id, 'semester_id' => $sem3->semester_id, 'room_id' => $room->room_id,
            'class_name' => 'Reguler', 'day' => 'Wednesday', 'start_time' => '08:00:00', 'end_time' => '11:00:00'
        ]);

        // Pancasila TIDAK DIBUKA jadwalnya di Semester 3 (karena matkul Genap), dan mahasiswa juga sudah lulus.
    }
}
