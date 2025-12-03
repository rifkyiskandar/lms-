import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

// Props 'major' dan 'faculties' dikirim dari MajorController@edit
export default function Edit({ major, faculties }) {

    const { data, setData, put, processing, errors } = useForm({
        major_name: major.major_name,
        faculty_id: major.faculty_id,
    });

    const submitUpdate = (e) => {
        e.preventDefault();
        put(route('admin.majors.update', major.major_id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Major - ${major.major_name}`} />

            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.majors.index')}>
                    &larr; Back to Majors
                </Link>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Edit Major
            </h1>

            <div style={{ maxWidth: '600px', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <form onSubmit={submitUpdate}>
                    {/* Major Name */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Major Name</label>
                        <input
                            type="text"
                            value={data.major_name}
                            onChange={e => setData('major_name', e.target.value)}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '0.5rem 0.75rem' }}
                        />
                        {errors.major_name && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>{errors.major_name}</div>}
                    </div>

                    {/* Faculty Dropdown */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Faculty</label>
                        <select
                            value={data.faculty_id}
                            onChange={e => setData('faculty_id', e.target.value)}
                            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '0.5rem 0.75rem', backgroundColor: 'white' }}
                        >
                            <option value="">-- Select Faculty --</option>
                            {faculties.map(faculty => (
                                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                                    {faculty.faculty_name}
                                </option>
                            ))}
                        </select>
                        {errors.faculty_id && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '0.5rem' }}>{errors.faculty_id}</div>}
                    </div>

                    {/* Tombol */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ backgroundColor: '#135bec', color: 'white', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Update Major
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
