<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    direction?: 'vertical' | 'horizontal';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    wrap?: boolean;
    fullWidth?: boolean;
    as?: 'div' | 'section' | 'nav' | 'ul' | 'article';
    children: Snippet;
  }

  let {
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    fullWidth = false,
    as = 'div',
    children
  }: Props = $props();
</script>

<svelte:element
  this={as}
  class="stack stack--{direction} stack--gap-{gap} stack--align-{align} stack--justify-{justify}"
  class:stack--wrap={wrap}
  class:stack--full-width={fullWidth}
>
  {@render children()}
</svelte:element>

<style>
  .stack {
    display: flex;
  }

  /* Direction */
  .stack--vertical { flex-direction: column; }
  .stack--horizontal { flex-direction: row; }

  /* Gap variants - maps to --space-* variables */
  .stack--gap-none { gap: 0; }
  .stack--gap-xs { gap: var(--space-xs); }
  .stack--gap-sm { gap: var(--space-sm); }
  .stack--gap-md { gap: var(--space-md); }
  .stack--gap-lg { gap: var(--space-lg); }
  .stack--gap-xl { gap: var(--space-xl); }
  .stack--gap-2xl { gap: var(--space-2xl); }

  /* Align (cross-axis) */
  .stack--align-start { align-items: flex-start; }
  .stack--align-center { align-items: center; }
  .stack--align-end { align-items: flex-end; }
  .stack--align-stretch { align-items: stretch; }
  .stack--align-baseline { align-items: baseline; }

  /* Justify (main-axis) */
  .stack--justify-start { justify-content: flex-start; }
  .stack--justify-center { justify-content: center; }
  .stack--justify-end { justify-content: flex-end; }
  .stack--justify-between { justify-content: space-between; }
  .stack--justify-around { justify-content: space-around; }
  .stack--justify-evenly { justify-content: space-evenly; }

  /* Modifiers */
  .stack--wrap { flex-wrap: wrap; }
  .stack--full-width { width: 100%; }

  /* Responsive: horizontal stacks collapse to vertical on mobile */
  @media (max-width: 768px) {
    .stack--horizontal {
      flex-direction: column;
    }
  }
</style>
