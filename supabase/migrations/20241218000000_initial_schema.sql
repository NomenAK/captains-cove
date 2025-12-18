-- Captain's Cove Database Schema
-- Run this in Supabase SQL Editor

-- ═══════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════

CREATE TYPE ship_type AS ENUM ('Destroyer', 'Battleship', 'Hardship', 'CargoShip', 'Mortar');
CREATE TYPE ship_class AS ENUM ('Combat', 'Fast', 'Heavy', 'Transport', 'Siege', 'Imperial');
CREATE TYPE fraction AS ENUM ('None', 'Antilia', 'Empire', 'Espaniol', 'KaiAndSeveria', 'Scandinavia', 'Pirates');
CREATE TYPE coolness AS ENUM ('Default', 'Unique', 'Elite', 'Rare');
CREATE TYPE weapon_category AS ENUM ('Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar');
CREATE TYPE weapon_size AS ENUM ('Light', 'Medium', 'Heavy');
CREATE TYPE crafting_type AS ENUM ('ByGold', 'ByCraft', 'NotAvailable');
CREATE TYPE crew_type AS ENUM ('Sailor', 'Boarding', 'Special');
CREATE TYPE crew_options AS ENUM ('All', 'Combats', 'Sailors', 'Pirates', 'Adventurers');
CREATE TYPE skill_category AS ENUM ('economy', 'logistics', 'combat', 'legend');
CREATE TYPE upgrade_category AS ENUM ('Support', 'Protection', 'Combat');
CREATE TYPE cosmetic_type AS ENUM ('design', 'sail', 'flag', 'guild', 'private');
CREATE TYPE resource_category AS ENUM ('trade', 'food', 'material', 'special');
CREATE TYPE archetype AS ENUM ('brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege');

-- ═══════════════════════════════════════════════════
-- SHIPS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE ships (
  id INTEGER PRIMARY KEY,
  static_info_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  health INTEGER NOT NULL,
  speed NUMERIC(5,2) NOT NULL,
  mobility NUMERIC(5,2) NOT NULL,
  armor NUMERIC(5,2) NOT NULL,
  capacity INTEGER NOT NULL,
  crew_slots INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  tier INTEGER NOT NULL,
  type ship_type NOT NULL,
  ship_class ship_class NOT NULL,
  subtype TEXT,
  fraction fraction NOT NULL DEFAULT 'None',
  cost INTEGER NOT NULL DEFAULT 0,
  coolness coolness NOT NULL DEFAULT 'Default',
  required_rank INTEGER NOT NULL DEFAULT 0,
  upgrade_slots INTEGER NOT NULL DEFAULT 0,
  is_playable BOOLEAN NOT NULL DEFAULT true,
  pvp_role TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ships_tier ON ships(tier);
CREATE INDEX idx_ships_class ON ships(ship_class);
CREATE INDEX idx_ships_type ON ships(type);

-- ═══════════════════════════════════════════════════
-- WEAPONS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE weapons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  category weapon_category NOT NULL,
  size_class weapon_size NOT NULL,
  distance INTEGER NOT NULL,
  penetration NUMERIC(6,2) NOT NULL,
  cooldown NUMERIC(6,2) NOT NULL,
  angle NUMERIC(6,2) NOT NULL DEFAULT 0,
  scatter NUMERIC(6,2) NOT NULL DEFAULT 0,
  speed_factor NUMERIC(4,2) NOT NULL DEFAULT 1,
  price INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  model TEXT,
  crafting_type crafting_type NOT NULL DEFAULT 'ByGold',
  tier INTEGER NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_weapons_category ON weapons(category);
CREATE INDEX idx_weapons_tier ON weapons(tier);

-- ═══════════════════════════════════════════════════
-- AMMO TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE ammo (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  speed NUMERIC(6,2) NOT NULL DEFAULT 0,
  penetration NUMERIC(6,2) NOT NULL DEFAULT 0,
  damage_factor NUMERIC(4,2) NOT NULL DEFAULT 1,
  sail_damage NUMERIC(4,2) NOT NULL DEFAULT 0,
  crew_damage NUMERIC(4,2) NOT NULL DEFAULT 0,
  min_damage NUMERIC(4,2) NOT NULL DEFAULT 0,
  effects TEXT,
  mass NUMERIC(6,2) NOT NULL DEFAULT 0,
  radius NUMERIC(6,2) NOT NULL DEFAULT 0,
  reload_factor NUMERIC(4,2) NOT NULL DEFAULT 1,
  distance_factor NUMERIC(4,2) NOT NULL DEFAULT 1,
  icon TEXT,
  cost INTEGER NOT NULL DEFAULT 0,
  is_rare BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- POWDER KEGS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE kegs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mass NUMERIC(6,2) NOT NULL DEFAULT 0,
  damage INTEGER NOT NULL DEFAULT 0,
  trigger_radius NUMERIC(6,2) NOT NULL DEFAULT 0,
  damage_radius NUMERIC(6,2) NOT NULL DEFAULT 0,
  count INTEGER NOT NULL DEFAULT 1,
  reload NUMERIC(6,2) NOT NULL DEFAULT 0,
  crew_usage INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  cost_gold INTEGER NOT NULL DEFAULT 0,
  cost_skulls INTEGER NOT NULL DEFAULT 0,
  cost_marks INTEGER NOT NULL DEFAULT 0,
  is_rare BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- CREW UNITS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE crews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type crew_type NOT NULL,
  damage INTEGER NOT NULL DEFAULT 0,
  health INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 0,
  cost INTEGER NOT NULL DEFAULT 0,
  cost_marks INTEGER NOT NULL DEFAULT 0,
  options crew_options NOT NULL DEFAULT 'All',
  effect TEXT,
  effect_per_sailor TEXT,
  effect_per_boarding TEXT,
  icon TEXT,
  pvp_relevant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_crews_type ON crews(type);
CREATE INDEX idx_crews_pvp ON crews(pvp_relevant);

-- ═══════════════════════════════════════════════════
-- CAPTAIN SKILLS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cost_points INTEGER NOT NULL DEFAULT 0,
  cost TEXT,
  effect TEXT,
  category skill_category NOT NULL DEFAULT 'economy',
  position TEXT,
  radial_position TEXT,
  depends_on TEXT,
  required_achievements TEXT,
  required_ships TEXT,
  required_rank TEXT,
  icon TEXT,
  pvp_relevant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_pvp ON skills(pvp_relevant);

-- ═══════════════════════════════════════════════════
-- UPGRADES TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE upgrades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
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

CREATE INDEX idx_upgrades_category ON upgrades(category);

-- ═══════════════════════════════════════════════════
-- COSMETICS TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE cosmetics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_key TEXT,
  type cosmetic_type NOT NULL DEFAULT 'design',
  icon TEXT,
  in_shop BOOLEAN NOT NULL DEFAULT false,
  tier_required INTEGER,
  gold_cost INTEGER,
  bonus TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cosmetics_type ON cosmetics(type);

-- ═══════════════════════════════════════════════════
-- RESOURCES TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category resource_category NOT NULL DEFAULT 'material',
  medium_cost INTEGER NOT NULL DEFAULT 0,
  mass NUMERIC(6,2) NOT NULL DEFAULT 0,
  icon TEXT,
  effects TEXT,
  is_food BOOLEAN NOT NULL DEFAULT false,
  is_tradeable BOOLEAN NOT NULL DEFAULT false,
  corruption NUMERIC(4,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_resources_category ON resources(category);

-- ═══════════════════════════════════════════════════
-- LOCALIZATION TABLE
-- ═══════════════════════════════════════════════════

CREATE TABLE localization (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_localization_language ON localization(language);

-- ═══════════════════════════════════════════════════
-- BUILDS TABLE (User-created)
-- ═══════════════════════════════════════════════════

CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  archetype archetype NOT NULL DEFAULT 'brawler',
  tier INTEGER NOT NULL DEFAULT 4,
  ship_id INTEGER REFERENCES ships(id),
  weapons JSONB NOT NULL DEFAULT '{}',
  ammo JSONB NOT NULL DEFAULT '{}',
  upgrades TEXT[] NOT NULL DEFAULT '{}',
  strategy TEXT,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  estimated_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_builds_archetype ON builds(archetype);
CREATE INDEX idx_builds_tier ON builds(tier);

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY (Public read access)
-- ═══════════════════════════════════════════════════

ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE localization ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

-- Public read access for game data
CREATE POLICY "Public read access" ON ships FOR SELECT USING (true);
CREATE POLICY "Public read access" ON weapons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ammo FOR SELECT USING (true);
CREATE POLICY "Public read access" ON kegs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON crews FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON upgrades FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cosmetics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON resources FOR SELECT USING (true);
CREATE POLICY "Public read access" ON localization FOR SELECT USING (true);
CREATE POLICY "Public read access" ON builds FOR SELECT USING (true);

-- Public insert/update for builds (anonymous users can create builds)
CREATE POLICY "Public insert access" ON builds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON builds FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON builds FOR DELETE USING (true);
