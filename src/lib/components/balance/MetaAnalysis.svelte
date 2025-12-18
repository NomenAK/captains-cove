<script lang="ts">
  import { dataStore, buildsStore, buildsByArchetype, buildCount } from '$lib/stores';
  import { Badge } from '$lib/components/ui';
  import type { Ship, Weapon, Archetype } from '$lib/data/types';
  import { SHIP_TYPE_TO_CLASS } from '$lib/data/types';

  // Analyze current meta based on user builds and game data
  const metaInsights = $derived(() => {
    const builds = $buildsStore;
    const ships = $dataStore.ships.filter(s => s.isPlayable);
    const weapons = $dataStore.weapons;

    // Ship usage in builds
    const shipUsage: Record<string, number> = {};
    const weaponUsage: Record<string, number> = {};
    const archetypeCount: Record<Archetype, number> = {
      brawler: 0, kite: 0, sniper: 0, pursuit: 0, trade: 0, siege: 0
    };

    for (const build of builds) {
      // Count ship usage
      if (build.shipId !== null) {
        shipUsage[build.shipId] = (shipUsage[build.shipId] || 0) + 1;
      }

      // Count weapon usage
      if (build.weapons.broadside) {
        weaponUsage[build.weapons.broadside] = (weaponUsage[build.weapons.broadside] || 0) + 1;
      }
      if (build.weapons.bow) {
        weaponUsage[build.weapons.bow] = (weaponUsage[build.weapons.bow] || 0) + 1;
      }

      // Count archetype usage
      archetypeCount[build.archetype]++;
    }

    // Get top used ships
    const topShips = Object.entries(shipUsage)
      .map(([id, count]) => ({
        ship: ships.find(s => s.id === Number(id)),
        count
      }))
      .filter(item => item.ship)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get top used weapons
    const topWeapons = Object.entries(weaponUsage)
      .map(([id, count]) => ({
        weapon: weapons.find(w => w.id === id),
        count
      }))
      .filter(item => item.weapon)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Archetype distribution
    const archetypeDistribution = Object.entries(archetypeCount)
      .map(([arch, count]) => ({
        archetype: arch as Archetype,
        count,
        percentage: builds.length > 0 ? Math.round((count / builds.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Meta observations based on data
    const observations: string[] = [];

    // Check for dominant archetype
    const topArchetype = archetypeDistribution[0];
    if (topArchetype && topArchetype.percentage > 40) {
      observations.push(`${topArchetype.archetype.charAt(0).toUpperCase() + topArchetype.archetype.slice(1)} builds dominate with ${topArchetype.percentage}% of all builds`);
    }

    // Check for ship class preferences
    const shipClassCount: Record<string, number> = {};
    for (const { ship, count } of topShips) {
      if (ship) {
        const shipClass = SHIP_TYPE_TO_CLASS[ship.type] || 'Combat';
        shipClassCount[shipClass] = (shipClassCount[shipClass] || 0) + count;
      }
    }
    const topClass = Object.entries(shipClassCount).sort((a, b) => b[1] - a[1])[0];
    if (topClass && topClass[1] > 2) {
      observations.push(`${topClass[0]} class ships are popular in the current meta`);
    }

    // Check for weapon type preferences
    const weaponCatCount: Record<string, number> = {};
    for (const { weapon, count } of topWeapons) {
      if (weapon) {
        weaponCatCount[weapon.category] = (weaponCatCount[weapon.category] || 0) + count;
      }
    }
    const topWeaponCat = Object.entries(weaponCatCount).sort((a, b) => b[1] - a[1])[0];
    if (topWeaponCat && topWeaponCat[1] > 2) {
      observations.push(`${topWeaponCat[0]}s are the preferred weapon type`);
    }

    // Add default observations if no builds
    if (builds.length === 0) {
      observations.push('Create builds to see personalized meta insights');
      observations.push('Brawler builds excel in close combat with high HP ships');
      observations.push('Kite builds use fast ships to maintain distance');
      observations.push('Carronades have highest penetration for armor breaking');
    }

    return {
      totalBuilds: builds.length,
      topShips,
      topWeapons,
      archetypeDistribution,
      observations
    };
  });

  // Ship stat extremes for balance insights
  const balanceInsights = $derived(() => {
    const ships = $dataStore.ships.filter(s => s.isPlayable);
    const weapons = $dataStore.weapons;

    if (ships.length === 0) return null;

    // Find extremes
    const highestHp = ships.reduce((max, s) => s.health > max.health ? s : max, ships[0]);
    const lowestHp = ships.reduce((min, s) => s.health < min.health ? s : min, ships[0]);
    const hpRange = highestHp.health - lowestHp.health;

    const fastestShip = ships.reduce((max, s) => s.speed > max.speed ? s : max, ships[0]);
    const slowestShip = ships.reduce((min, s) => s.speed < min.speed ? s : min, ships[0]);

    const highestArmor = ships.reduce((max, s) => s.armor > max.armor ? s : max, ships[0]);
    const lowestArmor = ships.reduce((min, s) => s.armor < min.armor ? s : min, ships[0]);

    // Weapon balance
    const highestPen = weapons.length > 0
      ? weapons.reduce((max, w) => w.penetration > max.penetration ? w : max, weapons[0])
      : null;
    const longestRange = weapons.length > 0
      ? weapons.reduce((max, w) => w.distance > max.distance ? w : max, weapons[0])
      : null;

    // Balance concerns
    const concerns: string[] = [];

    // HP variance check
    const hpVariance = hpRange / highestHp.health;
    if (hpVariance > 0.8) {
      concerns.push(`Large HP variance (${Math.round(hpVariance * 100)}%) - ${highestHp.name} has ${Math.round(highestHp.health / lowestHp.health)}x more HP than ${lowestHp.name}`);
    }

    // Armor vs penetration check
    if (highestPen && highestArmor.armor > highestPen.penetration * 0.7) {
      concerns.push(`${highestArmor.name} has very high armor (${highestArmor.armor.toFixed(1)}) - may be difficult to penetrate effectively`);
    }

    // Speed outliers
    const speedRatio = fastestShip.speed / slowestShip.speed;
    if (speedRatio > 3) {
      concerns.push(`Speed variance of ${speedRatio.toFixed(1)}x between ${fastestShip.name} and ${slowestShip.name}`);
    }

    return {
      hp: { highest: highestHp, lowest: lowestHp, range: hpRange },
      speed: { fastest: fastestShip, slowest: slowestShip, ratio: speedRatio },
      armor: { highest: highestArmor, lowest: lowestArmor },
      weapons: { highestPen, longestRange },
      concerns
    };
  });

  const archetypeColors: Record<Archetype, string> = {
    brawler: 'var(--archetype-brawler)',
    kite: 'var(--archetype-kite)',
    sniper: 'var(--archetype-sniper)',
    pursuit: 'var(--archetype-pursuit)',
    trade: 'var(--archetype-trade)',
    siege: 'var(--archetype-siege)'
  };
</script>

<div class="meta-analysis">
  <h2 class="section-title">Meta Analysis</h2>
  <p class="section-desc">Current trends and balance insights based on your builds and game data</p>

  <div class="meta-grid">
    <!-- Archetype Distribution -->
    <div class="meta-card">
      <h3 class="card-title">Archetype Distribution</h3>
      {#if metaInsights().totalBuilds > 0}
        <div class="distribution-chart">
          {#each metaInsights().archetypeDistribution as { archetype, count, percentage }}
            <div class="dist-row">
              <Badge variant="archetype" value={archetype} size="sm" />
              <div class="dist-bar-container">
                <div
                  class="dist-bar"
                  style="width: {percentage}%; background: {archetypeColors[archetype]}"
                ></div>
              </div>
              <span class="dist-count">{count}</span>
              <span class="dist-percent">{percentage}%</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="empty-state">No builds yet. Create builds to see distribution.</p>
      {/if}
    </div>

    <!-- Top Ships -->
    <div class="meta-card">
      <h3 class="card-title">Popular Ships</h3>
      {#if metaInsights().topShips.length > 0}
        <div class="top-list">
          {#each metaInsights().topShips as { ship, count }, i}
            {#if ship}
              <div class="top-item">
                <span class="item-rank">#{i + 1}</span>
                <span class="item-name">{ship.name}</span>
                <Badge variant="class" value={SHIP_TYPE_TO_CLASS[ship.type] || ship.type} size="sm" />
                <span class="item-count">{count} build{count !== 1 ? 's' : ''}</span>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <p class="empty-state">No ship data in builds yet.</p>
      {/if}
    </div>

    <!-- Top Weapons -->
    <div class="meta-card">
      <h3 class="card-title">Popular Weapons</h3>
      {#if metaInsights().topWeapons.length > 0}
        <div class="top-list">
          {#each metaInsights().topWeapons as { weapon, count }, i}
            {#if weapon}
              <div class="top-item">
                <span class="item-rank">#{i + 1}</span>
                <span class="item-name">{weapon.name}</span>
                <Badge variant="category" value={weapon.category} size="sm" />
                <span class="item-count">{count}x</span>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <p class="empty-state">No weapon data in builds yet.</p>
      {/if}
    </div>

    <!-- Meta Observations -->
    <div class="meta-card meta-card--wide">
      <h3 class="card-title">Meta Observations</h3>
      <ul class="observations-list">
        {#each metaInsights().observations as observation}
          <li class="observation-item">{observation}</li>
        {/each}
      </ul>
    </div>
  </div>

  {#if balanceInsights()}
    <div class="balance-section">
      <h3 class="section-subtitle">Balance Insights</h3>

      <div class="balance-grid">
        <!-- Stat Extremes -->
        <div class="balance-card">
          <h4 class="balance-title">Ship Stat Extremes</h4>
          <div class="extremes-list">
            <div class="extreme-item">
              <span class="extreme-label">Highest HP</span>
              <span class="extreme-value">{balanceInsights()?.hp.highest.name}</span>
              <span class="extreme-stat">{balanceInsights()?.hp.highest.health.toLocaleString()}</span>
            </div>
            <div class="extreme-item">
              <span class="extreme-label">Fastest</span>
              <span class="extreme-value">{balanceInsights()?.speed.fastest.name}</span>
              <span class="extreme-stat">{balanceInsights()?.speed.fastest.speed.toFixed(1)}</span>
            </div>
            <div class="extreme-item">
              <span class="extreme-label">Best Armor</span>
              <span class="extreme-value">{balanceInsights()?.armor.highest.name}</span>
              <span class="extreme-stat">{balanceInsights()?.armor.highest.armor.toFixed(1)}</span>
            </div>
            {#if balanceInsights()?.weapons.highestPen}
              <div class="extreme-item">
                <span class="extreme-label">Highest Penetration</span>
                <span class="extreme-value">{balanceInsights()?.weapons.highestPen?.name}</span>
                <span class="extreme-stat">{balanceInsights()?.weapons.highestPen?.penetration}</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Balance Concerns -->
        <div class="balance-card">
          <h4 class="balance-title">Balance Notes</h4>
          {#if balanceInsights()?.concerns.length ?? 0 > 0}
            <ul class="concerns-list">
              {#each balanceInsights()?.concerns ?? [] as concern}
                <li class="concern-item">{concern}</li>
              {/each}
            </ul>
          {:else}
            <p class="balance-ok">No significant balance concerns detected.</p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .meta-analysis {
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

  .section-subtitle {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .meta-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .meta-card--wide {
    grid-column: 1 / -1;
  }

  .card-title {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .distribution-chart {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .dist-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .dist-bar-container {
    flex: 1;
    height: 16px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .dist-bar {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width var(--transition-base);
    min-width: 2px;
  }

  .dist-count {
    width: 24px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--canvas);
    font-size: var(--text-sm);
  }

  .dist-percent {
    width: 40px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--text-muted);
    font-size: var(--text-xs);
  }

  .top-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .top-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
  }

  .item-rank {
    width: 24px;
    font-weight: var(--font-bold);
    color: var(--gold-primary);
  }

  .item-name {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  .item-count {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .empty-state {
    font-size: var(--text-sm);
    color: var(--text-muted);
    font-style: italic;
    margin: 0;
  }

  .observations-list {
    margin: 0;
    padding-left: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .observation-item {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    line-height: var(--leading-relaxed);
  }

  .balance-section {
    margin-top: var(--space-md);
  }

  .balance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  .balance-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .balance-title {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .extremes-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .extreme-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--wood-dark);
  }

  .extreme-item:last-child {
    border-bottom: none;
  }

  .extreme-label {
    width: 120px;
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .extreme-value {
    flex: 1;
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  .extreme-stat {
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-bold);
    color: var(--gold-primary);
  }

  .concerns-list {
    margin: 0;
    padding-left: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .concern-item {
    font-size: var(--text-sm);
    color: var(--warning);
    line-height: var(--leading-relaxed);
  }

  .balance-ok {
    font-size: var(--text-sm);
    color: var(--success);
    margin: 0;
  }

  @media (max-width: 768px) {
    .meta-grid {
      grid-template-columns: 1fr;
    }

    .meta-card--wide {
      grid-column: 1;
    }
  }
</style>
