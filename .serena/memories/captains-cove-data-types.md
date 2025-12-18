# Captain's Cove Data Types

## Database Column Mapping
Supabase uses snake_case, TypeScript uses camelCase:
- `ship_class` → `shipClass`
- `crew_slots` → `crewSlots`
- `static_info_id` → `staticInfoId`
- `damage_factor` → `damageFactor`

## Ship
```typescript
interface Ship {
  id: number;           // INTEGER (was string)
  name: string;
  shipClass: ShipClass; // NOT 'class'
  tier: number;         // 1-7
  health: number;       // NOT 'hp'
  speed: number;
  armor: number;
  capacity: number;     // NOT 'cargo'
  crewSlots: number;
  cost: number;         // NOT 'price'
  type: ShipType;
  fraction: Fraction;
  coolness: Coolness;
  pvpRole: string;
}
type ShipType = 'Destroyer' | 'Battleship' | 'Hardship' | 'CargoShip' | 'Mortar';
type ShipClass = 'Combat' | 'Fast' | 'Heavy' | 'Transport' | 'Siege' | 'Imperial';
type Coolness = 'Default' | 'Unique' | 'Elite' | 'Rare';
```

## Weapon
```typescript
interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  sizeClass: WeaponSize;
  tier: number;
  distance: number;
  penetration: number;
  cooldown: number;
  angle: number;
  scatter: number;
  speedFactor: number;
}
type WeaponCategory = 'Cannon' | 'Carronade' | 'Culverin' | 'Mortar' | 'Bombard';
type WeaponSize = 'Light' | 'Medium' | 'Heavy';
```

## Ammo
```typescript
interface Ammo {
  id: string;
  name: string;
  speed: number;
  penetration: number;
  damageFactor: number;  // NOT 'damageModifier'
  sailDamage: number;
  crewDamage: number;
  reloadFactor: number;
  distanceFactor: number;
  isRare: boolean;
}
```

## Build
```typescript
interface Build {
  id: string;           // UUID
  name: string;
  archetype: Archetype;
  tier: number;
  shipId: number;       // References ships.id (number)
  weapons: object;      // JSONB
  ammo: object;         // JSONB
  upgrades: string[];
  strategy: string;
  strengths: string[];
  weaknesses: string[];
  estimatedScore: number;
}
type Archetype = 'brawler' | 'kite' | 'sniper' | 'pursuit' | 'trade' | 'siege';
```

## Combat Mechanics
- Armor: 0-11.5 scale
- Penetration: Cannons 13-17, Carronades 20-32.5, Mortars 100-305
- Effectiveness: `max(10%, (pen - armor) / pen)`
- Mortars bypass armor (pen >= 50)
