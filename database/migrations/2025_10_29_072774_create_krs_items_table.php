<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('krs_items', function (Blueprint $table) {
            $table->id('krs_item_id');

            // PERBAIKAN DI SINI: constrained ke 'krs_requests'
            $table->foreignId('krs_id')
                  ->constrained('krs_requests', 'krs_id')
                  ->cascadeOnDelete();

            $table->foreignId('class_id')->constrained('course_classes', 'class_id');

            $table->integer('sks');
            $table->enum('status', ['draft', 'final', 'pending', 'approved', 'rejected'])->default('draft'); // Sesuaikan status

            $table->timestamps();

            // Mencegah duplikasi kelas yang sama di satu KRS
            $table->unique(['krs_id', 'class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('krs_items');
    }
};
