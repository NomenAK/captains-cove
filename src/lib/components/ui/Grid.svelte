<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    columns?: number | 'auto';
    minWidth?: string;  // For auto-fill, e.g., '200px', '280px'
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    colGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    align?: 'start' | 'center' | 'end' | 'stretch';
    as?: 'div' | 'section' | 'ul';
    children: Snippet;
  }

  let {
    columns = 'auto',
    minWidth = '200px',
    gap = 'md',
    rowGap,
    colGap,
    align = 'stretch',
    as = 'div',
    children
  }: Props = $props();

  // Compute grid template based on columns prop
  const gridTemplate = $derived(
    columns === 'auto'
      ? `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))`
      : `repeat(${columns}, 1fr)`
  );

  // Compute gap values
  const gapValues: Record<string, string> = {
    'none': '0',
    'xs': 'var(--space-xs)',
    'sm': 'var(--space-sm)',
    'md': 'var(--space-md)',
    'lg': 'var(--space-lg)',
    'xl': 'var(--space-xl)'
  };

  const rowGapValue = $derived(rowGap ? gapValues[rowGap] : gapValues[gap]);
  const colGapValue = $derived(colGap ? gapValues[colGap] : gapValues[gap]);
</script>

<svelte:element
  this={as}
  class="grid grid--align-{align}"
  style:grid-template-columns={gridTemplate}
  style:row-gap={rowGapValue}
  style:column-gap={colGapValue}
>
  {@render children()}
</svelte:element>

<style>
  .grid {
    display: grid;
    width: 100%;
  }

  /* Align items */
  .grid--align-start { align-items: start; }
  .grid--align-center { align-items: center; }
  .grid--align-end { align-items: end; }
  .grid--align-stretch { align-items: stretch; }

  /* Reset list styles when used as ul */
  .grid:where(ul) {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
