import { createClient } from '@/app/lib/client';

export interface BookingAmount {
  totalOwed: number;
  bookingCount: number;
}

export function calculateSessionAmount(duration: number, eventType: string): number {
  // Regular session pricing
  if (eventType.toLowerCase().includes('regular') || !eventType.toLowerCase().includes('sat') && !eventType.toLowerCase().includes('act')) {
    if (duration === 60) return 30;
    if (duration === 90) return 45;
    if (duration === 120) return 60;
    // For other durations, calculate proportionally based on 60 min = $30
    return (duration / 60) * 30;
  }
  
  // SAT/ACT session pricing
  if (eventType.toLowerCase().includes('sat') || eventType.toLowerCase().includes('act')) {
    return 35;
  }
  
  // Default fallback
  return (duration / 60) * 30;
}

export async function calculateAmountOwedForUser(userEmail: string): Promise<BookingAmount> {
  const supabase = createClient();
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('duration, event_type, status')
    .eq('attendee_email', userEmail)
    .eq('status', 'confirmed');

  if (error) {
    console.error('Error fetching bookings:', error);
    return { totalOwed: 0, bookingCount: 0 };
  }

  let totalOwed = 0;
  const bookingCount = bookings?.length || 0;

  bookings?.forEach(booking => {
    if (booking.duration && booking.event_type) {
      const sessionAmount = calculateSessionAmount(booking.duration, booking.event_type);
      totalOwed += sessionAmount;
    }
  });

  return { 
    totalOwed,
    bookingCount
  };
}

export async function calculateTotalAmountOwedForAllTutees(): Promise<BookingAmount> {
  const supabase = createClient();
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('duration, event_type, status')
    .eq('status', 'confirmed');

  if (error) {
    console.error('Error fetching all bookings:', error);
    return { totalOwed: 0, bookingCount: 0 };
  }

  let totalOwed = 0;
  const bookingCount = bookings?.length || 0;

  bookings?.forEach(booking => {
    if (booking.duration && booking.event_type) {
      const sessionAmount = calculateSessionAmount(booking.duration, booking.event_type);
      totalOwed += sessionAmount;
    }
  });

  return { 
    totalOwed,
    bookingCount
  };
} 