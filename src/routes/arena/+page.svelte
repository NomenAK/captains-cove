<script lang="ts">
  import type { ArenaBonus } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, LoadingState, EmptyState, ErrorState, Stack, Grid, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';

  const hasNoData = $derived($dataStore.arenaBonuses.length === 0);

  function handleRetry() {
    dataStore.load();
  }

  // Sort by probability (higher = more common)
  const sortedBonuses = $derived(
    [...$dataStore.arenaBonuses].sort((a, b) => b.probability - a.probability)
  );

  // Calculate total probability for percentage display
  const totalProbability = $derived(
    $dataStore.arenaBonuses.reduce((sum, b) => sum + b.probability, 0)
  );

  function parseEffects(effects: string): { stat: string; value: string }[] {
    const parts = effects.split(' ');
    const result: { stat: string; value: string }[] = [];

    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        result.push({
          stat: parts[i],
          value: parts[i + 1]
        });
      }
    }

    return result;
  }

  function getEffectDescription(stat: string): string {
    // Map internal stat names to readable descriptions
    const descriptions: Record<string, string> = {
      'ServMendingStrength': 'Repair Strength',
      'PHealth': 'Hull Health',
      'PCannonsReload': 'Cannon Reload Speed',
      'MSpeed': 'Ship Speed',
      'PCannonsDamage': 'Cannon Damage',
      'MArmor': 'Armor Rating',
      'PCargoCapacity': 'Cargo Capacity',
      'MCaptureResistance': 'Boarding Resistance',
      'PCrewReload': 'Crew Reload Speed',
      'MCrewDamage': 'Crew Damage'
    };

    return descriptions[stat] || stat;
  }

  function getEffectColor(stat: string): string {
    if (stat.includes('Health') || stat.includes('Mending')) return 'var(--teal)';
    if (stat.includes('Damage')) return 'var(--error-light)';
    if (stat.includes('Speed') || stat.includes('Reload')) return 'var(--gold-primary)';
    if (stat.includes('Armor') || stat.includes('Resistance')) return 'var(--brass)';
    return 'var(--canvas)';
  }

  function formatProbability(prob: number): string {
    const percentage = (prob / totalProbability) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  function getRarityFromProbability(prob: number): 'common' | 'uncommon' | 'rare' {
    const percentage = (prob / totalProbability) * 100;
    if (percentage >= 12) return 'common';
    if (percentage >= 8) return 'uncommon';
    return 'rare';
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Arena Battle Bonuses"
    subtitle="{$dataStore.arenaBonuses.length} random modifiers"
  />

  <div class="intro-section">
    <Card variant="elevated" padding="lg">
      <div class="intro-content">
        <span class="intro-icon">🏟️</span>
        <div class="intro-text">
          <h3>About Arena Bonuses</h3>
          <p>
            Arena battles feature random bonuses that modify ship stats.
            Each bonus has a probability of appearing and can stack up to its max quantity.
            Use these bonuses strategically to gain an edge in battle.
          </p>
        </div>
      </div>
    </Card>
  </div>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading arena data..." />
  {:else if hasNoData}
    <EmptyState
      icon="🏟️"
      title="No arena data available"
      message="Arena bonus data could not be loaded. Please try again."
    />
  {:else}
    <!-- Overview Stats -->
    <div class="stats-overview">
      <Card variant="wood" padding="md">
        <div class="overview-grid">
          <div class="overview-stat">
            <span class="overview-value">{$dataStore.arenaBonuses.length}</span>
            <span class="overview-label">Total Bonuses</span>
          </div>
          <div class="overview-stat">
            <span class="overview-value">{Math.max(...$dataStore.arenaBonuses.map(b => b.maxQuantity))}</span>
            <span class="overview-label">Max Stack</span>
          </div>
          <div class="overview-stat">
            <span class="overview-value">{totalProbability.toFixed(1)}</span>
            <span class="overview-label">Total Weight</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Bonus Cards -->
    <Grid columns="auto" minWidth="320px" gap="lg">
      {#each sortedBonuses as bonus (bonus.id)}
        {@const rarity = getRarityFromProbability(bonus.probability)}
        {@const effects = parseEffects(bonus.effects)}
        <Card variant="wood" padding="lg">
          <div class="bonus-card" class:bonus-card--rare={rarity === 'rare'}>
            <div class="bonus-card__header">
              <div class="bonus-card__rarity rarity--{rarity}">
                {#if rarity === 'common'}
                  <span class="rarity-icon">⭐</span>
                {:else if rarity === 'uncommon'}
                  <span class="rarity-icon">⭐⭐</span>
                {:else}
                  <span class="rarity-icon">⭐⭐⭐</span>
                {/if}
                <span class="rarity-label">{rarity}</span>
              </div>
              <div class="bonus-card__prob">
                <span class="prob-value">{formatProbability(bonus.probability)}</span>
                <span class="prob-label">chance</span>
              </div>
            </div>

            <div class="bonus-card__effects">
              {#each effects as effect}
                <div class="effect-item">
                  <span class="effect-stat" style="color: {getEffectColor(effect.stat)}">
                    {getEffectDescription(effect.stat)}
                  </span>
                  <span class="effect-value" style="color: {getEffectColor(effect.stat)}">
                    {effect.value}
                  </span>
                </div>
              {/each}
            </div>

            <div class="bonus-card__meta">
              <div class="meta-item">
                <span class="meta-label">Max Stack</span>
                <span class="meta-value">×{bonus.maxQuantity}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Raw Weight</span>
                <span class="meta-value">{bonus.probability}</span>
              </div>
            </div>

            <div class="bonus-card__raw">
              <span class="raw-label">Effect String:</span>
              <code class="raw-value">{bonus.effects}</code>
            </div>
          </div>
        </Card>
      {/each}
    </Grid>

    <!-- Probability Table -->
    <section class="probability-section">
      <h2 class="section-title">Probability Distribution</h2>
      <div class="table-nautical">
        <table>
          <thead>
            <tr>
              <th scope="col">Effect</th>
              <th scope="col" class="col-numeric">Max Qty</th>
              <th scope="col" class="col-numeric">Weight</th>
              <th scope="col" class="col-numeric">Chance</th>
              <th scope="col">Distribution</th>
            </tr>
          </thead>
          <tbody>
            {#each sortedBonuses as bonus (bonus.id)}
              {@const percentage = (bonus.probability / totalProbability) * 100}
              {@const effects = parseEffects(bonus.effects)}
              <tr>
                <td>
                  <div class="effect-cell">
                    {#each effects as effect}
                      <span class="effect-badge" style="color: {getEffectColor(effect.stat)}">
                        {effect.stat} {effect.value}
                      </span>
                    {/each}
                  </div>
                </td>
                <td class="col-numeric">×{bonus.maxQuantity}</td>
                <td class="col-numeric">{bonus.probability}</td>
                <td class="col-numeric">{formatProbability(bonus.probability)}</td>
                <td>
                  <div class="dist-bar">
                    <div class="dist-fill" style="width: {percentage}%"></div>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</Stack>

<style>
  .intro-section {
    max-width: 800px;
    margin: 0 auto;
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

  /* Overview Stats */
  .stats-overview {
    max-width: 600px;
    margin: 0 auto;
  }

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
    text-align: center;
  }

  .overview-stat {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .overview-value {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
    font-weight: var(--font-bold);
  }

  .overview-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  /* Bonus Cards */
  .bonus-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .bonus-card--rare {
    position: relative;
  }

  .bonus-card--rare::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, var(--gold-primary), var(--brass), var(--gold-primary));
    border-radius: var(--radius-md);
    z-index: -1;
    opacity: 0.3;
  }

  .bonus-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bonus-card__rarity {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .rarity-icon {
    font-size: var(--text-sm);
  }

  .rarity-label {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    text-transform: uppercase;
  }

  .rarity--common .rarity-label { color: var(--text-muted); }
  .rarity--uncommon .rarity-label { color: var(--teal); }
  .rarity--rare .rarity-label { color: var(--gold-primary); }

  .bonus-card__prob {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .prob-value {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--canvas);
  }

  .prob-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .bonus-card__effects {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--bg-elevated);
    border-radius: var(--radius-md);
  }

  .effect-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .effect-stat {
    font-weight: var(--font-medium);
  }

  .effect-value {
    font-family: var(--font-mono);
    font-weight: var(--font-bold);
    font-size: var(--text-lg);
  }

  .bonus-card__meta {
    display: flex;
    justify-content: space-around;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .meta-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .meta-value {
    font-family: var(--font-mono);
    font-weight: var(--font-semibold);
    color: var(--canvas);
  }

  .bonus-card__raw {
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .raw-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    display: block;
    margin-bottom: 4px;
  }

  .raw-value {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    color: var(--brass);
    word-break: break-all;
  }

  /* Probability Section */
  .probability-section {
    margin-top: var(--space-xl);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
  }

  .effect-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .effect-badge {
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
  }

  .dist-bar {
    height: 16px;
    background: var(--bg-elevated);
    border-radius: var(--radius-sm);
    overflow: hidden;
    min-width: 100px;
  }

  .dist-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--teal), var(--gold-primary));
    border-radius: var(--radius-sm);
    transition: width 0.3s ease;
  }

  @media (max-width: 768px) {
    .intro-content {
      flex-direction: column;
      text-align: center;
    }

    .overview-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
