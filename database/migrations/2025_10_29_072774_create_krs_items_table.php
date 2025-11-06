
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
        Schema::create('krs_items', function (Blueprint $table) {
            $table->id('krs_item_id');
            $table->foreignId('krs_id')
                  ->constrained('krs_submissions', 'krs_id')
                  ->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('course_classes', 'class_id');
            $table->integer('sks');
            $table->enum('status', ['draft', 'final'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('krs_items');
    }
};
