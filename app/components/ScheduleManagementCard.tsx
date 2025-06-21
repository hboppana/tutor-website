'use client';

import { useState, useEffect } from 'react';
import CalWidget from './CalWidget';
import { createClient } from '@/app/lib/client';

type ViewState = 'buttons' | 'regular' | 'sat-act';

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
    const config: any = {
      layout: "month_view",
      theme: "light"
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
        <div className="w-full max-w-md mb-4 p-4 bg-white/10 rounded-lg border border-white/20">
          <h4 className="text-white font-medium mb-2 text-sm">How to Book:</h4>
          <ol className="text-white/80 text-xs space-y-1">
            <li>1. Click either booking button below</li>
            <li>2. Select your preferred date and time</li>
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
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
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
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
          >
            Schedule a SAT/ACT Prep Session
          </button>
        </div>
        
        {userEmail && (
          <p className="text-xs text-white/60 text-center mt-2">
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
          className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 font-['Poppins']"
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