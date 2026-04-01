// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'team_rep' | 'csr_admin' | 'finance' | 'sys_admin';

export interface Team {
  id: string;           // HDC-assigned team ID
  name: string;
  sport: string;
  registeredDate: string;
  isActive: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  team: Team | null;    // null for admin roles not linked to a team
  avatarUrl?: string;
}

// ─── Facilities ───────────────────────────────────────────────────────────────

export type SportType =
  | 'basketball'
  | 'volleyball'
  | 'football'
  | 'netball'
  | 'handball'
  | 'badminton'
  | 'bashi'
  | 'multi-purpose';

export type Neighborhood =
  | 'N1'   // Neighborhood 1 – HDC Park Area
  | 'N2'   // Neighborhood 2 – Container Park & Sunset Park
  | 'N3'   // Neighborhood 3 – Fehires Park
  | 'N6';  // Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni

export interface OperatingHours {
  open: string;   // e.g. '06:00'
  close: string;  // e.g. '23:00'
}

export interface Facility {
  id: string;
  name: string;
  neighborhood: Neighborhood;
  neighborhoodLabel: string;
  sport: SportType;
  description: string;
  images: string[];         // remote URLs or local require() paths
  operatingHours: OperatingHours;
  pricePerHour: number;     // MVR
  isActive: boolean;
  capacity?: number;
  amenities?: string[];
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending_payment'   // slot blocked, awaiting eFaas payment
  | 'confirmed'         // payment received
  | 'expired'           // payment deadline missed, slot released
  | 'cancelled';        // cancelled by team rep or admin

export interface TimeSlot {
  startTime: string;    // 'HH:MM'
  endTime: string;      // 'HH:MM'
  isAvailable: boolean;
}

export interface GuidelinesAcceptance {
  accepted: boolean;
  timestamp: string;    // ISO date string
  guidelineVersion: string;
}

export interface Booking {
  id: string;
  reference: string;    // e.g. 'HDC-2024-001234'
  facilityId: string;
  facilityName: string;
  teamId: string;
  teamName: string;
  userId: string;
  date: string;         // 'YYYY-MM-DD'
  startTime: string;    // 'HH:MM'
  endTime: string;      // 'HH:MM'
  durationHours: number;
  priceTotal: number;   // MVR
  status: BookingStatus;
  guidelinesAcceptance: GuidelinesAcceptance | null;
  paymentId?: string;
  paymentDeadline?: string;   // ISO date string — expiry time per BR-11
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;       // MVR
  currency: 'MVR';
  status: PaymentStatus;
  efaasTransactionId?: string;
  paymentUrl?: string;
  createdAt: string;
  completedAt?: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'booking_blocked'
  | 'booking_confirmed'
  | 'booking_expired'
  | 'booking_cancelled'
  | 'payment_reminder';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

// ─── Admin / Reports ──────────────────────────────────────────────────────────

export interface DashboardStats {
  bookingsToday: number;
  pendingPayment: number;
  confirmedToday: number;
  revenueThisMonth: number;
  utilizationRate: number;  // 0–100 percent
}

export interface FacilityBlockout {
  id: string;
  facilityId: string;
  startDate: string;
  endDate: string;
  reason: string;
}
