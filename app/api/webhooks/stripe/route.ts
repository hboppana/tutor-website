import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/app/lib/client';

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
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    if (email) {
      // Mark all confirmed bookings for this user as paid
      const supabase = createClient();
      await supabase
        .from('bookings')
        .update({ status: 'paid' })
        .eq('attendee_email', email)
        .eq('status', 'confirmed');
    }
  }

  return NextResponse.json({ received: true });
} 