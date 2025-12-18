-- Migration: Add FK cascade and performance indexes
-- Date: 2024-12-18
-- Description: Add ON DELETE SET NULL to builds.ship_id and add performance indexes

-- Fix builds.ship_id foreign key to cascade properly
ALTER TABLE builds DROP CONSTRAINT IF EXISTS builds_ship_id_fkey;
ALTER TABLE builds ADD CONSTRAINT builds_ship_id_fkey
  FOREIGN KEY (ship_id) REFERENCES ships(id)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_builds_ship_id ON builds(ship_id);
CREATE INDEX IF NOT EXISTS idx_builds_archetype ON builds(archetype);
CREATE INDEX IF NOT EXISTS idx_builds_created_at ON builds(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ships_created_at ON ships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ships_tier ON ships(tier);
CREATE INDEX IF NOT EXISTS idx_ships_ship_class ON ships(ship_class);
CREATE INDEX IF NOT EXISTS idx_ships_is_playable ON ships(is_playable) WHERE is_playable = true;

CREATE INDEX IF NOT EXISTS idx_weapons_created_at ON weapons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weapons_category ON weapons(category);
CREATE INDEX IF NOT EXISTS idx_weapons_tier ON weapons(tier);

CREATE INDEX IF NOT EXISTS idx_crews_pvp_relevant ON crews(pvp_relevant) WHERE pvp_relevant = true;
CREATE INDEX IF NOT EXISTS idx_skills_pvp_relevant ON skills(pvp_relevant) WHERE pvp_relevant = true;
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
