<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        // --- INI ADALAH PERBAIKANNYA ---
        // Menambahkan middleware Inertia ke grup 'web'
        // agar data 'auth' bisa dibagikan ke semua halaman
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        // --- AKHIR PERBAIKAN ---


        // Ini adalah alias yang sudah Anda buat (dan sudah benar)
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'admin' => \App\Http\Middleware\CheckAdminRole::class,
            'student' => \App\Http\Middleware\CheckStudentRole::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'midtrans/webhook' // Izinkan Midtrans akses tanpa token CSRF
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
