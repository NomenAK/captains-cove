<script lang="ts">
  interface Props {
    value: number;
    max: number;
    label?: string;
    showValue?: boolean;
    variant?: 'default' | 'hp' | 'speed' | 'armor' | 'cargo' | 'damage' | 'range';
    size?: 'sm' | 'md' | 'lg';
    format?: (value: number) => string;
  }

  let {
    value,
    max,
    label,
    showValue = true,
    variant = 'default',
    size = 'md',
    format = (v) => v.toString()
  }: Props = $props();

  const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div class="stat-bar stat-bar--{variant} stat-bar--{size}">
  {#if label}
    <div class="stat-bar__header">
      <span class="stat-bar__label">{label}</span>
      {#if showValue}
        <span class="stat-bar__value">{format(value)}</span>
      {/if}
    </div>
  {/if}

  <div class="stat-bar__track">
    <div
      class="stat-bar__fill"
      style:width="{percentage}%"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    ></div>
    <div class="stat-bar__segments">
      {#each Array(10) as _, i}
        <div class="stat-bar__segment"></div>
      {/each}
    </div>
  </div>

  {#if !label && showValue}
    <span class="stat-bar__value-inline">{format(value)}</span>
  {/if}
</div>

<style>
  .stat-bar {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .stat-bar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-bar__label {
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .stat-bar__value,
  .stat-bar__value-inline {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--canvas);
    font-weight: var(--font-semibold);
  }

  .stat-bar__value-inline {
    margin-left: var(--space-sm);
    min-width: 50px;
    text-align: right;
  }

  .stat-bar__track {
    position: relative;
    height: 100%;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--wood-grain);
  }

  /* Sizes */
  .stat-bar--sm .stat-bar__track { height: 8px; }
  .stat-bar--md .stat-bar__track { height: 12px; }
  .stat-bar--lg .stat-bar__track { height: 20px; }

  .stat-bar__fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width var(--transition-normal);
  }

  /* Variant colors - using CSS variables for consistency */
  .stat-bar--default .stat-bar__fill {
    background: linear-gradient(90deg, var(--brass) 0%, var(--gold-primary) 100%);
  }

  .stat-bar--hp .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-hp) 0%, var(--error-light) 100%);
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
  }

  .stat-bar--speed .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-speed) 0%, var(--success-light) 100%);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  }

  .stat-bar--armor .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-armor) 0%, var(--stat-range) 100%);
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
  }

  .stat-bar--cargo .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-cargo) 0%, var(--warning-light) 100%);
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
  }

  .stat-bar--damage .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-hp) 0%, var(--stat-damage) 100%);
    box-shadow: 0 0 8px rgba(234, 88, 12, 0.4);
  }

  .stat-bar--range .stat-bar__fill {
    background: linear-gradient(90deg, var(--stat-crew) 0%, var(--stat-accuracy) 100%);
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
  }

  /* Segments overlay */
  .stat-bar__segments {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    pointer-events: none;
  }

  .stat-bar__segment {
    flex: 1;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  .stat-bar__segment:last-child {
    border-right: none;
  }

  /* Inline layout */
  .stat-bar:has(.stat-bar__value-inline) {
    flex-direction: row;
    align-items: center;
  }

  .stat-bar:has(.stat-bar__value-inline) .stat-bar__track {
    flex: 1;
  }
</style>
