import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ majors, filters }) {

    // ----- Form Search -----
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.majors.index'), { search: search }, {
            preserveState: true,
            replace: true,
        });
    };

    // ----- Logika Delete -----
    const deleteMajor = (major) => {
        if (window.confirm(`Are you sure you want to delete "${major.major_name}"?`)) {
            router.delete(route('admin.majors.destroy', major.major_id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Majors" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Majors</h1>
                <Link
                    href={route('admin.majors.create')}
                    style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none' }}
                >
                    + Add New Major
                </Link>
            </div>

            {/* ----- Form Search Data ----- */}
            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search majors or faculties..."
                    style={{ border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}
                />
                <button type="submit" style={{ marginLeft: '0.5rem', background: '#666', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    Search
                </button>
            </form>

            {/* ----- List Data (Tabel) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Major Name</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Faculty</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {majors.data.map(major => (
                            <tr key={major.major_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '0.5rem' }}>{major.major_id}</td>
                                <td style={{ padding: '0.5rem' }}>{major.major_name}</td>
                                <td style={{ padding: '0.5rem' }}>{major.faculty.faculty_name}</td>
                                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <Link
                                        href={route('admin.majors.edit', major.major_id)}
                                        style={{ color: '#135bec', textDecoration: 'none' }}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteMajor(major)}
                                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {majors.data.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>No majors found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={majors.links} />

        </AdminLayout>
    );
}
