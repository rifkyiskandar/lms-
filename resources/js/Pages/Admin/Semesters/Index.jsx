import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, useForm, router } from '@inertiajs/react'; // <-- 'router' diimpor
import { useState } from 'react';

export default function Index({ semesters, filters }) {

    // ----- Form Tambah Data (semester_name dihapus) -----
    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year: '',
        term: 'Ganjil', // Default
        start_date: '',
        end_date: '',
        is_active: false,
    });

    const submitSemester = (e) => {
        e.preventDefault();
        // Controller akan otomatis membuat semester_name
        post(route('admin.semesters.store'), {
            onSuccess: () => reset(), // Kosongkan form setelah sukses
        });
    };

    // ----- Form Search Data -----
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.semesters.index'), { search: search }, {
            preserveState: true,
            replace: true,
        });
    };

    // ----- Logika Delete Data -----
    const deleteSemester = (semester) => {
        if (window.confirm(`Are you sure you want to delete "${semester.semester_name}"?`)) {
            router.delete(route('admin.semesters.destroy', semester.semester_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Semesters" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Manage Semesters
            </h1>

            {/* ----- Form Tambah Data (Sudah diperbarui) ----- */}
            <form onSubmit={submitSemester} style={{ marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Add New Semester</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {/* Input semester_name SUDAH DIHAPUS */}
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
                    <div style={{ alignSelf: 'center', paddingTop: '1rem' }}>
                        <label>
                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                             Set as Active
                        </label>
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                            Add Semester
                        </button>
                    </div>
                </div>
            </form>

            {/* ----- Form Search Data ----- */}
            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or year..."
                    style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}
                />
                <button type="submit" style={{ marginLeft: '0.5rem', background: '#6b7280', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Search</button>
            </form>

            {/* ----- List Data (Tabel) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Term</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Academic Year</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semesters.data.map(semester => (
                            <tr key={semester.semester_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.5rem' }}>{semester.semester_name}</td>
                                <td style={{ padding: '0.5rem' }}>{semester.term}</td>
                                <td style={{ padding: '0.5rem' }}>{semester.academic_year}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    {semester.is_active ?
                                        <span style={{ background: 'green', color: 'white', fontSize: '0.8rem', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Active</span> :
                                        <span style={{ background: 'gray', color: 'white', fontSize: '0.8rem', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Inactive</span>
                                    }
                                </td>
                                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    {/* --- TOMBOL EDIT BARU --- */}
                                    <Link
                                        href={route('admin.semesters.edit', semester.semester_id)}
                                        style={{ color: '#135bec', textDecoration: 'none' }}
                                    >
                                        Edit
                                    </Link>
                                    {/* --- TOMBOL DELETE BARU --- */}
                                    <button
                                        onClick={() => deleteSemester(semester)}
                                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {semesters.data.length === 0 && (
                            <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>No semesters found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- Gunakan Komponen Pagination ----- */}
            <Pagination links={semesters.links} />

        </AdminLayout>
    );
}
