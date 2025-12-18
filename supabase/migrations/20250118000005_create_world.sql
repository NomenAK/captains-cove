-- Migration: Create world tables
-- Captain's Cove Database Migration - Phase 5: World

-- ═══════════════════════════════════════════════════
-- RESOURCES TABLE
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- PORTS TABLE (NEW)
-- ═══════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════
-- ACHIEVEMENTS TABLE (NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  internal_id TEXT NOT NULL,
  enum_ref TEXT,
  rating_weight INTEGER NOT NULL DEFAULT 0,
  single_give BOOLEAN NOT NULL DEFAULT false,
  category achievement_category NOT NULL DEFAULT 'Battle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
