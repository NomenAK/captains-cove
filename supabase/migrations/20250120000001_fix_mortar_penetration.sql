-- Fix mortar weapons with penetration=0 (data integrity issue)
-- ncs_cannon_41 (Heavy Mortar) and ncs_cannon_42 (Hailstone Mortar) had incorrect values

UPDATE weapons
SET penetration = 100,
    cooldown = 10
WHERE id IN ('ncs_cannon_41', 'ncs_cannon_42')
  AND penetration = 0;

-- Verify the fix
DO $$
DECLARE
  bad_mortars INTEGER;
BEGIN
  SELECT COUNT(*) INTO bad_mortars
  FROM weapons
  WHERE category = 'Mortar' AND penetration < 50;

  IF bad_mortars > 0 THEN
    RAISE WARNING 'Found % mortar(s) with penetration < 50, may need review', bad_mortars;
  END IF;
END $$;
