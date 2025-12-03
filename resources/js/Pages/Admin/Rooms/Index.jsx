import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ rooms, filters }) {
    // --- State Search ---
    const [search, setSearch] = useState(filters.search || '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.rooms.index'), { search }, { preserveState: true });
    };

    // --- Fungsi Delete ---
    const deleteRoom = (room) => {
        if (window.confirm(`Are you sure you want to delete room "${room.room_name}"?`)) {
            router.delete(route('admin.rooms.destroy', room.room_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Rooms" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Rooms</h1>
                <Link
                    href={route('admin.rooms.create')}
                    style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}
                >
                    + Add New Room
                </Link>
            </div>

            {/* --- Form Search --- */}
            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search room name or building..."
                    style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }}
                />
                <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', background: '#6b7280', color: 'white', borderRadius: '4px' }}>
                    Search
                </button>
            </form>

            {/* --- Tabel Data --- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '0.75rem' }}>Room Name</th>
                            <th style={{ padding: '0.75rem' }}>Building</th>
                            <th style={{ padding: '0.75rem' }}>Capacity</th>
                            <th style={{ padding: '0.75rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.data.map(room => (
                            <tr key={room.room_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem' }}>{room.room_name}</td>
                                <td style={{ padding: '0.75rem' }}>{room.building}</td>
                                <td style={{ padding: '0.75rem' }}>{room.capacity}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <Link
                                        href={route('admin.rooms.edit', room.room_id)}
                                        style={{ color: '#135bec', marginRight: '10px', textDecoration: 'none' }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteRoom(room)}
                                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {rooms.data.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No rooms found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={rooms.links} />
        </AdminLayout>
    );
}
