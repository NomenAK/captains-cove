-- Migration: Drop all existing tables and enums for clean rebuild
-- Captain's Cove Database Migration - Phase 1: Clean Wipe

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS builds CASCADE;
DROP TABLE IF EXISTS localization CASCADE;
DROP TABLE IF EXISTS cosmetics CASCADE;
DROP TABLE IF EXISTS upgrades CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS crews CASCADE;
DROP TABLE IF EXISTS kegs CASCADE;
DROP TABLE IF EXISTS ammo CASCADE;
DROP TABLE IF EXISTS weapons CASCADE;
DROP TABLE IF EXISTS ships CASCADE;
DROP TABLE IF EXISTS resources CASCADE;

-- Drop all existing enums
DROP TYPE IF EXISTS archetype CASCADE;
DROP TYPE IF EXISTS resource_category CASCADE;
DROP TYPE IF EXISTS cosmetic_type CASCADE;
DROP TYPE IF EXISTS upgrade_category CASCADE;
DROP TYPE IF EXISTS skill_category CASCADE;
DROP TYPE IF EXISTS crew_options CASCADE;
DROP TYPE IF EXISTS crew_type CASCADE;
DROP TYPE IF EXISTS crafting_type CASCADE;
DROP TYPE IF EXISTS weapon_size CASCADE;
DROP TYPE IF EXISTS weapon_category CASCADE;
DROP TYPE IF EXISTS coolness CASCADE;
DROP TYPE IF EXISTS fraction CASCADE;
DROP TYPE IF EXISTS ship_class CASCADE;
DROP TYPE IF EXISTS ship_type CASCADE;
