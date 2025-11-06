<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- WAJIB Import

class FacultyController extends Controller
{
    /**
     * Menampilkan daftar fakultas dengan pencarian.
     */
    public function index(Request $request)
    {
        $faculties = Faculty::query()
            // Logika pencarian
            ->when($request->input('search'), function ($query, $search) {
                $query->where('faculty_name', 'like', "%{$search}%");
            })
            ->paginate(10) // Tampilkan 10 data per halaman
            ->withQueryString(); // Agar pagination tetap membawa filter search

        return Inertia::render('Admin/Faculties/Index', [
            'faculties' => $faculties,
            // Kirim filter pencarian kembali ke view
            'filters' => $request->only('search')
        ]);
    }

    /**
     * Menyimpan fakultas baru.
     */
    public function store(Request $request)
    {
        // Validasi (Wajib sesuai spek proyek)
        $request->validate([
            'faculty_name' => 'required|string|max:255|unique:faculties',
        ]);

        Faculty::create($request->all());

        // Redirect kembali ke halaman index
        return to_route('admin.faculties.index');
    }
}

