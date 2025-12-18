/* Captain's Cove - Data Store */
/* Manages game data state with loading and caching */

import { writable, derived, type Readable } from 'svelte/store';
import type {
  Ship,
  Weapon,
  Ammo,
  PowderKeg,
  CrewUnit,
  CaptainSkill,
  Upgrade,
  Cosmetic,
  Resource,
  Localization,
  AppData,
  ShipClass
} from '$lib/data/types';
import { SHIP_TYPE_TO_CLASS } from '$lib/data/types';
import { loadAllData, getStatBounds } from '$lib/data/loader';

// ═══════════════════════════════════════════════════
// STATE TYPES
// ═══════════════════════════════════════════════════

interface DataState {
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
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// ═══════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════

const initialState: DataState = {
  ships: [],
  weapons: [],
  ammo: [],
  kegs: [],
  crews: [],
  skills: [],
  upgrades: [],
  cosmetics: [],
  resources: [],
  localization: {},
  isLoading: false,
  error: null,
  lastUpdated: null
};

// ═══════════════════════════════════════════════════
// MAIN STORE
// ═══════════════════════════════════════════════════

function createDataStore() {
  const { subscribe, set, update } = writable<DataState>(initialState);

  return {
    subscribe,

    async load() {
      update(state => ({ ...state, isLoading: true, error: null }));

      try {
        const data = await loadAllData();
        update(state => ({
          ...state,
          ships: data.ships,
          weapons: data.weapons,
          ammo: data.ammo,
          kegs: data.kegs,
          crews: data.crews,
          skills: data.skills,
          upgrades: data.upgrades,
          cosmetics: data.cosmetics,
          resources: data.resources,
          localization: data.localization,
          isLoading: false,
          lastUpdated: Date.now()
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        update(state => ({
          ...state,
          isLoading: false,
          error: message
        }));
        throw err;
      }
    },

    reset() {
      set(initialState);
    }
  };
}

export const dataStore = createDataStore();

// ═══════════════════════════════════════════════════
// DERIVED STORES
// ═══════════════════════════════════════════════════

// Ships by class (computed from type)
export const shipsByClass: Readable<Record<ShipClass, Ship[]>> = derived(
  dataStore,
  $data => {
    const grouped: Record<ShipClass, Ship[]> = {
      'Combat': [],
      'Fast': [],
      'Heavy': [],
      'Transport': [],
      'Siege': [],
      'Imperial': []
    };

    for (const ship of $data.ships) {
      const shipClass = SHIP_TYPE_TO_CLASS[ship.type];
      if (shipClass && grouped[shipClass]) {
        grouped[shipClass].push(ship);
      }
    }

    return grouped;
  }
);

// Ships by tier
export const shipsByTier: Readable<Record<number, Ship[]>> = derived(
  dataStore,
  $data => {
    const grouped: Record<number, Ship[]> = {};

    for (const ship of $data.ships) {
      if (!grouped[ship.tier]) {
        grouped[ship.tier] = [];
      }
      grouped[ship.tier].push(ship);
    }

    return grouped;
  }
);

// Stat bounds for normalization
export const statBounds: Readable<Record<string, { min: number; max: number }>> = derived(
  dataStore,
  $data => {
    if ($data.ships.length === 0) {
      return {};
    }
    return getStatBounds($data.ships);
  }
);

// PvP-relevant crews only
export const pvpCrews: Readable<CrewUnit[]> = derived(
  dataStore,
  $data => $data.crews.filter(crew => crew.pvpRelevant)
);

// PvP-relevant skills only
export const pvpSkills: Readable<CaptainSkill[]> = derived(
  dataStore,
  $data => $data.skills.filter(skill => skill.pvpRelevant)
);

// Combat skills
export const combatSkills: Readable<CaptainSkill[]> = derived(
  dataStore,
  $data => $data.skills.filter(skill => skill.category === 'combat')
);

// Weapons by category
export const weaponsByCategory: Readable<Record<string, Weapon[]>> = derived(
  dataStore,
  $data => {
    const grouped: Record<string, Weapon[]> = {};

    for (const weapon of $data.weapons) {
      if (!grouped[weapon.category]) {
        grouped[weapon.category] = [];
      }
      grouped[weapon.category].push(weapon);
    }

    return grouped;
  }
);

// Loading state shorthand
export const isLoading: Readable<boolean> = derived(
  dataStore,
  $data => $data.isLoading
);

// Error state shorthand
export const dataError: Readable<string | null> = derived(
  dataStore,
  $data => $data.error
);

// ═══════════════════════════════════════════════════
// LOOKUP HELPERS
// ═══════════════════════════════════════════════════

export function createShipLookup(ships: Ship[]): Map<number, Ship> {
  return new Map(ships.map(s => [s.id, s]));
}

export function createWeaponLookup(weapons: Weapon[]): Map<string, Weapon> {
  return new Map(weapons.map(w => [w.id, w]));
}

export function createAmmoLookup(ammo: Ammo[]): Map<string, Ammo> {
  return new Map(ammo.map(a => [a.id, a]));
}
