# Captain's Cove Stores

## Data Store (`$lib/stores/index.ts`)
Data fetched from Supabase via `loader.ts`, transformed from snake_case to camelCase.

```typescript
export const dataStore: Writable<GameData>;

// Derived stores
export const shipsByTier: Readable<Record<number, Ship[]>>;
export const shipsByClass: Readable<Record<ShipClass, Ship[]>>;
export const weaponsByCategory: Readable<Record<WeaponCategory, Weapon[]>>;
export const shipsMap: Readable<Map<number, Ship>>;  // key is number now
export const weaponsMap: Readable<Map<string, Weapon>>;
export const ammoMap: Readable<Map<string, Ammo>>;
```

**Usage:**
```svelte
<script>
  import { dataStore, shipsMap } from '$lib/stores';
  const ship = $shipsMap.get(id);  // Use .get() not brackets
</script>
```

## Data Loading (`$lib/data/loader.ts`)
```typescript
// Fetches from Supabase tables
async function loadShips(): Promise<Ship[]>;
async function loadWeapons(): Promise<Weapon[]>;
async function loadAmmo(): Promise<Ammo[]>;
// etc.

export async function loadAllData(): Promise<GameData>;
```

## Filter Stores (`$lib/stores/filters.ts`)
```typescript
export const shipFilters: Writable<{ tier: string; shipClass: string; search: string }>;
export const weaponFilters: Writable<{ category: string; tier: string; search: string }>;
export const buildFilters: Writable<{ archetype: string; tier: string; search: string }>;
```

## Builds Store (`$lib/stores/builds.ts`)
Builds stored in Supabase `builds` table with localStorage fallback.

```typescript
export const buildsStore = {
  create(data): Build,
  update(id, updates): Build | null,
  delete(id): boolean,
  get(id): Build | undefined,
  duplicate(id): Build | null,
  import(json): { imported: number; errors: string[] },
  export(ids?): string,
};

export const filteredBuilds: Readable<Build[]>;
export const buildCount: Readable<number>;
```

## UI Store (`$lib/stores/ui.ts`)
```typescript
export const uiStore = {
  modal: Writable<ModalState>,
  toasts: Writable<Toast[]>,
  theme: Writable<'dark' | 'light'>,
  selectedShipId: Writable<number | null>,  // number now
};
```
