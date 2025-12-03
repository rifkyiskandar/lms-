import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const { component } = usePage();

    // State untuk dropdown
    const [showAcademics, setShowAcademics] = useState(
        component.startsWith('Admin/Academics') ||
        component.startsWith('Admin/Courses') ||  // <-- Tambah ini
        component.startsWith('Admin/Rooms') ||    // <-- Tambah ini
        component.startsWith('Admin/Classes') ||   // <-- Tambah ini
        component.startsWith('Admin/Curriculums')

    );
    const [showFinance, setShowFinance] = useState(
        component.startsWith('Admin/Finance')
    );

    // Fungsi helper untuk cek aktif
    const isActive = (prefix) => component.startsWith(prefix);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>LMS Admin</h1>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        <Link
                            href={route('admin.dashboard')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                backgroundColor: component === 'Admin/Dashboard' ? '#374151' : 'transparent'
                            }}
                        >
                            Dashboard
                        </Link>

                        <Link
                            href={route('admin.users.index')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                backgroundColor: isActive('Admin/Users') ? '#374151' : 'transparent'
                            }}
                        >
                            User Management
                        </Link>

                        {/* Dropdown Academics */}
                        <div>
                            <button onClick={() => setShowAcademics(!showAcademics)} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Academics</span>
                                <span>{ showAcademics ? '−' : '+' }</span>
                            </button>
                            {showAcademics && (
                                <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid #374151', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Link
                                        href={route('admin.faculties.index')}
                                        style={{ color: isActive('Admin/Faculties') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Faculties') ? 'bold' : 'normal' }}
                                    >
                                        Faculties
                                    </Link>
                                    <Link
                                        href={route('admin.majors.index')}
                                        style={{ color: isActive('Admin/Majors') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Majors') ? 'bold' : 'normal' }}
                                    >
                                        Majors
                                    </Link>
                                    {/* --- LINK BARU --- */}
                                    <Link
                                        href={route('admin.courses.index')}
                                        style={{ color: isActive('Admin/Courses') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Courses') ? 'bold' : 'normal' }}
                                    >
                                        Courses
                                    </Link>
                                    <Link
                                        href={route('admin.rooms.index')}
                                        style={{ color: isActive('Admin/Rooms') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Rooms') ? 'bold' : 'normal' }}
                                    >
                                        Rooms
                                    </Link>
                                    <Link
                                        href={route('admin.classes.index')}
                                        style={{ color: isActive('Admin/Classes') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Classes') ? 'bold' : 'normal' }}
                                    >
                                        Course Classes
                                    </Link>
                                    {/* ---------------- */}
                                    <Link
                                        href={route('admin.semesters.index')}
                                        style={{ color: isActive('Admin/Semesters') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Semesters') ? 'bold' : 'normal' }}
                                    >
                                        Semesters
                                    </Link>
                                    <Link
                                        href={route('admin.curriculums.index')}
                                        style={{
                                            color: isActive('Admin/Curriculums') ? 'white' : '#9ca3af',
                                            fontWeight: isActive('Admin/Curriculums') ? 'bold' : 'normal'
                                        }}
                                    >
                                        Curriculums
                                    </Link>

                                </div>
                            )}
                        </div>

                        {/* Dropdown Finance */}
                        <div>
                            <button onClick={() => setShowFinance(!showFinance)} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Finance</span>
                                <span>{ showFinance ? '−' : '+' }</span>
                            </button>
                            <Link
                                href={route('admin.cost_components.index')}
                                style={{ color: isActive('Admin/Finance/CostComponents') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Finance/CostComponents') ? 'bold' : 'normal' }}
                            >
                                Cost Components
                            </Link>
                        </div>

                    </nav>
                </div>

                {/* User & Logout */}
                {/* Dropdown Finance */}
                <div>
                    <button
                        onClick={() => setShowFinance(!showFinance)}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>Finance</span>
                        <span>{ showFinance ? '−' : '+' }</span>
                    </button>

                    {showFinance && (
                        <div
                            style={{
                                paddingLeft: '1.5rem',
                                borderLeft: '1px solid #374151',
                                marginTop: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}
                        >
                            <Link
                                href={route('admin.cost_components.index')}
                                style={{
                                    color: isActive('Admin/Finance/CostComponents') ? 'white' : '#9ca3af',
                                    fontWeight: isActive('Admin/Finance/CostComponents') ? 'bold' : 'normal'
                                }}
                            >
                                Cost Components
                            </Link>
                        </div>
                    )}
                </div>

            </aside>

            <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: '#f9fafb' }}>
                {children}
            </main>
        </div>
    );
}

