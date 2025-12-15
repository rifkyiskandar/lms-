<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            // 1. DATA USER (Existing)
            'auth' => [
                'user' => $request->user() ? [
                    'user_id' => $request->user()->user_id,
                    'full_name' => $request->user()->full_name,
                    'email' => $request->user()->email,
                    'role_id' => $request->user()->role_id,
                    // Tips: Tambahkan mapping ini agar Header.tsx tidak error membaca role/avatar
                    'role' => match($request->user()->role_id) {
                        1 => 'Admin',
                        2 => 'Lecturer',
                        3 => 'Student',
                        default => 'User'
                    },
                    'avatar' => $request->user()->profile_picture,
                ] : null,
            ],

            // 2. FLASH MESSAGES (Existing)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // 3. ENV VARIABLES (Existing)
            'env' => [
                'midtrans_client_key' => config('services.midtrans.client_key'),
            ],

            // --- [BARU] 4. LOCALIZATION CONFIGURATION ---

            // A. Kirim kode bahasa saat ini (en/id)
            'locale' => app()->getLocale(),

            // B. Kirim seluruh kamus kata (JSON) ke frontend
            'translations' => function () {
                $locale = app()->getLocale();
                // Mencari file di folder: lang/id.json
                $path = lang_path("{$locale}.json");

                if (file_exists($path)) {
                    return json_decode(file_get_contents($path), true);
                }

                return []; // Return array kosong jika file tidak ditemukan
            },
            // --------------------------------------------

        ]);
    }
}
