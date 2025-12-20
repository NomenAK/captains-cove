<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import WaxSeal from './WaxSeal.svelte';

  interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'parchment' | 'important';
    showSeal?: boolean;
    sealIcon?: string;
    onclose?: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    title,
    size = 'md',
    variant = 'default',
    showSeal = false,
    sealIcon = '⚓',
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
  class="modal modal--{size} modal--{variant}"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  aria-modal="true"
  aria-labelledby={title ? `${modalId}-title` : undefined}
>
  <div class="modal__container">
    <!-- Brass corner decorations -->
    <div class="modal__corner modal__corner--tl" aria-hidden="true"></div>
    <div class="modal__corner modal__corner--tr" aria-hidden="true"></div>
    <div class="modal__corner modal__corner--bl" aria-hidden="true"></div>
    <div class="modal__corner modal__corner--br" aria-hidden="true"></div>

    <!-- Rope border for important variant -->
    {#if variant === 'important'}
      <div class="modal__rope-border" aria-hidden="true">
        <span class="modal__knot modal__knot--tl"></span>
        <span class="modal__knot modal__knot--tr"></span>
        <span class="modal__knot modal__knot--bl"></span>
        <span class="modal__knot modal__knot--br"></span>
      </div>
    {/if}

    <!-- Wax seal decoration -->
    {#if showSeal}
      <div class="modal__seal-container">
        <WaxSeal icon={sealIcon} color="red" size="md" rotation={-15} animated={open} />
      </div>
    {/if}

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

  /* ═══════════════════════════════════════════════════ */
  /* VARIANT: PARCHMENT                                  */
  /* ═══════════════════════════════════════════════════ */
  .modal--parchment .modal__container {
    background: var(--texture-parchment-aged);
    border-color: var(--wood-medium);
  }

  .modal--parchment .modal__body {
    color: var(--wood-dark);
  }

  .modal--parchment .modal__header {
    background: linear-gradient(
      180deg,
      rgba(139, 115, 85, 0.3) 0%,
      rgba(139, 115, 85, 0.1) 100%
    );
    border-bottom-color: var(--wood-medium);
  }

  .modal--parchment .modal__title {
    color: var(--wood-charred);
    text-shadow: none;
  }

  .modal--parchment .modal__footer {
    background: rgba(139, 115, 85, 0.1);
    border-top-color: var(--wood-medium);
  }

  /* ═══════════════════════════════════════════════════ */
  /* VARIANT: IMPORTANT                                  */
  /* ═══════════════════════════════════════════════════ */
  .modal--important .modal__container {
    border-color: var(--gold-primary);
    box-shadow:
      var(--shadow-2xl),
      0 0 60px rgba(212, 168, 83, 0.2),
      inset 0 0 30px rgba(212, 168, 83, 0.05);
  }

  .modal--important .modal__header {
    background: linear-gradient(
      180deg,
      var(--wood-light) 0%,
      var(--wood-medium) 50%,
      var(--wood-dark) 100%
    );
  }

  .modal--important .modal__title {
    font-size: var(--text-2xl);
    letter-spacing: var(--tracking-wide);
  }

  /* Rope border */
  .modal__rope-border {
    position: absolute;
    inset: -6px;
    border-radius: calc(var(--radius-xl) + 6px);
    pointer-events: none;
    z-index: 5;
  }

  .modal__rope-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 5px solid transparent;
    border-radius: inherit;
    background: var(--texture-rope) border-box;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }

  /* Rope knots at corners */
  .modal__knot {
    position: absolute;
    width: 18px;
    height: 18px;
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
    z-index: 6;
  }

  .modal__knot--tl { top: -9px; left: -9px; }
  .modal__knot--tr { top: -9px; right: -9px; }
  .modal__knot--bl { bottom: -9px; left: -9px; }
  .modal__knot--br { bottom: -9px; right: -9px; }

  /* ═══════════════════════════════════════════════════ */
  /* WAX SEAL                                            */
  /* ═══════════════════════════════════════════════════ */
  .modal__seal-container {
    position: absolute;
    top: -20px;
    right: 40px;
    z-index: 25;
  }

  /* ═══════════════════════════════════════════════════ */
  /* BRASS CORNER DECORATIONS (Enhanced)                 */
  /* ═══════════════════════════════════════════════════ */
  .modal__corner {
    position: absolute;
    width: 32px;
    height: 32px;
    background: linear-gradient(
      135deg,
      var(--brass-polish) 0%,
      var(--brass-light) 25%,
      var(--brass) 50%,
      var(--brass-dark) 75%,
      var(--brass-tarnished) 100%
    );
    border-radius: 50%;
    box-shadow:
      inset 0 3px 6px rgba(255, 255, 255, 0.4),
      inset 0 -3px 6px rgba(0, 0, 0, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.5);
    z-index: 10;
    animation: brass-polish 4s ease-in-out infinite;
  }

  .modal__corner::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: radial-gradient(
      circle at 30% 30%,
      var(--brass-light),
      var(--brass-dark)
    );
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .modal__corner--tl { top: -10px; left: -10px; }
  .modal__corner--tr { top: -10px; right: -10px; }
  .modal__corner--bl { bottom: -10px; left: -10px; }
  .modal__corner--br { bottom: -10px; right: -10px; }

  /* ═══════════════════════════════════════════════════ */
  /* HEADER (Carved Wood Effect)                         */
  /* ═══════════════════════════════════════════════════ */
  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    border-bottom: 2px solid var(--wood-dark);
    background: linear-gradient(180deg, var(--wood-medium) 0%, var(--wood-dark) 100%);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    position: relative;
  }

  /* Carved groove effect */
  .modal__header::before {
    content: '';
    position: absolute;
    left: var(--space-xl);
    right: var(--space-xl);
    bottom: calc(var(--space-sm) + 2px);
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--wood-charred) 10%,
      var(--wood-charred) 90%,
      transparent
    );
  }

  /* Highlight line for depth */
  .modal__header::after {
    content: '';
    position: absolute;
    left: var(--space-xl);
    right: var(--space-xl);
    bottom: var(--space-sm);
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1) 10%,
      rgba(255, 255, 255, 0.1) 90%,
      transparent
    );
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
    border-radius: 50%;
    color: var(--canvas);
    font-size: var(--text-xl);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
  }

  .modal__close:hover {
    background: var(--error);
    border-color: var(--error-dark);
    color: var(--canvas);
    transform: rotate(90deg);
  }

  .modal__close:focus-visible {
    outline: 2px solid var(--gold-primary);
    outline-offset: 2px;
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

    .modal__seal-container {
      right: 20px;
      top: -15px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .modal__corner {
      animation: none;
    }
  }
</style>
