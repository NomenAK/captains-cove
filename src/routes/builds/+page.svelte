<script lang="ts">
  import { buildsStore, filteredBuilds, buildFilters, buildCount, toasts } from '$lib/stores';
  import { BuildEditor, BuildDetail } from '$lib/components/builds';
  import { Badge, Toolbar, FilterGroup, Stack, Grid, EmptyState } from '$lib/components/ui';
  import { PageHeader, Breadcrumb } from '$lib/components/layout';
  import { location, querystring } from 'svelte-spa-router';

  // Determine current view from URL
  const currentPath = $derived($location);

  // Parse build ID from path
  const buildId = $derived(() => {
    const match = currentPath.match(/^\/builds\/([^/]+)/);
    return match ? match[1] : null;
  });

  // Determine view mode
  const viewMode = $derived(() => {
    if (currentPath === '/builds/new') return 'create';
    if (currentPath.endsWith('/edit')) return 'edit';
    if (buildId()) return 'detail';
    return 'list';
  });

  // Get current build for detail/edit views
  const currentBuild = $derived(buildId() ? buildsStore.get(buildId()!) : null);

  // Breadcrumbs for different views
  const breadcrumbs = $derived(() => {
    const base = { label: 'Builds', href: '#/builds' };

    switch (viewMode()) {
      case 'create':
        return [base, { label: 'New Build' }];
      case 'detail':
        return [base, { label: currentBuild?.name || 'Build Details' }];
      case 'edit':
        return [
          base,
          { label: currentBuild?.name || 'Build', href: `#/builds/${buildId()}` },
          { label: 'Edit' }
        ];
      default:
        return [];
    }
  });

  const archetypes = ['brawler', 'kite', 'sniper', 'pursuit', 'trade', 'siege'];
  const archetypeLabels: Record<string, string> = {
    brawler: 'Brawler',
    kite: 'Kite',
    sniper: 'Sniper',
    pursuit: 'Pursuit',
    trade: 'Trade',
    siege: 'Siege'
  };

  function handleExport() {
    const json = buildsStore.export();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captains-cove-builds.json';
    a.click();
    URL.revokeObjectURL(url);
    toasts.success('Builds exported successfully');
  }

  let importInput: HTMLInputElement;

  function handleImportClick() {
    importInput.click();
  }

  async function handleImport(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = buildsStore.import(text);

      if (result.errors.length > 0) {
        toasts.warning(`Imported ${result.imported} builds with ${result.errors.length} errors`);
      } else if (result.imported > 0) {
        toasts.success(`Imported ${result.imported} builds`);
      } else {
        toasts.info('No builds to import');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error reading file';
      toasts.error(`Failed to read file: ${message}`);
      console.error('File import error:', err);
    } finally {
      input.value = '';
    }
  }
</script>

{#if viewMode() === 'create'}
  <Stack direction="vertical" gap="md">
    <Breadcrumb crumbs={breadcrumbs()} />
    <BuildEditor mode="create" />
  </Stack>

{:else if viewMode() === 'edit' && currentBuild}
  <Stack direction="vertical" gap="md">
    <Breadcrumb crumbs={breadcrumbs()} />
    <BuildEditor mode="edit" build={currentBuild} />
  </Stack>

{:else if viewMode() === 'detail' && currentBuild}
  <Stack direction="vertical" gap="md">
    <Breadcrumb crumbs={breadcrumbs()} />
    <BuildDetail build={currentBuild} />
  </Stack>

{:else if viewMode() === 'detail' && !currentBuild}
  <Stack direction="vertical" gap="lg" align="center">
    <EmptyState
      icon="🔍"
      title="Build Not Found"
      message="The build you're looking for doesn't exist or has been deleted."
    />
    <a href="#/builds" class="btn btn--primary">Back to Builds</a>
  </Stack>

{:else}
  <!-- List View -->
  <Stack direction="vertical" gap="lg">
    <PageHeader
      title="Ship Builds"
      subtitle="{$buildCount} saved builds - Create, customize, and share your ship configurations"
    />

    <Toolbar>
      {#snippet children()}
        <FilterGroup label="Archetype" for="archetype-filter">
          <select id="archetype-filter" bind:value={$buildFilters.archetype}>
            <option value="">All Archetypes</option>
            {#each archetypes as arch}
              <option value={arch}>{archetypeLabels[arch]}</option>
            {/each}
          </select>
        </FilterGroup>

        <FilterGroup label="Search" for="search" grow minWidth="200px">
          <input
            id="search"
            type="text"
            placeholder="Search builds..."
            bind:value={$buildFilters.search}
          />
        </FilterGroup>
      {/snippet}

      {#snippet actions()}
        <a href="#/builds/new" class="btn btn--primary">
          + New Build
        </a>
        <button class="btn btn--secondary" onclick={handleExport} disabled={$buildCount === 0}>
          Export All
        </button>
        <button class="btn btn--secondary" onclick={handleImportClick}>
          Import
        </button>
        <input
          bind:this={importInput}
          type="file"
          accept=".json"
          onchange={handleImport}
          style="display: none;"
        />
      {/snippet}
    </Toolbar>

    {#if $filteredBuilds.length === 0}
      <EmptyState
        icon="🚢"
        title="No Builds Yet"
        message="Create your first ship build to get started, or import existing builds."
      >
        <div class="empty-actions">
          <a href="#/builds/new" class="btn btn--primary">Create Build</a>
          <button class="btn btn--secondary" onclick={handleImportClick}>Import Builds</button>
        </div>
      </EmptyState>
    {:else}
      <Grid columns="auto" minWidth="300px" gap="lg">
        {#each $filteredBuilds as build (build.id)}
          <a href="#/builds/{build.id}" class="build-card">
            <div class="build-card__header">
              <Badge variant="archetype" value={build.archetype} size="sm" />
              <Badge variant="tier" value={build.tier} size="sm" />
            </div>
            <h3 class="build-card__name">{build.name}</h3>
            <p class="build-card__strategy">{build.strategy || 'No strategy description'}</p>
            <div class="build-card__footer">
              <span class="build-card__score">Score: {build.estimatedScore}</span>
              <span class="build-card__date">
                {new Date(build.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </a>
        {/each}
      </Grid>
    {/if}
  </Stack>
{/if}

<style>
  .btn {
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    border: 2px solid transparent;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn--primary {
    background: var(--gold-primary);
    color: var(--wood-dark);
    border-color: var(--gold-dark);
  }

  .btn--primary:hover:not(:disabled) {
    background: var(--gold-light);
  }

  .btn--secondary {
    background: var(--bg-tertiary);
    color: var(--canvas);
    border-color: var(--wood-grain);
  }

  .btn--secondary:hover:not(:disabled) {
    border-color: var(--brass);
  }

  .empty-actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-md);
  }

  .build-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    text-decoration: none;
    transition: all var(--transition-fast);
    cursor: pointer;
  }

  .build-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .build-card:focus-visible {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .build-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .build-card__name {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--gold-primary);
    margin: 0;
  }

  .build-card__strategy {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    flex: 1;
    margin: 0;
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .build-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .build-card__score {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--brass-light);
  }

  .build-card__date {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .empty-actions {
      flex-direction: column;
      width: 100%;
    }

    .empty-actions .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
