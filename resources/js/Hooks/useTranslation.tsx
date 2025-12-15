import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    // Mengambil props 'translations' yang dikirim dari HandleInertiaRequests.php
    // Kita gunakan <any> di sini agar tidak error TypeScript soal tipe data
    const { translations } = usePage<any>().props;

    /**
     * Fungsi Translate
     * @param key Kata kunci dalam Bahasa Inggris (Default)
     */
    const t = (key: string): string => {
        // 1. Cek apakah daftar terjemahan ada?
        if (!translations) {
            return key; // Kalau belum ada data, kembalikan teks asli
        }

        // 2. Cek apakah key tersebut ada terjemahannya di file JSON?
        // Jika ada pakai itu, jika tidak pakai key aslinya.
        return translations[key] || key;
    };

    return { t };
}
