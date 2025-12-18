-- Migration: Create all performance indexes
-- Captain's Cove Database Migration - Phase 9: Indexes

-- ═══════════════════════════════════════════════════
-- SHIPS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_ships_tier ON ships(tier);
CREATE INDEX idx_ships_type ON ships(type);
CREATE INDEX idx_ships_faction ON ships(faction);
CREATE INDEX idx_ships_rank ON ships(rank);
CREATE INDEX idx_ships_rarity ON ships(rarity);
CREATE INDEX idx_ships_playable ON ships(is_playable) WHERE is_playable = true;
CREATE INDEX idx_ships_created ON ships(created_at DESC);

-- ═══════════════════════════════════════════════════
-- WEAPONS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_weapons_category ON weapons(category);
CREATE INDEX idx_weapons_tier ON weapons(tier);
CREATE INDEX idx_weapons_size ON weapons(size_class);
CREATE INDEX idx_weapons_created ON weapons(created_at DESC);

-- ═══════════════════════════════════════════════════
-- AMMO INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_ammo_rare ON ammo(is_rare) WHERE is_rare = true;

-- ═══════════════════════════════════════════════════
-- SWIVEL AMMO INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_swivel_ammo_index ON swivel_ammo(index);

-- ═══════════════════════════════════════════════════
-- CREW INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_crews_type ON crews(type);
CREATE INDEX idx_crews_pvp ON crews(pvp_relevant) WHERE pvp_relevant = true;

-- ═══════════════════════════════════════════════════
-- SKILLS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_pvp ON skills(pvp_relevant) WHERE pvp_relevant = true;

-- ═══════════════════════════════════════════════════
-- UPGRADES INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_upgrades_category ON upgrades(category);

-- ═══════════════════════════════════════════════════
-- COSMETICS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_cosmetics_type ON cosmetics(type);

-- ═══════════════════════════════════════════════════
-- CONSUMABLES INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_consumables_category ON consumables(category);

-- ═══════════════════════════════════════════════════
-- RESOURCES INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_resources_category ON resources(category);

-- ═══════════════════════════════════════════════════
-- PORTS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_ports_type ON ports(type);

-- ═══════════════════════════════════════════════════
-- ACHIEVEMENTS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rating ON achievements(rating_weight DESC);

-- ═══════════════════════════════════════════════════
-- GUILDS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_guilds_faction ON guilds(faction);

-- ═══════════════════════════════════════════════════
-- BUILDS INDEXES
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_builds_archetype ON builds(archetype);
CREATE INDEX idx_builds_tier ON builds(tier);
CREATE INDEX idx_builds_ship ON builds(ship_id);
CREATE INDEX idx_builds_created ON builds(created_at DESC);
