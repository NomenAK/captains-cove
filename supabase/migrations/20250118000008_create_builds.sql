-- Migration: Create builds table for user-created content
-- Captain's Cove Database Migration - Phase 8: Builds

-- ═══════════════════════════════════════════════════
-- BUILDS TABLE (User-created)
-- ═══════════════════════════════════════════════════

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
