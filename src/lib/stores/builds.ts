/* Captain's Cove - Builds Store */
/* Manages user builds with localStorage persistence */

import { writable, derived, get } from 'svelte/store';
import type { Build, Archetype } from '$lib/data/types';
import { buildFilters, buildSort } from './filters';

// ═══════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════

const STORAGE_KEY = 'captains-cove-builds';
const STORAGE_VERSION = 2; // v2: shipId changed from string to number | null

interface StoredBuilds {
  version: number;
  builds: Build[];
  exportedAt?: number;
}

// ═══════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════

/**
 * Migrate builds from older storage versions
 * - v1 -> v2: shipId changed from string to number | null
 */
function migrateBuilds(builds: unknown[]): Build[] {
  return builds.map(build => {
    const b = build as Record<string, unknown>;
    // Migrate string shipId to number | null
    if (typeof b.shipId === 'string') {
      const numericId = b.shipId === '' ? null : Number(b.shipId);
      // Handle NaN from invalid string conversion
      b.shipId = Number.isNaN(numericId) ? null : numericId;
    }
    return b as unknown as Build;
  });
}

function loadFromStorage(): Build[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: StoredBuilds = JSON.parse(stored);

    // Handle version mismatch with migration
    if (data.version !== STORAGE_VERSION) {
      if (import.meta.env.DEV) {
        console.info('Migrating builds from version', data.version, 'to', STORAGE_VERSION);
      }
      const migrated = migrateBuilds(data.builds);
      saveToStorage(migrated);
      return migrated;
    }

    return data.builds;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Failed to load builds from storage:', err);
    }
    return [];
  }
}

function saveToStorage(builds: Build[]): void {
  try {
    const data: StoredBuilds = {
      version: STORAGE_VERSION,
      builds
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Failed to save builds to storage:', err);
    }
  }
}

// ═══════════════════════════════════════════════════
// ID GENERATION
// ═══════════════════════════════════════════════════

function generateBuildId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `build_${timestamp}_${random}`;
}

// ═══════════════════════════════════════════════════
// BUILDS STORE
// ═══════════════════════════════════════════════════

function createBuildsStore() {
  const { subscribe, set, update } = writable<Build[]>(loadFromStorage());

  // Auto-save on changes
  let saveTimeout: ReturnType<typeof setTimeout>;
  subscribe(builds => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveToStorage(builds), 100);
  });

  return {
    subscribe,

    // Create a new build
    create(buildData: Omit<Build, 'id' | 'createdAt' | 'updatedAt'>): Build {
      const now = Date.now();
      const build: Build = {
        ...buildData,
        id: generateBuildId(),
        createdAt: now,
        updatedAt: now
      };

      update(builds => [...builds, build]);
      return build;
    },

    // Update an existing build
    update(id: string, updates: Partial<Build>): Build | null {
      let updatedBuild: Build | null = null;

      update(builds => {
        return builds.map(build => {
          if (build.id === id) {
            updatedBuild = {
              ...build,
              ...updates,
              id, // Ensure ID isn't changed
              updatedAt: Date.now()
            };
            return updatedBuild;
          }
          return build;
        });
      });

      return updatedBuild;
    },

    // Delete a build
    delete(id: string): boolean {
      let deleted = false;

      update(builds => {
        const filtered = builds.filter(b => b.id !== id);
        deleted = filtered.length < builds.length;
        return filtered;
      });

      return deleted;
    },

    // Get a single build
    get(id: string): Build | undefined {
      const builds = get({ subscribe });
      return builds.find(b => b.id === id);
    },

    // Duplicate a build
    duplicate(id: string): Build | null {
      const builds = get({ subscribe });
      const original = builds.find(b => b.id === id);
      if (!original) return null;

      const now = Date.now();
      const duplicate: Build = {
        ...original,
        id: generateBuildId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now
      };

      update(builds => [...builds, duplicate]);
      return duplicate;
    },

    // Import builds from JSON
    import(json: string): { imported: number; errors: string[] } {
      const errors: string[] = [];
      let imported = 0;

      try {
        const data: StoredBuilds = JSON.parse(json);

        if (!data.builds || !Array.isArray(data.builds)) {
          errors.push('Invalid build data format');
          return { imported, errors };
        }

        const newBuilds: Build[] = [];
        const now = Date.now();

        for (const build of data.builds) {
          if (!validateBuild(build)) {
            errors.push(`Invalid build: ${(build as { name?: string }).name || 'Unknown'}`);
            continue;
          }

          // Generate new ID to avoid conflicts
          newBuilds.push({
            ...build,
            id: generateBuildId(),
            createdAt: build.createdAt || now,
            updatedAt: now
          });
          imported++;
        }

        if (newBuilds.length > 0) {
          update(builds => [...builds, ...newBuilds]);
        }
      } catch (err) {
        errors.push(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      return { imported, errors };
    },

    // Export builds to JSON
    export(ids?: string[]): string {
      const builds = get({ subscribe });
      const toExport = ids
        ? builds.filter(b => ids.includes(b.id))
        : builds;

      const data: StoredBuilds = {
        version: STORAGE_VERSION,
        builds: toExport,
        exportedAt: Date.now()
      };

      return JSON.stringify(data, null, 2);
    },

    // Clear all builds
    clear(): void {
      set([]);
    },

    // Reset to initial state
    reset(): void {
      set(loadFromStorage());
    }
  };
}

// ═══════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════

function validateBuild(build: unknown): build is Build {
  if (!build || typeof build !== 'object') return false;

  const b = build as Record<string, unknown>;

  // Required string fields
  if (typeof b.name !== 'string' || b.name.trim() === '') return false;
  if (typeof b.archetype !== 'string') return false;
  if (typeof b.strategy !== 'string') return false;

  // Required number fields
  if (typeof b.tier !== 'number' || b.tier < 1 || b.tier > 7) return false;
  // estimatedScore must be a number or undefined (optional field)
  if (b.estimatedScore !== undefined && typeof b.estimatedScore !== 'number') return false;

  // shipId: number | null (also accept string for migration compatibility)
  if (b.shipId !== null && typeof b.shipId !== 'number' && typeof b.shipId !== 'string') return false;

  // Validate archetype is valid
  const validArchetypes = ['brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege'];
  if (!validArchetypes.includes(b.archetype as string)) return false;

  // Weapons object validation
  if (!b.weapons || typeof b.weapons !== 'object') return false;

  // Array validations
  if (!Array.isArray(b.upgrades)) return false;
  if (!Array.isArray(b.strengths)) return false;
  if (!Array.isArray(b.weaknesses)) return false;

  return true;
}

export const buildsStore = createBuildsStore();

// ═══════════════════════════════════════════════════
// DERIVED STORES
// ═══════════════════════════════════════════════════

// Filtered and sorted builds
export const filteredBuilds = derived(
  [buildsStore, buildFilters, buildSort],
  ([$builds, $filters, $sort]) => {
    let builds = [...$builds];

    // Apply filters
    if ($filters.archetype) {
      builds = builds.filter(b => b.archetype === $filters.archetype);
    }
    if ($filters.tier) {
      builds = builds.filter(b => b.tier === parseInt($filters.tier, 10));
    }
    if ($filters.search) {
      const search = $filters.search.toLowerCase();
      builds = builds.filter(b =>
        b.name.toLowerCase().includes(search) ||
        b.strategy.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    builds.sort((a, b) => {
      const aVal = a[$sort.field as keyof Build];
      const bVal = b[$sort.field as keyof Build];

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

    return builds;
  }
);

// Builds grouped by archetype
export const buildsByArchetype = derived(
  buildsStore,
  $builds => {
    const grouped: Record<Archetype, Build[]> = {
      brawler: [],
      kite: [],
      sniper: [],
      pursuit: [],
      trade: [],
      siege: []
    };

    for (const build of $builds) {
      if (grouped[build.archetype]) {
        grouped[build.archetype].push(build);
      }
    }

    return grouped;
  }
);

// Build count
export const buildCount = derived(
  buildsStore,
  $builds => $builds.length
);

// ═══════════════════════════════════════════════════
// BUILD TEMPLATES
// ═══════════════════════════════════════════════════

export function createEmptyBuild(archetype: Archetype = 'brawler'): Omit<Build, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: 'New Build',
    archetype,
    tier: 4,
    shipId: null,
    weapons: {},
    ammo: {},
    upgrades: [],
    consumables: [],
    strategy: '',
    strengths: [],
    weaknesses: [],
    estimatedScore: 0
  };
}
