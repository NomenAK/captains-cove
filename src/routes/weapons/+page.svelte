<script lang="ts">
  import type { Weapon } from '$lib/data/types';
  import { dataStore, filteredWeapons, weaponFilters, weaponSort } from '$lib/stores';
  import { Badge, Tabs } from '$lib/components/ui';
  import { WeaponDetailModal } from '$lib/components/weapons';

  const categories = ['Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar'];
  const sizes = ['Light', 'Medium', 'Heavy'];

  // Selected weapon for modal
  let selectedWeapon: Weapon | null = $state(null);
  let modalOpen = $state(false);

  // Category tabs
  const categoryTabs = [
    { id: '', label: 'All', count: $dataStore.weapons.length },
    ...categories.map(cat => ({
      id: cat,
      label: cat,
      count: $dataStore.weapons.filter(w => w.category === cat).length
    }))
  ];

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

  function openWeaponModal(weapon: Weapon) {
    selectedWeapon = weapon;
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    selectedWeapon = null;
  }
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">💣 Weapons</h1>
    <p class="page-subtitle">{$dataStore.weapons.length} cannons • {$dataStore.kegs.length} powder kegs</p>
  </header>

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={$weaponFilters.category}
      onchange={(id) => weaponFilters.update(f => ({ ...f, category: id as typeof f.category }))}
    />
  </div>

  <div class="filters">
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
          <th class="sortable" onclick={() => handleSort('category')}>
            Category{getSortIndicator('category')}
          </th>
          <th class="sortable" onclick={() => handleSort('sizeClass')}>
            Size{getSortIndicator('sizeClass')}
          </th>
          <th class="sortable" onclick={() => handleSort('name')}>
            Name{getSortIndicator('name')}
          </th>
          <th class="sortable numeric" onclick={() => handleSort('penetration')}>
            Pen{getSortIndicator('penetration')}
          </th>
          <th class="sortable numeric" onclick={() => handleSort('distance')}>
            Range{getSortIndicator('distance')}
          </th>
          <th class="sortable numeric" onclick={() => handleSort('cooldown')}>
            Reload{getSortIndicator('cooldown')}
          </th>
          <th class="sortable numeric hide-mobile" onclick={() => handleSort('angle')}>
            Angle{getSortIndicator('angle')}
          </th>
          <th class="numeric hide-mobile">DPS</th>
        </tr>
      </thead>
      <tbody>
        {#each $filteredWeapons as weapon (weapon.id)}
          <tr class="clickable" onclick={() => openWeaponModal(weapon)}>
            <td>
              <Badge variant="category" value={weapon.category} />
            </td>
            <td>
              <Badge variant="size" value={weapon.sizeClass} />
            </td>
            <td class="weapon-name">{weapon.name}</td>
            <td class="numeric">{weapon.penetration.toFixed(1)}</td>
            <td class="numeric">{weapon.distance}m</td>
            <td class="numeric">{weapon.cooldown.toFixed(1)}s</td>
            <td class="numeric hide-mobile">{weapon.angle}°</td>
            <td class="numeric hide-mobile muted">
              {weapon.cooldown > 0 ? (weapon.penetration / weapon.cooldown).toFixed(2) : '—'}
            </td>
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
          </div>
        {/each}
      </div>
    </section>
  {/if}
</div>

<WeaponDetailModal
  weapon={selectedWeapon}
  open={modalOpen}
  onclose={closeModal}
/>

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

  .category-tabs {
    display: flex;
    justify-content: center;
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

  .table tbody tr.clickable {
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .table tbody tr.clickable:hover {
    background: rgba(181, 166, 66, 0.1);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }

  .muted {
    color: var(--text-muted);
  }

  .weapon-name {
    font-weight: var(--font-medium);
  }

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
    transition: all var(--transition-fast);
  }

  .keg-card:hover {
    border-color: var(--brass);
    box-shadow: var(--shadow-md);
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
    font-family: var(--font-mono);
  }

  .stat__value--damage {
    color: var(--error-light);
  }

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

    .filter-count {
      margin-left: 0;
      text-align: center;
    }
  }
</style>
