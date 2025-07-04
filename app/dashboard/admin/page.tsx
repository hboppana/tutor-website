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
    <div className="moving-gradient font-['Poppins']">
      {/* GridLines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8), transparent)'
        }} />
      </div>

      {/* Animated Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(59, 130, 246, 0.1)"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave-delayed" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(59, 130, 246, 0.05)"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <nav className="relative z-10 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl md:text-3xl font-semibold text-white font-['Poppins'] tracking-tight">Welcome, {username}!</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="btn-back font-['Poppins']"
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

      <main className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-6 md:col-span-2">
              {/* Total Money Owed Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-white font-['Poppins']">Amount Owed</h3>
                  <div className="mt-4 text-5xl font-semibold text-white tracking-tight font-['Poppins']">
                    ${totalOwed.toFixed(2)}
                  </div>
                  <div className="mt-2 text-sm text-white/70 font-['Poppins']">
                    From {bookingCount} confirmed session{bookingCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </motion.div>

              {/* Users Table Card */}
              <UsersTable />
            </div>

            {/* Cal.com Widget Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 flex items-center justify-center"
            >
              <div className="px-4 py-5 sm:p-6 w-full max-w-lg">
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 font-['Poppins']">Schedule Management</h3>
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl overflow-hidden border border-white/10 shadow-2xl h-[400px]">
                  <ScheduleManagementCard />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 