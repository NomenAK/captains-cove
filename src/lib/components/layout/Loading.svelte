<script lang="ts">
  import { globalLoading, loadingMessage } from '$lib/stores';
  import { fade } from 'svelte/transition';
</script>

{#if $globalLoading}
  <div class="loading-overlay" transition:fade={{ duration: 200 }}>
    <div class="loading-content">
      <div class="loading-spinner">
        <span class="loading-wheel">⚙</span>
      </div>
      <p class="loading-text">{$loadingMessage}</p>
      <div class="loading-waves">
        <span class="wave">〰️</span>
        <span class="wave">〰️</span>
        <span class="wave">〰️</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 22, 40, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    backdrop-filter: blur(4px);
  }

  .loading-content {
    text-align: center;
  }

  .loading-spinner {
    margin-bottom: var(--space-lg);
  }

  .loading-wheel {
    display: inline-block;
    font-size: 64px;
    color: var(--brass);
    animation: wheel-spin 2s linear infinite;
    filter: drop-shadow(0 0 10px rgba(181, 166, 66, 0.5));
  }

  .loading-text {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
    margin: 0 0 var(--space-lg);
    letter-spacing: var(--tracking-wide);
  }

  .loading-waves {
    display: flex;
    justify-content: center;
    gap: var(--space-sm);
  }

  .wave {
    font-size: var(--text-2xl);
    opacity: 0.5;
    animation: ship-bob 1.5s ease-in-out infinite;
  }

  .wave:nth-child(2) {
    animation-delay: 0.2s;
  }

  .wave:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes wheel-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes ship-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
</style>
