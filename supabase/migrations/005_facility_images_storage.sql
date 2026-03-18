-- ============================================
-- Create storage bucket for facility images
-- and update facilities with image_urls
-- ============================================

-- Create the facility-images storage bucket (public access for reading)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'facility-images',
  'facility-images',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to facility images
CREATE POLICY "Public read access for facility images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'facility-images');

-- Allow authenticated users (admins) to upload facility images
CREATE POLICY "Admin upload for facility images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'facility-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users (admins) to update facility images
CREATE POLICY "Admin update for facility images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'facility-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users (admins) to delete facility images
CREATE POLICY "Admin delete for facility images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'facility-images'
    AND auth.role() = 'authenticated'
  );

-- Update existing facilities with image_urls pointing to Supabase storage paths
-- (Images must be uploaded separately to the bucket at these paths)

UPDATE facilities SET image_urls = ARRAY[
  'football/pitch-main.jpg',
  'football/pitch-aerial.jpg',
  'football/pitch-night.jpg'
]
WHERE sport_type = 'Football';

UPDATE facilities SET image_urls = ARRAY[
  'football/pitch-aerial.jpg',
  'football/pitch-main.jpg',
  'football/pitch-night.jpg'
]
WHERE sport_type = 'Futsal';

UPDATE facilities SET image_urls = ARRAY[
  'cricket/ground-main.jpg',
  'cricket/nets-practice.jpg',
  'cricket/pavilion.jpg'
]
WHERE sport_type = 'Cricket';

UPDATE facilities SET image_urls = ARRAY[
  'basketball/court-main.jpg',
  'basketball/court-indoor.jpg',
  'basketball/court-night.jpg'
]
WHERE sport_type = 'Basketball';

UPDATE facilities SET image_urls = ARRAY[
  'badminton/hall-main.jpg',
  'badminton/court-close.jpg',
  'badminton/hall-wide.jpg'
]
WHERE sport_type = 'Badminton';

UPDATE facilities SET image_urls = ARRAY[
  'volleyball/court-beach.jpg',
  'volleyball/court-main.jpg',
  'volleyball/court-sunset.jpg'
]
WHERE sport_type = 'Volleyball';

UPDATE facilities SET image_urls = ARRAY[
  'tennis/court-main.jpg',
  'tennis/court-aerial.jpg',
  'tennis/court-close.jpg'
]
WHERE sport_type = 'Tennis';

UPDATE facilities SET image_urls = ARRAY[
  'swimming/pool-main.jpg',
  'swimming/pool-lanes.jpg',
  'swimming/pool-aerial.jpg'
]
WHERE sport_type = 'Swimming';

UPDATE facilities SET image_urls = ARRAY[
  'table-tennis/hall-main.jpg',
  'table-tennis/tables.jpg'
]
WHERE sport_type = 'Table Tennis';

UPDATE facilities SET image_urls = ARRAY[
  'multi-purpose/hall-main.jpg',
  'multi-purpose/hall-wide.jpg',
  'multi-purpose/hall-event.jpg'
]
WHERE sport_type = 'Multi-purpose';
