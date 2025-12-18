<script lang="ts">
  interface Props {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let {
    message = 'Loading...',
    size = 'md'
  }: Props = $props();
</script>

<div class="loading-state loading-state--{size}">
  <span class="loading-state__spinner">⚓</span>
  <span class="loading-state__message">{message}</span>
</div>

<style>
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    padding: var(--space-xl);
    color: var(--brass-light);
  }

  .loading-state--sm {
    padding: var(--space-md);
    gap: var(--space-sm);
  }

  .loading-state--sm .loading-state__spinner {
    font-size: var(--text-lg);
  }

  .loading-state--sm .loading-state__message {
    font-size: var(--text-xs);
  }

  .loading-state--md .loading-state__spinner {
    font-size: var(--text-2xl);
  }

  .loading-state--md .loading-state__message {
    font-size: var(--text-sm);
  }

  .loading-state--lg {
    padding: var(--space-2xl);
  }

  .loading-state--lg .loading-state__spinner {
    font-size: var(--text-4xl);
  }

  .loading-state--lg .loading-state__message {
    font-size: var(--text-base);
  }

  .loading-state__spinner {
    animation: spin 1.5s ease-in-out infinite;
  }

  .loading-state__message {
    font-family: var(--font-display);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
