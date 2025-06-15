'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { createClient } from '@/app/lib/client';

interface CalWidgetProps {
  calLink: string;
  namespace: string;
  onBookingSuccess?: (data: any) => void;
}

export default function CalWidget({ 
  calLink,
  namespace,
  onBookingSuccess
}: CalWidgetProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace });
      
      // Configure the UI
      cal("ui", {
        hideEventTypeDetails: false,
        layout: namespace === "sat-act" ? "week_view" : "month_view",
        theme: "light",
        styles: {
          branding: {
            brandColor: "#3B82F6"
          }
        }
      });

      // Listen for booking success
      cal("on", {
        action: "bookingSuccessful",
        callback: async (e: any) => {
          const bookingData = e.detail;
          console.log("Booking successful:", bookingData);

          // Store booking data in Supabase
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { data, error } = await supabase
              .from('bookings')
              .insert([
                {
                  user_id: user.id,
                  event_type: bookingData.eventType,
                  start_time: bookingData.startTime,
                  end_time: bookingData.endTime,
                  attendee_name: bookingData.attendee.name,
                  attendee_email: bookingData.attendee.email,
                  booking_id: bookingData.uid,
                  status: 'confirmed',
                  metadata: bookingData
                }
              ]);

            if (error) {
              console.error('Error storing booking:', error);
            }
          }

          // Call the onBookingSuccess callback if provided
          if (onBookingSuccess) {
            onBookingSuccess(bookingData);
          }
        }
      });
    })();
  }, [namespace, onBookingSuccess]);

  return null;
} 