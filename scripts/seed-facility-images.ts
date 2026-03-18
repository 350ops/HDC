/**
 * Seed script: Upload sample facility images to Supabase Storage.
 *
 * Usage:
 *   npx ts-node scripts/seed-facility-images.ts
 *
 * Prerequisites:
 *   - Set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 *   - Run migration 005 first to create the 'facility-images' bucket
 *   - Place sample images in scripts/sample-images/ following the folder structure below
 *
 * Expected folder structure for scripts/sample-images/:
 *   football/pitch-main.jpg
 *   football/pitch-aerial.jpg
 *   football/pitch-night.jpg
 *   cricket/ground-main.jpg
 *   cricket/nets-practice.jpg
 *   cricket/pavilion.jpg
 *   basketball/court-main.jpg
 *   basketball/court-indoor.jpg
 *   basketball/court-night.jpg
 *   badminton/hall-main.jpg
 *   badminton/court-close.jpg
 *   badminton/hall-wide.jpg
 *   volleyball/court-beach.jpg
 *   volleyball/court-main.jpg
 *   volleyball/court-sunset.jpg
 *   tennis/court-main.jpg
 *   tennis/court-aerial.jpg
 *   tennis/court-close.jpg
 *   swimming/pool-main.jpg
 *   swimming/pool-lanes.jpg
 *   swimming/pool-aerial.jpg
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const BUCKET = 'facility-images';
const SAMPLE_DIR = path.join(__dirname, 'sample-images');

async function uploadFile(filePath: string, storagePath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Failed to upload ${storagePath}:`, error.message);
  } else {
    console.log(`Uploaded: ${storagePath}`);
  }
}

async function walkAndUpload(dir: string, prefix: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const storagePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      await walkAndUpload(fullPath, storagePath);
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
      await uploadFile(fullPath, storagePath);
    }
  }
}

async function main() {
  if (!fs.existsSync(SAMPLE_DIR)) {
    console.error(`Sample images directory not found: ${SAMPLE_DIR}`);
    console.log('\nCreate the directory and add sport images:');
    console.log('  mkdir -p scripts/sample-images/{football,cricket,basketball,badminton,volleyball,tennis,swimming}');
    console.log('  # Then add .jpg images matching the expected filenames above');
    process.exit(1);
  }

  console.log(`Uploading images from ${SAMPLE_DIR} to bucket '${BUCKET}'...`);
  await walkAndUpload(SAMPLE_DIR);
  console.log('\nDone! Images are now available at:');
  console.log(`  ${supabaseUrl}/storage/v1/object/public/${BUCKET}/<sport>/<filename>.jpg`);
}

main().catch(console.error);
