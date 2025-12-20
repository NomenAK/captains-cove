<script lang="ts">
  import type { Weapon } from '$lib/data/types';
  import { MAX_WEAPON_VALUES } from '$lib/data/constants';
  import { Modal, Badge } from '$lib/components/ui';
  import { StatBar } from '$lib/components/data';

  interface Props {
    weapon: Weapon | null;
    open?: boolean;
    onclose?: () => void;
  }

  let {
    weapon,
    open = false,
    onclose
  }: Props = $props();
</script>

<Modal {open} title={weapon?.name || 'Weapon Details'} size="md" {onclose}>
  {#if weapon}
    <div class="weapon-detail">
      <div class="weapon-detail__header">
        <div class="weapon-badges">
          <Badge variant="category" value={weapon.category} />
          <Badge variant="size" value={weapon.sizeClass} />
          {#if weapon.tier}
            <Badge variant="tier" value={weapon.tier} />
          {/if}
        </div>
        <p class="weapon-id">{weapon.id}</p>
      </div>

      <div class="weapon-detail__content">
        <section class="stats-section">
          <h3 class="section-title">Combat Stats</h3>
          <div class="stats-grid">
            <StatBar
              label="Penetration"
              value={weapon.penetration}
              max={MAX_WEAPON_VALUES.penetration}
              variant="damage"
              format={(v) => v.toFixed(1)}
            />
            <StatBar
              label="Range"
              value={weapon.distance}
              max={MAX_WEAPON_VALUES.distance}
              variant="range"
              format={(v) => `${v}m`}
            />
            <StatBar
              label="Reload Time"
              value={weapon.cooldown}
              max={MAX_WEAPON_VALUES.cooldown}
              variant="default"
              format={(v) => `${v.toFixed(1)}s`}
            />
            <StatBar
              label="Firing Angle"
              value={weapon.angle}
              max={MAX_WEAPON_VALUES.angle}
              variant="default"
              format={(v) => `${v}°`}
            />
          </div>
        </section>

        <section class="stats-section">
          <h3 class="section-title">Details</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Category</span>
              <span class="detail-value">{weapon.category}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Size Class</span>
              <span class="detail-value">{weapon.sizeClass}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Scatter</span>
              <span class="detail-value">{weapon.scatter?.toFixed(2) || 'N/A'}</span>
            </div>
            {#if weapon.speedFactor}
              <div class="detail-item">
                <span class="detail-label">Speed Factor</span>
                <span class="detail-value">{weapon.speedFactor.toFixed(2)}</span>
              </div>
            {/if}
            <div class="detail-item">
              <span class="detail-label">Price</span>
              <span class="detail-value">{weapon.price?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </section>

        <section class="stats-section">
          <h3 class="section-title">Combat Analysis</h3>
          <div class="analysis-grid">
            <div class="analysis-item">
              <span class="analysis-label">DPS Potential</span>
              <span class="analysis-value">
                {weapon.cooldown > 0 ? (weapon.penetration / weapon.cooldown).toFixed(2) : 'N/A'}
              </span>
              <span class="analysis-unit">pen/sec</span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Effective vs Armor</span>
              <span class="analysis-value">
                {weapon.penetration >= 20 ? 'High' : weapon.penetration >= 15 ? 'Medium' : 'Low'}
              </span>
            </div>
            <div class="analysis-item">
              <span class="analysis-label">Best Range</span>
              <span class="analysis-value">
                {weapon.distance >= 600 ? 'Long' : weapon.distance >= 400 ? 'Medium' : 'Close'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .weapon-detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .weapon-detail__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--wood-dark);
  }

  .weapon-badges {
    display: flex;
    gap: var(--space-sm);
  }

  .weapon-id {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  .weapon-detail__content {
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

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
  }

  .analysis-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--space-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }

  .analysis-label {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: var(--space-xs);
  }

  .analysis-value {
    font-size: var(--text-xl);
    font-family: var(--font-display);
    color: var(--gold-primary);
    font-weight: var(--font-bold);
  }

  .analysis-unit {
    font-size: var(--text-xs);
    color: var(--brass-light);
  }

  @media (max-width: 768px) {
    .analysis-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
