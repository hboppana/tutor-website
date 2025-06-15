'use client';

import { useState } from 'react';
import CalWidget from './CalWidget';

type ViewState = 'buttons' | 'regular' | 'sat-act';

export default function ScheduleManagementCard() {
  const [viewState, setViewState] = useState<ViewState>('buttons');

  const handleBack = () => {
    setViewState('buttons');
  };

  const handleBookingSuccess = () => {
    setViewState('buttons');
  };

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
        <button
          data-cal-namespace="reg-tut"
          data-cal-link="hemanshu-boppana-inqnfj/reg-tut"
          data-cal-config='{"layout":"month_view","theme":"light"}'
          className="w-full max-w-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
        >
          Schedule a Regular Tutoring Session
        </button>
        <button
          data-cal-namespace="sat-act"
          data-cal-link="hemanshu-boppana-inqnfj/sat-act"
          data-cal-config='{"layout":"week_view","theme":"light"}'
          className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 font-['Poppins'] text-base border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
        >
          Schedule a SAT/ACT Prep Session
        </button>
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