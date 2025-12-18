#!/usr/bin/env node
/**
 * Captain's Cove - Supabase Seed Script (v2)
 * Populates database from datawosb/output data sources
 *
 * Usage: SUPABASE_SERVICE_KEY=xxx node scripts/seed-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Data source directory
const DATA_DIR = '/home/anton/datawosb/output/data';

// Supabase config
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
    console.warn(`  Warning: Could not load ${path}:`, err.message);
    return null;
  }
}

// Ship type to class mapping
const SHIP_TYPE_TO_CLASS = {
  'Destroyer': 'Fast',
  'Battleship': 'Combat',
  'Hardship': 'Heavy',
  'CargoShip': 'Transport',
  'Mortar': 'Siege'
};

// Skill category mapping
const SKILL_CATEGORY_MAP = {
  0: 'economy',
  1: 'logistics',
  2: 'combat',
  3: 'legend'
};

// PvP relevance patterns
const PVP_RELEVANT_CREW = [
  'unit_special_8', 'unit_special_8b', 'unit_special_8c',
  'unit_special_9', 'unit_special_9b',
  'unit_special_11', 'unit_special_11b', 'unit_special_11c',
  'unit_special_21', 'unit_special_28', 'unit_special_30'
];

const PVP_SKILL_PATTERNS = [
  'skill_27', 'skill_28', 'skill_29', 'skill_30', 'skill_31', 'skill_32',
  'skill_33', 'skill_34', 'skill_35', 'skill_36', 'skill_37', 'skill_38',
  'skill_39', 'skill_40', 'skill_41', 'skill_42', 'skill_52', 'skill_53'
];

function determinePvPRole(ship) {
  const { type, stats } = ship;
  const armor = stats?.armor || 0;
  const speed = stats?.speed || 0;

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

function transformShips(data) {
  return data.ships
    .filter(ship => ship.classification?.isPlayable !== false)
    .map(raw => {
      const tier = 7 - raw.rank;
      return {
        id: raw.id,
        static_id: raw.staticId || raw.id,
        name: raw.name || `Ship ${raw.id}`,
        name_key: raw.nameKey || `ship_${raw.id}_name`,
        description: raw.description || null,
        model: raw.model || null,
        type: raw.type,
        subtype: raw.subtype || null,
        rank: raw.rank,
        tier,
        rarity: (raw.rarity || 'Default').split(' ')[0], // Handle compound values like "Default SailageLegend"
        faction: raw.faction || 'None',
        health: raw.stats?.health || 0,
        armor: raw.stats?.armor || 0,
        speed: raw.stats?.speed || 0,
        mobility: raw.stats?.mobility || 0,
        cargo: raw.stats?.cargo || 0,
        crew_slots: raw.stats?.crewSlots || 0,
        upgrade_slots: raw.stats?.upgradeSlots || 0,
        cost_gold: raw.requirements?.costGold || 0,
        cost_premium: raw.requirements?.costPremium || 0,
        required_rank: raw.requirements?.playerRank || 0,
        is_playable: raw.classification?.isPlayable ?? true,
        is_vehicle: raw.classification?.isVehicle ?? false,
        is_npc_usable: raw.classification?.isNpcUsable ?? false,
        physics_weight: raw.physics?.weight || null,
        physics_waterline: raw.physics?.waterlineOffset || null,
        hitbox_center: raw.physics?.hitbox?.center || null,
        hitbox_size: raw.physics?.hitbox?.size || null,
        arm_side: raw.armament?.side || 0,
        arm_side_total: raw.armament?.sideTotal || 0,
        arm_bow: raw.armament?.bow || 0,
        arm_stern: raw.armament?.stern || 0,
        arm_mortar: raw.armament?.mortar || 0,
        arm_falconet: raw.armament?.falconet || 0,
        arm_special: raw.armament?.special || 0,
        bow_figure: raw.visual?.bowFigure || null,
        icon: `ships/ship_${raw.id}`,
        pvp_role: determinePvPRole(raw)
      };
    });
}

function transformWeapons(data) {
  return data.cannons.map(raw => {
    // Parse class for category and material
    const classParts = (raw.class || '').split(' ');
    const weaponClass = classParts[0] || 'LiteCannon';
    const material = classParts[1] || 'Default';

    // Parse category for size and material info
    const catParts = (raw.category || '').split(' ');
    const size = ['Light', 'Medium', 'Heavy'].includes(catParts[0]) ? catParts[0] : 'Medium';

    // Determine weapon category from class
    let category = 'Cannon';
    if (weaponClass.includes('Distance') || weaponClass.includes('Culverin')) category = 'Culverin';
    else if (weaponClass.includes('Heavy') || weaponClass.includes('Carronade')) category = 'Carronade';
    else if (weaponClass.includes('Bombardier')) category = 'Bombard';
    else if (weaponClass.includes('Mortar')) category = 'Mortar';

    // Parse speed factor
    const speedMatch = (raw.extra || '').match(/SpeedFactor:([\d.]+)/);

    // Determine tier from material
    let tier = 4;
    if (raw.category?.includes('CastIron')) tier = 5;
    else if (raw.category?.includes('Bronze')) tier = 4;
    else if (raw.category?.includes('Iron') && !raw.category?.includes('CastIron')) tier = 3;
    else if (raw.category?.includes('Steel')) tier = 2;
    else if (raw.category?.includes('Gold') || raw.category?.includes('Elite')) tier = 1;

    const nameParts = raw.id.replace('ncs_', '').split('_');
    const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    return {
      id: raw.id,
      name,
      weapon_class: raw.class || '',
      material,
      category,
      size_class: size,
      distance: parseInt(raw.distance, 10) || 0,
      penetration: Number(raw.penetration) || 0,
      cooldown: Number(raw.cooldown) || 0,
      angle: Number(raw.angle) || 0,
      scatter: Number(raw.scatter) || 0,
      speed_factor: speedMatch ? parseFloat(speedMatch[1]) : 1,
      price: Number(raw.price) || 0,
      icon: raw.icon || null,
      model: raw.model || null,
      crafting_type: raw.craftingType || 'ByGold',
      tier
    };
  });
}

function transformAmmo(data) {
  return data.ammo.map(raw => ({
    id: raw.id,
    index: raw.index || parseInt(raw.id.replace(/\D/g, ''), 10) || null,
    name: raw.name || raw.id,
    description: raw.description || null,
    speed: Number(raw.speed) || 1,
    penetration: Number(raw.penetration) || 0,
    damage_factor: Number(raw.damageFactor) || 1,
    sail_damage: Number(raw.sailDamage) || 0,
    crew_damage: Number(raw.crewDamage) || 0,
    min_damage: Number(raw.minDamage) || 0,
    effects: raw.effects || null,
    mass: Number(raw.mass) || 1,
    radius: Number(raw.radius) || 0.2,
    reload_factor: Number(raw.reloadFactor) || 1,
    distance_factor: Number(raw.distanceFactor) || 1,
    icon: raw.icon || null,
    cost: Number(raw.cost) || 0,
    is_rare: raw.isRare || false,
    notes: raw.notes || null
  }));
}

function transformSwivelAmmo(data) {
  return data.ammo.map(raw => ({
    id: raw.id,
    index: raw.index,
    name: raw.name || raw.id,
    description: raw.description || null,
    speed: Number(raw.speed) || 1,
    penetration: Number(raw.penetration) || 0,
    damage_factor: Number(raw.damageFactor) || 1,
    sail_damage: Number(raw.sailDamage) || 0,
    crew_damage: Number(raw.crewDamage) || 0,
    min_damage: Number(raw.minDamage) || 0,
    effects: raw.effects || null,
    mass: Number(raw.mass) || 1,
    radius: Number(raw.radius) || 1,
    reload_factor: Number(raw.reloadFactor) || 1,
    distance_factor: Number(raw.distanceFactor) || 1,
    icon: raw.icon || null,
    cost: Number(raw.cost) || 0,
    is_rare: raw.isRare || false,
    notes: raw.notes || null
  }));
}

function transformKegs(data) {
  return data.kegs
    .filter(keg => keg.id !== 'removed')
    .map(raw => ({
      id: raw.id,
      name: raw.name || `Powder Keg ${raw.id.replace('pkeg_', '')}`,
      description: raw.description || null,
      mass: Number(raw.mass) || 0,
      damage: Number(raw.damage) || 0,
      trigger_radius: Number(raw.triggerRadius) || 0,
      damage_radius: Number(raw.damageRadius) || 0,
      count: Number(raw.count) || 1,
      reload: Number(raw.reload) || 0,
      crew_usage: Number(raw.crewUsage) || 0,
      icon: raw.icon || null,
      cost_gold: Number(raw.costGold) || 0,
      cost_skulls: Number(raw.costSkulls) || 0,
      cost_marks: Number(raw.costMarks) || 0,
      is_rare: raw.isRare || false,
      notes: raw.notes || null
    }));
}

function transformCrews(data) {
  return data.units.map(raw => ({
    id: raw.id,
    name: raw.name || raw.id,
    description: raw.description || null,
    type: raw.type,
    damage: Number(raw.damage) || 0,
    health: Number(raw.health) || 0,
    capacity: Number(raw.capacity) || 0,
    cost: Number(raw.cost) || 0,
    cost_marks: Number(raw.costMarks) || 0,
    options: raw.options || 'All',
    effect: raw.effect || null,
    effect_per_sailor: raw.effectPerSailor || null,
    effect_per_boarding: raw.effectPerBoarding || null,
    icon: raw.icon || null,
    pvp_relevant: raw.type === 'Sailor' || raw.type === 'Boarding' || PVP_RELEVANT_CREW.includes(raw.id)
  }));
}

function transformSkills(data) {
  return data.skills
    .filter(raw => raw.name !== 'removed' && raw.effect)
    .map(raw => {
      const category = SKILL_CATEGORY_MAP[raw.category] || 'economy';
      return {
        id: raw.name,
        name: raw.name,
        description: raw.description || null,
        cost_points: Number(raw.costPoints) || 0,
        cost: raw.cost || null,
        effect: raw.effect || null,
        category,
        position: raw.position || null,
        radial_position: raw.radialPosition || null,
        depends_on: raw.dependsOn || null,
        required_achievements: raw.requiredAchievements || null,
        required_ships: raw.requiredShips || null,
        required_rank: raw.requiredRank || null,
        icon: raw.icon || null,
        pvp_relevant: category === 'combat' || PVP_SKILL_PATTERNS.includes(raw.name)
      };
    });
}

function transformUpgrades(data) {
  return data.upgrades.map((raw, index) => {
    const id = `upgrade_${index + 1}`;
    return {
      id,
      name: raw.name || id,
      description: raw.description || null,
      effects: raw.effects || null,
      icon: raw.icon || null,
      cost: raw.cost === false ? false : !!raw.cost,
      strength: raw.strength === false ? false : !!raw.strength,
      craft_resource: raw.craftResource || null,
      category: raw.category || 'Support',
      wear_type: raw.wearType || null,
      parsed_effects: null
    };
  });
}

function transformCosmetics(data) {
  return data.cosmetics.map((raw, index) => ({
    name_key: raw.name,
    type: 'design',
    icon: raw.icon || null,
    in_shop: raw.inShop || null,
    bonus: raw.bonus || null
  }));
}

function transformConsumables(data) {
  return data.consumables.map(raw => ({
    id: raw.id,
    name: raw.name || `Consumable ${raw.id}`,
    description: raw.description || null,
    icon: raw.icon || null,
    category: raw.category || 'equipment',
    cooldown: Number(raw.cooldown) || 0,
    duration: Number(raw.duration) || 0,
    effects: raw.effects || [],
    crafting_gold: raw.crafting?.gold || 0,
    crafting_resources: raw.crafting?.resources || [],
    allow_interrupt: raw.flags?.allowInterrupt ?? null,
    is_group_effect: raw.flags?.isGroupEffect || false,
    group_range: raw.flags?.groupRange || null,
    min_rank: raw.flags?.minRank || null,
    npc_can_use: raw.flags?.npcCanUse || false,
    hidden_from_craft: raw.flags?.hiddenFromCraft || false,
    server_effect: raw.flags?.serverEffect || null
  }));
}

function transformResources(data) {
  return data.resources.map(raw => {
    // Parse effects for category and properties
    const effects = raw.effects || '';
    let category = 'material';
    if (effects.includes('FoodValue')) category = 'food';
    else if (effects.includes('TradingItem')) category = 'trade';
    else if (effects.includes('Special')) category = 'special';

    const isFood = effects.includes('FoodValue');
    const isTradeable = effects.includes('TradingItem');
    const corruptionMatch = effects.match(/Corruption ([\d.]+)/);
    const corruption = corruptionMatch ? parseFloat(corruptionMatch[1]) : 0;

    return {
      id: raw.id,
      name: raw.name || raw.id,
      description: raw.description || null,
      status: raw.status || 'ok',
      category,
      medium_cost: Number(raw.mediumCost) || 0,
      mass: Number(raw.mass) || 0,
      icon: raw.icon || null,
      effects: raw.effects || null,
      is_food: isFood,
      is_tradeable: isTradeable,
      corruption
    };
  });
}

function transformPorts(data) {
  return data.ports.map(raw => ({
    id: raw.name,
    name: raw.name,
    type: raw.type || 'Bay',
    build_ranks: Number(raw.buildRanks) || 0,
    team_limit: raw.teamLimit ? Number(raw.teamLimit) : null,
    flags: raw.flags || null,
    produced_resource: raw.producedResource || null,
    fixed_level: Number(raw.fixedLevel) || 0
  }));
}

function transformAchievements(data) {
  return data.achievements.map(raw => ({
    id: raw.name,
    internal_id: raw.id,
    enum_ref: raw.enumRef || null,
    rating_weight: Number(raw.ratingWeight) || 0,
    single_give: raw.singleGive || false,
    category: raw.category || 'Battle'
  }));
}

function transformRanks(data) {
  return data.ranks.map(raw => ({
    rank: raw.rank,
    xp_required: raw.xp
  }));
}

function transformGuilds(data) {
  return data.guilds.map(raw => ({
    faction: raw.fraction,
    place: raw.place,
    name_key: raw.name,
    reward: raw.reward
  }));
}

function transformArenaBonuses(data) {
  return data.arena.map(raw => ({
    max_quantity: raw.maxQuantity || 1,
    effects: raw.effects,
    probability: raw.probability || 1
  }));
}

function transformLocalization(data, language) {
  const entries = [];
  const processObject = (obj, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_metadata') continue;
      if (typeof value === 'object' && value !== null) {
        processObject(value, prefix);
      } else if (typeof value === 'string') {
        entries.push({
          key,
          language,
          value,
          category: prefix || null
        });
      }
    }
  };
  processObject(data);
  return entries;
}

// ═══════════════════════════════════════════════════
// SEEDING FUNCTIONS
// ═══════════════════════════════════════════════════

async function clearTable(tableName) {
  console.log(`  Clearing ${tableName}...`);
  const { error } = await supabase.from(tableName).delete().neq('id', -999999);
  if (error && !error.message.includes('no rows')) {
    // Try with text comparison for text PKs
    const { error: error2 } = await supabase.from(tableName).delete().neq('id', '___nonexistent___');
    if (error2 && !error2.message.includes('no rows')) {
      console.warn(`  Warning clearing ${tableName}:`, error2.message);
    }
  }
}

async function seedTable(tableName, data, options = {}) {
  const { primaryKey = 'id', batchSize = 100, useInsert = false } = options;

  if (!data || data.length === 0) {
    console.log(`  Skipping ${tableName}: no data`);
    return;
  }

  // Deduplicate by primary key (keep last occurrence)
  if (primaryKey) {
    const seen = new Map();
    for (const item of data) {
      const key = item[primaryKey];
      if (key !== undefined) {
        seen.set(key, item);
      }
    }
    if (seen.size > 0 && seen.size < data.length) {
      console.log(`  Deduplicating: ${data.length - seen.size} duplicates removed`);
      data = Array.from(seen.values());
    }
  }

  console.log(`  Seeding ${tableName}: ${data.length} records...`);

  // Clear existing data for tables with SERIAL PKs or when we need fresh data
  if (useInsert || ['cosmetics', 'guilds', 'arena_bonuses', 'localization'].includes(tableName)) {
    await clearTable(tableName);
  }

  // Insert/upsert in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    let error;

    if (useInsert || ['cosmetics', 'guilds', 'arena_bonuses', 'localization'].includes(tableName)) {
      const result = await supabase.from(tableName).insert(batch);
      error = result.error;
    } else {
      const result = await supabase.from(tableName).upsert(batch, {
        onConflict: primaryKey,
        ignoreDuplicates: false
      });
      error = result.error;
    }

    if (error) {
      console.error(`  Error in ${tableName} (batch ${i}-${i + batch.length}):`, error.message);
      if (batch.length > 0) {
        console.error('  First record:', JSON.stringify(batch[0], null, 2));
      }
    }
  }
}

// ═══════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  Captain\'s Cove - Supabase Seeder v2                 ║');
  console.log('║  Data source: datawosb/output                        ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('Loading data files from:', DATA_DIR);

  // ─────────────────────────────────────────────
  // PHASE 1: Meta tables (no dependencies)
  // ─────────────────────────────────────────────
  console.log('\n[Phase 1] Meta tables...');

  const ranksData = loadJson('meta/ranks.json');
  const guildsData = loadJson('meta/guilds.json');
  const arenaData = loadJson('meta/arena.json');

  const ranks = ranksData ? transformRanks(ranksData) : [];
  const guilds = guildsData ? transformGuilds(guildsData) : [];
  const arenaBonuses = arenaData ? transformArenaBonuses(arenaData) : [];

  console.log(`  Ranks: ${ranks.length}`);
  console.log(`  Guilds: ${guilds.length}`);
  console.log(`  Arena Bonuses: ${arenaBonuses.length}`);

  await seedTable('ranks', ranks, { primaryKey: 'rank' });
  await seedTable('guilds', guilds, { useInsert: true });
  await seedTable('arena_bonuses', arenaBonuses, { useInsert: true });

  // ─────────────────────────────────────────────
  // PHASE 2: World tables
  // ─────────────────────────────────────────────
  console.log('\n[Phase 2] World tables...');

  const resourcesData = loadJson('world/resources.json');
  const portsData = loadJson('world/ports.json');
  const achievementsData = loadJson('world/achievements.json');

  const resources = resourcesData ? transformResources(resourcesData) : [];
  const ports = portsData ? transformPorts(portsData) : [];
  const achievements = achievementsData ? transformAchievements(achievementsData) : [];

  console.log(`  Resources: ${resources.length}`);
  console.log(`  Ports: ${ports.length}`);
  console.log(`  Achievements: ${achievements.length}`);

  await seedTable('resources', resources);
  await seedTable('ports', ports);
  await seedTable('achievements', achievements);

  // ─────────────────────────────────────────────
  // PHASE 3: Core game tables
  // ─────────────────────────────────────────────
  console.log('\n[Phase 3] Core game tables...');

  const shipsData = loadJson('ships/ships.json');
  const weaponsData = loadJson('weapons/cannons.json');
  const ammoData = loadJson('weapons/ammo.json');
  const swivelData = loadJson('weapons/swivels.json');
  const kegsData = loadJson('weapons/kegs.json');
  const crewsData = loadJson('crew/units.json');
  const skillsData = loadJson('crew/skills.json');

  const ships = shipsData ? transformShips(shipsData) : [];
  const weapons = weaponsData ? transformWeapons(weaponsData) : [];
  const ammo = ammoData ? transformAmmo(ammoData) : [];
  const swivelAmmo = swivelData ? transformSwivelAmmo(swivelData) : [];
  const kegs = kegsData ? transformKegs(kegsData) : [];
  const crews = crewsData ? transformCrews(crewsData) : [];
  const skills = skillsData ? transformSkills(skillsData) : [];

  console.log(`  Ships: ${ships.length}`);
  console.log(`  Weapons: ${weapons.length}`);
  console.log(`  Ammo: ${ammo.length}`);
  console.log(`  Swivel Ammo: ${swivelAmmo.length}`);
  console.log(`  Kegs: ${kegs.length}`);
  console.log(`  Crews: ${crews.length}`);
  console.log(`  Skills: ${skills.length}`);

  await seedTable('ships', ships);
  await seedTable('weapons', weapons);
  await seedTable('ammo', ammo);
  await seedTable('swivel_ammo', swivelAmmo);
  await seedTable('kegs', kegs);
  await seedTable('crews', crews);
  await seedTable('skills', skills);

  // ─────────────────────────────────────────────
  // PHASE 4: Equipment tables
  // ─────────────────────────────────────────────
  console.log('\n[Phase 4] Equipment tables...');

  const upgradesData = loadJson('ships/upgrades.json');
  const cosmeticsData = loadJson('ships/cosmetics.json');
  const consumablesData = loadJson('consumables/consumables.json');

  const upgrades = upgradesData ? transformUpgrades(upgradesData) : [];
  const cosmetics = cosmeticsData ? transformCosmetics(cosmeticsData) : [];
  const consumables = consumablesData ? transformConsumables(consumablesData) : [];

  console.log(`  Upgrades: ${upgrades.length}`);
  console.log(`  Cosmetics: ${cosmetics.length}`);
  console.log(`  Consumables: ${consumables.length}`);

  await seedTable('upgrades', upgrades);
  await seedTable('cosmetics', cosmetics, { useInsert: true });
  await seedTable('consumables', consumables);

  // ─────────────────────────────────────────────
  // PHASE 5: Localization (all languages)
  // ─────────────────────────────────────────────
  console.log('\n[Phase 5] Localization...');

  const LANGUAGES = ['en', 'ru', 'de', 'fr', 'es', 'pl', 'ja', 'ko', 'zh'];
  let allLocalization = [];

  for (const lang of LANGUAGES) {
    const locData = loadJson(`localization/${lang}.json`);
    if (locData) {
      const entries = transformLocalization(locData, lang);
      console.log(`  ${lang}: ${entries.length} entries`);
      allLocalization = allLocalization.concat(entries);
    }
  }

  console.log(`  Total localization entries: ${allLocalization.length}`);
  await seedTable('localization', allLocalization, { batchSize: 500, useInsert: true });

  // ─────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  Seeding Complete                                     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`
Summary:
  Ranks:          ${ranks.length}
  Guilds:         ${guilds.length}
  Arena Bonuses:  ${arenaBonuses.length}
  Resources:      ${resources.length}
  Ports:          ${ports.length}
  Achievements:   ${achievements.length}
  Ships:          ${ships.length}
  Weapons:        ${weapons.length}
  Ammo:           ${ammo.length}
  Swivel Ammo:    ${swivelAmmo.length}
  Kegs:           ${kegs.length}
  Crews:          ${crews.length}
  Skills:         ${skills.length}
  Upgrades:       ${upgrades.length}
  Cosmetics:      ${cosmetics.length}
  Consumables:    ${consumables.length}
  Localization:   ${allLocalization.length}
  ─────────────────────────────
  Total:          ${ranks.length + guilds.length + arenaBonuses.length + resources.length + ports.length + achievements.length + ships.length + weapons.length + ammo.length + swivelAmmo.length + kegs.length + crews.length + skills.length + upgrades.length + cosmetics.length + consumables.length + allLocalization.length}
`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
