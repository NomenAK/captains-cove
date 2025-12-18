<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Stat {
    value: number | string;
    label: string;
  }

  interface Props {
    /** Main title text */
    title: string;
    /** Subtitle displayed below title */
    subtitle?: string;
    /** Description paragraph */
    description?: string;
    /** Stats to display (value/label pairs) */
    stats?: Stat[];
    /** Visual variant */
    variant?: 'full' | 'compact';
    /** Enable animations */
    animated?: boolean;
    /** Background style */
    background?: 'ocean' | 'wood' | 'night';
    /** Icon slot - custom icon/SVG to display above title */
    icon?: Snippet;
    /** CTA slot - buttons or links */
    cta?: Snippet;
  }

  let {
    title,
    subtitle,
    description,
    stats = [],
    variant = 'full',
    animated = true,
    background = 'ocean',
    icon,
    cta
  }: Props = $props();

  const isCompact = $derived(variant === 'compact');
  const showEffects = $derived(animated && !isCompact);
</script>

<section
  class="hero hero--{variant} hero--{background}"
  class:hero--animated={animated}
>
  <!-- Background effects (only for full variant with animation) -->
  {#if showEffects && background === 'ocean'}
    <div class="hero__ocean" aria-hidden="true">
      <div class="hero__wave hero__wave--1"></div>
      <div class="hero__wave hero__wave--2"></div>
      <div class="hero__wave hero__wave--3"></div>
    </div>
    <div class="hero__fog" aria-hidden="true"></div>
  {/if}

  <!-- Vignette effect -->
  {#if showEffects}
    <div class="hero__vignette" aria-hidden="true"></div>
  {/if}

  <div class="hero__content">
    <!-- Icon slot -->
    {#if icon}
      <div class="hero__icon" class:hero__icon--animated={animated}>
        {@render icon()}
      </div>
    {/if}

    <!-- Title with shimmer effect -->
    <h1 class="hero__title">
      {#if animated}
        <span class="hero__title-text hero__title-text--shimmer">{title}</span>
      {:else}
        <span class="hero__title-text">{title}</span>
      {/if}
    </h1>

    {#if subtitle}
      <p class="hero__subtitle">{subtitle}</p>
    {/if}

    {#if description}
      <p class="hero__desc">{description}</p>
    {/if}

    <!-- CTA slot -->
    {#if cta}
      <div class="hero__cta">
        {@render cta()}
      </div>
    {/if}

    <!-- Stats grid -->
    {#if stats.length > 0}
      <div class="hero__stats">
        {#each stats as stat}
          <div class="stat-card">
            <div class="stat-card__corner stat-card__corner--tl" aria-hidden="true"></div>
            <div class="stat-card__corner stat-card__corner--tr" aria-hidden="true"></div>
            <div class="stat-card__corner stat-card__corner--bl" aria-hidden="true"></div>
            <div class="stat-card__corner stat-card__corner--br" aria-hidden="true"></div>
            <span class="stat-card__value">{stat.value}</span>
            <span class="stat-card__label">{stat.label}</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  /* ═══════════════════════════════════════════════════ */
  /* HERO SECTION - Reusable Component                   */
  /* ═══════════════════════════════════════════════════ */
  .hero {
    position: relative;
    text-align: center;
    border-radius: var(--radius-xl);
    border: 2px solid var(--wood-grain);
    overflow: hidden;
  }

  /* Variant: Full (default) */
  .hero--full {
    padding: var(--space-3xl) var(--space-lg) var(--space-2xl);
    min-height: 450px;
  }

  /* Variant: Compact */
  .hero--compact {
    padding: var(--space-xl) var(--space-lg);
    min-height: auto;
  }

  .hero--compact .hero__title {
    font-size: var(--text-3xl);
  }

  .hero--compact .hero__desc {
    margin-bottom: var(--space-md);
  }

  /* Background: Ocean */
  .hero--ocean {
    background: linear-gradient(
      180deg,
      var(--ocean-abyss) 0%,
      var(--ocean-deep) 30%,
      var(--ocean-medium) 70%,
      var(--ocean-surface) 100%
    );
  }

  /* Background: Wood */
  .hero--wood {
    background: linear-gradient(
      180deg,
      var(--wood-charred) 0%,
      var(--wood-dark) 30%,
      var(--wood-medium) 100%
    );
  }

  /* Background: Night */
  .hero--night {
    background: linear-gradient(
      180deg,
      var(--ocean-abyss) 0%,
      #0a0f1a 50%,
      #0d1424 100%
    );
  }

  /* Animated Wave Layers */
  .hero__ocean {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .hero__wave {
    position: absolute;
    bottom: 0;
    left: -50%;
    width: 200%;
    height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%230a1628' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E") repeat-x;
    background-size: 600px 100%;
  }

  .hero--animated .hero__wave--1 {
    opacity: 0.3;
    animation: wave-flow 12s linear infinite;
  }

  .hero--animated .hero__wave--2 {
    opacity: 0.5;
    bottom: 10px;
    animation: wave-flow 8s linear infinite reverse;
  }

  .hero--animated .hero__wave--3 {
    opacity: 0.2;
    bottom: 20px;
    animation: wave-flow 15s linear infinite;
  }

  @keyframes wave-flow {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* Fog Overlay */
  .hero__fog {
    position: absolute;
    inset: 0;
    background: var(--texture-fog);
    opacity: 0.4;
    pointer-events: none;
  }

  .hero--animated .hero__fog {
    animation: fog-drift 20s ease-in-out infinite alternate;
  }

  /* Vignette Effect */
  .hero__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 30%,
      rgba(5, 10, 18, 0.4) 70%,
      rgba(5, 10, 18, 0.8) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .hero__content {
    position: relative;
    z-index: 2;
  }

  /* Icon Container */
  .hero__icon {
    margin-bottom: var(--space-lg);
  }

  .hero__icon--animated {
    animation: ship-rock 4s ease-in-out infinite;
  }

  @keyframes ship-rock {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    25% { transform: translateY(-5px) rotate(0deg); }
    50% { transform: translateY(0) rotate(2deg); }
    75% { transform: translateY(-3px) rotate(0deg); }
  }

  /* Title */
  .hero__title {
    font-family: var(--font-display);
    font-size: var(--text-5xl);
    margin: 0 0 var(--space-sm);
    letter-spacing: var(--tracking-wide);
  }

  .hero__title-text {
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
  }

  .hero__title-text--shimmer {
    background: linear-gradient(
      90deg,
      var(--gold-dark) 0%,
      var(--gold-primary) 25%,
      var(--gold-light) 50%,
      var(--gold-primary) 75%,
      var(--gold-dark) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gold-shimmer 4s ease-in-out infinite;
    text-shadow: none;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  @keyframes gold-shimmer {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }

  .hero__subtitle {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-widest);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .hero__desc {
    max-width: 600px;
    margin: 0 auto var(--space-xl);
    color: var(--canvas-aged);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  /* CTA Container */
  .hero__cta {
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
  }

  /* Stats Grid */
  .hero__stats {
    display: flex;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .stat-card {
    position: relative;
    background: var(--bg-card);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    min-width: 100px;
    text-align: center;
    transition: all var(--transition-base);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--brass);
    box-shadow: var(--shadow-lg), var(--glow-gold-sm);
  }

  /* Brass corner dots */
  .stat-card__corner {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(
      circle at 30% 30%,
      var(--brass-light),
      var(--brass-dark)
    );
    border-radius: 50%;
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .stat-card__corner--tl { top: 8px; left: 8px; }
  .stat-card__corner--tr { top: 8px; right: 8px; }
  .stat-card__corner--bl { bottom: 8px; left: 8px; }
  .stat-card__corner--br { bottom: 8px; right: 8px; }

  .stat-card__value {
    display: block;
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-sm);
  }

  .stat-card__label {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  /* ═══════════════════════════════════════════════════ */
  /* RESPONSIVE                                          */
  /* ═══════════════════════════════════════════════════ */
  @media (max-width: 768px) {
    .hero--full {
      padding: var(--space-xl) var(--space-md) var(--space-lg);
      min-height: auto;
    }

    .hero__title {
      font-size: var(--text-3xl);
    }

    .hero--compact .hero__title {
      font-size: var(--text-2xl);
    }

    .hero__subtitle {
      font-size: var(--text-base);
    }

    .hero__desc {
      font-size: var(--text-base);
    }

    .hero__cta {
      flex-direction: column;
      align-items: center;
    }

    .stat-card {
      padding: var(--space-sm) var(--space-md);
      min-width: 70px;
    }

    .stat-card__value {
      font-size: var(--text-2xl);
    }

    .stat-card__corner {
      width: 6px;
      height: 6px;
    }

    .stat-card__corner--tl { top: 6px; left: 6px; }
    .stat-card__corner--tr { top: 6px; right: 6px; }
    .stat-card__corner--bl { bottom: 6px; left: 6px; }
    .stat-card__corner--br { bottom: 6px; right: 6px; }
  }

  /* ═══════════════════════════════════════════════════ */
  /* REDUCED MOTION                                      */
  /* ═══════════════════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    .hero__wave,
    .hero__fog,
    .hero__icon--animated,
    .hero__title-text--shimmer {
      animation: none;
    }
  }
</style>
