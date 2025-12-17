<script lang="ts">
  import { sidebarOpen, toggleSidebar, theme, toggleTheme } from '$lib/stores';

  export let title = "Captain's Cove";
</script>

<header class="header">
  <div class="header__left">
    <button
      class="header__menu-btn"
      on:click={toggleSidebar}
      aria-label={$sidebarOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={$sidebarOpen}
    >
      <span class="header__menu-icon" class:open={$sidebarOpen}>
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <a href="/" class="header__brand">
      <span class="header__logo">⚓</span>
      <h1 class="header__title">{title}</h1>
    </a>
  </div>

  <div class="header__center">
    <nav class="header__nav" aria-label="Main navigation">
      <a href="#/ships" class="header__link">Ships</a>
      <a href="#/weapons" class="header__link">Weapons</a>
      <a href="#/crew" class="header__link">Crew</a>
      <a href="#/builds" class="header__link">Builds</a>
      <a href="#/balance" class="header__link">Balance</a>
    </nav>
  </div>

  <div class="header__right">
    <button
      class="header__theme-btn"
      on:click={toggleTheme}
      aria-label={$theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {$theme === 'dark' ? '☀️' : '🌙'}
    </button>
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) var(--space-lg);
    background: var(--texture-wood);
    border-bottom: 3px solid var(--brass-dark);
    box-shadow: var(--shadow-lg);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
  }

  .header__left {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .header__menu-btn {
    display: none;
    padding: var(--space-sm);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .header__menu-icon {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 24px;
  }

  .header__menu-icon span {
    display: block;
    height: 2px;
    background: var(--gold-primary);
    border-radius: var(--radius-full);
    transition: all var(--transition-base);
  }

  .header__menu-icon.open span:nth-child(1) {
    transform: rotate(45deg) translate(4px, 4px);
  }

  .header__menu-icon.open span:nth-child(2) {
    opacity: 0;
  }

  .header__menu-icon.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .header__brand {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    text-decoration: none;
    color: inherit;
  }

  .header__logo {
    font-size: var(--text-3xl);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    animation: ship-bob 3s ease-in-out infinite;
  }

  .header__title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .header__center {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  .header__nav {
    display: flex;
    gap: var(--space-lg);
  }

  .header__link {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--canvas-aged);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    position: relative;
  }

  .header__link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--gold-primary);
    transition: all var(--transition-base);
    transform: translateX(-50%);
  }

  .header__link:hover {
    color: var(--gold-light);
    text-shadow: var(--text-shadow-gold);
  }

  .header__link:hover::after {
    width: 80%;
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .header__theme-btn {
    padding: var(--space-sm);
    font-size: var(--text-lg);
    background: transparent;
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .header__theme-btn:hover {
    background: var(--bg-hover);
    border-color: var(--brass);
  }

  @media (max-width: 1024px) {
    .header__nav {
      gap: var(--space-md);
    }

    .header__link {
      font-size: var(--text-xs);
      padding: var(--space-xs) var(--space-sm);
    }
  }

  @media (max-width: 768px) {
    .header {
      padding: var(--space-sm) var(--space-md);
    }

    .header__menu-btn {
      display: flex;
    }

    .header__center {
      display: none;
    }

    .header__title {
      font-size: var(--text-lg);
    }

    .header__logo {
      font-size: var(--text-2xl);
    }
  }
</style>
