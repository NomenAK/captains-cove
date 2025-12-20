<script lang="ts">
  import type { Consumable, ConsumableCategory } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card, ImageWithFallback } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { getConsumableIconUrl } from '$lib/utils/storage';

  // Categories
  const categories: ConsumableCategory[] = ['mending', 'equipment', 'group'];

  // Filter state
  let selectedCategory = $state<ConsumableCategory | ''>('');
  let searchQuery = $state<string>('');

  // Filtered consumables
  const filteredConsumables = $derived.by(() => {
    let result = $dataStore.consumables;

    if (selectedCategory) {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        (c.description?.toLowerCase().includes(query)) ||
        c.effects?.some(e => e.description?.toLowerCase().includes(query))
      );
    }

    return result;
  });

  // Group by category
  const consumablesByCategory = $derived.by(() => {
    const groups: Record<string, Consumable[]> = {};
    for (const category of categories) {
      const items = filteredConsumables.filter(c => c.category === category);
      if (items.length > 0) {
        groups[category] = items;
      }
    }
    return groups;
  });

  const hasNoData = $derived($dataStore.consumables.length === 0);
  const hasNoResults = $derived(filteredConsumables.length === 0 && !hasNoData);

  function handleRetry() {
    dataStore.load();
  }

  // Category tabs
  const categoryTabs = $derived([
    { id: '', label: 'All', count: $dataStore.consumables.length },
    ...categories.map(cat => ({
      id: cat,
      label: getCategoryLabel(cat),
      count: $dataStore.consumables.filter(c => c.category === cat).length
    }))
  ]);

  function getCategoryLabel(category: ConsumableCategory): string {
    switch (category) {
      case 'mending': return 'Repair';
      case 'equipment': return 'Equipment';
      case 'group': return 'Group Buffs';
      default: return category;
    }
  }

  function getCategoryIcon(category: ConsumableCategory): string {
    switch (category) {
      case 'mending': return '🔧';
      case 'equipment': return '⛵';
      case 'group': return '👥';
      default: return '🧪';
    }
  }

  function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Instant';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  function formatCooldown(seconds: number): string {
    if (seconds <= 0) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Consumables"
    subtitle="{$dataStore.consumables.length} activatable powerups"
  />

  <div class="category-tabs">
    <Tabs
      tabs={categoryTabs}
      activeTab={selectedCategory}
      onchange={(id) => selectedCategory = id as ConsumableCategory | ''}
    />
  </div>

  <Toolbar>
    <FilterGroup label="Search" for="search" grow minWidth="200px">
      <input
        id="search"
        type="text"
        placeholder="Search consumables..."
        bind:value={searchQuery}
      />
    </FilterGroup>

    {#snippet actions()}
      <span class="filter-count">{filteredConsumables.length} consumables</span>
    {/snippet}
  </Toolbar>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading consumables..." />
  {:else if hasNoData}
    <EmptyState
      icon="🧪"
      title="No consumables available"
      message="Consumable data could not be loaded. Please try again."
    />
  {:else if hasNoResults}
    <EmptyState
      icon="🔍"
      title="No consumables match your filters"
      message="Try adjusting your search criteria."
      variant="filter"
    />
  {:else if selectedCategory}
    <!-- Single category view -->
    <Grid columns="auto" minWidth="300px" gap="md">
      {#each filteredConsumables as consumable (consumable.id)}
        <Card variant="wood" padding="md">
          <div class="consumable-card">
            <div class="consumable-card__header">
              <div class="consumable-card__icon-container">
                {#if consumable.icon}
                  <ImageWithFallback
                    src={getConsumableIconUrl(consumable.icon)}
                    alt={consumable.name}
                    fallback={getCategoryIcon(consumable.category)}
                    class="consumable-card__icon-img"
                  />
                {:else}
                  <span class="consumable-card__icon">{getCategoryIcon(consumable.category)}</span>
                {/if}
              </div>
              <div class="consumable-card__info">
                <h3 class="consumable-card__name">{consumable.name}</h3>
                <div class="consumable-card__badges">
                  <Badge variant="category" value={getCategoryLabel(consumable.category)} />
                  {#if consumable.isGroupEffect}
                    <Badge variant="status" value="Group" size="sm" />
                  {/if}
                </div>
              </div>
            </div>

            {#if consumable.description}
              <p class="consumable-card__description">{consumable.description}</p>
            {/if}

            {#if consumable.effects && consumable.effects.length > 0}
              <div class="consumable-card__effects">
                <span class="effects-label">Effects:</span>
                <ul class="effects-list">
                  {#each consumable.effects as effect, i (i)}
                    <li class="effect-item">{effect.description || effect.type}</li>
                  {/each}
                </ul>
              </div>
            {/if}

            <div class="consumable-card__stats">
              <div class="stat">
                <span class="stat__label">Duration</span>
                <span class="stat__value">{formatDuration(consumable.duration)}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Cooldown</span>
                <span class="stat__value">{formatCooldown(consumable.cooldown)}</span>
              </div>
              {#if consumable.craftingGold > 0}
                <div class="stat">
                  <span class="stat__label">Craft Cost</span>
                  <span class="stat__value stat__value--gold">{consumable.craftingGold.toLocaleString()}</span>
                </div>
              {/if}
              {#if consumable.minRank}
                <div class="stat">
                  <span class="stat__label">Min Rank</span>
                  <span class="stat__value">{consumable.minRank}</span>
                </div>
              {/if}
            </div>

            {#if consumable.craftingResources && consumable.craftingResources.length > 0}
              <div class="consumable-card__crafting">
                <span class="crafting-label">Crafting:</span>
                <div class="crafting-resources">
                  {#each consumable.craftingResources as resource, i (i)}
                    <span class="crafting-resource">{resource.quantity}x {resource.name}</span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </Card>
      {/each}
    </Grid>
  {:else}
    <!-- All categories grouped -->
    {#each Object.entries(consumablesByCategory) as [category, consumables] (category)}
      <section class="category-section">
        <h2 class="section-title">
          <span class="section-icon">{getCategoryIcon(category as ConsumableCategory)}</span>
          {getCategoryLabel(category as ConsumableCategory)}
          <span class="section-count">({consumables.length})</span>
        </h2>
        <Grid columns="auto" minWidth="300px" gap="md">
          {#each consumables as consumable (consumable.id)}
            <Card variant="wood" padding="md">
              <div class="consumable-card">
                <div class="consumable-card__header">
                  <div class="consumable-card__icon-container">
                    {#if consumable.icon}
                      <ImageWithFallback
                        src={getConsumableIconUrl(consumable.icon)}
                        alt={consumable.name}
                        fallback={getCategoryIcon(consumable.category)}
                        class="consumable-card__icon-img"
                      />
                    {:else}
                      <span class="consumable-card__icon">{getCategoryIcon(consumable.category)}</span>
                    {/if}
                  </div>
                  <div class="consumable-card__info">
                    <h3 class="consumable-card__name">{consumable.name}</h3>
                    {#if consumable.isGroupEffect}
                      <Badge variant="status" value="Group" size="sm" />
                    {/if}
                  </div>
                </div>

                {#if consumable.description}
                  <p class="consumable-card__description">{consumable.description}</p>
                {/if}

                {#if consumable.effects && consumable.effects.length > 0}
                  <div class="consumable-card__effects">
                    <span class="effects-label">Effects:</span>
                    <ul class="effects-list">
                      {#each consumable.effects as effect, i (i)}
                        <li class="effect-item">{effect.description || effect.type}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}

                <div class="consumable-card__stats">
                  <div class="stat">
                    <span class="stat__label">Duration</span>
                    <span class="stat__value">{formatDuration(consumable.duration)}</span>
                  </div>
                  <div class="stat">
                    <span class="stat__label">Cooldown</span>
                    <span class="stat__value">{formatCooldown(consumable.cooldown)}</span>
                  </div>
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

  .consumable-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .consumable-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .consumable-card__icon-container {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .consumable-card__icon-container :global(.consumable-card__icon-img) {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .consumable-card__icon {
    font-size: var(--text-2xl);
  }

  .consumable-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .consumable-card__badges {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .consumable-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .consumable-card__description {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .consumable-card__effects {
    margin-top: var(--space-xs);
  }

  .effects-label,
  .crafting-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    display: block;
    margin-bottom: var(--space-xs);
  }

  .effects-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .effect-item {
    font-size: var(--text-sm);
    color: var(--teal);
    padding-left: var(--space-sm);
    border-left: 2px solid var(--teal);
  }

  .consumable-card__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: var(--space-sm);
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
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

  .stat__value--gold {
    color: var(--gold-primary);
  }

  .consumable-card__crafting {
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .crafting-resources {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .crafting-resource {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    color: var(--brass);
  }
</style>
