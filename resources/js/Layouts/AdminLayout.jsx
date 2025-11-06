import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const { component } = usePage();

    // State untuk dropdown
    const [showAcademics, setShowAcademics] = useState(
        // Buka dropdown jika kita berada di salah satu halaman akademik
        component.startsWith('Admin/Academics')
    );
    const [showFinance, setShowFinance] = useState(
        component.startsWith('Admin/Finance')
    );

    // Fungsi untuk mengecek apakah link aktif
    const isActive = (pageName) => component === pageName;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem' }}>LMS Admin</h1>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        {/* 1. Dashboard */}
                        <Link
                            href={route('admin.dashboard')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                backgroundColor: isActive('Admin/Dashboard') ? '#374151' : 'transparent'
                            }}
                        >
                            Dashboard
                        </Link>

                        {/* 2. User Management */}
                        <Link
                            href={route('admin.users.index')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                backgroundColor: component.startsWith('Admin/Users') ? '#374151' : 'transparent'
                            }}
                        >
                            User Management
                        </Link>

                        {/* 3. Dropdown Academics */}
                        <div>
                            <button onClick={() => setShowAcademics(!showAcademics)} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Academics</span>
                                <span>{ showAcademics ? '−' : '+' }</span>
                            </button>
                            {showAcademics && (
                                <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid #374151', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Link
                                        href={route('admin.faculties.index')}
                                        style={{ color: isActive('Admin/Faculties/Index') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Faculties/Index') ? 'bold' : 'normal' }}
                                    >
                                        Faculties
                                    </Link>
                                    <Link
                                        href={route('admin.majors.index')}
                                        style={{ color: isActive('Admin/Majors/Index') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Majors/Index') ? 'bold' : 'normal' }}
                                    >
                                        Majors
                                    </Link>
                                    <Link
                                        href={route('admin.semesters.index')}
                                        style={{ color: isActive('Admin/Semesters/Index') ? 'white' : '#9ca3af', fontWeight: isActive('Admin/Semesters/Index') ? 'bold' : 'normal' }}
                                    >
                                        Semesters
                                    </Link>
                                    {/* Link lain akan ditambahkan di sini */}
                                </div>
                            )}
                        </div>

                        {/* 4. Dropdown Finance (belum aktif) */}
                        <div>
                            <button onClick={() => setShowFinance(!showFinance)} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Finance</span>
                                <span>{ showFinance ? '−' : '+' }</span>
                            </button>
                        </div>

                    </nav>
                </div>

                {/* User & Logout */}
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>Logged in as:</span>
                        <br />
                        <span style={{ fontWeight: 600 }}>{auth.user.full_name}</span>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        style={{ width: '100%', backgroundColor: '#dc2626', color: 'white', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', cursor: 'pointer' }}
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: '#f9fafb' }}>
                {children}
            </main>
        </div>
    );
}
