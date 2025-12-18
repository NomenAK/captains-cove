<script lang="ts">
  import type { Ammo, PowderKeg } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Card, Stack, Grid } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { getSortIndicator as getSortIndicatorUtil } from '$lib/utils/sort';

  // View tabs
  type ViewTab = 'ammo' | 'kegs';
  let activeView: ViewTab = $state('ammo');

  // Ammo filters and sort
  let searchQuery = $state('');
  let sortField = $state<'name' | 'damageFactor' | 'cost'>('name');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  // Derived states
  const hasNoData = $derived($dataStore.ammo.length === 0 && $dataStore.kegs.length === 0);

  // Filtered ammo
  const filteredAmmo = $derived.by(() => {
    let result = $dataStore.ammo;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.effects?.toLowerCase().includes(query)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'damageFactor') cmp = a.damageFactor - b.damageFactor;
      else if (sortField === 'cost') cmp = a.cost - b.cost;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  });

  const hasNoAmmoResults = $derived(filteredAmmo.length === 0 && $dataStore.ammo.length > 0);

  // View tabs
  const viewTabs = $derived([
    { id: 'ammo', label: 'Ammunition', count: $dataStore.ammo.length },
    { id: 'kegs', label: 'Powder Kegs', count: $dataStore.kegs.length }
  ]);

  // Retry loading
  function handleRetry() {
    dataStore.load();
  }

  // Sort handling
  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }

  function getSortIndicator(field: string): string {
    return getSortIndicatorUtil(field, sortField, sortDirection);
  }

  // Format percentage display
  function formatPercent(value: number): string {
    if (value === 1) return '100%';
    return `${Math.round(value * 100)}%`;
  }

  function formatModifier(value: number): string {
    if (value === 1) return '-';
    const percent = Math.round((value - 1) * 100);
    return percent > 0 ? `+${percent}%` : `${percent}%`;
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Consumables"
    subtitle="{$dataStore.ammo.length} ammunition types • {$dataStore.kegs.length} powder kegs"
  />

  <div class="category-tabs">
    <Tabs
      tabs={viewTabs}
      activeTab={activeView}
      onchange={(id) => activeView = id as ViewTab}
    />
  </div>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading consumables..." />
  {:else if hasNoData}
    <EmptyState
      icon="🧪"
      title="No consumables available"
      message="Consumables data could not be loaded. Please try again."
    />
  {:else if activeView === 'ammo'}
    <!-- Ammo View -->
    <div class="toolbar">
      <div class="filter-group filter-group--search">
        <label for="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search ammunition..."
          bind:value={searchQuery}
        />
      </div>
      <span class="filter-count">{filteredAmmo.length} types</span>
    </div>

    {#if hasNoAmmoResults}
      <EmptyState
        icon="🔍"
        title="No ammunition matches your search"
        message="Try adjusting your search criteria."
        variant="filter"
      />
    {:else}
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th class="sortable" onclick={() => handleSort('name')}>
                Name{getSortIndicator('name')}
              </th>
              <th class="sortable numeric" onclick={() => handleSort('damageFactor')}>
                Damage{getSortIndicator('damageFactor')}
              </th>
              <th class="numeric hide-mobile">Sail Dmg</th>
              <th class="numeric hide-mobile">Crew Dmg</th>
              <th class="numeric">Reload</th>
              <th class="sortable numeric" onclick={() => handleSort('cost')}>
                Cost{getSortIndicator('cost')}
              </th>
              <th class="hide-mobile">Effects</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredAmmo as ammo (ammo.id)}
              <tr>
                <td class="ammo-name">
                  {#if ammo.isRare}
                    <Badge variant="status" value="Rare" size="sm" />
                  {/if}
                  {ammo.name}
                </td>
                <td class="numeric">
                  <span class:damage-buff={ammo.damageFactor > 1} class:damage-debuff={ammo.damageFactor < 1}>
                    {formatPercent(ammo.damageFactor)}
                  </span>
                </td>
                <td class="numeric hide-mobile">{formatModifier(ammo.sailDamage)}</td>
                <td class="numeric hide-mobile">{formatModifier(ammo.crewDamage)}</td>
                <td class="numeric">{formatModifier(ammo.reloadFactor)}</td>
                <td class="numeric">{ammo.cost.toLocaleString()}</td>
                <td class="effects hide-mobile">{ammo.effects || '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Summary Cards -->
      <Grid columns="auto" minWidth="200px" gap="md">
        <Card variant="wood" padding="md">
          <div class="summary-stat">
            <span class="summary-label">Highest Damage</span>
            <span class="summary-value">
              {#if $dataStore.ammo.length > 0}
                {(() => {
                  const best = [...$dataStore.ammo].sort((a, b) => b.damageFactor - a.damageFactor)[0];
                  return `${best.name} (${formatPercent(best.damageFactor)})`;
                })()}
              {:else}
                -
              {/if}
            </span>
          </div>
        </Card>
        <Card variant="wood" padding="md">
          <div class="summary-stat">
            <span class="summary-label">Best Sail Damage</span>
            <span class="summary-value">
              {#if $dataStore.ammo.length > 0}
                {(() => {
                  const best = [...$dataStore.ammo].sort((a, b) => b.sailDamage - a.sailDamage)[0];
                  return `${best.name} (${formatModifier(best.sailDamage)})`;
                })()}
              {:else}
                -
              {/if}
            </span>
          </div>
        </Card>
        <Card variant="wood" padding="md">
          <div class="summary-stat">
            <span class="summary-label">Fastest Reload</span>
            <span class="summary-value">
              {#if $dataStore.ammo.length > 0}
                {(() => {
                  const best = [...$dataStore.ammo].sort((a, b) => a.reloadFactor - b.reloadFactor)[0];
                  return `${best.name} (${formatModifier(best.reloadFactor)})`;
                })()}
              {:else}
                -
              {/if}
            </span>
          </div>
        </Card>
        <Card variant="wood" padding="md">
          <div class="summary-stat">
            <span class="summary-label">Rare Types</span>
            <span class="summary-value">
              {$dataStore.ammo.filter(a => a.isRare).length} of {$dataStore.ammo.length}
            </span>
          </div>
        </Card>
      </Grid>
    {/if}

  {:else}
    <!-- Kegs View -->
    <Grid columns="auto" minWidth="280px" gap="md">
      {#each $dataStore.kegs as keg (keg.id)}
        <Card variant="interactive" padding="md">
          <div class="keg-card">
            <div class="keg-header">
              {#if keg.isRare}
                <Badge variant="status" value="Rare" size="sm" />
              {/if}
              <h3 class="keg-name">{keg.name}</h3>
            </div>
            <div class="keg-stats">
              <div class="stat">
                <span class="stat__label">Damage</span>
                <span class="stat__value stat__value--damage">{keg.damage}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Radius</span>
                <span class="stat__value">{keg.damageRadius}m</span>
              </div>
              <div class="stat">
                <span class="stat__label">Count</span>
                <span class="stat__value">{keg.count}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Reload</span>
                <span class="stat__value">{keg.reload}s</span>
              </div>
            </div>
            <div class="keg-footer">
              <span class="keg-cost">{keg.costGold.toLocaleString()} gold</span>
            </div>
          </div>
        </Card>
      {/each}
    </Grid>

    {#if $dataStore.kegs.length === 0}
      <EmptyState
        icon="💣"
        title="No powder kegs available"
        message="Powder keg data could not be loaded."
      />
    {/if}
  {/if}
</Stack>

<style>
  .category-tabs {
    display: flex;
    justify-content: center;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    padding: var(--space-md);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .filter-group label {
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .filter-group input {
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
    min-width: 140px;
  }

  .filter-group--search {
    flex: 1;
    min-width: 200px;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin-left: auto;
  }

  /* Table */
  .table-container {
    overflow-x: auto;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    padding: var(--space-sm) var(--space-md);
    text-align: left;
    border-bottom: 1px solid var(--wood-dark);
  }

  .table th {
    background: var(--bg-tertiary);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--brass-light);
    white-space: nowrap;
  }

  .table td {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
  }

  .table tbody tr:hover {
    background: var(--bg-hover);
  }

  .sortable {
    cursor: pointer;
    user-select: none;
  }

  .sortable:hover {
    color: var(--gold-light);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .ammo-name {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-weight: var(--font-medium);
    color: var(--canvas);
  }

  .damage-buff {
    color: var(--status-success);
    font-weight: var(--font-semibold);
  }

  .damage-debuff {
    color: var(--status-warning);
  }

  .effects {
    max-width: 200px;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  /* Keg Cards */
  .keg-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .keg-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .keg-name {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--gold-primary);
    margin: 0;
  }

  .keg-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-0-5);
  }

  .stat__label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .stat__value {
    font-size: var(--text-lg);
    color: var(--canvas);
    font-weight: var(--font-semibold);
  }

  .stat__value--damage {
    color: var(--status-error);
  }

  .keg-footer {
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .keg-cost {
    font-size: var(--text-sm);
    color: var(--gold-light);
  }

  /* Summary Stats */
  .summary-stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    text-align: center;
  }

  .summary-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .summary-value {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-count {
      margin-left: 0;
      text-align: center;
    }
  }
</style>
