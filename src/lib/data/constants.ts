/**
 * Centralized constants for Captain's Cove
 * Eliminates duplication across components
 */

import type { Archetype } from './types';

// =============================================================================
// STAT NORMALIZATION VALUES
// =============================================================================

/**
 * Maximum stat values for normalizing ship stats (0-100% bars)
 * Used in: ShipDetailModal, WeaponDetailModal, BuildEditor, balance components
 */
export const MAX_STAT_VALUES = {
  health: 12000,
  speed: 14,
  armor: 12,
  cargo: 6000,
  crew: 150
} as const;

// =============================================================================
// ARCHETYPE DEFINITIONS
// =============================================================================

/**
 * Archetype weights for scoring ships
 * Each weight indicates importance of that stat for the archetype (0-1, sum to 1)
 */
export const ARCHETYPE_WEIGHTS: Record<Archetype, {
  hp: number;
  speed: number;
  dps: number;
  range: number;
  accuracy: number;
  cargo: number;
  crew: number;
  armor: number;
}> = {
  brawler: { hp: 0.30, speed: 0.05, dps: 0.35, range: 0.00, accuracy: 0.10, cargo: 0.00, crew: 0.10, armor: 0.10 },
  kite: { hp: 0.10, speed: 0.30, dps: 0.15, range: 0.25, accuracy: 0.05, cargo: 0.00, crew: 0.00, armor: 0.00 },
  sniper: { hp: 0.10, speed: 0.05, dps: 0.20, range: 0.30, accuracy: 0.25, cargo: 0.00, crew: 0.00, armor: 0.00 },
  pursuit: { hp: 0.05, speed: 0.35, dps: 0.25, range: 0.10, accuracy: 0.05, cargo: 0.00, crew: 0.05, armor: 0.00 },
  trade: { hp: 0.20, speed: 0.20, dps: 0.05, range: 0.00, accuracy: 0.00, cargo: 0.40, crew: 0.00, armor: 0.10 },
  siege: { hp: 0.25, speed: 0.00, dps: 0.25, range: 0.30, accuracy: 0.10, cargo: 0.00, crew: 0.00, armor: 0.10 }
} as const;

/**
 * Archetype display information
 */
export const ARCHETYPE_INFO: Record<Archetype, {
  name: string;
  description: string;
  icon: string;
}> = {
  brawler: { name: 'Brawler', description: 'Close-range combat focused on HP and damage', icon: '⚔️' },
  kite: { name: 'Kite', description: 'Fast ships that keep distance and harass', icon: '🎯' },
  sniper: { name: 'Sniper', description: 'Long-range precision strikes', icon: '🔭' },
  pursuit: { name: 'Pursuit', description: 'Speed-focused hunters that chase down targets', icon: '⚡' },
  trade: { name: 'Trade', description: 'Cargo capacity with defensive capability', icon: '📦' },
  siege: { name: 'Siege', description: 'Heavy damage at range, slow but powerful', icon: '💣' }
} as const;

/**
 * All archetype identifiers
 */
export const ARCHETYPES: readonly Archetype[] = ['brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege'] as const;

// =============================================================================
// WEAPON CATEGORIES
// =============================================================================

/**
 * Weapon categories that can be mounted as broadside weapons
 */
export const BROADSIDE_CATEGORIES = new Set(['Cannon', 'Carronade', 'Culverin', 'Long Gun']);

/**
 * Weapon categories for bow/stern mounts
 */
export const BOW_STERN_CATEGORIES = new Set(['Cannon', 'Culverin', 'Carronade']);

/**
 * All weapon categories
 */
export const WEAPON_CATEGORIES = ['Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar', 'Long Gun'] as const;

/**
 * Weapon size classes
 */
export const WEAPON_SIZES = ['Light', 'Medium', 'Heavy'] as const;

// =============================================================================
// RESOURCE CATEGORIES
// =============================================================================

/**
 * Resource categories for items
 */
export const RESOURCE_CATEGORIES = ['trade', 'food', 'material', 'special'] as const;

// =============================================================================
// CREW TYPES
// =============================================================================

/**
 * Crew unit types
 */
export const CREW_TYPES = ['Sailor', 'Boarding', 'Special'] as const;

/**
 * Skill categories
 */
export const SKILL_CATEGORIES = ['combat', 'logistics', 'economy', 'legend'] as const;

// =============================================================================
// SHIP CLASSES & TIERS
// =============================================================================

/**
 * Ship classes
 */
export const SHIP_CLASSES = ['Combat', 'Fast', 'Heavy', 'Transport', 'Siege', 'Imperial'] as const;

/**
 * Ship tier range
 */
export const SHIP_TIERS = [1, 2, 3, 4, 5, 6, 7] as const;

// =============================================================================
// UI CONSTANTS
// =============================================================================

/**
 * Mobile breakpoint in pixels
 */
export const MOBILE_BREAKPOINT = 768;

/**
 * Auto-save debounce delay in milliseconds
 */
export const AUTO_SAVE_DEBOUNCE_MS = 500;

// =============================================================================
// MAX VALUES FOR STAT NORMALIZATION
// =============================================================================

/**
 * Maximum weapon stat values for normalizing weapon stats (0-100% bars)
 * Used in: WeaponDetailModal
 */
export const MAX_WEAPON_VALUES = {
  penetration: 35,
  distance: 800,
  cooldown: 12,
  angle: 180,
  scatter: 10
} as const;

/**
 * Maximum crew stat values for normalizing crew stats (0-100% bars)
 * Used in: CrewDetailModal
 */
export const MAX_CREW_VALUES = {
  damage: 50,
  health: 200,
  capacity: 5,
  cost: 500
} as const;
