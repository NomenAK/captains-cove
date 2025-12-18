/* Captain's Cove - Filter Stores */
/* Manages filter state for each data view */
/* Optimized: Single-pass filtering, centralized sort utilities */

import { writable, derived } from 'svelte/store';
import type {
  Ship,
  Weapon,
  CrewUnit,
  Build,
  ShipClass,
  WeaponCategory,
  WeaponSize,
  CrewType,
  CrewOptions,
  Archetype,
  ShipFilters,
  WeaponFilters,
  CrewFilters,
  BuildFilters,
  SortConfig
} from '$lib/data/types';
import { dataStore } from './data';
import { shipById } from './lookups';
import { createSortComparator } from '$lib/utils/sort';

// ═══════════════════════════════════════════════════
// SHIP FILTERS
// ═══════════════════════════════════════════════════

const defaultShipFilters: ShipFilters = {
  class: '',
  tier: '',
  role: '',
  search: '',
  showAll: false
};

export const shipFilters = writable<ShipFilters>(defaultShipFilters);
export const shipSort = writable<SortConfig>({ field: 'tier', direction: 'asc' });

export function resetShipFilters() {
  shipFilters.set(defaultShipFilters);
}

// Filtered ships derived store - optimized single-pass filter
export const filteredShips = derived(
  [dataStore, shipFilters, shipSort],
  ([$data, $filters, $sort]) => {
    // Pre-compute search term once
    const searchLower = $filters.search?.toLowerCase() || '';
    const tierNum = $filters.tier ? parseInt($filters.tier, 10) : null;

    // Single-pass compound filter
    const filtered = $data.ships.filter(s =>
      (!$filters.class || s.shipClass === $filters.class) &&
      (tierNum === null || s.tier === tierNum) &&
      (!$filters.role || s.pvpRole === $filters.role) &&
      (!searchLower || s.name.toLowerCase().includes(searchLower) || s.subtype.toLowerCase().includes(searchLower))
    );

    // Sort using utility
    return filtered.sort(createSortComparator($sort.field as keyof Ship, $sort.direction));
  }
);

// ═══════════════════════════════════════════════════
// WEAPON FILTERS
// ═══════════════════════════════════════════════════

const defaultWeaponFilters: WeaponFilters = {
  category: '',
  size: '',
  tier: '',
  search: ''
};

export const weaponFilters = writable<WeaponFilters>(defaultWeaponFilters);
export const weaponSort = writable<SortConfig>({ field: 'tier', direction: 'asc' });

export function resetWeaponFilters() {
  weaponFilters.set(defaultWeaponFilters);
}

// Filtered weapons derived store - optimized single-pass filter
export const filteredWeapons = derived(
  [dataStore, weaponFilters, weaponSort],
  ([$data, $filters, $sort]) => {
    // Pre-compute search term once
    const searchLower = $filters.search?.toLowerCase() || '';
    const tierNum = $filters.tier ? parseInt($filters.tier, 10) : null;

    // Single-pass compound filter
    const filtered = $data.weapons.filter(w =>
      (!$filters.category || w.category === $filters.category) &&
      (!$filters.size || w.sizeClass === $filters.size) &&
      (tierNum === null || w.tier === tierNum) &&
      (!searchLower || w.name.toLowerCase().includes(searchLower) || w.class.toLowerCase().includes(searchLower))
    );

    // Sort using utility
    return filtered.sort(createSortComparator($sort.field as keyof Weapon, $sort.direction));
  }
);

// ═══════════════════════════════════════════════════
// CREW FILTERS
// ═══════════════════════════════════════════════════

const defaultCrewFilters: CrewFilters = {
  type: '',
  options: '',
  pvpOnly: false,
  search: ''
};

export const crewFilters = writable<CrewFilters>(defaultCrewFilters);
export const crewSort = writable<SortConfig>({ field: 'name', direction: 'asc' });

export function resetCrewFilters() {
  crewFilters.set(defaultCrewFilters);
}

// Filtered crews derived store - optimized single-pass filter
export const filteredCrews = derived(
  [dataStore, crewFilters, crewSort],
  ([$data, $filters, $sort]) => {
    // Pre-compute search term once
    const searchLower = $filters.search?.toLowerCase() || '';

    // Single-pass compound filter
    const filtered = $data.crews.filter(c =>
      (!$filters.type || c.type === $filters.type) &&
      (!$filters.options || c.options === $filters.options) &&
      (!$filters.pvpOnly || c.pvpRelevant) &&
      (!searchLower || c.name.toLowerCase().includes(searchLower) || c.effect.toLowerCase().includes(searchLower))
    );

    // Sort using utility
    return filtered.sort(createSortComparator($sort.field as keyof CrewUnit, $sort.direction));
  }
);

// ═══════════════════════════════════════════════════
// BUILD FILTERS
// ═══════════════════════════════════════════════════

const defaultBuildFilters: BuildFilters = {
  archetype: '',
  tier: '',
  search: ''
};

export const buildFilters = writable<BuildFilters>(defaultBuildFilters);
export const buildSort = writable<SortConfig>({ field: 'updatedAt', direction: 'desc' });

export function resetBuildFilters() {
  buildFilters.set(defaultBuildFilters);
}

// ═══════════════════════════════════════════════════
// COMPARISON STATE
// ═══════════════════════════════════════════════════

export const comparisonShipIds = writable<number[]>([]);

export function addToComparison(shipId: number) {
  comparisonShipIds.update(ids => {
    if (ids.includes(shipId)) return ids;
    if (ids.length >= 3) return ids; // Max 3 ships
    return [...ids, shipId];
  });
}

export function removeFromComparison(shipId: number) {
  comparisonShipIds.update(ids => ids.filter(id => id !== shipId));
}

export function clearComparison() {
  comparisonShipIds.set([]);
}

// Comparison ships derived store - optimized with O(1) lookup
export const comparisonShips = derived(
  [shipById, comparisonShipIds],
  ([$lookup, $ids]) => $ids.map(id => $lookup.get(id)).filter((s): s is Ship => s !== undefined)
);
