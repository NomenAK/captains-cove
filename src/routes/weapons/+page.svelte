<script lang="ts">
  import type { Weapon } from '$lib/data/types';
  import { dataStore, filteredWeapons, weaponFilters, weaponSort, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { WeaponDetailModal } from '$lib/components/weapons';
  import { getSortIndicator as getSortIndicatorUtil } from '$lib/utils/sort';

  const categories = ['Cannon', 'Culverin', 'Carronade', 'Bombard', 'Mortar'];
  const sizes = ['Light', 'Medium', 'Heavy'];

  // Selected weapon for modal
  let selectedWeapon: Weapon | null = $state(null);
  let modalOpen = $state(false);

  // Derived states for empty detection
  const hasNoData = $derived($dataStore.weapons.length === 0);
  const hasNoResults = $derived($filteredWeapons.length === 0 && !hasNoData);

  // Retry loading
  function handleRetry() {
    dataStore.load();
  }

  // Category tabs
  const categoryTabs = $derived([
    { id: '', label: 'All', count: $dataStore.weapons.length },
    ...categories.map(cat => ({
      id: cat,
      label: cat,
      count: $dataStore.weapons.filter(w => w.category === cat).length
    }))
  ]);

  function handleSort(field: string) {
    weaponSort.update(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  function getSortIndicator(field: string): string {
    return getSortIndicatorUtil(field, $weaponSort.field, $weaponSort.direction);
  }

  function openWeaponModal(weapon: Weapon) {
    selectedWeapon = weapon;
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    selectedWeapon = null;
  }

  function handleRowKeydown(event: KeyboardEvent, weapon: Weapon) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openWeaponModal(weapon);
    }
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Weapons"
    subtitle="{$dataStore.weapons.length} cannons - {$dataStore.kegs.length} powder kegs"
  />

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={$weaponFilters.category}
      onchange={(id) => weaponFilters.update(f => ({ ...f, category: id as typeof f.category }))}
    />
  </div>

  <Toolbar>
    {#snippet children()}
      <FilterGroup label="Size" for="size-filter">
        <select id="size-filter" bind:value={$weaponFilters.size}>
          <option value="">All Sizes</option>
          {#each sizes as size}
            <option value={size}>{size}</option>
          {/each}
        </select>
      </FilterGroup>

      <FilterGroup label="Search" for="search" grow minWidth="200px">
        <input
          id="search"
          type="text"
          placeholder="Search weapons..."
          bind:value={$weaponFilters.search}
        />
      </FilterGroup>
    {/snippet}

    {#snippet actions()}
      <span class="filter-count">{$filteredWeapons.length} weapons</span>
    {/snippet}
  </Toolbar>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading weapons..." />
  {:else if hasNoData}
    <EmptyState
      icon="💣"
      title="No weapons available"
      message="Weapon data could not be loaded. Please try again."
    />
  {:else if hasNoResults}
    <EmptyState
      icon="🔍"
      title="No weapons match your filters"
      message="Try adjusting your search criteria or clearing filters."
      variant="filter"
    />
  {:else}
    <div class="table-nautical">
      <table>
        <thead>
          <tr>
            <th scope="col" class="sortable" onclick={() => handleSort('category')}>
              Category{getSortIndicator('category')}
            </th>
            <th scope="col" class="sortable" onclick={() => handleSort('sizeClass')}>
              Size{getSortIndicator('sizeClass')}
            </th>
            <th scope="col" class="sortable" onclick={() => handleSort('name')}>
              Name{getSortIndicator('name')}
            </th>
            <th scope="col" class="sortable col-numeric" onclick={() => handleSort('penetration')}>
              Pen{getSortIndicator('penetration')}
            </th>
            <th scope="col" class="sortable col-numeric" onclick={() => handleSort('distance')}>
              Range{getSortIndicator('distance')}
            </th>
            <th scope="col" class="sortable col-numeric" onclick={() => handleSort('cooldown')}>
              Reload{getSortIndicator('cooldown')}
            </th>
            <th scope="col" class="sortable col-numeric hide-mobile" onclick={() => handleSort('angle')}>
              Angle{getSortIndicator('angle')}
            </th>
            <th scope="col" class="col-numeric hide-mobile">DPS</th>
          </tr>
        </thead>
        <tbody>
          {#each $filteredWeapons as weapon (weapon.id)}
            <tr
              tabindex="0"
              role="button"
              aria-label="View details for {weapon.name}"
              onclick={() => openWeaponModal(weapon)}
              onkeydown={(e) => handleRowKeydown(e, weapon)}
            >
              <td>
                <Badge variant="category" value={weapon.category} />
              </td>
              <td>
                <Badge variant="size" value={weapon.sizeClass} />
              </td>
              <td class="col-name">{weapon.name}</td>
              <td class="col-numeric">{weapon.penetration.toFixed(1)}</td>
              <td class="col-numeric">{weapon.distance}m</td>
              <td class="col-numeric">{weapon.cooldown.toFixed(1)}s</td>
              <td class="col-numeric hide-mobile">{weapon.angle}°</td>
              <td class="col-numeric col-muted hide-mobile">
                {weapon.cooldown > 0 ? (weapon.penetration / weapon.cooldown).toFixed(2) : '—'}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- Powder Kegs Section -->
  {#if $dataStore.kegs.length > 0}
    <section class="kegs-section">
      <h2 class="section-title">Powder Kegs</h2>
      <Grid columns="auto" minWidth="200px" gap="md">
        {#each $dataStore.kegs as keg (keg.id)}
          <Card variant="wood" padding="md">
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
          </Card>
        {/each}
      </Grid>
    </section>
  {/if}
</Stack>

<WeaponDetailModal
  weapon={selectedWeapon}
  open={modalOpen}
  onclose={closeModal}
/>

<style>
  .category-tabs {
    display: flex;
    justify-content: center;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  /* Kegs Section */
  .kegs-section {
    margin-top: var(--space-md);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
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
</style>
