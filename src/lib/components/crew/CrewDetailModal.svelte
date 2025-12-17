<script lang="ts">
  import type { CrewUnit } from '$lib/data/types';
  import { Modal, Badge } from '$lib/components/ui';
  import { StatBar } from '$lib/components/data';

  interface Props {
    crew: CrewUnit | null;
    open?: boolean;
    onclose?: () => void;
  }

  let {
    crew,
    open = false,
    onclose
  }: Props = $props();

  const maxValues = {
    damage: 50,
    health: 200,
    capacity: 5,
    cost: 500
  };
</script>

<Modal {open} title={crew?.name || 'Crew Details'} size="md" {onclose}>
  {#if crew}
    <div class="crew-detail">
      <div class="crew-detail__header">
        <div class="crew-badges">
          <Badge variant="category" value={crew.type} />
          {#if crew.pvpRelevant}
            <Badge variant="status" value="PvP" />
          {/if}
        </div>
        <p class="crew-id">{crew.id}</p>
      </div>

      <div class="crew-detail__content">
        <section class="stats-section">
          <h3 class="section-title">Combat Stats</h3>
          <div class="stats-grid">
            <StatBar
              label="Damage"
              value={crew.damage}
              max={maxValues.damage}
              variant="damage"
            />
            <StatBar
              label="Health"
              value={crew.health}
              max={maxValues.health}
              variant="hp"
            />
            <StatBar
              label="Capacity"
              value={crew.capacity}
              max={maxValues.capacity}
              variant="cargo"
            />
          </div>
        </section>

        <section class="stats-section">
          <h3 class="section-title">Details</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Type</span>
              <span class="detail-value">{crew.type}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Options</span>
              <span class="detail-value">{crew.options}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Cost (Gold)</span>
              <span class="detail-value">{crew.cost.toLocaleString()}</span>
            </div>
            {#if crew.costMarks > 0}
              <div class="detail-item">
                <span class="detail-label">Cost (Marks)</span>
                <span class="detail-value">{crew.costMarks.toLocaleString()}</span>
              </div>
            {/if}
          </div>
        </section>

        {#if crew.effect || crew.effectPerSailor || crew.effectPerBoarding}
          <section class="stats-section">
            <h3 class="section-title">Effects</h3>
            <div class="effects-list">
              {#if crew.effect}
                <div class="effect-item">
                  <span class="effect-label">Base Effect</span>
                  <span class="effect-value">{crew.effect}</span>
                </div>
              {/if}
              {#if crew.effectPerSailor}
                <div class="effect-item">
                  <span class="effect-label">Per Sailor</span>
                  <span class="effect-value">{crew.effectPerSailor}</span>
                </div>
              {/if}
              {#if crew.effectPerBoarding}
                <div class="effect-item">
                  <span class="effect-label">Per Boarding</span>
                  <span class="effect-value">{crew.effectPerBoarding}</span>
                </div>
              {/if}
            </div>
          </section>
        {/if}
      </div>
    </div>
  {/if}
</Modal>

<style>
  .crew-detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .crew-detail__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--wood-dark);
  }

  .crew-badges {
    display: flex;
    gap: var(--space-sm);
  }

  .crew-id {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  .crew-detail__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .stats-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    margin: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--space-md);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-md);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .detail-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .detail-value {
    font-size: var(--text-base);
    color: var(--canvas);
    font-weight: var(--font-medium);
  }

  .effects-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .effect-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-sm);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }

  .effect-label {
    font-size: var(--text-xs);
    color: var(--brass-light);
    text-transform: uppercase;
  }

  .effect-value {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--gold-primary);
  }
</style>
