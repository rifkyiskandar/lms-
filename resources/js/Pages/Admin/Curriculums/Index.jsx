import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    view_mode, majors, grouped_curriculums, selected_major, academic_year, courses
}) {
    // State untuk Tahun Akademik (Global filter)
    const [year, setYear] = useState(academic_year);

    // ----- FORM TAMBAH COURSE (Hanya muncul di view detail) -----
    const { data, setData, post, processing, errors, reset } = useForm({
        major_id: selected_major?.major_id,
        course_id: '',
        semester: '1',
        category: 'WAJIB',
        academic_year: academic_year,
        assign_to_all: false, // Checkbox sakti
    });

    const [showModal, setShowModal] = useState(false);

    const submitCurriculum = (e) => {
        e.preventDefault();
        post(route('admin.curriculums.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const deleteItem = (id) => {
        if(confirm('Remove this course from curriculum?')) {
            router.delete(route('admin.curriculums.destroy', id));
        }
    };

    // Fungsi ganti tahun
    const handleYearChange = (e) => {
        setYear(e.target.value);
        // Reload halaman dengan tahun baru
        router.get(route('admin.curriculums.index'), {
            academic_year: e.target.value,
            major_id: selected_major?.major_id // Pertahankan jurusan jika ada
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Curriculum" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {view_mode === 'list_majors' ? 'Curriculum Management' : `Curriculum: ${selected_major.major_name}`}
                </h1>

                {/* Selector Tahun Akademik (Selalu Muncul) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>Version (Year):</label>
                    <input
                        type="number"
                        value={year}
                        onChange={handleYearChange}
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                    />
                </div>
            </div>

            {/* ================= TAMPILAN 1: LIST MAJORS ================= */}
            {view_mode === 'list_majors' && (
                <div>
                    <p style={{ marginBottom: '1rem', color: '#666' }}>Select a major to manage its curriculum for year {year}:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {majors.map(major => (
                            <Link
                                key={major.major_id}
                                href={route('admin.curriculums.index', { major_id: major.major_id, academic_year: year })}
                                style={{
                                    display: 'block', background: 'white', padding: '1.5rem', borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit',
                                    border: '1px solid #eee', transition: 'transform 0.1s'
                                }}
                            >
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{major.major_name}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>{major.faculty?.faculty_name}</p>
                                <div style={{ marginTop: '1rem', color: '#135bec', fontWeight: '600', fontSize: '0.9rem' }}>
                                    Manage Curriculum &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= TAMPILAN 2: DETAIL CURRICULUM ================= */}
            {view_mode === 'detail_curriculum' && (
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <Link href={route('admin.curriculums.index', { academic_year: year })} style={{ color: '#666', textDecoration: 'none' }}>
                            &larr; Back to Majors List
                        </Link>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        style={{ background: '#135bec', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '2rem' }}
                    >
                        + Add Course to Curriculum
                    </button>

                    {/* Loop Semester 1 sampai 8 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <div key={sem} style={{ marginBottom: '2rem', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <div style={{ background: '#f3f4f6', padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                                Semester {sem}
                            </div>
                            {grouped_curriculums[sem] ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: '#666' }}>
                                            <th style={{ padding: '0.75rem' }}>Code</th>
                                            <th style={{ padding: '0.75rem' }}>Course Name</th>
                                            <th style={{ padding: '0.75rem' }}>SKS</th>
                                            <th style={{ padding: '0.75rem' }}>Category</th>
                                            <th style={{ padding: '0.75rem' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {grouped_curriculums[sem].map(item => (
                                            <tr key={item.curriculum_id} style={{ borderTop: '1px solid #eee' }}>
                                                <td style={{ padding: '0.75rem' }}>{item.course?.course_code}</td>
                                                <td style={{ padding: '0.75rem' }}>{item.course?.course_name}</td>
                                                <td style={{ padding: '0.75rem' }}>{item.course?.sks}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                                                        background: item.category === 'WAJIB' ? '#dbeafe' : '#fef3c7',
                                                        color: item.category === 'WAJIB' ? '#1e40af' : '#92400e'
                                                    }}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <button onClick={() => deleteItem(item.curriculum_id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ padding: '1rem', color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                    No courses assigned to Semester {sem} yet.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ----- MODAL ADD COURSE ----- */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Course to Curriculum</h2>

                        <form onSubmit={submitCurriculum}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Course:</label>
                                <select
                                    value={data.course_id}
                                    onChange={e => setData('course_id', e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => (
                                        <option key={c.course_id} value={c.course_id}>{c.course_code} - {c.course_name} ({c.sks} SKS)</option>
                                    ))}
                                </select>
                                {errors.course_id && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors.course_id}</div>}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Semester:</label>
                                    <select
                                        value={data.semester}
                                        onChange={e => setData('semester', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        {[1,2,3,4,5,6,7,8].map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category:</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        <option value="WAJIB">Wajib</option>
                                        <option value="PILIHAN">Pilihan</option>
                                        <option value="WAJIB_FAKULTAS">Wajib Fakultas</option>
                                    </select>
                                </div>
                            </div>

                            {/* FITUR SPESIAL: MASS ASSIGN */}
                            <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '4px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.assign_to_all}
                                        onChange={e => setData('assign_to_all', e.target.checked)}
                                    />
                                    <span style={{ fontWeight: '600', color: '#c2410c' }}>Add to ALL Majors? (e.g. MKU)</span>
                                </label>
                                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                                    Check this for courses like "Pancasila" or "Religion" to add them to every major automatically.
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', background: '#eee', borderRadius: '4px' }}>Cancel</button>
                                <button type="submit" disabled={processing} style={{ padding: '0.5rem 1rem', background: '#135bec', color: 'white', borderRadius: '4px' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
