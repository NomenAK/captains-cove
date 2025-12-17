<script lang="ts">
  import { dataStore, filteredShips, shipFilters, shipSort, shipsByClass } from '$lib/stores';

  // Ship classes for filter
  const shipClasses = ['Combat', 'Fast', 'Heavy', 'Transport', 'Siege'];
  const tiers = [1, 2, 3, 4, 5, 6, 7];

  function handleSort(field: string) {
    shipSort.update(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function getSortIndicator(field: string): string {
    if ($shipSort.field !== field) return '';
    return $shipSort.direction === 'asc' ? ' ▲' : ' ▼';
  }
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">⛵ Ships</h1>
    <p class="page-subtitle">Browse all {$dataStore.ships.length} playable ships</p>
  </header>

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

    <span class="filter-count">{$filteredShips.length} ships</span>
  </div>

  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="sortable" on:click={() => handleSort('tier')}>
            Tier{getSortIndicator('tier')}
          </th>
          <th class="sortable" on:click={() => handleSort('name')}>
            Name{getSortIndicator('name')}
          </th>
          <th class="sortable" on:click={() => handleSort('shipClass')}>
            Class{getSortIndicator('shipClass')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('health')}>
            HP{getSortIndicator('health')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('speed')}>
            Speed{getSortIndicator('speed')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('armor')}>
            Armor{getSortIndicator('armor')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('capacity')}>
            Cargo{getSortIndicator('capacity')}
          </th>
          <th class="hide-mobile">Role</th>
        </tr>
      </thead>
      <tbody>
        {#each $filteredShips as ship (ship.id)}
          <tr>
            <td>
              <span class="tier-badge tier-badge--{ship.tier}">{ship.tier}</span>
            </td>
            <td class="ship-name">{ship.name}</td>
            <td>
              <span class="class-badge class-badge--{ship.shipClass.toLowerCase()}">
                {ship.shipClass}
              </span>
            </td>
            <td class="numeric">{ship.health.toLocaleString()}</td>
            <td class="numeric">{ship.speed.toFixed(1)}</td>
            <td class="numeric">{ship.armor.toFixed(1)}</td>
            <td class="numeric">{ship.capacity.toLocaleString()}</td>
            <td class="hide-mobile muted">{ship.pvpRole || '—'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--space-md);
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

  .filters {
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

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin-left: auto;
  }

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

  .table tbody tr:hover {
    background: rgba(181, 166, 66, 0.1);
  }

  .table td {
    color: var(--canvas);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: var(--text-muted);
  }

  .ship-name {
    font-weight: var(--font-medium);
    color: var(--canvas);
  }

  .tier-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    font-weight: var(--font-bold);
    font-size: var(--text-xs);
  }

  .tier-badge--1 { background: var(--tier-1); color: var(--wood-dark); }
  .tier-badge--2 { background: var(--tier-2); color: var(--wood-dark); }
  .tier-badge--3 { background: var(--tier-3); color: white; }
  .tier-badge--4 { background: var(--tier-4); color: white; }
  .tier-badge--5 { background: var(--tier-5); color: white; }
  .tier-badge--6 { background: var(--tier-6); color: white; }
  .tier-badge--7 { background: var(--tier-7); color: white; }

  .class-badge {
    display: inline-block;
    padding: var(--space-0-5) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
  }

  .class-badge--combat { background: rgba(59, 130, 246, 0.2); color: var(--class-combat); }
  .class-badge--fast { background: rgba(34, 197, 94, 0.2); color: var(--class-fast); }
  .class-badge--heavy { background: rgba(234, 179, 8, 0.2); color: var(--class-heavy); }
  .class-badge--transport { background: rgba(168, 162, 158, 0.2); color: var(--class-transport); }
  .class-badge--siege { background: rgba(239, 68, 68, 0.2); color: var(--class-siege); }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .filters {
      flex-direction: column;
    }

    .filter-group {
      width: 100%;
    }

    .filter-group select,
    .filter-group input {
      width: 100%;
    }

    .filter-count {
      margin-left: 0;
      text-align: center;
    }
  }
</style>
