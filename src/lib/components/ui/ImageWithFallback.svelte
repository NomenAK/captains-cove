<script lang="ts">
  import { getIconUrl } from '$lib/utils/storage';

  interface Props {
    src: string | null | undefined;
    alt: string;
    fallback?: string;
    class?: string;
    useStorage?: boolean;
  }

  let {
    src,
    alt,
    fallback = '🚢',
    class: className = '',
    useStorage = false
  }: Props = $props();

  let hasError = $state(false);

  // Compute the actual URL to use
  const resolvedSrc = $derived(() => {
    if (!src) return null;
    if (useStorage) return getIconUrl(src);
    return src;
  });

  function handleError() {
    hasError = true;
  }
</script>

{#if hasError || !resolvedSrc()}
  <div class="image-fallback {className}">
    <span class="image-fallback__icon">{fallback}</span>
    <span class="image-fallback__text">No Image</span>
  </div>
{:else}
  <img
    src={resolvedSrc()}
    {alt}
    class={className}
    onerror={handleError}
  />
{/if}

<style>
  .image-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    background: var(--bg-tertiary);
    border: 1px dashed var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--brass-light);
    min-height: 80px;
    padding: var(--space-sm);
  }

  .image-fallback__icon {
    font-size: var(--text-2xl);
    opacity: 0.6;
  }

  .image-fallback__text {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
