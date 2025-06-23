import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    console.log('Stripe webhook: Payment completed for email:', email);

    if (email) {
      // Use the service role key for full backend access
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      // Check ALL bookings for this email (both attendee and organizer) to see their status
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings')
        .select('id, cal_booking_id, attendee_email, organizer_email, status')
        .or(`attendee_email.eq.${email},organizer_email.eq.${email}`);
      
      console.log('ALL bookings for', email, ':', allBookings);
      console.log('All bookings error:', allBookingsError);
      
      const { data: confirmedBookings, error: fetchError } = await supabase
        .from('bookings')
        .select('id, cal_booking_id, attendee_email, organizer_email, status')
        .or(`attendee_email.eq.${email},organizer_email.eq.${email}`)
        .eq('status', 'confirmed');

      console.log('Found confirmed bookings for', email, ':', confirmedBookings);
      console.log('Fetch error:', fetchError);

      if (confirmedBookings && confirmedBookings.length > 0) {
        // Mark all confirmed bookings for this user as paid
        const { data: updatedBookings, error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'paid' })
          .or(`attendee_email.eq.${email},organizer_email.eq.${email}`)
          .eq('status', 'confirmed')
          .select('id, cal_booking_id, attendee_email, organizer_email, status');

        console.log('Updated bookings to paid:', updatedBookings);
        console.log('Update error:', updateError);
      } else {
        console.log('No confirmed bookings found for email:', email);
      }
    } else {
      console.log('No email found in Stripe session');
    }
  }

  return NextResponse.json({ received: true });
} 