<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment; // <--- JANGAN LUPA IMPORT INI
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Stats Counters
        $totalStudents = User::where('role_id', 3)->count(); // Asumsi role_id 3 = student

        $newStudentsThisMonth = User::where('role_id', 3)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalLecturers = User::where('role_id', 2)->count(); // Asumsi role_id 2 = lecturer

        $activeCourses = Course::count();

        // 2. AMBIL DATA PEMBAYARAN TERBARU (Real Data)
        $recentPayments = Payment::with('student') // Pastikan ada relasi 'student' di model Payment
            ->orderBy('created_at', 'desc')
            ->take(5) // Ambil 5 terakhir
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->payment_id,
                    'order_id' => $payment->order_id,
                    // Cek null safety jika student terhapus
                    'student_name' => $payment->student ? $payment->student->full_name : 'Unknown Student',
                    'amount' => $payment->total_amount, // Pastikan nama kolom di DB sesuai (amount atau total_amount)
                    'status' => $payment->status,
                    'date' => $payment->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'stats' => [
                'students' => [
                    'total' => $totalStudents,
                    'new_this_month' => $newStudentsThisMonth,
                ],
                'lecturers' => [
                    'total' => $totalLecturers,
                ],
                'courses' => [
                    'total' => $activeCourses,
                ],
            ],
            // 3. Masukkan data hasil query ke sini
            'recentPayments' => $recentPayments,
        ]);
    }
}
