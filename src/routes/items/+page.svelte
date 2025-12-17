<script lang="ts">
  import type { Resource, ResourceCategory } from '$lib/data/types';
  import { dataStore } from '$lib/stores';
  import { Badge, Tabs } from '$lib/components/ui';

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
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' \u25B2' : ' \u25BC';
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
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">Items & Resources</h1>
    <p class="page-subtitle">{$dataStore.resources.length} tradeable items and resources</p>
  </header>

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={activeCategory}
      onchange={(id) => activeCategory = id as ResourceCategory | ''}
    />
  </div>

  <div class="filters">
    <div class="filter-group filter-group--search">
      <label for="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Search items..."
        bind:value={searchQuery}
      />
    </div>
    <span class="filter-count">{filteredResources().length} items</span>
  </div>

  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Category</th>
          <th class="sortable" onclick={() => handleSort('name')}>
            Name{getSortIndicator('name')}
          </th>
          <th class="sortable numeric" onclick={() => handleSort('mediumCost')}>
            Price{getSortIndicator('mediumCost')}
          </th>
          <th class="sortable numeric" onclick={() => handleSort('mass')}>
            Mass{getSortIndicator('mass')}
          </th>
          <th class="hide-mobile">Effects</th>
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
  <div class="summary-grid">
    <div class="summary-card">
      <span class="summary-icon">⚖️</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.resources.filter(r => r.isTradeable).length}</span>
        <span class="summary-label">Trade Goods</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">🍖</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.resources.filter(r => r.isFood).length}</span>
        <span class="summary-label">Food Items</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">⚙️</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.resources.filter(r => r.category === 'material').length}</span>
        <span class="summary-label">Materials</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">⚠️</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.resources.filter(r => r.corruption > 0).length}</span>
        <span class="summary-label">Perishable</span>
      </div>
    </div>
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

  .filter-group input {
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
    min-width: 200px;
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

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-md);
  }

  .summary-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
  }

  .summary-icon {
    font-size: var(--text-2xl);
  }

  .summary-content {
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
