import React, { useState, useMemo, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { User, NavItem } from '../types';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

interface StudentLayoutProps {
    children: React.ReactNode;
    user?: User;
}

interface PageProps {
    auth: { user: User; };
    component: string;
    [key: string]: any;
}

export default function StudentLayout({ children, user }: StudentLayoutProps) {
    const { props, component } = usePage<PageProps>();
    const currentUser = user || props.auth.user;

    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return true;
            }
        }
        return false;
    });
    const [language, setLanguage] = useState<'en' | 'id'>('en');

    useEffect(() => {
        const root = window.document.documentElement;
        isDark ? root.classList.add('dark') : root.classList.remove('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    // --- MENU NAVIGASI KHUSUS MAHASISWA ---
    const navItems: NavItem[] = useMemo(() => [
        {
            id: route('student.dashboard'),
            label: 'Dashboard',
            icon: 'dashboard',
            active: component === 'Student/Dashboard'
        },
        {
            label: 'Academics',
            icon: 'school',
            children: [
                // --- PERBAIKAN DI SINI: Hubungkan ke Catalog ---
                {
                    label: 'List Courses',
                    icon: 'history_edu',
                    id: route('student.catalog.index'), // Gunakan route catalog
                    active: component.startsWith('Student/Catalog') // Highlight jika sedang di halaman catalog
                },
                {
                    label: 'KRS (Plan Study)',
                    icon: 'edit_document',
                    id: route('student.krs.create'),
                    active: component.startsWith('Student/KRS')
                }
            ]
        },
        {
            label: 'Finance',
            icon: 'payments',
            children: [
                {
                    label: 'Tuition Bills',
                    icon: 'receipt_long',
                    id: route('student.bills.index'),
                    active: component.startsWith('Student/Billing')
                }
            ]
        }
    ], [component]);

    const handleNavigate = (destination: string) => {
        if (destination === 'logout') {
            router.post(route('logout'));
        }
        else if (destination === 'profile') {
            router.get(route('student.profile.edit'));
        }
        else if (destination && !destination.startsWith('#')) {
            router.visit(destination);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background-dark transition-colors duration-200 font-sans">
            <Sidebar navItems={navItems} onNavigate={handleNavigate} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header
                    onNavigate={handleNavigate}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    language={language}
                    toggleLanguage={() => setLanguage(l => l === 'en' ? 'id' : 'en')}
                    user={{
                        name: currentUser.full_name,
                        avatar: currentUser.profile_picture || '',
                        role: 'Student'
                    }}
                />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
