<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label: string;
    for?: string;           // Associates label with form control
    grow?: boolean;         // flex: 1 for search fields
    minWidth?: string;      // Min width (default: 140px, search: 200px)
    children: Snippet;      // Input/select element
  }

  let {
    label,
    for: htmlFor,
    grow = false,
    minWidth = '140px',
    children
  }: Props = $props();
</script>

<div class="filter-group" class:filter-group--grow={grow} style:min-width={minWidth}>
  <label class="filter-group__label" for={htmlFor}>{label}</label>
  <div class="filter-group__control">
    {@render children()}
  </div>
</div>

<style>
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .filter-group--grow {
    flex: 1;
    min-width: 200px;
  }

  .filter-group__label {
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    cursor: pointer;
  }

  .filter-group__control {
    display: flex;
  }

  /* Style child form elements */
  .filter-group__control :global(select),
  .filter-group__control :global(input) {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
  }

  .filter-group__control :global(select:focus),
  .filter-group__control :global(input:focus) {
    outline: none;
    border-color: var(--brass);
    box-shadow: 0 0 0 2px rgba(181, 166, 66, 0.2);
  }

  .filter-group__control :global(input::placeholder) {
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .filter-group {
      width: 100%;
    }

    .filter-group--grow {
      min-width: unset;
    }
  }
</style>
