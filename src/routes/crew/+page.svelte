<script lang="ts">
  import type { CrewUnit, CaptainSkill, SkillCategory } from '$lib/data/types';
  import { dataStore, filteredCrews, crewFilters, pvpSkills, combatSkills, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState } from '$lib/components/ui';
  import { CrewDetailModal, SkillDetailModal } from '$lib/components/crew';

  const crewTypes = ['Sailor', 'Boarding', 'Special'];
  const skillCategories: SkillCategory[] = ['combat', 'logistics', 'economy', 'legend'];

  // View tabs
  type ViewTab = 'crew' | 'skills';
  let activeView: ViewTab = $state('crew');

  // Skill category filter
  let activeSkillCategory: SkillCategory | '' = $state('');

  // Selected items for modals
  let selectedCrew: CrewUnit | null = $state(null);
  let selectedSkill: CaptainSkill | null = $state(null);
  let crewModalOpen = $state(false);
  let skillModalOpen = $state(false);

  // Computed
  const regularCrew = $derived($filteredCrews.filter(c => c.type !== 'Special'));
  const specialCrew = $derived($filteredCrews.filter(c => c.type === 'Special'));

  const filteredSkills = $derived(
    activeSkillCategory
      ? $dataStore.skills.filter(s => s.category === activeSkillCategory)
      : $dataStore.skills
  );

  const viewTabs = [
    { id: 'crew', label: 'Crew Units', count: $dataStore.crews.length },
    { id: 'skills', label: 'Captain Skills', count: $dataStore.skills.length }
  ];

  const skillCategoryTabs = [
    { id: '', label: 'All', count: $dataStore.skills.length },
    ...skillCategories.map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: $dataStore.skills.filter(s => s.category === cat).length
    }))
  ];

  function openCrewModal(crew: CrewUnit) {
    selectedCrew = crew;
    crewModalOpen = true;
  }

  function closeCrewModal() {
    crewModalOpen = false;
    selectedCrew = null;
  }

  function openSkillModal(skill: CaptainSkill) {
    selectedSkill = skill;
    skillModalOpen = true;
  }

  function closeSkillModal() {
    skillModalOpen = false;
    selectedSkill = null;
  }

  // Loading state detection
  const hasNoData = $derived($dataStore.crews.length === 0 && $dataStore.skills.length === 0);
  const hasNoCrewResults = $derived($filteredCrews.length === 0 && $dataStore.crews.length > 0);

  function handleRetry() {
    dataStore.load();
  }
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">Crew</h1>
    <p class="page-subtitle">{$dataStore.crews.length} crew units - {$dataStore.skills.length} captain skills</p>
  </header>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading crew data..." />
  {:else if hasNoData}
    <EmptyState
      icon="👥"
      title="No crew data available"
      message="Crew and skill data could not be loaded. Please try again."
    />
  {:else}
  <div class="view-tabs">
    <Tabs
      tabs={viewTabs}
      activeTab={activeView}
      onchange={(id) => activeView = id as ViewTab}
    />
  </div>

  {#if activeView === 'crew'}
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
            <button class="crew-card" onclick={() => openCrewModal(crew)}>
              <div class="crew-card__header">
                <Badge variant="category" value={crew.type} />
                {#if crew.pvpRelevant}
                  <Badge variant="status" value="PvP" size="sm" />
                {/if}
              </div>
              <h3 class="crew-card__name">{crew.name}</h3>
              <div class="crew-card__stats">
                <div class="stat">
                  <span class="stat__label">DMG</span>
                  <span class="stat__value">{crew.damage}</span>
                </div>
                <div class="stat">
                  <span class="stat__label">HP</span>
                  <span class="stat__value">{crew.health}</span>
                </div>
                <div class="stat">
                  <span class="stat__label">Cap</span>
                  <span class="stat__value">{crew.capacity}</span>
                </div>
                <div class="stat">
                  <span class="stat__label">Cost</span>
                  <span class="stat__value">{crew.cost}</span>
                </div>
              </div>
            </button>
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
            <button class="special-card" class:pvp-relevant={crew.pvpRelevant} onclick={() => openCrewModal(crew)}>
              <div class="special-card__header">
                <h3 class="special-card__name">{crew.name}</h3>
                {#if crew.pvpRelevant}
                  <Badge variant="status" value="PvP" size="sm" />
                {/if}
              </div>
              <p class="special-card__effect">{crew.effect || 'No special effect'}</p>
              <div class="special-card__footer">
                <span class="special-card__cost">{crew.cost.toLocaleString()} gold</span>
              </div>
            </button>
          {/each}
        </div>
      </section>
    {/if}
  {:else}
    <!-- Skills View -->
    <div class="category-tabs">
      <Tabs
        tabs={skillCategoryTabs}
        activeTab={activeSkillCategory}
        onchange={(id) => activeSkillCategory = id as SkillCategory | ''}
      />
    </div>

    <div class="skills-grid">
      {#each filteredSkills as skill (skill.id)}
        <button class="skill-card" class:pvp-relevant={skill.pvpRelevant} onclick={() => openSkillModal(skill)}>
          <div class="skill-card__header">
            <Badge variant="category" value={skill.category} />
            {#if skill.pvpRelevant}
              <Badge variant="status" value="PvP" size="sm" />
            {/if}
          </div>
          <h3 class="skill-card__name">{skill.name}</h3>
          <p class="skill-card__effect">{skill.effect}</p>
          <div class="skill-card__footer">
            <span class="skill-card__cost">{skill.costPoints} pts</span>
            {#if skill.dependsOn}
              <span class="skill-card__depends">Requires: {skill.dependsOn}</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
  {/if}
</div>

<CrewDetailModal
  crew={selectedCrew}
  open={crewModalOpen}
  onclose={closeCrewModal}
/>

<SkillDetailModal
  skill={selectedSkill}
  open={skillModalOpen}
  onclose={closeSkillModal}
/>

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

  .view-tabs,
  .category-tabs {
    display: flex;
    justify-content: center;
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .crew-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .crew-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .crew-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .crew-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .crew-card__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-xs);
    margin-top: var(--space-xs);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat__label {
    font-size: var(--text-2xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .stat__value {
    font-weight: var(--font-semibold);
    color: var(--canvas);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  .special-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-md);
  }

  .special-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .special-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .special-card.pvp-relevant {
    border-color: var(--brass);
  }

  .special-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .special-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .special-card__effect {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    margin: 0;
    line-height: var(--leading-relaxed);
    flex: 1;
  }

  .special-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .special-card__cost {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
  }

  .skill-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .skill-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .skill-card.pvp-relevant {
    border-color: var(--brass);
  }

  .skill-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skill-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .skill-card__effect {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    font-family: var(--font-mono);
    margin: 0;
    line-height: var(--leading-relaxed);
    flex: 1;
  }

  .skill-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
  }

  .skill-card__cost {
    font-size: var(--text-sm);
    color: var(--brass-light);
    font-weight: var(--font-semibold);
  }

  .skill-card__depends {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .filter-group {
      width: 100%;
    }

    .filter-count {
      margin-left: 0;
      text-align: center;
    }
  }
</style>
