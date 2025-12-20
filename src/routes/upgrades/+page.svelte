<script lang="ts">
  import type { Upgrade } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card, ImageWithFallback } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { getUpgradeIconUrl } from '$lib/utils/storage';

  // Categories for filtering
  const categories = ['Support', 'Protection', 'Combat', 'Speed'] as const;

  // Filter state
  let selectedCategory = $state<string>('');
  let searchQuery = $state<string>('');

  // Derived filtered upgrades
  const filteredUpgrades = $derived.by(() => {
    let result = $dataStore.upgrades;

    if (selectedCategory) {
      result = result.filter(u => u.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(query) ||
        (u.description?.toLowerCase().includes(query)) ||
        (u.effects?.toLowerCase().includes(query))
      );
    }

    return result;
  });

  // Group by category for display
  const upgradesByCategory = $derived.by(() => {
    const groups: Record<string, Upgrade[]> = {};
    for (const category of categories) {
      const items = filteredUpgrades.filter(u => u.category === category);
      if (items.length > 0) {
        groups[category] = items;
      }
    }
    return groups;
  });

  const hasNoData = $derived($dataStore.upgrades.length === 0);
  const hasNoResults = $derived(filteredUpgrades.length === 0 && !hasNoData);

  function handleRetry() {
    dataStore.load();
  }

  // Category tabs
  const categoryTabs = $derived([
    { id: '', label: 'All', count: $dataStore.upgrades.length },
    ...categories.map(cat => ({
      id: cat,
      label: cat,
      count: $dataStore.upgrades.filter(u => u.category === cat).length
    }))
  ]);

  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'Support': return '🔧';
      case 'Protection': return '🛡️';
      case 'Combat': return '⚔️';
      case 'Speed': return '💨';
      default: return '📦';
    }
  }

  function parseEffects(effects: string | null): string[] {
    if (!effects) return [];
    return effects.split(' ').filter(e => e.trim());
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Ship Upgrades"
    subtitle="{$dataStore.upgrades.length} modules available"
  />

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={selectedCategory}
      onchange={(id) => selectedCategory = id}
    />
  </div>

  <Toolbar>
    <FilterGroup label="Search" for="search" grow minWidth="200px">
      <input
        id="search"
        type="text"
        placeholder="Search upgrades..."
        bind:value={searchQuery}
      />
    </FilterGroup>

    {#snippet actions()}
      <span class="filter-count">{filteredUpgrades.length} upgrades</span>
    {/snippet}
  </Toolbar>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading upgrades..." />
  {:else if hasNoData}
    <EmptyState
      icon="🔧"
      title="No upgrades available"
      message="Upgrade data could not be loaded. Please try again."
    />
  {:else if hasNoResults}
    <EmptyState
      icon="🔍"
      title="No upgrades match your filters"
      message="Try adjusting your search criteria."
      variant="filter"
    />
  {:else if selectedCategory}
    <!-- Single category view -->
    <Grid columns="auto" minWidth="280px" gap="md">
      {#each filteredUpgrades as upgrade (upgrade.id)}
        <Card variant="wood" padding="md">
          <div class="upgrade-card">
            <div class="upgrade-card__header">
              <div class="upgrade-card__icon-container">
                {#if upgrade.icon}
                  <ImageWithFallback
                    src={getUpgradeIconUrl(upgrade.icon)}
                    alt={upgrade.name}
                    fallback={getCategoryIcon(upgrade.category)}
                    class="upgrade-card__icon-img"
                  />
                {:else}
                  <span class="upgrade-card__icon">{getCategoryIcon(upgrade.category)}</span>
                {/if}
              </div>
              <div class="upgrade-card__info">
                <h3 class="upgrade-card__name">{upgrade.name}</h3>
                <Badge variant="category" value={upgrade.category} />
              </div>
            </div>

            {#if upgrade.description}
              <p class="upgrade-card__description">{upgrade.description}</p>
            {/if}

            {#if upgrade.effects}
              <div class="upgrade-card__effects">
                <span class="effects-label">Effects:</span>
                <div class="effects-list">
                  {#each parseEffects(upgrade.effects) as effect, i (i)}
                    <span class="effect-badge">{effect}</span>
                  {/each}
                </div>
              </div>
            {/if}

            <div class="upgrade-card__meta">
              {#if upgrade.cost}
                <span class="meta-item meta-item--gold">Has Cost</span>
              {/if}
              {#if upgrade.strength}
                <span class="meta-item meta-item--strength">Strength Tiers</span>
              {/if}
              {#if upgrade.craftResource}
                <span class="meta-item meta-item--craft">Crafted: {upgrade.craftResource}</span>
              {/if}
            </div>
          </div>
        </Card>
      {/each}
    </Grid>
  {:else}
    <!-- All categories grouped -->
    {#each Object.entries(upgradesByCategory) as [category, upgrades] (category)}
      <section class="category-section">
        <h2 class="section-title">
          <span class="section-icon">{getCategoryIcon(category)}</span>
          {category}
          <span class="section-count">({upgrades.length})</span>
        </h2>
        <Grid columns="auto" minWidth="280px" gap="md">
          {#each upgrades as upgrade (upgrade.id)}
            <Card variant="wood" padding="md">
              <div class="upgrade-card">
                <div class="upgrade-card__header">
                  <div class="upgrade-card__icon-container">
                    {#if upgrade.icon}
                      <ImageWithFallback
                        src={getUpgradeIconUrl(upgrade.icon)}
                        alt={upgrade.name}
                        fallback={getCategoryIcon(upgrade.category)}
                        class="upgrade-card__icon-img"
                      />
                    {:else}
                      <span class="upgrade-card__icon">{getCategoryIcon(upgrade.category)}</span>
                    {/if}
                  </div>
                  <h3 class="upgrade-card__name">{upgrade.name}</h3>
                </div>

                {#if upgrade.description}
                  <p class="upgrade-card__description">{upgrade.description}</p>
                {/if}

                {#if upgrade.effects}
                  <div class="upgrade-card__effects">
                    <span class="effects-label">Effects:</span>
                    <div class="effects-list">
                      {#each parseEffects(upgrade.effects) as effect, i (i)}
                        <span class="effect-badge">{effect}</span>
                      {/each}
                    </div>
                  </div>
                {/if}

                <div class="upgrade-card__meta">
                  {#if upgrade.cost}
                    <span class="meta-item meta-item--gold">Has Cost</span>
                  {/if}
                  {#if upgrade.strength}
                    <span class="meta-item meta-item--strength">Strength Tiers</span>
                  {/if}
                  {#if upgrade.craftResource}
                    <span class="meta-item meta-item--craft">Crafted: {upgrade.craftResource}</span>
                  {/if}
                </div>
              </div>
            </Card>
          {/each}
        </Grid>
      </section>
    {/each}
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

  .category-section {
    margin-bottom: var(--space-xl);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .section-icon {
    font-size: var(--text-2xl);
  }

  .section-count {
    color: var(--text-muted);
    font-size: var(--text-base);
    font-weight: normal;
  }

  .upgrade-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .upgrade-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .upgrade-card__icon-container {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upgrade-card__icon-container :global(.upgrade-card__icon-img) {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .upgrade-card__icon {
    font-size: var(--text-2xl);
  }

  .upgrade-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .upgrade-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .upgrade-card__description {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .upgrade-card__effects {
    margin-top: var(--space-xs);
  }

  .effects-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    display: block;
    margin-bottom: var(--space-xs);
  }

  .effects-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .effect-badge {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    color: var(--teal);
  }

  .upgrade-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .meta-item {
    font-size: var(--text-xs);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    background: var(--bg-elevated);
    color: var(--text-muted);
  }

  .meta-item--gold {
    color: var(--gold-primary);
  }

  .meta-item--strength {
    color: var(--teal);
  }

  .meta-item--craft {
    color: var(--brass);
  }
</style>
