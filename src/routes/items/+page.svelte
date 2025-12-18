<script lang="ts">
  import type { Resource, ResourceCategory } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { getSortIndicator as getSortIndicatorUtil } from '$lib/utils/sort';

  const categories: ResourceCategory[] = ['trade', 'food', 'material', 'special'];

  // Filters
  let activeCategory: ResourceCategory | '' = $state('');
  let searchQuery = $state('');
  let sortField = $state<'name' | 'mediumCost' | 'mass'>('name');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  // Computed
  const filteredResources = $derived(() => {
    let result = $dataStore.resources;

    // Filter by category
    if (activeCategory) {
      result = result.filter(r => r.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query) ||
        r.effects.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'mediumCost') {
        comparison = a.mediumCost - b.mediumCost;
      } else if (sortField === 'mass') {
        comparison = a.mass - b.mass;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  const categoryTabs = [
    { id: '', label: 'All', count: $dataStore.resources.length },
    ...categories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: $dataStore.resources.filter(r => r.category === cat).length
    }))
  ];

  function handleSort(field: 'name' | 'mediumCost' | 'mass') {
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

  function getCategoryIcon(category: ResourceCategory): string {
    const icons: Record<ResourceCategory, string> = {
      trade: '\u2696\uFE0F',
      food: '\uD83C\uDF56',
      material: '\u2699\uFE0F',
      special: '\u2728'
    };
    return icons[category] || '\uD83D\uDCE6';
  }

  // Loading state detection
  const hasNoData = $derived($dataStore.resources.length === 0);
  const hasNoResults = $derived(filteredResources().length === 0 && !hasNoData);

  function handleRetry() {
    dataStore.load();
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Items & Resources"
    subtitle="{$dataStore.resources.length} tradeable items and resources"
  />

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading items..." />
  {:else if hasNoData}
    <EmptyState
      icon="📦"
      title="No items available"
      message="Resource data could not be loaded. Please try again."
    />
  {:else}
    <div class="category-tabs">
      <Tabs
        tabs={categoryTabs}
        activeTab={activeCategory}
        onchange={(id) => activeCategory = id as ResourceCategory | ''}
      />
    </div>

    <Toolbar>
      {#snippet children()}
        <FilterGroup label="Search" for="search" grow minWidth="200px">
          <input
            id="search"
            type="text"
            placeholder="Search items..."
            bind:value={searchQuery}
          />
        </FilterGroup>
      {/snippet}

      {#snippet actions()}
        <span class="filter-count">{filteredResources().length} items</span>
      {/snippet}
    </Toolbar>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col" class="sortable" onclick={() => handleSort('name')}>
              Name{getSortIndicator('name')}
            </th>
            <th scope="col" class="sortable numeric" onclick={() => handleSort('mediumCost')}>
              Price{getSortIndicator('mediumCost')}
            </th>
            <th scope="col" class="sortable numeric" onclick={() => handleSort('mass')}>
              Mass{getSortIndicator('mass')}
            </th>
            <th scope="col" class="hide-mobile">Effects</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredResources() as resource (resource.id)}
            <tr>
              <td>
                <Badge variant="category" value={resource.category} />
              </td>
              <td class="item-name">
                <span class="item-icon">{getCategoryIcon(resource.category)}</span>
                {resource.name}
              </td>
              <td class="numeric">{resource.mediumCost}</td>
              <td class="numeric">{resource.mass}</td>
              <td class="effects hide-mobile">
                {#if resource.isFood}
                  <span class="effect-tag effect-tag--food">Food</span>
                {/if}
                {#if resource.isTradeable}
                  <span class="effect-tag effect-tag--trade">Trade Good</span>
                {/if}
                {#if resource.corruption > 0}
                  <span class="effect-tag effect-tag--corruption">Spoils: {resource.corruption}</span>
                {/if}
                {#if !resource.isFood && !resource.isTradeable && !resource.corruption}
                  <span class="effect-none">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Summary Cards -->
    <Grid columns="auto" minWidth="180px" gap="md">
      <Card variant="wood" padding="md">
        <div class="summary-content">
          <span class="summary-icon">⚖️</span>
          <div class="summary-text">
            <span class="summary-value">{$dataStore.resources.filter(r => r.isTradeable).length}</span>
            <span class="summary-label">Trade Goods</span>
          </div>
        </div>
      </Card>
      <Card variant="wood" padding="md">
        <div class="summary-content">
          <span class="summary-icon">🍖</span>
          <div class="summary-text">
            <span class="summary-value">{$dataStore.resources.filter(r => r.isFood).length}</span>
            <span class="summary-label">Food Items</span>
          </div>
        </div>
      </Card>
      <Card variant="wood" padding="md">
        <div class="summary-content">
          <span class="summary-icon">⚙️</span>
          <div class="summary-text">
            <span class="summary-value">{$dataStore.resources.filter(r => r.category === 'material').length}</span>
            <span class="summary-label">Materials</span>
          </div>
        </div>
      </Card>
      <Card variant="wood" padding="md">
        <div class="summary-content">
          <span class="summary-icon">⚠️</span>
          <div class="summary-text">
            <span class="summary-value">{$dataStore.resources.filter(r => r.corruption > 0).length}</span>
            <span class="summary-label">Perishable</span>
          </div>
        </div>
      </Card>
    </Grid>
  {/if}
</Stack>

<style>
  .category-tabs {
    display: flex;
    justify-content: center;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
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

  .table tbody tr {
    transition: background var(--transition-fast);
  }

  .table tbody tr:hover {
    background: rgba(181, 166, 66, 0.1);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }

  .item-name {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-weight: var(--font-medium);
  }

  .item-icon {
    font-size: var(--text-lg);
  }

  .effects {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .effect-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
  }

  .effect-tag--food {
    background: var(--class-transport);
    color: var(--wood-dark);
  }

  .effect-tag--trade {
    background: var(--brass);
    color: var(--wood-dark);
  }

  .effect-tag--corruption {
    background: var(--archetype-brawler);
    color: white;
  }

  .effect-none {
    color: var(--text-muted);
  }

  .summary-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .summary-icon {
    font-size: var(--text-2xl);
  }

  .summary-text {
    display: flex;
    flex-direction: column;
  }

  .summary-value {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--gold-primary);
    font-weight: var(--font-bold);
  }

  .summary-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }
</style>
