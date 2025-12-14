<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
// use App\Models\Payment; // <-- Ditutup dulu karena Model Payment belum ada
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Statistik User & Course (DATA ASLI DARI DB)
        $totalStudents = User::where('role_id', 3)->count();
        $newStudentsThisMonth = User::where('role_id', 3)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $totalLecturers = User::where('role_id', 2)->count();

        $activeCourses = Course::count();

        // 2. Revenue (SET 0)
        $totalRevenue = 0;
        $revenueThisMonth = 0;

        // 3. Recent Activity (KOSONGKAN)
        // Nanti React akan menampilkan "No recent activity found."
        $recentActivities = [];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'students' => [
                    'total' => $totalStudents,
                    'new_this_month' => $newStudentsThisMonth
                ],
                'lecturers' => [
                    'total' => $totalLecturers,
                ],
                'courses' => [
                    'total' => $activeCourses,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'this_month' => $revenueThisMonth
                ]
            ],
            'recent_activities' => $recentActivities
        ]);
    }
}
