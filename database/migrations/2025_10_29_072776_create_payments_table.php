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
            $table->foreignId('student_id')->constrained('users', 'user_id');
            $table->foreignId('billing_id')->constrained('billings', 'billing_id');
            $table->foreignId('verified_by')
                  ->nullable()
                  ->constrained('users', 'user_id');
            $table->dateTime('payment_date');
            $table->decimal('total_amount', 10, 2);
            $table->string('proof_url');
            $table->dateTime('verified_at')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('note')->nullable();
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
