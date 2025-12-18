<script lang="ts">
  import { sidebarOpen, closeSidebar } from '$lib/stores';
  import { location } from 'svelte-spa-router';

  interface NavLink {
    href: string;
    label: string;
    icon: string;
  }

  interface NavGroup {
    label: string;
    icon: string;
    id: string;
    items: NavLink[];
  }

  type NavItem = NavLink | NavGroup;

  function isGroup(item: NavItem): item is NavGroup {
    return 'items' in item;
  }

  // Collapsible group state
  let expandedGroups = $state<Set<string>>(new Set(['equipment', 'items', 'world']));

  const navItems: NavItem[] = [
    { href: '#/ships', label: 'Ships', icon: '⛵' },
    { href: '#/weapons', label: 'Weapons', icon: '💣' },
    { href: '#/crew', label: 'Crew', icon: '👥' },
    {
      label: 'Equipment',
      icon: '🔧',
      id: 'equipment',
      items: [
        { href: '#/upgrades', label: 'Upgrades', icon: '📈' },
        { href: '#/swivels', label: 'Swivels', icon: '🎯' },
        { href: '#/design', label: 'Cosmetics', icon: '🎨' }
      ]
    },
    {
      label: 'Items',
      icon: '📦',
      id: 'items',
      items: [
        { href: '#/consumables', label: 'Consumables', icon: '🧪' },
        { href: '#/items', label: 'Resources', icon: '🪵' }
      ]
    },
    {
      label: 'World',
      icon: '🌍',
      id: 'world',
      items: [
        { href: '#/ports', label: 'Ports', icon: '🏠' },
        { href: '#/progression', label: 'Progression', icon: '📊' },
        { href: '#/arena', label: 'Arena', icon: '⚔️' }
      ]
    },
    { href: '#/builds', label: 'Builds', icon: '⚙️' },
    { href: '#/balance', label: 'Balance', icon: '⚖️' }
  ];

  // Active link detection
  const currentPath = $derived($location);

  function isActive(href: string): boolean {
    const path = href.replace('#', '');
    return currentPath === path || currentPath.startsWith(path + '/');
  }

  function isGroupActive(group: NavGroup): boolean {
    return group.items.some(item => isActive(item.href));
  }

  function toggleGroup(id: string) {
    const newSet = new Set(expandedGroups);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    expandedGroups = newSet;
  }

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
      {#if isGroup(item)}
        <li class="nav__group">
          <button
            class="nav__group-header"
            class:nav__group-header--active={isGroupActive(item)}
            onclick={() => toggleGroup(item.id)}
            aria-expanded={expandedGroups.has(item.id)}
          >
            <span class="nav__icon">{item.icon}</span>
            <span class="nav__label">{item.label}</span>
            <span class="nav__group-arrow" class:open={expandedGroups.has(item.id)}>▾</span>
          </button>
          {#if expandedGroups.has(item.id)}
            <ul class="nav__sublist">
              {#each item.items as subItem}
                <li class="nav__subitem">
                  <a
                    href={subItem.href}
                    class="nav__sublink"
                    class:nav__sublink--active={isActive(subItem.href)}
                    aria-current={isActive(subItem.href) ? 'page' : undefined}
                    onclick={handleNavClick}
                  >
                    <span class="nav__icon nav__icon--small">{subItem.icon}</span>
                    <span class="nav__label">{subItem.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {:else}
        <li class="nav__item">
          <a
            href={item.href}
            class="nav__link"
            class:nav__link--active={isActive(item.href)}
            aria-current={isActive(item.href) ? 'page' : undefined}
            onclick={handleNavClick}
          >
            <span class="nav__icon">{item.icon}</span>
            <span class="nav__label">{item.label}</span>
          </a>
        </li>
      {/if}
    {/each}
  </ul>
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

  .nav__link:focus-visible {
    outline: none;
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--gold-primary);
    box-shadow: inset 0 0 0 2px var(--gold-primary);
  }

  .nav__link--active {
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--gold-primary);
  }

  .nav__icon {
    font-size: var(--text-xl);
    width: 28px;
    text-align: center;
  }

  .nav__label {
    flex: 1;
  }

  /* Group styles */
  .nav__group {
    margin: var(--space-xs) 0;
  }

  .nav__group-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    color: var(--canvas-aged);
    background: transparent;
    border: none;
    border-left: 3px solid transparent;
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .nav__group-header:hover {
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--brass);
  }

  .nav__group-header--active {
    color: var(--gold-light);
    border-left-color: var(--gold-primary);
  }

  .nav__group-arrow {
    font-size: var(--text-xs);
    margin-left: auto;
    transition: transform var(--transition-fast);
  }

  .nav__group-arrow.open {
    transform: rotate(180deg);
  }

  .nav__sublist {
    list-style: none;
    padding: 0;
    margin: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .nav__subitem {
    margin: 0;
  }

  .nav__sublink {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) var(--space-lg);
    padding-left: calc(var(--space-lg) + var(--space-lg));
    color: var(--canvas-aged);
    text-decoration: none;
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: var(--font-normal);
    transition: all var(--transition-fast);
    border-left: 3px solid transparent;
  }

  .nav__sublink:hover {
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--brass);
  }

  .nav__sublink--active {
    background: var(--bg-hover);
    color: var(--gold-light);
    border-left-color: var(--gold-primary);
  }

  .nav__icon--small {
    font-size: var(--text-base);
    width: 24px;
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
