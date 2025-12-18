-- Migration: Create all enum types
-- Captain's Cove Database Migration - Phase 2: Enums

-- ═══════════════════════════════════════════════════
-- SHIP ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE ship_type AS ENUM (
  'Destroyer',
  'Battleship',
  'Hardship',
  'CargoShip',
  'Mortar'
);

CREATE TYPE ship_class AS ENUM (
  'Combat',
  'Fast',
  'Heavy',
  'Transport',
  'Siege',
  'Imperial'
);

-- Enhanced rarity (replaces coolness) - includes all values from source data
CREATE TYPE rarity AS ENUM (
  'Default',
  'Unique',
  'Elite',
  'Rare',
  'Empire',
  'SailageLegend'
);

-- Enhanced faction enum - includes TradeUnion and Pirate from guilds data
CREATE TYPE faction AS ENUM (
  'None',
  'Antilia',
  'Empire',
  'Espaniol',
  'KaiAndSeveria',
  'Scandinavia',
  'Pirates',
  'TradeUnion',
  'Pirate'
);

-- ═══════════════════════════════════════════════════
-- WEAPON ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE weapon_category AS ENUM (
  'Cannon',
  'Culverin',
  'Carronade',
  'Bombard',
  'Mortar'
);

CREATE TYPE weapon_size AS ENUM (
  'Light',
  'Medium',
  'Heavy'
);

CREATE TYPE crafting_type AS ENUM (
  'ByGold',
  'ByCraft',
  'NotAvailable',
  'ByMarks',
  'ByResources'
);

-- ═══════════════════════════════════════════════════
-- CREW ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE crew_type AS ENUM (
  'Sailor',
  'Boarding',
  'Special'
);

CREATE TYPE crew_options AS ENUM (
  'All',
  'Combats',
  'Sailors',
  'Pirates',
  'Adventurers',
  'BoardingOnly',
  'SailorOnly'
);

CREATE TYPE skill_category AS ENUM (
  'economy',
  'logistics',
  'combat',
  'legend'
);

-- ═══════════════════════════════════════════════════
-- EQUIPMENT ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE upgrade_category AS ENUM (
  'Support',
  'Protection',
  'Combat',
  'Speed'
);

CREATE TYPE cosmetic_type AS ENUM (
  'design',
  'sail',
  'flag',
  'guild',
  'private'
);

CREATE TYPE resource_category AS ENUM (
  'trade',
  'food',
  'material',
  'special'
);

CREATE TYPE consumable_category AS ENUM (
  'mending',
  'equipment',
  'group'
);

-- ═══════════════════════════════════════════════════
-- WORLD ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE port_type AS ENUM (
  'PirateBay',
  'NeutralBay',
  'Bay',
  'City'
);

CREATE TYPE achievement_category AS ENUM (
  'Battle',
  'Arena',
  'Top',
  'Collection',
  'Trade'
);

CREATE TYPE guild_place AS ENUM (
  'Gold',
  'Silver',
  'Bronze',
  'Copper'
);

-- ═══════════════════════════════════════════════════
-- BUILD ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE archetype AS ENUM (
  'brawler',
  'kite',
  'sniper',
  'pursuit',
  'trade',
  'siege'
);
