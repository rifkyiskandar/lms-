<?php

    namespace App\Http\Controllers\Admin;

    use App\Http\Controllers\Controller;
    use App\Models\User;
    use App\Models\Faculty;
    use App\Models\Major;
    use App\Models\Semester;
    use App\Models\StudentProfile; // <-- Import
    use App\Models\LecturerProfile; // <-- Import
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Hash;
    use Inertia\Inertia;
    use Illuminate\Validation\Rules;

    class UserController extends Controller
    {
        /**
        * Menampilkan daftar user (student, lecturer, admin)
        * PERUBAHAN: Menambahkan eager loading 'with(...)'
        */
        public function index(Request $request)
        {
            $filters = $request->only('search', 'role');
            $roleId = $request->input('role', 3); // Default ke Student (role_id = 3)

            $users = User::query()
                ->where('role_id', $roleId)
                // MEMUAT DATA RELASI (PROFIL, JURUSAN, FAKULTAS)
                ->with([
                    'studentProfile.major',
                    'lecturerProfile.faculty'
                ])
                ->when($request->input('search'), function ($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('Admin/Users/Index', [
                'users' => $users,
                'filters' => $filters,
                'faculties' => Faculty::all(['faculty_id', 'faculty_name']),
                'majors' => Major::all(['major_id', 'major_name']),
                'semesters' => Semester::all(['semester_id', 'semester_name']),
            ]);
        }

        /**
        * Menyimpan user baru (Student, Lecturer, atau Admin).
        * PERUBAHAN: Logika pembuatan NIM/NIDN otomatis
        */
        public function store(Request $request)
        {
            // Validasi data user dasar
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role_id' => 'required|integer|in:1,2,3',
            ]);

            // Buat User
            $user = User::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
                'role_id' => $request->role_id,
                'phone_number' => $request->phone_number,
            ]);

            // Jika rolenya adalah Student (3)
            if ($request->role_id == 3) {
                $request->validate([
                    'faculty_id' => 'required|exists:faculties,faculty_id',
                    'major_id' => 'required|exists:majors,major_id',
                    'semester_id' => 'required|exists:semesters,semester_id',
                    'batch_year' => 'required|integer|digits:4',
                ]);

                // --- LOGIKA GENERATE NIM OTOMATIS ---
                // 1. Hitung jumlah mahasiswa di angkatan yang sama
                $runningNumber = StudentProfile::where('batch_year', $request->batch_year)->count() + 1;
                // 2. Format running number (misal: 0001)
                $formattedRunningNumber = str_pad($runningNumber, 4, '0', STR_PAD_LEFT);
                // 3. Gabungkan (misal: 20240001)
                $generatedNIM = $request->batch_year . $formattedRunningNumber;
                // ------------------------------------

                $user->studentProfile()->create([
                    'student_number' => $generatedNIM, // <-- Gunakan NIM yang digenerate
                    'faculty_id' => $request->faculty_id,
                    'major_id' => $request->major_id,
                    'semester_id' => $request->semester_id,
                    'batch_year' => $request->batch_year,
                ]);
            }

            // Jika rolenya adalah Lecturer (2)
            if ($request->role_id == 2) {
                $request->validate([
                    'faculty_id' => 'required|exists:faculties,faculty_id',
                ]);

                // --- LOGIKA GENERATE NIDN OTOMATIS (CONTOH) ---
                $runningNumber = LecturerProfile::count() + 1;
                $generatedNIDN = 'D' . str_pad($runningNumber, 6, '0', STR_PAD_LEFT);
                // ------------------------------------------

                $user->lecturerProfile()->create([
                    'lecturer_number' => $generatedNIDN, // <-- Gunakan NIDN yang digenerate
                    'faculty_id' => $request->faculty_id,
                    'title' => $request->title,
                    'position' => $request->position,
                ]);
            }

            return to_route('admin.users.index');
        }

        /**
        * Menampilkan form untuk mengedit user.
        */
        public function edit(User $user)
        {
            // Load relasi agar bisa ditampilkan di form edit
            $user->load(['studentProfile', 'lecturerProfile']);

            return Inertia::render('Admin/Users/Edit', [
                'user' => $user,
                'faculties' => Faculty::all(['faculty_id', 'faculty_name']),
                'majors' => Major::all(['major_id', 'major_name']),
                'semesters' => Semester::all(['semester_id', 'semester_name']),
            ]);
        }

        /**
        * Menyimpan perubahan data user.
        */
        public function update(Request $request, User $user)
        {
            // Validasi data user dasar
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->user_id . ',user_id', // Abaikan email user ini sendiri
                'role_id' => 'required|integer|in:1,2,3',
            ]);

            // Update data user
            $user->update($request->only(['full_name', 'email', 'role_id', 'phone_number']));

            // Jika user adalah Student
            if ($user->role_id == 3) {
                $request->validate([
                    'student_number' => 'required|string|unique:student_profiles,student_number,' . $user->user_id . ',user_id', // Abaikan NIM user ini sendiri
                    'faculty_id' => 'required|exists:faculties,faculty_id',
                    'major_id' => 'required|exists:majors,major_id',
                    'semester_id' => 'required|exists:semesters,semester_id',
                    'batch_year' => 'required|integer',
                ]);
                $user->studentProfile()->update($request->only([
                    'student_number', 'faculty_id', 'major_id', 'semester_id', 'batch_year'
                ]));
            }

            // Jika user adalah Lecturer
            if ($user->role_id == 2) {
                $request->validate([
                    'lecturer_number' => 'required|string|unique:lecturer_profiles,lecturer_number,' . $user->user_id . ',user_id',
                    'faculty_id' => 'required|exists:faculties,faculty_id',
                ]);
                $user->lecturerProfile()->update($request->only([
                    'lecturer_number', 'faculty_id', 'title', 'position'
                ]));
            }

            return to_route('admin.users.index');
        }


        /**
        * Menghapus user.
        */
        public function destroy(User $user)
        {
            // Model User akan otomatis menghapus profil terkait
            // (jika Anda setup 'cascadeOnDelete()' di migrasi)
            // Jika tidak, kita hapus manual:
            if ($user->studentProfile) {
                $user->studentProfile()->delete();
            }
            if ($user->lecturerProfile) {
                $user->lecturerProfile()->delete();
            }

            $user->delete();

            return to_route('admin.users.index');
        }
    }
