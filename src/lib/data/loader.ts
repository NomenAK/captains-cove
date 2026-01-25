/* Captain's Cove - Data Loader */
/* Fetches game data from Supabase with caching */

import { supabase } from '../supabase';
import type {
  Ship,
  Weapon,
  Ammo,
  SwivelAmmo,
  PowderKeg,
  CrewUnit,
  CaptainSkill,
  Upgrade,
  Cosmetic,
  Consumable,
  Resource,
  Port,
  Achievement,
  Rank,
  Guild,
  ArenaBonus,
  Localization,
  AppData,
  ShipClass,
  WeaponCategory,
  SkillCategory
} from './types';

// ═══════════════════════════════════════════════════
// DATA VALIDATION HELPERS
// ═══════════════════════════════════════════════════

/**
 * Type guards for validating Supabase data before casting
 * Prevents runtime errors from invalid or unexpected database responses
 */

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isValidString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Validates essential Ship row fields
 * Non-essential fields are handled with fallbacks during mapping
 */
function validateShipRow(row: Record<string, unknown>): boolean {
  return (
    isValidNumber(row.id) &&
    isValidString(row.name) &&
    isValidNumber(row.health) &&
    isValidNumber(row.tier)
  );
}

/**
 * Validates essential Weapon row fields
 */
function validateWeaponRow(row: Record<string, unknown>): boolean {
  return (
    isValidString(row.id) &&
    isValidString(row.name) &&
    isValidNumber(row.penetration) &&
    isValidNumber(row.distance)
  );
}

/**
 * Validates essential Ammo row fields
 */
function validateAmmoRow(row: Record<string, unknown>): boolean {
  return (
    isValidString(row.id) &&
    isValidString(row.name) &&
    isValidNumber(row.damage_factor)
  );
}

/**
 * Validates essential CrewUnit row fields
 */
function validateCrewRow(row: Record<string, unknown>): boolean {
  return (
    isValidString(row.id) &&
    isValidString(row.name) &&
    isValidNumber(row.capacity)
  );
}

/**
 * Generic row validator with DEV-mode warning
 */
function filterValidRows<T extends Record<string, unknown>>(
  rows: T[],
  validator: (row: T) => boolean,
  entityName: string
): T[] {
  const validRows: T[] = [];
  let invalidCount = 0;

  for (const row of rows) {
    if (validator(row)) {
      validRows.push(row);
    } else {
      invalidCount++;
      if (import.meta.env.DEV && invalidCount <= 3) {
        console.warn(`Invalid ${entityName} row:`, row);
      }
    }
  }

  if (import.meta.env.DEV && invalidCount > 0) {
    console.warn(`Filtered out ${invalidCount} invalid ${entityName} rows`);
  }

  return validRows;
}

// ═══════════════════════════════════════════════════
// CACHE MANAGEMENT
// ═══════════════════════════════════════════════════

const cache: Map<string, unknown> = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (static game data rarely changes)
const cacheTimestamps: Map<string, number> = new Map();

function getCached<T>(key: string): T | null {
  const timestamp = cacheTimestamps.get(key);
  if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
    return cache.get(key) as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, data);
  cacheTimestamps.set(key, Date.now());
}

export function clearCache(): void {
  cache.clear();
  cacheTimestamps.clear();
}

// ═══════════════════════════════════════════════════
// LOCALIZATION
// ═══════════════════════════════════════════════════

let localization: Localization = {};

async function loadLocalization(): Promise<Localization> {
  if (Object.keys(localization).length > 0) {
    return localization;
  }

  const { data, error } = await supabase
    .from('localization')
    .select('key, value')
    .eq('language', 'en');

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to load localization:', error.message);
    }
    return {};
  }

  localization = Object.fromEntries(
    (data || []).map((row: { key: string; value: string }) => [row.key, row.value])
  );

  return localization;
}

export function getLocalizedString(key: string): string {
  return localization[key] || key;
}

/**
 * Get localized name for an entity using its ID.
 * - For ships (numeric ID): uses "ship_{id}_name" pattern
 * - For other entities (string ID): uses "{id}_name" pattern
 * Falls back to the ID itself if no localization found.
 */
export function getLocalizedName(id: string | number, fallback?: string): string {
  const key = typeof id === 'number' ? `ship_${id}_name` : `${id}_name`;
  const localized = localization[key];
  return localized || fallback || String(id);
}

/**
 * Get localized description for an entity using its ID and a custom suffix.
 * Different entities use different description key patterns:
 * - Crew: "{id}_text" (e.g., unit_sailor_1_text)
 * - Upgrades: "{id}_tt" (e.g., upgrade_1_tt - tooltip)
 * - Resources: "{id}_desc" (e.g., res_1_desc)
 */
export function getLocalizedDescription(id: string, suffix: string, fallback?: string | null): string | null {
  const key = `${id}_${suffix}`;
  const localized = localization[key];
  return localized || fallback || null;
}

// ═══════════════════════════════════════════════════
// SHIP DATA
// ═══════════════════════════════════════════════════

async function loadShips(): Promise<Ship[]> {
  const { data, error } = await supabase
    .from('ships')
    .select('*')
    .eq('is_playable', true)
    .order('tier', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load ships:', error.message);
    }
    return [];
  }

  // Validate rows before mapping to catch invalid database responses
  const validRows = filterValidRows(data || [], validateShipRow, 'ship');

  return validRows.map((row: Record<string, unknown>) => ({
    id: row.id as number,
    staticInfoId: row.static_id as number,
    name: getLocalizedName(row.id as number, row.name as string),
    nameKey: row.name_key as string || `ship_${row.id}_name`,
    description: row.description as string | null,
    model: row.model as string | null,
    type: row.type as Ship['type'],
    subtype: row.subtype as string | null,
    rank: row.rank as number,
    tier: row.tier as number,
    rarity: row.rarity as Ship['rarity'],
    faction: row.faction as Ship['faction'],
    health: row.health as number,
    armor: Number(row.armor),
    speed: Number(row.speed),
    mobility: Number(row.mobility),
    cargo: row.cargo as number,
    crewSlots: Number(row.crew_slots),
    upgradeSlots: row.upgrade_slots as number,
    costGold: row.cost_gold as number,
    costPremium: row.cost_premium as number,
    requiredRank: row.required_rank as number,
    isPlayable: row.is_playable as boolean,
    isVehicle: row.is_vehicle as boolean,
    isNpcUsable: row.is_npc_usable as boolean,
    physicsWeight: row.physics_weight ? Number(row.physics_weight) : null,
    physicsWaterline: row.physics_waterline ? Number(row.physics_waterline) : null,
    hitboxCenter: row.hitbox_center as number[] | null,
    hitboxSize: row.hitbox_size as number[] | null,
    armSide: row.arm_side as number,
    armSideTotal: row.arm_side_total as number,
    armBow: row.arm_bow as number,
    armStern: row.arm_stern as number,
    armMortar: row.arm_mortar as number,
    armFalconet: row.arm_falconet as number,
    armSpecial: row.arm_special as number,
    bowFigure: row.bow_figure as string | null,
    icon: row.icon as string | null,
    pvpRole: row.pvp_role as string | null
  }));
}

// ═══════════════════════════════════════════════════
// WEAPON DATA
// ═══════════════════════════════════════════════════

async function loadWeapons(): Promise<Weapon[]> {
  const { data, error } = await supabase
    .from('weapons')
    .select('*')
    .order('tier', { ascending: true })
    .order('category', { ascending: true });

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load weapons:', error.message);
    }
    return [];
  }

  // Validate rows before mapping
  const validRows = filterValidRows(data || [], validateWeaponRow, 'weapon');

  return validRows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    weaponClass: row.weapon_class as string,
    material: row.material as string | null,
    category: row.category as WeaponCategory,
    sizeClass: row.size_class as Weapon['sizeClass'],
    distance: row.distance as number,
    penetration: Number(row.penetration),
    cooldown: Number(row.cooldown),
    angle: Number(row.angle),
    scatter: Number(row.scatter),
    speedFactor: Number(row.speed_factor),
    price: row.price as number,
    icon: row.icon as string | null,
    model: row.model as string | null,
    craftingType: row.crafting_type as Weapon['craftingType'],
    tier: row.tier as number
  }));
}

// ═══════════════════════════════════════════════════
// AMMO DATA
// ═══════════════════════════════════════════════════

async function loadAmmo(): Promise<Ammo[]> {
  const { data, error } = await supabase
    .from('ammo')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load ammo:', error.message);
    }
    return [];
  }

  // Validate rows before mapping
  const validRows = filterValidRows(data || [], validateAmmoRow, 'ammo');

  return validRows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    index: row.index as number | null,
    name: getLocalizedName(row.id as string, row.name as string),
    description: row.description as string | null,
    speed: Number(row.speed),
    penetration: Number(row.penetration),
    damageFactor: Number(row.damage_factor),
    sailDamage: Number(row.sail_damage),
    crewDamage: Number(row.crew_damage),
    minDamage: Number(row.min_damage),
    effects: row.effects as string | null,
    mass: Number(row.mass),
    radius: Number(row.radius),
    reloadFactor: Number(row.reload_factor),
    distanceFactor: Number(row.distance_factor),
    icon: row.icon as string | null,
    cost: row.cost as number,
    isRare: row.is_rare as boolean,
    notes: row.notes as string | null
  }));
}

// ═══════════════════════════════════════════════════
// SWIVEL AMMO DATA
// ═══════════════════════════════════════════════════

async function loadSwivelAmmo(): Promise<SwivelAmmo[]> {
  const { data, error } = await supabase
    .from('swivel_ammo')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load swivel ammo:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    index: row.index as number,
    name: getLocalizedName(row.id as string, row.name as string),
    description: row.description as string | null,
    speed: Number(row.speed),
    penetration: Number(row.penetration),
    damageFactor: Number(row.damage_factor),
    sailDamage: Number(row.sail_damage),
    crewDamage: Number(row.crew_damage),
    minDamage: Number(row.min_damage),
    effects: row.effects as string | null,
    mass: Number(row.mass),
    radius: Number(row.radius),
    reloadFactor: Number(row.reload_factor),
    distanceFactor: Number(row.distance_factor),
    icon: row.icon as string | null,
    cost: row.cost as number,
    isRare: row.is_rare as boolean,
    notes: row.notes as string | null
  }));
}

// ═══════════════════════════════════════════════════
// POWDER KEGS DATA
// ═══════════════════════════════════════════════════

async function loadKegs(): Promise<PowderKeg[]> {
  const { data, error } = await supabase
    .from('kegs')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load kegs:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    description: row.description as string | null,
    mass: Number(row.mass),
    damage: row.damage as number,
    triggerRadius: Number(row.trigger_radius),
    damageRadius: Number(row.damage_radius),
    count: row.count as number,
    reload: Number(row.reload),
    crewUsage: row.crew_usage as number,
    icon: row.icon as string | null,
    costGold: row.cost_gold as number,
    costSkulls: row.cost_skulls as number,
    costMarks: row.cost_marks as number,
    isRare: row.is_rare as boolean,
    notes: row.notes as string | null
  }));
}

// ═══════════════════════════════════════════════════
// CREW DATA
// ═══════════════════════════════════════════════════

async function loadCrewUnits(): Promise<CrewUnit[]> {
  const { data, error } = await supabase
    .from('crews')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load crew units:', error.message);
    }
    return [];
  }

  // Validate rows before mapping
  const validRows = filterValidRows(data || [], validateCrewRow, 'crew');

  return validRows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    description: getLocalizedDescription(row.id as string, 'text', row.description as string | null),
    type: row.type as CrewUnit['type'],
    damage: row.damage as number,
    health: row.health as number,
    capacity: row.capacity as number,
    cost: row.cost as number,
    costMarks: row.cost_marks as number,
    options: row.options as CrewUnit['options'],
    effect: row.effect as string | null,
    effectPerSailor: row.effect_per_sailor as string | null,
    effectPerBoarding: row.effect_per_boarding as string | null,
    icon: row.icon as string | null,
    pvpRelevant: row.pvp_relevant as boolean
  }));
}

// ═══════════════════════════════════════════════════
// CAPTAIN SKILLS DATA
// ═══════════════════════════════════════════════════

async function loadCaptainSkills(): Promise<CaptainSkill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load skills:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    description: row.description as string | null,
    costPoints: row.cost_points as number,
    cost: row.cost as string | null,
    effect: row.effect as string | null,
    category: row.category as SkillCategory,
    position: row.position as string | null,
    radialPosition: row.radial_position as string | null,
    dependsOn: row.depends_on as string | null,
    requiredAchievements: row.required_achievements as string | null,
    requiredShips: row.required_ships as string | null,
    requiredRank: row.required_rank as string | null,
    icon: row.icon as string | null,
    pvpRelevant: row.pvp_relevant as boolean
  }));
}

// ═══════════════════════════════════════════════════
// UPGRADES DATA
// ═══════════════════════════════════════════════════

async function loadUpgrades(): Promise<Upgrade[]> {
  const { data, error } = await supabase
    .from('upgrades')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load upgrades:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    description: getLocalizedDescription(row.id as string, 'tt', row.description as string | null),
    effects: row.effects as string | null,
    icon: row.icon as string | null,
    cost: row.cost as boolean,
    strength: row.strength as boolean,
    craftResource: row.craft_resource as string | null,
    category: row.category as Upgrade['category'],
    wearType: row.wear_type as string | null,
    parsedEffects: row.parsed_effects as Upgrade['parsedEffects']
  }));
}

// ═══════════════════════════════════════════════════
// COSMETICS DATA
// ═══════════════════════════════════════════════════

async function loadCosmetics(): Promise<Cosmetic[]> {
  const { data, error } = await supabase
    .from('cosmetics')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load cosmetics:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as number,
    nameKey: row.name_key as string,
    type: row.type as Cosmetic['type'],
    icon: row.icon as string | null,
    inShop: row.in_shop as string | null,
    bonus: row.bonus as string | null
  }));
}

// ═══════════════════════════════════════════════════
// CONSUMABLES DATA
// ═══════════════════════════════════════════════════

async function loadConsumables(): Promise<Consumable[]> {
  const { data, error } = await supabase
    .from('consumables')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load consumables:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as number,
    name: row.name as string,
    description: row.description as string | null,
    icon: row.icon as string | null,
    category: row.category as Consumable['category'],
    cooldown: row.cooldown as number,
    duration: row.duration as number,
    effects: (row.effects as Consumable['effects']) || [],
    craftingGold: row.crafting_gold as number,
    craftingResources: (row.crafting_resources as Consumable['craftingResources']) || [],
    allowInterrupt: row.allow_interrupt as boolean | null,
    isGroupEffect: row.is_group_effect as boolean,
    groupRange: row.group_range as number | null,
    minRank: row.min_rank as number | null,
    npcCanUse: row.npc_can_use as boolean,
    hiddenFromCraft: row.hidden_from_craft as boolean,
    serverEffect: row.server_effect as string | null
  }));
}

// ═══════════════════════════════════════════════════
// RESOURCES DATA
// ═══════════════════════════════════════════════════

async function loadResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load resources:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    description: getLocalizedDescription(row.id as string, 'desc', row.description as string | null),
    status: row.status as string,
    category: row.category as Resource['category'],
    mediumCost: row.medium_cost as number,
    mass: Number(row.mass),
    icon: row.icon as string | null,
    effects: row.effects as string | null,
    isFood: row.is_food as boolean,
    isTradeable: row.is_tradeable as boolean,
    corruption: Number(row.corruption)
  }));
}

// ═══════════════════════════════════════════════════
// PORTS DATA
// ═══════════════════════════════════════════════════

async function loadPorts(): Promise<Port[]> {
  const { data, error } = await supabase
    .from('ports')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load ports:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: getLocalizedName(row.id as string, row.name as string),
    type: row.type as Port['type'],
    buildRanks: row.build_ranks as number,
    teamLimit: row.team_limit as number | null,
    flags: row.flags as string | null,
    producedResource: row.produced_resource as string | null,
    fixedLevel: row.fixed_level as number
  }));
}

// ═══════════════════════════════════════════════════
// ACHIEVEMENTS DATA
// ═══════════════════════════════════════════════════

async function loadAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load achievements:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    internalId: row.internal_id as string,
    enumRef: row.enum_ref as string | null,
    ratingWeight: row.rating_weight as number,
    singleGive: row.single_give as boolean,
    category: row.category as Achievement['category']
  }));
}

// ═══════════════════════════════════════════════════
// RANKS DATA
// ═══════════════════════════════════════════════════

async function loadRanks(): Promise<Rank[]> {
  const { data, error } = await supabase
    .from('ranks')
    .select('*')
    .order('rank', { ascending: true });

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load ranks:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    rank: row.rank as number,
    xpRequired: row.xp_required as number
  }));
}

// ═══════════════════════════════════════════════════
// GUILDS DATA
// ═══════════════════════════════════════════════════

async function loadGuilds(): Promise<Guild[]> {
  const { data, error } = await supabase
    .from('guilds')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load guilds:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as number,
    faction: row.faction as Guild['faction'],
    place: row.place as Guild['place'],
    nameKey: row.name_key as string,
    reward: row.reward as number
  }));
}

// ═══════════════════════════════════════════════════
// ARENA BONUSES DATA
// ═══════════════════════════════════════════════════

async function loadArenaBonuses(): Promise<ArenaBonus[]> {
  const { data, error } = await supabase
    .from('arena_bonuses')
    .select('*');

  if (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to load arena bonuses:', error.message);
    }
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as number,
    maxQuantity: row.max_quantity as number,
    effects: row.effects as string,
    probability: Number(row.probability)
  }));
}

// ═══════════════════════════════════════════════════
// MAIN DATA LOADER
// ═══════════════════════════════════════════════════

export async function loadAllData(): Promise<AppData> {
  const cached = getCached<AppData>('allData');
  if (cached) return cached;

  // Load localization first
  const loc = await loadLocalization();

  // Load all data in parallel
  const [
    ships, weapons, ammo, swivelAmmo, kegs, crews, skills,
    upgrades, cosmetics, consumables, resources, ports,
    achievements, ranks, guilds, arenaBonuses
  ] = await Promise.all([
    loadShips(),
    loadWeapons(),
    loadAmmo(),
    loadSwivelAmmo(),
    loadKegs(),
    loadCrewUnits(),
    loadCaptainSkills(),
    loadUpgrades(),
    loadCosmetics(),
    loadConsumables(),
    loadResources(),
    loadPorts(),
    loadAchievements(),
    loadRanks(),
    loadGuilds(),
    loadArenaBonuses()
  ]);

  const appData: AppData = {
    ships,
    weapons,
    ammo,
    swivelAmmo,
    kegs,
    crews,
    skills,
    upgrades,
    cosmetics,
    consumables,
    resources,
    ports,
    achievements,
    ranks,
    guilds,
    arenaBonuses,
    localization: loc
  };

  setCache('allData', appData);
  return appData;
}

// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

export function getShipById(ships: Ship[], id: number): Ship | undefined {
  return ships.find(ship => ship.id === id);
}

export function getWeaponById(weapons: Weapon[], id: string): Weapon | undefined {
  return weapons.find(weapon => weapon.id === id);
}

export function getShipsByClass(ships: Ship[], shipClass: ShipClass): Ship[] {
  return ships.filter(ship => {
    // Use type-to-class mapping
    const typeToClass: Record<string, ShipClass> = {
      'Destroyer': 'Fast',
      'Battleship': 'Combat',
      'Hardship': 'Heavy',
      'CargoShip': 'Transport',
      'Mortar': 'Siege'
    };
    return typeToClass[ship.type] === shipClass;
  });
}

export function getShipsByTier(ships: Ship[], tier: number): Ship[] {
  return ships.filter(ship => ship.tier === tier);
}

export function getPvPRelevantCrews(crews: CrewUnit[]): CrewUnit[] {
  return crews.filter(crew => crew.pvpRelevant);
}

export function getPvPRelevantSkills(skills: CaptainSkill[]): CaptainSkill[] {
  return skills.filter(skill => skill.pvpRelevant);
}

export function getSkillsByCategory(skills: CaptainSkill[], category: SkillCategory): CaptainSkill[] {
  return skills.filter(skill => skill.category === category);
}

// ═══════════════════════════════════════════════════
// STAT CALCULATIONS
// ═══════════════════════════════════════════════════

export function calculateMaxStat(ships: Ship[], stat: keyof Ship): number {
  if (ships.length === 0) return 0;
  return Math.max(...ships.map(s => {
    const value = s[stat];
    return typeof value === 'number' ? value : 0;
  }));
}

export function calculateStatPercentage(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((value / max) * 100);
}

type ShipStatKey = 'health' | 'speed' | 'mobility' | 'armor' | 'cargo' | 'crewSlots';

/**
 * Get min/max bounds for ship stats - optimized single-pass accumulator
 */
export function getStatBounds(ships: Ship[]): Record<string, { min: number; max: number }> {
  const stats: ShipStatKey[] = ['health', 'speed', 'mobility', 'armor', 'cargo', 'crewSlots'];

  // Initialize bounds with extreme values
  const bounds: Record<string, { min: number; max: number }> = {};
  for (const stat of stats) {
    bounds[stat] = { min: Infinity, max: -Infinity };
  }

  // Handle empty array early
  if (ships.length === 0) {
    for (const stat of stats) {
      bounds[stat] = { min: 0, max: 0 };
    }
    return bounds;
  }

  // Single pass through all ships
  for (const ship of ships) {
    for (const stat of stats) {
      const value = ship[stat];
      if (typeof value === 'number' && value > 0) {
        if (value < bounds[stat].min) bounds[stat].min = value;
        if (value > bounds[stat].max) bounds[stat].max = value;
      }
    }
  }

  // Fix any stats that had no valid values
  for (const stat of stats) {
    if (bounds[stat].min === Infinity) {
      bounds[stat] = { min: 0, max: 0 };
    }
  }

  return bounds;
}
