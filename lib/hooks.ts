import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/app/contexts/AuthContext';
import type {
  Facility,
  Booking,
  Blockout,
  TimeSlot,
  Team,
  TeamMember,
  Guideline,
} from '@/lib/types';

// ============================================
// useFacilities
// ============================================

export function useFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setFacilities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('facilities')
      .select('*')
      .eq('status', 'active')
      .order('name');

    if (err) {
      setError(err.message);
    } else {
      setFacilities(data as Facility[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const grouped = facilities.reduce<Record<string, Facility[]>>((acc, f) => {
    if (!acc[f.sport_type]) acc[f.sport_type] = [];
    acc[f.sport_type].push(f);
    return acc;
  }, {});

  return { facilities, grouped, loading, error, refetch: fetch };
}

// ============================================
// useFacility
// ============================================

export function useFacility(id: string) {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [blockouts, setBlockouts] = useState<Blockout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const [facilityRes, blockoutsRes] = await Promise.all([
        supabase.from('facilities').select('*').eq('id', id).single(),
        supabase
          .from('blockouts')
          .select('*')
          .eq('facility_id', id)
          .gte('end_datetime', new Date().toISOString())
          .order('start_datetime'),
      ]);

      if (cancelled) return;

      if (facilityRes.error) {
        setError(facilityRes.error.message);
      } else {
        setFacility(facilityRes.data as Facility);
      }

      if (blockoutsRes.error) {
        setError((prev) => prev ? `${prev}; ${blockoutsRes.error.message}` : blockoutsRes.error.message);
      } else {
        setBlockouts(blockoutsRes.data as Blockout[]);
      }

      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { facility, blockouts, loading, error };
}

// ============================================
// useFacilitySlots
// ============================================

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60).toString().padStart(2, '0');
  const mm = (total % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function useFacilitySlots(facilityId: string, date: string) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!facilityId || !date || !isSupabaseConfigured) {
      setSlots([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const [facilityRes, bookingsRes, blockoutsRes] = await Promise.all([
        supabase.from('facilities').select('*').eq('id', facilityId).single(),
        supabase
          .from('bookings')
          .select('*')
          .eq('facility_id', facilityId)
          .eq('booking_date', date)
          .in('status', ['pending_approval', 'blocked', 'confirmed']),
        supabase
          .from('blockouts')
          .select('*')
          .eq('facility_id', facilityId)
          .lte('start_datetime', `${date}T23:59:59`)
          .gte('end_datetime', `${date}T00:00:00`),
      ]);

      if (cancelled) return;

      if (facilityRes.error) {
        setError(facilityRes.error.message);
        setLoading(false);
        return;
      }

      const facility = facilityRes.data as Facility;
      const bookings = (bookingsRes.data || []) as Booking[];
      const blockoutsList = (blockoutsRes.data || []) as Blockout[];

      // Generate time slots
      const generated: TimeSlot[] = [];
      let current = facility.operating_start;
      const endMinutes = timeToMinutes(facility.operating_end);

      while (timeToMinutes(current) + facility.slot_duration_min <= endMinutes) {
        const slotEnd = addMinutes(current, facility.slot_duration_min);
        const slotStartMin = timeToMinutes(current);
        const slotEndMin = timeToMinutes(slotEnd);

        // Check bookings overlap
        const overlappingBooking = bookings.find((b) => {
          const bStart = timeToMinutes(b.start_time);
          const bEnd = timeToMinutes(b.end_time);
          return bStart < slotEndMin && bEnd > slotStartMin;
        });

        // Check blockouts overlap
        const isBlocked = blockoutsList.some((bl) => {
          const blStart = new Date(bl.start_datetime);
          const blEnd = new Date(bl.end_datetime);
          const slotStartDt = new Date(`${date}T${current}:00`);
          const slotEndDt = new Date(`${date}T${slotEnd}:00`);
          return slotStartDt < blEnd && slotEndDt > blStart;
        });

        const available = !overlappingBooking && !isBlocked;

        generated.push({
          start_time: current,
          end_time: slotEnd,
          available,
          ...(overlappingBooking ? { booking: overlappingBooking } : {}),
        });

        current = slotEnd;
      }

      setSlots(generated);
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [facilityId, date]);

  return { slots, loading, error };
}

// ============================================
// useMyBookings
// ============================================

export function useMyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Booking & { facility?: Facility })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Get user's team IDs
    const { data: memberships, error: memErr } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (memErr) {
      setError(memErr.message);
      setLoading(false);
      return;
    }

    const teamIds = (memberships || []).map((m: { team_id: string }) => m.team_id);

    if (teamIds.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const { data, error: bookErr } = await supabase
      .from('bookings')
      .select('*, facility:facilities(*)')
      .in('team_id', teamIds)
      .order('booking_date', { ascending: false });

    if (bookErr) {
      setError(bookErr.message);
    } else {
      setBookings(data as (Booking & { facility?: Facility })[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { bookings, loading, error, refetch: fetch };
}

// ============================================
// useMyTeam
// ============================================

export function useMyTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data: membership, error: memErr } = await supabase
        .from('team_members')
        .select('*, team:teams(*)')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .single();

      if (cancelled) return;

      if (memErr) {
        setError(memErr.message);
        setLoading(false);
        return;
      }

      const member = membership as TeamMember & { team: Team };
      setTeam(member.team);
      setIsRepresentative(member.is_representative);
      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, [user]);

  return { team, isRepresentative, loading, error };
}

// ============================================
// useGuidelines
// ============================================

export function useGuidelines() {
  const [guideline, setGuideline] = useState<Guideline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('guidelines')
        .select('*')
        .eq('is_current', true)
        .single();

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        setGuideline(data as Guideline);
      }

      setLoading(false);
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { guideline, loading, error };
}
