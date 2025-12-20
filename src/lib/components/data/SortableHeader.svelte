<script lang="ts">
  interface Props {
    field: string;
    label: string;
    currentField?: string;
    direction?: 'asc' | 'desc';
    numeric?: boolean;
    onsort?: (field: string) => void;
  }

  let {
    field,
    label,
    currentField,
    direction = 'asc',
    numeric = false,
    onsort
  }: Props = $props();

  // Use $derived for reactive comparison
  const isActive = $derived(currentField === field);

  function handleClick() {
    onsort?.(field);
  }

  function getIndicator(): string {
    if (!isActive) return '';
    return direction === 'asc' ? ' ▲' : ' ▼';
  }
</script>

<th
  class="sortable-header"
  class:sortable-header--active={isActive}
  class:sortable-header--numeric={numeric}
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  tabindex={0}
  role="columnheader"
  aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
>
  <span class="sortable-header__label">{label}</span>
  <span class="sortable-header__indicator" class:visible={isActive}>
    {getIndicator()}
  </span>
</th>

<style>
  .sortable-header {
    cursor: pointer;
    user-select: none;
    transition: all var(--transition-fast);
    background: linear-gradient(180deg, var(--wood-medium) 0%, var(--wood-dark) 100%);
    color: var(--brass-light);
    font-weight: var(--font-semibold);
    text-transform: uppercase;
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
    padding: var(--space-sm) var(--space-md);
    text-align: left;
    border-bottom: 1px solid var(--wood-dark);
    position: relative;
  }

  .sortable-header--numeric {
    text-align: right;
  }

  .sortable-header:hover {
    background: linear-gradient(180deg, var(--wood-light) 0%, var(--wood-medium) 100%);
    color: var(--gold-light);
  }

  .sortable-header:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--gold-primary);
  }

  .sortable-header--active {
    color: var(--gold-primary);
  }

  .sortable-header--active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gold-primary);
  }

  .sortable-header__label {
    display: inline;
  }

  .sortable-header__indicator {
    opacity: 0;
    margin-left: var(--space-xs);
    transition: opacity var(--transition-fast);
  }

  .sortable-header__indicator.visible {
    opacity: 1;
  }

  .sortable-header:hover .sortable-header__indicator:not(.visible) {
    opacity: 0.3;
  }

  .sortable-header:hover .sortable-header__indicator:not(.visible)::before {
    content: '▼';
  }
</style>
