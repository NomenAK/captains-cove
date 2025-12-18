-- Add all missing upgrade categories
ALTER TYPE upgrade_category ADD VALUE IF NOT EXISTS 'Sailes';
ALTER TYPE upgrade_category ADD VALUE IF NOT EXISTS 'Modification';
