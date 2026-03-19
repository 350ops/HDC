// ============================================
// Database types for HDC Sports Booking App
// Generated from Supabase schema
// ============================================

// Enums
export type UserRole = 'team_rep' | 'csr_admin' | 'finance' | 'sys_admin';
export type TeamStatus = 'active' | 'inactive' | 'suspended';
export type MemberStatus = 'active' | 'inactive';
export type FacilityStatus = 'active' | 'inactive';
export type BookingStatus =
  | 'pending_approval'
  | 'blocked'
  | 'confirmed'
  | 'expired'
  | 'cancelled'
  | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed';
export type NotificationType =
  | 'email_blocked'
  | 'sms_confirmed'
  | 'email_confirmed'
  | 'email_expired';
export type NotificationLogStatus = 'sent' | 'failed';

// Tables
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  sport_type: string;
  registration_no: string | null;
  status: TeamStatus;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  is_representative: boolean;
  status: MemberStatus;
  created_at: string;
}

export interface Facility {
  id: string;
  name: string;
  neighborhood: string | null;
  sport_type: string;
  description: string | null;
  capacity: number | null;
  image_urls: string[];
  slot_duration_min: number;
  price_per_slot: number;
  operating_start: string; // time as HH:MM
  operating_end: string; // time as HH:MM
  requires_approval: boolean;
  status: FacilityStatus;
  created_at: string;
  updated_at: string;
}

export interface Blockout {
  id: string;
  facility_id: string;
  start_datetime: string;
  end_datetime: string;
  reason: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  reference_no: string | null;
  team_id: string;
  facility_id: string;
  booked_by: string;
  booking_date: string; // date as YYYY-MM-DD
  start_time: string; // time as HH:MM
  end_time: string; // time as HH:MM
  status: BookingStatus;
  payment_deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guideline {
  id: string;
  version: string;
  content: string | null;
  file_url: string | null;
  is_current: boolean;
  created_by: string | null;
  created_at: string;
}

export interface GuidelineAcceptance {
  id: string;
  booking_id: string;
  user_id: string;
  guideline_version: string;
  accepted_at: string;
}

export interface NotificationLog {
  id: string;
  booking_id: string | null;
  type: NotificationType;
  recipient: string;
  status: NotificationLogStatus;
  provider_response: Record<string, unknown> | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Joined/extended types used in the app
export interface BookingWithDetails extends Booking {
  facility?: Facility;
  team?: Team;
  booked_by_profile?: Profile;
  payment?: Payment;
}

export interface TeamWithMembers extends Team {
  members?: (TeamMember & { profile?: Profile })[];
}

export interface FacilityWithAvailability extends Facility {
  bookings?: Booking[];
  blockouts?: Blockout[];
}

// Time slot for the availability calendar
export interface TimeSlot {
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  available: boolean;
  booking?: Booking;
}
