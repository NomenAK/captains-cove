<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'elevated' | 'wood' | 'archetype' | 'interactive';
    archetype?: 'brawler' | 'kite' | 'sniper' | 'pursuit' | 'trade' | 'siege';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
  }

  let {
    variant = 'default',
    archetype,
    padding = 'md',
    onclick,
    children,
    header,
    footer
  }: Props = $props();

  // Handle keyboard activation for clickable cards
  function handleKeydown(e: KeyboardEvent) {
    if (onclick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick(e as unknown as MouseEvent);
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="card card--{variant} card--padding-{padding}"
  class:card--archetype={archetype}
  class:card--clickable={onclick}
  style:--archetype-color={archetype ? `var(--archetype-${archetype})` : undefined}
  onclick={onclick}
  onkeydown={onclick ? handleKeydown : undefined}
  role={onclick ? 'button' : undefined}
  tabindex={onclick ? 0 : undefined}
>
  {#if header}
    <div class="card__header">
      {@render header()}
    </div>
  {/if}

  <div class="card__body">
    {@render children()}
  </div>

  {#if footer}
    <div class="card__footer">
      {@render footer()}
    </div>
  {/if}

  {#if variant === 'wood'}
    <div class="card__corner card__corner--tl"></div>
    <div class="card__corner card__corner--tr"></div>
    <div class="card__corner card__corner--bl"></div>
    <div class="card__corner card__corner--br"></div>
  {/if}
</div>

<style>
  .card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    position: relative;
    overflow: hidden;
  }

  /* Padding variants */
  .card--padding-none { padding: 0; }
  .card--padding-sm { padding: var(--space-sm); }
  .card--padding-md { padding: var(--space-md); }
  .card--padding-lg { padding: var(--space-lg); }

  .card--padding-none .card__header,
  .card--padding-none .card__body,
  .card--padding-none .card__footer {
    padding: var(--space-md);
  }

  /* Variants */
  .card--elevated {
    box-shadow: var(--shadow-lg);
    border-color: var(--wood-medium);
  }

  .card--wood {
    background: var(--texture-wood);
    background-size: 300px 300px;
    border-color: var(--wood-light);
  }

  .card--archetype {
    border-left: 4px solid var(--archetype-color, var(--brass));
  }

  .card--interactive {
    transition: all var(--transition-fast);
  }

  .card--interactive:hover {
    border-color: var(--brass);
    box-shadow: var(--glow-subtle);
  }

  .card--clickable {
    cursor: pointer;
  }

  .card--clickable:hover {
    border-color: var(--gold-primary);
    background: var(--bg-elevated);
  }

  .card--clickable:focus {
    outline: 2px solid var(--gold-primary);
    outline-offset: 2px;
  }

  /* Card sections */
  .card__header {
    border-bottom: 1px solid var(--wood-dark);
    margin-bottom: var(--space-sm);
    padding-bottom: var(--space-sm);
  }

  .card--padding-none .card__header {
    margin: 0;
    border-bottom: 1px solid var(--wood-dark);
  }

  .card__footer {
    border-top: 1px solid var(--wood-dark);
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
  }

  .card--padding-none .card__footer {
    margin: 0;
    border-top: 1px solid var(--wood-dark);
  }

  /* Brass corners for wood variant */
  .card__corner {
    position: absolute;
    width: 24px;
    height: 24px;
    background: var(--brass);
    border-radius: 50%;
    box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.3);
  }

  .card__corner::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--brass-dark);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .card__corner--tl { top: 8px; left: 8px; }
  .card__corner--tr { top: 8px; right: 8px; }
  .card__corner--bl { bottom: 8px; left: 8px; }
  .card__corner--br { bottom: 8px; right: 8px; }
</style>
