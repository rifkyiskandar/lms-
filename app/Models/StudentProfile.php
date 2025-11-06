<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
