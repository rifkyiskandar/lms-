import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Pagination from '@/Components/Pagination.jsx';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// Komponen helper untuk styling (ganti dengan CSS/Tailwind Anda nanti)
const tdStyle = { padding: '8px 12px', borderBottom: '1px solid #eee' };
const thStyle = { padding: '8px 12px', borderBottom: '2px solid #ccc', textAlign: 'left' };
const buttonStyle = { background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' };
const tabStyle = (active) => ({
    padding: '0.5rem 1rem',
    background: active ? '#135bec' : '#eee',
    color: active ? 'white' : 'black',
    border: 'none',
    cursor: 'pointer'
});
const actionLink = { fontSize: '0.9rem', color: '#135bec', textDecoration: 'none', marginRight: '10px' };
const deleteButton = { fontSize: '0.9rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 };


export default function Index({ users, filters, faculties, majors, semesters }) {

    // ----- Form Search -----
    const [search, setSearch] = useState(filters.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: search,
            role: filters.role ?? 3
        }, { preserveState: true, replace: true });
    };

    // ----- Form Tambah -----
    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        email: '',
        password: '', // Ganti nama, controller sudah disesuaikan
        password_confirmation: '', // Ganti nama
        role_id: 3,
        phone_number: '',
        // Data Student
        // 'student_number' DIHAPUS (karena otomatis)
        faculty_id: '',
        major_id: '',
        semester_id: '',
        batch_year: new Date().getFullYear().toString(), // Default tahun ini
        // Data Lecturer
        // 'lecturer_number' DIHAPUS (karena otomatis)
        title: '',
        position: '',
    });

    const submitUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    // ----- Logika Tab -----
    const activeTab = filters.role ?? 3;

    const changeTab = (roleId) => {
        router.get(route('admin.users.index'), { role: roleId }, {
            preserveState: true,
            replace: true
        });
    };

    // ----- Logika Delete -----
    const deleteUser = (user) => {
        if (window.confirm(`Are you sure you want to delete "${user.full_name}"?`)) {
            router.delete(route('admin.users.destroy', user.user_id));
        }
    }

    return (
        <AdminLayout>
            <Head title="Manage Users" />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                User Management
            </h1>

            {/* ----- Form Tambah Data (Input NIM/NIDN dihapus) ----- */}
            <form onSubmit={submitUser} style={{ marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontWeight: 'bold' }}>Add New User</h3>

                {/* Data User Dasar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                        <label>Role:</label><br/>
                        <select value={data.role_id} onChange={e => setData('role_id', parseInt(e.target.value))}>
                            <option value={3}>Student</option>
                            <option value={2}>Lecturer</option>
                            <option value={1}>Admin</option>
                        </select>
                    </div>
                    <div>
                        <label>Password:</label><br/>
                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} />
                        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                    </div>
                    <div>
                        <label>Confirm Password:</label><br/>
                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                    </div>
                     <div>
                        <label>Phone Number (Optional):</label><br/>
                        <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                    </div>
                </div>

                {/* Form Kondisional untuk Student */}
                {data.role_id === 3 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <h4 style={{ fontWeight: '600' }}>Student Profile</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Batch Year:</label><br/>
                                <input type="number" value={data.batch_year} onChange={e => setData('batch_year', e.target.value)} placeholder="e.g., 2024" />
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
                                <label>Faculty:</label><br/>
                                <select value={data.faculty_id} onChange={e => setData('faculty_id', e.target.value)}>
                                    <option value="">-- Select Faculty --</option>
                                    {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
                                </select>
                                {errors.faculty_id && <div style={{ color: 'red' }}>{errors.faculty_id}</div>}
                            </div>
                            <div>
                                <label>Title (Optional):</label><br/>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g., M.Kom"/>
                            </div>
                         </div>
                    </div>
                )}

                <button type="submit" disabled={processing} style={{ ...buttonStyle, marginTop: '1rem' }}>
                    Save User
                </button>
            </form>

            {/* ----- Navigasi Tab ----- */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => changeTab(3)} style={tabStyle(activeTab == 3)}>Students</button>
                <button onClick={() => changeTab(2)} style={tabStyle(activeTab == 2)}>Lecturers</button>
                <button onClick={() => changeTab(1)} style={tabStyle(activeTab == 1)}>Admins</button>
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

            {/* ----- List Data (Tabel yang Diperbarui) ----- */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            {activeTab == 3 && <th style={thStyle}>NIM</th>}
                            {activeTab == 2 && <th style={thStyle}>NIDN</th>}
                            <th style={thStyle}>Email</th>
                            {activeTab == 3 && <th style={thStyle}>Major</th>}
                            {activeTab == 2 && <th style={thStyle}>Faculty</th>}
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map(user => (
                            <tr key={user.user_id}>
                                <td style={tdStyle}>{user.full_name}</td>

                                {activeTab == 3 && <td style={tdStyle}>{user.student_profile?.student_number}</td>}
                                {activeTab == 2 && <td style={tdStyle}>{user.lecturer_profile?.lecturer_number}</td>}

                                <td style={tdStyle}>{user.email}</td>

                                {activeTab == 3 && <td style={tdStyle}>{user.student_profile?.major?.major_name}</td>}
                                {activeTab == 2 && <td style={tdStyle}>{user.lecturer_profile?.faculty?.faculty_name}</td>}

                                <td style={tdStyle}>
                                    <Link href={route('admin.users.edit', user.user_id)} style={actionLink}>
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteUser(user)} style={deleteButton}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr><td colSpan="5" style={{...tdStyle, textAlign: 'center'}}>No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ----- Gunakan Komponen Pagination ----- */}
            <Pagination links={users.links} />

        </AdminLayout>
    );
}
