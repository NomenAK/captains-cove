-- Migration: Create meta tables
-- Captain's Cove Database Migration - Phase 6: Meta

-- ═══════════════════════════════════════════════════
-- RANKS TABLE (NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE ranks (
  rank INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL
);

-- ═══════════════════════════════════════════════════
-- GUILDS TABLE (NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE guilds (
  id SERIAL PRIMARY KEY,
  faction faction NOT NULL,
  place guild_place NOT NULL,
  name_key TEXT NOT NULL,
  reward INTEGER NOT NULL,
  UNIQUE(faction, place)
);

-- ═══════════════════════════════════════════════════
-- ARENA BONUSES TABLE (NEW)
-- ═══════════════════════════════════════════════════

CREATE TABLE arena_bonuses (
  id SERIAL PRIMARY KEY,
  max_quantity INTEGER NOT NULL DEFAULT 1,
  effects TEXT NOT NULL,
  probability NUMERIC(4,2) NOT NULL DEFAULT 1
);
