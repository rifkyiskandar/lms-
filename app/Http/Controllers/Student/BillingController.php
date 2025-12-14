<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil tagihan milik user
        $billings = Billing::with(['costComponent', 'semester'])
            ->where('student_id', $user->user_id)
            ->orderBy('status', 'desc') // Unpaid dulu
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Student/Billing/Index', [
            'billings' => $billings
        ]);
    }
}
