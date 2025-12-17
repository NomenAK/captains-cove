<script lang="ts">
  import { link } from 'svelte-spa-router';
</script>

<div class="not-found">
  <span class="not-found__icon">🏴‍☠️</span>
  <h1 class="not-found__title">Ship Ahoy!</h1>
  <h2 class="not-found__subtitle">Page Not Found</h2>
  <p class="not-found__desc">
    The page you're looking for has sailed into unknown waters.
    Perhaps the treasure map was wrong?
  </p>
  <a href="/" class="btn btn--primary" use:link>
    Return to Port
  </a>
</div>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh;
    padding: var(--space-xl);
  }

  .not-found__icon {
    font-size: 96px;
    margin-bottom: var(--space-lg);
    animation: ship-rock 4s ease-in-out infinite;
  }

  .not-found__title {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
    margin: 0 0 var(--space-sm);
  }

  .not-found__subtitle {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--brass-light);
    margin: 0 0 var(--space-lg);
  }

  .not-found__desc {
    color: var(--canvas-aged);
    max-width: 400px;
    margin-bottom: var(--space-xl);
  }

  .btn {
    padding: var(--space-md) var(--space-xl);
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    border: 2px solid transparent;
  }

  .btn--primary {
    background: var(--texture-gold-shimmer);
    background-size: 200% 100%;
    color: var(--wood-dark);
    border-color: var(--gold-dark);
  }

  .btn--primary:hover {
    background-position: 100% 0;
    box-shadow: var(--glow-gold);
  }

  @keyframes ship-rock {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
</style>
