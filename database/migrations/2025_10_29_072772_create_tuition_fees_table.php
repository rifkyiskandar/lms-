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
        Schema::create('tuition_fees', function (Blueprint $table) {
            $table->id('tuition_fee_id');
            $table->foreignId('cost_component_id')->constrained('cost_components', 'cost_component_id');
            $table->foreignId('faculty_id')->nullable()->constrained('faculties', 'faculty_id');
            $table->foreignId('major_id')->nullable()->constrained('majors', 'major_id');
            $table->foreignId('course_id')->nullable()->constrained('courses', 'course_id');
            $table->string('academic_year');
            $table->decimal('amount', 13, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuition_fees');
    }
};
