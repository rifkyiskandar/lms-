<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemesterController extends Controller
{
    /**
     * FITUR 4 & 3: Menampilkan data (Read) dan Search data
     */
    public function index(Request $request)
    {
        $semesters = Semester::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('semester_name', 'like', "%{$search}%")
                      ->orWhere('academic_year', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Semesters/Index', [
            'semesters' => $semesters,
            'filters' => $request->only('search')
        ]);
    }

    /**
     * FITUR 1: Menambahkan data (Create)
     * Logika semester_name otomatis ada di sini.
     */
    public function store(Request $request)
    {
        // PERUBAHAN 1: Validasi semester_name dihapus
        $validatedData = $request->validate([
            'academic_year' => 'required|string|max:255',
            'term' => 'required|in:Ganjil,Genap,Pendek',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // PERUBAHAN 2: Buat semester_name secara otomatis
        $validatedData['semester_name'] = $validatedData['term'] . ' ' . $validatedData['academic_year'];

        // Logika untuk 'is_active' (sudah benar)
        if ($validatedData['is_active']) {
            Semester::query()->update(['is_active' => false]);
        }

        Semester::create($validatedData);

        return to_route('admin.semesters.index');
    }

    /**
     * FITUR 5 (Bagian 1): Menampilkan halaman Edit data
     * * @param  \App\Models\Semester  $semester
     * @return \Inertia\Response
     */
    public function edit(Semester $semester)
    {
        // Route-Model Binding akan otomatis mencari Semester berdasarkan ID
        return Inertia::render('Admin/Semesters/Edit', [
            'semester' => $semester
        ]);
    }

    /**
     * FITUR 5 (Bagian 2): Menyimpan perubahan (Update) data
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Semester $semester)
    {
        // Validasi lagi, sama seperti store
        $validatedData = $request->validate([
            'academic_year' => 'required|string|max:255',
            'term' => 'required|in:Ganjil,Genap,Pendek',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // Buat ulang semester_name otomatis
        $validatedData['semester_name'] = $validatedData['term'] . ' ' . $validatedData['academic_year'];

        // Logika 'is_active' (sedikit berbeda untuk update)
        if ($validatedData['is_active']) {
            // Nonaktifkan semua semester LAIN
            Semester::query()->where('semester_id', '!=', $semester->semester_id)->update(['is_active' => false]);
        }

        $semester->update($validatedData);

        return to_route('admin.semesters.index');
    }

    /**
     * FITUR 2: Delete data
     *
     * @param  \App\Models\Semester  $semester
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Semester $semester)
    {
        // 1. Cek apakah ada profil mahasiswa yang masih terikat
        if ($semester->studentProfiles()->exists()) {
            // 2. Jika ada, kembalikan dengan pesan error
            return back()->withErrors([
                'error' => 'Cannot delete this semester because it is still assigned to one or more students.'
            ]);
        }

        // 3. Jika aman, baru hapus
        $semester->delete();

        return to_route('admin.semesters.index');
    }
}
