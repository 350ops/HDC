import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create a real client if credentials are provided
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : (null as unknown as SupabaseClient);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Build a public URL for a file in Supabase Storage.
 * Usage: getStorageUrl('facility-images', 'football/pitch-1.jpg')
 */
export function getStorageUrl(bucket: string, path: string): string {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Sport-specific facility image paths in the 'facility-images' bucket.
 * Each sport has multiple images for carousel display.
 */
export const FACILITY_IMAGE_PATHS: Record<string, string[]> = {
  Football: [
    'football/pitch-main.jpg',
    'football/pitch-aerial.jpg',
    'football/pitch-night.jpg',
  ],
  Cricket: [
    'cricket/ground-main.jpg',
    'cricket/nets-practice.jpg',
    'cricket/pavilion.jpg',
  ],
  Basketball: [
    'basketball/court-main.jpg',
    'basketball/court-indoor.jpg',
    'basketball/court-night.jpg',
  ],
  Badminton: [
    'badminton/hall-main.jpg',
    'badminton/court-close.jpg',
    'badminton/hall-wide.jpg',
  ],
  Volleyball: [
    'volleyball/court-beach.jpg',
    'volleyball/court-main.jpg',
    'volleyball/court-sunset.jpg',
  ],
  Tennis: [
    'tennis/court-main.jpg',
    'tennis/court-aerial.jpg',
    'tennis/court-close.jpg',
  ],
  Swimming: [
    'swimming/pool-main.jpg',
    'swimming/pool-lanes.jpg',
    'swimming/pool-aerial.jpg',
  ],
};

/**
 * Get full Supabase storage URLs for a sport type's images.
 * Returns empty array if Supabase is not configured.
 */
export function getFacilityImageUrls(sportType: string): string[] {
  const paths = FACILITY_IMAGE_PATHS[sportType] || FACILITY_IMAGE_PATHS['Football'];
  return paths.map((p) => getStorageUrl('facility-images', p));
}
