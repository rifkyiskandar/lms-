<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // <-- Penting

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'full_name' => 'Admin User',
            'email' => 'admin@lms.com',
            'password_hash' => Hash::make('password'), // <-- Menggunakan Hash
            'role_id' => 1, // Asumsi 1 = Admin
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
