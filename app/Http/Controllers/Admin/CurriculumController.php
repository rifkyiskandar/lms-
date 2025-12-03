<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curriculum;
use App\Models\Major;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    public function index(Request $request)
    {
        $selectedMajorId = $request->input('major_id');
        $selectedYear = $request->input('academic_year', date('Y'));

        if (!$selectedMajorId) {
            return Inertia::render('Admin/Curriculums/Index', [
                'majors' => Major::with('faculty')
                    ->when($request->input('search'), function($q, $search){
                        $q->where('major_name', 'like', "%{$search}%");
                    })->get(),
                'academic_year' => $selectedYear,
                'view_mode' => 'list_majors'
            ]);
        }

        $curriculums = Curriculum::with('course')
            ->where('major_id', $selectedMajorId)
            ->where('academic_year', $selectedYear)
            ->orderBy('semester')
            ->get()
            ->groupBy('semester');

        $selectedMajor = Major::with('faculty')->find($selectedMajorId);

        return Inertia::render('Admin/Curriculums/Index', [
            'grouped_curriculums' => $curriculums,
            'selected_major' => $selectedMajor,
            'academic_year' => $selectedYear,
            'view_mode' => 'detail_curriculum',
            'courses' => Course::all(['course_id', 'course_name', 'course_code', 'sks']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'major_id' => 'required_without:assign_to_all',
            'course_id' => 'required|exists:courses,course_id',
            'semester' => 'required|integer|min:1|max:8',
            'academic_year' => 'required|integer',
            'category' => 'required|in:WAJIB,PILIHAN,WAJIB_FAKULTAS',
            'assign_to_all' => 'boolean'
        ]);

        if ($request->assign_to_all) {
            $allMajors = Major::all();
            foreach ($allMajors as $major) {
                Curriculum::updateOrCreate(
                    [
                        'major_id' => $major->major_id,
                        'course_id' => $request->course_id,
                        'academic_year' => $request->academic_year,
                    ],
                    [
                        'semester' => $request->semester,
                        'category' => $request->category
                    ]
                );
            }
        } else {
            Curriculum::updateOrCreate(
                [
                    'major_id' => $request->major_id,
                    'course_id' => $request->course_id,
                    'academic_year' => $request->academic_year,
                ],
                [
                    'semester' => $request->semester,
                    'category' => $request->category
                ]
            );
        }

        return back();
    }

    public function destroy($id)
    {
        Curriculum::destroy($id);
        return back();
    }
}
