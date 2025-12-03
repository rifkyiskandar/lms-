<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::query()
            ->with(['faculty', 'major'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('course_name', 'like', "%{$search}%")
                      ->orWhere('course_code', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Create', [
            'faculties' => Faculty::all(['faculty_id', 'faculty_name']),
            'majors' => Major::all(['major_id', 'major_name']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_code' => 'required|string|unique:courses|max:20',
            'course_name' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:6',
            'faculty_id' => 'required|exists:faculties,faculty_id',
            'major_id' => 'required|exists:majors,major_id',
            'category' => 'required|in:MKU,MKW,MKP,LAINNYA', // Sesuaikan enum Anda
            'description' => 'nullable|string',
        ]);

        Course::create($request->all());

        return to_route('admin.courses.index');
    }

    public function edit(Course $course)
    {
        return Inertia::render('Admin/Courses/Edit', [
            'course' => $course,
            'faculties' => Faculty::all(['faculty_id', 'faculty_name']),
            'majors' => Major::all(['major_id', 'major_name']),
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $request->validate([
            'course_code' => ['required', 'string', 'max:20', Rule::unique('courses')->ignore($course->course_id, 'course_id')],
            'course_name' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:6',
            'faculty_id' => 'required|exists:faculties,faculty_id',
            'major_id' => 'required|exists:majors,major_id',
            'category' => 'required|in:MKU,MKW,MKP,LAINNYA',
            'description' => 'nullable|string',
        ]);

        $course->update($request->all());

        return to_route('admin.courses.index');
    }

    public function destroy(Course $course)
    {
        $course->delete();
        return to_route('admin.courses.index');
    }
}
