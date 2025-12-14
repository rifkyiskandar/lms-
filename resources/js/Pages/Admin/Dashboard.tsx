import React from 'react';
import { Head } from '@inertiajs/react'; // Jangan lupa Head untuk title tab browser
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageHeader, Card } from '../../Components/ReusableUI';

// Interface Props dari Controller
interface DashboardProps {
    auth: any;
    stats: {
        students: { total: number; new_this_month: number; };
        lecturers: { total: number; };
        courses: { total: number; };
        revenue: { total: number; this_month: number; };
    };
    recent_activities: any[]; // Tipe detail ada di RecentActivity.tsx
}

const Dashboard: React.FC<DashboardProps> = ({ auth, stats, recent_activities }) => {

  // Helper Format Rupiah
  const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <AdminLayout user={auth.user}>
      <Head title="Dashboard" />

      <div className="space-y-8 animate-fade-in-up">
        {/* Page Heading */}
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${auth.user.full_name}`}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats.students.total.toLocaleString()}
            trend={`+${stats.students.new_this_month} this month`}
            trendType="positive"
            icon="school"
            color="info"
          />
          <StatsCard
            title="Total Instructors"
            value={stats.lecturers.total.toLocaleString()}
            trend="Active Faculty"
            trendType="neutral"
            icon="cast_for_education"
            color="warning"
          />
          <StatsCard
            title="Active Courses"
            value={stats.courses.total}
            trend="Current Curriculum"
            trendType="neutral"
            icon="menu_book"
            color="primary"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.revenue.total)}
            trend={`+${formatCurrency(stats.revenue.this_month)} this month`}
            trendType="positive"
            icon="payments"
            color="success"
          />
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Activity Panel (Lebar 2 Kolom) */}
          <div className="lg:col-span-2">
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Payments</h3>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">View Report</button>
                </div>
                <RecentActivity activities={recent_activities} />
              </Card>
          </div>

          {/* Quick Actions / Info Panel (Lebar 1 Kolom) */}
           <div className="lg:col-span-1">
               <Card className="p-6 h-full bg-gradient-to-br from-primary to-primary/80 text-white border-none">
                   <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
                   <p className="text-primary-100 text-sm mb-6">Shortcuts for common administrative tasks.</p>

                   <div className="flex flex-col gap-3">
                       <button className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg text-left flex items-center gap-3 text-sm font-medium backdrop-blur-sm">
                           <div className="p-1 bg-white text-primary rounded"><span className="material-symbols-outlined text-lg block">person_add</span></div>
                           Register New Student
                       </button>
                       <button className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg text-left flex items-center gap-3 text-sm font-medium backdrop-blur-sm">
                           <div className="p-1 bg-white text-primary rounded"><span className="material-symbols-outlined text-lg block">post_add</span></div>
                           Create Invoice
                       </button>
                       <button className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg text-left flex items-center gap-3 text-sm font-medium backdrop-blur-sm">
                           <div className="p-1 bg-white text-primary rounded"><span className="material-symbols-outlined text-lg block">campaign</span></div>
                           Make Announcement
                       </button>
                   </div>
               </Card>
           </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
