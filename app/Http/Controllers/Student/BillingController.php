<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\Payment; // <--- Import Model Payment
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Ambil Tagihan (Billing) - Unpaid/Overdue
        $billings = Billing::with(['costComponent', 'semester'])
            ->where('student_id', $user->user_id)
            ->orderBy('status', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Ambil Riwayat Pembayaran (Payment History) - REAL DATA
        // Mengambil data dari tabel payments yang dibuat di PaymentController
        $paymentHistory = Payment::where('student_id', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Hitung Total yang SUDAH DIBAYAR (Status = settlement/capture)
        // Midtrans biasanya menggunakan 'settlement' atau 'capture' untuk sukses
        // Kita juga bisa include 'paid' jika anda manual update
        $totalPaid = $paymentHistory
            ->whereIn('status', ['settlement', 'capture', 'paid'])
            ->sum('total_amount');

        return Inertia::render('Student/Billing/Index', [
            'billings' => $billings,
            'paymentHistory' => $paymentHistory, // <--- Kirim ke Frontend
            'totalPaid' => $totalPaid,           // <--- Kirim ke Frontend
            'env' => [
                'midtrans_client_key' => config('services.midtrans.client_key') // Pastikan config benar
            ]
        ]);
    }
}   
