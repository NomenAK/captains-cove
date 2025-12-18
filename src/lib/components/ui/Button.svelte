<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    href,
    type = 'button',
    onclick,
    children
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    class="btn btn--{variant} btn--{size}"
    class:btn--disabled={disabled}
    class:btn--loading={loading}
  >
    {#if loading}
      <span class="btn__spinner">⚓</span>
    {/if}
    <span class="btn__content">
      {@render children()}
    </span>
  </a>
{:else}
  <button
    {type}
    {disabled}
    class="btn btn--{variant} btn--{size}"
    class:btn--disabled={disabled}
    class:btn--loading={loading}
    onclick={onclick}
  >
    {#if loading}
      <span class="btn__spinner">⚓</span>
    {/if}
    <span class="btn__content">
      {@render children()}
    </span>
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    border: 2px solid transparent;
    position: relative;
  }

  /* Sizes */
  .btn--sm {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }

  .btn--md {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-sm);
  }

  .btn--lg {
    padding: var(--space-md) var(--space-lg);
    font-size: var(--text-base);
  }

  /* Variants */
  .btn--primary {
    background: var(--texture-gold-shimmer);
    background-size: 200% 100%;
    color: var(--wood-dark);
    border-color: var(--gold-dark);
  }

  .btn--primary:hover:not(:disabled) {
    background-position: 100% 0;
    box-shadow: var(--glow-gold);
  }

  .btn--secondary {
    background: var(--bg-tertiary);
    color: var(--canvas);
    border-color: var(--wood-grain);
  }

  .btn--secondary:hover:not(:disabled) {
    border-color: var(--brass);
    color: var(--brass-light);
  }

  .btn--ghost {
    background: transparent;
    color: var(--brass-light);
    border-color: transparent;
  }

  .btn--ghost:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--gold-primary);
  }

  .btn--danger {
    background: var(--error);
    color: var(--canvas);
    border-color: var(--error-dark);
  }

  .btn--danger:hover:not(:disabled) {
    background: var(--error-light);
    box-shadow: 0 0 12px var(--error);
  }

  /* States */
  .btn--disabled,
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn--loading .btn__content {
    opacity: 0;
  }

  .btn__spinner {
    position: absolute;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Mobile touch target compliance (44x44px minimum) */
  @media (max-width: 768px) {
    .btn {
      min-height: 44px;
      min-width: 44px;
    }

    .btn--sm {
      padding: var(--space-sm) var(--space-md);
    }
  }
</style>
