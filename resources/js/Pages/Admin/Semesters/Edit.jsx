import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

// 'semester' dikirim dari SemesterController@edit
export default function Edit({ semester }) {

    // Gunakan 'put' untuk update dan isi form dengan data yang ada
    const { data, setData, put, processing, errors } = useForm({
        academic_year: semester.academic_year,
        term: semester.term,
        start_date: semester.start_date.split('T')[0], // Format tanggal untuk input HTML
        end_date: semester.end_date.split('T')[0],   // Format tanggal untuk input HTML
        is_active: semester.is_active,
    });

    const submitUpdate = (e) => {
        e.preventDefault();
        // Kirim data ke method 'update' di controller
        put(route('admin.semesters.update', semester.semester_id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Semester - ${semester.semester_name}`} />

            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.semesters.index')}>
                    &larr; Back to Semesters
                </Link>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Edit Semester: {semester.semester_name}
            </h1>

            {/* ----- Form Edit Data ----- */}
            <form onSubmit={submitUpdate} style={{ maxWidth: '600px', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Academic Year:<br />
                            <input type="text" value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} placeholder="e.g., 2025/2026" style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }} />
                        </label>
                        {errors.academic_year && <div style={{ color: 'red' }}>{errors.academic_year}</div>}
                    </div>
                    <div>
                        <label>Term:<br />
                            <select value={data.term} onChange={e => setData('term', e.target.value)} style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }}>
                                <option value="Ganjil">Ganjil</option>
                                <option value="Genap">Genap</option>
                                <option value="Pendek">Pendek</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>Start Date:<br />
                            <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }} />
                        </label>
                        {errors.start_date && <div style={{ color: 'red' }}>{errors.start_date}</div>}
                    </div>
                 <div>
                    <label>End Date:<br />
                        <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }} />
                    </label>
                    {errors.end_date && <div style={{ color: 'red' }}>{errors.end_date}</div>}
                </div>
                    <div>
                        <label>
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                             Set as Active Semester
                        </label>
                    </div>
                    <div>
                        <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                            Update Semester
                        </button>
                    </div>
                </div>
            </form>

        </AdminLayout>
    );
}
