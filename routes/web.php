<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; // <-- PERBAIKAN: Import Auth facade
use Inertia\Inertia;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// --- Impor Controller Admin BARU Anda ---
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\MajorController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SemesterController;
// --- AKHIR PERBAIKAN ---


/*
|--------------------------------------------------------------------------
| Rute Web
|--------------------------------------------------------------------------
*/

// Rute '/' bawaan Breeze
Route::get('/', function () {
    // Logika kustom kita untuk mengarahkan user yang sudah login
    if (Auth::check()) {
        if (Auth::user()->role_id == 1) { // 1 = Admin
            return redirect()->route('admin.dashboard');
        }
        // Nanti tambahkan redirect untuk Dosen/Mahasiswa
    }

    // Jika tidak login, tampilkan halaman Welcome
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rute /dashboard bawaan Breeze (kita komentari karena Admin punya dashboard sendiri)
/*
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
*/

Route::middleware('auth')->group(function () {
    // Rute Logout (dari AuthenticatedSessionController kustom kita)
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Rute Profile bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- RUTE KHUSUS ADMIN KITA ---
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {

        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Rute untuk User Management
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');

        // Rute untuk Faculties
        Route::get('faculties', [FacultyController::class, 'index'])->name('faculties.index');
        Route::post('faculties', [FacultyController::class, 'store'])->name('faculties.store');

        // Rute untuk Majors
        Route::get('majors', [MajorController::class, 'index'])->name('majors.index');
        Route::get('majors/create', [MajorController::class, 'create'])->name('majors.create');
        Route::post('majors', [MajorController::class, 'store'])->name('majors.store');

        Route::resource('semesters', SemesterController::class)->except(['show']);
    });
});

// Ini memuat rute login/register bawaan Breeze
require __DIR__.'/auth.php';
