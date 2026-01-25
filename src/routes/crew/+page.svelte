<script lang="ts">
  import type { CrewUnit, CaptainSkill, SkillCategory } from '$lib/data/types';
  import { dataStore, filteredCrews, crewFilters, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, ImageWithFallback } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';
  import { CrewDetailModal, SkillDetailModal } from '$lib/components/crew';
  import { getCrewIconUrl, getSkillIconUrl } from '$lib/utils/storage';

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

  function handleRetry() {
    dataStore.load();
  }

  function getCrewTypeIcon(type: string): string {
    switch (type) {
      case 'Sailor': return '⚓';
      case 'Boarding': return '⚔️';
      case 'Special': return '✨';
      default: return '👤';
    }
  }

  function getSkillCategoryIcon(category: SkillCategory): string {
    switch (category) {
      case 'combat': return '⚔️';
      case 'logistics': return '📦';
      case 'economy': return '💰';
      case 'legend': return '👑';
      default: return '📜';
    }
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Crew"
    subtitle="{$dataStore.crews.length} crew units - {$dataStore.skills.length} captain skills"
  />

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
      <Toolbar>
        <FilterGroup label="Type" for="type-filter">
          <select id="type-filter" bind:value={$crewFilters.type}>
            <option value="">All Types</option>
            {#each crewTypes as type (type)}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </FilterGroup>

        <div class="checkbox-wrapper">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={$crewFilters.pvpOnly} />
            PvP Relevant Only
          </label>
        </div>

        <FilterGroup label="Search" for="search" grow minWidth="200px">
          <input
            id="search"
            type="text"
            placeholder="Search crew..."
            bind:value={$crewFilters.search}
          />
        </FilterGroup>

        {#snippet actions()}
          <span class="filter-count">{$filteredCrews.length} crew</span>
        {/snippet}
      </Toolbar>

      <!-- Regular Crew -->
      {#if regularCrew.length > 0}
        <section class="section">
          <h2 class="section-title">Combat Crew</h2>
          <Grid columns="auto" minWidth="200px" gap="md">
            {#each regularCrew as crew (crew.id)}
              <button class="crew-card" aria-label="View {crew.name} details" onclick={() => openCrewModal(crew)}>
                <div class="crew-card__header">
                  <div class="crew-card__icon-container">
                    {#if crew.icon}
                      <ImageWithFallback
                        src={getCrewIconUrl(crew.icon)}
                        alt={crew.name}
                        fallback={getCrewTypeIcon(crew.type)}
                        class="crew-card__icon-img"
                      />
                    {:else}
                      <span class="crew-card__icon">{getCrewTypeIcon(crew.type)}</span>
                    {/if}
                  </div>
                  <div class="crew-card__meta">
                    <Badge variant="category" value={crew.type} />
                    {#if crew.pvpRelevant}
                      <Badge variant="status" value="PvP" size="sm" />
                    {/if}
                  </div>
                </div>
                <h3 class="crew-card__name">{crew.name}</h3>
                {#if crew.description}
                  <p class="crew-card__description">{crew.description}</p>
                {/if}
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
          </Grid>
        </section>
      {/if}

      <!-- Special Crew -->
      {#if specialCrew.length > 0}
        <section class="section">
          <h2 class="section-title">Special Crew</h2>
          <Grid columns="auto" minWidth="250px" gap="md">
            {#each specialCrew as crew (crew.id)}
              <button class="special-card" class:pvp-relevant={crew.pvpRelevant} aria-label="View {crew.name} details" onclick={() => openCrewModal(crew)}>
                <div class="special-card__header">
                  <div class="special-card__icon-container">
                    {#if crew.icon}
                      <ImageWithFallback
                        src={getCrewIconUrl(crew.icon)}
                        alt={crew.name}
                        fallback="✨"
                        class="special-card__icon-img"
                      />
                    {:else}
                      <span class="special-card__icon">✨</span>
                    {/if}
                  </div>
                  <div class="special-card__title">
                    <h3 class="special-card__name">{crew.name}</h3>
                    {#if crew.pvpRelevant}
                      <Badge variant="status" value="PvP" size="sm" />
                    {/if}
                  </div>
                </div>
                {#if crew.description}
                  <p class="special-card__description">{crew.description}</p>
                {/if}
                <p class="special-card__effect">{crew.effect || 'No special effect'}</p>
                <div class="special-card__footer">
                  <span class="special-card__cost">{crew.cost.toLocaleString()} gold</span>
                </div>
              </button>
            {/each}
          </Grid>
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

      <Grid columns="auto" minWidth="280px" gap="md">
        {#each filteredSkills as skill (skill.id)}
          <button class="skill-card" class:pvp-relevant={skill.pvpRelevant} aria-label="View {skill.name} skill details" onclick={() => openSkillModal(skill)}>
            <div class="skill-card__header">
              <div class="skill-card__icon-container">
                {#if skill.icon}
                  <ImageWithFallback
                    src={getSkillIconUrl(skill.icon)}
                    alt={skill.name}
                    fallback={getSkillCategoryIcon(skill.category)}
                    class="skill-card__icon-img"
                  />
                {:else}
                  <span class="skill-card__icon">{getSkillCategoryIcon(skill.category)}</span>
                {/if}
              </div>
              <div class="skill-card__meta">
                <Badge variant="category" value={skill.category} />
                {#if skill.pvpRelevant}
                  <Badge variant="status" value="PvP" size="sm" />
                {/if}
              </div>
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
      </Grid>
    {/if}
  {/if}
</Stack>

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
  .view-tabs,
  .category-tabs {
    display: flex;
    justify-content: center;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  .checkbox-wrapper {
    display: flex;
    align-items: flex-end;
    padding-bottom: var(--space-sm);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .checkbox-label input {
    accent-color: var(--gold-primary);
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

  .crew-card:focus-visible {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .crew-card__header {
    display: flex;
    gap: var(--space-sm);
    align-items: flex-start;
  }

  .crew-card__icon-container {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .crew-card__icon-container :global(.crew-card__icon-img) {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .crew-card__icon {
    font-size: var(--text-2xl);
  }

  .crew-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .crew-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .crew-card__description {
    font-size: var(--text-xs);
    color: var(--canvas-aged);
    margin: 0;
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

  .special-card:focus-visible {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .special-card.pvp-relevant {
    border-color: var(--brass);
  }

  .special-card__header {
    display: flex;
    gap: var(--space-sm);
    align-items: flex-start;
  }

  .special-card__icon-container {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .special-card__icon-container :global(.special-card__icon-img) {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .special-card__icon {
    font-size: var(--text-xl);
  }

  .special-card__title {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .special-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .special-card__description {
    font-size: var(--text-xs);
    color: var(--canvas-aged);
    margin: 0;
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

  .skill-card:focus-visible {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .skill-card.pvp-relevant {
    border-color: var(--brass);
  }

  .skill-card__header {
    display: flex;
    gap: var(--space-sm);
    align-items: flex-start;
  }

  .skill-card__icon-container {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skill-card__icon-container :global(.skill-card__icon-img) {
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: var(--radius-sm);
  }

  .skill-card__icon {
    font-size: var(--text-2xl);
  }

  .skill-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
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
</style>
