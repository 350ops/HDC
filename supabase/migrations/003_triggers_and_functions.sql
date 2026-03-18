-- ============================================
-- Triggers & Functions
-- ============================================

-- 1. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 2. Auto-generate booking reference number
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS trigger AS $$
DECLARE
  date_str text;
  seq_num integer;
BEGIN
  date_str := to_char(NEW.booking_date, 'YYYYMMDD');

  SELECT COUNT(*) + 1 INTO seq_num
  FROM bookings
  WHERE booking_date = NEW.booking_date;

  NEW.reference_no := 'HDC-' || date_str || '-' || lpad(seq_num::text, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.reference_no IS NULL)
  EXECUTE FUNCTION generate_booking_reference();

-- 3. Auto-set payment deadline (30 minutes from creation)
CREATE OR REPLACE FUNCTION set_payment_deadline()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'blocked' AND NEW.payment_deadline IS NULL THEN
    NEW.payment_deadline := now() + interval '30 minutes';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_payment_deadline
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_deadline();

-- 4. Updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Function to expire overdue bookings (called by pg_cron or Edge Function)
CREATE OR REPLACE FUNCTION expire_overdue_bookings()
RETURNS integer AS $$
DECLARE
  expired_count integer;
BEGIN
  UPDATE bookings
  SET status = 'expired', updated_at = now()
  WHERE status = 'blocked'
    AND payment_deadline < now();

  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Function to check slot availability
CREATE OR REPLACE FUNCTION check_slot_available(
  p_facility_id uuid,
  p_booking_date date,
  p_start_time time,
  p_end_time time
)
RETURNS boolean AS $$
BEGIN
  -- Check for overlapping bookings
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE facility_id = p_facility_id
      AND booking_date = p_booking_date
      AND status IN ('blocked', 'confirmed')
      AND start_time < p_end_time
      AND end_time > p_start_time
  ) THEN
    RETURN false;
  END IF;

  -- Check for blockouts
  IF EXISTS (
    SELECT 1 FROM blockouts
    WHERE facility_id = p_facility_id
      AND start_datetime <= (p_booking_date + p_start_time)
      AND end_datetime >= (p_booking_date + p_end_time)
  ) THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
