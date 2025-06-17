/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";
import { createClient } from '@/app/lib/client';

interface CalEventData {
  type: string;
  namespace: string;
  fullType: string;
  data: {
    booking: {
      id: string;
      attendees: Array<{
        name: string;
        email: string;
        timeZone: string;
      }>;
    };
    eventType: {
      title: string;
    };
    date: string;
    duration: number | undefined;
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUserEmail = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };

    getUserEmail();
  }, []);

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

      // Handle booking creation
      cal("on", {
        action: "bookingSuccessful",
        callback: async (e: any) => {
          try {
            const bookingData = e.detail;
            const {
              data: {
                booking,
                eventType,
                date,
                duration,
                organizer
              }
            } = bookingData;

            if (!booking?.id || !eventType?.title || !date || !organizer?.name || !organizer?.email || !organizer?.timeZone || !booking?.attendees?.[0]) {
              return;
            }

            await fetch('/api/bookings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'create',
                bookingData: {
                  cal_booking_id: booking.id,
                  event_type: eventType.title,
                  date: new Date(date).toISOString(),
                  duration,
                  organizer_name: organizer.name,
                  organizer_email: organizer.email,
                  organizer_timezone: organizer.timeZone,
                  attendee_name: booking.attendees[0].name,
                  attendee_email: booking.attendees[0].email,
                  attendee_timezone: booking.attendees[0].timeZone,
                  status: 'confirmed'
                }
              })
            });

            if (onBookingSuccess) {
              onBookingSuccess(bookingData);
            }
          } catch {
            // Silent error handling
          }
        }
      });

      // Handle booking cancellation
      cal("on", {
        action: "bookingCancelled",
        callback: async (e: any) => {
          try {
            const bookingData = e.detail;
            const bookingId = bookingData?.data?.booking?.id;
            
            if (!bookingId) {
              return;
            }

            await fetch('/api/bookings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'cancel',
                bookingData: {
                  cal_booking_id: bookingId
                }
              })
            });
          } catch {
            // Silent error handling
          }
        }
      });

      // Handle booking rescheduling
      cal("on", {
        action: "rescheduleBookingSuccessful",
        callback: async (e: any) => {
          try {
            const bookingData = e.detail;
            const {
              data: {
                booking,
                date,
                duration
              }
            } = bookingData;

            await fetch('/api/bookings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'reschedule',
                bookingData: {
                  cal_booking_id: booking.id,
                  date: new Date(date).toISOString(),
                  duration
                }
              })
            });
          } catch {
            // Silent error handling
          }
        }
      });
    })();
  }, [namespace, onBookingSuccess]);

  // Add email to the namespace URL if available
  const calLink = userEmail ? `${namespace}?email=${encodeURIComponent(userEmail)}` : namespace;

  return (
    <div 
      data-cal-link={calLink}
      data-cal-namespace={namespace}
      data-cal-config='{"layout":"month_view"}'
    />
  );
} 