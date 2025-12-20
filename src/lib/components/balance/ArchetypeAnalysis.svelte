<script lang="ts">
  import { dataStore, buildsByArchetype } from '$lib/stores';
  import { Badge } from '$lib/components/ui';
  import type { Archetype, Ship } from '$lib/data/types';
  import { ARCHETYPE_WEIGHTS, ARCHETYPE_INFO, ARCHETYPES } from '$lib/data/constants';
  import { safeMax } from '$lib/utils/safe-math';

  // Calculate archetype score for a ship
  function calculateArchetypeScore(ship: Ship, archetype: Archetype): number {
    const ships = $dataStore.ships;
    if (ships.length === 0) return 0;

    const maxHp = safeMax(ships.map(s => s.health), 1);
    const maxSpeed = safeMax(ships.map(s => s.speed), 1);
    const maxArmor = safeMax(ships.map(s => s.armor), 1);
    const maxCargo = safeMax(ships.map(s => s.cargo), 1);
    const maxCrew = safeMax(ships.map(s => s.crewSlots), 1);

    const weights = ARCHETYPE_WEIGHTS[archetype];

    let score = 0;
    score += (ship.health / maxHp) * weights.hp * 100;
    score += (ship.speed / maxSpeed) * weights.speed * 100;
    score += (ship.armor / maxArmor) * weights.armor * 100;
    score += (ship.cargo / maxCargo) * weights.cargo * 100;
    score += (ship.crewSlots / maxCrew) * weights.crew * 100;
    // DPS, range, accuracy would come from weapons - simplified for now
    score += 30 * (weights.dps + weights.range + weights.accuracy);

    return Math.round(score);
  }

  // Get top ships for each archetype
  const archetypeTopShips = $derived(() => {
    const ships = $dataStore.ships.filter(s => s.isPlayable);
    const result: Record<Archetype, Array<{ ship: Ship; score: number }>> = {
      brawler: [],
      kite: [],
      sniper: [],
      pursuit: [],
      trade: [],
      siege: []
    };

    for (const archetype of ARCHETYPES) {
      const scored = ships.map(ship => ({
        ship,
        score: calculateArchetypeScore(ship, archetype)
      }));
      scored.sort((a, b) => b.score - a.score);
      result[archetype] = scored.slice(0, 3);
    }

    return result;
  });

  // Get archetype stats summary
  const archetypeStats = $derived(() => {
    const archetypes = ARCHETYPES;
    return archetypes.map(arch => {
      const builds = $buildsByArchetype[arch] || [];
      const topShips = archetypeTopShips()[arch];
      const avgScore = builds.length > 0
        ? Math.round(builds.reduce((sum, b) => sum + b.estimatedScore, 0) / builds.length)
        : 0;

      return {
        archetype: arch,
        info: ARCHETYPE_INFO[arch],
        weights: ARCHETYPE_WEIGHTS[arch],
        buildCount: builds.length,
        avgScore,
        topShips
      };
    });
  });
</script>

<div class="archetype-analysis">
  <h2 class="section-title">Archetype Analysis</h2>
  <p class="section-desc">Optimal ship selections and scoring weights for each playstyle</p>

  <div class="archetype-grid">
    {#each archetypeStats() as stat (stat.archetype)}
      <div class="archetype-card">
        <div class="archetype-header">
          <span class="archetype-icon">{stat.info.icon}</span>
          <div class="archetype-title">
            <Badge variant="archetype" value={stat.archetype} />
            <span class="archetype-name">{stat.info.name}</span>
          </div>
        </div>

        <p class="archetype-desc">{stat.info.description}</p>

        <div class="weights-section">
          <h4 class="weights-title">Scoring Weights</h4>
          <div class="weights-grid">
            {#each Object.entries(stat.weights).filter(([_, v]) => v > 0) as [key, value] (key)}
              <div class="weight-item">
                <span class="weight-label">{key.toUpperCase()}</span>
                <div class="weight-bar">
                  <div class="weight-fill" style="width: {value * 100}%"></div>
                </div>
                <span class="weight-value">{Math.round(value * 100)}%</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="top-ships-section">
          <h4 class="ships-title">Top Ships</h4>
          {#if stat.topShips.length > 0}
            <div class="top-ships">
              {#each stat.topShips as { ship, score }, i (ship.id)}
                <div class="top-ship">
                  <span class="ship-rank">#{i + 1}</span>
                  <span class="ship-name">{ship.name}</span>
                  <Badge variant="tier" value={ship.tier} size="sm" />
                  <span class="ship-score">{score}</span>
                </div>
              {/each}
            </div>
          {:else}
            <p class="no-ships">No playable ships</p>
          {/if}
        </div>

        <div class="archetype-footer">
          <div class="stat-item">
            <span class="stat-label">Your Builds</span>
            <span class="stat-value">{stat.buildCount}</span>
          </div>
          {#if stat.avgScore > 0}
            <div class="stat-item">
              <span class="stat-label">Avg Score</span>
              <span class="stat-value">{stat.avgScore}</span>
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .archetype-analysis {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0;
  }

  .section-desc {
    color: var(--text-muted);
    margin: 0;
    font-size: var(--text-sm);
  }

  .archetype-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-lg);
  }

  .archetype-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .archetype-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .archetype-icon {
    font-size: 32px;
  }

  .archetype-title {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .archetype-name {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--canvas);
  }

  .archetype-desc {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    margin: 0;
    line-height: var(--leading-relaxed);
  }

  .weights-section {
    border-top: 1px solid var(--wood-dark);
    padding-top: var(--space-md);
  }

  .weights-title,
  .ships-title {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--brass-light);
    margin: 0 0 var(--space-sm);
  }

  .weights-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .weight-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .weight-label {
    width: 60px;
    font-size: var(--text-xs);
    color: var(--canvas-aged);
  }

  .weight-bar {
    flex: 1;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .weight-fill {
    height: 100%;
    background: var(--brass);
    border-radius: var(--radius-sm);
    transition: width var(--transition-base);
  }

  .weight-value {
    width: 40px;
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .top-ships-section {
    border-top: 1px solid var(--wood-dark);
    padding-top: var(--space-md);
  }

  .top-ships {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .top-ship {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
  }

  .ship-rank {
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    width: 24px;
  }

  .ship-name {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  .ship-score {
    font-size: var(--text-xs);
    color: var(--brass-light);
    font-variant-numeric: tabular-nums;
  }

  .no-ships {
    font-size: var(--text-sm);
    color: var(--text-muted);
    font-style: italic;
    margin: 0;
  }

  .archetype-footer {
    display: flex;
    gap: var(--space-lg);
    border-top: 1px solid var(--wood-dark);
    padding-top: var(--space-md);
    margin-top: auto;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .stat-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .stat-value {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 768px) {
    .archetype-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
