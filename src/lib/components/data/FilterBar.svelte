<script lang="ts">
  import type { Snippet } from 'svelte';

  interface FilterOption {
    value: string;
    label: string;
  }

  interface FilterConfig {
    id: string;
    label: string;
    options: FilterOption[];
    value: string;
  }

  interface Props {
    filters: FilterConfig[];
    searchValue?: string;
    searchPlaceholder?: string;
    resultCount?: number;
    resultLabel?: string;
    onfilterchange?: (filterId: string, value: string) => void;
    onsearchchange?: (value: string) => void;
    actions?: Snippet;
  }

  let {
    filters,
    searchValue = '',
    searchPlaceholder = 'Search...',
    resultCount,
    resultLabel = 'results',
    onfilterchange,
    onsearchchange,
    actions
  }: Props = $props();
</script>

<div class="filter-bar">
  <div class="filter-bar__filters">
    {#each filters as filter (filter.id)}
      <div class="filter-group">
        <label class="filter-label" for="filter-{filter.id}">
          {filter.label}
        </label>
        <select
          id="filter-{filter.id}"
          class="filter-select"
          value={filter.value}
          onchange={(e) => onfilterchange?.(filter.id, (e.target as HTMLSelectElement).value)}
        >
          {#each filter.options as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    {/each}

    <div class="filter-group filter-group--search">
      <label class="filter-label" for="filter-search">Search</label>
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input
          id="filter-search"
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          oninput={(e) => onsearchchange?.((e.target as HTMLInputElement).value)}
          class="filter-input"
        />
        {#if searchValue}
          <button
            class="search-clear"
            onclick={() => onsearchchange?.('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        {/if}
      </div>
    </div>
  </div>

  <div class="filter-bar__right">
    {#if resultCount !== undefined}
      <span class="result-count">
        {resultCount.toLocaleString()} {resultLabel}
      </span>
    {/if}

    {#if actions}
      <div class="filter-bar__actions">
        {@render actions()}
      </div>
    {/if}
  </div>
</div>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    justify-content: space-between;
    padding: var(--space-md);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .filter-bar__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    flex: 1;
    min-width: 0;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    min-width: 120px;
  }

  .filter-group--search {
    flex: 1;
    min-width: 200px;
    max-width: 400px;
  }

  .filter-label {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .filter-select,
  .filter-input {
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--canvas);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .filter-select:hover,
  .filter-input:hover {
    border-color: var(--brass);
  }

  .filter-select:focus,
  .filter-input:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.2);
  }

  .search-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: var(--space-sm);
    font-size: var(--text-sm);
    opacity: 0.5;
    pointer-events: none;
  }

  .search-input .filter-input {
    width: 100%;
    padding-left: calc(var(--space-md) + 16px);
    padding-right: calc(var(--space-md) + 24px);
  }

  .search-clear {
    position: absolute;
    right: var(--space-xs);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .search-clear:hover {
    background: var(--error);
    color: var(--canvas);
  }

  .search-clear:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.3);
  }

  /* Touch target compliance */
  @media (max-width: 768px) {
    .search-clear {
      width: 44px;
      height: 44px;
      right: 0;
    }
  }

  .filter-bar__right {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .result-count {
    font-size: var(--text-sm);
    color: var(--text-muted);
    white-space: nowrap;
  }

  .filter-bar__actions {
    display: flex;
    gap: var(--space-sm);
  }

  @media (max-width: 768px) {
    .filter-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-bar__filters {
      flex-direction: column;
    }

    .filter-group {
      min-width: 100%;
    }

    .filter-group--search {
      max-width: none;
    }

    .filter-bar__right {
      justify-content: space-between;
    }
  }
</style>
