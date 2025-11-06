<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Kita bisa nonaktifkan ini dulu
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Tentukan primary key kustom Anda.
     */
    protected $primaryKey = 'user_id';

    /**
     * Atribut yang bisa diisi.
     * Ganti 'name' bawaan Breeze dengan 'full_name'.
     */
    protected $fillable = [
        'full_name', // <-- Ganti 'name'
        'email',
        'password_hash', // <-- Tambahkan ini
        'role_id',
        'phone_number',
    ];

    /**
     * Atribut yang disembunyikan.
     * Ganti 'password' bawaan Breeze dengan 'password_hash'.
     */
    protected $hidden = [
        'password_hash', // <-- Ganti 'password'
        'remember_token',
    ];

    /**
     * Beri tahu Laravel di mana menemukan HASH PASSWORD Anda.
     * Ini adalah bagian krusial agar login berfungsi.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Ganti nama kolom 'password' bawaan Breeze.
     */
    public function getAuthPasswordName()
    {
        return 'password_hash';
    }

    /**
     * Mendapatkan profil mahasiswa yang terkait dengan user.
     */
    public function studentProfile(): HasOne
    {
        // User "memiliki satu" StudentProfile
        // 'user_id' adalah Foreign Key di tabel student_profiles
        // 'user_id' adalah Local Key di tabel users
        return $this->hasOne(StudentProfile::class, 'user_id', 'user_id');
    }

    /**
     * Mendapatkan profil dosen yang terkait dengan user.
     */
    public function lecturerProfile(): HasOne
    {
        // User "memiliki satu" LecturerProfile
        return $this->hasOne(LecturerProfile::class, 'user_id', 'user_id');
    }
}
