/* Captain's Cove - Data Loader */
/* Fetches and transforms JSON game data with localization */

import type {
  Ship,
  ShipRaw,
  Weapon,
  WeaponRaw,
  Ammo,
  PowderKeg,
  CrewUnit,
  CrewUnitRaw,
  CaptainSkill,
  Upgrade,
  Cosmetic,
  Resource,
  Localization,
  AppData,
  ShipType,
  ShipClass,
  WeaponCategory,
  WeaponSize,
  SkillCategory,
  SHIP_TYPE_TO_CLASS
} from './types';

// ═══════════════════════════════════════════════════
// CACHE MANAGEMENT
// ═══════════════════════════════════════════════════

const cache: Map<string, unknown> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
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
// DATA FETCHING
// ═══════════════════════════════════════════════════

async function fetchJson<T>(path: string): Promise<T> {
  const cached = getCached<T>(path);
  if (cached) return cached;

  const response = await fetch(`/data/${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  const data = await response.json();
  setCache(path, data);
  return data;
}

// ═══════════════════════════════════════════════════
// LOCALIZATION
// ═══════════════════════════════════════════════════

let localization: Localization = {};

async function loadLocalization(): Promise<Localization> {
  if (Object.keys(localization).length > 0) {
    return localization;
  }

  // Load main localization and category-specific files in parallel
  const [main, items, units, skills, ammo] = await Promise.all([
    fetchJson<Localization>('localization/en.json'),
    fetchJson<Localization>('localization/en_items.json'),
    fetchJson<Localization>('localization/en_units.json'),
    fetchJson<Localization>('localization/en_skills.json'),
    fetchJson<Localization>('localization/en_ammo.json')
  ]);

  localization = { ...main, ...items, ...units, ...skills, ...ammo };
  return localization;
}

export function getLocalizedString(key: string): string {
  return localization[key] || key;
}

// ═══════════════════════════════════════════════════
// SHIP TYPE TO CLASS MAPPING
// ═══════════════════════════════════════════════════

const SHIP_TYPE_CLASS_MAP: Record<ShipType, ShipClass> = {
  'Destroyer': 'Fast',
  'Battleship': 'Combat',
  'Hardship': 'Heavy',
  'CargoShip': 'Transport',
  'Mortar': 'Siege'
};

function getShipClass(type: ShipType): ShipClass {
  return SHIP_TYPE_CLASS_MAP[type] || 'Combat';
}

// ═══════════════════════════════════════════════════
// SHIP DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface ShipsJsonResponse {
  ships: ShipRaw[];
}

async function loadShips(): Promise<Ship[]> {
  const [data, loc] = await Promise.all([
    fetchJson<ShipsJsonResponse>('ships/stats.json'),
    loadLocalization()
  ]);

  return data.ships
    .filter(ship => ship.id > 0) // Filter out invalid entries
    .map(raw => {
      const nameKey = `ship_${raw.id}_name`;
      const name = loc[nameKey] || `Ship ${raw.id}`;

      // Convert rank to tier (rank 0 = tier 7, rank 6 = tier 1)
      const tier = 7 - raw.rank;

      // Determine if ship is playable (has valid stats)
      const isPlayable = raw.health > 0 && tier >= 1 && tier <= 7;

      // Determine PvP role based on type and stats
      const pvpRole = determinePvPRole(raw);

      return {
        id: raw.id,
        staticInfoId: raw.staticInfoId,
        name,
        health: raw.health,
        speed: raw.speed,
        mobility: raw.mobility,
        armor: raw.armor,
        capacity: raw.capacity,
        crewSlots: raw.crewSlots,
        rank: raw.rank,
        tier,
        type: raw.type,
        shipClass: getShipClass(raw.type),
        subtype: raw.subtype,
        fraction: raw.fraction,
        cost: raw.cost,
        coolness: raw.coolness,
        requiredRank: raw.requiredRank,
        upgradeSlots: raw.upgradeSlots,
        isPlayable,
        pvpRole,
        icon: `ships/ship_${raw.id}`
      } as Ship;
    })
    .filter(ship => ship.isPlayable)
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
}

function determinePvPRole(ship: ShipRaw): string {
  const type = ship.type;
  const armor = ship.armor;
  const speed = ship.speed;

  if (type === 'Mortar') return 'Siege';
  if (type === 'CargoShip') return 'Trade';
  if (type === 'Hardship') return armor >= 8 ? 'Tank/Brawl' : 'Frontline';
  if (type === 'Destroyer') return speed >= 9 ? 'Kite/Scout' : 'Pursuit';
  if (type === 'Battleship') return armor >= 6 ? 'Frontline' : 'Skirmish';

  return 'General';
}

// ═══════════════════════════════════════════════════
// WEAPON DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface CannonsJsonResponse {
  cannons: WeaponRaw[];
}

function parseWeaponCategory(category: string): { category: WeaponCategory; sizeClass: WeaponSize } {
  const parts = category.split(' ');
  const size = parts[0] as WeaponSize;

  // Determine category from class name
  let cat: WeaponCategory = 'Cannon';
  const classLower = category.toLowerCase();

  if (classLower.includes('culverin') || classLower.includes('distance')) {
    cat = 'Culverin';
  } else if (classLower.includes('carronade') || classLower.includes('heavy')) {
    cat = 'Carronade';
  } else if (classLower.includes('bombard')) {
    cat = 'Bombard';
  } else if (classLower.includes('mortar')) {
    cat = 'Mortar';
  }

  return { category: cat, sizeClass: size || 'Medium' };
}

function extractSpeedFactor(extra: string): number {
  const match = extra.match(/SpeedFactor:([\d.]+)/);
  return match ? parseFloat(match[1]) : 1;
}

function determineWeaponTier(weaponClass: string): number {
  if (weaponClass.includes('CastIron') || weaponClass.includes('Default')) return 5;
  if (weaponClass.includes('Bronze')) return 4;
  if (weaponClass.includes('Iron')) return 3;
  if (weaponClass.includes('Steel')) return 2;
  if (weaponClass.includes('Gold') || weaponClass.includes('Elite')) return 1;
  return 4;
}

async function loadWeapons(): Promise<Weapon[]> {
  const data = await fetchJson<CannonsJsonResponse>('weapons/cannons.json');

  return data.cannons.map(raw => {
    const { category, sizeClass } = parseWeaponCategory(raw.category);
    const speedFactor = extractSpeedFactor(raw.extra);
    const tier = determineWeaponTier(raw.category);

    // Generate a readable name from ID
    const nameParts = raw.id.replace('ncs_', '').split('_');
    const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

    return {
      id: raw.id,
      name,
      class: raw.class,
      category,
      sizeClass,
      distance: parseInt(raw.distance, 10),
      penetration: Number(raw.penetration) || 0,
      cooldown: Number(raw.cooldown) || 0,
      angle: Number(raw.angle) || 0,
      scatter: Number(raw.scatter) || 0,
      speedFactor,
      price: Number(raw.price) || 0,
      icon: raw.icon,
      model: raw.model,
      craftingType: raw.craftingType,
      tier
    } as Weapon;
  });
}

// ═══════════════════════════════════════════════════
// AMMO DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface AmmoJsonResponse {
  ammo: Ammo[];
}

async function loadAmmo(): Promise<Ammo[]> {
  const [data, loc] = await Promise.all([
    fetchJson<AmmoJsonResponse>('weapons/ammo.json'),
    loadLocalization()
  ]);

  return data.ammo.map(raw => {
    const nameKey = `${raw.id}_name`;
    const name = loc[nameKey] || raw.id.replace('cball_', 'Ball ');

    return {
      ...raw,
      name,
      isRare: raw.isRare || raw.cost > 5
    };
  });
}

// ═══════════════════════════════════════════════════
// POWDER KEGS DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface KegsJsonResponse {
  kegs: PowderKeg[];
}

async function loadKegs(): Promise<PowderKeg[]> {
  const data = await fetchJson<KegsJsonResponse>('weapons/kegs.json');

  return data.kegs
    .filter(keg => keg.id !== 'removed')
    .map(raw => {
      // Generate name from ID
      const name = `Powder Keg ${raw.id.replace('pkeg_', '')}`;

      return {
        ...raw,
        name
      };
    });
}

// ═══════════════════════════════════════════════════
// CREW DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface UnitsJsonResponse {
  units: CrewUnitRaw[];
}

// PvP-relevant special crew IDs
const PVP_RELEVANT_CREW = [
  'unit_special_8', 'unit_special_8b', 'unit_special_8c', // Gunners
  'unit_special_9', 'unit_special_9b', // Artillerists
  'unit_special_11', 'unit_special_11b', 'unit_special_11c', // Sail handlers
  'unit_special_21', // Quartermaster
  'unit_special_28', // Powder Monkey
  'unit_special_30', // Scout
];

async function loadCrewUnits(): Promise<CrewUnit[]> {
  const [data, loc] = await Promise.all([
    fetchJson<UnitsJsonResponse>('crew/units.json'),
    loadLocalization()
  ]);

  return data.units.map(raw => {
    const nameKey = `${raw.id}_name`;
    const name = loc[nameKey] || raw.id;
    const pvpRelevant = raw.type === 'Sailor' ||
                        raw.type === 'Boarding' ||
                        PVP_RELEVANT_CREW.includes(raw.id);

    return {
      ...raw,
      name,
      pvpRelevant
    } as CrewUnit;
  });
}

// ═══════════════════════════════════════════════════
// CAPTAIN SKILLS DATA TRANSFORMATION
// ═══════════════════════════════════════════════════

interface SkillsJsonResponse {
  skills: {
    name: string;
    costPoints: number;
    cost: string;
    effect: string;
    category: number;
    position: string;
    radialPosition: string;
    dependsOn: string;
    requiredAchievements: string;
    requiredShips: string;
    requiredRank: string;
    icon: string;
  }[];
}

const SKILL_CATEGORY_MAP: Record<number, SkillCategory> = {
  0: 'economy',
  1: 'logistics',
  2: 'combat',
  3: 'legend'
};

// PvP-relevant skill names
const PVP_SKILL_PATTERNS = [
  'skill_27', 'skill_28', 'skill_29', 'skill_30', 'skill_31', 'skill_32',
  'skill_33', 'skill_34', 'skill_35', 'skill_36', 'skill_37', 'skill_38',
  'skill_39', 'skill_40', 'skill_41', 'skill_42', 'skill_52', 'skill_53'
];

async function loadCaptainSkills(): Promise<CaptainSkill[]> {
  const [data, loc] = await Promise.all([
    fetchJson<SkillsJsonResponse>('crew/skills.json'),
    loadLocalization()
  ]);

  return data.skills
    .filter(raw => raw.name !== 'removed' && raw.effect)
    .map(raw => {
      const nameKey = `${raw.name}_name`;
      const name = loc[nameKey] || raw.name;
      const category = SKILL_CATEGORY_MAP[raw.category] || 'economy';
      const pvpRelevant = category === 'combat' ||
                          PVP_SKILL_PATTERNS.includes(raw.name);

      return {
        id: raw.name,
        name,
        costPoints: raw.costPoints,
        cost: raw.cost,
        effect: raw.effect,
        category,
        position: raw.position,
        radialPosition: raw.radialPosition,
        dependsOn: raw.dependsOn,
        requiredAchievements: raw.requiredAchievements,
        requiredShips: raw.requiredShips,
        requiredRank: raw.requiredRank,
        icon: raw.icon,
        pvpRelevant
      } as CaptainSkill;
    });
}

// ═══════════════════════════════════════════════════
// UPGRADES DATA (placeholder - needs upgrade file)
// ═══════════════════════════════════════════════════

async function loadUpgrades(): Promise<Upgrade[]> {
  // Upgrades file not in the expected location
  // Return empty array for now
  return [];
}

// ═══════════════════════════════════════════════════
// COSMETICS DATA (placeholder)
// ═══════════════════════════════════════════════════

async function loadCosmetics(): Promise<Cosmetic[]> {
  try {
    const data = await fetchJson<{ cosmetics: Cosmetic[] }>('ships/cosmetics.json');
    return data.cosmetics || [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════
// RESOURCES DATA (placeholder)
// ═══════════════════════════════════════════════════

async function loadResources(): Promise<Resource[]> {
  try {
    const data = await fetchJson<{ resources: Resource[] }>('world/resources.json');
    return data.resources || [];
  } catch {
    return [];
  }
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
  const [ships, weapons, ammo, kegs, crews, skills, upgrades, cosmetics, resources] = await Promise.all([
    loadShips(),
    loadWeapons(),
    loadAmmo(),
    loadKegs(),
    loadCrewUnits(),
    loadCaptainSkills(),
    loadUpgrades(),
    loadCosmetics(),
    loadResources()
  ]);

  const appData: AppData = {
    ships,
    weapons,
    ammo,
    kegs,
    crews,
    skills,
    upgrades,
    cosmetics,
    resources,
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
  return ships.filter(ship => ship.shipClass === shipClass);
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
  return Math.max(...ships.map(s => {
    const value = s[stat];
    return typeof value === 'number' ? value : 0;
  }));
}

export function calculateStatPercentage(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((value / max) * 100);
}

export function getStatBounds(ships: Ship[]): Record<string, { min: number; max: number }> {
  const stats = ['health', 'speed', 'mobility', 'armor', 'capacity', 'crewSlots'] as const;
  const bounds: Record<string, { min: number; max: number }> = {};

  for (const stat of stats) {
    const values = ships.map(s => s[stat] as number).filter(v => v > 0);
    bounds[stat] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  return bounds;
}
