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
        const { data: updatedBooking, error: cancelError } = await supabase
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