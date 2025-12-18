<script lang="ts">
  import { sidebarOpen, closeSidebar } from '$lib/stores';

  interface NavItem {
    href: string;
    label: string;
    icon: string;
  }

  const navItems: NavItem[] = [
    { href: '#/ships', label: 'Ships', icon: '⛵' },
    { href: '#/weapons', label: 'Weapons', icon: '💣' },
    { href: '#/crew', label: 'Crew', icon: '👥' },
    { href: '#/consumables', label: 'Consumables', icon: '🧪' },
    { href: '#/items', label: 'Items', icon: '📦' },
    { href: '#/design', label: 'Design', icon: '🎨' },
    { href: '#/builds', label: 'Builds', icon: '⚙️' },
    { href: '#/balance', label: 'Balance', icon: '⚖️' }
  ];

  function handleNavClick() {
    closeSidebar();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && $sidebarOpen) {
      closeSidebar();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
{#if $sidebarOpen}
  <!-- Backdrop is purely visual overlay - not interactive for keyboard users -->
  <!-- Keyboard users can use Escape key (handled by window listener) -->
  <div
    class="nav-backdrop"
    onclick={closeSidebar}
    aria-hidden="true"
  ></div>
{/if}

<!-- Sidebar Navigation -->
<nav
  class="nav"
  class:open={$sidebarOpen}
  aria-label="Main navigation"
>
  <div class="nav__header">
    <span class="nav__logo">⚓</span>
    <span class="nav__title">Captain's Cove</span>
  </div>

  <ul class="nav__list">
    {#each navItems as item}
      <li class="nav__item">
        <a
          href={item.href}
          class="nav__link"
          onclick={handleNavClick}
        >
          <span class="nav__icon">{item.icon}</span>
          <span class="nav__label">{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>

  <div class="nav__footer">
    <div class="nav__divider"></div>
    <a href="#/settings" class="nav__link nav__link--secondary" onclick={handleNavClick}>
      <span class="nav__icon">⚙️</span>
      <span class="nav__label">Settings</span>
    </a>
    <a href="#/about" class="nav__link nav__link--secondary" onclick={handleNavClick}>
      <span class="nav__icon">ℹ️</span>
      <span class="nav__label">About</span>
    </a>
  </div>
</nav>

<style>
  .nav-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    z-index: var(--z-overlay);
    animation: fade-in 0.2s ease-out;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background: var(--texture-wood);
    border-right: 3px solid var(--brass-dark);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-modal);
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .nav.open {
    transform: translateX(0);
  }

  .nav__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-lg);
    border-bottom: 2px solid var(--wood-grain);
  }

  .nav__logo {
    font-size: var(--text-3xl);
    animation: ship-bob 3s ease-in-out infinite;
  }

  .nav__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
  }

  .nav__list {
    list-style: none;
    padding: var(--space-md) 0;
    margin: 0;
    flex: 1;
  }

  .nav__item {
    margin: var(--space-xs) 0;
  }

  .nav__link {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    color: var(--canvas-aged);
    text-decoration: none;
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    transition: all var(--transition-fast);
    border-left: 3px solid transparent;
  }

  .nav__link:hover {
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--gold-primary);
  }

  .nav__link--secondary {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .nav__link--secondary:hover {
    color: var(--canvas);
    border-left-color: var(--brass);
  }

  .nav__icon {
    font-size: var(--text-xl);
    width: 28px;
    text-align: center;
  }

  .nav__label {
    flex: 1;
  }

  .nav__footer {
    padding: var(--space-md) 0;
    margin-top: auto;
  }

  .nav__divider {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--wood-grain),
      transparent
    );
    margin: var(--space-md) var(--space-lg);
  }

  @media (min-width: 768px) {
    .nav-backdrop {
      display: none;
    }

    .nav {
      display: none;
    }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
