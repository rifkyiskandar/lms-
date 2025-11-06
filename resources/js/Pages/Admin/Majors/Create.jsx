import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

// Komponen Halaman Tambah Jurusan
export default function Create({ faculties }) { // <-- Terima prop faculties

    // ----- Logika Form Tambah -----
    const { data, setData, post, processing, errors } = useForm({
        major_name: '',
        faculty_id: '', // Default kosong
    });

    // Fungsi untuk submit form
    const submitMajor = (e) => {
        e.preventDefault();
        post(route('admin.majors.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add New Major" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add New Major
            </h1>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
                <form onSubmit={submitMajor}>
                    {/* Input Nama Jurusan */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label>
                            Major Name:
                            <br />
                            <input
                                type="text"
                                value={data.major_name}
                                onChange={e => setData('major_name', e.target.value)}
                                style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }}
                            />
                        </label>
                        {errors.major_name && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.major_name}</div>}
                    </div>

                    {/* Dropdown Fakultas */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label>
                            Faculty:
                            <br />
                            <select
                                value={data.faculty_id}
                                onChange={e => setData('faculty_id', e.target.value)}
                                style={{ width: '100%', border: '1px solid #ccc', padding: '0.5rem' }}
                            >
                                <option value="">-- Select Faculty --</option>
                                {faculties.map(faculty => (
                                    <option key={faculty.faculty_id} value={faculty.faculty_id}>
                                        {faculty.faculty_name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.faculty_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.faculty_id}</div>}
                    </div>

                    {/* Tombol Submit dan Kembali */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                            Save Major
                        </button>
                        <Link
                            href={route('admin.majors.index')}
                            style={{ color: '#666' }}
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

        </AdminLayout>
    );
}
