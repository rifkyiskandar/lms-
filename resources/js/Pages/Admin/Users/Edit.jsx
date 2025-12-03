import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

// 'user', 'faculties', 'majors', 'semesters' dikirim dari UserController@edit
export default function Edit({ user, faculties, majors, semesters }) {

    // Style helper (bisa Anda ganti dengan CSS/Tailwind)
    const buttonStyle = { background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' };

    // Isi form dengan data user yang ada
    const { data, setData, put, processing, errors } = useForm({
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id,
        phone_number: user.phone_number || '',

        // Isi data profile jika ada
        student_number: user.student_profile?.student_number || '',
        faculty_id: user.student_profile?.faculty_id || user.lecturer_profile?.faculty_id || '',
        major_id: user.student_profile?.major_id || '',
        semester_id: user.student_profile?.semester_id || '',
        batch_year: user.student_profile?.batch_year || '',

        lecturer_number: user.lecturer_profile?.lecturer_number || '',
        title: user.lecturer_profile?.title || '',
        position: user.lecturer_profile?.position || '',
    });

    const submitUpdate = (e) => {
        e.preventDefault();
        // Kirim data ke method 'update' di controller
        put(route('admin.users.update', user.user_id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit User - ${user.full_name}`} />

            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.users.index')}>
                    &larr; Back to User Management
                </Link>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Edit User: {user.full_name}
            </h1>

            {/* ----- Form Edit Data ----- */}
            <form onSubmit={submitUpdate} style={{ maxWidth: '800px', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontWeight: 'bold' }}>User Account</h3>
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
                        <label>Phone Number (Optional):</label><br/>
                        <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                    </div>
                </div>
                <small>Password cannot be changed from this form.</small>

                {/* Form Kondisional untuk Student */}
                {data.role_id === 3 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <h4 style={{ fontWeight: '600' }}>Student Profile</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                            </div>
                            <div>
                                <label>Major:</label><br/>
                                <select value={data.major_id} onChange={e => setData('major_id', e.target.value)}>
                                    <option value="">-- Select Major --</option>
                                    {majors.map(m => <option key={m.major_id} value={m.major_id}>{m.major_name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label>Current Semester:</label><br/>
                                <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)}>
                                    <option value="">-- Select Semester --</option>
                                    {semesters.map(s => <option key={s.semester_id} value={s.semester_id}>{s.semester_name}</option>)}
                                </select>
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
                            </div>
                         </div>
                    </div>
                )}

                <button type="submit" disabled={processing} style={{ ...buttonStyle, marginTop: '1rem' }}>
                    Update User
                </button>
            </form>

        </AdminLayout>
    );
}
