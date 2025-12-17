<script lang="ts">
  import { dataStore, filteredCrews, crewFilters, pvpSkills } from '$lib/stores';

  const crewTypes = ['Sailor', 'Boarding', 'Special'];

  $: regularCrew = $filteredCrews.filter(c => c.type !== 'Special');
  $: specialCrew = $filteredCrews.filter(c => c.type === 'Special');
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">👥 Crew</h1>
    <p class="page-subtitle">{$dataStore.crews.length} crew units • {$dataStore.skills.length} captain skills</p>
  </header>

  <div class="filters">
    <div class="filter-group">
      <label for="type-filter">Type</label>
      <select id="type-filter" bind:value={$crewFilters.type}>
        <option value="">All Types</option>
        {#each crewTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={$crewFilters.pvpOnly} />
        PvP Relevant Only
      </label>
    </div>

    <div class="filter-group filter-group--search">
      <label for="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Search crew..."
        bind:value={$crewFilters.search}
      />
    </div>

    <span class="filter-count">{$filteredCrews.length} crew</span>
  </div>

  <!-- Regular Crew -->
  {#if regularCrew.length > 0}
    <section class="section">
      <h2 class="section-title">Combat Crew</h2>
      <div class="crew-grid">
        {#each regularCrew as crew (crew.id)}
          <div class="crew-card">
            <div class="crew-card__header">
              <span class="crew-card__icon">
                {crew.type === 'Sailor' ? '⚓' : '⚔️'}
              </span>
              <div>
                <h3 class="crew-card__name">{crew.name}</h3>
                <span class="crew-card__type">{crew.type}</span>
              </div>
            </div>
            <div class="crew-card__stats">
              <div class="stat">
                <span class="stat__label">Damage</span>
                <span class="stat__value">{crew.damage}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Health</span>
                <span class="stat__value">{crew.health}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Capacity</span>
                <span class="stat__value">{crew.capacity}</span>
              </div>
              <div class="stat">
                <span class="stat__label">Cost</span>
                <span class="stat__value">{crew.cost}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Special Crew -->
  {#if specialCrew.length > 0}
    <section class="section">
      <h2 class="section-title">Special Crew</h2>
      <div class="special-grid">
        {#each specialCrew as crew (crew.id)}
          <div class="special-card" class:pvp-relevant={crew.pvpRelevant}>
            <h3 class="special-card__name">{crew.name}</h3>
            <p class="special-card__effect">{crew.effect || 'No special effect'}</p>
            <div class="special-card__footer">
              <span class="special-card__cost">{crew.cost} gold</span>
              {#if crew.pvpRelevant}
                <span class="pvp-badge">PvP</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Captain Skills -->
  <section class="section">
    <h2 class="section-title">PvP Captain Skills</h2>
    <div class="skills-grid">
      {#each $pvpSkills as skill (skill.id)}
        <div class="skill-card">
          <h3 class="skill-card__name">{skill.name}</h3>
          <p class="skill-card__effect">{skill.effect}</p>
          <div class="skill-card__footer">
            <span class="skill-card__cost">{skill.costPoints} pts</span>
            <span class="skill-card__category">{skill.category}</span>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .page-header {
    text-align: center;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-xs);
  }

  .page-subtitle {
    color: var(--text-muted);
    margin: 0;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    padding: var(--space-md);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .filter-group label {
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .filter-group select,
  .filter-group input[type="text"] {
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-tertiary);
    border: 1px solid var(--wood-grain);
    border-radius: var(--radius-md);
    color: var(--canvas);
    font-size: var(--text-sm);
    min-width: 140px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    padding: var(--space-sm) 0;
  }

  .checkbox-label input {
    accent-color: var(--gold-primary);
  }

  .filter-group--search {
    flex: 1;
    min-width: 200px;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin-left: auto;
  }

  .section {
    margin-top: var(--space-md);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
  }

  .crew-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-md);
  }

  .crew-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .crew-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .crew-card__icon {
    font-size: var(--text-2xl);
  }

  .crew-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .crew-card__type {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .crew-card__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .stat__label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .stat__value {
    font-weight: var(--font-semibold);
    color: var(--canvas);
  }

  .special-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .special-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .special-card.pvp-relevant {
    border-color: var(--brass);
  }

  .special-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .special-card__effect {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    margin: 0 0 var(--space-md);
    line-height: var(--leading-relaxed);
  }

  .special-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .special-card__cost {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .pvp-badge {
    background: var(--archetype-brawler);
    color: white;
    font-size: var(--text-xs);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-weight: var(--font-semibold);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
  }

  .skill-card {
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
  }

  .skill-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .skill-card__effect {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    margin: 0 0 var(--space-md);
    font-family: var(--font-mono);
  }

  .skill-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skill-card__cost {
    font-size: var(--text-sm);
    color: var(--brass-light);
    font-weight: var(--font-semibold);
  }

  .skill-card__category {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }
</style>
