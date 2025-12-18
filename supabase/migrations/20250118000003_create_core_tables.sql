-- Migration: Create core game tables
-- Captain's Cove Database Migration - Phase 3: Core Tables

-- ═══════════════════════════════════════════════════
-- SHIPS TABLE (Enhanced with armament, physics, classification)
-- ═══════════════════════════════════════════════════

CREATE TABLE ships (
  -- Identity
  id INTEGER PRIMARY KEY,
  static_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_key TEXT,
  description TEXT,
  model TEXT,

  -- Classification
  type ship_type NOT NULL,
  subtype TEXT,
  rank INTEGER NOT NULL,
  tier INTEGER NOT NULL,
  rarity rarity NOT NULL DEFAULT 'Default',
  faction faction NOT NULL DEFAULT 'None',

  -- Core stats
  health INTEGER NOT NULL,
  armor NUMERIC(5,2) NOT NULL,
  speed NUMERIC(5,2) NOT NULL,
  mobility NUMERIC(5,2) NOT NULL,
  cargo INTEGER NOT NULL,
  crew_slots NUMERIC(5,2) NOT NULL,
  upgrade_slots INTEGER NOT NULL DEFAULT 0,

  -- Requirements
  cost_gold INTEGER NOT NULL DEFAULT 0,
  cost_premium INTEGER NOT NULL DEFAULT 0,
  required_rank INTEGER NOT NULL DEFAULT 0,

  -- Classification flags
  is_playable BOOLEAN NOT NULL DEFAULT true,
  is_vehicle BOOLEAN NOT NULL DEFAULT false,
  is_npc_usable BOOLEAN NOT NULL DEFAULT false,

  -- Physics
  physics_weight NUMERIC(8,2),
  physics_waterline NUMERIC(5,2),
  hitbox_center NUMERIC(8,3)[],
  hitbox_size NUMERIC(8,3)[],

  -- Armament slots
  arm_side INTEGER NOT NULL DEFAULT 0,
  arm_side_total INTEGER NOT NULL DEFAULT 0,
  arm_bow INTEGER NOT NULL DEFAULT 0,
  arm_stern INTEGER NOT NULL DEFAULT 0,
  arm_mortar INTEGER NOT NULL DEFAULT 0,
  arm_falconet INTEGER NOT NULL DEFAULT 0,
  arm_special INTEGER NOT NULL DEFAULT 0,

  -- Visual
  bow_figure TEXT,
  icon TEXT,
  pvp_role TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════
-- WEAPONS TABLE
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- AMMO TABLE (Cannon/Mortar ammunition)
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- POWDER KEGS TABLE
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- CREW UNITS TABLE
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- CAPTAIN SKILLS TABLE
-- ═══════════════════════════════════════════════════

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
