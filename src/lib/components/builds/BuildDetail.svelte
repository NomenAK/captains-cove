<script lang="ts">
  import { buildsStore, dataStore, createShipLookup, createWeaponLookup, createAmmoLookup, toasts } from '$lib/stores';
  import { safeMax } from '$lib/utils/safe-math';
  import type { Build } from '$lib/data/types';
  import { SHIP_TYPE_TO_CLASS } from '$lib/data/types';
  import { Badge } from '$lib/components/ui';
  import { StatBar } from '$lib/components/data';
  import { push } from 'svelte-spa-router';

  interface Props {
    build: Build;
  }

  let { build }: Props = $props();

  // Lookups
  const shipLookup = $derived(createShipLookup($dataStore.ships));
  const weaponLookup = $derived(createWeaponLookup($dataStore.weapons));
  const ammoLookup = $derived(createAmmoLookup($dataStore.ammo));

  // Get related data (use .get() for Maps)
  const ship = $derived(build.shipId !== null ? shipLookup.get(build.shipId) ?? null : null);
  const broadsideWeapon = $derived(build.weapons.broadside ? weaponLookup.get(build.weapons.broadside) || null : null);
  const bowWeapon = $derived(build.weapons.bow ? weaponLookup.get(build.weapons.bow) || null : null);
  const sternWeapon = $derived(build.weapons.stern ? weaponLookup.get(build.weapons.stern) || null : null);
  const mortarWeapon = $derived(build.weapons.mortar ? weaponLookup.get(build.weapons.mortar) || null : null);
  const primaryAmmoData = $derived(build.ammo.primary ? ammoLookup.get(build.ammo.primary) || null : null);
  const secondaryAmmoData = $derived(build.ammo.secondary ? ammoLookup.get(build.ammo.secondary) || null : null);

  // Get upgrades
  const selectedUpgrades = $derived(
    build.upgrades
      .map(id => $dataStore.upgrades.find(u => u.id === id))
      .filter(Boolean)
  );

  // Stat bounds for bars (use safe defaults to prevent -Infinity)
  const maxHp = $derived(safeMax($dataStore.ships.map(s => s.health), 1));
  const maxSpeed = $derived(safeMax($dataStore.ships.map(s => s.speed), 1));
  const maxArmor = $derived(safeMax($dataStore.ships.map(s => s.armor), 1));

  // Format date
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Delete build
  function handleDelete() {
    if (confirm('Are you sure you want to delete this build?')) {
      buildsStore.delete(build.id);
      toasts.success('Build deleted');
      push('/builds');
    }
  }

  // Duplicate build
  function handleDuplicate() {
    const duplicate = buildsStore.duplicate(build.id);
    if (duplicate) {
      toasts.success('Build duplicated');
      push(`/builds/${duplicate.id}`);
    }
  }

  // Export single build
  function handleExport() {
    const json = buildsStore.export([build.id]);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${build.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toasts.success('Build exported');
  }
</script>

<div class="build-detail">
  <!-- Header -->
  <header class="detail-header">
    <div class="header-info">
      <div class="header-badges">
        <Badge variant="archetype" value={build.archetype} />
        <Badge variant="tier" value={build.tier} />
      </div>
      <h1 class="build-name">{build.name}</h1>
      <p class="build-meta">
        Created {formatDate(build.createdAt)}
        {#if build.updatedAt !== build.createdAt}
          · Updated {formatDate(build.updatedAt)}
        {/if}
      </p>
    </div>
    <div class="header-actions">
      <a href="#/builds/{build.id}/edit" class="btn btn--primary">Edit</a>
      <button class="btn btn--secondary" onclick={handleDuplicate}>Duplicate</button>
      <button class="btn btn--secondary" onclick={handleExport}>Export</button>
      <button class="btn btn--danger" onclick={handleDelete}>Delete</button>
    </div>
  </header>

  <!-- Score -->
  <div class="score-display">
    <span class="score-label">Estimated Score</span>
    <span class="score-value">{build.estimatedScore}</span>
  </div>

  <div class="detail-grid">
    <!-- Ship Info -->
    <section class="detail-section">
      <h2>Ship</h2>
      {#if ship}
        <div class="ship-card">
          <div class="ship-header">
            <h3>{ship.name}</h3>
            <div class="ship-badges">
              <Badge variant="class" value={SHIP_TYPE_TO_CLASS[ship.type] || ship.type} />
            </div>
          </div>
          <div class="ship-stats">
            <div class="stat-row">
              <span class="stat-label">HP</span>
              <StatBar value={ship.health} max={maxHp} label={ship.health.toLocaleString()} variant="hp" />
            </div>
            <div class="stat-row">
              <span class="stat-label">Speed</span>
              <StatBar value={ship.speed} max={maxSpeed} label={ship.speed.toString()} variant="speed" />
            </div>
            <div class="stat-row">
              <span class="stat-label">Armor</span>
              <StatBar value={ship.armor} max={maxArmor} label={ship.armor.toString()} variant="armor" />
            </div>
            <div class="stat-row">
              <span class="stat-label">Cargo</span>
              <span class="stat-value">{ship.cargo}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Crew</span>
              <span class="stat-value">{ship.crewSlots}</span>
            </div>
          </div>
        </div>
      {:else}
        <p class="no-data">No ship selected</p>
      {/if}
    </section>

    <!-- Weapons -->
    <section class="detail-section">
      <h2>Weapons</h2>
      <div class="loadout-list">
        <div class="loadout-item">
          <span class="loadout-slot">Broadside</span>
          {#if broadsideWeapon}
            <span class="loadout-value">{broadsideWeapon.name}</span>
            <span class="loadout-meta">{broadsideWeapon.category}</span>
          {:else}
            <span class="loadout-empty">Not equipped</span>
          {/if}
        </div>
        <div class="loadout-item">
          <span class="loadout-slot">Bow</span>
          {#if bowWeapon}
            <span class="loadout-value">{bowWeapon.name}</span>
          {:else}
            <span class="loadout-empty">Not equipped</span>
          {/if}
        </div>
        <div class="loadout-item">
          <span class="loadout-slot">Stern</span>
          {#if sternWeapon}
            <span class="loadout-value">{sternWeapon.name}</span>
          {:else}
            <span class="loadout-empty">Not equipped</span>
          {/if}
        </div>
        <div class="loadout-item">
          <span class="loadout-slot">Mortar</span>
          {#if mortarWeapon}
            <span class="loadout-value">{mortarWeapon.name}</span>
          {:else}
            <span class="loadout-empty">Not equipped</span>
          {/if}
        </div>
      </div>
    </section>

    <!-- Ammo -->
    <section class="detail-section">
      <h2>Ammunition</h2>
      <div class="loadout-list">
        <div class="loadout-item">
          <span class="loadout-slot">Primary</span>
          {#if primaryAmmoData}
            <span class="loadout-value">{primaryAmmoData.name}</span>
            <span class="loadout-meta">x{primaryAmmoData.damageFactor} damage</span>
          {:else}
            <span class="loadout-empty">Not selected</span>
          {/if}
        </div>
        <div class="loadout-item">
          <span class="loadout-slot">Secondary</span>
          {#if secondaryAmmoData}
            <span class="loadout-value">{secondaryAmmoData.name}</span>
            <span class="loadout-meta">x{secondaryAmmoData.damageFactor} damage</span>
          {:else}
            <span class="loadout-empty">Not selected</span>
          {/if}
        </div>
      </div>
    </section>

    <!-- Upgrades -->
    <section class="detail-section">
      <h2>Upgrades ({selectedUpgrades.length}/6)</h2>
      {#if selectedUpgrades.length > 0}
        <div class="upgrades-list">
          {#each selectedUpgrades as upgrade (upgrade?.id)}
            <div class="upgrade-item">
              <span class="upgrade-name">{upgrade?.name}</span>
              <span class="upgrade-slot">{upgrade?.category}</span>
            </div>
          {/each}
        </div>
      {:else}
        <p class="no-data">No upgrades selected</p>
      {/if}
    </section>

    <!-- Strategy -->
    <section class="detail-section detail-section--wide">
      <h2>Strategy</h2>
      {#if build.strategy}
        <p class="strategy-text">{build.strategy}</p>
      {:else}
        <p class="no-data">No strategy description</p>
      {/if}
    </section>

    <!-- Strengths & Weaknesses -->
    <section class="detail-section">
      <h2>Strengths</h2>
      {#if build.strengths.length > 0}
        <ul class="pros-cons-list pros">
          {#each build.strengths as strength (strength)}
            <li>{strength}</li>
          {/each}
        </ul>
      {:else}
        <p class="no-data">None listed</p>
      {/if}
    </section>

    <section class="detail-section">
      <h2>Weaknesses</h2>
      {#if build.weaknesses.length > 0}
        <ul class="pros-cons-list cons">
          {#each build.weaknesses as weakness (weakness)}
            <li>{weakness}</li>
          {/each}
        </ul>
      {:else}
        <p class="no-data">None listed</p>
      {/if}
    </section>
  </div>

  <!-- Back link -->
  <div class="back-link">
    <a href="#/builds">← Back to Builds</a>
  </div>
</div>

<style>
  .build-detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-lg);
    padding-bottom: var(--space-lg);
    border-bottom: 2px solid var(--wood-grain);
  }

  .header-badges {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .build-name {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-xs);
  }

  .build-meta {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .btn {
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    border: 2px solid transparent;
  }

  .btn--primary {
    background: var(--gold-primary);
    color: var(--wood-dark);
    border-color: var(--gold-dark);
  }

  .btn--primary:hover {
    background: var(--gold-light);
  }

  .btn--secondary {
    background: var(--bg-tertiary);
    color: var(--canvas);
    border-color: var(--wood-grain);
  }

  .btn--secondary:hover {
    border-color: var(--brass);
  }

  .btn--danger {
    background: var(--bg-tertiary);
    color: var(--error-light);
    border-color: var(--wood-grain);
  }

  .btn--danger:hover {
    border-color: var(--error);
  }

  .score-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: linear-gradient(135deg, rgba(212, 168, 83, 0.1), transparent);
    border: 2px solid var(--gold-dark);
    border-radius: var(--radius-lg);
  }

  .score-label {
    font-family: var(--font-display);
    color: var(--brass-light);
  }

  .score-value {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
  }

  .detail-section {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .detail-section--wide {
    grid-column: 1 / -1;
  }

  .detail-section h2 {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--wood-dark);
  }

  .ship-card {
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: var(--space-md);
  }

  .ship-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
  }

  .ship-header h3 {
    font-family: var(--font-display);
    color: var(--gold-primary);
    margin: 0;
  }

  .ship-stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .stat-row {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .stat-label {
    width: 60px;
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .stat-value {
    font-family: var(--font-display);
    color: var(--canvas);
  }

  .loadout-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .loadout-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
  }

  .loadout-slot {
    font-size: var(--text-sm);
    color: var(--text-muted);
    min-width: 70px;
  }

  .loadout-value {
    font-weight: var(--font-medium);
    color: var(--canvas);
    flex: 1;
  }

  .loadout-meta {
    font-size: var(--text-xs);
    color: var(--brass);
  }

  .loadout-empty {
    font-style: italic;
    color: var(--text-muted);
  }

  .upgrades-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-sm);
  }

  .upgrade-item {
    display: flex;
    flex-direction: column;
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
  }

  .upgrade-name {
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  .upgrade-slot {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: capitalize;
  }

  .strategy-text {
    color: var(--canvas-aged);
    line-height: var(--leading-relaxed);
    margin: 0;
    white-space: pre-wrap;
  }

  .pros-cons-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .pros-cons-list li {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
  }

  .pros-cons-list.pros li {
    background: rgba(40, 167, 69, 0.1);
    color: var(--success-light);
  }

  .pros-cons-list.pros li::before {
    content: '+ ';
    font-weight: bold;
  }

  .pros-cons-list.cons li {
    background: rgba(220, 53, 69, 0.1);
    color: var(--error-light);
  }

  .pros-cons-list.cons li::before {
    content: '- ';
    font-weight: bold;
  }

  .no-data {
    font-style: italic;
    color: var(--text-muted);
    margin: 0;
  }

  .back-link {
    padding-top: var(--space-lg);
    border-top: 1px solid var(--wood-dark);
  }

  .back-link a {
    color: var(--brass-light);
    text-decoration: none;
    font-family: var(--font-display);
  }

  .back-link a:hover {
    color: var(--gold-primary);
  }

  @media (max-width: 768px) {
    .detail-header {
      flex-direction: column;
    }

    .header-actions {
      width: 100%;
    }

    .header-actions .btn {
      flex: 1;
      justify-content: center;
    }
  }
</style>
