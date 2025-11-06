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
        Schema::create('course_classes', function (Blueprint $table) {
            $table->id('class_id');
            $table->foreignId('course_id')->constrained('courses', 'course_id');
            $table->foreignId('lecturer_id')->constrained('users', 'user_id');
            $table->string('course_code');
            $table->string('semester');
            $table->integer('year');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('room');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_classes');
    }
};
