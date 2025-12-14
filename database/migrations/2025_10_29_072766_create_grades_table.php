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
        Schema::create('grades', function (Blueprint $table) {
            $table->id('grade_id');

            // Siapa yang dapat nilai?
            $table->foreignId('student_id')->constrained('users', 'user_id')->cascadeOnDelete();

            // Mata kuliah apa?
            $table->foreignId('course_id')->constrained('courses', 'course_id')->cascadeOnDelete();

            // Di semester berapa nilai ini didapat? (PENTING untuk transkrip per semester)
            $table->foreignId('semester_id')->constrained('semesters', 'semester_id');

            // Nilai
            $table->decimal('score', 5, 2)->nullable(); // Nilai Angka (0-100), opsional
            $table->char('grade_char', 2)->nullable();  // Nilai Huruf (A, B+, C)
            $table->decimal('grade_point', 3, 2)->nullable(); // Bobot (4.00, 3.50, dst)

            // Status kelulusan (Bisa dihitung dari grade, tapi disimpan biar cepat querynya)
            $table->boolean('is_passed')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
