import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateSessionAmount } from '@/app/lib/booking-calculations';

// Use the service role key for admin privileges (DO NOT expose to client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Fetch all users from Supabase Auth
  const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  // Fetch all confirmed bookings
  const { data: bookings, error: bookingsError } = await supabaseAdmin
    .from('bookings')
    .select('attendee_email, attendee_name, duration, event_type, status')
    .eq('status', 'confirmed');
  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  // Map bookings by attendee email
  const bookingsByEmail: Record<string, any[]> = {};
  bookings?.forEach(booking => {
    if (!bookingsByEmail[booking.attendee_email]) {
      bookingsByEmail[booking.attendee_email] = [];
    }
    bookingsByEmail[booking.attendee_email].push(booking);
  });

  // Build user list with amounts
  const userList = users?.users.map(user => {
    const email = user.email;
    const name = user.user_metadata?.full_name || email?.split('@')[0] || 'User';
    const userBookings = email ? bookingsByEmail[email] || [] : [];
    let totalOwed = 0;
    let bookingCount = userBookings.length;
    userBookings.forEach(booking => {
      if (booking.duration && booking.event_type) {
        totalOwed += calculateSessionAmount(booking.duration, booking.event_type);
      }
    });
    return {
      email,
      name,
      totalOwed,
      bookingCount,
    };
  }) || [];

  // Sort by total owed descending
  userList.sort((a, b) => b.totalOwed - a.totalOwed);

  return NextResponse.json(userList);
} 