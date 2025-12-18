<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    subtitle?: string;
    icon?: string;
    variant?: 'subtle' | 'standard' | 'ornate';
    alignment?: 'left' | 'center';
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    icon,
    variant = 'standard',
    alignment = 'center',
    children
  }: Props = $props();
</script>

<header
  class="decorative-header decorative-header--{variant} decorative-header--{alignment}"
>
  {#if variant === 'ornate'}
    <span class="decorative-header__ornament decorative-header__ornament--left">✦</span>
  {/if}

  <div class="decorative-header__content">
    {#if icon}
      <span class="decorative-header__icon">{icon}</span>
    {/if}

    <h1 class="decorative-header__title" data-text={title}>{title}</h1>

    {#if subtitle}
      <p class="decorative-header__subtitle">{subtitle}</p>
    {/if}

    {#if children}
      <div class="decorative-header__slot">
        {@render children()}
      </div>
    {/if}
  </div>

  {#if variant === 'ornate'}
    <span class="decorative-header__ornament decorative-header__ornament--right">✦</span>
  {/if}

  {#if variant === 'standard' || variant === 'ornate'}
    <div class="decorative-header__divider"></div>
  {/if}
</header>

<style>
  .decorative-header {
    position: relative;
    padding: var(--space-lg) var(--space-xl);
    margin-bottom: var(--space-lg);
  }

  /* Alignment */
  .decorative-header--center {
    text-align: center;
  }

  .decorative-header--left {
    text-align: left;
  }

  /* Content container */
  .decorative-header__content {
    position: relative;
    z-index: 1;
  }

  /* Icon */
  .decorative-header__icon {
    display: block;
    font-size: var(--text-4xl);
    margin-bottom: var(--space-sm);
    animation: ship-bob 3s ease-in-out infinite;
  }

  /* Title base */
  .decorative-header__title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
    margin: 0;
    line-height: var(--leading-tight);
  }

  /* Subtitle */
  .decorative-header__subtitle {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-widest);
    margin: var(--space-sm) 0 0;
    opacity: 0.9;
  }

  /* Slot content */
  .decorative-header__slot {
    margin-top: var(--space-md);
  }

  /* Divider line */
  .decorative-header__divider {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 80%;
    max-width: 400px;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--brass-dark) 20%,
      var(--brass-light) 50%,
      var(--brass-dark) 80%,
      transparent
    );
  }

  .decorative-header--left .decorative-header__divider {
    left: 0;
    transform: none;
    width: 60%;
    background: linear-gradient(
      90deg,
      var(--brass-light),
      var(--brass-dark) 80%,
      transparent
    );
  }

  /* Ornate ornaments */
  .decorative-header__ornament {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--text-2xl);
    color: var(--brass);
    text-shadow:
      0 0 8px rgba(181, 166, 66, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all var(--transition-base);
  }

  .decorative-header__ornament--left {
    left: var(--space-md);
  }

  .decorative-header__ornament--right {
    right: var(--space-md);
  }

  /* Subtle variant */
  .decorative-header--subtle .decorative-header__title {
    color: var(--canvas);
    text-shadow: var(--text-shadow-sm);
  }

  .decorative-header--subtle .decorative-header__subtitle {
    color: var(--text-muted);
  }

  /* Ornate variant */
  .decorative-header--ornate .decorative-header__title {
    font-size: var(--text-4xl);
    background: var(--texture-gold-shimmer);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s ease-in-out infinite;
  }

  .decorative-header--ornate .decorative-header__subtitle {
    color: var(--gold-light);
  }

  .decorative-header--ornate .decorative-header__divider {
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--gold-dark) 15%,
      var(--gold-primary) 50%,
      var(--gold-dark) 85%,
      transparent
    );
  }

  /* Hover on ornaments */
  .decorative-header:hover .decorative-header__ornament {
    color: var(--gold-primary);
    transform: translateY(-50%) scale(1.1);
    text-shadow:
      0 0 12px rgba(212, 168, 83, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .decorative-header__title {
      font-size: var(--text-2xl);
    }

    .decorative-header--ornate .decorative-header__title {
      font-size: var(--text-3xl);
    }

    .decorative-header__ornament {
      display: none;
    }

    .decorative-header__icon {
      font-size: var(--text-3xl);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .decorative-header__icon,
    .decorative-header--ornate .decorative-header__title {
      animation: none;
    }
  }
</style>
