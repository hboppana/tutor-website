import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateSessionAmount } from '@/app/lib/booking-calculations';

// Use the service role key for admin privileges (DO NOT expose to client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Fetch all confirmed bookings
  const { data: bookings, error: bookingsError } = await supabaseAdmin
    .from('bookings')
    .select('attendee_email, attendee_name, duration, event_type, status')
    .eq('status', 'confirmed');
  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }
  // Group bookings by attendee email
  const userMap = new Map();
  bookings?.forEach(booking => {
    const email = booking.attendee_email;
    const name = booking.attendee_name || email.split('@')[0];
    if (!userMap.has(email)) {
      userMap.set(email, {
        email,
        name,
        totalOwed: 0,
        bookingCount: 0
      });
    }
    const user = userMap.get(email);
    user.bookingCount++;
    if (booking.duration && booking.event_type) {
      const sessionAmount = calculateSessionAmount(booking.duration, booking.event_type);
      user.totalOwed += sessionAmount;
    }
  });
  // Convert map to array and sort by total owed (descending)
  const userList = Array.from(userMap.values()).sort((a, b) => b.totalOwed - a.totalOwed);
  return NextResponse.json(userList);
} 