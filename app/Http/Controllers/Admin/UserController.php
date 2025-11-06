<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Faculty;
use App\Models\Major;
use App\Models\Semester; // <-- Saya tambahkan ini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;


class UserController extends Controller
{
    /**
     * Menampilkan daftar user (student, lecturer, admin)
     */
    public function index(Request $request)
    {
        $filters = $request->only('search', 'role');

        // Default filter role ke student (asumsi role_id = 3) jika tidak ada
        // Nanti kita akan buat 1=Admin, 2=Lecturer, 3=Student
        $roleId = $request->input('role', 3);

        $users = User::query()
            ->where('role_id', $roleId) // Filter berdasarkan role
            ->when($request->input('search'), function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            // Kirim data ini untuk mengisi dropdown di form "Add User"
            'faculties' => Faculty::all(['faculty_id', 'faculty_name']),
            'majors' => Major::all(['major_id', 'major_name']),
            'semesters' => Semester::all(['semester_id', 'semester_name']), // <-- Kirim data semester
        ]);
    }

    /**
     * Menyimpan user baru (Student, Lecturer, atau Admin).
     */
    public function store(Request $request)
    {
        // Validasi data user dasar
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password_hash' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|integer|in:1,2,3', // 1=Admin, 2=Lecturer, 3=Student
        ]);

        // Buat User
        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password_hash),
            'role_id' => $request->role_id,
            'phone_number' => $request->phone_number,
        ]);

        // Jika rolenya adalah Student (3)
        if ($request->role_id == 3) {
            $request->validate([
                'student_number' => 'required|string|unique:student_profiles',
                'faculty_id' => 'required|exists:faculties,faculty_id',
                'major_id' => 'required|exists:majors,major_id',
                'semester_id' => 'required|exists:semesters,semester_id',
                'batch_year' => 'required|integer',
            ]);

            // Buat profil student yang terhubung
            $user->studentProfile()->create([
                'student_number' => $request->student_number,
                'faculty_id' => $request->faculty_id,
                'major_id' => $request->major_id,
                'semester_id' => $request->semester_id,
                'batch_year' => $request->batch_year,
            ]);
        }

        // Jika rolenya adalah Lecturer (2)
        if ($request->role_id == 2) {
             $request->validate([
                'lecturer_number' => 'required|string|unique:lecturer_profiles',
                'faculty_id' => 'required|exists:faculties,faculty_id',
            ]);

            // Buat profil lecturer yang terhubung
            $user->lecturerProfile()->create([
                'lecturer_number' => $request->lecturer_number,
                'faculty_id' => $request->faculty_id,
                'title' => $request->title,
                'position' => $request->position,
            ]);
        }

        return to_route('admin.users.index');
    }
}

