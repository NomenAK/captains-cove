<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    children: Snippet;
  }

  let {
    content,
    position = 'top',
    delay = 300,
    children
  }: Props = $props();

  let showTooltip = $state(false);
  let timeout: ReturnType<typeof setTimeout>;

  function handleMouseEnter() {
    timeout = setTimeout(() => {
      showTooltip = true;
    }, delay);
  }

  function handleMouseLeave() {
    clearTimeout(timeout);
    showTooltip = false;
  }

  function handleTouch(e: TouchEvent) {
    e.preventDefault();
    showTooltip = !showTooltip;
  }

  function handleClickOutside(e: MouseEvent) {
    const target = e.target as Node;
    const wrapper = (e.currentTarget as HTMLElement).closest('.tooltip-wrapper');
    if (wrapper && !wrapper.contains(target)) {
      showTooltip = false;
    }
  }
</script>

<div
  class="tooltip-wrapper"
  role="button"
  tabindex="0"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onfocus={handleMouseEnter}
  onblur={handleMouseLeave}
  ontouchstart={handleTouch}
>
  {@render children()}
  {#if showTooltip}
    <div class="tooltip tooltip--{position}" role="tooltip">
      <div class="tooltip__content">
        {content}
      </div>
      <div class="tooltip__arrow"></div>
    </div>
  {/if}
</div>

<style>
  .tooltip-wrapper {
    position: relative;
    display: inline-block;
  }

  .tooltip {
    position: absolute;
    z-index: var(--z-tooltip);
    pointer-events: none;
    animation: tooltip-fade-in 0.15s ease-out;
  }

  .tooltip__content {
    background: var(--bg-elevated);
    border: 1px solid var(--wood-light);
    border-radius: var(--radius-md);
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
    color: var(--canvas);
    white-space: nowrap;
    box-shadow: var(--shadow-lg);
    max-width: 300px;
  }

  .tooltip__arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--bg-elevated);
    border: 1px solid var(--wood-light);
    transform: rotate(45deg);
  }

  /* Position variants */
  .tooltip--top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 8px;
  }

  .tooltip--top .tooltip__arrow {
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    border-top: none;
    border-left: none;
  }

  .tooltip--bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 8px;
  }

  .tooltip--bottom .tooltip__arrow {
    top: 4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    border-bottom: none;
    border-right: none;
  }

  .tooltip--left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding-right: 8px;
  }

  .tooltip--left .tooltip__arrow {
    right: 4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    border-left: none;
    border-bottom: none;
  }

  .tooltip--right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    padding-left: 8px;
  }

  .tooltip--right .tooltip__arrow {
    left: 4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    border-right: none;
    border-top: none;
  }

  @keyframes tooltip-fade-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
