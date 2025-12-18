<script lang="ts" generics="T extends Record<string, unknown>">
  import type { Snippet } from 'svelte';

  interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    numeric?: boolean;
    width?: string;
    hideOnMobile?: boolean;
    render?: Snippet<[T]>;
  }

  interface Props<T> {
    data: T[];
    columns: Column<T>[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    rowKey?: keyof T;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
    stickyHeader?: boolean;
    emptyMessage?: string;
    onsort?: (field: string) => void;
    onrowclick?: (row: T) => void;
    rowRender?: Snippet<[T, number]>;
  }

  let {
    data,
    columns,
    sortField,
    sortDirection = 'asc',
    rowKey = 'id' as keyof T,
    striped = false,
    hoverable = true,
    compact = false,
    stickyHeader = false,
    emptyMessage = 'No data available',
    onsort,
    onrowclick,
    rowRender
  }: Props<T> = $props();

  function getSortIndicator(field: string): string {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  }

  function handleHeaderClick(column: Column<T>) {
    if (column.sortable && onsort) {
      onsort(String(column.key));
    }
  }

  function getCellValue(row: T, key: keyof T | string): unknown {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>, row as Record<string, unknown>);
    }
    return row[key as keyof T];
  }
</script>

<div class="table-container" class:table-container--sticky={stickyHeader}>
  <table class="data-table" class:data-table--striped={striped} class:data-table--compact={compact}>
    <thead>
      <tr>
        {#each columns as column (column.key)}
          <th
            class:sortable={column.sortable}
            class:numeric={column.numeric}
            class:hide-mobile={column.hideOnMobile}
            class:sorted={sortField === column.key}
            style:width={column.width}
            onclick={() => handleHeaderClick(column)}
            onkeydown={(e) => e.key === 'Enter' && handleHeaderClick(column)}
            tabindex={column.sortable ? 0 : undefined}
            role={column.sortable ? 'button' : undefined}
            aria-sort={sortField === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
          >
            {column.label}{#if column.sortable}{getSortIndicator(String(column.key))}{/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if data.length === 0}
        <tr class="empty-row">
          <td colspan={columns.length}>
            <div class="empty-state">
              <span class="empty-icon">📭</span>
              <span class="empty-message">{emptyMessage}</span>
            </div>
          </td>
        </tr>
      {:else}
        {#each data as row, index (row[rowKey])}
          {#if rowRender}
            {@render rowRender(row, index)}
          {:else}
            <tr
              class:clickable={onrowclick}
              class:hoverable
              onclick={() => onrowclick?.(row)}
              onkeydown={(e) => e.key === 'Enter' && onrowclick?.(row)}
              tabindex={onrowclick ? 0 : undefined}
            >
              {#each columns as column, colIndex (column.key)}
                <td
                  class:numeric={column.numeric}
                  class:hide-mobile={column.hideOnMobile}
                >
                  {#if colIndex === 0 && onrowclick}
                    <button class="sr-only" onclick={() => onrowclick?.(row)}>
                      View details
                    </button>
                  {/if}
                  {#if column.render}
                    {@render column.render(row)}
                  {:else}
                    {getCellValue(row, column.key)}
                  {/if}
                </td>
              {/each}
            </tr>
          {/if}
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    overflow-x: auto;
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .table-container--sticky {
    max-height: 600px;
    overflow-y: auto;
  }

  .table-container--sticky thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .data-table--compact th,
  .data-table--compact td {
    padding: var(--space-xs) var(--space-sm);
  }

  .data-table th,
  .data-table td {
    padding: var(--space-sm) var(--space-md);
    text-align: left;
    border-bottom: 1px solid var(--wood-dark);
  }

  .data-table th {
    background: linear-gradient(180deg, var(--wood-medium) 0%, var(--wood-dark) 100%);
    color: var(--brass-light);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
    position: relative;
  }

  .data-table th.sortable {
    cursor: pointer;
    user-select: none;
  }

  .data-table th.sortable:hover {
    background: linear-gradient(180deg, var(--wood-light) 0%, var(--wood-medium) 100%);
    color: var(--gold-light);
  }

  .data-table th.sortable:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--gold-primary);
  }

  .data-table th.sorted {
    color: var(--gold-primary);
  }

  .data-table th.sorted::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gold-primary);
  }

  .data-table tbody tr.hoverable:hover {
    background: rgba(181, 166, 66, 0.08);
  }

  .data-table tbody tr.clickable {
    cursor: pointer;
  }

  .data-table tbody tr.clickable:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--gold-primary);
  }

  .data-table--striped tbody tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.2);
  }

  .numeric {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono);
  }

  .hide-mobile {
    display: table-cell;
  }

  .empty-row td {
    padding: var(--space-xl);
    text-align: center;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
  }

  .empty-icon {
    font-size: var(--text-3xl);
    opacity: 0.5;
  }

  .empty-message {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .data-table th,
    .data-table td {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-xs);
    }
  }
</style>
