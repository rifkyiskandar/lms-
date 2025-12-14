import React, { useState, useMemo, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { PageHeader, Card, Badge, Button, EmptyState, Checkbox, ConfirmationModal, FeedbackModal } from '../../../Components/ReusableUI';
import { Billing } from '../../../types';
import StatsCard from '../../Admin/StatsCard';
import Icon from '../../../Components/Icon';
import axios from 'axios'; // Pastikan axios diimport

interface BillingProps {
    auth: any;
    billings: Billing[];
}

// Mock History
const mockHistory = [
  { id: 'TRX-998877', date: '2024-02-10', method: 'BCA Virtual Account', amount: 5000000, status: 'Paid' },
  { id: 'TRX-998878', date: '2024-02-25', method: 'QRIS', amount: 250000, status: 'Paid' },
];

const BillingIndex: React.FC<BillingProps> = ({ auth, billings }) => {

    // --- 1. AMBIL ENV CLIENT KEY DARI PROPS ---
    const { env } = usePage<any>().props;

    const [activeTab, setActiveTab] = useState<'bills' | 'history'>('bills');
    const [selectedBills, setSelectedBills] = useState<number[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [feedback, setFeedback] = useState<{isOpen: boolean, status: 'success' | 'error', title: string, message: string}>({
        isOpen: false, status: 'success', title: '', message: ''
    });

    // --- 2. LOAD SCRIPT MIDTRANS SNAP ---
    useEffect(() => {
        // Cek apakah script sudah ada agar tidak double load
        const scriptId = 'midtrans-snap-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.id = scriptId;
            // Pastikan env.midtrans_client_key sudah dikirim dari HandleInertiaRequests
            script.setAttribute('data-client-key', env?.midtrans_client_key || '');
            document.body.appendChild(script);
        }
    }, [env]);

    // Filter Logic
    const unpaidBills = useMemo(() => billings.filter(b => b.status === 'unpaid' || b.status === 'overdue'), [billings]);

    const totalSelectedAmount = useMemo(() => {
        return unpaidBills
          .filter(b => selectedBills.includes(b.billing_id))
          .reduce((sum, b) => sum + Number(b.amount), 0);
    }, [unpaidBills, selectedBills]);

    const totalUnpaid = unpaidBills.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalPaid = mockHistory.reduce((sum, h) => sum + h.amount, 0);

    const formatIDR = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const getStatusVariant = (status: string) => {
        if (status === 'paid') return 'success';
        if (status === 'overdue') return 'error';
        return 'warning';
    };

    // Handlers
    const toggleBillSelection = (id: number) => {
        setSelectedBills(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedBills.length === unpaidBills.length) setSelectedBills([]);
        else setSelectedBills(unpaidBills.map(b => b.billing_id));
    };

    // --- 3. HANDLE PAYMENT (REAL LOGIC) ---
    const handlePay = async () => {
        setIsConfirmOpen(false);

        try {
            // 1. Minta Token ke Laravel
            const response = await axios.post(route('student.payment.create'), {
                billing_ids: selectedBills
            });

            const token = response.data.snap_token;

            // 2. Munculkan Popup
            // @ts-ignore
            window.snap.pay(token, {
                onSuccess: function(result: any) {
                    setFeedback({
                        isOpen: true,
                        status: 'success',
                        title: 'Pembayaran Berhasil!',
                        message: 'Pembayaran Anda telah diterima. Sistem sedang memverifikasi transaksi.'
                    });
                    // Refresh otomatis setelah 3 detik
                    setTimeout(() => window.location.reload(), 3000);
                },
                onPending: function(result: any) {
                    setFeedback({
                        isOpen: true,
                        status: 'success', // Tetap hijau karena proses dimulai
                        title: 'Menunggu Pembayaran',
                        message: 'Silakan selesaikan pembayaran sesuai instruksi.'
                    });
                },
                onError: function(result: any) {
                    setFeedback({
                        isOpen: true,
                        status: 'error',
                        title: 'Pembayaran Gagal',
                        message: 'Terjadi kesalahan pada transaksi. Silakan coba lagi.'
                    });
                },
            });
        } catch (error) {
            console.error(error);
            alert("Gagal memproses pembayaran");
        }
    };

    return (
        <StudentLayout user={auth.user}>
            <Head title="Keuangan & Pembayaran" />

            <div className="flex flex-col gap-6 animate-fade-in-up relative pb-24">
                <PageHeader title="Keuangan & Pembayaran" subtitle="Kelola tagihan kuliah dan riwayat pembayaran Anda." />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard
                        title="Total Tagihan (Belum Lunas)"
                        value={formatIDR(totalUnpaid)}
                        trend={`${unpaidBills.length} Tagihan Aktif`}
                        trendType={unpaidBills.length > 0 ? 'negative' : 'neutral'}
                        icon="receipt_long"
                        color="warning"
                    />
                    <StatsCard
                        title="Total Telah Dibayar"
                        value={formatIDR(totalPaid)}
                        trend="Akumulasi Pembayaran"
                        trendType="positive"
                        icon="history"
                        color="success"
                    />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 mt-2">
                    <button onClick={() => setActiveTab('bills')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'bills' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Tagihan Aktif ({unpaidBills.length})</button>
                    <button onClick={() => setActiveTab('history')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Riwayat Pembayaran</button>
                </div>

                {/* Content */}
                {activeTab === 'bills' ? (
                    <div className="flex flex-col gap-4">
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 w-12">
                                                <Checkbox checked={unpaidBills.length > 0 && selectedBills.length === unpaidBills.length} onChange={toggleSelectAll} disabled={unpaidBills.length === 0} />
                                            </th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Deskripsi Tagihan</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Jatuh Tempo</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {unpaidBills.length > 0 ? unpaidBills.map(bill => (
                                            <tr key={bill.billing_id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selectedBills.includes(bill.billing_id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <Checkbox checked={selectedBills.includes(bill.billing_id)} onChange={() => toggleBillSelection(bill.billing_id)} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{bill.description}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{bill.cost_component?.component_name} • {bill.semester?.semester_name}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(bill.due_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4"><Badge variant={getStatusVariant(bill.status)} className="uppercase text-[10px]">{bill.status}</Badge></td>
                                                <td className="px-6 py-4 text-right font-mono font-medium text-gray-900 dark:text-white">{formatIDR(Number(bill.amount))}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 italic">Tidak ada tagihan aktif.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID Transaksi</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Metode</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                         {mockHistory.map(item => (
                                             <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                 <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.id}</td>
                                                 <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.date}</td>
                                                 <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.method}</td>
                                                 <td className="px-6 py-4"><Badge variant="success">{item.status}</Badge></td>
                                                 <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 dark:text-white">{formatIDR(item.amount)}</td>
                                             </tr>
                                         ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Floating Payment Bar */}
                {activeTab === 'bills' && selectedBills.length > 0 && (
                    <div className="fixed bottom-6 left-0 right-0 sm:left-64 px-6 animate-fade-in-up z-40">
                        <div className="max-w-4xl mx-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-700 dark:border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center">
                                    <Icon name="receipt_long" className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">{selectedBills.length} Tagihan Dipilih</p>
                                    <p className="text-2xl font-bold font-mono">{formatIDR(totalSelectedAmount)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button variant="secondary" onClick={() => setSelectedBills([])} className="flex-1 sm:flex-none border-0 bg-white/10 text-white hover:bg-white/20 dark:bg-black/5 dark:text-gray-800 dark:hover:bg-black/10">Batal</Button>
                                <Button onClick={() => setIsConfirmOpen(true)} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/30">Bayar Sekarang <Icon name="arrow_forward" /></Button>
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handlePay} title="Konfirmasi Pembayaran" message={<>Anda akan melakukan pembayaran untuk <b>{selectedBills.length} tagihan</b> dengan total <b className="text-lg text-primary">{formatIDR(totalSelectedAmount)}</b>. Lanjutkan?</>} confirmLabel="Lanjut Bayar" />
                <FeedbackModal isOpen={feedback.isOpen} onClose={() => setFeedback({...feedback, isOpen: false})} status={feedback.status} title={feedback.title} message={feedback.message} />
            </div>
        </StudentLayout>
    );
}

export default BillingIndex;
