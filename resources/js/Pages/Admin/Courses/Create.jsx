import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ faculties, majors }) {
    const { data, setData, post, processing, errors } = useForm({
        course_code: '', course_name: '', sks: 3, faculty_id: '', major_id: '', category: '', description: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.courses.store'));
    };

    return (
        <AdminLayout>
            <Head title="Add Course" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Course</h1>
            <form onSubmit={submit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', maxWidth: '600px' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Code (e.g. CS101): <input type="text" value={data.course_code} onChange={e => setData('course_code', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} /></label>
                    {errors.course_code && <div style={{ color: 'red' }}>{errors.course_code}</div>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name: <input type="text" value={data.course_name} onChange={e => setData('course_name', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} /></label>
                    {errors.course_name && <div style={{ color: 'red' }}>{errors.course_name}</div>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>SKS: <input type="number" value={data.sks} onChange={e => setData('sks', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }} /></label>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Faculty:
                        <select value={data.faculty_id} onChange={e => setData('faculty_id', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}>
                            <option value="">-- Select --</option>
                            {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
                        </select>
                    </label>
                    {errors.faculty_id && <div style={{ color: 'red' }}>{errors.faculty_id}</div>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Major:
                        <select value={data.major_id} onChange={e => setData('major_id', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}>
                            <option value="">-- Select --</option>
                            {majors.map(m => <option key={m.major_id} value={m.major_id}>{m.major_name}</option>)}
                        </select>
                    </label>
                    {errors.major_id && <div style={{ color: 'red' }}>{errors.major_id}</div>}
                </div>
                 <div style={{ marginBottom: '1rem' }}>
                    <label>Category:
                        <select value={data.category} onChange={e => setData('category', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}>
                            <option value="">-- Select --</option>
                            <option value="MKU">MKU</option>
                            <option value="MKW">MKW</option>
                            <option value="MKP">MKP</option>
                            <option value="LAINNYA">Lainnya</option>
                        </select>
                    </label>
                    {errors.category && <div style={{ color: 'red' }}>{errors.category}</div>}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description: <textarea value={data.description} onChange={e => setData('description', e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}></textarea></label>
                </div>
                <button type="submit" disabled={processing} style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Save Course</button>
            </form>
        </AdminLayout>
    );
}
