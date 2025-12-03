import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ room }) {
    const { data, setData, put, processing, errors } = useForm({
        room_name: room.room_name,
        building: room.building,
        capacity: room.capacity,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.rooms.update', room.room_id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Room: ${room.room_name}`} />

            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.rooms.index')} style={{ color: '#6b7280', textDecoration: 'none' }}>&larr; Back to Rooms</Link>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Edit Room: {room.room_name}</h1>

            <form onSubmit={submit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room Name:</label>
                    <input
                        type="text"
                        value={data.room_name}
                        onChange={e => setData('room_name', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    {errors.room_name && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.room_name}</div>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Building:</label>
                    <input
                        type="text"
                        value={data.building}
                        onChange={e => setData('building', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    {errors.building && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.building}</div>}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Capacity:</label>
                    <input
                        type="number"
                        value={data.capacity}
                        onChange={e => setData('capacity', e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    {errors.capacity && <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.capacity}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', opacity: processing ? 0.7 : 1 }}
                >
                    Update Room
                </button>
            </form>
        </AdminLayout>
    );
}

