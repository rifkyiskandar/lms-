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
        Schema::create('krs_submissions', function (Blueprint $table) {
            $table->id('krs_id'); 
            $table->foreignId('student_id')->constrained('users', 'user_id');
            $table->foreignId('semester_id')->constrained('semesters', 'semester_id');
            $table->dateTime('submitted_at')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected'])->default('draft');
            $table->integer('total_sks')->default(0);
            $table->decimal('total_fee', 10, 2)->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('krs_submissions');
    }
};
