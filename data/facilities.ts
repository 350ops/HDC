import { Facility } from '@/types';

// All facilities are configurable — never hard-coded in UI screens (BR-02).
// Images use local assets for mockups.

// NOTE: For assets, avoid tsconfig path aliases (`@/`) in `require(...)`.
// Metro resolves these as encoded paths and can fail at runtime.
const HdcBasketballCourt = require('../assets/img/facilities_images/Website Photos_HDC Basketball Court.jpg');
const HdcVolleyballCourt = require('../assets/img/facilities_images/Website Photos_HDC Volleyball Court.jpg');
const ChinaFlatsBasketballHalfCourt = require('../assets/img/facilities_images/Website Photos_China Flats Basketball Half Court.jpg');
const ChinaFlatsFootball3x3 = require('../assets/img/facilities_images/Website Photos_China Flats 3x3 Football.jpg');
const MyHulhumaleVolleyballCourt = require('../assets/img/facilities_images/Website Photos_MyHulhumale Volleyball Court.jpg');
const SunsetParkVolleyballCourt = require('../assets/img/facilities_images/Website Photos_Sunset Park Volleyball Court.jpg');
const CentralParkNetballCourt = require('../assets/img/facilities_images/Website Photos_Central Park Netball Court.jpg');
const CentralParkBeachHandballCourt = require('../assets/img/facilities_images/Website Photos_Central Park Beach Handball Court.jpg');
const CentralPark = require('../assets/img/facilities_images/Website Photos_Central Park.jpg');

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
      HdcBasketballCourt,
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
      HdcVolleyballCourt,
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
      ChinaFlatsBasketballHalfCourt,
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
      MyHulhumaleVolleyballCourt,
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
      ChinaFlatsFootball3x3,
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
      SunsetParkVolleyballCourt,
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
      CentralParkNetballCourt,
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
      CentralParkNetballCourt,
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
      CentralParkBeachHandballCourt,
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
      CentralPark,
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
      ChinaFlatsBasketballHalfCourt,
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
      CentralPark,
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
      CentralPark,
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
      MyHulhumaleVolleyballCourt,
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
      HdcBasketballCourt,
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
      CentralPark,
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
