'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

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
        layout: "month_view",
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
        callback: (e: CustomEvent<CalEventData>) => {
          const bookingData = e.detail;
          console.log("Booking successful:", bookingData);

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