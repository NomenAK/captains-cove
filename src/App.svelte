<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Router from 'svelte-spa-router';
  import { dataStore, isLoading, dataError, showLoading, hideLoading, toasts, cleanupUI } from '$lib/stores';
  import { Header, Navigation, Footer, Toast, Loading } from '$lib/components/layout';

  // Import routes
  import Home from './routes/Home.svelte';
  import Ships from './routes/ships/+page.svelte';
  import Weapons from './routes/weapons/+page.svelte';
  import Crew from './routes/crew/+page.svelte';
  import Consumables from './routes/consumables/+page.svelte';
  import Items from './routes/items/+page.svelte';
  import Design from './routes/design/+page.svelte';
  import Builds from './routes/builds/+page.svelte';
  import Balance from './routes/balance/+page.svelte';
  import Upgrades from './routes/upgrades/+page.svelte';
  import Swivels from './routes/swivels/+page.svelte';
  import Ports from './routes/ports/+page.svelte';
  import Progression from './routes/progression/+page.svelte';
  import Arena from './routes/arena/+page.svelte';
  import NotFound from './routes/NotFound.svelte';

  // Route definitions
  const routes = {
    '/': Home,
    '/ships': Ships,
    '/weapons': Weapons,
    '/crew': Crew,
    '/consumables': Consumables,
    '/items': Items,
    '/design': Design,
    '/builds': Builds,
    '/builds/new': Builds,
    '/builds/:id': Builds,
    '/builds/:id/edit': Builds,
    '/balance': Balance,
    '/upgrades': Upgrades,
    '/swivels': Swivels,
    '/ports': Ports,
    '/progression': Progression,
    '/arena': Arena,
    '*': NotFound
  };

  // Load data on mount
  onMount(async () => {
    showLoading('Loading game data...');
    try {
      await dataStore.load();
      toasts.success('Game data loaded successfully');
    } catch (err) {
      console.error('Failed to load data:', err);
      toasts.error('Failed to load game data. Please refresh.');
    } finally {
      hideLoading();
    }
  });

  // Handle route events
  function handleConditionsFailed(event: { detail: unknown }) {
    console.warn('Route conditions failed:', event.detail);
  }

  function handleRouteLoaded() {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cleanup UI event listeners on destroy to prevent memory leaks
  onDestroy(() => {
    cleanupUI();
  });
</script>

<div class="app">
  <Header title="Captain's Cove" />
  <Navigation />

  <main class="main">
    {#if $dataError}
      <div class="error-state">
        <div class="error-content">
          <span class="error-icon">⚠️</span>
          <h2>Failed to Load Data</h2>
          <p>{$dataError}</p>
          <button class="btn btn--primary" on:click={() => dataStore.load()}>
            Retry
          </button>
        </div>
      </div>
    {:else if $isLoading}
      <div class="loading-state">
        <div class="loader-anchor"></div>
        <p>Loading ship manifest...</p>
      </div>
    {:else}
      <Router
        {routes}
        on:conditionsFailed={handleConditionsFailed}
        on:routeLoaded={handleRouteLoaded}
      />
    {/if}
  </main>

  <Footer />
  <Toast />
  <Loading />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main {
    flex: 1;
    padding: var(--space-lg);
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }

  .error-state,
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  .error-content {
    background: var(--bg-card);
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    border: 2px solid var(--error);
    max-width: 400px;
  }

  .error-icon {
    font-size: 48px;
    display: block;
    margin-bottom: var(--space-md);
  }

  .error-content h2 {
    color: var(--error-light);
    margin-bottom: var(--space-sm);
  }

  .error-content p {
    color: var(--text-muted);
    margin-bottom: var(--space-lg);
  }

  .loading-state p {
    color: var(--gold-primary);
    font-family: var(--font-display);
    font-size: var(--text-lg);
    margin-top: var(--space-md);
  }

  .loader-anchor {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: var(--brass);
  }

  .loader-anchor::before {
    content: "⚓";
    animation: ship-bob 1.5s ease-in-out infinite;
    display: inline-block;
  }

  .btn {
    padding: var(--space-sm) var(--space-lg);
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

  @media (max-width: 768px) {
    .main {
      padding: var(--space-md);
    }
  }

  @keyframes ship-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
</style>
