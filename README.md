# Captain's Cove

A modern analysis tool for World of Sea Battle PvP, built with Svelte 5 and TypeScript.

## Features

- **Ship Browser** - Compare 71 ships with filtering by tier, class, and stats
- **Weapon Analysis** - 42 weapons with penetration, range, and damage data
- **Build Planner** - Create, save, and share builds with localStorage persistence
- **Balance Analysis** - Archetype scoring, TTK matrix, and meta insights
- **Crew Management** - Sailor and boarding party information
- **Dark Nautical Theme** - Immersive pirate-era aesthetic

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- [Svelte 5](https://svelte.dev/) - UI framework with runes
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router) - Client-side routing

## Project Structure

```
src/
├── routes/          # Page components
├── lib/
│   ├── data/        # Game data (CSV/JSON) and types
│   ├── stores/      # Svelte stores for state
│   └── components/  # Reusable UI components
└── App.svelte       # Root component with router
```

## Data Sources

Game data is sourced from datamined JSON files (December 2024):
- `ShipsToPlay.json` - 71 ships with stats
- `Cannons.json` - 42 weapons
- `CannonBalls.json` - 9 ammo types
- `ShipUpgradesNew.json` - 37 upgrades
- `CaptainSkills.json` - 48 captain skills

## Build System

Builds are stored in browser localStorage with:
- Create, edit, duplicate, delete operations
- Import/export as JSON
- Filtering by archetype, tier, and search
- 6 archetypes: Brawler, Kite, Sniper, Pursuit, Trade, Siege

## Combat Mechanics

Based on datamined formulas:
- Armor scale: 0-11.5
- Damage effectiveness: `max(10%, (penetration - armor) / penetration)`
- Mortars bypass armor (penetration 100-305)

## License

MIT
