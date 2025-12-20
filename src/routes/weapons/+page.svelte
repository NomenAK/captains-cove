<script lang="ts">
  import type { Weapon } from '$lib/data/types';
  import { dataStore, filteredWeapons, weaponFilters, weaponSort, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card, ImageWithFallback } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { WeaponDetailModal } from '$lib/components/weapons';
  import { getSortIndicator as getSortIndicatorUtil } from '$lib/utils/sort';
  import { getWeaponIconUrl, getKegIconUrl, getAmmoIconUrl } from '$lib/utils/storage';

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

  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'Cannon': return '💣';
      case 'Culverin': return '🎯';
      case 'Carronade': return '⚔️';
      case 'Bombard': return '💥';
      case 'Mortar': return '🔥';
      default: return '💣';
    }
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Weapons"
    subtitle="{$dataStore.weapons.length} cannons - {$dataStore.ammo.length} ammo types - {$dataStore.kegs.length} powder kegs"
  />

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={$weaponFilters.category}
      onchange={(id) => weaponFilters.update(f => ({ ...f, category: id as typeof f.category }))}
    />
  </div>

  <Toolbar>
    <FilterGroup label="Size" for="size-filter">
      <select id="size-filter" bind:value={$weaponFilters.size}>
        <option value="">All Sizes</option>
        {#each sizes as size (size)}
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
            <th scope="col" class="col-icon"></th>
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
              <td class="col-icon">
                <div class="weapon-icon">
                  {#if weapon.icon}
                    <ImageWithFallback
                      src={getWeaponIconUrl(weapon.icon)}
                      alt={weapon.name}
                      fallback={getCategoryIcon(weapon.category)}
                      class="weapon-icon__img"
                    />
                  {:else}
                    <span class="weapon-icon__fallback">{getCategoryIcon(weapon.category)}</span>
                  {/if}
                </div>
              </td>
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

  <!-- Ammunition Section -->
  {#if $dataStore.ammo.length > 0}
    <section class="ammo-section">
      <h2 class="section-title">Ammunition</h2>
      <Grid columns="auto" minWidth="280px" gap="md">
        {#each $dataStore.ammo as ammo (ammo.id)}
          <Card variant="wood" padding="md">
            <div class="ammo-card">
              <div class="ammo-card__header">
                <div class="ammo-card__icon-container">
                  {#if ammo.icon}
                    <ImageWithFallback
                      src={getAmmoIconUrl(ammo.icon)}
                      alt={ammo.name}
                      fallback="🔴"
                      class="ammo-card__icon-img"
                    />
                  {:else}
                    <span class="ammo-card__icon">🔴</span>
                  {/if}
                </div>
                <div class="ammo-card__info">
                  <h3 class="ammo-card__name">{ammo.name}</h3>
                  {#if ammo.isRare}
                    <Badge variant="status" value="Rare" size="sm" />
                  {/if}
                </div>
              </div>

              {#if ammo.description}
                <p class="ammo-card__description">{ammo.description}</p>
              {/if}

              <div class="ammo-card__stats">
                <div class="stat">
                  <span class="stat__label">Damage</span>
                  <span class="stat__value" class:stat__value--positive={ammo.damageFactor > 1} class:stat__value--negative={ammo.damageFactor < 1}>
                    {ammo.damageFactor > 1 ? '+' : ''}{((ammo.damageFactor - 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <div class="stat">
                  <span class="stat__label">Penetration</span>
                  <span class="stat__value">{ammo.penetration.toFixed(1)}</span>
                </div>
                <div class="stat">
                  <span class="stat__label">Reload</span>
                  <span class="stat__value" class:stat__value--positive={ammo.reloadFactor < 1} class:stat__value--negative={ammo.reloadFactor > 1}>
                    {ammo.reloadFactor > 1 ? '+' : ''}{((ammo.reloadFactor - 1) * 100).toFixed(0)}%
                  </span>
                </div>
                <div class="stat">
                  <span class="stat__label">Range</span>
                  <span class="stat__value" class:stat__value--positive={ammo.distanceFactor > 1} class:stat__value--negative={ammo.distanceFactor < 1}>
                    {ammo.distanceFactor > 1 ? '+' : ''}{((ammo.distanceFactor - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div class="ammo-card__effects">
                {#if ammo.sailDamage > 0}
                  <span class="effect-tag effect-tag--sail">Sail +{ammo.sailDamage}</span>
                {/if}
                {#if ammo.crewDamage > 0}
                  <span class="effect-tag effect-tag--crew">Crew +{ammo.crewDamage}</span>
                {/if}
                {#if ammo.effects}
                  <span class="effect-tag effect-tag--special">{ammo.effects}</span>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </Grid>
    </section>
  {/if}

  <!-- Powder Kegs Section -->
  {#if $dataStore.kegs.length > 0}
    <section class="kegs-section">
      <h2 class="section-title">Powder Kegs</h2>
      <Grid columns="auto" minWidth="200px" gap="md">
        {#each $dataStore.kegs as keg (keg.id)}
          <Card variant="wood" padding="md">
            <div class="keg-card__header">
              <div class="keg-card__icon-container">
                {#if keg.icon}
                  <ImageWithFallback
                    src={getKegIconUrl(keg.icon)}
                    alt={keg.name}
                    fallback="🛢️"
                    class="keg-card__icon-img"
                  />
                {:else}
                  <span class="keg-card__icon">🛢️</span>
                {/if}
              </div>
              <h3 class="keg-card__name">{keg.name}</h3>
            </div>
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

  /* Weapon Icons */
  .col-icon {
    width: 48px;
    padding: var(--space-xs) !important;
  }

  .weapon-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .weapon-icon :global(.weapon-icon__img) {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .weapon-icon__fallback {
    font-size: var(--text-xl);
  }

  /* Ammo Section */
  .ammo-section {
    margin-top: var(--space-md);
  }

  .ammo-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .ammo-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .ammo-card__icon-container {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ammo-card__icon-container :global(.ammo-card__icon-img) {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .ammo-card__icon {
    font-size: var(--text-2xl);
  }

  .ammo-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .ammo-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .ammo-card__description {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .ammo-card__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
    margin-top: var(--space-xs);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .stat__value--positive {
    color: var(--teal);
  }

  .stat__value--negative {
    color: var(--error-light);
  }

  .ammo-card__effects {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-xs);
  }

  .effect-tag {
    font-size: var(--text-xs);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--bg-elevated);
  }

  .effect-tag--sail {
    color: var(--class-transport);
  }

  .effect-tag--crew {
    color: var(--archetype-brawler);
  }

  .effect-tag--special {
    color: var(--brass);
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

  .keg-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .keg-card__icon-container {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .keg-card__icon-container :global(.keg-card__icon-img) {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .keg-card__icon {
    font-size: var(--text-xl);
  }

  .keg-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
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
