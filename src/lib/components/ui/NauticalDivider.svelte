<script lang="ts">
  interface Props {
    variant?: 'rope' | 'wave' | 'compass' | 'brass-line' | 'anchor';
    thickness?: 'thin' | 'normal' | 'thick';
    color?: 'gold' | 'brass' | 'wood' | 'ocean';
    animated?: boolean;
    spacing?: 'sm' | 'md' | 'lg';
  }

  let {
    variant = 'brass-line',
    thickness = 'normal',
    color = 'brass',
    animated = false,
    spacing = 'md'
  }: Props = $props();

  const icons: Record<string, string> = {
    compass: '⁂',
    anchor: '⚓',
    'brass-line': '◆',
    rope: '⚓',
    wave: '〜'
  };
</script>

<div
  class="nautical-divider nautical-divider--{variant} nautical-divider--{thickness} nautical-divider--{color} nautical-divider--spacing-{spacing}"
  class:nautical-divider--animated={animated}
  role="separator"
  aria-hidden="true"
>
  <span class="nautical-divider__line"></span>
  {#if variant !== 'brass-line'}
    <span class="nautical-divider__icon">{icons[variant]}</span>
  {/if}
  <span class="nautical-divider__line"></span>
</div>

<style>
  .nautical-divider {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
  }

  /* Spacing variants */
  .nautical-divider--spacing-sm { margin: var(--space-sm) 0; }
  .nautical-divider--spacing-md { margin: var(--space-lg) 0; }
  .nautical-divider--spacing-lg { margin: var(--space-xl) 0; }

  /* Line base */
  .nautical-divider__line {
    flex: 1;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--line-color, var(--brass)) 20%,
      var(--line-color, var(--brass)) 80%,
      transparent
    );
  }

  /* Thickness variants */
  .nautical-divider--thin .nautical-divider__line { height: 1px; }
  .nautical-divider--normal .nautical-divider__line { height: 2px; }
  .nautical-divider--thick .nautical-divider__line { height: 4px; }

  /* Color variants */
  .nautical-divider--gold { --line-color: var(--gold-primary); }
  .nautical-divider--brass { --line-color: var(--brass); }
  .nautical-divider--wood { --line-color: var(--wood-grain); }
  .nautical-divider--ocean { --line-color: var(--ocean-foam); }

  /* Icon styling */
  .nautical-divider__icon {
    color: var(--line-color, var(--brass));
    font-size: var(--text-lg);
    opacity: 0.8;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    transition: all var(--transition-base);
  }

  /* Rope variant */
  .nautical-divider--rope .nautical-divider__line {
    height: 4px;
    background: var(--texture-rope-horizontal);
    border-radius: 2px;
  }

  /* Wave variant */
  .nautical-divider--wave .nautical-divider__line {
    height: 6px;
    background:
      repeating-linear-gradient(
        90deg,
        var(--line-color, var(--ocean-foam)) 0px,
        transparent 10px,
        var(--line-color, var(--ocean-foam)) 20px
      );
    border-radius: var(--radius-full);
  }

  .nautical-divider--wave .nautical-divider__icon {
    font-size: var(--text-2xl);
  }

  .nautical-divider--animated.nautical-divider--wave .nautical-divider__line {
    animation: wave-flow 3s linear infinite;
  }

  /* Compass variant */
  .nautical-divider--compass .nautical-divider__icon {
    font-size: var(--text-xl);
    color: var(--gold-primary);
    text-shadow:
      0 0 8px rgba(212, 168, 83, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Anchor variant */
  .nautical-divider--anchor .nautical-divider__icon {
    font-size: var(--text-xl);
    color: var(--brass);
  }

  .nautical-divider--animated .nautical-divider__icon {
    animation: ship-bob 3s ease-in-out infinite;
  }

  /* Brass-line (no icon, just enhanced line) */
  .nautical-divider--brass-line .nautical-divider__line {
    background: linear-gradient(
      90deg,
      transparent,
      var(--brass-dark) 10%,
      var(--brass-light) 50%,
      var(--brass-dark) 90%,
      transparent
    );
  }

  /* Hover enhancement */
  .nautical-divider:hover .nautical-divider__icon {
    opacity: 1;
    transform: scale(1.1);
    color: var(--gold-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    .nautical-divider--animated .nautical-divider__icon,
    .nautical-divider--animated .nautical-divider__line {
      animation: none;
    }
  }
</style>
