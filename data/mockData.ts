import { User, Team, Booking, AppNotification } from '@/types';

// ─── Mock Teams ───────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Team[] = [
  {
    id: 'TEAM-001',
    name: 'Hulhumalé Warriors',
    sport: 'Basketball',
    registeredDate: '2022-03-15',
    isActive: true,
    contactEmail: 'warriors@example.mv',
    contactPhone: '+960 7001234',
  },
  {
    id: 'TEAM-002',
    name: 'Island Spikers',
    sport: 'Volleyball',
    registeredDate: '2021-08-20',
    isActive: true,
    contactEmail: 'spikers@example.mv',
    contactPhone: '+960 7005678',
  },
  {
    id: 'TEAM-003',
    name: 'Coral FC',
    sport: 'Football',
    registeredDate: '2023-01-10',
    isActive: true,
    contactEmail: 'coralfc@example.mv',
    contactPhone: '+960 7009012',
  },
];

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_TEAM_REP: User = {
  id: 'user-101',
  fullName: 'Ahmed Rasheed',
  email: 'ahmed@example.mv',
  phone: '+960 7001234',
  role: 'team_rep',
  team: MOCK_TEAMS[0],
};

export const MOCK_CSR_ADMIN: User = {
  id: 'user-001',
  fullName: 'Fathimath Ali',
  email: 'fali@hdc.mv',
  phone: '+960 3003333',
  role: 'csr_admin',
  team: null,
};

// ─── Mock Bookings ────────────────────────────────────────────────────────────

const now = new Date();
const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7);
const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
const lastWeek = new Date(now); lastWeek.setDate(now.getDate() - 7);

function fmt(d: Date) { return d.toISOString().split('T')[0]; }
function paymentDeadline(d: Date) {
  const dl = new Date(d); dl.setHours(dl.getHours() + 24); return dl.toISOString();
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    reference: 'HDC-2024-000001',
    facilityId: 'n1-basketball',
    facilityName: 'My Hulhumalé Basketball Court',
    teamId: 'TEAM-001',
    teamName: 'Hulhumalé Warriors',
    userId: 'user-101',
    date: fmt(tomorrow),
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2,
    priceTotal: 500,
    status: 'confirmed',
    guidelinesAcceptance: {
      accepted: true,
      timestamp: now.toISOString(),
      guidelineVersion: 'v1.0',
    },
    paymentId: 'pay-001',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'bk-002',
    reference: 'HDC-2024-000002',
    facilityId: 'n2-football',
    facilityName: 'Fiyavathi Playing Ground (Mini Football)',
    teamId: 'TEAM-001',
    teamName: 'Hulhumalé Warriors',
    userId: 'user-101',
    date: fmt(nextWeek),
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2,
    priceTotal: 600,
    status: 'pending_payment',
    guidelinesAcceptance: {
      accepted: true,
      timestamp: now.toISOString(),
      guidelineVersion: 'v1.0',
    },
    paymentDeadline: paymentDeadline(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'bk-003',
    reference: 'HDC-2024-000003',
    facilityId: 'n1-volleyball',
    facilityName: 'HDC Volleyball Court',
    teamId: 'TEAM-001',
    teamName: 'Hulhumalé Warriors',
    userId: 'user-101',
    date: fmt(lastWeek),
    startTime: '09:00',
    endTime: '11:00',
    durationHours: 2,
    priceTotal: 400,
    status: 'expired',
    guidelinesAcceptance: null,
    createdAt: lastWeek.toISOString(),
    updatedAt: lastWeek.toISOString(),
  },
  {
    id: 'bk-004',
    reference: 'HDC-2024-000004',
    facilityId: 'n6-multipurpose',
    facilityName: 'Kulhivaru Ekuveni Multi-Purpose Court',
    teamId: 'TEAM-002',
    teamName: 'Island Spikers',
    userId: 'user-102',
    date: fmt(tomorrow),
    startTime: '07:00',
    endTime: '09:00',
    durationHours: 2,
    priceTotal: 500,
    status: 'confirmed',
    guidelinesAcceptance: {
      accepted: true,
      timestamp: now.toISOString(),
      guidelineVersion: 'v1.0',
    },
    paymentId: 'pay-004',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  },
  {
    id: 'bk-005',
    reference: 'HDC-2024-000005',
    facilityId: 'n1-basketball',
    facilityName: 'My Hulhumalé Basketball Court',
    teamId: 'TEAM-003',
    teamName: 'Coral FC',
    userId: 'user-103',
    date: fmt(yesterday),
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    priceTotal: 500,
    status: 'confirmed',
    guidelinesAcceptance: {
      accepted: true,
      timestamp: yesterday.toISOString(),
      guidelineVersion: 'v1.0',
    },
    paymentId: 'pay-005',
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
  },
];

// ─── Occupied slots for availability (facility + date → occupied time ranges) ─

export const MOCK_OCCUPIED_SLOTS: Record<string, { start: string; end: string }[]> = {
  // key: `${facilityId}__${date}`
  [`n1-basketball__${fmt(tomorrow)}`]: [
    { start: '18:00', end: '20:00' },  // bk-001
  ],
  [`n6-multipurpose__${fmt(tomorrow)}`]: [
    { start: '07:00', end: '09:00' },  // bk-004
  ],
};

// ─── Mock Notifications ───────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    userId: 'user-101',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    body: 'Your booking for My Hulhumalé Basketball Court on tomorrow at 18:00 has been confirmed. Reference: HDC-2024-000001',
    bookingId: 'bk-001',
    isRead: false,
    createdAt: now.toISOString(),
  },
  {
    id: 'notif-002',
    userId: 'user-101',
    type: 'booking_blocked',
    title: 'Slot Reserved — Payment Required',
    body: 'Your slot at Fiyavathi Playing Ground has been reserved. Please complete payment within 24 hours to confirm your booking.',
    bookingId: 'bk-002',
    isRead: false,
    createdAt: now.toISOString(),
  },
  {
    id: 'notif-003',
    userId: 'user-101',
    type: 'booking_expired',
    title: 'Booking Expired',
    body: 'Your booking for HDC Volleyball Court has expired as payment was not received in time.',
    bookingId: 'bk-003',
    isRead: true,
    createdAt: lastWeek.toISOString(),
  },
];

// ─── Facility usage guidelines text (version-controlled) ─────────────────────

export const FACILITY_GUIDELINES = {
  version: 'v1.0',
  lastUpdated: '2024-01-01',
  title: 'HDC CSR Sports Facility Usage Guidelines',
  sections: [
    {
      heading: '1. General Conduct',
      body: 'All users must conduct themselves in a respectful and sportsmanlike manner. Aggressive behaviour, foul language, or harassment of other users will result in immediate termination of the booking without refund.',
    },
    {
      heading: '2. Operating Hours',
      body: 'Facilities are available for booking between 06:00 and 23:00 daily. Bookings must begin and end within this window. Users must vacate the facility promptly at the end of their booked slot.',
    },
    {
      heading: '3. Facility Care',
      body: 'Users are responsible for keeping the facility clean during their session. Dispose of all waste in designated bins. Damage caused by negligent use will be charged to the booking team.',
    },
    {
      heading: '4. Equipment',
      body: 'Teams must bring their own equipment (balls, bibs, etc.) unless stated otherwise in the facility description. HDC-provided equipment (nets, goal posts) must not be removed or modified.',
    },
    {
      heading: '5. Safety',
      body: 'Appropriate footwear must be worn at all times. No glass containers, alcohol, or controlled substances are permitted on the premises. In case of injury, contact HDC security immediately.',
    },
    {
      heading: '6. Cancellation Policy',
      body: 'Cancellations made more than 48 hours before the booking start time may be eligible for a refund (minus processing fees). Cancellations within 48 hours are non-refundable.',
    },
    {
      heading: '7. No-Show Policy',
      body: 'Failure to appear within 30 minutes of the booked start time will be considered a no-show. Repeated no-shows may result in suspension of booking privileges.',
    },
    {
      heading: '8. Compliance',
      body: 'By accepting these guidelines, the team representative confirms that all team members have been informed of and agree to abide by these rules. HDC CSR reserves the right to update these guidelines at any time.',
    },
  ],
};
