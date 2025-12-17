<script lang="ts">
  import { dataStore, filteredWeapons, weaponFilters, weaponSort } from '$lib/stores';

  const categories = ['Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar'];
  const sizes = ['Light', 'Medium', 'Heavy'];

  function handleSort(field: string) {
    weaponSort.update(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function getSortIndicator(field: string): string {
    if ($weaponSort.field !== field) return '';
    return $weaponSort.direction === 'asc' ? ' ▲' : ' ▼';
  }
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">💣 Weapons</h1>
    <p class="page-subtitle">{$dataStore.weapons.length} cannons • {$dataStore.kegs.length} powder kegs</p>
  </header>

  <div class="filters">
    <div class="filter-group">
      <label for="category-filter">Category</label>
      <select id="category-filter" bind:value={$weaponFilters.category}>
        <option value="">All Categories</option>
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="size-filter">Size</label>
      <select id="size-filter" bind:value={$weaponFilters.size}>
        <option value="">All Sizes</option>
        {#each sizes as size}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group filter-group--search">
      <label for="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Search weapons..."
        bind:value={$weaponFilters.search}
      />
    </div>

    <span class="filter-count">{$filteredWeapons.length} weapons</span>
  </div>

  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="sortable" on:click={() => handleSort('category')}>
            Category{getSortIndicator('category')}
          </th>
          <th class="sortable" on:click={() => handleSort('sizeClass')}>
            Size{getSortIndicator('sizeClass')}
          </th>
          <th class="sortable" on:click={() => handleSort('name')}>
            Name{getSortIndicator('name')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('penetration')}>
            Pen{getSortIndicator('penetration')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('distance')}>
            Range{getSortIndicator('distance')}
          </th>
          <th class="sortable numeric" on:click={() => handleSort('cooldown')}>
            Reload{getSortIndicator('cooldown')}
          </th>
          <th class="sortable numeric hide-mobile" on:click={() => handleSort('angle')}>
            Angle{getSortIndicator('angle')}
          </th>
          <th class="numeric hide-mobile">Price</th>
        </tr>
      </thead>
      <tbody>
        {#each $filteredWeapons as weapon (weapon.id)}
          <tr>
            <td>
              <span class="category-badge category-badge--{weapon.category.toLowerCase()}">
                {weapon.category}
              </span>
            </td>
            <td>
              <span class="size-badge size-badge--{weapon.sizeClass.toLowerCase()}">
                {weapon.sizeClass}
              </span>
            </td>
            <td class="weapon-name">{weapon.name}</td>
            <td class="numeric">{weapon.penetration}</td>
            <td class="numeric">{weapon.distance}</td>
            <td class="numeric">{(weapon.cooldown ?? 0).toFixed(1)}s</td>
            <td class="numeric hide-mobile">{weapon.angle}°</td>
            <td class="numeric hide-mobile muted">{weapon.price.toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Powder Kegs Section -->
  {#if $dataStore.kegs.length > 0}
    <section class="kegs-section">
      <h2 class="section-title">Powder Kegs</h2>
      <div class="kegs-grid">
        {#each $dataStore.kegs as keg (keg.id)}
          <div class="keg-card">
            <h3 class="keg-card__name">{keg.name}</h3>
            <div class="keg-card__stats">
              <div class="stat">
                <span class="stat__label">Damage</span>
                <span class="stat__value">{keg.damage}</span>
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
          </div>
        {/each}
      </div>
    </section>
  {/if}
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
  }

  .table th.sortable:hover {
    background: linear-gradient(180deg, var(--wood-light) 0%, var(--wood-medium) 100%);
    color: var(--gold-light);
  }

  .table tbody tr:hover {
    background: rgba(181, 166, 66, 0.1);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: var(--text-muted);
  }

  .weapon-name {
    font-weight: var(--font-medium);
  }

  .category-badge,
  .size-badge {
    display: inline-block;
    padding: var(--space-0-5) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
  }

  .category-badge--cannon { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
  .category-badge--culverin { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
  .category-badge--carronade { background: rgba(234, 179, 8, 0.2); color: #facc15; }
  .category-badge--bombard { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
  .category-badge--mortar { background: rgba(239, 68, 68, 0.2); color: #f87171; }

  .size-badge--light { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
  .size-badge--medium { background: rgba(212, 168, 83, 0.2); color: var(--gold-primary); }
  .size-badge--heavy { background: rgba(239, 68, 68, 0.2); color: #f87171; }

  /* Kegs Section */
  .kegs-section {
    margin-top: var(--space-lg);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
  }

  .kegs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .keg-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .keg-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .keg-card__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat__label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .stat__value {
    font-weight: var(--font-semibold);
    color: var(--canvas);
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
</style>
