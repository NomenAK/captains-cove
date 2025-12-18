<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    icon?: string;
    title: string;
    message?: string;
    variant?: 'default' | 'filter';
    children?: Snippet;
  }

  let {
    icon = '🔍',
    title,
    message,
    variant = 'default',
    children
  }: Props = $props();
</script>

<div class="empty-state empty-state--{variant}">
  <span class="empty-state__icon">{icon}</span>
  <h3 class="empty-state__title">{title}</h3>
  {#if message}
    <p class="empty-state__message">{message}</p>
  {/if}
  {#if children}
    <div class="empty-state__actions">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    padding: var(--space-2xl);
    text-align: center;
  }

  .empty-state--filter {
    background: var(--bg-tertiary);
    border: 2px dashed var(--wood-grain);
    border-radius: var(--radius-lg);
    margin: var(--space-md);
  }

  .empty-state__icon {
    font-size: var(--text-4xl);
    opacity: 0.6;
  }

  .empty-state__title {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--canvas);
    margin: 0;
  }

  .empty-state__message {
    font-size: var(--text-sm);
    color: var(--brass-light);
    margin: 0;
    max-width: 300px;
  }

  .empty-state__actions {
    display: flex;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }
</style>
