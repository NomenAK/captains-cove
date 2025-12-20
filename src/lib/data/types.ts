/* Captain's Cove - TypeScript Interfaces */
/* Game Data Type Definitions */

// ═══════════════════════════════════════════════════
// SHIP TYPES
// ═══════════════════════════════════════════════════

export type ShipType = 'Destroyer' | 'Battleship' | 'Hardship' | 'CargoShip' | 'Mortar';
export type ShipClass = 'Combat' | 'Fast' | 'Heavy' | 'Transport' | 'Siege' | 'Imperial';
export type Fraction = 'None' | 'Antilia' | 'Empire' | 'Espaniol' | 'KaiAndSeveria' | 'Scandinavia' | 'Pirates' | 'TradeUnion' | 'Pirate';
export type Rarity = 'Default' | 'Unique' | 'Elite' | 'Rare' | 'Empire' | 'SailageLegend';
export type Coolness = Rarity; // Alias for backwards compatibility

export interface Ship {
  id: number;
  staticInfoId: number;
  name: string;
  nameKey: string;
  description: string | null;
  model: string | null;
  type: ShipType;
  subtype: string | null;
  rank: number; // 0 = Tier I (best), 6 = Tier VII (starter)
  tier: number; // Calculated: 7 - rank
  rarity: Rarity;
  faction: Fraction;
  // Stats
  health: number;
  armor: number;
  speed: number;
  mobility: number;
  cargo: number;
  crewSlots: number;
  upgradeSlots: number;
  // Costs
  costGold: number;
  costPremium: number;
  requiredRank: number;
  // Classification
  isPlayable: boolean;
  isVehicle: boolean;
  isNpcUsable: boolean;
  // Physics
  physicsWeight: number | null;
  physicsWaterline: number | null;
  hitboxCenter: number[] | null;
  hitboxSize: number[] | null;
  // Armament
  armSide: number;
  armSideTotal: number;
  armBow: number;
  armStern: number;
  armMortar: number;
  armFalconet: number;
  armSpecial: number;
  // Visual
  bowFigure: string | null;
  icon: string | null;
  pvpRole: string | null;
  // Legacy (for backwards compatibility)
  shipClass?: ShipClass;
  cost?: number;
  coolness?: Rarity;
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

export type WeaponCategory = 'Cannon' | 'Culverin' | 'Carronade' | 'Bombard' | 'Mortar' | 'Long Gun';
export type WeaponSize = 'Light' | 'Medium' | 'Heavy';
export type CraftingType = 'ByGold' | 'ByCraft' | 'NotAvailable' | 'ByMarks' | 'ByResources';

export interface Weapon {
  id: string;
  name: string;
  weaponClass: string;
  material: string | null;
  category: WeaponCategory;
  sizeClass: WeaponSize;
  distance: number;
  penetration: number;
  cooldown: number;
  angle: number;
  scatter: number;
  speedFactor: number;
  price: number;
  icon: string | null;
  model: string | null;
  craftingType: CraftingType;
  tier: number;
  dps?: number; // Calculated
  // Legacy
  class?: string;
}

// ═══════════════════════════════════════════════════
// AMMO TYPES
// ═══════════════════════════════════════════════════

export interface Ammo {
  id: string;
  index: number | null;
  name: string;
  description: string | null;
  speed: number;
  penetration: number;
  damageFactor: number;
  sailDamage: number;
  crewDamage: number;
  minDamage: number;
  effects: string | null;
  mass: number;
  radius: number;
  reloadFactor: number;
  distanceFactor: number;
  icon: string | null;
  cost: number;
  isRare: boolean;
  notes: string | null;
}

// ═══════════════════════════════════════════════════
// SWIVEL AMMO TYPES (Falkonets)
// ═══════════════════════════════════════════════════

export interface SwivelAmmo {
  id: string;
  index: number;
  name: string;
  description: string | null;
  speed: number;
  penetration: number;
  damageFactor: number;
  sailDamage: number;
  crewDamage: number;
  minDamage: number;
  effects: string | null;
  mass: number;
  radius: number;
  reloadFactor: number;
  distanceFactor: number;
  icon: string | null;
  cost: number;
  isRare: boolean;
  notes: string | null;
}

// ═══════════════════════════════════════════════════
// POWDER KEG TYPES
// ═══════════════════════════════════════════════════

export interface PowderKeg {
  id: string;
  name: string;
  description: string | null;
  mass: number;
  damage: number;
  triggerRadius: number;
  damageRadius: number;
  count: number;
  reload: number;
  crewUsage: number;
  icon: string | null;
  costGold: number;
  costSkulls: number;
  costMarks: number;
  isRare: boolean;
  notes: string | null;
}

// ═══════════════════════════════════════════════════
// CREW TYPES
// ═══════════════════════════════════════════════════

export type CrewType = 'Sailor' | 'Boarding' | 'Special';
export type CrewOptions = 'All' | 'Combats' | 'Sailors' | 'Pirates' | 'Adventurers' | 'BoardingOnly' | 'SailorOnly';

export interface CrewUnit {
  id: string;
  name: string;
  description: string | null;
  type: CrewType;
  damage: number;
  health: number;
  capacity: number;
  cost: number;
  costMarks: number;
  options: CrewOptions;
  effect: string | null;
  effectPerSailor: string | null;
  effectPerBoarding: string | null;
  icon: string | null;
  pvpRelevant: boolean;
}

// ═══════════════════════════════════════════════════
// CAPTAIN SKILL TYPES
// ═══════════════════════════════════════════════════

export type SkillCategory = 'economy' | 'logistics' | 'combat' | 'legend';

export interface CaptainSkill {
  id: string;
  name: string;
  description: string | null;
  costPoints: number;
  cost: string | null;
  effect: string | null;
  category: SkillCategory;
  position: string | null;
  radialPosition: string | null;
  dependsOn: string | null;
  requiredAchievements: string | null;
  requiredShips: string | null;
  requiredRank: string | null;
  icon: string | null;
  pvpRelevant: boolean;
}

// ═══════════════════════════════════════════════════
// UPGRADE TYPES
// ═══════════════════════════════════════════════════

export type UpgradeCategory = 'Support' | 'Protection' | 'Combat' | 'Speed';
export type UpgradeWearType = 'SailingDistance' | 'ReceivedDamage' | 'ShotsCount' | 'None';

export interface Upgrade {
  id: string;
  name: string;
  description: string | null;
  effects: string | null;
  icon: string | null;
  cost: boolean;
  strength: boolean;
  craftResource: string | null;
  category: UpgradeCategory;
  wearType: string | null;
  parsedEffects: UpgradeEffect[] | null;
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
  id: number;
  nameKey: string;
  type: CosmeticType;
  icon: string | null;
  inShop: string | null;
  bonus: string | null;
  // Computed
  name?: string;
}

// ═══════════════════════════════════════════════════
// CONSUMABLE TYPES
// ═══════════════════════════════════════════════════

export type ConsumableCategory = 'mending' | 'equipment' | 'group';

export interface ConsumableEffect {
  type: string;
  typeId: number;
  value: number;
  description: string;
}

export interface CraftingResource {
  id: number;
  name: string;
  quantity: number;
}

export interface Consumable {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  category: ConsumableCategory;
  cooldown: number;
  duration: number;
  effects: ConsumableEffect[];
  craftingGold: number;
  craftingResources: CraftingResource[];
  allowInterrupt: boolean | null;
  isGroupEffect: boolean;
  groupRange: number | null;
  minRank: number | null;
  npcCanUse: boolean;
  hiddenFromCraft: boolean;
  serverEffect: string | null;
}

// ═══════════════════════════════════════════════════
// RESOURCE TYPES
// ═══════════════════════════════════════════════════

export type ResourceCategory = 'trade' | 'food' | 'material' | 'special';

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  status: string;
  category: ResourceCategory;
  mediumCost: number;
  mass: number;
  icon: string | null;
  effects: string | null;
  isFood: boolean;
  isTradeable: boolean;
  corruption: number;
}

// ═══════════════════════════════════════════════════
// PORT TYPES
// ═══════════════════════════════════════════════════

export type PortType = 'PirateBay' | 'NeutralBay' | 'Bay' | 'City';

export interface Port {
  id: string;
  name: string;
  type: PortType;
  buildRanks: number;
  teamLimit: number | null;
  flags: string | null;
  producedResource: string | null;
  fixedLevel: number;
}

// ═══════════════════════════════════════════════════
// ACHIEVEMENT TYPES
// ═══════════════════════════════════════════════════

export type AchievementCategory = 'Battle' | 'Arena' | 'Top' | 'Collection' | 'Trade';

export interface Achievement {
  id: string;
  internalId: string;
  enumRef: string | null;
  ratingWeight: number;
  singleGive: boolean;
  category: AchievementCategory;
  // Computed from localization
  name?: string;
  description?: string;
}

// ═══════════════════════════════════════════════════
// RANK TYPES
// ═══════════════════════════════════════════════════

export interface Rank {
  rank: number;
  xpRequired: number;
}

// ═══════════════════════════════════════════════════
// GUILD TYPES
// ═══════════════════════════════════════════════════

export type GuildPlace = 'Gold' | 'Silver' | 'Bronze' | 'Copper';

export interface Guild {
  id: number;
  faction: Fraction;
  place: GuildPlace;
  nameKey: string;
  reward: number;
  // Computed
  name?: string;
}

// ═══════════════════════════════════════════════════
// ARENA BONUS TYPES
// ═══════════════════════════════════════════════════

export interface ArenaBonus {
  id: number;
  maxQuantity: number;
  effects: string;
  probability: number;
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
  consumables: string[];
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

export interface ConsumableFilters {
  category: ConsumableCategory | '';
  search: string;
}

export interface PortFilters {
  type: PortType | '';
  search: string;
}

export interface AchievementFilters {
  category: AchievementCategory | '';
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
  swivelAmmo: SwivelAmmo[];
  kegs: PowderKeg[];
  crews: CrewUnit[];
  skills: CaptainSkill[];
  upgrades: Upgrade[];
  cosmetics: Cosmetic[];
  consumables: Consumable[];
  resources: Resource[];
  ports: Port[];
  achievements: Achievement[];
  ranks: Rank[];
  guilds: Guild[];
  arenaBonuses: ArenaBonus[];
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
