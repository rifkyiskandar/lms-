import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx'; // <-- Import Pagination
import { Head, Link, useForm, router } from '@inertiajs/react'; // <-- Import router
import { useState } from 'react';

export default function Index({ users, filters, faculties, majors, semesters }) {

    // ----- Form Search -----
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: search,
            role: filters.role ?? 3 // Pertahankan filter role
        }, { preserveState: true, replace: true });
    };

    // ----- Form Tambah -----
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        password_hash: '',
        password_hash_confirmation: '',
        role_id: 3, // Default ke Student
        phone_number: '',
        // Data Student
        student_number: '',
        faculty_id: '',
        major_id: '',
        semester_id: '',
        batch_year: '',
        // Data Lecturer
        lecturer_number: '',
        // faculty_id sudah ada
        title: '',
        position: '',
    });

    const submitUser = (e) => {
        e.preventDefault();
        // Ganti nama field password agar sesuai validasi controller
        const postData = {
            ...data,
            password: data.password_hash, // Salin password_hash ke password
            password_confirmation: data.password_hash_confirmation,
        };

        post(route('admin.users.store'), {
            data: postData, // Kirim data yang sudah disesuaikan
            onSuccess: () => reset(),
        });
    };

    // ----- Logika Tab -----
    const activeTab = filters.role ?? 3; // Default ke 3 (Student)

    const changeTab = (roleId) => {
        router.get(route('admin.users.index'), { role: roleId }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Users" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                User Management
            </h1>

            {/* ----- Form Tambah Data (Lebih Lengkap) ----- */}
            <form onSubmit={submitUser} style={{ marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontWeight: 'bold' }}>Add New User</h3>

                {/* Data User Dasar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label>Full Name:</label><br/>
                        <input type="text" value={data.full_name} onChange={e => setData('full_name', e.target.value)} />
                        {errors.full_name && <div style={{ color: 'red' }}>{errors.full_name}</div>}
                    </div>
                    <div>
                        <label>Email:</label><br/>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </div>
                    <div>
                        <label>Password:</label><br/>
                        <input type="password" value={data.password_hash} onChange={e => setData('password_hash', e.target.value)} />
                        {errors.password_hash && <div style={{ color: 'red' }}>{errors.password_hash}</div>}
                    </div>
                    <div>
                        <label>Confirm Password:</label><br/>
                        <input type="password" value={data.password_hash_confirmation} onChange={e => setData('password_hash_confirmation', e.target.value)} />
                    </div>
                    <div>
                        <label>Role:</label><br/>
                        <select value={data.role_id} onChange={e => setData('role_id', parseInt(e.target.value))}>
                            <option value={3}>Student</option>
                            <option value={2}>Lecturer</option>
                            <option value={1}>Admin</option>
                        </select>
                    </div>
                </div>

                {/* Form Kondisional untuk Student */}
                {data.role_id === 3 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <h4 style={{ fontWeight: '600' }}>Student Profile</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>NIM (Student Number):</label><br/>
                                <input type="text" value={data.student_number} onChange={e => setData('student_number', e.target.value)} />
                                {errors.student_number && <div style={{ color: 'red' }}>{errors.student_number}</div>}
                            </div>
                            <div>
                                <label>Batch Year:</label><br/>
                                <input type="number" value={data.batch_year} onChange={e => setData('batch_year', e.target.value)} />
                                {errors.batch_year && <div style={{ color: 'red' }}>{errors.batch_year}</div>}
                            </div>
                             <div>
                                <label>Faculty:</label><br/>
                                <select value={data.faculty_id} onChange={e => setData('faculty_id', e.target.value)}>
                                    <option value="">-- Select Faculty --</option>
                                    {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
                                </select>
                                {errors.faculty_id && <div style={{ color: 'red' }}>{errors.faculty_id}</div>}
                            </div>
                            <div>
                                <label>Major:</label><br/>
                                <select value={data.major_id} onChange={e => setData('major_id', e.target.value)}>
                                    <option value="">-- Select Major --</option>
                                    {majors.map(m => <option key={m.major_id} value={m.major_id}>{m.major_name}</option>)}
                                </select>
                                {errors.major_id && <div style={{ color: 'red' }}>{errors.major_id}</div>}
                            </div>
                             <div>
                                <label>Current Semester:</label><br/>
                                <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)}>
                                    <option value="">-- Select Semester --</option>
                                    {semesters.map(s => <option key={s.semester_id} value={s.semester_id}>{s.semester_name}</option>)}
                                </select>
                                {errors.semester_id && <div style={{ color: 'red' }}>{errors.semester_id}</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Kondisional untuk Lecturer */}
                {data.role_id === 2 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                         <h4 style={{ fontWeight: '600' }}>Lecturer Profile</h4>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>NIDN (Lecturer Number):</label><br/>
                                <input type="text" value={data.lecturer_number} onChange={e => setData('lecturer_number', e.target.value)} />
                                {errors.lecturer_number && <div style={{ color: 'red' }}>{errors.lecturer_number}</div>}
                            </div>
                            <div>
                                <label>Faculty:</label><br/>
                                <select value={data.faculty_id} onChange={e => setData('faculty_id', e.target.value)}>
                                    <option value="">-- Select Faculty --</option>
                                    {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
                                </select>
                                {errors.faculty_id && <div style={{ color: 'red' }}>{errors.faculty_id}</div>}
                            </div>
                         </div>
                    </div>
                )}

                <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', marginTop: '1rem' }}>
                    Save User
                </button>
            </form>

            {/* ----- Navigasi Tab ----- */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => changeTab(3)} style={{ padding: '0.5rem 1rem', background: activeTab == 3 ? '#135bec' : '#eee', color: activeTab == 3 ? 'white' : 'black' }}>
                    Students
                </button>
                <button onClick={() => changeTab(2)} style={{ padding: '0.5rem 1rem', background: activeTab == 2 ? '#135bec' : '#eee', color: activeTab == 2 ? 'white' : 'black' }}>
                    Lecturers
                </button>
                <button onClick={() => changeTab(1)} style={{ padding: '0.5rem 1rem', background: activeTab == 1 ? '#135bec' : '#eee', color: activeTab == 1 ? 'white' : 'black' }}>
                    Admins
                </button>
            </div>

            {/* ----- Form Search ----- */}
            <form onSubmit={submitSearch} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                />
                <button type="submit">Search</button>
            </form>

            {/* ----- List Data (Tabel) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr><td colSpan="3">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- Gunakan Komponen Pagination ----- */}
            <Pagination links={users.links} />

        </AdminLayout>
    );
}
