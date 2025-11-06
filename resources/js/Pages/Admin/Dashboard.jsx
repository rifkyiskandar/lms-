import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    // Ambil data user dari props
    const { auth } = usePage().props;

    return (
        // Gunakan AdminLayout sebagai pembungkus
        <AdminLayout>
            <Head title="Admin Dashboard" />

            {/* Ini adalah konten halaman Anda */}
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Selamat Datang, { auth.user.full_name }!
                </h1>
                <p>Ini adalah halaman dashboard admin Anda.</p>
                <p>Anda telah berhasil login dan semua setup Inertia, Rute, dan Middleware Anda bekerja dengan benar.</p>
            </div>

        </AdminLayout>
    );
}
