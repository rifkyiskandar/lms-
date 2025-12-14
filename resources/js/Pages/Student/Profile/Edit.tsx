import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { FeedbackModal } from '../../../Components/ReusableUI';
import Icon from '../../../Components/Icon';

interface Props {
    auth: any;
    profile: {
        fullName: string;
        email: string;
        nim: string;
        faculty: string;
        major: string;
        semester: number;
        batchYear: string;
        gpa: number;
        phone: string;
        birthDate: string;
        address: string;
        photo: string | null;
        nickname: string;
        dreamJob: string;
        goals: string;
        quote: string;
    };
    grades: Array<{
        semester: number;
        code: string;
        name: string;
        sks: number;
        grade: string;
    }>;
    flash: { success?: string; error?: string };
}

const StudentProfileView: React.FC<Props> = ({ auth, profile, grades, flash }) => {

  const [activeTab, setActiveTab] = useState<'pribadi' | 'keamanan' | 'akademik' | 'tentang' | 'nilai'>('pribadi');
  const [editStates, setEditStates] = useState({ pribadi: false, keamanan: false, tentang: false });

  const [feedback, setFeedback] = useState<{isOpen: boolean, status: 'success' | 'error', title: string, message: string}>({
    isOpen: false, status: 'success', title: '', message: ''
  });

  // Ref untuk input file (Dipindah ke Tab Informasi Pribadi)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (flash?.success) setFeedback({ isOpen: true, status: 'success', title: 'Berhasil', message: flash.success });
    if (flash?.error) setFeedback({ isOpen: true, status: 'error', title: 'Gagal', message: flash.error });
  }, [flash]);

  const { data, setData, patch, put, processing, errors, reset } = useForm({
    phone: profile.phone || '',
    nickname: profile.nickname || '',
    dreamJob: profile.dreamJob || '',
    goals: profile.goals || '',
    quote: profile.quote || '',
    current_password: '',
    password: '',
    password_confirmation: '',
    profile_picture: null as File | null,
  });

  const [showPassword, setShowPassword] = useState<{current: boolean, new: boolean, confirm: boolean}>({
    current: false, new: false, confirm: false
  });

  // --- Handle Photo Change (Hanya Update State & Preview) ---
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // 1. Simpan file ke form data
          setData('profile_picture', file);

          // 2. Update preview lokal
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const toggleEdit = (tab: 'pribadi' | 'keamanan' | 'tentang') => {
    setEditStates(prev => ({ ...prev, [tab]: !prev[tab] }));
    if (tab === 'keamanan' && !editStates.keamanan) {
        reset('current_password', 'password', 'password_confirmation');
    }
  };

  const handleCancel = (tab: 'pribadi' | 'keamanan' | 'tentang') => {
      setEditStates(prev => ({ ...prev, [tab]: false }));
      if (tab === 'pribadi') {
          // Reset data pribadi termasuk foto
          setData(d => ({
              ...d,
              phone: profile.phone || '',
              nickname: profile.nickname || '',
              profile_picture: null
          }));
          setPreviewImage(null); // Reset preview
      }
      if (tab === 'keamanan') {
          reset('current_password', 'password', 'password_confirmation');
      }
  };

  const handleSave = (tab: 'pribadi' | 'keamanan' | 'tentang') => {
    if (tab === 'pribadi') {
        // KHUSUS PRIBADI: Gunakan router.post dengan _method: PATCH
        // Ini diperlukan agar File Upload (Multipart) bisa dikirim lewat method spoofing Laravel
        router.post(route('student.profile.update'), {
            _method: 'patch',
            phone: data.phone,
            nickname: data.nickname,
            profile_picture: data.profile_picture, // File dikirim di sini
        }, {
            forceFormData: true, // Wajib untuk file upload
            onSuccess: () => {
                setEditStates(prev => ({ ...prev, [tab]: false }));
                // Preview tetap dipertahankan sampai refresh atau diganti lagi
            },
            preserveScroll: true
        });

    } else if (tab === 'keamanan') {
        put(route('student.password.update'), {
            onSuccess: () => {
                setEditStates(prev => ({ ...prev, keamanan: false }));
                reset('current_password', 'password', 'password_confirmation');
            },
            preserveScroll: true
        });
    } else {
        // Untuk tab lain (Tentang Saya), pakai patch biasa dari useForm
        patch(route('student.profile.update'), {
            onSuccess: () => {
                setEditStates(prev => ({ ...prev, [tab]: false }));
            },
            preserveScroll: true
        });
    }
  };

  return (
    <StudentLayout user={auth.user}>
        <Head title="Profil Mahasiswa" />

        <div className="w-full max-w-7xl mx-auto animate-fade-in-up">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between gap-3">
                    <div className="flex min-w-72 flex-col gap-2">
                        <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Profil Mahasiswa</p>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Kelola informasi akun dan data akademik Anda di sini.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card (Static Display) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-[#19222c] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                            <div className="flex w-full flex-col gap-4 items-center text-center">
                                {/* FOTO PROFIL (DISPLAY ONLY - PREVIEW AKTIF) */}
                                <div className="relative group">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-slate-100 dark:border-slate-700 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 overflow-hidden"
                                        style={
                                            previewImage
                                            ? { backgroundImage: `url(${previewImage})` }
                                            : profile.photo
                                                ? { backgroundImage: `url(${profile.photo})` }
                                                : {}
                                        }
                                    >
                                        {!profile.photo && !previewImage && profile.fullName.charAt(0)}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center gap-1">
                                    <p className="text-slate-900 dark:text-white text-xl font-bold leading-tight">{profile.fullName}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal font-mono">{profile.nim}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal mt-2">{profile.faculty} | {profile.major}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Semester {profile.semester}</span>
                                        <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded-full dark:bg-slate-800 dark:text-slate-300">Angkatan {profile.batchYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content Tabs */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-[#19222c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                            {/* Tabs Header */}
                            <div className="overflow-x-auto">
                                <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 min-w-max">
                                    {[
                                        { id: 'pribadi', label: 'Informasi Pribadi', icon: 'person' },
                                        { id: 'keamanan', label: 'Akun & Keamanan', icon: 'shield_person' },
                                        { id: 'akademik', label: 'Data Akademik', icon: 'school' },
                                        { id: 'tentang', label: 'Tentang Saya', icon: 'favorite' },
                                        { id: 'nilai', label: 'Riwayat Nilai', icon: 'history_edu' },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex items-center gap-2 border-b-2 py-4 transition-colors ${
                                                activeTab === tab.id
                                                    ? 'border-b-primary text-primary'
                                                    : 'border-b-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                            <p className="text-sm font-bold leading-normal">{tab.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* TAB: Informasi Pribadi */}
                            {activeTab === 'pribadi' && (
                                <div className="p-6 animate-fade-in">
                                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave('pribadi'); }}>

                                        {/* Bagian Foto Profil (Sesuai Request) */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Foto Profil</label>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 bg-gray-200 flex items-center justify-center text-2xl text-gray-400 border border-slate-200 dark:border-slate-700"
                                                    style={
                                                        previewImage
                                                        ? { backgroundImage: `url(${previewImage})` }
                                                        : profile.photo
                                                            ? { backgroundImage: `url(${profile.photo})` }
                                                            : {}
                                                    }
                                                >
                                                     {!profile.photo && !previewImage && <span className="material-symbols-outlined">person</span>}
                                                </div>

                                                {/* Button hanya muncul saat edit */}
                                                {editStates.pribadi ? (
                                                    <div>
                                                        <button
                                                            className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            Ubah Foto
                                                        </button>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, GIF, atau PNG. Ukuran maks. 800K.</p>
                                                        {/* Hidden Input */}
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handlePhotoChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-500 italic">
                                                        Klik "Edit Data" untuk mengubah foto.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* End Bagian Foto Profil */}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                                                <div className="py-2.5 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-between">
                                                    <span>{profile.fullName}</span>
                                                    <span className="material-symbols-outlined text-lg text-slate-400">lock</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Panggilan</label>
                                                {editStates.pribadi ? (
                                                    <input
                                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                                                        type="text"
                                                        value={data.nickname}
                                                        onChange={(e) => setData('nickname', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="py-2.5 px-4 text-slate-900 dark:text-white font-medium">
                                                        {data.nickname || '-'}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir</label>
                                                <div className="py-2.5 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-between">
                                                    <span>{profile.birthDate || '-'}</span>
                                                    <span className="material-symbols-outlined text-lg text-slate-400">lock</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon</label>
                                                {editStates.pribadi ? (
                                                    <input
                                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                    />
                                                ) : (
                                                    <div className="py-2.5 px-4 text-slate-900 dark:text-white font-medium">
                                                        {data.phone || '-'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 gap-3">
                                            {editStates.pribadi ? (
                                                <>
                                                    <button type="button" onClick={() => handleCancel('pribadi')} className="font-medium text-sm py-2.5 px-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                                                    <button type="submit" disabled={processing} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50">Simpan Perubahan</button>
                                                </>
                                            ) : (
                                                <button type="button" onClick={() => toggleEdit('pribadi')} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                                    <span className="material-symbols-outlined text-base">edit</span> Edit Data
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* TAB: Akun & Keamanan */}
                            {activeTab === 'keamanan' && (
                                <div className="p-6 animate-fade-in">
                                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave('keamanan'); }}>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                            <div className="py-2.5 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-between">
                                                <span>{profile.email}</span>
                                                <span className="material-symbols-outlined text-lg text-slate-400">lock</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <p className="text-base font-bold text-slate-900 dark:text-white">Kata Sandi</p>
                                            </div>

                                            {editStates.keamanan ? (
                                                <div className="grid grid-cols-1 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Saat Ini</label>
                                                        <div className="relative">
                                                            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-2.5 pr-10 outline-none transition-all" type={showPassword.current ? "text" : "password"} value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                                                            <span className="material-symbols-outlined text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer hover:text-slate-600" onClick={() => setShowPassword(prev => ({...prev, current: !prev.current}))}>
                                                                {showPassword.current ? 'visibility' : 'visibility_off'}
                                                            </span>
                                                        </div>
                                                        {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Baru</label>
                                                        <div className="relative">
                                                            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-2.5 pr-10 outline-none transition-all" type={showPassword.new ? "text" : "password"} value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                                            <span className="material-symbols-outlined text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer hover:text-slate-600" onClick={() => setShowPassword(prev => ({...prev, new: !prev.new}))}>
                                                                {showPassword.new ? 'visibility' : 'visibility_off'}
                                                            </span>
                                                        </div>
                                                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Kata Sandi</label>
                                                        <div className="relative">
                                                            <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-2.5 pr-10 outline-none transition-all" type={showPassword.confirm ? "text" : "password"} value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                                            <span className="material-symbols-outlined text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer hover:text-slate-600" onClick={() => setShowPassword(prev => ({...prev, confirm: !prev.confirm}))}>
                                                                {showPassword.confirm ? 'visibility' : 'visibility_off'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-slate-400">key</span>
                                                        <span className="text-slate-700 dark:text-slate-300 text-2xl leading-none pt-2">••••••••</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">Amankan akun Anda</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end pt-4 gap-3">
                                            {editStates.keamanan ? (
                                                <>
                                                    <button type="button" onClick={() => handleCancel('keamanan')} className="font-medium text-sm py-2.5 px-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                                                    <button type="submit" disabled={processing} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50">Simpan Perubahan</button>
                                                </>
                                            ) : (
                                                <button type="button" onClick={() => toggleEdit('keamanan')} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                                                    <span className="material-symbols-outlined text-base">lock_reset</span> Ubah Kata Sandi
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* TAB: Data Akademik */}
                            {activeTab === 'akademik' && (
                                <div className="p-6 animate-fade-in">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {[
                                            { label: 'NIM', value: profile.nim },
                                            { label: 'Fakultas', value: profile.faculty },
                                            { label: 'Program Studi', value: profile.major },
                                            { label: 'IPK', value: profile.gpa },
                                            { label: 'Semester', value: profile.semester },
                                            { label: 'Angkatan', value: profile.batchYear },
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-center border border-slate-100 dark:border-slate-700">
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB: Tentang Saya */}
                            {activeTab === 'tentang' && (
                                <div className="p-6 animate-fade-in">
                                    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave('tentang'); }}>
                                        <div>
                                            {editStates.tentang ? (
                                                <div>
                                                    <label className="flex text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                                                        <span className="material-symbols-outlined text-primary text-lg">rocket_launch</span>
                                                        Cita-cita
                                                    </label>
                                                    <input className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-3 outline-none transition-all" type="text" value={data.dreamJob} onChange={(e) => setData('dreamJob', e.target.value)} placeholder="Contoh: Software Engineer" />
                                                </div>
                                            ) : (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-xl flex items-center gap-5 transition-all hover:shadow-sm">
                                                    <div className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center shadow-sm">
                                                        <Icon name="rocket_launch" className="text-3xl" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide mb-1">Cita-cita</p>
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.dreamJob || '-'}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col h-full">
                                                {editStates.tentang ? (
                                                    <div className="h-full">
                                                        <label className="flex text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                                                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">flag</span>
                                                            Tujuan Saya
                                                        </label>
                                                        <textarea className="w-full h-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-3 outline-none transition-all resize-none" value={data.goals} onChange={(e) => setData('goals', e.target.value)}></textarea>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/50 p-6 rounded-xl h-full flex flex-col transition-all hover:shadow-sm">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Icon name="flag" className="text-green-600 dark:text-green-400" />
                                                            <p className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Tujuan Saya</p>
                                                        </div>
                                                        <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed flex-1">
                                                            {data.goals || '-'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col h-full">
                                                {editStates.tentang ? (
                                                    <div className="h-full">
                                                        <label className="flex text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                                                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-lg">format_quote</span>
                                                            Kutipan Favorit
                                                        </label>
                                                        <textarea className="w-full h-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white px-4 py-3 outline-none transition-all resize-none" value={data.quote} onChange={(e) => setData('quote', e.target.value)}></textarea>
                                                    </div>
                                                ) : (
                                                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/50 p-6 rounded-xl h-full flex flex-col justify-center items-center text-center relative transition-all hover:shadow-sm">
                                                        <div className="absolute top-4 left-4 text-purple-200 dark:text-purple-800">
                                                            <span className="text-6xl font-serif leading-none">“</span>
                                                        </div>
                                                        <p className="text-lg font-serif italic text-slate-800 dark:text-slate-200 relative z-10 px-4">
                                                            {data.quote || '-'}
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-2">
                                                            <div className="h-0.5 w-8 bg-purple-300 dark:bg-purple-700"></div>
                                                            <Icon name="format_quote" className="text-purple-400 dark:text-purple-500" />
                                                            <div className="h-0.5 w-8 bg-purple-300 dark:bg-purple-700"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 gap-3 border-t border-slate-100 dark:border-slate-800">
                                            {editStates.tentang ? (
                                                <>
                                                    <button type="button" onClick={() => handleCancel('tentang')} className="font-medium text-sm py-2.5 px-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Batal</button>
                                                    <button type="submit" disabled={processing} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50">Simpan Perubahan</button>
                                                </>
                                            ) : (
                                                <button type="button" onClick={() => toggleEdit('tentang')} className="font-bold text-sm py-2.5 px-6 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                                    <span className="material-symbols-outlined text-base">edit</span> Edit Data
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* TAB: Riwayat Nilai */}
                            {activeTab === 'nilai' && (
                                <div className="p-6 animate-fade-in">
                                    <div className="flex flex-col gap-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Nilai Akademik</h3>
                                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                                <thead className="bg-slate-50 dark:bg-slate-800">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kode MK</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Mata Kuliah</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKS</th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nilai</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-[#19222c] divide-y divide-slate-200 dark:divide-slate-800">
                                                    {grades.length > 0 ? grades.map((grade, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{grade.semester}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">{grade.code}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{grade.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600 dark:text-slate-300">{grade.sks}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-center text-slate-800 dark:text-slate-200">{grade.grade}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">Belum ada riwayat nilai.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <FeedbackModal
                isOpen={feedback.isOpen}
                onClose={() => setFeedback({...feedback, isOpen: false})}
                status={feedback.status}
                title={feedback.title}
                message={feedback.message}
            />
        </div>
    </StudentLayout>
  );
};

export default StudentProfileView;
