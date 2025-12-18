# Captain's Cove Architecture

## Overview
Svelte 5 + TypeScript + Vite + Supabase analysis tool for World of Sea Battle PvP.

## Tech Stack
- Svelte 5.43.8 (runes: `$state`, `$derived`, `$effect`)
- TypeScript 5.9.3 (strict)
- Vite 7.2.4
- svelte-spa-router 4.0.1 (hash-based)
- @supabase/supabase-js (PostgreSQL backend)

## Key Directories
```
src/routes/           # Pages (ships, weapons, crew, builds, balance)
src/lib/data/         # types.ts, loader.ts (Supabase fetching)
src/lib/stores/       # index.ts (data), filters.ts, ui.ts, builds.ts
src/lib/components/   # ui/, ships/, weapons/, builds/, balance/
src/lib/supabase.ts   # Supabase client
src/lib/database.types.ts  # Generated DB types
supabase/             # migrations/, schema.sql
scripts/              # seed-supabase.js
```

## Data Flow
```
Supabase PostgreSQL → loader.ts → dataStore → Components
                      (snake_case → camelCase transformation)
```

## Routing
Hash-based via svelte-spa-router:
- `/`, `/ships`, `/weapons`, `/crew`, `/builds`, `/balance`
- `/builds/new`, `/builds/:id`, `/builds/:id/edit`

## State Management
- `dataStore` - Game data from Supabase (ships, weapons, ammo, kegs, crews, skills)
- `shipFilters`, `weaponFilters`, `buildFilters` - View-specific filters
- `buildsStore` - CRUD with Supabase + localStorage fallback
- `uiStore` - Modals, toasts, theme

## Component Patterns
- Props via `$props()` interface
- Callbacks via `onchange` (not bind:)
- StatBar uses `variant` prop
- Tabs uses `id` property

## Environment Variables
```
VITE_SUPABASE_URL     # Supabase project URL
VITE_SUPABASE_ANON_KEY # Public anon key (client)
SUPABASE_SERVICE_KEY   # Service role key (seeding only)
```
