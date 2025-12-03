import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ courses, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.courses.index'), { search: search }, { preserveState: true });
    };

    const deleteCourse = (course) => {
        if (window.confirm(`Are you sure?`)) {
            router.delete(route('admin.courses.destroy', course.course_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Courses" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Manage Courses</h1>
                <Link href={route('admin.courses.create')} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>+ Add New Course</Link>
            </div>

            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search code or name..." style={{ border: '1px solid #ccc', padding: '0.5rem' }} />
                <button type="submit" style={{ marginLeft: '0.5rem', background: '#666', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Search</button>
            </form>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '0.5rem' }}>Code</th>
                            <th style={{ padding: '0.5rem' }}>Name</th>
                            <th style={{ padding: '0.5rem' }}>SKS</th>
                            <th style={{ padding: '0.5rem' }}>Major</th>
                            <th style={{ padding: '0.5rem' }}>Category</th>
                            <th style={{ padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.data.map(course => (
                            <tr key={course.course_id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>{course.course_code}</td>
                                <td style={{ padding: '0.5rem' }}>{course.course_name}</td>
                                <td style={{ padding: '0.5rem' }}>{course.sks}</td>
                                <td style={{ padding: '0.5rem' }}>{course.major?.major_name}</td>
                                <td style={{ padding: '0.5rem' }}>{course.category}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <Link href={route('admin.courses.edit', course.course_id)} style={{ color: '#135bec', marginRight: '10px' }}>Edit</Link>
                                    <button onClick={() => deleteCourse(course)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                         {courses.data.length === 0 && (
                            <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No courses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination links={courses.links} />
        </AdminLayout>
    );
}
