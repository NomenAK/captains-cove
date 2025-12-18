/**
 * Archetype calculation utilities
 * Extracted from ArchetypeAnalysis.svelte for reuse
 */

import type { Ship, Archetype } from '$lib/data/types';
import { ARCHETYPE_WEIGHTS, ARCHETYPE_INFO } from '$lib/data/constants';
import { safeMax } from '$lib/utils/safe-math';

export type { Archetype };
export { ARCHETYPE_WEIGHTS, ARCHETYPE_INFO };

/**
 * Archetype score result
 */
export interface ArchetypeScore {
  ship: Ship;
  score: number;
}

/**
 * Stat maximums for normalization
 */
export interface StatMaximums {
  health: number;
  speed: number;
  armor: number;
  cargo: number;
  crew: number;
}

/**
 * Calculate stat maximums from a ship array
 * Should be cached and reused rather than recalculated per ship
 */
export function calculateStatMaximums(ships: Ship[]): StatMaximums {
  if (ships.length === 0) {
    return { health: 1, speed: 1, armor: 1, cargo: 1, crew: 1 };
  }

  return {
    health: safeMax(ships.map(s => s.health), 1),
    speed: safeMax(ships.map(s => s.speed), 1),
    armor: safeMax(ships.map(s => s.armor), 1),
    cargo: safeMax(ships.map(s => s.cargo), 1),
    crew: safeMax(ships.map(s => s.crewSlots), 1)
  };
}

/**
 * Calculate archetype score for a ship
 * Uses pre-calculated stat maximums for efficiency
 */
export function calculateArchetypeScore(
  ship: Ship,
  archetype: Archetype,
  maxStats: StatMaximums
): number {
  const weights = ARCHETYPE_WEIGHTS[archetype];

  let score = 0;

  // Normalized stat contributions
  score += (ship.health / maxStats.health) * weights.hp * 100;
  score += (ship.speed / maxStats.speed) * weights.speed * 100;
  score += (ship.armor / maxStats.armor) * weights.armor * 100;
  score += (ship.cargo / maxStats.cargo) * weights.cargo * 100;
  score += (ship.crewSlots / maxStats.crew) * weights.crew * 100;

  // DPS, range, accuracy would come from weapons - simplified for now
  // These stats contribute a fixed amount based on their weight
  score += 30 * (weights.dps + weights.range + weights.accuracy);

  return Math.round(score);
}

/**
 * Get top ships for an archetype
 */
export function getTopShipsForArchetype(
  ships: Ship[],
  archetype: Archetype,
  maxStats: StatMaximums,
  limit: number = 3
): ArchetypeScore[] {
  const scored = ships.map(ship => ({
    ship,
    score: calculateArchetypeScore(ship, archetype, maxStats)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get top ships for all archetypes
 */
export function getAllArchetypeTopShips(
  ships: Ship[],
  limit: number = 3
): Record<Archetype, ArchetypeScore[]> {
  const playableShips = ships.filter(s => s.isPlayable);
  const maxStats = calculateStatMaximums(playableShips);

  const archetypes: Archetype[] = ['brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege'];

  const result = {} as Record<Archetype, ArchetypeScore[]>;

  for (const archetype of archetypes) {
    result[archetype] = getTopShipsForArchetype(playableShips, archetype, maxStats, limit);
  }

  return result;
}

/**
 * Determine the best archetype for a ship
 */
export function getBestArchetypeForShip(
  ship: Ship,
  maxStats: StatMaximums
): { archetype: Archetype; score: number } {
  const archetypes: Archetype[] = ['brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege'];

  let best = { archetype: 'brawler' as Archetype, score: 0 };

  for (const archetype of archetypes) {
    const score = calculateArchetypeScore(ship, archetype, maxStats);
    if (score > best.score) {
      best = { archetype, score };
    }
  }

  return best;
}
