<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login DAN role_id-nya adalah 1 (Admin)
        if (Auth::check() && Auth::user()->role_id == 1) {
            return $next($request);
        }

        // Jika tidak, tolak akses dan kembalikan ke halaman login
        return redirect()->route('login')->with('error', 'You do not have permission to access this page.');
    }
}
