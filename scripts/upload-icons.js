#!/usr/bin/env node
/**
 * Captain's Cove - Icon Upload Script
 * Uploads game icons to Supabase Storage bucket
 *
 * Usage:
 *   SUPABASE_SERVICE_KEY=xxx node scripts/upload-icons.js
 *   SUPABASE_SERVICE_KEY=xxx node scripts/upload-icons.js --clear    # Clear bucket before upload
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';

// Command line flags
const args = process.argv.slice(2);
const CLEAR_MODE = args.includes('--clear') || args.includes('-c');

// Source directory
const TEXTURES_DIR = '/home/anton/datawosb/output/textures/items';
const BUCKET_NAME = 'game-icons';

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error('Error: SUPABASE_URL environment variable is required');
  console.error('Usage: SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx node scripts/upload-icons.js');
  process.exit(1);
}
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.error('Usage: SUPABASE_SERVICE_KEY=your-service-key node scripts/upload-icons.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════

// Map source folders to bucket paths
const FOLDER_MAPPING = {
  'cannons': 'weapons/cannons',
  'ammo': 'ammo',
  'kegs': 'kegs',
  'units': 'crews',
  'skills': 'skills',
  'upgrades': 'upgrades',
  'designs': 'cosmetics/designs',
  'resources': 'resources',
  'achievements': 'achievements',
  'powerups': 'consumables',
  'fractions': 'factions',
  'decor': 'misc'
};

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

function getAllFiles(dirPath, arrayOfFiles = [], basePath = '') {
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = join(dirPath, file);
    const relativePath = basePath ? join(basePath, file) : file;

    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles, relativePath);
    } else if (extname(file).toLowerCase() === '.png') {
      arrayOfFiles.push({
        localPath: filePath,
        relativePath
      });
    }
  }

  return arrayOfFiles;
}

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function getBucketPath(relativePath) {
  // Handle root-level files
  const parts = relativePath.split(/[/\\]/);
  if (parts.length === 1) {
    return `misc/${parts[0]}`;
  }

  const folder = parts[0];
  const rest = parts.slice(1).join('/');

  if (FOLDER_MAPPING[folder]) {
    return `${FOLDER_MAPPING[folder]}/${rest}`;
  }

  return relativePath;
}

// ═══════════════════════════════════════════════════
// BUCKET MANAGEMENT
// ═══════════════════════════════════════════════════

async function ensureBucketExists() {
  console.log(`Checking bucket "${BUCKET_NAME}"...`);

  // List buckets
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return false;
  }

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (bucketExists) {
    console.log(`  Bucket "${BUCKET_NAME}" already exists`);
    return true;
  }

  // Create bucket
  console.log(`  Creating bucket "${BUCKET_NAME}"...`);
  const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  });

  if (createError) {
    console.error('Error creating bucket:', createError.message);
    return false;
  }

  console.log(`  Bucket "${BUCKET_NAME}" created successfully`);
  return true;
}

/**
 * Clear all files from the bucket for a fresh upload.
 * Iterates through all folders and removes all files.
 */
async function clearBucket() {
  console.log('\n[CLEAR MODE] Removing all files from bucket...\n');

  // All folders we might have uploaded to
  const folders = [
    'weapons/cannons',
    'ammo',
    'kegs',
    'crews',
    'skills',
    'upgrades',
    'cosmetics/designs',
    'resources',
    'achievements',
    'consumables',
    'factions',
    'misc'
  ];

  let totalRemoved = 0;

  for (const folder of folders) {
    try {
      // List all files in this folder (with pagination)
      let allFiles = [];
      let offset = 0;
      const limit = 1000;

      while (true) {
        const { data: files, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(folder, { limit, offset });

        if (error) {
          // Folder might not exist, which is fine
          if (!error.message.includes('not found')) {
            console.warn(`  Warning listing ${folder}:`, error.message);
          }
          break;
        }

        if (!files || files.length === 0) break;

        allFiles = allFiles.concat(files);
        if (files.length < limit) break;
        offset += limit;
      }

      if (allFiles.length > 0) {
        // Remove all files in this folder
        const filePaths = allFiles.map(f => `${folder}/${f.name}`);
        const { error: removeError } = await supabase.storage
          .from(BUCKET_NAME)
          .remove(filePaths);

        if (removeError) {
          console.warn(`  Warning removing files from ${folder}:`, removeError.message);
        } else {
          console.log(`  Cleared: ${folder} (${allFiles.length} files)`);
          totalRemoved += allFiles.length;
        }
      }
    } catch (err) {
      console.warn(`  Error clearing ${folder}:`, err.message);
    }
  }

  console.log(`\n  Total files removed: ${totalRemoved}\n`);
}

// ═══════════════════════════════════════════════════
// UPLOAD FUNCTIONS
// ═══════════════════════════════════════════════════

async function uploadFile(file) {
  const bucketPath = getBucketPath(file.relativePath);
  const fileContent = readFileSync(file.localPath);
  const mimeType = getMimeType(file.localPath);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(bucketPath, fileContent, {
      contentType: mimeType,
      upsert: true
    });

  if (error) {
    return { success: false, path: bucketPath, error: error.message };
  }

  return { success: true, path: bucketPath };
}

async function uploadBatch(files, batchSize = 10) {
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const promises = batch.map(uploadFile);
    const batchResults = await Promise.all(promises);

    for (const result of batchResults) {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`${result.path}: ${result.error}`);
      }
    }

    // Progress
    const progress = Math.min(i + batchSize, files.length);
    process.stdout.write(`\r  Progress: ${progress}/${files.length} (${results.success} success, ${results.failed} failed)`);
  }

  console.log(); // New line after progress
  return results;
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Captain\'s Cove - Icon Upload Script                 ║');
  console.log('║  Source: datawosb/output/textures/items              ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // Show mode
  if (CLEAR_MODE) {
    console.log('Mode: CLEAR (remove all files before upload)');
  }

  // Step 1: Ensure bucket exists
  const bucketReady = await ensureBucketExists();
  if (!bucketReady) {
    console.error('Failed to ensure bucket exists. Exiting.');
    process.exit(1);
  }

  // Step 1.5: Clear bucket if requested
  if (CLEAR_MODE) {
    await clearBucket();
  }

  // Step 2: Collect all files
  console.log('\nCollecting files from:', TEXTURES_DIR);
  const files = getAllFiles(TEXTURES_DIR);
  console.log(`  Found ${files.length} PNG files`);

  // Step 3: Group by folder for display
  const byFolder = {};
  for (const file of files) {
    const folder = file.relativePath.split(/[/\\]/)[0] || 'root';
    byFolder[folder] = (byFolder[folder] || 0) + 1;
  }
  console.log('\n  By folder:');
  for (const [folder, count] of Object.entries(byFolder).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${folder}: ${count}`);
  }

  // Step 4: Upload files
  console.log('\nUploading files...');
  const results = await uploadBatch(files, 10);

  // Step 5: Summary
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Upload Complete                                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`
Summary:
  Total files:    ${files.length}
  Successful:     ${results.success}
  Failed:         ${results.failed}
`);

  if (results.errors.length > 0) {
    console.log('Errors:');
    for (const error of results.errors.slice(0, 10)) {
      console.log(`  - ${error}`);
    }
    if (results.errors.length > 10) {
      console.log(`  ... and ${results.errors.length - 10} more errors`);
    }
  }

  console.log(`
Bucket URL: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/
`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
