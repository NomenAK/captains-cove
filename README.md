# Captain's Cove

A modern analysis tool for World of Sea Battle PvP, built with Svelte 5, TypeScript, and Supabase.

## Features

- **Ship Browser** - Compare 71 ships with filtering by tier, class, and stats
- **Weapon Analysis** - 42 weapons with penetration, range, and damage data
- **Build Planner** - Create, save, and share builds
- **Balance Analysis** - Archetype scoring, TTK matrix, and meta insights
- **Crew Management** - Sailor and boarding party information
- **Dark Nautical Theme** - Immersive pirate-era aesthetic

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

```bash
VITE_SUPABASE_URL        # Supabase project URL
VITE_SUPABASE_ANON_KEY   # Public anon key
SUPABASE_SERVICE_KEY     # Service role key (seeding only)
```

## Tech Stack

- [Svelte 5](https://svelte.dev/) - UI framework with runes
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router) - Client-side routing
- [Supabase](https://supabase.com/) - PostgreSQL database

## Project Structure

```
src/
├── routes/          # Page components
├── lib/
│   ├── supabase.ts  # Supabase client
│   ├── data/        # Types and data loader
│   ├── stores/      # Svelte stores for state
│   └── components/  # Reusable UI components
└── App.svelte
supabase/
├── schema.sql       # Database schema
└── migrations/      # Migration files
```

## Database

Game data is stored in Supabase PostgreSQL:
- `ships` - 71 ships with stats
- `weapons` - 42 weapons
- `ammo` - 14 ammo types
- `kegs` - 6 powder kegs
- `crews` - 55 crew units
- `skills` - 53 captain skills
- `builds` - User-created builds

### Seeding

```bash
# Seed database from JSON files
SUPABASE_SERVICE_KEY=your-key npm run seed
```

## Combat Mechanics

Based on datamined formulas:
- Armor scale: 0-11.5
- Damage effectiveness: `max(10%, (penetration - armor) / penetration)`
- Mortars bypass armor (penetration >= 50)

## License

MIT
