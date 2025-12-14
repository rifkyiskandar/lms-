<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Billing;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;

class WebhookController extends Controller
{
    public function __construct()
    {
        // Pastikan config ter-set
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function handle(Request $request)
    {
        // 1. LOGGING SUPER DETAIL (Cek raw body)
        // Ini akan mencatat apa persisnya yang dikirim Midtrans sebelum diapa-apakan
        Log::info('Midtrans Webhook Raw Body:', ['body' => $request->getContent()]);

        try {
            // 2. Gunakan Library Resmi Midtrans untuk membaca notifikasi
            // Class ini otomatis membaca php://input (raw body)
            $notif = new Notification();

            $transaction = $notif->transaction_status;
            $type = $notif->payment_type;
            $orderId = $notif->order_id;
            $fraud = $notif->fraud_status;

            Log::info("Processing Order ID: $orderId | Status: $transaction");

            // 3. Cari Data Payment
            $payment = Payment::where('order_id', $orderId)->first();

            if (!$payment) {
                Log::error("Payment not found for Order ID: $orderId");
                return response()->json(['message' => 'Payment not found'], 404);
            }

            // 4. Update Status Database
            if ($transaction == 'capture') {
                if ($fraud == 'challenge') {
                    $payment->update(['status' => 'pending']);
                } else {
                    $this->markAsPaid($payment, $type);
                }
            } else if ($transaction == 'settlement') {
                $this->markAsPaid($payment, $type);
            } else if ($transaction == 'pending') {
                $payment->update(['status' => 'pending']);
            } else if ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
                $payment->update(['status' => 'failed']);
            }

            return response()->json(['message' => 'Webhook processed']);

        } catch (\Exception $e) {
            Log::error('Webhook Error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    // Fungsi Helper untuk update status jadi PAID
    private function markAsPaid($payment, $paymentType)
    {
        // Update tabel Payment
        $payment->update([
            'status' => 'paid',
            'payment_date' => now(),
            'payment_method' => $paymentType
        ]);

        // Update tabel Billing terkait
        // Load relasi details jika belum ada
        $payment->load('details');

        $billingIds = $payment->details->pluck('billing_id');

        if ($billingIds->isNotEmpty()) {
            Billing::whereIn('billing_id', $billingIds)->update([
                'status' => 'paid'
            ]);
            Log::info("Billings updated to PAID: " . json_encode($billingIds));
        }
    }
}
