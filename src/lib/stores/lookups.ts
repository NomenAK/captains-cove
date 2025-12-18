/**
 * Centralized lookup stores for O(1) entity access
 * Replaces repeated .find() calls with Map lookups
 */

import { derived, type Readable } from 'svelte/store';
import { dataStore } from './index';
import type { Ship, Weapon, Ammo, CrewUnit, CaptainSkill, Upgrade } from '$lib/data/types';

// =============================================================================
// SHIP LOOKUPS
// =============================================================================

/**
 * Map of ships by ID for O(1) lookup
 */
export const shipById: Readable<Map<number, Ship>> = derived(
  dataStore,
  $data => new Map($data.ships.map(s => [s.id, s]))
);

/**
 * Map of ships by name for O(1) lookup
 */
export const shipByName: Readable<Map<string, Ship>> = derived(
  dataStore,
  $data => new Map($data.ships.map(s => [s.name.toLowerCase(), s]))
);

// =============================================================================
// WEAPON LOOKUPS
// =============================================================================

/**
 * Map of weapons by ID for O(1) lookup
 */
export const weaponById: Readable<Map<string, Weapon>> = derived(
  dataStore,
  $data => new Map($data.weapons.map(w => [w.id, w]))
);

/**
 * Weapons filtered by broadside compatibility
 */
export const broadsideWeapons: Readable<Weapon[]> = derived(
  dataStore,
  $data => $data.weapons.filter(w =>
    ['Cannon', 'Carronade', 'Culverin', 'Long Gun'].includes(w.category)
  )
);

/**
 * Weapons filtered by bow/stern compatibility
 */
export const bowSternWeapons: Readable<Weapon[]> = derived(
  dataStore,
  $data => $data.weapons.filter(w =>
    ['Cannon', 'Culverin', 'Carronade'].includes(w.category)
  )
);

// =============================================================================
// AMMO LOOKUPS
// =============================================================================

/**
 * Map of ammo by ID for O(1) lookup
 */
export const ammoById: Readable<Map<string, Ammo>> = derived(
  dataStore,
  $data => new Map($data.ammo.map(a => [a.id, a]))
);

// =============================================================================
// CREW LOOKUPS
// =============================================================================

/**
 * Map of crew by ID for O(1) lookup
 */
export const crewById: Readable<Map<string, CrewUnit>> = derived(
  dataStore,
  $data => new Map($data.crews.map(c => [c.id, c]))
);

/**
 * Map of skills by ID for O(1) lookup
 */
export const skillById: Readable<Map<string, CaptainSkill>> = derived(
  dataStore,
  $data => new Map($data.skills.map(s => [s.id, s]))
);

// =============================================================================
// UPGRADE LOOKUPS
// =============================================================================

/**
 * Map of upgrades by ID for O(1) lookup
 */
export const upgradeById: Readable<Map<string, Upgrade>> = derived(
  dataStore,
  $data => new Map($data.upgrades.map(u => [u.id, u]))
);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a ship by ID from the lookup map
 * @param lookup - The ship lookup map
 * @param id - Ship ID
 * @returns Ship or undefined
 */
export function getShip(lookup: Map<number, Ship>, id: number): Ship | undefined {
  return lookup.get(id);
}

/**
 * Get a weapon by ID from the lookup map
 * @param lookup - The weapon lookup map
 * @param id - Weapon ID
 * @returns Weapon or undefined
 */
export function getWeapon(lookup: Map<string, Weapon>, id: string): Weapon | undefined {
  return lookup.get(id);
}

/**
 * Get an ammo by ID from the lookup map
 * @param lookup - The ammo lookup map
 * @param id - Ammo ID
 * @returns Ammo or undefined
 */
export function getAmmo(lookup: Map<string, Ammo>, id: string): Ammo | undefined {
  return lookup.get(id);
}
