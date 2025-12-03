<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    use HasFactory;

    // Tentukan nama tabelnya secara eksplisit
    protected $table = 'student_profiles';

    // Tentukan Primary Key kustom Anda (karena ini juga FK)
    protected $primaryKey = 'user_id';
    public $incrementing = false; // Karena ini bukan auto-increment

    // Kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'student_number',
        'faculty_id',
        'major_id',
        'semester_id',
        'batch_year',
        'birth_date',
        'address',
        'gpa',
    ];

    // Definisikan relasi sebaliknya (Profil ini milik User)
    public function user(): BelongsTo // <-- Perbarui tipe
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // --- TAMBAHKAN FUNGSI RELASI INI ---
    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class, 'major_id', 'major_id');
    }
}
