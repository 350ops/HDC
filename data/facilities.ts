import { Facility } from '@/types';

// All facilities are configurable — never hard-coded in UI screens (BR-02).
// Images use placeholder URLs; replace with real HDC asset URLs before production.

export const FACILITIES: Facility[] = [
  // ── Neighborhood 1 — HDC Park Area ────────────────────────────────────────
  {
    id: 'n1-basketball',
    name: 'My Hulhumalé Basketball Court',
    neighborhood: 'N1',
    neighborhoodLabel: 'Neighborhood 1 – HDC Park Area',
    sport: 'basketball',
    description: 'Full-size outdoor basketball court located in the HDC Park Area, suitable for team practice and friendly matches.',
    images: [
      'https://images.unsplash.com/photo-1546519638405-a4e5bc4a2a5e?w=800',
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 250,
    isActive: true,
    amenities: ['Floodlights', 'Seating area', 'Water station'],
  },
  {
    id: 'n1-volleyball',
    name: 'HDC Volleyball Court',
    neighborhood: 'N1',
    neighborhoodLabel: 'Neighborhood 1 – HDC Park Area',
    sport: 'volleyball',
    description: 'Outdoor volleyball court with regulation net setup in the HDC Park Area.',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Floodlights', 'Net provided'],
  },
  {
    id: 'n1-half-basketball',
    name: 'HDC Half Basketball Court',
    neighborhood: 'N1',
    neighborhoodLabel: 'Neighborhood 1 – HDC Park Area',
    sport: 'basketball',
    description: 'Half-court basketball setup, ideal for 3-on-3 play and skill training.',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 150,
    isActive: true,
    amenities: ['Floodlights'],
  },

  // ── Neighborhood 2 — Container Park & Sunset Park ─────────────────────────
  {
    id: 'n2-volleyball-myhulhumale',
    name: 'My Hulhumalé Volleyball Court',
    neighborhood: 'N2',
    neighborhoodLabel: 'Neighborhood 2 – Container Park & Sunset Park',
    sport: 'volleyball',
    description: 'Outdoor volleyball court near Container Park, ideal for evening games.',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Floodlights', 'Net provided'],
  },
  {
    id: 'n2-football',
    name: 'Fiyavathi Playing Ground (Mini Football)',
    neighborhood: 'N2',
    neighborhoodLabel: 'Neighborhood 2 – Container Park & Sunset Park',
    sport: 'football',
    description: 'Mini football pitch at Fiyavathi Playing Ground, suitable for 5-a-side matches.',
    images: [
      'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 300,
    isActive: true,
    amenities: ['Floodlights', 'Goal posts', 'Seating area'],
  },
  {
    id: 'n2-volleyball-sunset',
    name: 'Sunset Park Volleyball Court',
    neighborhood: 'N2',
    neighborhoodLabel: 'Neighborhood 2 – Container Park & Sunset Park',
    sport: 'volleyball',
    description: 'Scenic volleyball court at Sunset Park with ocean views.',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Net provided', 'Scenic location'],
  },

  // ── Central Park Area (between N1 & N2) ───────────────────────────────────
  {
    id: 'cp-netball-1',
    name: 'Central Park Netball Court 1',
    neighborhood: 'N2',
    neighborhoodLabel: 'Central Park Area',
    sport: 'netball',
    description: 'Regulation netball court in Central Park, suitable for official matches.',
    images: [
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Floodlights', 'Posts provided'],
  },
  {
    id: 'cp-netball-2',
    name: 'Central Park Netball Court 2',
    neighborhood: 'N2',
    neighborhoodLabel: 'Central Park Area',
    sport: 'netball',
    description: 'Second netball court in Central Park for concurrent bookings.',
    images: [
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Floodlights', 'Posts provided'],
  },
  {
    id: 'cp-handball',
    name: 'Central Park Beach Handball Court',
    neighborhood: 'N2',
    neighborhoodLabel: 'Central Park Area',
    sport: 'handball',
    description: 'Beach handball court in Central Park with sand surface.',
    images: [
      'https://images.unsplash.com/photo-1526401281623-31b5e80a8c1e?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Sand surface', 'Goal posts'],
  },

  // ── Neighborhood 3 — Fehires Park ─────────────────────────────────────────
  {
    id: 'n3-volleyball',
    name: 'Fehires Park Volleyball Court',
    neighborhood: 'N3',
    neighborhoodLabel: 'Neighborhood 3 – Fehires Park',
    sport: 'volleyball',
    description: 'Outdoor volleyball court at Fehires Park.',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Net provided'],
  },
  {
    id: 'n3-half-basketball',
    name: 'Fehires Park Basketball Half Court',
    neighborhood: 'N3',
    neighborhoodLabel: 'Neighborhood 3 – Fehires Park',
    sport: 'basketball',
    description: 'Half basketball court at Fehires Park.',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 150,
    isActive: true,
    amenities: ['Floodlights'],
  },

  // ── Neighborhood 6 — Hulhumalé Kulhivaru Ekuveni ──────────────────────────
  {
    id: 'n6-bashi-1',
    name: 'Kulhivaru Ekuveni Bashi Ball Court 1',
    neighborhood: 'N6',
    neighborhoodLabel: 'Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni',
    sport: 'bashi',
    description: 'Bashi ball court at Kulhivaru Ekuveni — traditional Maldivian sport facility.',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 150,
    isActive: true,
    amenities: ['Floodlights'],
  },
  {
    id: 'n6-bashi-2',
    name: 'Kulhivaru Ekuveni Bashi Ball Court 2',
    neighborhood: 'N6',
    neighborhoodLabel: 'Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni',
    sport: 'bashi',
    description: 'Second bashi ball court for concurrent bookings.',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 150,
    isActive: true,
    amenities: ['Floodlights'],
  },
  {
    id: 'n6-volleyball',
    name: 'Kulhivaru Ekuveni Volleyball Court',
    neighborhood: 'N6',
    neighborhoodLabel: 'Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni',
    sport: 'volleyball',
    description: 'Outdoor volleyball court at Kulhivaru Ekuveni.',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 200,
    isActive: true,
    amenities: ['Net provided'],
  },
  {
    id: 'n6-basketball',
    name: 'Kulhivaru Ekuveni Basketball Court',
    neighborhood: 'N6',
    neighborhoodLabel: 'Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni',
    sport: 'basketball',
    description: 'Full basketball court at Kulhivaru Ekuveni.',
    images: [
      'https://images.unsplash.com/photo-1546519638405-a4e5bc4a2a5e?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 250,
    isActive: true,
    amenities: ['Floodlights', 'Seating area'],
  },
  {
    id: 'n6-multipurpose',
    name: 'Kulhivaru Ekuveni Multi-Purpose Court',
    neighborhood: 'N6',
    neighborhoodLabel: 'Neighborhood 6 – Hulhumalé Kulhivaru Ekuveni',
    sport: 'multi-purpose',
    description: 'Versatile multi-purpose court suitable for various sports.',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    ],
    operatingHours: { open: '06:00', close: '23:00' },
    pricePerHour: 250,
    isActive: true,
    amenities: ['Floodlights', 'Flexible layout'],
  },
];

// Neighborhood metadata for UI grouping/filtering
export const NEIGHBORHOODS: { id: string; label: string; shortLabel: string }[] = [
  { id: 'N1', label: 'Neighborhood 1 – HDC Park Area', shortLabel: 'N1 · HDC Park' },
  { id: 'N2', label: 'Neighborhood 2 – Container Park & Sunset Park', shortLabel: 'N2 · Sunset' },
  { id: 'N3', label: 'Neighborhood 3 – Fehires Park', shortLabel: 'N3 · Fehires' },
  { id: 'N6', label: 'Neighborhood 6 – Kulhivaru Ekuveni', shortLabel: 'N6 · Kulhivaru' },
];

// Sport labels & icons for display
export const SPORT_LABELS: Record<string, string> = {
  basketball: 'Basketball',
  volleyball: 'Volleyball',
  football: 'Football',
  netball: 'Netball',
  handball: 'Handball',
  badminton: 'Badminton',
  bashi: 'Bashi Ball',
  'multi-purpose': 'Multi-Purpose',
};
