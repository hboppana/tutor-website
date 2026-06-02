'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ScheduleManagementCard from '@/app/components/ScheduleManagementCard';
import { calculateAmountOwedForUser, BookingAmount } from '@/app/lib/booking-calculations';

export default function TuteeDashboard() {
  const router = useRouter();
  const [totalOwed, setTotalOwed] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Set username from user metadata or email
      setUsername(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');

      // Calculate amount owed for this specific user
      const bookingData: BookingAmount = await calculateAmountOwedForUser(user.email!);
      setTotalOwed(bookingData.totalOwed);
      setBookingCount(bookingData.bookingCount);

      setIsLoading(false);
    };

    checkUser();

    // Set up polling to refresh amount owed every 5 seconds
    const interval = setInterval(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const bookingData: BookingAmount = await calculateAmountOwedForUser(user.email!);
        setTotalOwed(bookingData.totalOwed);
        setBookingCount(bookingData.bookingCount);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handlePayNow = async () => {
    if (totalOwed <= 0) {
      alert('Please book a session before attempting to pay.');
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const email = user.email;
      const amount = Math.round(totalOwed * 100); // convert dollars to cents
      
      console.log('Creating Stripe session with:', { amount, email });
      
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Stripe session creation failed:', errorData);
        alert(`Payment failed: ${errorData.error || errorData.details || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }
      
      const data = await res.json();
      if (data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url; // Directly redirect to Stripe Checkout
      } else {
        console.error('No checkout URL received:', data);
        alert(data.error || 'Payment failed - no checkout URL received.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
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
                  <h3 className="text-sm font-medium uppercase tracking-wide text-blue-100/60">Amount Owed</h3>
                  <div className="mt-4 font-display text-5xl font-medium text-white tracking-tight">
                    ${totalOwed.toFixed(2)}
                  </div>
                  <div className="mt-2 text-sm text-blue-100/60">
                    From {bookingCount} confirmed session{bookingCount !== 1 ? 's' : ''}
                  </div>
                  <button
                    onClick={handlePayNow}
                    className="btn-primary mt-6 w-full"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {isLoading ? 'Redirecting...' : 'Pay Now'}
                  </button>
                </div>
              </motion.div>

              {/* Notes Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium uppercase tracking-wide text-blue-100/60 mb-4">Notes</h3>
                  <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-center text-lg text-blue-100/60">New Feature Coming Soon! 🚀</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Cal.com Widget Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 flex items-center justify-center"
            >
              <div className="px-4 py-5 sm:p-6 w-full max-w-lg">
                <h3 className="font-display text-3xl md:text-4xl font-medium text-white mb-6">Schedule Management</h3>

                {/* Important Note */}
                <div className="mb-6 rounded-xl border border-sky-400/20 bg-sky-500/[0.08] p-4">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="mb-1 text-sm font-medium text-sky-200">Important booking note</h4>
                      <p className="text-xs leading-relaxed text-blue-100/70">
                        When booking a session, please set the email to whoever will actually join the meeting.
                        <strong className="font-semibold text-white"> You will still be billed for the session</strong> regardless of the attendee email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
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