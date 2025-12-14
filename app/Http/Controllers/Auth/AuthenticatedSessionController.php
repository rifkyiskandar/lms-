<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest; // Breeze menggunakan ini untuk validasi
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; // Kita tidak render di sini, tapi import tidak masalah

class AuthenticatedSessionController extends Controller
{
    /**
     * Menampilkan tampilan login.
     * (Ini sudah dibuat otomatis oleh Breeze & Inertia)
     */
    public function create()
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Menangani permintaan autentikasi masuk.
     * INI ADALAH FUNGSI YANG KITA MODIFIKASI
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Ambil kredensial yang sudah divalidasi
        $credentials = $request->validated();

        // 2. Coba login
        if (Auth::attempt($credentials, $request->boolean('remember'))) {

            $request->session()->regenerate();

            // Ambil role user yang baru saja login
            $role = Auth::user()->role_id;

            // 3. Logika Pengalihan (Redirect)
            if ($role == 1) { // Admin
                return redirect()->intended(route('admin.dashboard'));
            }
            elseif ($role == 3) { // Student (MAHASISWA)
                // Pastikan route 'student.dashboard' sudah ada di web.php
                return redirect()->intended(route('student.dashboard'));
            }
            elseif ($role == 2) { // Lecturer (DOSEN - Nanti)
                // return redirect()->intended(route('lecturer.dashboard'));
                return redirect()->intended('/');
            }

            // Default redirect jika role tidak dikenal
            return redirect()->intended('/');
        }

        // 4. Jika login gagal, kembali dengan error
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    /**
     * Hancurkan sesi autentikasi.
     * (Fungsi logout ini sudah benar, tidak perlu diubah)
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
