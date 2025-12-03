<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule; // <-- Jangan lupa import Rule

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $rooms = Room::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('room_name', 'like', "%{$search}%")
                      ->orWhere('building', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms,
            'filters' => $request->only('search')
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Rooms/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_name' => 'required|string|max:255|unique:rooms,room_name',
            'building' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        Room::create($request->all());

        return to_route('admin.rooms.index');
    }

    public function edit(Room $room)
    {
        return Inertia::render('Admin/Rooms/Edit', [
            'room' => $room
        ]);
    }

    public function update(Request $request, Room $room)
    {
        $request->validate([
            'room_name' => [
                'required', 'string', 'max:255',
                // Validasi unik kecuali untuk ruangan ini sendiri
                Rule::unique('rooms', 'room_name')->ignore($room->room_id, 'room_id')
            ],
            'building' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
        ]);

        $room->update($request->all());

        return to_route('admin.rooms.index');
    }

    public function destroy(Room $room)
    {
        // Optional: Cek apakah ruangan dipakai di jadwal kelas sebelum hapus
        // if ($room->classes()->exists()) { return back()->withErrors(...); }

        $room->delete();
        return to_route('admin.rooms.index');
    }
}
