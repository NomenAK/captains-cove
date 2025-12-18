<script lang="ts">
  import { dataStore } from '$lib/stores';
  import { Badge } from '$lib/components/ui';
  import type { Ship, Weapon } from '$lib/data/types';
  import { SHIP_TYPE_TO_CLASS } from '$lib/data/types';
  import { safeMin, safeMax } from '$lib/utils/safe-math';

  // Combat mechanics from datamined data
  // Armor scale: 0-11.5 (Huracan max)
  // Penetration scale: 13-32.5 for cannons, 100-305 for mortars

  // Calculate damage effectiveness based on penetration vs armor
  function calculateEffectiveness(penetration: number, armor: number): number {
    // Mortars (pen >= 50) always deal full damage - siege weapons ignore armor
    if (penetration >= 50) return 1.0;
    // effectiveness = max(0.10, (penetration - armor) / penetration)
    return Math.max(0.10, (penetration - armor) / penetration);
  }

  // Estimate DPS from weapon cooldown (assume base damage of 100 for simplicity)
  function estimateDps(weapon: Weapon): number {
    const baseDamage = 100;
    return baseDamage / weapon.cooldown;
  }

  // Calculate estimated time to kill
  function calculateTTK(
    attackerWeapon: Weapon,
    defenderShip: Ship,
    broadsideSlots: number = 6
  ): number {
    const effectiveness = calculateEffectiveness(attackerWeapon.penetration, defenderShip.armor);
    const baseDamagePerShot = 100; // Simplified base damage
    const effectiveDamage = baseDamagePerShot * effectiveness * broadsideSlots;
    const shotsToKill = Math.ceil(defenderShip.health / effectiveDamage);
    const ttk = shotsToKill * attackerWeapon.cooldown;
    return ttk;
  }

  // Get representative ships for each class
  const representativeShips = $derived(() => {
    const ships = $dataStore.ships.filter(s => s.isPlayable);
    const byClass: Record<string, Ship[]> = {};

    for (const ship of ships) {
      const shipClass = SHIP_TYPE_TO_CLASS[ship.type] || 'Combat';
      if (!byClass[shipClass]) byClass[shipClass] = [];
      byClass[shipClass].push(ship);
    }

    // Get the highest tier (best) ship from each class
    const result: Ship[] = [];
    for (const cls of ['Combat', 'Fast', 'Heavy', 'Transport', 'Siege']) {
      const classShips = byClass[cls] || [];
      if (classShips.length > 0) {
        // Sort by tier (lower is better) then by health
        classShips.sort((a, b) => a.tier - b.tier || b.health - a.health);
        result.push(classShips[0]);
      }
    }

    return result;
  });

  // Get representative weapons
  const representativeWeapons = $derived(() => {
    const weapons = $dataStore.weapons;
    const categories = ['Cannon', 'Carronade', 'Culverin', 'Mortar'];
    const result: Weapon[] = [];

    for (const cat of categories) {
      const catWeapons = weapons.filter(w => w.category === cat);
      if (catWeapons.length > 0) {
        // Get highest penetration weapon in category
        catWeapons.sort((a, b) => b.penetration - a.penetration);
        result.push(catWeapons[0]);
      }
    }

    return result;
  });

  // Build TTK matrix
  const ttkMatrix = $derived(() => {
    const ships = representativeShips();
    const weapons = representativeWeapons();

    return weapons.map(weapon => ({
      weapon,
      ttks: ships.map(ship => ({
        ship,
        ttk: calculateTTK(weapon, ship),
        effectiveness: calculateEffectiveness(weapon.penetration, ship.armor)
      }))
    }));
  });

  // Format TTK for display
  function formatTTK(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  // Get color based on TTK (lower is better/redder, higher is worse/greener for defender)
  function getTTKColor(ttk: number, allTTKs: number[]): string {
    if (allTTKs.length === 0) return 'var(--text-muted)';
    const min = safeMin(allTTKs, ttk);
    const max = safeMax(allTTKs, ttk);
    if (max === min) return 'var(--warning)'; // All same TTK
    const normalized = (ttk - min) / (max - min);

    // Gradient from red (fast kill) to green (slow kill)
    if (normalized < 0.33) return 'var(--error)';
    if (normalized < 0.66) return 'var(--warning)';
    return 'var(--success)';
  }
</script>

<div class="ttk-matrix">
  <h2 class="section-title">Time-to-Kill Matrix</h2>
  <p class="section-desc">
    Estimated time to destroy each ship class with different weapon types.
    Based on datamined combat mechanics: effectiveness = max(10%, (penetration - armor) / penetration)
  </p>

  <div class="matrix-container">
    {#if representativeShips().length > 0 && representativeWeapons().length > 0}
      <div class="matrix-scroll">
        <table class="ttk-table">
          <thead>
            <tr>
              <th class="weapon-header">Weapon</th>
              {#each representativeShips() as ship}
                <th class="ship-header">
                  <span class="ship-name">{ship.name}</span>
                  <Badge variant="class" value={SHIP_TYPE_TO_CLASS[ship.type] || ship.type} size="sm" />
                  <span class="ship-stats">
                    HP: {ship.health.toLocaleString()} | Armor: {ship.armor.toFixed(1)}
                  </span>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each ttkMatrix() as row}
              {@const allTTKs = row.ttks.map(t => t.ttk)}
              <tr>
                <td class="weapon-cell">
                  <span class="weapon-name">{row.weapon.name}</span>
                  <span class="weapon-stats">
                    Pen: {row.weapon.penetration} | CD: {row.weapon.cooldown}s
                  </span>
                </td>
                {#each row.ttks as { ship, ttk, effectiveness }}
                  <td
                    class="ttk-cell"
                    style="--ttk-color: {getTTKColor(ttk, allTTKs)}"
                  >
                    <span class="ttk-value">{formatTTK(ttk)}</span>
                    <span class="ttk-eff">{Math.round(effectiveness * 100)}% eff</span>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <div class="loading-state">
        <p>Loading combat data...</p>
      </div>
    {/if}
  </div>

  <div class="legend">
    <h4 class="legend-title">Legend</h4>
    <div class="legend-items">
      <div class="legend-item">
        <span class="legend-color" style="background: var(--error)"></span>
        <span>Fast Kill (&lt;33%)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: var(--warning)"></span>
        <span>Medium (33-66%)</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: var(--success)"></span>
        <span>Slow Kill (&gt;66%)</span>
      </div>
    </div>
  </div>

  <div class="mechanics-info">
    <h4 class="info-title">Combat Mechanics</h4>
    <ul class="info-list">
      <li><strong>Armor Scale:</strong> 0-11.5 (Huracan has max 11.5)</li>
      <li><strong>Penetration:</strong> Cannons 13-17, Carronades 20-32.5, Mortars 100-305</li>
      <li><strong>Effectiveness Floor:</strong> Minimum 10% damage always applies</li>
      <li><strong>Mortars:</strong> Ignore armor (pen &gt;= 50), always deal full damage</li>
    </ul>
  </div>
</div>

<style>
  .ttk-matrix {
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
    line-height: var(--leading-relaxed);
  }

  .matrix-container {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .matrix-scroll {
    overflow-x: auto;
  }

  .ttk-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  .ttk-table th,
  .ttk-table td {
    padding: var(--space-md);
    text-align: center;
    border-bottom: 1px solid var(--wood-dark);
  }

  .weapon-header {
    text-align: left;
    background: var(--bg-tertiary);
    font-family: var(--font-display);
    color: var(--brass-light);
    min-width: 150px;
  }

  .ship-header {
    background: var(--bg-tertiary);
    min-width: 140px;
  }

  .ship-name {
    display: block;
    font-family: var(--font-display);
    color: var(--canvas);
    margin-bottom: var(--space-xs);
  }

  .ship-stats {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--space-xs);
  }

  .weapon-cell {
    text-align: left;
    background: var(--bg-secondary);
  }

  .weapon-name {
    display: block;
    font-weight: var(--font-semibold);
    color: var(--canvas);
  }

  .weapon-stats {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--space-xs);
  }

  .ttk-cell {
    background: color-mix(in srgb, var(--ttk-color) 15%, var(--bg-card));
    border-left: 3px solid var(--ttk-color);
  }

  .ttk-value {
    display: block;
    font-weight: var(--font-bold);
    font-size: var(--text-base);
    color: var(--canvas);
    font-variant-numeric: tabular-nums;
  }

  .ttk-eff {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: var(--space-xs);
  }

  .loading-state {
    padding: var(--space-xl);
    text-align: center;
    color: var(--text-muted);
  }

  .legend {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .legend-title,
  .info-title {
    font-size: var(--text-sm);
    font-family: var(--font-display);
    color: var(--brass-light);
    margin: 0 0 var(--space-sm);
  }

  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-sm);
    color: var(--canvas-aged);
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: var(--radius-sm);
  }

  .mechanics-info {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .info-list {
    margin: 0;
    padding-left: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .info-list li {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    line-height: var(--leading-relaxed);
  }

  .info-list strong {
    color: var(--brass-light);
  }

  @media (max-width: 768px) {
    .legend-items {
      flex-direction: column;
      gap: var(--space-sm);
    }
  }
</style>
