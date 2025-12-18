# CLAUDE.md

Development instructions for Claude Code when working with Captain's Cove.

## Project Overview

**Captain's Cove** - A Svelte 5 analysis tool for World of Sea Battle PvP. Features ship comparison, weapon analysis, build planning, and balance insights with Supabase backend.

## Tech Stack

- **Svelte 5.43.8** - Uses runes (`$state`, `$derived`, `$effect`)
- **TypeScript 5.9.3** - Strict mode enabled
- **Vite 7.2.4** - Build tool and dev server
- **svelte-spa-router 4.0.1** - Hash-based routing
- **@supabase/supabase-js** - PostgreSQL backend

## Commands

```bash
npm run dev      # Development server (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run check    # Svelte type checking
npm run lint     # ESLint
npm run seed     # Seed Supabase database (requires SUPABASE_SERVICE_KEY)
```

## Environment Variables

```bash
VITE_SUPABASE_URL        # Supabase project URL
VITE_SUPABASE_ANON_KEY   # Public anon key (client)
SUPABASE_SERVICE_KEY     # Service role key (seeding only, never commit)
```

## Project Structure

```
src/
├── routes/                 # Page components
│   ├── +page.svelte       # Home page
│   ├── ships/+page.svelte
│   ├── weapons/+page.svelte
│   ├── crew/+page.svelte
│   ├── builds/            # Build management
│   └── balance/+page.svelte
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── database.types.ts  # Generated DB types
│   ├── data/
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── loader.ts      # Supabase data fetching
│   ├── stores/
│   │   ├── index.ts       # Main data store
│   │   ├── filters.ts     # Filter state per view
│   │   ├── ui.ts          # UI state (modals, toasts)
│   │   └── builds.ts      # Build CRUD
│   └── components/
│       ├── ui/            # Button, Card, Modal, Tabs, etc.
│       ├── ships/         # ShipCard, ShipDetailModal
│       ├── weapons/       # WeaponCard
│       ├── builds/        # BuildCard, BuildEditor
│       └── balance/       # ArchetypeAnalysis, TTKMatrix
└── App.svelte
supabase/
├── schema.sql             # Full schema reference
└── migrations/            # Migration files
scripts/
└── seed-supabase.js       # Database seeder
```

## Key Type Interfaces

**Ship** (id is `number`, not string):
- `id: number` - Integer primary key
- `health`, `speed`, `armor`, `capacity`
- `shipClass` (not class - reserved keyword)
- `crewSlots`, `cost`
- `type`, `fraction`, `coolness`, `pvpRole`

**Weapon**:
- `id: string`
- `category`: 'Cannon' | 'Carronade' | 'Culverin' | 'Mortar' | 'Bombard'
- `sizeClass`: 'Light' | 'Medium' | 'Heavy'
- `distance`, `penetration`, `cooldown`, `angle`, `scatter`

**Ammo**:
- `damageFactor` (not damageModifier)
- `sailDamage`, `crewDamage`, `reloadFactor`, `distanceFactor`

## Database Column Mapping

Supabase uses snake_case, TypeScript uses camelCase:
- `ship_class` → `shipClass`
- `crew_slots` → `crewSlots`
- `damage_factor` → `damageFactor`

## Store Patterns

### Data Store (`$lib/stores/index.ts`)
```typescript
import { dataStore, shipsByTier, shipsMap } from '$lib/stores';

const ships = $dataStore.ships;  // Ship[]
$shipsByTier  // Record<number, Ship[]>
$shipsMap.get(123)  // Ship by id (number key)
```

### Filter Stores
```typescript
import { shipFilters } from '$lib/stores/filters';
shipFilters.update(f => ({ ...f, tier: '1' }));
```

### Builds Store
```typescript
import { buildsStore } from '$lib/stores/builds';
buildsStore.create({ name, archetype, shipId, ... });
buildsStore.update(id, { name: 'New Name' });
buildsStore.delete(id);
```

## Routing

Hash-based via svelte-spa-router:
- `/`, `/ships`, `/weapons`, `/crew`, `/builds`, `/balance`
- `/builds/new`, `/builds/:id`, `/builds/:id/edit`

## Svelte 5 Patterns

```svelte
<script lang="ts">
  let count = $state(0);
  const doubled = $derived(count * 2);
  $effect(() => console.log('Count:', count));

  interface Props { value: number; onchange?: (v: number) => void; }
  let { value, onchange }: Props = $props();
</script>
```

## Combat Mechanics

- **Armor**: 0-11.5 scale
- **Penetration**: Cannons 13-17, Carronades 20-32.5, Mortars 100-305
- **Effectiveness**: `max(10%, (pen - armor) / pen)`
- **Mortars**: Bypass armor (pen >= 50)

## Common Gotchas

1. **Ship.id is number** - Use `shipsMap.get(123)` not `shipsMap.get('123')`
2. **Map lookups** - Use `.get()` not brackets
3. **Reserved words** - Ship uses `shipClass` not `class`
4. **snake_case → camelCase** - DB columns transformed in loader.ts
