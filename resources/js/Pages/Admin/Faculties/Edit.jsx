import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

// 'faculty' dikirim dari FacultyController@edit
export default function Edit({ faculty }) {

    // Style helper
    const buttonStyle = { background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' };

    // Gunakan 'put' untuk update dan isi form dengan data yang ada
    const { data, setData, put, processing, errors } = useForm({
        faculty_name: faculty.faculty_name,
    });

    const submitUpdate = (e) => {
        e.preventDefault();
        // Kirim data ke method 'update' di controller
        put(route('admin.faculties.update', faculty.faculty_id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Faculty - ${faculty.faculty_name}`} />

            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.faculties.index')}>
                    &larr; Back to Faculties
                </Link>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Edit Faculty: {faculty.faculty_name}
            </h1>

            {/* ----- Form Edit Data ----- */}
            <form onSubmit={submitUpdate} style={{ maxWidth: '600px', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Faculty Name:<br />
                            <input
                                type="text"
                                value={data.faculty_name}
                                onChange={e => setData('faculty_name', e.target.value)}
                                style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }}
                            />
                        </label>
                        {errors.faculty_name && <div style={{ color: 'red' }}>{errors.faculty_name}</div>}
                    </div>
                    <div>
                        <button type="submit" disabled={processing} style={buttonStyle}>
                            Update Faculty
                        </button>
                    </div>
                </div>
            </form>

        </AdminLayout>
    );
}
