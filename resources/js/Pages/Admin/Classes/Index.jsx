import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ classes, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.classes.index'), { search }, { preserveState: true });
    };

    const deleteClass = (cls) => {
        if (window.confirm(`Delete schedule for ${cls.course?.course_name}?`)) {
            router.delete(route('admin.classes.destroy', cls.class_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Class Schedules" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Class Schedules</h1>
                <Link href={route('admin.classes.create')} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}>+ Create Schedule</Link>
            </div>

            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by course name..." style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', background: '#666', color: 'white', borderRadius: '4px' }}>Search</button>
            </form>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '0.5rem' }}>Course</th>
                            <th style={{ padding: '0.5rem' }}>Lecturer</th>
                            <th style={{ padding: '0.5rem' }}>Room</th>
                            <th style={{ padding: '0.5rem' }}>Semester</th>
                            <th style={{ padding: '0.5rem' }}>Schedule</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.data.map(cls => (
                            <tr key={cls.class_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    <div>{cls.course?.course_name}</div>
                                    <small style={{ color: '#666' }}>{cls.course?.course_code}</small>
                                </td>
                                <td style={{ padding: '0.5rem' }}>{cls.lecturer?.full_name}</td>
                                <td style={{ padding: '0.5rem' }}>{cls.room?.room_name}</td>
                                <td style={{ padding: '0.5rem' }}>{cls.semester?.semester_name}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <div>{new Date(cls.start_time).toLocaleDateString()}</div>
                                    <small>{new Date(cls.start_time).toLocaleTimeString()} - {new Date(cls.end_time).toLocaleTimeString()}</small>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <Link href={route('admin.classes.edit', cls.class_id)} style={{ color: '#135bec', marginRight: '10px', textDecoration: 'none' }}>Edit</Link>
                                    <button onClick={() => deleteClass(cls)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                         {classes.data.length === 0 && <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No schedules found.</td></tr>}
                    </tbody>
                </table>
            </div>
            <Pagination links={classes.links} />
        </AdminLayout>
    );
}
