import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: '2025-05-28.basil', // or just remove this line
  });

export async function POST(req: NextRequest) {
  const { amount, email } = await req.json();

  if (!amount || !email) {
    return NextResponse.json({ error: 'Missing amount or email' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Tutoring Payment' },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/tutee?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/tutee?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: 'Stripe session creation failed' }, { status: 500 });
  }
}