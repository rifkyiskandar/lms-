<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $primaryKey = 'room_id';

    protected $fillable = [
        'room_name',
        'building',
        'capacity',
    ];

    // Jika Anda ingin relasi ke kelas (untuk validasi hapus nanti)
    // public function classes() {
    //    return $this->hasMany(CourseClass::class, 'room_id');
    // }
}
