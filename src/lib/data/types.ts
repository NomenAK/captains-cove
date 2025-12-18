/* Captain's Cove - TypeScript Interfaces */
/* Game Data Type Definitions */

// ═══════════════════════════════════════════════════
// SHIP TYPES
// ═══════════════════════════════════════════════════

export type ShipType = 'Destroyer' | 'Battleship' | 'Hardship' | 'CargoShip' | 'Mortar';
export type ShipClass = 'Combat' | 'Fast' | 'Heavy' | 'Transport' | 'Siege' | 'Imperial';
export type Fraction = 'None' | 'Antilia' | 'Empire' | 'Espaniol' | 'KaiAndSeveria' | 'Scandinavia' | 'Pirates';
export type Coolness = 'Default' | 'Unique' | 'Elite' | 'Rare';

export interface Ship {
  id: number;
  staticInfoId: number;
  name: string; // Derived from localization
  health: number;
  speed: number;
  mobility: number;
  armor: number;
  capacity: number;
  crewSlots: number;
  rank: number; // 0 = Tier I (best), 6 = Tier VII (starter)
  tier: number; // Calculated: 7 - rank
  type: ShipType;
  shipClass: ShipClass; // Mapped from type
  subtype: string;
  fraction: Fraction;
  cost: number;
  coolness: Coolness;
  requiredRank: number;
  upgradeSlots: number;
  isPlayable: boolean;
  pvpRole?: string;
  icon?: string;
}

export interface ShipRaw {
  id: number;
  staticInfoId: number;
  health: number;
  speed: number;
  mobility: number;
  armor: number;
  capacity: number;
  crewSlots: number;
  rank: number;
  type: ShipType;
  subtype: string;
  fraction: Fraction;
  cost: number;
  coolness: Coolness;
  requiredRank: number;
  upgradeSlots: number;
}

// Ship type to class mapping
export const SHIP_TYPE_TO_CLASS: Record<ShipType, ShipClass> = {
  'Destroyer': 'Fast',
  'Battleship': 'Combat',
  'Hardship': 'Heavy',
  'CargoShip': 'Transport',
  'Mortar': 'Siege'
};

// ═══════════════════════════════════════════════════
// WEAPON TYPES
// ═══════════════════════════════════════════════════

export type WeaponCategory = 'Cannon' | 'Culverin' | 'Carronade' | 'Bombard' | 'Mortar';
export type WeaponSize = 'Light' | 'Medium' | 'Heavy';
export type CraftingType = 'ByGold' | 'ByCraft' | 'NotAvailable';

export interface Weapon {
  id: string;
  name: string; // Derived from localization
  class: string;
  category: WeaponCategory;
  sizeClass: WeaponSize;
  distance: number;
  penetration: number;
  cooldown: number;
  angle: number;
  scatter: number;
  speedFactor: number;
  price: number;
  icon: string;
  model: string;
  craftingType: CraftingType;
  tier: number; // Derived from class/category
  dps?: number; // Calculated
}

export interface WeaponRaw {
  id: string;
  class: string;
  category: string;
  distance: string;
  penetration: number;
  cooldown: number;
  angle: number;
  scatter: number;
  extra: string;
  price: number;
  icon: string;
  model: string;
  craftingType: CraftingType;
}

// ═══════════════════════════════════════════════════
// AMMO TYPES
// ═══════════════════════════════════════════════════

export interface Ammo {
  id: string;
  name: string;
  speed: number;
  penetration: number;
  damageFactor: number;
  sailDamage: number;
  crewDamage: number;
  minDamage: number;
  effects: string;
  mass: number;
  radius: number;
  reloadFactor: number;
  distanceFactor: number;
  icon: string;
  cost: number;
  isRare: boolean;
}

// ═══════════════════════════════════════════════════
// POWDER KEG TYPES
// ═══════════════════════════════════════════════════

export interface PowderKeg {
  id: string;
  name: string;
  mass: number;
  damage: number;
  triggerRadius: number;
  damageRadius: number;
  count: number;
  reload: number;
  crewUsage: number;
  icon: string;
  costGold: number;
  costSkulls: number;
  costMarks: number;
  isRare: boolean;
}

// ═══════════════════════════════════════════════════
// CREW TYPES
// ═══════════════════════════════════════════════════

export type CrewType = 'Sailor' | 'Boarding' | 'Special';
export type CrewOptions = 'All' | 'Combats' | 'Sailors' | 'Pirates' | 'Adventurers';

export interface CrewUnit {
  id: string;
  name: string;
  type: CrewType;
  damage: number;
  health: number;
  capacity: number;
  cost: number;
  costMarks: number;
  options: CrewOptions;
  effect: string;
  effectPerSailor: string;
  effectPerBoarding: string;
  icon: string;
  pvpRelevant: boolean;
}

export interface CrewUnitRaw {
  id: string;
  type: CrewType;
  damage: number;
  health: number;
  capacity: number;
  cost: number;
  costMarks: number;
  options: CrewOptions;
  effect: string;
  effectPerSailor: string;
  effectPerBoarding: string;
  icon: string;
}

// ═══════════════════════════════════════════════════
// CAPTAIN SKILL TYPES
// ═══════════════════════════════════════════════════

export type SkillCategory = 'economy' | 'logistics' | 'combat' | 'legend';

export interface CaptainSkill {
  id: string;
  name: string;
  costPoints: number;
  cost: string;
  effect: string;
  category: SkillCategory;
  position: string;
  radialPosition: string;
  dependsOn: string;
  requiredAchievements: string;
  requiredShips: string;
  requiredRank: string;
  icon: string;
  pvpRelevant: boolean;
}

// ═══════════════════════════════════════════════════
// UPGRADE TYPES
// ═══════════════════════════════════════════════════

export type UpgradeCategory = 'Support' | 'Protection' | 'Combat';
export type UpgradeWearType = 'SailingDistance' | 'ReceivedDamage' | 'ShotsCount' | 'None';

export interface Upgrade {
  id: string;
  name: string;
  effects: string;
  icon: string;
  cost: boolean;
  strength: boolean;
  craftResource: string;
  category: UpgradeCategory;
  wearType: UpgradeWearType;
  parsedEffects?: UpgradeEffect[];
}

export interface UpgradeEffect {
  stat: string;
  values: number[]; // Tier-bracketed values
  prefix: 'M' | 'P' | 'B' | 'C'; // Multiplier, Percentage, Boolean, Count
}

// ═══════════════════════════════════════════════════
// COSMETIC TYPES
// ═══════════════════════════════════════════════════

export type CosmeticType = 'design' | 'sail' | 'flag' | 'guild' | 'private';

export interface Cosmetic {
  id: string;
  name: string;
  nameKey: string;
  type: CosmeticType;
  icon: string;
  inShop: boolean;
  tierRequired: number | null;
  goldCost: number | null;
  bonus: string | null;
}

// ═══════════════════════════════════════════════════
// RESOURCE TYPES
// ═══════════════════════════════════════════════════

export type ResourceCategory = 'trade' | 'food' | 'material' | 'special';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  mediumCost: number;
  mass: number;
  icon: string;
  effects: string;
  isFood: boolean;
  isTradeable: boolean;
  corruption: number;
}

// ═══════════════════════════════════════════════════
// BUILD TYPES
// ═══════════════════════════════════════════════════

export type Archetype = 'brawler' | 'kite' | 'sniper' | 'pursuit' | 'trade' | 'siege';

export interface BuildWeapons {
  broadside?: string;
  bow?: string;
  stern?: string;
  mortar?: string;
}

export interface BuildAmmo {
  primary?: string;
  secondary?: string;
}

export interface Build {
  id: string;
  name: string;
  archetype: Archetype;
  tier: number;
  shipId: number | null;
  weapons: BuildWeapons;
  ammo: BuildAmmo;
  upgrades: string[];
  strategy: string;
  strengths: string[];
  weaknesses: string[];
  estimatedScore: number;
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════
// FILTER TYPES
// ═══════════════════════════════════════════════════

export interface ShipFilters {
  class: ShipClass | '';
  tier: string;
  role: string;
  search: string;
  showAll: boolean;
}

export interface WeaponFilters {
  category: WeaponCategory | '';
  size: WeaponSize | '';
  tier: string;
  search: string;
}

export interface CrewFilters {
  type: CrewType | '';
  options: CrewOptions | '';
  pvpOnly: boolean;
  search: string;
}

export interface BuildFilters {
  archetype: Archetype | '';
  tier: string;
  search: string;
}

// ═══════════════════════════════════════════════════
// SORTING TYPES
// ═══════════════════════════════════════════════════

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// ═══════════════════════════════════════════════════
// LOCALIZATION TYPES
// ═══════════════════════════════════════════════════

export interface Localization {
  [key: string]: string;
}

// ═══════════════════════════════════════════════════
// APP STATE TYPES
// ═══════════════════════════════════════════════════

export interface AppData {
  ships: Ship[];
  weapons: Weapon[];
  ammo: Ammo[];
  kegs: PowderKeg[];
  crews: CrewUnit[];
  skills: CaptainSkill[];
  upgrades: Upgrade[];
  cosmetics: Cosmetic[];
  resources: Resource[];
  localization: Localization;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  activeModal: string | null;
  selectedShipId: number | null;
  selectedWeaponId: string | null;
  comparisonShipIds: number[];
  toast: ToastMessage | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
