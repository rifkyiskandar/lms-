<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\Faculty; // <-- Butuh ini untuk form
use Illuminate\Http\Request;
use Inertia\Inertia;

class MajorController extends Controller
{
    /**
     * Menampilkan daftar jurusan dengan pencarian.
     */
    public function index(Request $request)
    {
        $majors = Major::query()
            ->with('faculty') // Ambil data relasi (efisien!)
            ->when($request->input('search'), function ($query, $search) {
                // Cari di nama jurusan ATAU nama fakultas
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
     * Menampilkan form untuk membuat jurusan baru.
     */
    public function create()
    {
        return Inertia::render('Admin/Majors/Create', [
            // Kirim semua data fakultas untuk dropdown
            'faculties' => Faculty::all(['faculty_id', 'faculty_name'])
        ]);
    }

    /**
     * Menyimpan jurusan baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'major_name' => 'required|string|max:255',
            'faculty_id' => 'required|exists:faculties,faculty_id'
        ]);

        Major::create($request->all());

        return to_route('admin.majors.index');
    }
}

