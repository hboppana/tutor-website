'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { createClient } from '@/app/lib/client';

interface CalEventData {
  type: string;
  namespace: string;
  fullType: string;
  data: {
    booking: unknown;
    eventType: unknown;
    date: string;
    duration: number | undefined;
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
    confirmed: boolean;
  };
}

interface CalWidgetProps {
  namespace: string;
  onBookingSuccess?: (data: CalEventData) => void;
}

export default function CalWidget({ 
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
        callback: async (e: CustomEvent<CalEventData>) => {
          const bookingData = e.detail;
          console.log("Booking successful:", bookingData);

          // Store booking data in Supabase
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase
              .from('bookings')
              .insert([
                {
                  user_id: user.id,
                  event_type: bookingData.data.eventType,
                  start_time: bookingData.data.date,
                  end_time: new Date(new Date(bookingData.data.date).getTime() + (bookingData.data.duration || 0) * 60000).toISOString(),
                  attendee_name: bookingData.data.organizer.name,
                  attendee_email: bookingData.data.organizer.email,
                  booking_id: bookingData.type,
                  status: bookingData.data.confirmed ? 'confirmed' : 'pending',
                  metadata: bookingData
                }
              ]);
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