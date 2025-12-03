<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Curriculum extends Model
{
    use HasFactory;

    protected $table = 'curriculums';
    protected $primaryKey = 'curriculum_id';

    protected $fillable = [
        'major_id',
        'course_id',
        'semester', // Ini tingkatan (1, 2, 3...)
        'category', // WAJIB, PILIHAN, dll
        'academic_year', // Versi kurikulum (2024, 2025)
    ];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class, 'major_id', 'major_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
