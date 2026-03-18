-- ============================================
-- HDC Sports Facilities Booking App - Schema
-- ============================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('team_rep', 'csr_admin', 'finance', 'sys_admin');
CREATE TYPE team_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE member_status AS ENUM ('active', 'inactive');
CREATE TYPE facility_status AS ENUM ('active', 'inactive');
CREATE TYPE booking_status AS ENUM ('pending_approval', 'blocked', 'confirmed', 'expired', 'cancelled', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'refunded', 'failed');
CREATE TYPE notification_type AS ENUM ('email_blocked', 'sms_confirmed', 'email_confirmed', 'email_expired');
CREATE TYPE notification_status AS ENUM ('sent', 'failed');

-- 2. PROFILES (linked to auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  role user_role DEFAULT 'team_rep',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. TEAMS
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport_type text NOT NULL,
  registration_no text UNIQUE,
  status team_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. TEAM MEMBERS (join table: users <-> teams)
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_representative boolean DEFAULT false,
  status member_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 5. FACILITIES
CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  neighborhood text,
  sport_type text NOT NULL,
  description text,
  capacity integer,
  image_urls text[] DEFAULT '{}',
  slot_duration_min integer DEFAULT 60,
  price_per_slot decimal(10,2) NOT NULL,
  operating_start time DEFAULT '06:00',
  operating_end time DEFAULT '23:00',
  requires_approval boolean DEFAULT false,
  status facility_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. BLOCKOUTS
CREATE TABLE blockouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  reason text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_blockout_range CHECK (end_datetime > start_datetime)
);

-- 7. BOOKINGS
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no text UNIQUE,
  team_id uuid NOT NULL REFERENCES teams(id),
  facility_id uuid NOT NULL REFERENCES facilities(id),
  booked_by uuid NOT NULL REFERENCES profiles(id),
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status booking_status DEFAULT 'blocked',
  payment_deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Partial unique index to prevent double bookings (BR-10)
CREATE UNIQUE INDEX idx_no_double_booking
  ON bookings (facility_id, booking_date, start_time)
  WHERE status IN ('blocked', 'confirmed');

-- 8. PAYMENTS
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_session_id text,
  stripe_payment_intent_id text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'MVR',
  status payment_status DEFAULT 'pending',
  refund_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. GUIDELINES
CREATE TABLE guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  content text,
  file_url text,
  is_current boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- 10. GUIDELINE ACCEPTANCES
CREATE TABLE guideline_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  guideline_version text NOT NULL,
  accepted_at timestamptz DEFAULT now()
);

-- 11. NOTIFICATION LOGS
CREATE TABLE notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  recipient text NOT NULL,
  status notification_status NOT NULL,
  provider_response jsonb,
  created_at timestamptz DEFAULT now()
);

-- 12. AUDIT LOGS
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_bookings_team ON bookings(team_id);
CREATE INDEX idx_bookings_facility ON bookings(facility_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_blockouts_facility ON blockouts(facility_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_notification_logs_booking ON notification_logs(booking_id);
