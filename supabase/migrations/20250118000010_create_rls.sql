-- Migration: Enable Row Level Security and create policies
-- Captain's Cove Database Migration - Phase 10: RLS

-- ═══════════════════════════════════════════════════
-- ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════════

ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE swivel_ammo ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumables ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ports ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE localization ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════
-- PUBLIC READ ACCESS FOR ALL GAME DATA
-- ═══════════════════════════════════════════════════

CREATE POLICY "Public read" ON ships FOR SELECT USING (true);
CREATE POLICY "Public read" ON weapons FOR SELECT USING (true);
CREATE POLICY "Public read" ON ammo FOR SELECT USING (true);
CREATE POLICY "Public read" ON swivel_ammo FOR SELECT USING (true);
CREATE POLICY "Public read" ON kegs FOR SELECT USING (true);
CREATE POLICY "Public read" ON crews FOR SELECT USING (true);
CREATE POLICY "Public read" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read" ON upgrades FOR SELECT USING (true);
CREATE POLICY "Public read" ON cosmetics FOR SELECT USING (true);
CREATE POLICY "Public read" ON consumables FOR SELECT USING (true);
CREATE POLICY "Public read" ON resources FOR SELECT USING (true);
CREATE POLICY "Public read" ON ports FOR SELECT USING (true);
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public read" ON ranks FOR SELECT USING (true);
CREATE POLICY "Public read" ON guilds FOR SELECT USING (true);
CREATE POLICY "Public read" ON arena_bonuses FOR SELECT USING (true);
CREATE POLICY "Public read" ON localization FOR SELECT USING (true);
CREATE POLICY "Public read" ON builds FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════
-- PUBLIC WRITE ACCESS FOR BUILDS (Anonymous users)
-- ═══════════════════════════════════════════════════

CREATE POLICY "Public insert" ON builds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON builds FOR UPDATE USING (true);
CREATE POLICY "Public delete" ON builds FOR DELETE USING (true);
