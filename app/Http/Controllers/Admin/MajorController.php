<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // <-- Jangan lupa import ini

class MajorController extends Controller
{
    /**
     * Menampilkan daftar jurusan.
     */
    public function index(Request $request)
    {
        $majors = Major::query()
            ->with('faculty') // Eager load relasi faculty
            ->when($request->input('search'), function ($query, $search) {
                $query->where('major_name', 'like', "%{$search}%")
                      ->orWhereHas('faculty', function ($q) use ($search) {
                          $q->where('faculty_name', 'like', "%{$search}%");
                      });
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Majors/Index', [
            'majors' => $majors,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Menampilkan form tambah jurusan.
     */
    public function create()
    {
        return Inertia::render('Admin/Majors/Create', [
            'faculties' => Faculty::all(['faculty_id', 'faculty_name'])
        ]);
    }

    /**
     * Menyimpan jurusan baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'major_name' => 'required|string|max:255|unique:majors',
            'faculty_id' => 'required|exists:faculties,faculty_id'
        ]);

        Major::create($request->all());

        return to_route('admin.majors.index');
    }

    /**
     * --- BARU ---
     * Menampilkan form edit jurusan.
     */
    public function edit(Major $major)
    {
        return Inertia::render('Admin/Majors/Edit', [
            'major' => $major,
            // Kirim data fakultas untuk dropdown
            'faculties' => Faculty::all(['faculty_id', 'faculty_name'])
        ]);
    }

    /**
     * --- BARU ---
     * Menyimpan perubahan jurusan.
     */
    public function update(Request $request, Major $major)
    {
        $request->validate([
            'major_name' => [
                'required', 'string', 'max:255',
                // Unik, kecuali untuk ID jurusan ini sendiri
                Rule::unique('majors')->ignore($major->major_id, 'major_id')
            ],
            'faculty_id' => 'required|exists:faculties,faculty_id'
        ]);

        $major->update($request->all());

        return to_route('admin.majors.index');
    }

    /**
     * --- BARU ---
     * Menghapus jurusan.
     */
    public function destroy(Major $major)
    {
        // Opsional: Cek apakah ada mahasiswa di jurusan ini sebelum hapus
        // if ($major->students()->exists()) { ... }

        $major->delete();

        return to_route('admin.majors.index');
    }
}
