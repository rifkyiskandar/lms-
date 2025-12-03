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

use App\Http\Controllers\Admin\CourseController; // <-- Tambah
use App\Http\Controllers\Admin\RoomController;   // <-- Tambah
use App\Http\Controllers\Admin\CourseClassController; // <-- Tambah
use App\Http\Controllers\Admin\CurriculumController;
use App\Http\Controllers\Admin\CostComponentController;


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
        Route::resource('users', UserController::class)->except(['show']);

        // Rute untuk Faculties
        Route::resource('faculties', FacultyController::class)->except(['show']);

        // Rute untuk Majors
        Route::resource('majors', MajorController::class)->except(['show']);

        Route::resource('semesters', SemesterController::class)->except(['show']);

         // --- RUTE BARU ---
        Route::resource('courses', CourseController::class)->except(['show']);
        Route::resource('rooms', RoomController::class)->except(['show']);

        // Kita namakan URL-nya 'classes' tapi controller-nya CourseClass
        Route::resource('classes', CourseClassController::class)->except(['show']);

        Route::get('curriculums', [CurriculumController::class, 'index'])->name('curriculums.index');
        Route::post('curriculums', [CurriculumController::class, 'store'])->name('curriculums.store');
        Route::delete('curriculums/{id}', [CurriculumController::class, 'destroy'])->name('curriculums.destroy');

        Route::resource('cost_components', CostComponentController::class)->except(['show']);


    });
});

// Ini memuat rute login/register bawaan Breeze
require __DIR__.'/auth.php';
