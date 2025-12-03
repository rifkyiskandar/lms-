<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // <-- Import Rule

class FacultyController extends Controller
{
    /**
     * Menampilkan daftar fakultas (sudah ada)
     */
    public function index(Request $request)
    {
        $faculties = Faculty::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('faculty_name', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Faculties/Index', [
            'faculties' => $faculties,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Menyimpan fakultas baru (sudah ada)
     */
    public function store(Request $request)
    {
        $request->validate([
            'faculty_name' => 'required|string|max:255|unique:faculties',
        ]);

        Faculty::create($request->all());

        return to_route('admin.faculties.index');
    }

    /**
     * --- BARU ---
     * Menampilkan halaman form edit.
     */
    public function edit(Faculty $faculty)
    {
        return Inertia::render('Admin/Faculties/Edit', [
            'faculty' => $faculty
        ]);
    }

    /**
     * --- BARU ---
     * Menyimpan perubahan dari form edit.
     */
    public function update(Request $request, Faculty $faculty)
    {
        $request->validate([
            'faculty_name' => [
                'required', 'string', 'max:255',
                // Pastikan nama unik, kecuali untuk ID fakultas ini sendiri
                Rule::unique('faculties')->ignore($faculty->faculty_id, 'faculty_id')
            ]
        ]);

        $faculty->update($request->all());

        return to_route('admin.faculties.index');
    }

    /**
     * --- BARU ---
     * Menghapus fakultas.
     */
    public function destroy(Faculty $faculty)
    {
        // Validasi Keamanan: Cek apakah fakultas ini masih punya anak (Jurusan/Dosen)
        if ($faculty->majors()->exists() || $faculty->lecturerProfiles()->exists()) {
            return back()->withErrors([
                'error' => 'Cannot delete faculty. It is still associated with majors or lecturers.'
            ]);
        }

        $faculty->delete();

        return to_route('admin.faculties.index');
    }
}
