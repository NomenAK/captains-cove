<script lang="ts">
  import type { Ship } from '$lib/data/types';
  import { dataStore, filteredShips, shipFilters, shipSort, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { ShipDetailModal } from '$lib/components/ships';
  import { getSortIndicator as getSortIndicatorUtil } from '$lib/utils/sort';

  // Derived states for empty detection
  const hasNoData = $derived($dataStore.ships.length === 0);
  const hasNoResults = $derived($filteredShips.length === 0 && !hasNoData);

  // Retry loading
  function handleRetry() {
    dataStore.load();
  }

  // Ship classes and tiers for filters
  const shipClasses = ['Combat', 'Fast', 'Heavy', 'Transport', 'Siege'];
  const tiers = [1, 2, 3, 4, 5, 6, 7];

  // View mode (table or cards)
  let viewMode: 'table' | 'cards' = $state('table');

  // Selected ship for modal
  let selectedShip: Ship | null = $state(null);
  let modalOpen = $state(false);

  function handleSort(field: string) {
    shipSort.update(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function getSortIndicator(field: string): string {
    return getSortIndicatorUtil(field, $shipSort.field, $shipSort.direction);
  }

  function openShipModal(ship: Ship) {
    selectedShip = ship;
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    selectedShip = null;
  }

  const viewTabs = [
    { id: 'table', label: 'Table', icon: '📋' },
    { id: 'cards', label: 'Cards', icon: '🃏' }
  ];
</script>

<div class="page">
  <PageHeader
    title="⛵ Ships"
    subtitle="Browse all {$dataStore.ships.length} playable ships"
  />

  <div class="toolbar">
    <div class="filters">
      <div class="filter-group">
        <label for="class-filter">Class</label>
        <select id="class-filter" bind:value={$shipFilters.class}>
          <option value="">All Classes</option>
          {#each shipClasses as cls}
            <option value={cls}>{cls}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="tier-filter">Tier</label>
        <select id="tier-filter" bind:value={$shipFilters.tier}>
          <option value="">All Tiers</option>
          {#each tiers as tier}
            <option value={tier}>Tier {tier}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group filter-group--search">
        <label for="search">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search ships..."
          bind:value={$shipFilters.search}
        />
      </div>
    </div>

    <div class="toolbar-right">
      <span class="filter-count">{$filteredShips.length} ships</span>
      <Tabs
        tabs={viewTabs}
        activeTab={viewMode}
        onchange={(id) => viewMode = id as 'table' | 'cards'}
      />
    </div>
  </div>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading ships..." />
  {:else if hasNoData}
    <EmptyState
      icon="⛵"
      title="No ships available"
      message="Ship data could not be loaded. Please try again."
    />
  {:else if hasNoResults}
    <EmptyState
      icon="🔍"
      title="No ships match your filters"
      message="Try adjusting your search criteria or clearing filters."
      variant="filter"
    />
  {:else if viewMode === 'table'}
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th class="sortable" onclick={() => handleSort('tier')}>
              Tier{getSortIndicator('tier')}
            </th>
            <th class="sortable" onclick={() => handleSort('name')}>
              Name{getSortIndicator('name')}
            </th>
            <th class="sortable" onclick={() => handleSort('type')}>
              Class{getSortIndicator('type')}
            </th>
            <th class="sortable numeric" onclick={() => handleSort('health')}>
              HP{getSortIndicator('health')}
            </th>
            <th class="sortable numeric" onclick={() => handleSort('speed')}>
              Speed{getSortIndicator('speed')}
            </th>
            <th class="sortable numeric" onclick={() => handleSort('armor')}>
              Armor{getSortIndicator('armor')}
            </th>
            <th class="sortable numeric hide-mobile" onclick={() => handleSort('capacity')}>
              Cargo{getSortIndicator('capacity')}
            </th>
            <th class="numeric hide-mobile">Crew</th>
          </tr>
        </thead>
        <tbody>
          {#each $filteredShips as ship (ship.id)}
            <tr class="clickable" onclick={() => openShipModal(ship)}>
              <td>
                <Badge variant="tier" value={ship.tier} />
              </td>
              <td class="ship-name">{ship.name}</td>
              <td>
                <Badge variant="class" value={ship.type} />
              </td>
              <td class="numeric">{ship.health.toLocaleString()}</td>
              <td class="numeric">{ship.speed.toFixed(1)}</td>
              <td class="numeric">{ship.armor.toFixed(1)}</td>
              <td class="numeric hide-mobile">{ship.capacity.toLocaleString()}</td>
              <td class="numeric hide-mobile muted">{ship.crewSlots}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if viewMode === 'cards'}
    <div class="cards-grid">
      {#each $filteredShips as ship (ship.id)}
        <button class="ship-card" onclick={() => openShipModal(ship)}>
          <div class="ship-card__header">
            <Badge variant="tier" value={ship.tier} size="sm" />
            <Badge variant="class" value={ship.type} size="sm" />
          </div>
          <h3 class="ship-card__name">{ship.name}</h3>
          <div class="ship-card__stats">
            <div class="stat-item">
              <span class="stat-label">HP</span>
              <span class="stat-value">{ship.health.toLocaleString()}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Speed</span>
              <span class="stat-value">{ship.speed.toFixed(1)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Armor</span>
              <span class="stat-value">{ship.armor.toFixed(1)}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cargo</span>
              <span class="stat-value">{ship.capacity.toLocaleString()}</span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<ShipDetailModal
  ship={selectedShip}
  open={modalOpen}
  onclose={closeModal}
/>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    justify-content: space-between;
    padding: var(--space-md);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    flex: 1;
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

  .filter-group select,
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

  .filter-group--search input {
    width: 100%;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  /* Table styles */
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
    background: linear-gradient(180deg, var(--wood-medium) 0%, var(--wood-dark) 100%);
    color: var(--brass-light);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
  }

  .table th.sortable {
    cursor: pointer;
    user-select: none;
  }

  .table th.sortable:hover {
    background: linear-gradient(180deg, var(--wood-light) 0%, var(--wood-medium) 100%);
    color: var(--gold-light);
  }

  .table tbody tr.clickable {
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .table tbody tr.clickable:hover {
    background: rgba(181, 166, 66, 0.1);
  }

  .table td {
    color: var(--canvas);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }

  .muted {
    color: var(--text-muted);
  }

  .ship-name {
    font-weight: var(--font-medium);
    color: var(--canvas);
  }

  /* Cards grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
    gap: var(--space-md);
  }

  @media (max-width: 480px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
  }

  .ship-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .ship-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .ship-card:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .ship-card__header {
    display: flex;
    gap: var(--space-xs);
  }

  .ship-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .ship-card__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-xs);
    margin-top: var(--space-xs);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
  }

  .stat-label {
    color: var(--text-muted);
  }

  .stat-value {
    color: var(--canvas);
    font-family: var(--font-mono);
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .toolbar {
      flex-direction: column;
    }

    .filters {
      flex-direction: column;
      width: 100%;
    }

    .filter-group {
      width: 100%;
    }

    .filter-group select,
    .filter-group input {
      width: 100%;
    }

    .toolbar-right {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
