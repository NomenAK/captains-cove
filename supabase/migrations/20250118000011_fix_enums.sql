-- Fix missing enum values discovered during seeding

-- Add 'Other' to achievement_category
ALTER TYPE achievement_category ADD VALUE IF NOT EXISTS 'Other';

-- Add 'Mortars' and 'PvP' to upgrade_category
ALTER TYPE upgrade_category ADD VALUE IF NOT EXISTS 'Mortars';
ALTER TYPE upgrade_category ADD VALUE IF NOT EXISTS 'PvP';
