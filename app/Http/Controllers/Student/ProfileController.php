<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; // <-- PENTING: Tambahkan ini
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\Grade;
use App\Models\User;

class ProfileController extends Controller
{
    public function edit()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->load(['studentProfile.major.faculty', 'studentProfile.semester', 'profileInfo']);

        $grades = Grade::with('course')
            ->where('student_id', $user->user_id)
            ->orderBy('semester_id', 'desc')
            ->get()
            ->map(function ($grade) {
                return [
                    'semester' => $grade->semester_id,
                    'code' => $grade->course->course_code,
                    'name' => $grade->course->course_name,
                    'sks' => $grade->course->sks,
                    'grade' => $grade->grade_char,
                ];
            });

        return Inertia::render('Student/Profile/Edit', [
            'profile' => [
                'fullName' => $user->full_name,
                'email' => $user->email,
                'nim' => $user->studentProfile?->student_number ?? '-',
                'faculty' => $user->studentProfile?->faculty?->faculty_name ?? '-',
                'major' => $user->studentProfile?->major?->major_name ?? '-',
                'semester' => $user->studentProfile?->current_semester_level ?? 1,
                'batchYear' => $user->studentProfile?->batch_year ?? '-',
                'gpa' => $user->studentProfile?->gpa ?? 0.00,
                'phone' => $user->phone_number,
                'birthDate' => $user->birth_date,
                'address' => $user->address,
                'photo' => $user->profile_picture,
                'nickname' => $user->profileInfo->nickname ?? '',
                'dreamJob' => $user->profileInfo->dream_job ?? '',
                'goals' => $user->profileInfo->goals ?? '',
                'quote' => $user->profileInfo->quote ?? '',
            ],
            'grades' => $grades,
        ]);
    }

    // Update Data Pribadi, Tentang Saya, DAN Foto Profil
    public function update(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 1. Validasi
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'nickname' => 'nullable|string|max:50',
            'dreamJob' => 'nullable|string|max:100',
            'goals' => 'nullable|string',
            'quote' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // 2. LOGIC UPLOAD FOTO
        if ($request->hasFile('profile_picture')) {
            // Hapus foto lama
            if ($user->profile_picture) {
                $oldPath = str_replace('/storage/', '', $user->profile_picture);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Simpan foto baru
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');

            // Update kolom di DB
            $user->update(['profile_picture' => '/storage/' . $path]);

            // HAPUS "return back()" DISINI AGAR KODE LANJUT KE BAWAH
        }

        // 3. Logic Update Data Teks
        if ($request->has('phone')) {
            $user->update(['phone_number' => $request->input('phone')]);
        }

        // 4. Update Profile Info
        $user->profileInfo()->updateOrCreate(
            ['user_id' => $user->user_id],
            [
                'nickname' => $request->input('nickname'),
                'dream_job' => $request->input('dreamJob'),
                'goals' => $request->input('goals'),
                'quote' => $request->input('quote'),
            ]
        );

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->update([
            'password_hash' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
