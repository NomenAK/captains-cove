#!/usr/bin/env node
/**
 * Captain's Cove - Supabase Seed Script
 * Populates the database with game data from JSON files
 *
 * Usage: node scripts/seed-supabase.js
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../public/data');

// Supabase config - use service role for seeding
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lewslcexldrbequixxpg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.error('Usage: SUPABASE_SERVICE_KEY=your-service-key node scripts/seed-supabase.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

function loadJson(path) {
  try {
    const fullPath = join(DATA_DIR, path);
    return JSON.parse(readFileSync(fullPath, 'utf-8'));
  } catch (err) {
    console.warn(`Warning: Could not load ${path}:`, err.message);
    return null;
  }
}

function loadLocalization() {
  const files = ['localization/en.json', 'localization/en_items.json',
                 'localization/en_units.json', 'localization/en_skills.json',
                 'localization/en_ammo.json'];
  const combined = {};
  for (const file of files) {
    const data = loadJson(file);
    if (data) Object.assign(combined, data);
  }
  return combined;
}

// Ship type to class mapping
const SHIP_TYPE_TO_CLASS = {
  'Destroyer': 'Fast',
  'Battleship': 'Combat',
  'Hardship': 'Heavy',
  'CargoShip': 'Transport',
  'Mortar': 'Siege'
};

// Normalize coolness values to match enum
function normalizeCoolness(coolness) {
  if (!coolness) return 'Default';
  const normalized = coolness.split(' ')[0]; // Take first word
  if (['Default', 'Unique', 'Elite', 'Rare'].includes(normalized)) {
    return normalized;
  }
  // Map special values
  if (coolness.includes('Empire')) return 'Unique';
  if (coolness.includes('Legend')) return 'Elite';
  return 'Default';
}

function determinePvPRole(ship) {
  const { type, armor, speed } = ship;
  if (type === 'Mortar') return 'Siege';
  if (type === 'CargoShip') return 'Trade';
  if (type === 'Hardship') return armor >= 8 ? 'Tank/Brawl' : 'Frontline';
  if (type === 'Destroyer') return speed >= 9 ? 'Kite/Scout' : 'Pursuit';
  if (type === 'Battleship') return armor >= 6 ? 'Frontline' : 'Skirmish';
  return 'General';
}

// ═══════════════════════════════════════════════════
// DATA TRANSFORMERS
// ═══════════════════════════════════════════════════

function transformShips(data, loc) {
  return data.ships
    .filter(ship => ship.id > 0 && ship.health > 0)
    .map(raw => {
      const tier = 7 - raw.rank;
      const isPlayable = tier >= 1 && tier <= 7;
      if (!isPlayable) return null;

      return {
        id: raw.id,
        static_info_id: raw.staticInfoId,
        name: loc[`ship_${raw.id}_name`] || `Ship ${raw.id}`,
        health: raw.health,
        speed: raw.speed,
        mobility: raw.mobility,
        armor: raw.armor,
        capacity: raw.capacity,
        crew_slots: Math.floor(raw.crewSlots),
        rank: raw.rank,
        tier,
        type: raw.type,
        ship_class: SHIP_TYPE_TO_CLASS[raw.type] || 'Combat',
        subtype: raw.subtype,
        fraction: raw.fraction || 'None',
        cost: raw.cost || 0,
        coolness: normalizeCoolness(raw.coolness),
        required_rank: raw.requiredRank || 0,
        upgrade_slots: raw.upgradeSlots || 0,
        is_playable: isPlayable,
        pvp_role: determinePvPRole(raw),
        icon: `ships/ship_${raw.id}`
      };
    })
    .filter(Boolean);
}

function parseWeaponCategory(category) {
  const classLower = category.toLowerCase();
  let cat = 'Cannon';
  if (classLower.includes('culverin') || classLower.includes('distance')) cat = 'Culverin';
  else if (classLower.includes('carronade') || classLower.includes('heavy')) cat = 'Carronade';
  else if (classLower.includes('bombard')) cat = 'Bombard';
  else if (classLower.includes('mortar')) cat = 'Mortar';

  const parts = category.split(' ');
  const size = ['Light', 'Medium', 'Heavy'].includes(parts[0]) ? parts[0] : 'Medium';

  return { category: cat, size };
}

function determineWeaponTier(weaponClass) {
  if (weaponClass.includes('CastIron') || weaponClass.includes('Default')) return 5;
  if (weaponClass.includes('Bronze')) return 4;
  if (weaponClass.includes('Iron')) return 3;
  if (weaponClass.includes('Steel')) return 2;
  if (weaponClass.includes('Gold') || weaponClass.includes('Elite')) return 1;
  return 4;
}

function transformWeapons(data) {
  return data.cannons.map(raw => {
    const { category, size } = parseWeaponCategory(raw.category);
    const speedMatch = (raw.extra || '').match(/SpeedFactor:([\d.]+)/);

    const nameParts = raw.id.replace('ncs_', '').split('_');
    const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    return {
      id: raw.id,
      name,
      class: raw.class,
      category,
      size_class: size,
      distance: parseInt(raw.distance, 10) || 0,
      penetration: Number(raw.penetration) || 0,
      cooldown: Number(raw.cooldown) || 0,
      angle: Number(raw.angle) || 0,
      scatter: Number(raw.scatter) || 0,
      speed_factor: speedMatch ? parseFloat(speedMatch[1]) : 1,
      price: Number(raw.price) || 0,
      icon: raw.icon,
      model: raw.model,
      crafting_type: raw.craftingType || 'ByGold',
      tier: determineWeaponTier(raw.category)
    };
  });
}

function transformAmmo(data, loc) {
  return data.ammo.map(raw => ({
    id: raw.id,
    name: loc[`${raw.id}_name`] || raw.id.replace('cball_', 'Ball '),
    speed: Number(raw.speed) || 0,
    penetration: Number(raw.penetration) || 0,
    damage_factor: Number(raw.damageFactor) || 1,
    sail_damage: Number(raw.sailDamage) || 0,
    crew_damage: Number(raw.crewDamage) || 0,
    min_damage: Number(raw.minDamage) || 0,
    effects: raw.effects || '',
    mass: Number(raw.mass) || 0,
    radius: Number(raw.radius) || 0,
    reload_factor: Number(raw.reloadFactor) || 1,
    distance_factor: Number(raw.distanceFactor) || 1,
    icon: raw.icon,
    cost: Number(raw.cost) || 0,
    is_rare: raw.isRare || (raw.cost > 5)
  }));
}

function transformKegs(data) {
  return data.kegs
    .filter(keg => keg.id !== 'removed')
    .map(raw => ({
      id: raw.id,
      name: `Powder Keg ${raw.id.replace('pkeg_', '')}`,
      mass: Number(raw.mass) || 0,
      damage: Number(raw.damage) || 0,
      trigger_radius: Number(raw.triggerRadius) || 0,
      damage_radius: Number(raw.damageRadius) || 0,
      count: Number(raw.count) || 1,
      reload: Number(raw.reload) || 0,
      crew_usage: Number(raw.crewUsage) || 0,
      icon: raw.icon,
      cost_gold: Number(raw.costGold) || 0,
      cost_skulls: Number(raw.costSkulls) || 0,
      cost_marks: Number(raw.costMarks) || 0,
      is_rare: raw.isRare || false
    }));
}

const PVP_RELEVANT_CREW = [
  'unit_special_8', 'unit_special_8b', 'unit_special_8c',
  'unit_special_9', 'unit_special_9b',
  'unit_special_11', 'unit_special_11b', 'unit_special_11c',
  'unit_special_21', 'unit_special_28', 'unit_special_30'
];

function transformCrews(data, loc) {
  return data.units.map(raw => ({
    id: raw.id,
    name: loc[`${raw.id}_name`] || raw.id,
    type: raw.type,
    damage: Number(raw.damage) || 0,
    health: Number(raw.health) || 0,
    capacity: Number(raw.capacity) || 0,
    cost: Number(raw.cost) || 0,
    cost_marks: Number(raw.costMarks) || 0,
    options: raw.options || 'All',
    effect: raw.effect || '',
    effect_per_sailor: raw.effectPerSailor || '',
    effect_per_boarding: raw.effectPerBoarding || '',
    icon: raw.icon,
    pvp_relevant: raw.type === 'Sailor' || raw.type === 'Boarding' || PVP_RELEVANT_CREW.includes(raw.id)
  }));
}

const SKILL_CATEGORY_MAP = { 0: 'economy', 1: 'logistics', 2: 'combat', 3: 'legend' };
const PVP_SKILL_PATTERNS = [
  'skill_27', 'skill_28', 'skill_29', 'skill_30', 'skill_31', 'skill_32',
  'skill_33', 'skill_34', 'skill_35', 'skill_36', 'skill_37', 'skill_38',
  'skill_39', 'skill_40', 'skill_41', 'skill_42', 'skill_52', 'skill_53'
];

function transformSkills(data, loc) {
  return data.skills
    .filter(raw => raw.name !== 'removed' && raw.effect)
    .map(raw => {
      const category = SKILL_CATEGORY_MAP[raw.category] || 'economy';
      return {
        id: raw.name,
        name: loc[`${raw.name}_name`] || raw.name,
        cost_points: Number(raw.costPoints) || 0,
        cost: raw.cost || '',
        effect: raw.effect || '',
        category,
        position: raw.position || '',
        radial_position: raw.radialPosition || '',
        depends_on: raw.dependsOn || '',
        required_achievements: raw.requiredAchievements || '',
        required_ships: raw.requiredShips || '',
        required_rank: raw.requiredRank || '',
        icon: raw.icon,
        pvp_relevant: category === 'combat' || PVP_SKILL_PATTERNS.includes(raw.name)
      };
    });
}

function transformLocalization(loc) {
  return Object.entries(loc).map(([key, value]) => ({
    key,
    value,
    language: 'en'
  }));
}

// ═══════════════════════════════════════════════════
// SEEDING FUNCTIONS
// ═══════════════════════════════════════════════════

async function seedTable(tableName, data, batchSize = 100, primaryKey = 'id') {
  if (!data || data.length === 0) {
    console.log(`  Skipping ${tableName}: no data`);
    return;
  }

  // Deduplicate by primary key (keep last occurrence)
  const seen = new Map();
  for (const item of data) {
    seen.set(item[primaryKey], item);
  }
  const uniqueData = Array.from(seen.values());

  console.log(`  Seeding ${tableName}: ${uniqueData.length} records (${data.length - uniqueData.length} duplicates removed)...`);
  data = uniqueData;

  // Clear existing data - use gt for numeric, neq for text
  const isNumericPk = typeof data[0]?.[primaryKey] === 'number';
  const deleteQuery = isNumericPk
    ? supabase.from(tableName).delete().gt(primaryKey, -999999)
    : supabase.from(tableName).delete().neq(primaryKey, '___nonexistent___');

  const { error: deleteError } = await deleteQuery;
  if (deleteError && !deleteError.message.includes('no rows')) {
    console.warn(`  Warning clearing ${tableName}:`, deleteError.message);
  }

  // Upsert in batches (handles duplicates)
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).upsert(batch, {
      onConflict: primaryKey,
      ignoreDuplicates: false
    });
    if (error) {
      console.error(`  Error upserting into ${tableName} (batch ${i}-${i + batch.length}):`, error.message);
      // Log first problematic record for debugging
      if (batch.length > 0) {
        console.error('  First record in batch:', JSON.stringify(batch[0], null, 2));
      }
    }
  }
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     Captain\'s Cove - Supabase Seeder        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  console.log('Loading data files...');
  const loc = loadLocalization();
  console.log(`  Loaded ${Object.keys(loc).length} localization strings`);

  const shipsData = loadJson('ships/stats.json');
  const weaponsData = loadJson('weapons/cannons.json');
  const ammoData = loadJson('weapons/ammo.json');
  const kegsData = loadJson('weapons/kegs.json');
  const crewsData = loadJson('crew/units.json');
  const skillsData = loadJson('crew/skills.json');

  console.log('\nTransforming data...');
  const ships = shipsData ? transformShips(shipsData, loc) : [];
  const weapons = weaponsData ? transformWeapons(weaponsData) : [];
  const ammo = ammoData ? transformAmmo(ammoData, loc) : [];
  const kegs = kegsData ? transformKegs(kegsData) : [];
  const crews = crewsData ? transformCrews(crewsData, loc) : [];
  const skills = skillsData ? transformSkills(skillsData, loc) : [];
  const localization = transformLocalization(loc);

  console.log(`  Ships: ${ships.length}`);
  console.log(`  Weapons: ${weapons.length}`);
  console.log(`  Ammo: ${ammo.length}`);
  console.log(`  Kegs: ${kegs.length}`);
  console.log(`  Crews: ${crews.length}`);
  console.log(`  Skills: ${skills.length}`);
  console.log(`  Localization: ${localization.length}`);

  console.log('\nSeeding Supabase...');
  await seedTable('ships', ships);
  await seedTable('weapons', weapons);
  await seedTable('ammo', ammo);
  await seedTable('kegs', kegs);
  await seedTable('crews', crews);
  await seedTable('skills', skills);
  await seedTable('localization', localization, 500, 'key');

  console.log('\n✅ Seeding complete!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
