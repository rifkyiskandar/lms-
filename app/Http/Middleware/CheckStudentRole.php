<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckStudentRole
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user login DAN role_id-nya 3 (Student)
        if (Auth::check() && Auth::user()->role_id == 3) {
            return $next($request);
        }

        // Jika bukan student, lempar balik atau ke 403
        return redirect('/')->with('error', 'Access denied. Student area only.');
    }
}
