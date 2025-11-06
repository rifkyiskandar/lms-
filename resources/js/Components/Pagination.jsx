import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div style={{ marginTop: '1rem' }}>
            {links.map((link, index) => (
                // --- INI PERBAIKANNYA ---
                // Cek apakah link.url ada isinya.
                // Jika tidak ada (null), render <span>.
                // Jika ada, render <Link>.
                !link.url ? (
                    <span
                        key={index}
                        // Tampilkan label (misal: "Previous")
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        style={{
                            padding: '0.5rem 0.75rem',
                            margin: '0.25rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            color: '#9ca3af', // Buat jadi abu-abu
                            cursor: 'default',
                        }}
                    />
                ) : (
                    <Link
                        key={index}
                        href={link.url} // <-- Sekarang ini dijamin aman (tidak akan pernah null)
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        style={{
                            padding: '0.5rem 0.75rem',
                            margin: '0.25rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '4px',
                            // Styling untuk link aktif
                            backgroundColor: link.active ? '#135bec' : 'white',
                            color: link.active ? 'white' : 'black',
                            cursor: 'pointer',
                        }}
                    />
                )
                // --- AKHIR PERBAIKAN ---
            ))}
        </div>
    );
}
