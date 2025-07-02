import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateSessionAmount } from '@/app/lib/booking-calculations';

// Use the service role key for admin privileges (DO NOT expose to client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch all authenticated users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Fetch all confirmed bookings
    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from('bookings')
      .select('billing_email, attendee_name, duration, event_type, status')
      .eq('status', 'confirmed');
    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // Create a map of booking amounts by billing email
    const bookingMap = new Map();
    bookings?.forEach(booking => {
      const email = booking.billing_email;
      if (!bookingMap.has(email)) {
        bookingMap.set(email, {
          totalOwed: 0,
          bookingCount: 0
        });
      }
      const bookingData = bookingMap.get(email);
      bookingData.bookingCount++;
      if (booking.duration && booking.event_type) {
        const sessionAmount = calculateSessionAmount(booking.duration, booking.event_type);
        bookingData.totalOwed += sessionAmount;
      }
    });

    // Combine auth users with their booking data
    const userList = authUsers.users.map(user => {
      const email = user.email || '';
      const bookingData = bookingMap.get(email) || { totalOwed: 0, bookingCount: 0 };
      
      return {
        email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
        totalOwed: bookingData.totalOwed,
        bookingCount: bookingData.bookingCount
      };
    });

    // Sort by total owed (descending)
    userList.sort((a, b) => b.totalOwed - a.totalOwed);
    
    return NextResponse.json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 