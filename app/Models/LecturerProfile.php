<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
