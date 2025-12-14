import React, { useState, useMemo, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { User, NavItem } from '../types';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

interface AdminLayoutProps {
    children: React.ReactNode;
    user?: User;
}

interface PageProps {
    auth: {
        user: User;
    };
    component: string;
    [key: string]: any;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
    const { props, component } = usePage<PageProps>();
    const currentUser = user || props.auth.user;

    // --- LOGIC THEME BARU ---
    // 1. Default state: Cek localStorage dulu, kalau kosong baru cek system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            // Cek penyimpanan browser
            const savedTheme = localStorage.getItem('theme');
            // Jika user pernah set 'dark', atau belum pernah set tapi laptopnya dark mode
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return true;
            }
        }
        return false;
    });

    const [language, setLanguage] = useState<'en' | 'id'>('en');

    // 2. Effect untuk menerapkan class 'dark' ke tag <html>
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark'); // Simpan pilihan user
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light'); // Simpan pilihan user
        }
    }, [isDark]);

    // 3. Fungsi Toggle yang dipanggil dari Header
    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    // --- Definisi Menu Navigasi ---
    const navItems: NavItem[] = useMemo(() => [
        {
            id: route('admin.dashboard'),
            label: 'Dashboard',
            icon: 'dashboard',
            active: component === 'Admin/Dashboard'
        },
        {
            id: route('admin.users.index'),
            label: 'User Management',
            icon: 'group',
            active: component.startsWith('Admin/Users')
        },
        {
            label: 'Academics',
            icon: 'school',
            children: [
                {
                    id: route('admin.faculties.index'),
                    label: 'Faculties',
                    icon: 'domain',
                    active: component.startsWith('Admin/Faculties')
                },
                {
                    id: route('admin.majors.index'),
                    label: 'Majors',
                    icon: 'school',
                    active: component.startsWith('Admin/Majors')
                },
                {
                    id: route('admin.courses.index'),
                    label: 'Courses',
                    icon: 'menu_book',
                    active: component.startsWith('Admin/Courses')
                },
                {
                    id: route('admin.rooms.index'),
                    label: 'Rooms',
                    icon: 'meeting_room',
                    active: component.startsWith('Admin/Rooms')
                },
                {
                    id: route('admin.classes.index'),
                    label: 'Classes',
                    icon: 'class',
                    active: component.startsWith('Admin/Classes')
                },
                {
                    id: route('admin.semesters.index'),
                    label: 'Semesters',
                    icon: 'calendar_month',
                    active: component.startsWith('Admin/Semesters')
                },
                {
                    id: route('admin.curriculums.index'),
                    label: 'Curriculums',
                    icon: 'account_tree',
                    active: component.startsWith('Admin/Curriculums')
                }
            ]
        },
        {
            label: 'Finance',
            icon: 'payments',
            children: [
                {
                    id: route('admin.cost_components.index'),
                    label: 'Cost Components',
                    icon: 'monetization_on',
                    active: component.startsWith('Admin/Finance/CostComponents')
                }
            ]
        }
    ], [component]);

    // --- Handler Navigasi ---
    const handleNavigate = (destination: string) => {
        if (destination === 'logout') {
            router.post(route('logout'));
        } else if (destination === 'profile') {
            router.get(route('profile.edit'));
        } else {
            router.visit(destination);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-200 font-sans">
            <Sidebar
                navItems={navItems}
                onNavigate={handleNavigate}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header
                    onNavigate={handleNavigate}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    language={language}
                    toggleLanguage={() => setLanguage(lang => lang === 'en' ? 'id' : 'en')}
                    user={{ name: currentUser.full_name, avatar: '' }}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
