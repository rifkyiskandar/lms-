import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Style helper (bisa Anda ganti dengan CSS/Tailwind)
const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #eee' };
const thStyle = { padding: '8px 12px', borderBottom: '2px solid #ccc', textAlign: 'left' };
const actionLink = { fontSize: '0.9rem', color: '#135bec', textDecoration: 'none', marginRight: '10px' };
const deleteButton = { fontSize: '0.9rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 };


export default function Index({ faculties, filters }) {

    // Ambil flash message 'error' dari controller
    const { errors: pageErrors } = usePage().props;

    // ----- Form Tambah -----
    const { data, setData, post, processing, errors, reset } = useForm({
        faculty_name: '',
    });

    const submitFaculty = (e) => {
        e.preventDefault();
        post(route('admin.faculties.store'), {
            onSuccess: () => reset(),
        });
    };

    // ----- Form Search -----
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.faculties.index'), { search: search }, {
            preserveState: true,
            replace: true,
        });
    };

    // ----- Logika Delete -----
    const deleteFaculty = (faculty) => {
        if (window.confirm(`Are you sure you want to delete "${faculty.faculty_name}"?`)) {
            router.delete(route('admin.faculties.destroy', faculty.faculty_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Faculties" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Manage Faculties
            </h1>

            {/* Tampilkan error dari controller (misal: gagal delete) */}
            {pageErrors.error && (
                <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {pageErrors.error}
                </div>
            )}

            {/* ----- Form Tambah Data ----- */}
            <form onSubmit={submitFaculty} style={{ marginBottom: '1rem', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <label>
                    New Faculty Name:
                    <input type="text" value={data.faculty_name} onChange={e => setData('faculty_name', e.target.value)} />
                </label>
                <button type="submit" disabled={processing}>Add Faculty</button>
                {errors.faculty_name && <div style={{ color: 'red' }}>{errors.faculty_name}</div>}
            </form>

            {/* ----- Form Search Data ----- */}
            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search faculties..."
                />
                <button type="submit">Search</button>
            </form>

            {/* ----- List Data (Tabel) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Faculty Name</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculties.data.map(faculty => (
                            <tr key={faculty.faculty_id}>
                                <td style={tdStyle}>{faculty.faculty_id}</td>
                                <td style={tdStyle}>{faculty.faculty_name}</td>
                                <td style={tdStyle}>
                                    <Link href={route('admin.faculties.edit', faculty.faculty_id)} style={actionLink}>
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteFaculty(faculty)} style={deleteButton}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {faculties.data.length === 0 && (
                            <tr><td colSpan="3" style={{...tdStyle, textAlign: 'center'}}>No faculties found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- Gunakan Komponen Pagination ----- */}
            <Pagination links={faculties.links} />

        </AdminLayout>
    );
}
