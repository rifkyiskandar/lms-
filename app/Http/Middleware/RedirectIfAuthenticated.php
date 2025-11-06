<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {

                // --- LOGIKA PENGALIHAN KUSTOM ---
                $user = Auth::guard($guard)->user();

                if ($user->role_id == 1) { // 1 = Admin
                    return redirect(route('admin.dashboard'));
                }

                // Nanti tambahkan untuk Dosen/Mahasiswa
                // if ($user->role_id == 2) { ... }

                // Default redirect jika role tidak dikenal
                return redirect('/');
                // --- AKHIR DARI LOGIKA KUSTOM ---
            }
        }

        return $next($request);
    }
}
