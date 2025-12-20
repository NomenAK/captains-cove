<script lang="ts">
  import type { Cosmetic, CosmeticType } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Stack } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';

  const types: CosmeticType[] = ['design', 'sail', 'flag', 'guild', 'private'];

  // Retry loading
  function handleRetry() {
    dataStore.load();
  }

  // Check for no data
  const hasNoData = $derived($dataStore.cosmetics.length === 0);

  // Filters
  let activeType: CosmeticType | '' = $state('');
  let showShopOnly = $state(false);
  let searchQuery = $state('');

  // Computed
  const filteredCosmetics = $derived(() => {
    let result = $dataStore.cosmetics;

    // Filter by type
    if (activeType) {
      result = result.filter(c => c.type === activeType);
    }

    // Filter by shop availability
    if (showShopOnly) {
      result = result.filter(c => c.inShop);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(query) ||
        c.nameKey.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const typeTabs = [
    { id: '', label: 'All', count: $dataStore.cosmetics.length },
    ...types.map(t => ({
      id: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
      count: $dataStore.cosmetics.filter(c => c.type === t).length
    }))
  ];

  function getTypeIcon(type: CosmeticType): string {
    const icons: Record<CosmeticType, string> = {
      design: '\uD83C\uDFA8',
      sail: '\u26F5',
      flag: '\uD83C\uDFF4',
      guild: '\uD83D\uDEE1\uFE0F',
      private: '\uD83D\uDD12'
    };
    return icons[type] || '\uD83C\uDFA8';
  }

  function getAvailabilityText(cosmetic: Cosmetic): string {
    if (!cosmetic.inShop) return 'Not Available';
    // inShop can be "true", "true Tier2", "true Tier4", etc.
    const tierMatch = cosmetic.inShop.match(/Tier(\d+)/);
    if (tierMatch) return `Tier ${tierMatch[1]}+`;
    return 'Available';
  }

  function getTierFromInShop(inShop: string | null): number | null {
    if (!inShop) return null;
    const match = inShop.match(/Tier(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Ship Cosmetics"
    subtitle="{$dataStore.cosmetics.length} cosmetic items - sails, designs, and decorations"
  />

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading cosmetics..." />
  {:else if hasNoData}
    <EmptyState
      icon="🎨"
      title="No cosmetics available"
      message="Cosmetics data could not be loaded. Please try again."
    />
  {:else}
    <div class="type-tabs">
      <Tabs
        tabs={typeTabs}
        activeTab={activeType}
        onchange={(id) => activeType = id as CosmeticType | ''}
      />
    </div>

    <div class="filters">
    <div class="filter-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={showShopOnly} />
        Shop Available Only
      </label>
    </div>

    <div class="filter-group filter-group--search">
      <label for="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Search cosmetics..."
        bind:value={searchQuery}
      />
    </div>

    <span class="filter-count">{filteredCosmetics().length} items</span>
  </div>

  <div class="cosmetics-grid">
    {#each filteredCosmetics() as cosmetic (cosmetic.id)}
      <div class="cosmetic-card" class:unavailable={!cosmetic.inShop}>
        <div class="cosmetic-card__header">
          <span class="cosmetic-icon">{getTypeIcon(cosmetic.type)}</span>
          <Badge variant="category" value={cosmetic.type} size="sm" />
        </div>
        <h3 class="cosmetic-card__name">{cosmetic.name}</h3>
        <div class="cosmetic-card__footer">
          <span class="availability" class:available={cosmetic.inShop}>
            {getAvailabilityText(cosmetic)}
          </span>
          {#if getTierFromInShop(cosmetic.inShop)}
            <Badge variant="tier" value={getTierFromInShop(cosmetic.inShop) as number} size="sm" />
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if filteredCosmetics().length === 0}
    <div class="empty-state">
      <span class="empty-icon">🎨</span>
      <p>No cosmetics found matching your filters.</p>
    </div>
  {/if}

  <!-- Summary Cards -->
  <div class="summary-grid">
    <div class="summary-card">
      <span class="summary-icon">🎨</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.cosmetics.filter(c => c.type === 'design').length}</span>
        <span class="summary-label">Designs</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">⛵</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.cosmetics.filter(c => c.type === 'sail').length}</span>
        <span class="summary-label">Sails</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">🏴</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.cosmetics.filter(c => c.type === 'flag').length}</span>
        <span class="summary-label">Flags</span>
      </div>
    </div>
    <div class="summary-card">
      <span class="summary-icon">🛒</span>
      <div class="summary-content">
        <span class="summary-value">{$dataStore.cosmetics.filter(c => c.inShop).length}</span>
        <span class="summary-label">In Shop</span>
      </div>
    </div>
  </div>
  {/if}
</Stack>

<style>

  .type-tabs {
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

  .filter-group input[type="text"] {
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
    min-width: 200px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    padding: var(--space-sm) 0;
  }

  .checkbox-label input {
    accent-color: var(--gold-primary);
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

  .cosmetics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .cosmetic-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    transition: all var(--transition-fast);
  }

  .cosmetic-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .cosmetic-card.unavailable {
    opacity: 0.6;
  }

  .cosmetic-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cosmetic-icon {
    font-size: var(--text-xl);
  }

  .cosmetic-card__name {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    color: var(--gold-primary);
    margin: 0;
    line-height: var(--leading-tight);
  }

  .cosmetic-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
    margin-top: auto;
  }

  .availability {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .availability.available {
    color: var(--success);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-3xl);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--space-md);
    opacity: 0.5;
  }

  .empty-state p {
    color: var(--text-muted);
    margin: 0;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
    font-size: var(--text-xl);
    color: var(--gold-primary);
    font-weight: var(--font-bold);
  }

  .summary-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
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
