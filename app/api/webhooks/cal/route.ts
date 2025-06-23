import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error('CAL_WEBHOOK_SECRET environment variable is not set');
}

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET as string);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: Request) {
  console.log('Cal.com webhook POST received');
  try {
    const headersList = await headers();
    const signature = headersList.get('x-cal-signature-256');
    console.log('Received headers:', Object.fromEntries(headersList.entries()));
    console.log('Received signature:', signature);

    if (!signature) {
      console.log('No signature provided in request');
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    }

    const payload = await req.text();
    console.log('Received payload:', payload);
    
    if (!verifyWebhookSignature(payload, signature)) {
      console.log('Invalid signature. Expected secret:', WEBHOOK_SECRET);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    console.log('Signature verified, processing event...');

    const event = JSON.parse(payload);
    const { triggerEvent, payload: eventPayload } = event;
    console.log('Processing event:', triggerEvent);
    console.log('Event payload:', eventPayload);

    // Get the base URL from the request
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = headersList.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    switch (triggerEvent) {
      case 'BOOKING_CANCELLED':
        console.log('Handling BOOKING_CANCELLED for bookingId:', eventPayload.bookingId);
        await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'cancel',
            bookingData: {
              cal_booking_id: eventPayload.bookingId
            }
          })
        });
        break;

      case 'BOOKING_RESCHEDULED':
        const { bookingId, rescheduleId, startTime, endTime } = eventPayload;
        const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60);
        console.log('Handling BOOKING_RESCHEDULED:', { bookingId, rescheduleId, startTime, endTime, duration });
        // First, delete the old booking
        await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'delete',
            bookingData: {
              cal_booking_id: rescheduleId
            }
          })
        });
        // Then create a new booking with the rescheduled details
        await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'create',
            bookingData: {
              cal_booking_id: bookingId,
              date: new Date(startTime).toISOString(),
              duration,
              event_type: eventPayload.eventTitle,
              organizer_name: eventPayload.organizer.name,
              organizer_email: eventPayload.organizer.email,
              organizer_timezone: eventPayload.organizer.timeZone,
              attendee_name: eventPayload.attendees[0].name,
              attendee_email: eventPayload.attendees[0].email,
              attendee_timezone: eventPayload.attendees[0].timeZone,
              status: 'confirmed'
            }
          })
        });
        break;

      default:
        console.log('Unhandled event type:', triggerEvent);
    }

    console.log('Webhook processing complete.');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 