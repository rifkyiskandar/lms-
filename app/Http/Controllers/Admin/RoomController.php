<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil List Floor UNIK dari Database
        // Ini membuat dropdown "Floor" di React jadi dinamis mengikuti data yang ada
        $existingFloors = Room::select('floor')
            ->distinct()
            ->orderBy('floor')
            ->pluck('floor');

        // 2. Ambil List Building UNIK
        $buildings = Room::select('building')->distinct()->orderBy('building')->pluck('building');

        // 3. Query Utama
        $rooms = Room::query()
            ->when($request->search, function ($query, $search) {
                $query->where('room_name', 'like', "%{$search}%")
                      ->orWhere('building', 'like', "%{$search}%");
            })
            // Filter tambahan buat dropdown building
            ->when($request->building, function ($query, $building) {
                $query->where('building', $building);
            })
            ->orderBy('building')
            ->orderBy('floor') // Urutkan juga berdasarkan lantai
            ->orderBy('room_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms,
            'existingBuildings' => $buildings,
            'existingFloors' => $existingFloors, // Kirim ke React
            'filters' => $request->only(['search', 'building']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_name' => 'required|string|max:255',
            'building'  => 'required|string|max:255',
            'floor'     => 'required|string|max:20', // Validasi floor
            'capacity'  => 'required|integer|min:1',
        ]);

        // Cek duplikat manual: Tidak boleh ada nama ruangan yang sama di gedung yang sama
        $exists = Room::where('building', $request->building)
                      ->where('room_name', $request->room_name)
                      ->exists();

        if ($exists) {
            return back()->withErrors(['room_name' => "Room {$request->room_name} already exists in {$request->building}."]);
        }

        Room::create($request->all());

        return to_route('admin.rooms.index')->with('success', 'Room created successfully.');
    }

    public function update(Request $request, Room $room)
    {
        $request->validate([
            'room_name' => 'required|string|max:255',
            'building'  => 'required|string|max:255',
            'floor'     => 'required|string|max:20',
            'capacity'  => 'required|integer|min:1',
        ]);

        // Cek duplikat saat edit (kecuali diri sendiri)
        $exists = Room::where('building', $request->building)
                      ->where('room_name', $request->room_name)
                      ->where('room_id', '!=', $room->room_id)
                      ->exists();

        if ($exists) {
            return back()->withErrors(['room_name' => "Room {$request->room_name} already exists in {$request->building}."]);
        }

        $room->update($request->all());

        return to_route('admin.rooms.index')->with('success', 'Room updated successfully.');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return to_route('admin.rooms.index')->with('success', 'Room deleted successfully.');
    }
}
