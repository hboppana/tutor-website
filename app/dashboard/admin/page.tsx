'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ScheduleManagementCard from '@/app/components/ScheduleManagementCard';
import UsersTable from '@/app/components/UsersTable';

export interface UserWithAmount {
  email: string;
  name: string;
  totalOwed: number;
  bookingCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [totalOwed, setTotalOwed] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/admin-users-with-amounts');
      if (!res.ok) throw new Error('Failed to fetch users');
      const userData: UserWithAmount[] = await res.json();
      
      // Calculate total amount owed from all users
      const totalAmount = userData.reduce((sum, user) => sum + user.totalOwed, 0);
      const totalBookings = userData.reduce((sum, user) => sum + user.bookingCount, 0);
      
      setTotalOwed(totalAmount);
      setBookingCount(totalBookings);
      setUserCount(userData.length);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'hboppana01@gmail.com') {
        router.push('/login');
        return;
      }

      // Set username from user metadata or email
      setUsername(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin');

      // Fetch user data and calculate totals
      await fetchUserData();

      setIsLoading(false);
    };

    checkAdmin();

    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchUserData, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="moving-gradient">
      {/* Ambient glow */}
      <div className="ambient-glow" />

      <nav className="relative z-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="font-display text-2xl md:text-3xl font-medium text-white tracking-tight">Welcome, <span className="italic text-sky-300">{username}</span></h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="btn-back"
              >
                <Image
                  src="/logout-icon.svg"
                  alt="Logout"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* KPI row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-5 sm:grid-cols-3"
        >
          {[
            {
              label: 'Total Outstanding',
              value: `$${totalOwed.toFixed(2)}`,
              sub: `Across ${bookingCount} confirmed session${bookingCount !== 1 ? 's' : ''}`,
            },
            { label: 'Total Users', value: userCount, sub: 'With registered accounts' },
            { label: 'Confirmed Sessions', value: bookingCount, sub: 'Booked all-time' },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card">
              <div className="text-xs font-medium uppercase tracking-wide text-blue-100/60">{kpi.label}</div>
              <div className="mt-3 font-display text-4xl font-medium tracking-tight text-white">{kpi.value}</div>
              <div className="mt-1 text-sm text-blue-100/50">{kpi.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Content row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          {/* Users table — primary panel */}
          <div className="lg:col-span-3">
            <UsersTable />
          </div>

          {/* Scheduling — side panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-5">Schedule Management</h3>
            <div className="h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <ScheduleManagementCard />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 