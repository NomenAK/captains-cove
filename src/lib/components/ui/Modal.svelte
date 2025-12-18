<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';

  interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    onclose?: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    title,
    size = 'md',
    onclose,
    children,
    footer
  }: Props = $props();

  let dialog: HTMLDialogElement;
  const modalId = `modal-${Math.random().toString(36).slice(2)}`;

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialog) {
      onclose?.();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose?.();
      return;
    }

    // Focus trap - keep focus within modal
    if (e.key === 'Tab') {
      const focusableElements = dialog?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  $effect(() => {
    if (open) {
      dialog?.showModal();
      document.body.style.overflow = 'hidden';
      // Focus first focusable element or close button
      requestAnimationFrame(() => {
        const closeBtn = dialog?.querySelector<HTMLElement>('.modal__close');
        const firstFocusable = dialog?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (closeBtn || firstFocusable)?.focus();
      });
    } else {
      dialog?.close();
      document.body.style.overflow = '';
    }
  });

  onMount(() => {
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<dialog
  bind:this={dialog}
  class="modal modal--{size}"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  aria-modal="true"
  aria-labelledby={title ? `${modalId}-title` : undefined}
>
  <div class="modal__container">
    <div class="modal__corner modal__corner--tl"></div>
    <div class="modal__corner modal__corner--tr"></div>
    <div class="modal__corner modal__corner--bl"></div>
    <div class="modal__corner modal__corner--br"></div>

    {#if title || onclose}
      <header class="modal__header">
        {#if title}
          <h2 id="{modalId}-title" class="modal__title">{title}</h2>
        {/if}
        {#if onclose}
          <button
            class="modal__close"
            onclick={onclose}
            aria-label="Close modal"
          >
            &times;
          </button>
        {/if}
      </header>
    {/if}

    <div class="modal__body">
      {@render children()}
    </div>

    {#if footer}
      <footer class="modal__footer">
        {@render footer()}
      </footer>
    {/if}
  </div>
</dialog>

<style>
  .modal {
    border: none;
    padding: 0;
    background: transparent;
    max-height: 90vh;
    max-width: 95vw;
  }

  .modal::backdrop {
    background: rgba(10, 22, 40, 0.9);
    backdrop-filter: blur(4px);
  }

  .modal__container {
    background: var(--bg-card);
    border: 3px solid var(--wood-light);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-2xl), 0 0 40px rgba(181, 166, 66, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 85vh;
  }

  /* Sizes */
  .modal--sm .modal__container { width: 400px; }
  .modal--md .modal__container { width: 600px; }
  .modal--lg .modal__container { width: 800px; }
  .modal--xl .modal__container { width: 1000px; }

  /* Brass corner decorations */
  .modal__corner {
    position: absolute;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, var(--brass-light) 0%, var(--brass) 50%, var(--brass-dark) 100%);
    border-radius: 50%;
    box-shadow:
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  .modal__corner::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--brass-dark);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .modal__corner--tl { top: -8px; left: -8px; }
  .modal__corner--tr { top: -8px; right: -8px; }
  .modal__corner--bl { bottom: -8px; left: -8px; }
  .modal__corner--br { bottom: -8px; right: -8px; }

  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    border-bottom: 2px solid var(--wood-dark);
    background: linear-gradient(180deg, var(--wood-medium) 0%, var(--wood-dark) 100%);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .modal__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .modal__close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-xl);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .modal__close:hover {
    background: var(--error);
    border-color: var(--error-dark);
    color: var(--canvas);
  }

  .modal__body {
    padding: var(--space-lg);
    overflow-y: auto;
    flex: 1;
  }

  .modal__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    border-top: 2px solid var(--wood-dark);
    background: var(--bg-tertiary);
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }

  @media (max-width: 768px) {
    .modal--sm .modal__container,
    .modal--md .modal__container,
    .modal--lg .modal__container,
    .modal--xl .modal__container {
      width: 100%;
    }
  }
</style>
