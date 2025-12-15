<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Billing;
use App\Models\Semester;
use App\Models\KrsRequest; // Jangan lupa import model ini
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $student */
        $student = Auth::user();

        // Load profil dan jurusan untuk ditampilkan di header dashboard
        $student->load(['studentProfile.major.faculty']);

        // 1. Ambil Semester Aktif
        $activeSemester = Semester::where('is_active', true)->first();
        $semesterName = $activeSemester ? $activeSemester->semester_name : '-';
        $activeSemesterId = $activeSemester ? $activeSemester->semester_id : null;

        // 2. Hitung SKS Taken (SKS yang diambil Semester Ini)
        // Logika: Ambil dari KRS semester aktif.
        // HANYA hitung jika statusnya 'approved' (sudah bayar/disetujui).
        $sksTaken = 0;

        if ($activeSemesterId) {
            $krs = KrsRequest::where('student_id', $student->user_id)
                ->where('semester_id', $activeSemesterId)
                ->first();

            // Cek status: approved biasanya berarti sudah lunas/disetujui dosen
            // Kita juga bisa cek 'paid' jika sistem Anda menggunakan status itu.
            if ($krs && ($krs->status === 'approved' || $krs->status === 'paid')) {
                $sksTaken = $krs->total_sks;
            }
        }

        // 3. Hitung Tagihan Belum Lunas (Unpaid Bill)
        $unpaidBill = Billing::where('student_id', $student->user_id)
            ->whereIn('status', ['unpaid', 'overdue'])
            ->sum('amount');

        // 4. Data Dashboard
        $dashboardData = [
            'semester_level' => $student->studentProfile->current_semester_level ?? 1,

            // Data Dinamis:
            'sks_taken' => (int) $sksTaken, // 0 jika belum bayar/approve, angka asli jika sudah.
            'max_sks' => 24, // Bisa diganti logic IPK semester lalu jika mau lebih advance
            'unpaid_bill' => (int) $unpaidBill,
            'gpa' => $student->studentProfile->gpa ?? 0,
            'active_semester_name' => $semesterName
        ];

        return Inertia::render('Student/Dashboard', [
            'student' => $student,
            'dashboardData' => $dashboardData
        ]);
    }
}
