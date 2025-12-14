<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\Major;
use App\Models\Course;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    public function index(Request $request)
    {
        $selectedMajorId = $request->input('major_id');

        // MODE 1: LIST MAJORS (Belum pilih jurusan)
        if (!$selectedMajorId) {
            return Inertia::render('Admin/Curriculums/Index', [
                'view_mode' => 'list_majors',
                'majors' => Major::with('faculty')
                    ->when($request->input('search'), function($q, $search){
                        $q->where('major_name', 'like', "%{$search}%");
                    })->get(),
                'filters' => $request->only(['search']),

                // Data mass assign
                'allFaculties' => Faculty::select('faculty_id', 'faculty_name')->get(),
                'allCourses' => Course::select('course_id', 'course_name', 'course_code', 'sks')->get(),
            ]);
        }

        // MODE 2: DETAIL CURRICULUM (Sudah pilih jurusan)
        // Ambil semua kurikulum jurusan tersebut (tanpa filter tahun)
        $curriculums = Curriculum::with('course')
            ->where('major_id', $selectedMajorId)
            ->orderBy('semester')
            ->get();

        $selectedMajor = Major::with('faculty')->find($selectedMajorId);

        $courses = Course::select('course_id', 'course_name', 'course_code', 'sks')->get();

        return Inertia::render('Admin/Curriculums/Index', [
            'view_mode' => 'detail_curriculum',
            'curriculums' => $curriculums,
            'selected_major' => $selectedMajor,
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'major_id'      => 'required_without:assign_to_all',
            'course_id'     => 'required|exists:courses,course_id',
            'semester'      => 'required|integer|min:1|max:8',
            // HAPUS academic_year
            'category'      => 'required|in:MKU,WAJIB_PRODI,WAJIB_FAKULTAS,PILIHAN',

            'scope'         => 'nullable|in:university,faculty',
            'target_faculty_id' => 'required_if:scope,faculty',
        ]);

        if ($request->scope) {
            // --- MASS ASSIGNMENT ---
            $query = Major::query();
            if ($request->scope === 'faculty') {
                $query->where('faculty_id', $request->target_faculty_id);
            }
            $majors = $query->get();
            $count = 0;

            foreach ($majors as $major) {
                Curriculum::updateOrCreate(
                    [
                        'major_id'  => $major->major_id,
                        'course_id' => $request->course_id,
                    ],
                    [
                        'semester' => $request->semester,
                        'category' => $request->category
                    ]
                );
                $count++;
            }
            return back()->with('success', "Course assigned to {$count} majors.");

        } else {
            // --- SINGLE ASSIGNMENT ---
            Curriculum::updateOrCreate(
                [
                    'major_id'  => $request->major_id,
                    'course_id' => $request->course_id,
                ],
                [
                    'semester' => $request->semester,
                    'category' => $request->category
                ]
            );
            return back()->with('success', 'Course added to curriculum.');
        }
    }

    public function destroy($id)
    {
        Curriculum::destroy($id);
        return back()->with('success', 'Course removed from curriculum.');
    }
}
