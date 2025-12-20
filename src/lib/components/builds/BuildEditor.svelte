<script lang="ts">
  import { untrack } from 'svelte';
  import { dataStore, buildsStore, createShipLookup, createWeaponLookup, createAmmoLookup, toasts } from '$lib/stores';
  import { safeMax, safePercentage } from '$lib/utils/safe-math';
  import type { Build, Archetype } from '$lib/data/types';
  import { SHIP_TYPE_TO_CLASS } from '$lib/data/types';
  import { ARCHETYPE_WEIGHTS } from '$lib/data/constants';
  import { Badge } from '$lib/components/ui';
  import { push } from 'svelte-spa-router';

  interface Props {
    build?: Build;
    mode: 'create' | 'edit';
  }

  let { build, mode }: Props = $props();

  // Capture initial values from build prop (intentional one-time initialization for form editing)
  // Using untrack() to explicitly opt out of reactive tracking since this is form initialization
  const initialValues = untrack(() => ({
    name: build?.name || 'New Build',
    archetype: build?.archetype || 'brawler',
    tier: build?.tier || 4,
    shipId: build?.shipId ?? null,
    broadside: build?.weapons.broadside || '',
    bow: build?.weapons.bow || '',
    stern: build?.weapons.stern || '',
    mortar: build?.weapons.mortar || '',
    primaryAmmo: build?.ammo.primary || '',
    secondaryAmmo: build?.ammo.secondary || '',
    upgrades: build?.upgrades || [],
    strategy: build?.strategy || '',
    strengths: build?.strengths?.join('\n') || '',
    weaknesses: build?.weaknesses?.join('\n') || ''
  }));

  // Form state (initialized from captured values)
  let name = $state(initialValues.name);
  let archetype = $state<Archetype>(initialValues.archetype as Archetype);
  let tier = $state(initialValues.tier);
  let shipId = $state<number | null>(initialValues.shipId);
  let broadside = $state(initialValues.broadside);
  let bow = $state(initialValues.bow);
  let stern = $state(initialValues.stern);
  let mortar = $state(initialValues.mortar);
  let primaryAmmo = $state(initialValues.primaryAmmo);
  let secondaryAmmo = $state(initialValues.secondaryAmmo);
  let selectedUpgrades = $state<string[]>(initialValues.upgrades);
  let strategy = $state(initialValues.strategy);
  let strengths = $state<string>(initialValues.strengths);
  let weaknesses = $state<string>(initialValues.weaknesses);

  // Lookups
  const shipLookup = $derived(createShipLookup($dataStore.ships));
  const weaponLookup = $derived(createWeaponLookup($dataStore.weapons));
  const _ammoLookup = $derived(createAmmoLookup($dataStore.ammo));

  // Selected ship details
  const selectedShip = $derived(shipId !== null ? shipLookup.get(shipId) ?? null : null);

  // Filter ships by tier
  const availableShips = $derived(
    $dataStore.ships.filter(s => s.tier === tier && s.isPlayable).sort((a, b) => a.name.localeCompare(b.name))
  );

  // Filter weapons by category
  const cannons = $derived($dataStore.weapons.filter(w =>
    ['Cannon', 'Carronade', 'Culverin', 'Long Gun'].includes(w.category)
  ));
  const mortars = $derived($dataStore.weapons.filter(w => w.category === 'Mortar'));

  // Archetypes
  const archetypes: { value: Archetype; label: string; description: string }[] = [
    { value: 'brawler', label: 'Brawler', description: 'Close-range combat, high HP and damage' },
    { value: 'kite', label: 'Kite', description: 'Hit-and-run tactics, speed focused' },
    { value: 'sniper', label: 'Sniper', description: 'Long-range precision, accuracy focused' },
    { value: 'pursuit', label: 'Pursuit', description: 'Fast pursuit and chase, speed and damage' },
    { value: 'trade', label: 'Trade', description: 'Cargo capacity, survivability' },
    { value: 'siege', label: 'Siege', description: 'Mortar-based, structure damage' }
  ];

  // Handle tier change - reset ship selection
  function handleTierChange() {
    shipId = null;
  }

  // Toggle upgrade selection
  function toggleUpgrade(upgradeId: string) {
    if (selectedUpgrades.includes(upgradeId)) {
      selectedUpgrades = selectedUpgrades.filter(id => id !== upgradeId);
    } else if (selectedUpgrades.length < 6) {
      selectedUpgrades = [...selectedUpgrades, upgradeId];
    }
  }

  // Calculate estimated score using full 8-weight archetype system
  function calculateScore(): number {
    if (!selectedShip) return 0;

    const weights = ARCHETYPE_WEIGHTS[archetype];
    const ships = $dataStore.ships;
    const weapons = $dataStore.weapons;

    // Calculate max values for normalization
    const maxHp = safeMax(ships.map(s => s.health), 1);
    const maxSpeed = safeMax(ships.map(s => s.speed), 1);
    const maxArmor = safeMax(ships.map(s => s.armor), 1);
    const maxCargo = safeMax(ships.map(s => s.cargo), 1);
    const maxCrew = safeMax(ships.map(s => s.crewSlots), 1);
    const maxRange = safeMax(weapons.map(w => w.distance), 1);
    const maxDps = safeMax(weapons.map(w => w.penetration / Math.max(w.cooldown, 0.1)), 1);

    // Ship-based scores (0-100 scale)
    let score = 0;
    score += safePercentage(selectedShip.health, maxHp) * weights.hp;
    score += safePercentage(selectedShip.speed, maxSpeed) * weights.speed;
    score += safePercentage(selectedShip.armor, maxArmor) * weights.armor;
    score += safePercentage(selectedShip.cargo, maxCargo) * weights.cargo;
    score += safePercentage(selectedShip.crewSlots, maxCrew) * weights.crew;

    // Weapon-based scores (if weapon selected)
    const selectedWeapon = broadside ? weaponLookup.get(broadside) : null;
    if (selectedWeapon) {
      const dps = selectedWeapon.penetration / Math.max(selectedWeapon.cooldown, 0.1);
      score += safePercentage(dps, maxDps) * weights.dps;
      score += safePercentage(selectedWeapon.distance, maxRange) * weights.range;
      // Accuracy: lower scatter = higher accuracy (invert the percentage)
      const accuracyScore = 100 - Math.min(selectedWeapon.scatter * 10, 100);
      score += accuracyScore * weights.accuracy;
    } else {
      // Base scores if no weapon selected (30% of potential)
      score += 30 * (weights.dps + weights.range + weights.accuracy);
    }

    return Math.round(score);
  }

  // Save build
  function handleSave() {
    if (!name.trim()) {
      toasts.warning('Please enter a build name');
      return;
    }
    if (shipId === null) {
      toasts.warning('Please select a ship');
      return;
    }

    const buildData = {
      name: name.trim(),
      archetype,
      tier,
      shipId,
      weapons: {
        broadside: broadside || undefined,
        bow: bow || undefined,
        stern: stern || undefined,
        mortar: mortar || undefined
      },
      ammo: {
        primary: primaryAmmo || undefined,
        secondary: secondaryAmmo || undefined
      },
      upgrades: selectedUpgrades,
      consumables: [] as string[],
      strategy: strategy.trim(),
      strengths: strengths.split('\n').filter(s => s.trim()),
      weaknesses: weaknesses.split('\n').filter(s => s.trim()),
      estimatedScore: calculateScore()
    };

    if (mode === 'edit' && build) {
      buildsStore.update(build.id, buildData);
      toasts.success('Build updated successfully');
      push(`/builds/${build.id}`);
    } else {
      const newBuild = buildsStore.create(buildData);
      toasts.success('Build created successfully');
      push(`/builds/${newBuild.id}`);
    }
  }

  // Cancel editing
  function handleCancel() {
    if (mode === 'edit' && build) {
      push(`/builds/${build.id}`);
    } else {
      push('/builds');
    }
  }
</script>

<div class="build-editor">
  <header class="editor-header">
    <h1>{mode === 'edit' ? 'Edit Build' : 'Create New Build'}</h1>
    <div class="header-actions">
      <button class="btn btn--secondary" onclick={handleCancel}>Cancel</button>
      <button class="btn btn--primary" onclick={handleSave}>
        {mode === 'edit' ? 'Save Changes' : 'Create Build'}
      </button>
    </div>
  </header>

  <div class="editor-grid">
    <!-- Basic Info -->
    <section class="editor-section">
      <h2>Basic Information</h2>

      <div class="form-group">
        <label for="build-name">Build Name</label>
        <input
          id="build-name"
          type="text"
          bind:value={name}
          placeholder="Enter build name..."
        />
      </div>

      <fieldset class="form-group">
        <legend>Archetype</legend>
        <div class="archetype-grid" role="radiogroup" aria-label="Select archetype">
          {#each archetypes as arch (arch.value)}
            <button
              class="archetype-card"
              class:active={archetype === arch.value}
              onclick={() => archetype = arch.value}
              role="radio"
              aria-checked={archetype === arch.value}
            >
              <Badge variant="archetype" value={arch.value} />
              <span class="archetype-desc">{arch.description}</span>
            </button>
          {/each}
        </div>
      </fieldset>

      <div class="form-row">
        <div class="form-group">
          <label for="tier">Tier</label>
          <select id="tier" bind:value={tier} onchange={handleTierChange}>
            {#each [1, 2, 3, 4, 5, 6, 7] as t (t)}
              <option value={t}>Tier {t}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>

    <!-- Ship Selection -->
    <section class="editor-section">
      <h2>Ship Selection</h2>

      <div class="form-group">
        <label for="ship">Select Ship (Tier {tier})</label>
        <select
          id="ship"
          value={shipId?.toString() ?? ''}
          onchange={(e) => {
            const value = e.currentTarget.value;
            shipId = value === '' ? null : Number(value);
          }}
        >
          <option value="">-- Select a Ship --</option>
          {#each availableShips as ship (ship.id)}
            <option value={ship.id.toString()}>{ship.name} ({ship.shipClass})</option>
          {/each}
        </select>
      </div>

      {#if selectedShip}
        <div class="ship-preview">
          <h3>{selectedShip.name}</h3>
          <div class="ship-stats">
            <div class="stat">
              <span class="stat-label">HP</span>
              <span class="stat-value">{selectedShip.health.toLocaleString()}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Speed</span>
              <span class="stat-value">{selectedShip.speed}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Armor</span>
              <span class="stat-value">{selectedShip.armor}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Cargo</span>
              <span class="stat-value">{selectedShip.cargo}</span>
            </div>
          </div>
          <div class="ship-slots">
            <Badge variant="tier" value={selectedShip.tier} />
            <Badge variant="class" value={SHIP_TYPE_TO_CLASS[selectedShip.type] || selectedShip.type} />
          </div>
        </div>
      {/if}
    </section>

    <!-- Weapons -->
    <section class="editor-section">
      <h2>Weapon Loadout</h2>

      <div class="form-group">
        <label for="broadside">Broadside Cannons</label>
        <select id="broadside" bind:value={broadside}>
          <option value="">-- None --</option>
          {#each cannons as weapon (weapon.id)}
            <option value={weapon.id}>{weapon.name} ({weapon.category})</option>
          {/each}
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="bow">Bow Weapon</label>
          <select id="bow" bind:value={bow}>
            <option value="">-- None --</option>
            {#each cannons as weapon (weapon.id)}
              <option value={weapon.id}>{weapon.name}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="stern">Stern Weapon</label>
          <select id="stern" bind:value={stern}>
            <option value="">-- None --</option>
            {#each cannons as weapon (weapon.id)}
              <option value={weapon.id}>{weapon.name}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="mortar">Mortar</label>
        <select id="mortar" bind:value={mortar}>
          <option value="">-- None --</option>
          {#each mortars as weapon (weapon.id)}
            <option value={weapon.id}>{weapon.name}</option>
          {/each}
        </select>
      </div>
    </section>

    <!-- Ammo -->
    <section class="editor-section">
      <h2>Ammunition</h2>

      <div class="form-row">
        <div class="form-group">
          <label for="primary-ammo">Primary Ammo</label>
          <select id="primary-ammo" bind:value={primaryAmmo}>
            <option value="">-- Select --</option>
            {#each $dataStore.ammo as ammo (ammo.id)}
              <option value={ammo.id}>{ammo.name}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="secondary-ammo">Secondary Ammo</label>
          <select id="secondary-ammo" bind:value={secondaryAmmo}>
            <option value="">-- Select --</option>
            {#each $dataStore.ammo as ammo (ammo.id)}
              <option value={ammo.id}>{ammo.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>

    <!-- Upgrades -->
    <section class="editor-section editor-section--wide">
      <h2>Upgrades ({selectedUpgrades.length}/6)</h2>

      <div class="upgrades-grid">
        {#each $dataStore.upgrades as upgrade (upgrade.id)}
          <button
            class="upgrade-card"
            class:selected={selectedUpgrades.includes(upgrade.id)}
            class:disabled={!selectedUpgrades.includes(upgrade.id) && selectedUpgrades.length >= 6}
            onclick={() => toggleUpgrade(upgrade.id)}
          >
            <span class="upgrade-name">{upgrade.name}</span>
            <span class="upgrade-slot">{upgrade.category}</span>
          </button>
        {/each}
      </div>
    </section>

    <!-- Strategy -->
    <section class="editor-section editor-section--wide">
      <h2>Strategy & Notes</h2>

      <div class="form-group">
        <label for="strategy">Strategy Description</label>
        <textarea
          id="strategy"
          bind:value={strategy}
          placeholder="Describe your combat strategy..."
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="strengths">Strengths (one per line)</label>
          <textarea
            id="strengths"
            bind:value={strengths}
            placeholder="High damage&#10;Good survivability&#10;..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="weaknesses">Weaknesses (one per line)</label>
          <textarea
            id="weaknesses"
            bind:value={weaknesses}
            placeholder="Slow speed&#10;Low range&#10;..."
            rows="4"
          ></textarea>
        </div>
      </div>
    </section>
  </div>

  <!-- Score Preview -->
  <div class="score-preview">
    <span class="score-label">Estimated Score:</span>
    <span class="score-value">{calculateScore()}</span>
  </div>
</div>

<style>
  .build-editor {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .editor-header h1 {
    font-family: var(--font-display);
    color: var(--gold-primary);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .btn {
    padding: var(--space-sm) var(--space-lg);
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
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

  .editor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--space-lg);
  }

  .editor-section {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
  }

  .editor-section--wide {
    grid-column: 1 / -1;
  }

  .editor-section h2 {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--wood-dark);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-group label,
  fieldset.form-group legend {
    font-size: var(--text-sm);
    color: var(--brass-light);
    font-weight: var(--font-medium);
  }

  fieldset.form-group {
    border: none;
    padding: 0;
    margin: 0;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
    font-family: var(--font-body);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--gold-primary);
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-md);
  }

  .archetype-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-sm);
  }

  .archetype-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-dark);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .archetype-card:hover {
    border-color: var(--brass);
  }

  .archetype-card.active {
    border-color: var(--gold-primary);
    background: rgba(212, 168, 83, 0.1);
  }

  .archetype-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-align: center;
  }

  .ship-preview {
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    margin-top: var(--space-md);
  }

  .ship-preview h3 {
    font-family: var(--font-display);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .ship-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-sm);
    margin-bottom: var(--space-sm);
  }

  .stat {
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .stat-value {
    font-family: var(--font-display);
    color: var(--canvas);
  }

  .ship-slots {
    display: flex;
    gap: var(--space-xs);
  }

  .upgrades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-sm);
    max-height: 300px;
    overflow-y: auto;
    padding: var(--space-xs);
  }

  .upgrade-card {
    display: flex;
    flex-direction: column;
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-dark);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
  }

  .upgrade-card:hover:not(.disabled) {
    border-color: var(--brass);
  }

  .upgrade-card.selected {
    border-color: var(--gold-primary);
    background: rgba(212, 168, 83, 0.1);
  }

  .upgrade-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  .score-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--bg-card);
    border: 2px solid var(--gold-dark);
    border-radius: var(--radius-lg);
  }

  .score-label {
    font-family: var(--font-display);
    color: var(--brass-light);
  }

  .score-value {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--gold-primary);
  }

  @media (max-width: 768px) {
    .editor-header {
      flex-direction: column;
      text-align: center;
    }

    .ship-stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
