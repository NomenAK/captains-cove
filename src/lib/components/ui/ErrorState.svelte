<script lang="ts">
  import Button from './Button.svelte';

  interface Props {
    title?: string;
    message: string;
    onretry?: () => void;
    variant?: 'inline' | 'full';
  }

  let {
    title = 'Something went wrong',
    message,
    onretry,
    variant = 'inline'
  }: Props = $props();
</script>

<div class="error-state error-state--{variant}">
  <span class="error-state__icon">⚠️</span>
  <h3 class="error-state__title">{title}</h3>
  <p class="error-state__message">{message}</p>
  {#if onretry}
    <Button variant="secondary" size="sm" onclick={onretry}>
      Try Again
    </Button>
  {/if}
</div>

<style>
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    padding: var(--space-xl);
    text-align: center;
    background: var(--bg-tertiary);
    border: 2px solid var(--error);
    border-radius: var(--radius-lg);
  }

  .error-state--full {
    min-height: 300px;
    margin: var(--space-lg);
  }

  .error-state--inline {
    padding: var(--space-lg);
    margin: var(--space-md);
  }

  .error-state__icon {
    font-size: var(--text-3xl);
  }

  .error-state__title {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--error-light);
    margin: 0;
  }

  .error-state__message {
    font-size: var(--text-sm);
    color: var(--brass-light);
    margin: 0;
    max-width: 400px;
  }
</style>
