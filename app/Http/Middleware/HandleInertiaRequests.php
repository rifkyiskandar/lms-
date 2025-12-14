<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware; // <-- Pastikan ini di-import
use Illuminate\Support\Facades\Auth; // <-- Pastikan ini di-import

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app'; // <-- Pastikan ini 'app' (untuk app.blade.php)

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     * INI ADALAH FUNGSI YANG PALING PENTING
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            // Bagikan data 'auth'
            'auth' => [
                'user' => $request->user() ? [
                    'user_id' => $request->user()->user_id,
                    'full_name' => $request->user()->full_name,
                    'email' => $request->user()->email,
                    'role_id' => $request->user()->role_id,
                ] : null,
            ],

            // --- TAMBAHAN PENTING: FLASH MESSAGES ---
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'env' => [
            'midtrans_client_key' => config('services.midtrans.client_key'),
            ],

        ]);
    }
}
