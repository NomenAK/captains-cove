/* Captain's Cove - Filter Stores */
/* Manages filter state for each data view */

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

// Filtered ships derived store
export const filteredShips = derived(
  [dataStore, shipFilters, shipSort],
  ([$data, $filters, $sort]) => {
    let ships = [...$data.ships];

    // Apply filters
    if ($filters.class) {
      ships = ships.filter(s => s.shipClass === $filters.class);
    }
    if ($filters.tier) {
      ships = ships.filter(s => s.tier === parseInt($filters.tier, 10));
    }
    if ($filters.role) {
      ships = ships.filter(s => s.pvpRole === $filters.role);
    }
    if ($filters.search) {
      const search = $filters.search.toLowerCase();
      ships = ships.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.subtype.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    ships.sort((a, b) => {
      const aVal = a[$sort.field as keyof Ship];
      const bVal = b[$sort.field as keyof Ship];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return $sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return $sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return ships;
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

// Filtered weapons derived store
export const filteredWeapons = derived(
  [dataStore, weaponFilters, weaponSort],
  ([$data, $filters, $sort]) => {
    let weapons = [...$data.weapons];

    // Apply filters
    if ($filters.category) {
      weapons = weapons.filter(w => w.category === $filters.category);
    }
    if ($filters.size) {
      weapons = weapons.filter(w => w.sizeClass === $filters.size);
    }
    if ($filters.tier) {
      weapons = weapons.filter(w => w.tier === parseInt($filters.tier, 10));
    }
    if ($filters.search) {
      const search = $filters.search.toLowerCase();
      weapons = weapons.filter(w =>
        w.name.toLowerCase().includes(search) ||
        w.class.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    weapons.sort((a, b) => {
      const aVal = a[$sort.field as keyof Weapon];
      const bVal = b[$sort.field as keyof Weapon];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return $sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return $sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return weapons;
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

// Filtered crews derived store
export const filteredCrews = derived(
  [dataStore, crewFilters, crewSort],
  ([$data, $filters, $sort]) => {
    let crews = [...$data.crews];

    // Apply filters
    if ($filters.type) {
      crews = crews.filter(c => c.type === $filters.type);
    }
    if ($filters.options) {
      crews = crews.filter(c => c.options === $filters.options);
    }
    if ($filters.pvpOnly) {
      crews = crews.filter(c => c.pvpRelevant);
    }
    if ($filters.search) {
      const search = $filters.search.toLowerCase();
      crews = crews.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.effect.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    crews.sort((a, b) => {
      const aVal = a[$sort.field as keyof CrewUnit];
      const bVal = b[$sort.field as keyof CrewUnit];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return $sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return $sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    return crews;
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

// Comparison ships derived store
export const comparisonShips = derived(
  [dataStore, comparisonShipIds],
  ([$data, $ids]) => $ids.map(id => $data.ships.find(s => s.id === id)).filter(Boolean) as Ship[]
);
