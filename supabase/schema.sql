-- Captain's Cove Database Schema (Reference)
-- Generated: 2025-01-18
-- Tables: 17 | Enums: 19 | Indexes: 30+

-- ═══════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════

-- Ship enums
CREATE TYPE ship_type AS ENUM ('Destroyer', 'Battleship', 'Hardship', 'CargoShip', 'Mortar');
CREATE TYPE ship_class AS ENUM ('Combat', 'Fast', 'Heavy', 'Transport', 'Siege', 'Imperial');
CREATE TYPE rarity AS ENUM ('Default', 'Unique', 'Elite', 'Rare', 'Empire', 'SailageLegend');
CREATE TYPE faction AS ENUM ('None', 'Antilia', 'Empire', 'Espaniol', 'KaiAndSeveria', 'Scandinavia', 'Pirates', 'TradeUnion', 'Pirate');

-- Weapon enums
CREATE TYPE weapon_category AS ENUM ('Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar');
CREATE TYPE weapon_size AS ENUM ('Light', 'Medium', 'Heavy');
CREATE TYPE crafting_type AS ENUM ('ByGold', 'ByCraft', 'NotAvailable', 'ByMarks', 'ByResources');

-- Crew enums
CREATE TYPE crew_type AS ENUM ('Sailor', 'Boarding', 'Special');
CREATE TYPE crew_options AS ENUM ('All', 'Combats', 'Sailors', 'Pirates', 'Adventurers', 'BoardingOnly', 'SailorOnly');
CREATE TYPE skill_category AS ENUM ('economy', 'logistics', 'combat', 'legend');

-- Equipment enums
CREATE TYPE upgrade_category AS ENUM ('Support', 'Protection', 'Combat', 'Speed');
CREATE TYPE cosmetic_type AS ENUM ('design', 'sail', 'flag', 'guild', 'private');
CREATE TYPE resource_category AS ENUM ('trade', 'food', 'material', 'special');
CREATE TYPE consumable_category AS ENUM ('mending', 'equipment', 'group');

-- World enums
CREATE TYPE port_type AS ENUM ('PirateBay', 'NeutralBay', 'Bay', 'City');
CREATE TYPE achievement_category AS ENUM ('Battle', 'Arena', 'Top', 'Collection', 'Trade');
CREATE TYPE guild_place AS ENUM ('Gold', 'Silver', 'Bronze', 'Copper');

-- Build enums
CREATE TYPE archetype AS ENUM ('brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege');

-- ═══════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════

-- Ships (71 records)
CREATE TABLE ships (
  id INTEGER PRIMARY KEY,
  static_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_key TEXT,
  description TEXT,
  model TEXT,
  type ship_type NOT NULL,
  subtype TEXT,
  rank INTEGER NOT NULL,
  tier INTEGER NOT NULL,
  rarity rarity NOT NULL DEFAULT 'Default',
  faction faction NOT NULL DEFAULT 'None',
  health INTEGER NOT NULL,
  armor NUMERIC(5,2) NOT NULL,
  speed NUMERIC(5,2) NOT NULL,
  mobility NUMERIC(5,2) NOT NULL,
  cargo INTEGER NOT NULL,
  crew_slots NUMERIC(5,2) NOT NULL,
  upgrade_slots INTEGER NOT NULL DEFAULT 0,
  cost_gold INTEGER NOT NULL DEFAULT 0,
  cost_premium INTEGER NOT NULL DEFAULT 0,
  required_rank INTEGER NOT NULL DEFAULT 0,
  is_playable BOOLEAN NOT NULL DEFAULT true,
  is_vehicle BOOLEAN NOT NULL DEFAULT false,
  is_npc_usable BOOLEAN NOT NULL DEFAULT false,
  physics_weight NUMERIC(8,2),
  physics_waterline NUMERIC(5,2),
  hitbox_center NUMERIC(8,3)[],
  hitbox_size NUMERIC(8,3)[],
  arm_side INTEGER NOT NULL DEFAULT 0,
  arm_side_total INTEGER NOT NULL DEFAULT 0,
  arm_bow INTEGER NOT NULL DEFAULT 0,
  arm_stern INTEGER NOT NULL DEFAULT 0,
  arm_mortar INTEGER NOT NULL DEFAULT 0,
  arm_falconet INTEGER NOT NULL DEFAULT 0,
  arm_special INTEGER NOT NULL DEFAULT 0,
  bow_figure TEXT,
  icon TEXT,
  pvp_role TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weapons (42 records)
CREATE TABLE weapons (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  weapon_class TEXT NOT NULL,
  material TEXT,
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

-- Ammo (21 records)
CREATE TABLE ammo (
  id TEXT PRIMARY KEY,
  index INTEGER,
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
  radius NUMERIC(8,2) NOT NULL DEFAULT 0.2,
  reload_factor NUMERIC(8,2) NOT NULL DEFAULT 1,
  distance_factor NUMERIC(8,2) NOT NULL DEFAULT 1,
  icon TEXT,
  cost INTEGER NOT NULL DEFAULT 0,
  is_rare BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Swivel Ammo / Falkonets (12 records)
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

-- Powder Kegs (8 records)
CREATE TABLE kegs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mass NUMERIC(8,2) NOT NULL DEFAULT 0,
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
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Crew Units (55 records)
CREATE TABLE crews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
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

-- Captain Skills (55 records)
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
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

-- ═══════════════════════════════════════════════════
-- EQUIPMENT TABLES
-- ═══════════════════════════════════════════════════

-- Upgrades (39 records)
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

-- Cosmetics (562 records)
CREATE TABLE cosmetics (
  id SERIAL PRIMARY KEY,
  name_key TEXT NOT NULL,
  type cosmetic_type NOT NULL DEFAULT 'design',
  icon TEXT,
  in_shop TEXT,
  bonus TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consumables (33 records)
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

-- ═══════════════════════════════════════════════════
-- WORLD TABLES
-- ═══════════════════════════════════════════════════

-- Resources (75 records)
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ok',
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

-- Ports (42 records)
CREATE TABLE ports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type port_type NOT NULL,
  build_ranks INTEGER NOT NULL DEFAULT 0,
  team_limit INTEGER,
  flags TEXT,
  produced_resource TEXT,
  fixed_level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Achievements (57 records)
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  internal_id TEXT NOT NULL,
  enum_ref TEXT,
  rating_weight INTEGER NOT NULL DEFAULT 0,
  single_give BOOLEAN NOT NULL DEFAULT false,
  category achievement_category NOT NULL DEFAULT 'Battle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- META TABLES
-- ═══════════════════════════════════════════════════

-- Ranks (29 records)
CREATE TABLE ranks (
  rank INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL
);

-- Guilds (20 records)
CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  faction faction NOT NULL,
  place guild_place NOT NULL,
  name_key TEXT NOT NULL,
  reward INTEGER NOT NULL,
  UNIQUE(faction, place)
);

-- Arena Bonuses (11 records)
CREATE TABLE arena_bonuses (
  id SERIAL PRIMARY KEY,
  max_quantity INTEGER NOT NULL DEFAULT 1,
  effects TEXT NOT NULL,
  probability NUMERIC(4,2) NOT NULL DEFAULT 1
);

-- ═══════════════════════════════════════════════════
-- LOCALIZATION TABLE
-- ═══════════════════════════════════════════════════

-- Localization (~49K records for 9 languages)
CREATE TABLE localization (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  category TEXT,
  UNIQUE(key, language)
);

-- ═══════════════════════════════════════════════════
-- USER TABLES
-- ═══════════════════════════════════════════════════

-- Builds (user-created)
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  archetype archetype NOT NULL DEFAULT 'brawler',
  tier INTEGER NOT NULL DEFAULT 4,
  ship_id INTEGER REFERENCES ships(id) ON DELETE SET NULL ON UPDATE CASCADE,
  weapons JSONB NOT NULL DEFAULT '{}',
  ammo JSONB NOT NULL DEFAULT '{}',
  upgrades TEXT[] NOT NULL DEFAULT '{}',
  consumables TEXT[] NOT NULL DEFAULT '{}',
  strategy TEXT,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  estimated_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════

-- Ships
CREATE INDEX idx_ships_tier ON ships(tier);
CREATE INDEX idx_ships_type ON ships(type);
CREATE INDEX idx_ships_faction ON ships(faction);
CREATE INDEX idx_ships_rank ON ships(rank);
CREATE INDEX idx_ships_rarity ON ships(rarity);
CREATE INDEX idx_ships_playable ON ships(is_playable) WHERE is_playable = true;
CREATE INDEX idx_ships_created ON ships(created_at DESC);

-- Weapons
CREATE INDEX idx_weapons_category ON weapons(category);
CREATE INDEX idx_weapons_tier ON weapons(tier);
CREATE INDEX idx_weapons_size ON weapons(size_class);
CREATE INDEX idx_weapons_created ON weapons(created_at DESC);

-- Ammo
CREATE INDEX idx_ammo_rare ON ammo(is_rare) WHERE is_rare = true;

-- Swivel Ammo
CREATE INDEX idx_swivel_ammo_index ON swivel_ammo(index);

-- Crew
CREATE INDEX idx_crews_type ON crews(type);
CREATE INDEX idx_crews_pvp ON crews(pvp_relevant) WHERE pvp_relevant = true;

-- Skills
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_pvp ON skills(pvp_relevant) WHERE pvp_relevant = true;

-- Upgrades
CREATE INDEX idx_upgrades_category ON upgrades(category);

-- Cosmetics
CREATE INDEX idx_cosmetics_type ON cosmetics(type);

-- Consumables
CREATE INDEX idx_consumables_category ON consumables(category);

-- Resources
CREATE INDEX idx_resources_category ON resources(category);

-- Ports
CREATE INDEX idx_ports_type ON ports(type);

-- Achievements
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rating ON achievements(rating_weight DESC);

-- Guilds
CREATE INDEX idx_guilds_faction ON guilds(faction);

-- Localization
CREATE INDEX idx_localization_key ON localization(key);
CREATE INDEX idx_localization_language ON localization(language);
CREATE INDEX idx_localization_category ON localization(category);

-- Builds
CREATE INDEX idx_builds_archetype ON builds(archetype);
CREATE INDEX idx_builds_tier ON builds(tier);
CREATE INDEX idx_builds_ship ON builds(ship_id);
CREATE INDEX idx_builds_created ON builds(created_at DESC);

-- ═══════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════

ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE swivel_ammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE localization ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

-- Public read access for all game data
CREATE POLICY "Public read" ON ships FOR SELECT USING (true);
CREATE POLICY "Public read" ON weapons FOR SELECT USING (true);
CREATE POLICY "Public read" ON ammo FOR SELECT USING (true);
CREATE POLICY "Public read" ON swivel_ammo FOR SELECT USING (true);
CREATE POLICY "Public read" ON kegs FOR SELECT USING (true);
CREATE POLICY "Public read" ON crews FOR SELECT USING (true);
CREATE POLICY "Public read" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read" ON upgrades FOR SELECT USING (true);
CREATE POLICY "Public read" ON cosmetics FOR SELECT USING (true);
CREATE POLICY "Public read" ON consumables FOR SELECT USING (true);
CREATE POLICY "Public read" ON resources FOR SELECT USING (true);
CREATE POLICY "Public read" ON ports FOR SELECT USING (true);
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read" ON ranks FOR SELECT USING (true);
CREATE POLICY "Public read" ON guilds FOR SELECT USING (true);
CREATE POLICY "Public read" ON arena_bonuses FOR SELECT USING (true);
CREATE POLICY "Public read" ON localization FOR SELECT USING (true);
CREATE POLICY "Public read" ON builds FOR SELECT USING (true);

-- Public write access for builds
CREATE POLICY "Public insert" ON builds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON builds FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON builds FOR DELETE USING (true);
