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
                  <button
                    onClick={handlePayNow}
                    className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
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
                  <h3 className="text-lg font-medium text-white mb-4 font-['Poppins']">Notes</h3>
                  <div className="bg-white/10 rounded-lg p-4 min-h-[150px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white/80 text-lg font-['Poppins']">New Feature Coming Soon! 🚀</div>
                    </div>
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
                <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 font-['Poppins']">Schedule Management</h3>
                
                {/* Important Note */}
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-blue-300 font-medium text-sm mb-1">Important Booking Note</h4>
                      <p className="text-blue-200 text-xs leading-relaxed">
                        When booking a session, please set the email to whoever will actually join the meeting. 
                        <strong> You will still be billed for the session</strong> regardless of the attendee email.
                      </p>
                    </div>
                  </div>
                </div>
                
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