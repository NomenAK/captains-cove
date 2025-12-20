<script lang="ts">
  import type { Ship } from '$lib/data/types';
  import { MAX_STAT_VALUES } from '$lib/data/constants';
  import { Modal, Badge } from '$lib/components/ui';
  import { StatBar } from '$lib/components/data';

  interface Props {
    ship: Ship | null;
    open?: boolean;
    onclose?: () => void;
  }

  let {
    ship,
    open = false,
    onclose
  }: Props = $props();
</script>

<Modal {open} title={ship?.name || 'Ship Details'} size="lg" {onclose}>
  {#if ship}
    <div class="ship-detail">
      <div class="ship-detail__header">
        <div class="ship-badges">
          <Badge variant="tier" value={ship.tier} />
          <Badge variant="class" value={ship.type} />
        </div>
        <p class="ship-id">{ship.id}</p>
      </div>

      <div class="ship-detail__content">
        <section class="stats-section">
          <h3 class="section-title">Combat Stats</h3>
          <div class="stats-grid">
            <StatBar
              label="Health"
              value={ship.health}
              max={MAX_STAT_VALUES.health}
              variant="hp"
              format={(v) => v.toLocaleString()}
            />
            <StatBar
              label="Armor"
              value={ship.armor}
              max={MAX_STAT_VALUES.armor}
              variant="armor"
              format={(v) => v.toFixed(1)}
            />
            <StatBar
              label="Speed"
              value={ship.speed}
              max={MAX_STAT_VALUES.speed}
              variant="speed"
              format={(v) => v.toFixed(1)}
            />
            <StatBar
              label="Mobility"
              value={ship.mobility}
              max={MAX_STAT_VALUES.speed}
              variant="speed"
              format={(v) => v.toFixed(1)}
            />
          </div>
        </section>

        <section class="stats-section">
          <h3 class="section-title">Capacity</h3>
          <div class="stats-grid">
            <StatBar
              label="Cargo"
              value={ship.cargo}
              max={MAX_STAT_VALUES.cargo}
              variant="cargo"
              format={(v) => v.toLocaleString()}
            />
            <StatBar
              label="Crew Slots"
              value={ship.crewSlots}
              max={MAX_STAT_VALUES.crew}
              variant="default"
            />
          </div>
        </section>

        <section class="stats-section">
          <h3 class="section-title">Details</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Ship Type</span>
              <span class="detail-value">{ship.type}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tier</span>
              <span class="detail-value">{ship.tier}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Base Price</span>
              <span class="detail-value">{ship.cost?.toLocaleString() || 'N/A'}</span>
            </div>
            {#if ship.rank !== undefined}
              <div class="detail-item">
                <span class="detail-label">Rank Required</span>
                <span class="detail-value">{ship.rank}</span>
              </div>
            {/if}
          </div>
        </section>

        {#if ship.icon}
          <section class="stats-section">
            <h3 class="section-title">Appearance</h3>
            <div class="ship-icon-preview">
              <img src="/textures/{ship.icon}" alt={ship.name} onerror={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'} />
            </div>
          </section>
        {/if}
      </div>
    </div>
  {/if}
</Modal>

<style>
  .ship-detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .ship-detail__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--wood-dark);
  }

  .ship-badges {
    display: flex;
    gap: var(--space-sm);
  }

  .ship-id {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  .ship-detail__content {
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

  .ship-icon-preview {
    display: flex;
    justify-content: center;
    padding: var(--space-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }

  .ship-icon-preview img {
    max-width: 200px;
    max-height: 150px;
    object-fit: contain;
  }
</style>
