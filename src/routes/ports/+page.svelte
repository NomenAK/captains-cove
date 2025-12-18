<script lang="ts">
  import type { Port, PortType } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';

  const portTypes: PortType[] = ['Bay', 'City', 'NeutralBay', 'PirateBay'];

  // Filter state
  let selectedType = $state<string>('');
  let searchQuery = $state<string>('');

  // Derived filtered ports
  const filteredPorts = $derived.by(() => {
    let result = $dataStore.ports;

    if (selectedType) {
      result = result.filter(p => p.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.producedResource?.toLowerCase().includes(query)) ||
        (p.flags?.toLowerCase().includes(query))
      );
    }

    return result;
  });

  // Group by type for display
  const portsByType = $derived.by(() => {
    const groups: Record<string, Port[]> = {};
    for (const type of portTypes) {
      const items = filteredPorts.filter(p => p.type === type);
      if (items.length > 0) {
        groups[type] = items;
      }
    }
    return groups;
  });

  const hasNoData = $derived($dataStore.ports.length === 0);
  const hasNoResults = $derived(filteredPorts.length === 0 && !hasNoData);

  function handleRetry() {
    dataStore.load();
  }

  // Type tabs
  const typeTabs = $derived([
    { id: '', label: 'All', count: $dataStore.ports.length },
    ...portTypes.map(type => ({
      id: type,
      label: getTypeLabel(type),
      count: $dataStore.ports.filter(p => p.type === type).length
    }))
  ]);

  function getTypeLabel(type: PortType): string {
    switch (type) {
      case 'Bay': return 'Bay';
      case 'City': return 'City';
      case 'NeutralBay': return 'Neutral';
      case 'PirateBay': return 'Pirate';
      default: return type;
    }
  }

  function getTypeIcon(type: PortType): string {
    switch (type) {
      case 'Bay': return '⚓';
      case 'City': return '🏰';
      case 'NeutralBay': return '⚖️';
      case 'PirateBay': return '🏴‍☠️';
      default: return '🏝️';
    }
  }

  function getTypeColor(type: PortType): string {
    switch (type) {
      case 'Bay': return 'var(--teal)';
      case 'City': return 'var(--gold-primary)';
      case 'NeutralBay': return 'var(--canvas)';
      case 'PirateBay': return 'var(--error-light)';
      default: return 'var(--text-muted)';
    }
  }

  function parseFlags(flags: string | null): string[] {
    if (!flags) return [];
    return flags.split(' ').filter(f => f.trim());
  }

  function formatResourceName(resource: string | null): string {
    if (!resource) return 'None';
    // Remove T prefix and ID suffix
    return resource.replace(/^T/, '').replace(/ID$/, '');
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="World Ports"
    subtitle="{$dataStore.ports.length} ports across the seas"
  />

  <div class="category-tabs">
    <Tabs
      tabs={typeTabs}
      activeTab={selectedType}
      onchange={(id) => selectedType = id}
    />
  </div>

  <Toolbar>
    {#snippet children()}
      <FilterGroup label="Search" for="search" grow minWidth="200px">
        <input
          id="search"
          type="text"
          placeholder="Search ports..."
          bind:value={searchQuery}
        />
      </FilterGroup>
    {/snippet}

    {#snippet actions()}
      <span class="filter-count">{filteredPorts.length} ports</span>
    {/snippet}
  </Toolbar>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading ports..." />
  {:else if hasNoData}
    <EmptyState
      icon="🗺️"
      title="No ports available"
      message="Port data could not be loaded. Please try again."
    />
  {:else if hasNoResults}
    <EmptyState
      icon="🔍"
      title="No ports match your filters"
      message="Try adjusting your search criteria."
      variant="filter"
    />
  {:else if selectedType}
    <!-- Single type view -->
    <Grid columns="auto" minWidth="280px" gap="md">
      {#each filteredPorts as port (port.id)}
        <Card variant="wood" padding="md">
          <div class="port-card">
            <div class="port-card__header">
              <span class="port-card__icon" style="color: {getTypeColor(port.type)}">
                {getTypeIcon(port.type)}
              </span>
              <div class="port-card__info">
                <h3 class="port-card__name">{port.name}</h3>
                <Badge variant="category" value={getTypeLabel(port.type)} />
              </div>
            </div>

            <div class="port-card__stats">
              <div class="stat">
                <span class="stat__label">Build Ranks</span>
                <span class="stat__value">{port.buildRanks || '—'}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Team Limit</span>
                <span class="stat__value">{port.teamLimit ?? '∞'}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Fixed Level</span>
                <span class="stat__value">{port.fixedLevel || '—'}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Resource</span>
                <span class="stat__value stat__value--resource">
                  {formatResourceName(port.producedResource)}
                </span>
              </div>
            </div>

            {#if port.flags}
              <div class="port-card__flags">
                <span class="flags-label">Flags:</span>
                <div class="flags-list">
                  {#each parseFlags(port.flags) as flag}
                    <span class="flag-badge">{flag}</span>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </Card>
      {/each}
    </Grid>
  {:else}
    <!-- All types grouped -->
    {#each Object.entries(portsByType) as [type, ports] (type)}
      <section class="type-section">
        <h2 class="section-title">
          <span class="section-icon" style="color: {getTypeColor(type as PortType)}">
            {getTypeIcon(type as PortType)}
          </span>
          {getTypeLabel(type as PortType)} Ports
          <span class="section-count">({ports.length})</span>
        </h2>
        <Grid columns="auto" minWidth="280px" gap="md">
          {#each ports as port (port.id)}
            <Card variant="wood" padding="md">
              <div class="port-card">
                <div class="port-card__header">
                  <h3 class="port-card__name">{port.name}</h3>
                </div>

                <div class="port-card__stats">
                  <div class="stat">
                    <span class="stat__label">Build Ranks</span>
                    <span class="stat__value">{port.buildRanks || '—'}</span>
                  </div>
                  <div class="stat">
                    <span class="stat__label">Team Limit</span>
                    <span class="stat__value">{port.teamLimit ?? '∞'}</span>
                  </div>
                  <div class="stat">
                    <span class="stat__label">Resource</span>
                    <span class="stat__value stat__value--resource">
                      {formatResourceName(port.producedResource)}
                    </span>
                  </div>
                </div>

                {#if port.flags}
                  <div class="port-card__flags">
                    <span class="flags-label">Flags:</span>
                    <div class="flags-list">
                      {#each parseFlags(port.flags) as flag}
                        <span class="flag-badge">{flag}</span>
                      {/each}
                    </div>
                  </div>
                {/if}
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

  .type-section {
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

  .port-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .port-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .port-card__icon {
    font-size: var(--text-2xl);
    flex-shrink: 0;
  }

  .port-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .port-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .port-card__stats {
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

  .stat__value--resource {
    color: var(--teal);
  }

  .port-card__flags {
    margin-top: var(--space-xs);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .flags-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    display: block;
    margin-bottom: var(--space-xs);
  }

  .flags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .flag-badge {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    color: var(--brass);
  }
</style>
