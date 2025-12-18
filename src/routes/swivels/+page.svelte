<script lang="ts">
  import type { SwivelAmmo } from '$lib/data/types';
  import { dataStore, isLoading, dataError } from '$lib/stores';
  import { Badge, LoadingState, EmptyState, ErrorState, Stack, Card } from '$lib/components/ui';
  import { PageHeader } from '$lib/components/layout';

  const hasNoData = $derived($dataStore.swivelAmmo.length === 0);

  function handleRetry() {
    dataStore.load();
  }

  // Sort by index
  const sortedSwivels = $derived(
    [...$dataStore.swivelAmmo].sort((a, b) => a.index - b.index)
  );

  function getDamageColor(damage: number): string {
    if (damage >= 2) return 'var(--error-light)';
    if (damage >= 1) return 'var(--gold-primary)';
    return 'var(--text-muted)';
  }
</script>

<Stack direction="vertical" gap="lg">
  <PageHeader
    title="Swivel Guns (Falconets)"
    subtitle="{$dataStore.swivelAmmo.length} ammunition types"
  />

  <div class="intro-card">
    <Card variant="elevated" padding="lg">
      <div class="intro-content">
        <span class="intro-icon">🎯</span>
        <div class="intro-text">
          <h3>About Swivel Guns</h3>
          <p>
            Swivel guns (falconets) are small auxiliary weapons mounted on ships.
            They have auto-targeting capabilities and a base reload time of 23 seconds.
            Different ammunition provides unique tactical advantages.
          </p>
        </div>
      </div>
    </Card>
  </div>

  {#if $dataError}
    <ErrorState message={$dataError} onretry={handleRetry} />
  {:else if $isLoading}
    <LoadingState message="Loading swivel data..." />
  {:else if hasNoData}
    <EmptyState
      icon="🎯"
      title="No swivel data available"
      message="Swivel ammunition data could not be loaded. Please try again."
    />
  {:else}
    <div class="table-nautical">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col" class="col-numeric">Damage</th>
            <th scope="col" class="col-numeric">Penetration</th>
            <th scope="col" class="col-numeric">Sail Dmg</th>
            <th scope="col" class="col-numeric">Crew Dmg</th>
            <th scope="col" class="col-numeric hide-mobile">Speed</th>
            <th scope="col" class="col-numeric hide-mobile">Reload</th>
            <th scope="col" class="col-numeric hide-mobile">Range</th>
            <th scope="col" class="hide-mobile">Special</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedSwivels as ammo (ammo.id)}
            <tr class:rare={ammo.isRare}>
              <td class="col-name">
                <div class="name-cell">
                  <span class="ammo-name">{ammo.name}</span>
                  {#if ammo.isRare}
                    <Badge variant="status" value="Rare" />
                  {/if}
                </div>
              </td>
              <td class="col-numeric" style="color: {getDamageColor(ammo.damageFactor)}">
                {ammo.damageFactor.toFixed(1)}x
              </td>
              <td class="col-numeric">{ammo.penetration}</td>
              <td class="col-numeric">{ammo.sailDamage.toFixed(1)}</td>
              <td class="col-numeric">{ammo.crewDamage.toFixed(1)}</td>
              <td class="col-numeric hide-mobile">{ammo.speed.toFixed(1)}</td>
              <td class="col-numeric hide-mobile">{ammo.reloadFactor.toFixed(2)}x</td>
              <td class="col-numeric hide-mobile">{ammo.distanceFactor.toFixed(2)}x</td>
              <td class="hide-mobile">
                {#if ammo.effects}
                  <span class="effects-text">{ammo.effects}</span>
                {:else}
                  <span class="no-effect">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Additional details cards -->
    <section class="details-section">
      <h2 class="section-title">Ammunition Details</h2>
      <div class="details-grid">
        {#each sortedSwivels as ammo (ammo.id)}
          <Card variant="wood" padding="md">
            <div class="detail-card">
              <div class="detail-header">
                <h3 class="detail-name">{ammo.name}</h3>
                {#if ammo.isRare}
                  <Badge variant="status" value="Rare" />
                {/if}
              </div>

              {#if ammo.description}
                <p class="detail-description">{ammo.description}</p>
              {/if}

              <div class="detail-stats">
                <div class="stat-row">
                  <span class="stat-label">Damage Factor</span>
                  <span class="stat-value" style="color: {getDamageColor(ammo.damageFactor)}">
                    {ammo.damageFactor.toFixed(2)}x
                  </span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Penetration</span>
                  <span class="stat-value">{ammo.penetration}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Sail Damage</span>
                  <span class="stat-value">{ammo.sailDamage.toFixed(1)}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Crew Damage</span>
                  <span class="stat-value">{ammo.crewDamage.toFixed(1)}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Projectile Speed</span>
                  <span class="stat-value">{ammo.speed.toFixed(1)}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Reload Factor</span>
                  <span class="stat-value">{ammo.reloadFactor.toFixed(2)}x</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Range Factor</span>
                  <span class="stat-value">{ammo.distanceFactor.toFixed(2)}x</span>
                </div>
                {#if ammo.cost > 0}
                  <div class="stat-row">
                    <span class="stat-label">Cost</span>
                    <span class="stat-value stat-value--gold">{ammo.cost}</span>
                  </div>
                {/if}
              </div>

              {#if ammo.effects}
                <div class="detail-effects">
                  <span class="effects-label">Special Effects</span>
                  <span class="effects-value">{ammo.effects}</span>
                </div>
              {/if}

              {#if ammo.notes}
                <div class="detail-notes">
                  <span class="notes-label">Notes</span>
                  <span class="notes-value">{ammo.notes}</span>
                </div>
              {/if}
            </div>
          </Card>
        {/each}
      </div>
    </section>
  {/if}
</Stack>

<style>
  .intro-card {
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

  .name-cell {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .ammo-name {
    font-weight: var(--font-medium);
  }

  tr.rare {
    background: linear-gradient(90deg, transparent, rgba(var(--gold-primary-rgb), 0.1), transparent);
  }

  .effects-text {
    font-size: var(--text-xs);
    color: var(--teal);
    font-family: var(--font-mono);
  }

  .no-effect {
    color: var(--text-muted);
  }

  .details-section {
    margin-top: var(--space-xl);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-md);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-md);
  }

  .detail-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-name {
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--gold-primary);
    margin: 0;
  }

  .detail-description {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .detail-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: var(--space-xs);
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
  }

  .stat-label {
    color: var(--text-muted);
  }

  .stat-value {
    font-family: var(--font-mono);
    color: var(--canvas);
  }

  .stat-value--gold {
    color: var(--gold-primary);
  }

  .detail-effects,
  .detail-notes {
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-medium);
  }

  .effects-label,
  .notes-label {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .effects-value {
    font-size: var(--text-sm);
    color: var(--teal);
    font-family: var(--font-mono);
  }

  .notes-value {
    font-size: var(--text-sm);
    color: var(--text-muted);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .intro-content {
      flex-direction: column;
      text-align: center;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
