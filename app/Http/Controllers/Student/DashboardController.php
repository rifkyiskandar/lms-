<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Grade;
use App\Models\Billing;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $student */
        $student = Auth::user();

        // Load profil
        $student->load(['studentProfile.major.faculty']);

        // 1. Ambil Semester Aktif (Untuk Info Header)
        $activeSemester = Semester::where('is_active', true)->first();
        $semesterName = $activeSemester ? $activeSemester->semester_name : '-';

        // 2. Hitung SKS Lulus (Total Credits)
        // Ambil dari tabel Grade yang is_passed = true
        $sksTaken = Grade::where('student_id', $student->user_id)
            ->where('is_passed', true)
            ->join('courses', 'grades.course_id', '=', 'courses.course_id') // Join untuk ambil SKS course
            ->sum('courses.sks');

        // 3. Hitung Tagihan Belum Lunas
        $unpaidBill = Billing::where('student_id', $student->user_id)
            ->whereIn('status', ['unpaid', 'overdue'])
            ->sum('amount');

        // 4. Data Dashboard
        $dashboardData = [
            'semester_level' => $student->studentProfile->current_semester_level, // Dari Accessor Model
            'status' => $student->is_active ? 'Active' : 'Inactive',
            'sks_taken' => (int) $sksTaken,
            'max_sks' => 24, // Hardcode dulu atau logika IPK (misal IPK < 2.0 max 18)
            'unpaid_bill' => (int) $unpaidBill,
            'gpa' => $student->studentProfile->gpa, // Ambil GPA dari database
            'active_semester_name' => $semesterName
        ];

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'dashboardData' => $dashboardData // Kirim data hasil hitungan
        ]);
    }
}
