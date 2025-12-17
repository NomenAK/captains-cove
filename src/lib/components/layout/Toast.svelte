<script lang="ts">
  import { toasts } from '$lib/stores';
  import { flip } from 'svelte/animate';
  import { fly, fade } from 'svelte/transition';

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast toast--{toast.type}"
      animate:flip={{ duration: 300 }}
      in:fly={{ x: 300, duration: 300 }}
      out:fade={{ duration: 200 }}
      role="alert"
    >
      <span class="toast__icon">{iconMap[toast.type]}</span>
      <span class="toast__message">{toast.message}</span>
      <button
        class="toast__close"
        on:click={() => toasts.remove(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: var(--space-lg);
    right: var(--space-lg);
    z-index: var(--z-toast);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    max-width: 400px;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    box-shadow: var(--shadow-lg);
    font-size: var(--text-sm);
  }

  .toast--success {
    border-color: var(--success);
    background: linear-gradient(135deg, var(--bg-card), rgba(34, 197, 94, 0.1));
  }

  .toast--success .toast__icon {
    color: var(--success-light);
    background: rgba(34, 197, 94, 0.2);
  }

  .toast--error {
    border-color: var(--error);
    background: linear-gradient(135deg, var(--bg-card), rgba(239, 68, 68, 0.1));
  }

  .toast--error .toast__icon {
    color: var(--error-light);
    background: rgba(239, 68, 68, 0.2);
  }

  .toast--warning {
    border-color: var(--warning);
    background: linear-gradient(135deg, var(--bg-card), rgba(245, 158, 11, 0.1));
  }

  .toast--warning .toast__icon {
    color: var(--warning-light);
    background: rgba(245, 158, 11, 0.2);
  }

  .toast--info {
    border-color: var(--info);
    background: linear-gradient(135deg, var(--bg-card), rgba(59, 130, 246, 0.1));
  }

  .toast--info .toast__icon {
    color: var(--info-light);
    background: rgba(59, 130, 246, 0.2);
  }

  .toast__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    flex-shrink: 0;
  }

  .toast__message {
    flex: 1;
    color: var(--canvas);
  }

  .toast__close {
    padding: var(--space-xs);
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--text-xs);
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }

  .toast__close:hover {
    opacity: 1;
  }

  @media (max-width: 480px) {
    .toast-container {
      left: var(--space-md);
      right: var(--space-md);
      bottom: var(--space-md);
      max-width: none;
    }
  }
</style>
