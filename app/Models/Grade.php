<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    // Karena di migration Anda menulis $table->id('grade_id');
    protected $primaryKey = 'grade_id';

    protected $fillable = [
        'student_id',
        'course_id',
        'semester_id',
        'score',        // Nilai Angka (0-100)
        'grade_char',   // Nilai Huruf (A, B, C)
        'grade_point',  // Bobot (4.00)
        'is_passed',    // Status Lulus/Tidak
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'grade_point' => 'decimal:2',
        'score' => 'decimal:2',
    ];

    // --- RELASI ---

    // Nilai milik siapa?
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'user_id');
    }

    // Nilai mata kuliah apa?
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    // Nilai ini didapat di semester berapa?
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'semester_id', 'semester_id');
    }
}
