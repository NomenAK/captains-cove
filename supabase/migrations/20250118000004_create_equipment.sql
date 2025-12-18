-- Migration: Create equipment tables
-- Captain's Cove Database Migration - Phase 4: Equipment

-- ═══════════════════════════════════════════════════
-- SWIVEL AMMO TABLE (Falkonets - NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE swivel_ammo (
  id TEXT PRIMARY KEY,
  index INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  speed NUMERIC(8,2) NOT NULL DEFAULT 1,
  penetration NUMERIC(8,2) NOT NULL DEFAULT 0,
  damage_factor NUMERIC(8,2) NOT NULL DEFAULT 1,
  sail_damage NUMERIC(8,2) NOT NULL DEFAULT 0,
  crew_damage NUMERIC(8,2) NOT NULL DEFAULT 0,
  min_damage NUMERIC(8,2) NOT NULL DEFAULT 0,
  effects TEXT,
  mass NUMERIC(8,2) NOT NULL DEFAULT 1,
  radius NUMERIC(8,2) NOT NULL DEFAULT 1,
  reload_factor NUMERIC(8,2) NOT NULL DEFAULT 1,
  distance_factor NUMERIC(8,2) NOT NULL DEFAULT 1,
  icon TEXT,
  cost INTEGER NOT NULL DEFAULT 0,
  is_rare BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- UPGRADES TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE upgrades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  effects TEXT,
  icon TEXT,
  cost BOOLEAN NOT NULL DEFAULT false,
  strength BOOLEAN NOT NULL DEFAULT false,
  craft_resource TEXT,
  category upgrade_category NOT NULL DEFAULT 'Support',
  wear_type TEXT,
  parsed_effects JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- COSMETICS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE cosmetics (
  id SERIAL PRIMARY KEY,
  name_key TEXT NOT NULL,
  type cosmetic_type NOT NULL DEFAULT 'design',
  icon TEXT,
  in_shop TEXT,
  bonus TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- CONSUMABLES TABLE (PowerupItems - NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE consumables (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category consumable_category NOT NULL DEFAULT 'equipment',
  cooldown INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  effects JSONB NOT NULL DEFAULT '[]',
  crafting_gold INTEGER NOT NULL DEFAULT 0,
  crafting_resources JSONB NOT NULL DEFAULT '[]',
  allow_interrupt BOOLEAN,
  is_group_effect BOOLEAN NOT NULL DEFAULT false,
  group_range INTEGER,
  min_rank INTEGER,
  npc_can_use BOOLEAN NOT NULL DEFAULT false,
  hidden_from_craft BOOLEAN NOT NULL DEFAULT false,
  server_effect TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
