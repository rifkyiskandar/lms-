<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Import Inertia

class DashboardController extends Controller
{
    public function index()
    {
        // Ini akan merender file React Anda di:
        // resources/js/Pages/Admin/Dashboard.jsx
        return Inertia::render('Admin/Dashboard');
    }
}
