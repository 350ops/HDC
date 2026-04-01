import { Booking } from '@/types';

// Notification Service — interfaces for email + SMS.
// Replace with real backend API calls (e.g. Supabase Edge Function, AWS SES + SNS) in production.

export async function sendBookingBlockedEmail(booking: Booking): Promise<void> {
  // BR-08: On slot block, send email with slot details + eFaas link + guidelines + next steps
  // TODO: POST /api/notifications/email { type: 'booking_blocked', bookingId: booking.id }
  console.log(`[Email] Booking blocked notification → ${booking.reference}`);
}

export async function sendConfirmationSMS(booking: Booking): Promise<void> {
  // BR-09: On payment confirmation, send SMS with date/time/facility/reference
  // TODO: POST /api/notifications/sms { type: 'booking_confirmed', bookingId: booking.id }
  console.log(`[SMS] Booking confirmed → ${booking.reference} at ${booking.facilityName} on ${booking.date} ${booking.startTime}`);
}

export async function sendExpiryNotification(booking: Booking): Promise<void> {
  // BR-11: When payment deadline passes and slot is released
  // TODO: POST /api/notifications/push { type: 'booking_expired', bookingId: booking.id }
  console.log(`[Push] Booking expired → ${booking.reference}`);
}
