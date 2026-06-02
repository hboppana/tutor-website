import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, bookingData } = data;

    console.log('Received booking request:', { type, bookingData });

    switch (type) {
      case 'create':
        // First check if the booking already exists
        const { data: existingBooking } = await supabase
          .from('bookings')
          .select('cal_booking_id')
          .eq('cal_booking_id', bookingData.cal_booking_id)
          .single();

        // If booking exists, return success
        if (existingBooking) {
          console.log('Booking already exists, skipping:', bookingData.cal_booking_id);
          return NextResponse.json({ success: true, message: 'Booking already exists' });
        }

        // If booking doesn't exist, create it
        const { error: insertError } = await supabase
          .from('bookings')
          .insert(bookingData);
        
        if (insertError) {
          // If it's a duplicate key error, treat it as success
          if (insertError.code === '23505') {
            console.log('Booking already exists (race condition), skipping:', bookingData.cal_booking_id);
            return NextResponse.json({ success: true, message: 'Booking already exists' });
          }
          // For other errors, throw them
          console.error('Error creating booking:', insertError);
          throw insertError;
        }

        // No user table logic, just create the booking
        break;

      case 'cancel':
        // First check if the booking exists
        const { data: bookingToCancel } = await supabase
          .from('bookings')
          .select('cal_booking_id, duration, event_type, attendee_email')
          .eq('cal_booking_id', bookingData.cal_booking_id)
          .single();

        if (!bookingToCancel) {
          console.log('Booking not found for cancellation:', bookingData.cal_booking_id);
          return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        // Update the booking status
        const { error: cancelError } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('cal_booking_id', bookingData.cal_booking_id)
          .select()
          .single();
        
        if (cancelError) {
          console.error('Error cancelling booking:', cancelError);
          throw cancelError;
        }

        // No user table logic, just update the booking status
        break;

      case 'delete':
        // First check if the booking exists
        const { data: bookingToDelete } = await supabase
          .from('bookings')
          .select('cal_booking_id')
          .eq('cal_booking_id', bookingData.cal_booking_id)
          .single();

        if (!bookingToDelete) {
          console.log('Booking not found for deletion:', bookingData.cal_booking_id);
          return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        // Delete the booking
        const { error: deleteError } = await supabase
          .from('bookings')
          .delete()
          .eq('cal_booking_id', bookingData.cal_booking_id);
        
        if (deleteError) {
          console.error('Error deleting booking:', deleteError);
          throw deleteError;
        }

        console.log('Successfully deleted booking:', bookingData.cal_booking_id);
        break;

      case 'reschedule':
        // Look up the original booking by its old Cal id. Its billing_email holds the
        // paying user (e.g. the parent), which must survive the reschedule.
        const { data: originalBooking } = await supabase
          .from('bookings')
          .select('cal_booking_id, billing_email')
          .eq('cal_booking_id', bookingData.old_cal_booking_id)
          .single();

        if (originalBooking) {
          // Update in place. billing_email is intentionally NOT in this payload, so the
          // original payer is preserved while the schedule/attendee details change.
          const { error: rescheduleError } = await supabase
            .from('bookings')
            .update({
              cal_booking_id: bookingData.cal_booking_id,
              date: bookingData.date,
              duration: bookingData.duration,
              event_type: bookingData.event_type,
              organizer_name: bookingData.organizer_name,
              organizer_email: bookingData.organizer_email,
              organizer_timezone: bookingData.organizer_timezone,
              attendee_name: bookingData.attendee_name,
              attendee_email: bookingData.attendee_email,
              attendee_timezone: bookingData.attendee_timezone,
              status: 'confirmed',
            })
            .eq('cal_booking_id', bookingData.old_cal_booking_id);

          if (rescheduleError) {
            // 23505 = the new cal_booking_id already exists; treat as already-applied.
            if (rescheduleError.code === '23505') {
              console.log('Reschedule already applied, skipping:', bookingData.cal_booking_id);
              return NextResponse.json({ success: true, message: 'Reschedule already applied' });
            }
            console.error('Error rescheduling booking:', rescheduleError);
            throw rescheduleError;
          }

          console.log('Successfully rescheduled booking in place:', bookingData.old_cal_booking_id, '->', bookingData.cal_booking_id);
        } else {
          // No original row found — we can't recover the original payer. Insert using the
          // provided billing_email if present, otherwise fall back to attendee and log loudly.
          console.warn('Reschedule: original booking not found for', bookingData.old_cal_booking_id, '- inserting new row');
          const { error: rescheduleInsertError } = await supabase
            .from('bookings')
            .insert({
              cal_booking_id: bookingData.cal_booking_id,
              date: bookingData.date,
              duration: bookingData.duration,
              event_type: bookingData.event_type,
              organizer_name: bookingData.organizer_name,
              organizer_email: bookingData.organizer_email,
              organizer_timezone: bookingData.organizer_timezone,
              attendee_name: bookingData.attendee_name,
              attendee_email: bookingData.attendee_email,
              attendee_timezone: bookingData.attendee_timezone,
              billing_email: bookingData.billing_email || bookingData.attendee_email,
              status: 'confirmed',
            });

          if (rescheduleInsertError && rescheduleInsertError.code !== '23505') {
            console.error('Error inserting rescheduled booking:', rescheduleInsertError);
            throw rescheduleInsertError;
          }
        }
        break;

      default:
        console.error('Unknown booking type:', type);
        return NextResponse.json({ success: false, error: 'Unknown booking type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bookings API:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 