<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; 

class LecturerProfile extends Model
{
    use HasFactory;

    protected $table = 'lecturer_profiles';
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'lecturer_number',
        'faculty_id',
        'title',
        'position',
        'office_room',
        'address',
    ];

    // Definisikan relasi sebaliknya
    public function user(): BelongsTo // <-- Perbarui tipe
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // --- TAMBAHKAN FUNGSI RELASI INI ---
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'faculty_id', 'faculty_id');
    }


}
