import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ courses, lecturers, rooms, semesters }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: '',
        lecturer_id: '',
        semester_id: '',
        room_id: '',
        start_time: '',
        end_time: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.classes.store'));
    };

    // Style helper
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500' };
    const inputStyle = { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' };

    return (
        <AdminLayout>
            <Head title="Create Schedule" />
            <div style={{ marginBottom: '1rem' }}>
                <Link href={route('admin.classes.index')} style={{ color: '#6b7280', textDecoration: 'none' }}>&larr; Back to Schedules</Link>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Create Class Schedule</h1>

            <form onSubmit={submit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', maxWidth: '800px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    {/* Course & Lecturer */}
                    <div>
                        <label style={labelStyle}>Course:</label>
                        <select value={data.course_id} onChange={e => setData('course_id', e.target.value)} style={inputStyle}>
                            <option value="">-- Select Course --</option>
                            {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>)}
                        </select>
                        {errors.course_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.course_id}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Lecturer:</label>
                        <select value={data.lecturer_id} onChange={e => setData('lecturer_id', e.target.value)} style={inputStyle}>
                            <option value="">-- Select Lecturer --</option>
                            {lecturers.map(l => <option key={l.user_id} value={l.user_id}>{l.full_name}</option>)}
                        </select>
                        {errors.lecturer_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.lecturer_id}</div>}
                    </div>

                    {/* Semester & Room */}
                    <div>
                        <label style={labelStyle}>Semester (Active Only):</label>
                        <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)} style={inputStyle}>
                            <option value="">-- Select Semester --</option>
                            {semesters.map(s => <option key={s.semester_id} value={s.semester_id}>{s.semester_name}</option>)}
                        </select>
                        {errors.semester_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.semester_id}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>Room:</label>
                        <select value={data.room_id} onChange={e => setData('room_id', e.target.value)} style={inputStyle}>
                            <option value="">-- Select Room --</option>
                            {rooms.map(r => <option key={r.room_id} value={r.room_id}>{r.room_name} (Cap: {r.capacity})</option>)}
                        </select>
                        {errors.room_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.room_id}</div>}
                    </div>

                    {/* Time */}
                    <div>
                        <label style={labelStyle}>Start Time:</label>
                        <input type="datetime-local" value={data.start_time} onChange={e => setData('start_time', e.target.value)} style={inputStyle} />
                        {errors.start_time && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.start_time}</div>}
                    </div>
                    <div>
                        <label style={labelStyle}>End Time:</label>
                        <input type="datetime-local" value={data.end_time} onChange={e => setData('end_time', e.target.value)} style={inputStyle} />
                        {errors.end_time && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.end_time}</div>}
                    </div>

                </div>

                <button type="submit" disabled={processing} style={{ marginTop: '1.5rem', background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', width: '100%' }}>
                    Save Schedule
                </button>
            </form>
        </AdminLayout>
    );
}
