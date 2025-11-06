import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx'; // <-- Import Pagination
import { Head, Link, router } from '@inertiajs/react'; // <-- Import router
import { useState } from 'react';

export default function Index({ majors, filters }) {

    // ----- Form Search -----
    const [search, setSearch] = useState(filters.search ?? ''); // <-- Perbaikan

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.majors.index'), { search: search }, { // <-- Perbaikan
            preserveState: true,
            replace: true,
        });
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
                />
                <button type="submit">Search</button>
            </form>

            {/* ----- List Data (Tabel) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Major Name</th>
                            <th>Faculty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {majors.data.map(major => (
                            <tr key={major.major_id}>
                                <td>{major.major_id}</td>
                                <td>{major.major_name}</td>
                                <td>{major.faculty.faculty_name}</td>
                            </tr>
                        ))}
                         {majors.data.length === 0 && (
                            <tr><td colSpan="3">No majors found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- Gunakan Komponen Pagination ----- */}
            <Pagination links={majors.links} />

        </AdminLayout>
    );
}
