<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'parchment' | 'captain-log' | 'treasure-map' | 'brass-plate';
    corners?: 'none' | 'rivets' | 'knots' | 'flourish';
    glow?: boolean;
    padding?: 'sm' | 'md' | 'lg';
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
  }

  let {
    variant = 'parchment',
    corners = 'rivets',
    glow = false,
    padding = 'md',
    children,
    header,
    footer
  }: Props = $props();
</script>

<div
  class="ornate-frame ornate-frame--{variant} ornate-frame--corners-{corners} ornate-frame--padding-{padding}"
  class:ornate-frame--glow={glow}
>
  {#if corners === 'rivets'}
    <span class="ornate-frame__corner ornate-frame__corner--tl"></span>
    <span class="ornate-frame__corner ornate-frame__corner--tr"></span>
    <span class="ornate-frame__corner ornate-frame__corner--bl"></span>
    <span class="ornate-frame__corner ornate-frame__corner--br"></span>
  {:else if corners === 'flourish'}
    <span class="ornate-frame__flourish ornate-frame__flourish--tl">❧</span>
    <span class="ornate-frame__flourish ornate-frame__flourish--tr">❧</span>
    <span class="ornate-frame__flourish ornate-frame__flourish--bl">❧</span>
    <span class="ornate-frame__flourish ornate-frame__flourish--br">❧</span>
  {:else if corners === 'knots'}
    <span class="ornate-frame__knot ornate-frame__knot--tl"></span>
    <span class="ornate-frame__knot ornate-frame__knot--tr"></span>
    <span class="ornate-frame__knot ornate-frame__knot--bl"></span>
    <span class="ornate-frame__knot ornate-frame__knot--br"></span>
  {/if}

  {#if header}
    <div class="ornate-frame__header">
      {@render header()}
    </div>
  {/if}

  <div class="ornate-frame__body">
    {@render children()}
  </div>

  {#if footer}
    <div class="ornate-frame__footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .ornate-frame {
    position: relative;
    background: var(--bg-card);
    border: 3px solid var(--wood-light);
    border-radius: var(--radius-xl);
    overflow: visible;
  }

  /* Inner border effect */
  .ornate-frame::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid var(--brass-dark);
    border-radius: calc(var(--radius-xl) - 4px);
    pointer-events: none;
  }

  /* Padding variants */
  .ornate-frame--padding-sm { padding: var(--space-md); }
  .ornate-frame--padding-md { padding: var(--space-lg); }
  .ornate-frame--padding-lg { padding: var(--space-xl); }

  /* Glow effect */
  .ornate-frame--glow {
    box-shadow: var(--glow-gold-sm);
    transition: box-shadow var(--transition-base);
  }

  .ornate-frame--glow:hover {
    box-shadow: var(--glow-gold);
  }

  /* Parchment variant */
  .ornate-frame--parchment {
    background: var(--texture-parchment-aged);
    border-color: var(--wood-medium);
  }

  .ornate-frame--parchment::before {
    border-color: rgba(139, 115, 85, 0.3);
  }

  .ornate-frame--parchment .ornate-frame__body {
    color: var(--wood-dark);
  }

  /* Captain's Log variant */
  .ornate-frame--captain-log {
    background: var(--texture-wood-vertical);
    border-color: var(--wood-dark);
    box-shadow: var(--shadow-lg);
  }

  .ornate-frame--captain-log::before {
    border-color: var(--wood-charred);
    border-width: 2px;
  }

  /* Leather binding effect */
  .ornate-frame--captain-log::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 8px;
    background: linear-gradient(
      180deg,
      var(--wood-charred),
      var(--wood-dark)
    );
    border-radius: 0 0 4px 4px;
  }

  /* Treasure Map variant */
  .ornate-frame--treasure-map {
    background: var(--texture-parchment-aged);
    border: none;
    border-radius: var(--radius-lg);
  }

  .ornate-frame--treasure-map::before {
    border: 2px dashed var(--wood-medium);
    border-radius: var(--radius-lg);
    opacity: 0.5;
  }

  /* Brass Plate variant */
  .ornate-frame--brass-plate {
    background: var(--bg-card);
    border-color: var(--brass);
    box-shadow:
      inset 0 1px 0 var(--brass-light),
      inset 0 -1px 0 var(--brass-dark),
      var(--shadow-lg);
  }

  .ornate-frame--brass-plate::before {
    border-color: var(--brass-light);
    opacity: 0.5;
  }

  /* Header styling */
  .ornate-frame__header {
    padding: var(--space-md) var(--space-lg);
    margin: calc(-1 * var(--space-lg)) calc(-1 * var(--space-lg)) var(--space-md);
    background: linear-gradient(
      180deg,
      var(--wood-medium) 0%,
      var(--wood-dark) 100%
    );
    border-bottom: 2px solid var(--brass-dark);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .ornate-frame--padding-sm .ornate-frame__header {
    margin: calc(-1 * var(--space-md)) calc(-1 * var(--space-md)) var(--space-sm);
  }

  /* Footer styling */
  .ornate-frame__footer {
    padding: var(--space-md) var(--space-lg);
    margin: var(--space-md) calc(-1 * var(--space-lg)) calc(-1 * var(--space-lg));
    background: var(--bg-tertiary);
    border-top: 1px solid var(--wood-grain);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }

  /* Corner rivets */
  .ornate-frame__corner {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(
      circle at 35% 35%,
      var(--brass-polish) 0%,
      var(--brass-light) 20%,
      var(--brass) 40%,
      var(--brass-dark) 70%,
      var(--brass-tarnished) 100%
    );
    border-radius: 50%;
    box-shadow:
      inset -2px -2px 4px rgba(0, 0, 0, 0.4),
      inset 1px 1px 2px rgba(255, 255, 255, 0.2),
      0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .ornate-frame__corner--tl { top: 8px; left: 8px; }
  .ornate-frame__corner--tr { top: 8px; right: 8px; }
  .ornate-frame__corner--bl { bottom: 8px; left: 8px; }
  .ornate-frame__corner--br { bottom: 8px; right: 8px; }

  /* Flourish corners */
  .ornate-frame__flourish {
    position: absolute;
    font-size: var(--text-2xl);
    color: var(--brass);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10;
    transition: all var(--transition-base);
  }

  .ornate-frame__flourish--tl { top: -4px; left: 4px; transform: rotate(180deg); }
  .ornate-frame__flourish--tr { top: -4px; right: 4px; transform: rotate(-90deg); }
  .ornate-frame__flourish--bl { bottom: -4px; left: 4px; transform: rotate(90deg); }
  .ornate-frame__flourish--br { bottom: -4px; right: 4px; transform: rotate(0deg); }

  .ornate-frame:hover .ornate-frame__flourish {
    color: var(--gold-primary);
    text-shadow:
      0 0 8px rgba(212, 168, 83, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Knot corners */
  .ornate-frame__knot {
    position: absolute;
    width: 16px;
    height: 16px;
    background: radial-gradient(
      circle,
      var(--hemp) 30%,
      var(--rope) 50%,
      var(--rope-dark) 70%
    );
    border-radius: 50%;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .ornate-frame__knot--tl { top: 6px; left: 6px; }
  .ornate-frame__knot--tr { top: 6px; right: 6px; }
  .ornate-frame__knot--bl { bottom: 6px; left: 6px; }
  .ornate-frame__knot--br { bottom: 6px; right: 6px; }

  /* No corners */
  .ornate-frame--corners-none::before {
    inset: 0;
    border-radius: inherit;
  }
</style>
