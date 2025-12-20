<script lang="ts">
  import { sidebarOpen, toggleSidebar, theme, toggleTheme } from '$lib/stores';
  import { location } from 'svelte-spa-router';

  interface Props {
    title?: string;
  }

  let { title = "Captain's Cove" }: Props = $props();

  // Active link detection
  const currentPath = $derived($location);

  // Dropdown state
  let openDropdown = $state<string | null>(null);
  let dropdownTimeout: ReturnType<typeof setTimeout> | null = null;

  function isActive(href: string): boolean {
    const path = href.replace('#', '');
    return currentPath === path || currentPath.startsWith(path + '/');
  }

  function isDropdownActive(paths: string[]): boolean {
    return paths.some(path => isActive(path));
  }

  function handleDropdownEnter(name: string) {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    openDropdown = name;
  }

  function handleDropdownLeave() {
    dropdownTimeout = setTimeout(() => {
      openDropdown = null;
    }, 150);
  }

  function handleDropdownClick(name: string) {
    openDropdown = openDropdown === name ? null : name;
  }

  // Navigation structure with dropdowns
  interface NavLink {
    href: string;
    label: string;
  }

  interface NavDropdown {
    label: string;
    id: string;
    items: NavLink[];
  }

  type NavItem = NavLink | NavDropdown;

  function isDropdown(item: NavItem): item is NavDropdown {
    return 'items' in item;
  }

  const navItems: NavItem[] = [
    { href: '#/ships', label: 'Ships' },
    { href: '#/weapons', label: 'Weapons' },
    { href: '#/crew', label: 'Crew' },
    {
      label: 'Equipment',
      id: 'equipment',
      items: [
        { href: '#/upgrades', label: 'Upgrades' },
        { href: '#/swivels', label: 'Swivels' },
        { href: '#/design', label: 'Cosmetics' }
      ]
    },
    {
      label: 'Items',
      id: 'items',
      items: [
        { href: '#/consumables', label: 'Consumables' },
        { href: '#/items', label: 'Resources' }
      ]
    },
    {
      label: 'World',
      id: 'world',
      items: [
        { href: '#/ports', label: 'Ports' },
        { href: '#/progression', label: 'Progression' },
        { href: '#/arena', label: 'Arena' }
      ]
    },
    { href: '#/builds', label: 'Builds' },
    { href: '#/balance', label: 'Balance' }
  ];
</script>

<header class="header">
  <div class="header__left">
    <button
      class="header__menu-btn"
      onclick={toggleSidebar}
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
      {#each navItems as item (isDropdown(item) ? item.id : item.href)}
        {#if isDropdown(item)}
          <div
            class="header__dropdown"
            role="navigation"
            onmouseenter={() => handleDropdownEnter(item.id)}
            onmouseleave={handleDropdownLeave}
          >
            <button
              class="header__link header__dropdown-trigger"
              class:header__link--active={isDropdownActive(item.items.map(i => i.href))}
              onclick={() => handleDropdownClick(item.id)}
              aria-expanded={openDropdown === item.id}
              aria-haspopup="true"
            >
              {item.label}
              <span class="header__dropdown-arrow" class:open={openDropdown === item.id}>▾</span>
            </button>
            {#if openDropdown === item.id}
              <div class="header__dropdown-menu">
                {#each item.items as subItem (subItem.href)}
                  <a
                    href={subItem.href}
                    class="header__dropdown-item"
                    class:header__dropdown-item--active={isActive(subItem.href)}
                    aria-current={isActive(subItem.href) ? 'page' : undefined}
                    onclick={() => { openDropdown = null; }}
                  >
                    {subItem.label}
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <a
            href={item.href}
            class="header__link"
            class:header__link--active={isActive(item.href)}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </a>
        {/if}
      {/each}
    </nav>
  </div>

  <div class="header__right">
    <button
      class="header__theme-btn"
      onclick={toggleTheme}
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
    min-width: 44px;
    min-height: 44px;
    padding: var(--space-sm);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .header__menu-btn:focus {
    outline: none;
    background: var(--bg-hover);
    border-radius: var(--radius-md);
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

  .header__link:focus-visible {
    outline: none;
    color: var(--gold-light);
    text-shadow: var(--text-shadow-gold);
    background: var(--bg-hover);
  }

  .header__link:focus-visible::after {
    width: 80%;
  }

  .header__link--active {
    color: var(--gold-light);
    text-shadow: var(--text-shadow-gold);
  }

  .header__link--active::after {
    width: 80%;
  }

  /* Dropdown styles */
  .header__dropdown {
    position: relative;
  }

  .header__dropdown-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .header__dropdown-arrow {
    font-size: var(--text-xs);
    transition: transform var(--transition-fast);
  }

  .header__dropdown-arrow.open {
    transform: rotate(180deg);
  }

  .header__dropdown-menu {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: var(--space-sm);
    background: var(--texture-wood);
    border: 2px solid var(--brass-dark);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    min-width: 160px;
    z-index: var(--z-dropdown);
    padding: var(--space-xs) 0;
    animation: dropdown-fade 0.15s ease-out;
  }

  .header__dropdown-item {
    display: block;
    padding: var(--space-sm) var(--space-md);
    color: var(--canvas-aged);
    text-decoration: none;
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .header__dropdown-item:hover {
    background: var(--bg-hover);
    color: var(--gold-light);
  }

  .header__dropdown-item--active {
    color: var(--gold-light);
    background: var(--bg-hover);
  }

  @keyframes dropdown-fade {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .header__theme-btn {
    min-width: 44px;
    min-height: 44px;
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

  .header__theme-btn:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 2px rgba(212, 168, 83, 0.3);
  }

  @media (max-width: 1200px) {
    .header__nav {
      gap: var(--space-md);
    }

    .header__link {
      font-size: var(--text-xs);
      padding: var(--space-sm) var(--space-sm);
    }
  }

  @media (max-width: 1024px) {
    .header__nav {
      gap: var(--space-sm);
    }

    .header__link {
      font-size: var(--text-xs);
      padding: var(--space-xs) var(--space-xs);
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
