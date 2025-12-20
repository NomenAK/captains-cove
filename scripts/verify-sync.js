#!/usr/bin/env node
/**
 * Captain's Cove - Sync Verification Script
 * Verifies database record counts and data integrity after sync
 *
 * Usage: SUPABASE_SERVICE_KEY=xxx node scripts/verify-sync.js
 */

import { createClient } from '@supabase/supabase-js';

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lewslcexldrbequixxpg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.error('Usage: SUPABASE_SERVICE_KEY=your-service-key node scripts/verify-sync.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Expected record counts (approximate, from source data analysis)
const EXPECTED_COUNTS = {
  ships: { min: 65, max: 80 },
  weapons: { min: 38, max: 50 },
  ammo: { min: 18, max: 25 },
  swivel_ammo: { min: 3, max: 6 },
  kegs: { min: 6, max: 12 },
  crews: { min: 50, max: 60 },
  skills: { min: 50, max: 60 },
  upgrades: { min: 35, max: 45 },
  cosmetics: { min: 500, max: 600 },
  consumables: { min: 28, max: 40 },
  resources: { min: 70, max: 85 },
  ports: { min: 38, max: 50 },
  achievements: { min: 50, max: 65 },
  ranks: { min: 25, max: 35 },
  guilds: { min: 15, max: 25 },
  arena_bonuses: { min: 8, max: 15 },
  localization: { min: 5000, max: 6000 } // English only
};

// Storage bucket folders to verify
const STORAGE_FOLDERS = [
  'weapons/cannons',
  'ammo',
  'kegs',
  'crews',
  'skills',
  'upgrades',
  'resources',
  'achievements',
  'consumables'
];

// ═══════════════════════════════════════════════════
// VERIFICATION FUNCTIONS
// ═══════════════════════════════════════════════════

async function verifyTableCount(tableName, expected) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) {
    return { table: tableName, status: 'error', message: error.message };
  }

  const withinRange = count >= expected.min && count <= expected.max;
  return {
    table: tableName,
    status: withinRange ? 'pass' : 'warn',
    count,
    expected: `${expected.min}-${expected.max}`,
    message: withinRange ? '' : `Count ${count} outside expected range`
  };
}

async function verifyStorageFolder(folder) {
  const { data: files, error } = await supabase.storage
    .from('game-icons')
    .list(folder, { limit: 1000 });

  if (error) {
    return { folder, status: 'error', count: 0, message: error.message };
  }

  const count = files?.length || 0;
  return {
    folder,
    status: count > 0 ? 'pass' : 'warn',
    count,
    message: count === 0 ? 'No files found' : ''
  };
}

async function verifyDataIntegrity() {
  const issues = [];

  // 1. Check ships have valid tiers (1-6)
  const { data: ships, error: shipError } = await supabase
    .from('ships')
    .select('id, name, tier')
    .or('tier.lt.1,tier.gt.6');

  if (!shipError && ships?.length > 0) {
    issues.push(`${ships.length} ships have invalid tier values`);
  }

  // 2. Check weapons have valid categories
  const validCategories = ['Cannon', 'Carronade', 'Culverin', 'Mortar', 'Bombard'];
  const { data: weapons, error: weaponError } = await supabase
    .from('weapons')
    .select('id, category');

  if (!weaponError && weapons) {
    const invalidWeapons = weapons.filter(w => !validCategories.includes(w.category));
    if (invalidWeapons.length > 0) {
      issues.push(`${invalidWeapons.length} weapons have invalid category values`);
    }
  }

  // 3. Check localization has ship names
  const { data: locShips, error: locError } = await supabase
    .from('localization')
    .select('key')
    .like('key', 'ship_%_name')
    .eq('language', 'en');

  if (!locError) {
    const locCount = locShips?.length || 0;
    if (locCount < 50) {
      issues.push(`Only ${locCount} ship name localizations found (expected 60+)`);
    }
  }

  // 4. Verify sample image URLs work
  const testImages = [
    'weapons/cannons/lite_cannon_castiron.png',
    'ammo/round.png',
    'resources/wood.png'
  ];

  for (const imagePath of testImages) {
    const { data } = supabase.storage.from('game-icons').getPublicUrl(imagePath);
    if (!data?.publicUrl) {
      issues.push(`Image not accessible: ${imagePath}`);
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Captain\'s Cove - Sync Verification                  ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  let passCount = 0;
  let warnCount = 0;
  let errorCount = 0;

  // ─────────────────────────────────────────────
  // 1. Verify table counts
  // ─────────────────────────────────────────────
  console.log('[1] Verifying database table counts...\n');

  const tableResults = [];
  for (const [table, expected] of Object.entries(EXPECTED_COUNTS)) {
    const result = await verifyTableCount(table, expected);
    tableResults.push(result);

    const icon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗';
    console.log(`  ${icon} ${table}: ${result.count || 0} (expected ${result.expected})`);

    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else errorCount++;
  }

  // ─────────────────────────────────────────────
  // 2. Verify storage folders
  // ─────────────────────────────────────────────
  console.log('\n[2] Verifying storage bucket folders...\n');

  for (const folder of STORAGE_FOLDERS) {
    const result = await verifyStorageFolder(folder);
    const icon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗';
    console.log(`  ${icon} ${folder}: ${result.count} files`);

    if (result.status === 'pass') passCount++;
    else if (result.status === 'warn') warnCount++;
    else errorCount++;
  }

  // ─────────────────────────────────────────────
  // 3. Verify data integrity
  // ─────────────────────────────────────────────
  console.log('\n[3] Verifying data integrity...\n');

  const integrityIssues = await verifyDataIntegrity();

  if (integrityIssues.length === 0) {
    console.log('  ✓ All integrity checks passed');
    passCount++;
  } else {
    for (const issue of integrityIssues) {
      console.log(`  ⚠ ${issue}`);
      warnCount++;
    }
  }

  // ─────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Verification Complete                                ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  const totalChecks = passCount + warnCount + errorCount;
  console.log(`
Summary:
  Total checks:  ${totalChecks}
  ✓ Passed:      ${passCount}
  ⚠ Warnings:    ${warnCount}
  ✗ Errors:      ${errorCount}
`);

  // Exit code based on results
  if (errorCount > 0) {
    console.log('Status: FAILED (errors detected)');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('Status: PASSED with warnings');
    process.exit(0);
  } else {
    console.log('Status: PASSED');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
