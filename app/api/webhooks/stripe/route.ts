import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    if (!sig) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
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
          .select('id, cal_booking_id, billing_email, organizer_email, status')
          .or(`billing_email.eq.${email},organizer_email.eq.${email}`);
        
        console.log('ALL bookings for', email, ':', allBookings);
        console.log('All bookings error:', allBookingsError);
        
        const { data: confirmedBookings, error: fetchError } = await supabase
          .from('bookings')
          .select('id, cal_booking_id, billing_email, organizer_email, status')
          .or(`billing_email.eq.${email},organizer_email.eq.${email}`)
          .eq('status', 'confirmed');

        console.log('Found confirmed bookings for', email, ':', confirmedBookings);
        console.log('Fetch error:', fetchError);

        if (confirmedBookings && confirmedBookings.length > 0) {
          // Mark all confirmed bookings for this user as paid
          const { data: updatedBookings, error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'paid' })
            .or(`billing_email.eq.${email},organizer_email.eq.${email}`)
            .eq('status', 'confirmed')
            .select('id, cal_booking_id, billing_email, organizer_email, status');

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
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 