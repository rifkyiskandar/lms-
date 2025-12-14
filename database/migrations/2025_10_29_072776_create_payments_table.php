<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');

            // Relasi ke Mahasiswa
            $table->foreignId('student_id')->constrained('users', 'user_id')->cascadeOnDelete();

            

            // --- KOLOM KHUSUS MIDTRANS ---
            $table->string('order_id')->unique(); // ID unik pesanan (wajib untuk Midtrans), misal: PAY-20241205-001
            $table->string('snap_token')->nullable(); // Token untuk memunculkan popup pembayaran
            $table->string('payment_method')->nullable(); // BCA, GOPAY, ALFAMART (diisi setelah callback)
            $table->json('midtrans_response')->nullable(); // Simpan seluruh respon JSON dari Midtrans (buat debugging)

            // Data Transaksi
            $table->decimal('total_amount', 12, 2); // Total yang harus dibayar (gunakan 12,2 untuk aman sampai miliaran)
            $table->timestamp('payment_date')->nullable(); // Waktu pembayaran BERHASIL (Settlement)


            $table->enum('status', ['pending', 'paid', 'expired', 'failed'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
