-- Migration: Create localization table with multi-language support
-- Captain's Cove Database Migration - Phase 7: Localization

-- ═══════════════════════════════════════════════════
-- LOCALIZATION TABLE (Multi-language)
-- ═══════════════════════════════════════════════════

CREATE TABLE localization (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  category TEXT,
  UNIQUE(key, language)
);

-- Index for efficient key lookups
CREATE INDEX idx_localization_key ON localization(key);

-- Index for language filtering
CREATE INDEX idx_localization_language ON localization(language);

-- Index for category filtering
CREATE INDEX idx_localization_category ON localization(category);
