<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    use HasFactory;

    // Tentukan Primary Key kustom Anda
    protected $primaryKey = 'major_id';

    // Kolom yang boleh diisi
    protected $fillable = ['major_name', 'faculty_id'];

    // Definisikan relasi "belongsTo" (Jurusan ini milik Fakultas)
    public function faculty()
    {
        // Relasi ke model Faculty, menggunakan faculty_id
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
