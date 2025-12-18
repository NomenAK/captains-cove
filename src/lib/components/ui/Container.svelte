<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    center?: boolean;
    as?: 'div' | 'section' | 'article' | 'main';
    children: Snippet;
  }

  let {
    size = 'xl',
    padding = 'md',
    center = true,
    as = 'div',
    children
  }: Props = $props();
</script>

<svelte:element
  this={as}
  class="container container--{size} container--padding-{padding}"
  class:container--center={center}
>
  {@render children()}
</svelte:element>

<style>
  .container {
    width: 100%;
  }

  /* Size variants - maps to --container-* variables */
  .container--sm { max-width: var(--container-sm); }
  .container--md { max-width: var(--container-md); }
  .container--lg { max-width: var(--container-lg); }
  .container--xl { max-width: var(--container-xl); }
  .container--2xl { max-width: var(--container-2xl); }
  .container--full { max-width: 100%; }

  /* Padding variants */
  .container--padding-none { padding-inline: 0; }
  .container--padding-sm { padding-inline: var(--space-sm); }
  .container--padding-md { padding-inline: var(--space-md); }
  .container--padding-lg { padding-inline: var(--space-lg); }

  /* Centering */
  .container--center {
    margin-inline: auto;
  }

  /* Responsive padding */
  @media (max-width: 768px) {
    .container--padding-md { padding-inline: var(--space-sm); }
    .container--padding-lg { padding-inline: var(--space-md); }
  }
</style>
