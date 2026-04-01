import { Booking, BookingStatus, TimeSlot } from '@/types';
import { MOCK_BOOKINGS, MOCK_OCCUPIED_SLOTS } from '@/data/mockData';

// ─── Interfaces ───────────────────────────────────────────────────────────────
// Swap the mock implementations below for real REST/Supabase calls in production.

export interface CreateBookingInput {
  facilityId: string;
  facilityName: string;
  teamId: string;
  teamName: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  guidelineVersion: string;
}

export interface AvailabilityResult {
  date: string;
  occupiedStarts: string[];
}

// ─── Mock implementations ─────────────────────────────────────────────────────

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const durationH =
    parseInt(input.endTime.split(':')[0], 10) - parseInt(input.startTime.split(':')[0], 10);
  const now = new Date().toISOString();
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 24);

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    reference: `HDC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
    facilityId: input.facilityId,
    facilityName: input.facilityName,
    teamId: input.teamId,
    teamName: input.teamName,
    userId: input.userId,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    durationHours: durationH,
    priceTotal: durationH * input.pricePerHour,
    status: 'pending_payment',
    guidelinesAcceptance: {
      accepted: true,
      timestamp: now,
      guidelineVersion: input.guidelineVersion,
    },
    paymentDeadline: deadline.toISOString(),
    createdAt: now,
    updatedAt: now,
  };

  // In production: POST /api/bookings
  MOCK_BOOKINGS.unshift(booking);
  return booking;
}

export async function getBookings(teamId?: string): Promise<Booking[]> {
  // In production: GET /api/bookings?teamId=...
  return teamId ? MOCK_BOOKINGS.filter((b) => b.teamId === teamId) : MOCK_BOOKINGS;
}

export async function getAvailability(facilityId: string, date: string): Promise<AvailabilityResult> {
  // In production: GET /api/facilities/:id/availability?date=...
  const key = `${facilityId}__${date}`;
  const occupied = (MOCK_OCCUPIED_SLOTS[key] ?? []).map((s) => s.start);
  return { date, occupiedStarts: occupied };
}

export async function cancelBooking(bookingId: string): Promise<void> {
  // In production: PATCH /api/bookings/:id { status: 'cancelled' }
  const idx = MOCK_BOOKINGS.findIndex((b) => b.id === bookingId);
  if (idx >= 0) {
    MOCK_BOOKINGS[idx] = { ...MOCK_BOOKINGS[idx], status: 'cancelled', updatedAt: new Date().toISOString() };
  }
}

export async function confirmBookingPayment(bookingId: string, paymentId: string): Promise<void> {
  // In production: PATCH /api/bookings/:id { status: 'confirmed', paymentId }
  const idx = MOCK_BOOKINGS.findIndex((b) => b.id === bookingId);
  if (idx >= 0) {
    MOCK_BOOKINGS[idx] = {
      ...MOCK_BOOKINGS[idx],
      status: 'confirmed',
      paymentId,
      updatedAt: new Date().toISOString(),
    };
  }
}
