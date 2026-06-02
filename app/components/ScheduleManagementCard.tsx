'use client';

import { useState, useEffect } from 'react';
import CalWidget from './CalWidget';
import { createClient } from '@/app/lib/client';

type ViewState = 'buttons' | 'regular' | 'sat-act';

interface CalConfig {
  layout: string;
  theme: string;
  name?: string;
  email?: string;
}

export default function ScheduleManagementCard() {
  const [viewState, setViewState] = useState<ViewState>('buttons');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
        setUserName(fullName);
      }
    };

    getUserInfo();
  }, []);

  const handleBack = () => {
    setViewState('buttons');
  };

  const handleBookingSuccess = () => {
    setViewState('buttons');
  };

  // Build the Cal.com config with prefill data
  const buildCalConfig = () => {
    const config: CalConfig = {
      layout: "month_view",
      theme: "dark"
    };

    if (userEmail || userName) {
      config.name = userName || undefined;
      config.email = userEmail || undefined;
    }

    return JSON.stringify(config);
  };

  const calConfig = buildCalConfig();

  if (viewState === 'buttons') {
    return (
      <div className="flex flex-col gap-4 p-6 h-full items-center justify-center">
        <div className="hidden">
          <CalWidget 
            namespace="reg-tut"
          />
          <CalWidget 
            namespace="sat-act"
          />
        </div>
        
        {/* Instructions */}
        <div className="w-full max-w-md mb-2 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <h4 className="mb-2 text-sm font-medium text-white">How to book</h4>
          <ol className="space-y-1 text-xs text-blue-100/60">
            <li>1. Choose a session type below</li>
            <li>2. Pick your preferred date and time</li>
            <li>3. Add any notes or questions</li>
            <li>4. Confirm your booking</li>
          </ol>
        </div>

        <div className="w-full max-w-md">
          <CalWidget
            namespace="reg-tut"
          />
          <button
            data-cal-namespace="reg-tut"
            data-cal-link="hemanshu-boppana-inqnfj/reg-tut"
            data-cal-config={calConfig}
            className="btn-primary w-full"
          >
            Schedule a Regular Tutoring Session
          </button>
        </div>
        <div className="w-full max-w-md">
          <CalWidget
            namespace="sat-act"
          />
          <button
            data-cal-namespace="sat-act"
            data-cal-link="hemanshu-boppana-inqnfj/sat-act"
            data-cal-config={calConfig}
            className="btn-secondary w-full"
          >
            Schedule a SAT/ACT Prep Session
          </button>
        </div>

        {userEmail && (
          <p className="mt-1 text-center text-xs text-blue-100/50">
            Your information will be pre-filled in the booking form
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={handleBack}
          className="btn-back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <CalWidget 
          namespace={viewState === 'regular' ? 'reg-tut' : 'sat-act'}
          onBookingSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
} 