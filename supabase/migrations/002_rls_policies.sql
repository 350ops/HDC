-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE guideline_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('csr_admin', 'sys_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is finance or admin
CREATE OR REPLACE FUNCTION is_finance_or_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('csr_admin', 'sys_admin', 'finance')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get user's team IDs
CREATE OR REPLACE FUNCTION user_team_ids()
RETURNS SETOF uuid AS $$
  SELECT team_id FROM team_members
  WHERE user_id = auth.uid()
  AND status = 'active';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES
-- ============================================
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Allow insert for auth trigger"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================
-- TEAMS
-- ============================================
CREATE POLICY "Team members can read their team"
  ON teams FOR SELECT
  USING (
    id IN (SELECT user_team_ids())
    OR is_admin()
  );

CREATE POLICY "Admins can manage teams"
  ON teams FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- TEAM MEMBERS
-- ============================================
CREATE POLICY "Members can read own team members"
  ON team_members FOR SELECT
  USING (
    team_id IN (SELECT user_team_ids())
    OR is_admin()
  );

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- FACILITIES (public read for active, admin CRUD)
-- ============================================
CREATE POLICY "Anyone authed can read active facilities"
  ON facilities FOR SELECT
  USING (status = 'active' OR is_admin());

CREATE POLICY "Admins can manage facilities"
  ON facilities FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- BLOCKOUTS
-- ============================================
CREATE POLICY "Anyone authed can read blockouts"
  ON blockouts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blockouts"
  ON blockouts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- BOOKINGS
-- ============================================
CREATE POLICY "Team reps can read own team bookings"
  ON bookings FOR SELECT
  USING (
    team_id IN (SELECT user_team_ids())
    OR is_admin()
  );

CREATE POLICY "Team reps can create bookings for their team"
  ON bookings FOR INSERT
  WITH CHECK (
    team_id IN (SELECT user_team_ids())
    AND booked_by = auth.uid()
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- PAYMENTS
-- ============================================
CREATE POLICY "Team reps can read own payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE team_id IN (SELECT user_team_ids())
    )
    OR is_finance_or_admin()
  );

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  USING (is_finance_or_admin())
  WITH CHECK (is_finance_or_admin());

-- ============================================
-- GUIDELINES
-- ============================================
CREATE POLICY "Anyone authed can read current guidelines"
  ON guidelines FOR SELECT
  USING (is_current = true OR is_admin());

CREATE POLICY "Admins can manage guidelines"
  ON guidelines FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- GUIDELINE ACCEPTANCES
-- ============================================
CREATE POLICY "Users can read own acceptances"
  ON guideline_acceptances FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can create own acceptances"
  ON guideline_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- NOTIFICATION LOGS
-- ============================================
CREATE POLICY "Admins can read notification logs"
  ON notification_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert notification logs"
  ON notification_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE POLICY "Sys admins can read audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'sys_admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
