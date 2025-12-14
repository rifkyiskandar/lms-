<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_details', function (Blueprint $table) {
            $table->id('payment_detail_id');

            // Relasi ke Header Pembayaran
            $table->foreignId('payment_id')->constrained('payments', 'payment_id')->cascadeOnDelete();

            // Relasi ke Tagihan yang dibayar
            $table->foreignId('billing_id')->constrained('billings', 'billing_id');

            // Jumlah yang dialokasikan untuk tagihan ini
            $table->decimal('amount_paid', 12, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_details');
    }
};
