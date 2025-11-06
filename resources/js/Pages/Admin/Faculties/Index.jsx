import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx'; // <-- 1. Import Pagination
import { Head, Link, useForm, router } from '@inertiajs/react'; // <-- 2. Import router
import { useState } from 'react';

export default function Index({ faculties, filters }) {

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
    // Gunakan nullish coalescing (??) agar aman jika filters.search undefined
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        // 3. Gunakan router.get (modern)
        router.get(route('admin.faculties.index'), { search: search }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Faculties" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Manage Faculties
            </h1>

            {/* ----- Form Tambah Data ----- */}
            <form onSubmit={submitFaculty} style={{ marginBottom: '1rem', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                {/* ... (isi form tambah fakultas Anda) ... */}
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
                <table>
                    {/* ... (thead Anda) ... */}
                    <tbody>
                        {faculties.data.map(faculty => (
                            <tr key={faculty.faculty_id}>
                                <td>{faculty.faculty_id}</td>
                                <td>{faculty.faculty_name}</td>
                                <td>{new Date(faculty.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {faculties.data.length === 0 && (
                            <tr><td colSpan="3">No faculties found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- 4. Gunakan Komponen Pagination ----- */}
            <Pagination links={faculties.links} />

        </AdminLayout>
    );
}
