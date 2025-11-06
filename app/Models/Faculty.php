<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    // Tentukan Primary Key kustom Anda
    protected $primaryKey = 'faculty_id';

    // Kolom yang boleh diisi
    protected $fillable = ['faculty_name'];

    /**
     * timestamps() otomatis diurus (created_at, updated_at)
     * jadi tidak perlu $timestamps = false;
     */
}
