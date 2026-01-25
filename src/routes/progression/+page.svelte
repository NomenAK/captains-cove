<script lang="ts">
  import type { AchievementCategory, Guild, GuildPlace, Fraction } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, Tabs, LoadingState, EmptyState, ErrorState, Toolbar, FilterGroup, Stack, Grid, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';

  // Main tab state
  let activeTab = $state<'ranks' | 'achievements' | 'guilds'>('ranks');

  // Achievement filter state
  const achievementCategories: AchievementCategory[] = ['Battle', 'Arena', 'Top', 'Collection', 'Trade'];
  let selectedAchievementCategory = $state<string>('');
  let achievementSearch = $state<string>('');

  // Guild filter state
  let selectedGuildFaction = $state<string>('');

  // Derived data
  const filteredAchievements = $derived.by(() => {
    let result = $dataStore.achievements;

    if (selectedAchievementCategory) {
      result = result.filter(a => a.category === selectedAchievementCategory);
    }

    if (achievementSearch) {
      const query = achievementSearch.toLowerCase();
      result = result.filter(a =>
        a.id.toLowerCase().includes(query) ||
        a.internalId.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => b.ratingWeight - a.ratingWeight);
  });

  const guildFactions = $derived(
    [...new Set($dataStore.guilds.map(g => g.faction))]
  );

  const filteredGuilds = $derived.by(() => {
    let result = $dataStore.guilds;

    if (selectedGuildFaction) {
      result = result.filter(g => g.faction === selectedGuildFaction);
    }

    return result;
  });

  // Group guilds by faction
  const guildsByFaction = $derived.by(() => {
    const groups: Record<string, Guild[]> = {};
    for (const guild of filteredGuilds) {
      if (!groups[guild.faction]) {
        groups[guild.faction] = [];
      }
      groups[guild.faction].push(guild);
    }
    // Sort each group by place
    const placeOrder: Record<GuildPlace, number> = { Gold: 0, Silver: 1, Bronze: 2, Copper: 3 };
    for (const faction in groups) {
      groups[faction].sort((a, b) => placeOrder[a.place] - placeOrder[b.place]);
    }
    return groups;
  });

  // Sorted ranks
  const sortedRanks = $derived(
    [...$dataStore.ranks].sort((a, b) => a.rank - b.rank)
  );

  // Main tabs
  const mainTabs = $derived([
    { id: 'ranks', label: 'Ranks', count: $dataStore.ranks.length },
    { id: 'achievements', label: 'Achievements', count: $dataStore.achievements.length },
    { id: 'guilds', label: 'Guilds', count: $dataStore.guilds.length }
  ]);

  // Achievement category tabs
  const achievementTabs = $derived([
    { id: '', label: 'All', count: $dataStore.achievements.length },
    ...achievementCategories.map(cat => ({
      id: cat,
      label: cat,
      count: $dataStore.achievements.filter(a => a.category === cat).length
    }))
  ]);

  const hasNoRanks = $derived($dataStore.ranks.length === 0);
  const hasNoAchievements = $derived($dataStore.achievements.length === 0);
  const hasNoGuilds = $derived($dataStore.guilds.length === 0);

  function handleRetry() {
    dataStore.load();
  }

  function getCategoryIcon(category: AchievementCategory): string {
    switch (category) {
      case 'Battle': return '⚔️';
      case 'Arena': return '🏟️';
      case 'Top': return '🏆';
      case 'Collection': return '📚';
      case 'Trade': return '💰';
      default: return '🎖️';
    }
  }

  function getPlaceIcon(place: GuildPlace): string {
    switch (place) {
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      case 'Copper': return '🏅';
      default: return '🎖️';
    }
  }

  function getPlaceColor(place: GuildPlace): string {
    switch (place) {
      case 'Gold': return 'var(--gold-primary)';
      case 'Silver': return 'var(--canvas)';
      case 'Bronze': return 'var(--brass)';
      case 'Copper': return 'var(--wood-light)';
      default: return 'var(--text-muted)';
    }
  }

  function getFactionColor(faction: Fraction): string {
    switch (faction) {
      case 'Espaniol': return 'var(--error-light)';
      case 'Antilia': return 'var(--teal)';
      case 'KaiAndSeveria': return 'var(--gold-primary)';
      case 'TradeUnion': return 'var(--canvas)';
      case 'Pirate': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  }

  function formatXP(xp: number): string {
    if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
    return xp.toString();
  }

  function formatGold(gold: number): string {
    if (gold >= 1000000) return `${(gold / 1000000).toFixed(0)}M`;
    if (gold >= 1000) return `${(gold / 1000).toFixed(0)}K`;
    return gold.toString();
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Player Progression"
    subtitle="Ranks, achievements, and guild standings"
  />

  <div class="main-tabs">
    <Tabs
      tabs={mainTabs}
      activeTab={activeTab}
      onchange={(id) => activeTab = id as typeof activeTab}
    />
  </div>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading progression data..." />
  {:else if activeTab === 'ranks'}
    <!-- RANKS TAB -->
    {#if hasNoRanks}
      <EmptyState
        icon="📊"
        title="No rank data available"
        message="Rank progression data could not be loaded."
      />
    {:else}
      <div class="ranks-intro">
        <Card variant="elevated" padding="lg">
          <div class="intro-content">
            <span class="intro-icon">📈</span>
            <div class="intro-text">
              <h3>Player Rank Progression</h3>
              <p>
                Progress through {$dataStore.ranks.length} ranks by earning XP in battles.
                Higher ranks unlock better ships and equipment.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div class="ranks-table">
        <div class="table-nautical">
          <table>
            <thead>
              <tr>
                <th scope="col" class="col-numeric">Rank</th>
                <th scope="col" class="col-numeric">XP Required</th>
                <th scope="col" class="col-numeric">XP to Next</th>
                <th scope="col">Progress</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedRanks as rank, index (rank.rank)}
                {@const nextRank = sortedRanks[index + 1]}
                {@const xpToNext = nextRank ? nextRank.xpRequired - rank.xpRequired : 0}
                {@const maxXP = sortedRanks[sortedRanks.length - 1].xpRequired}
                {@const progress = (rank.xpRequired / maxXP) * 100}
                <tr>
                  <td class="col-numeric rank-number">
                    <span class="rank-badge">Rank {rank.rank}</span>
                  </td>
                  <td class="col-numeric">
                    <span class="xp-value">{formatXP(rank.xpRequired)}</span>
                    <span class="xp-exact">({rank.xpRequired.toLocaleString()})</span>
                  </td>
                  <td class="col-numeric">
                    {#if xpToNext > 0}
                      <span class="xp-next">+{formatXP(xpToNext)}</span>
                    {:else}
                      <span class="xp-max">MAX</span>
                    {/if}
                  </td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: {progress}%"></div>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

  {:else if activeTab === 'achievements'}
    <!-- ACHIEVEMENTS TAB -->
    {#if hasNoAchievements}
      <EmptyState
        icon="🏆"
        title="No achievements available"
        message="Achievement data could not be loaded."
      />
    {:else}
      <div class="achievement-tabs">
        <Tabs
          tabs={achievementTabs}
          activeTab={selectedAchievementCategory}
          onchange={(id) => selectedAchievementCategory = id}
        />
      </div>

      <Toolbar>
        <FilterGroup label="Search" for="achievement-search" grow minWidth="200px">
          <input
            id="achievement-search"
            type="text"
            placeholder="Search achievements..."
            bind:value={achievementSearch}
          />
        </FilterGroup>

        {#snippet actions()}
          <span class="filter-count">{filteredAchievements.length} achievements</span>
        {/snippet}
      </Toolbar>

      <Grid columns="auto" minWidth="280px" gap="md">
        {#each filteredAchievements as achievement (achievement.id)}
          <Card variant="wood" padding="md">
            <div class="achievement-card">
              <div class="achievement-card__header">
                <span class="achievement-card__icon">
                  {getCategoryIcon(achievement.category)}
                </span>
                <div class="achievement-card__info">
                  <h3 class="achievement-card__name">{achievement.id}</h3>
                  <Badge variant="category" value={achievement.category} />
                </div>
              </div>

              <div class="achievement-card__stats">
                <div class="stat">
                  <span class="stat__label">Rating Weight</span>
                  <span class="stat__value stat__value--rating">{achievement.ratingWeight}</span>
                </div>
                <div class="stat">
                  <span class="stat__label">Single Give</span>
                  <span class="stat__value">{achievement.singleGive ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {#if achievement.internalId}
                <div class="achievement-card__internal">
                  <span class="internal-label">Internal ID:</span>
                  <span class="internal-value">{achievement.internalId}</span>
                </div>
              {/if}
            </div>
          </Card>
        {/each}
      </Grid>
    {/if}

  {:else if activeTab === 'guilds'}
    <!-- GUILDS TAB -->
    {#if hasNoGuilds}
      <EmptyState
        icon="🏛️"
        title="No guild data available"
        message="Guild standings data could not be loaded."
      />
    {:else}
      <Toolbar>
        <FilterGroup label="Faction" for="faction-filter">
          <select id="faction-filter" bind:value={selectedGuildFaction}>
            <option value="">All Factions</option>
            {#each guildFactions as faction (faction)}
              <option value={faction}>{faction}</option>
            {/each}
          </select>
        </FilterGroup>

        {#snippet actions()}
          <span class="filter-count">{filteredGuilds.length} guild tiers</span>
        {/snippet}
      </Toolbar>

      {#each Object.entries(guildsByFaction) as [faction, guilds] (faction)}
        <section class="faction-section">
          <h2 class="section-title" style="color: {getFactionColor(faction as Fraction)}">
            {faction}
            <span class="section-count">({guilds.length} tiers)</span>
          </h2>
          <div class="guild-tiers">
            {#each guilds as guild (guild.id)}
              <Card variant="elevated" padding="md">
                <div class="guild-card">
                  <div class="guild-card__place">
                    <span class="place-icon">{getPlaceIcon(guild.place)}</span>
                    <span class="place-name" style="color: {getPlaceColor(guild.place)}">
                      {guild.place}
                    </span>
                  </div>
                  <div class="guild-card__reward">
                    <span class="reward-label">Reward</span>
                    <span class="reward-value">{formatGold(guild.reward)} Gold</span>
                  </div>
                </div>
              </Card>
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  {/if}
</Stack>

<style>
  .main-tabs,
  .achievement-tabs {
    display: flex;
    justify-content: center;
  }

  .filter-count {
    color: var(--text-muted);
    font-size: var(--text-sm);
  }

  /* Ranks styles */
  .ranks-intro {
    max-width: 800px;
    margin: 0 auto var(--space-lg);
  }

  .intro-content {
    display: flex;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .intro-icon {
    font-size: var(--text-4xl);
    flex-shrink: 0;
  }

  .intro-text h3 {
    font-family: var(--font-display);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .intro-text p {
    color: var(--text-muted);
    margin: 0;
    line-height: 1.6;
  }

  .rank-badge {
    font-family: var(--font-display);
    font-weight: var(--font-semibold);
    color: var(--gold-primary);
  }

  .xp-value {
    font-family: var(--font-mono);
    font-weight: var(--font-semibold);
    color: var(--teal);
  }

  .xp-exact {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-left: var(--space-xs);
  }

  .xp-next {
    font-family: var(--font-mono);
    color: var(--canvas);
  }

  .xp-max {
    font-family: var(--font-display);
    color: var(--gold-primary);
    font-weight: var(--font-semibold);
  }

  .progress-bar {
    height: 8px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--teal), var(--gold-primary));
    border-radius: var(--radius-sm);
    transition: width 0.3s ease;
  }

  /* Achievement styles */
  .achievement-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .achievement-card__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .achievement-card__icon {
    font-size: var(--text-2xl);
    flex-shrink: 0;
  }

  .achievement-card__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .achievement-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
  }

  .achievement-card__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat__label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .stat__value {
    font-weight: var(--font-semibold);
    color: var(--canvas);
    font-family: var(--font-mono);
  }

  .stat__value--rating {
    color: var(--gold-primary);
    font-size: var(--text-lg);
  }

  .achievement-card__internal {
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .internal-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-right: var(--space-xs);
  }

  .internal-value {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    color: var(--brass);
  }

  /* Guild styles */
  .faction-section {
    margin-bottom: var(--space-xl);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    margin: 0 0 var(--space-md);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .section-count {
    color: var(--text-muted);
    font-size: var(--text-base);
    font-weight: normal;
  }

  .guild-tiers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .guild-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }

  .guild-card__place {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
  }

  .place-icon {
    font-size: var(--text-3xl);
  }

  .place-name {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
  }

  .guild-card__reward {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--brass);
  }

  .reward-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .reward-value {
    font-family: var(--font-mono);
    font-weight: var(--font-semibold);
    color: var(--gold-primary);
  }

  @media (max-width: 768px) {
    .intro-content {
      flex-direction: column;
      text-align: center;
    }

    .guild-tiers {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
