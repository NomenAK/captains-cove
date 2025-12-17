<script lang="ts">
  import { dataStore, shipsByClass, shipsByTier } from '$lib/stores';
  import { ArchetypeAnalysis, TTKMatrix, MetaAnalysis } from '$lib/components/balance';
  import { Tabs } from '$lib/components/ui';

  // Tab state
  let activeTab = $state('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'archetypes', label: 'Archetypes' },
    { id: 'ttk', label: 'TTK Matrix' },
    { id: 'meta', label: 'Meta Analysis' }
  ];

  // Stats computed from ship data
  const tierCounts = $derived(
    Object.entries($shipsByTier)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([tier, ships]) => ({ tier: Number(tier), count: ships.length }))
  );

  const classCounts = $derived(
    Object.entries($shipsByClass)
      .map(([cls, ships]) => ({ class: cls, count: ships.length }))
      .sort((a, b) => b.count - a.count)
  );

  // Top ships by various stats
  const topByHp = $derived(
    [...$dataStore.ships].sort((a, b) => b.health - a.health).slice(0, 5)
  );

  const topBySpeed = $derived(
    [...$dataStore.ships].sort((a, b) => b.speed - a.speed).slice(0, 5)
  );

  const topByArmor = $derived(
    [...$dataStore.ships].sort((a, b) => b.armor - a.armor).slice(0, 5)
  );

  const topByCargo = $derived(
    [...$dataStore.ships].sort((a, b) => b.capacity - a.capacity).slice(0, 5)
  );
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">Balance Analysis</h1>
    <p class="page-subtitle">Meta statistics, tier rankings, and combat analysis</p>
  </header>

  <Tabs {tabs} {activeTab} onchange={(id) => activeTab = id} />

  {#if activeTab === 'overview'}
    <div class="stats-overview">
      <div class="stat-section">
        <h2 class="section-title">Ships by Tier</h2>
        <div class="tier-bars">
          {#each tierCounts as { tier, count }}
            <div class="tier-bar">
              <span class="tier-bar__label">Tier {tier}</span>
              <div class="tier-bar__track">
                <div
                  class="tier-bar__fill tier-bar__fill--{tier}"
                  style="width: {(count / $dataStore.ships.length) * 100}%"
                ></div>
              </div>
              <span class="tier-bar__count">{count}</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="stat-section">
        <h2 class="section-title">Ships by Class</h2>
        <div class="class-bars">
          {#each classCounts as { class: cls, count }}
            <div class="class-bar">
              <span class="class-bar__label">{cls}</span>
              <div class="class-bar__track">
                <div
                  class="class-bar__fill class-bar__fill--{cls.toLowerCase()}"
                  style="width: {(count / $dataStore.ships.length) * 100}%"
                ></div>
              </div>
              <span class="class-bar__count">{count}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <section class="section">
      <h2 class="section-title">Top Ships by Stat</h2>
      <div class="top-ships-grid">
        <div class="top-card">
          <h3 class="top-card__title">Highest HP</h3>
          {#each topByHp as ship, i}
            <div class="top-item">
              <span class="top-item__rank">#{i + 1}</span>
              <span class="top-item__name">{ship.name}</span>
              <span class="top-item__value">{ship.health.toLocaleString()}</span>
            </div>
          {/each}
        </div>

        <div class="top-card">
          <h3 class="top-card__title">Fastest Speed</h3>
          {#each topBySpeed as ship, i}
            <div class="top-item">
              <span class="top-item__rank">#{i + 1}</span>
              <span class="top-item__name">{ship.name}</span>
              <span class="top-item__value">{ship.speed.toFixed(1)}</span>
            </div>
          {/each}
        </div>

        <div class="top-card">
          <h3 class="top-card__title">Best Armor</h3>
          {#each topByArmor as ship, i}
            <div class="top-item">
              <span class="top-item__rank">#{i + 1}</span>
              <span class="top-item__name">{ship.name}</span>
              <span class="top-item__value">{ship.armor.toFixed(1)}</span>
            </div>
          {/each}
        </div>

        <div class="top-card">
          <h3 class="top-card__title">Largest Cargo</h3>
          {#each topByCargo as ship, i}
            <div class="top-item">
              <span class="top-item__rank">#{i + 1}</span>
              <span class="top-item__name">{ship.name}</span>
              <span class="top-item__value">{ship.capacity.toLocaleString()}</span>
            </div>
          {/each}
        </div>
      </div>
    </section>

  {:else if activeTab === 'archetypes'}
    <ArchetypeAnalysis />

  {:else if activeTab === 'ttk'}
    <TTKMatrix />

  {:else if activeTab === 'meta'}
    <MetaAnalysis />
  {/if}
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
  }

  .page-header {
    text-align: center;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-xs);
  }

  .page-subtitle {
    color: var(--text-muted);
    margin: 0;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  .stat-section {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .tier-bars,
  .class-bars {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .tier-bar,
  .class-bar {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .tier-bar__label,
  .class-bar__label {
    width: 80px;
    font-size: var(--text-sm);
    color: var(--canvas-aged);
  }

  .tier-bar__track,
  .class-bar__track {
    flex: 1;
    height: 20px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .tier-bar__fill,
  .class-bar__fill {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width var(--transition-base);
  }

  .tier-bar__fill--1 { background: var(--tier-1); }
  .tier-bar__fill--2 { background: var(--tier-2); }
  .tier-bar__fill--3 { background: var(--tier-3); }
  .tier-bar__fill--4 { background: var(--tier-4); }
  .tier-bar__fill--5 { background: var(--tier-5); }
  .tier-bar__fill--6 { background: var(--tier-6); }
  .tier-bar__fill--7 { background: var(--tier-7); }

  .class-bar__fill--combat { background: var(--class-combat); }
  .class-bar__fill--fast { background: var(--class-fast); }
  .class-bar__fill--heavy { background: var(--class-heavy); }
  .class-bar__fill--transport { background: var(--class-transport); }
  .class-bar__fill--siege { background: var(--class-siege); }
  .class-bar__fill--imperial { background: var(--class-imperial); }

  .tier-bar__count,
  .class-bar__count {
    width: 30px;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--brass-light);
  }

  .section {
    margin-top: var(--space-md);
  }

  .top-ships-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .top-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .top-card__title {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .top-item {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--wood-dark);
  }

  .top-item:last-child {
    border-bottom: none;
  }

  .top-item__rank {
    width: 30px;
    font-weight: var(--font-bold);
    color: var(--gold-primary);
  }

  .top-item__name {
    flex: 1;
    color: var(--canvas);
  }

  .top-item__value {
    font-variant-numeric: tabular-nums;
    color: var(--brass-light);
  }

  @media (max-width: 768px) {
    .stats-overview {
      grid-template-columns: 1fr;
    }
  }
</style>
