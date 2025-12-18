<script lang="ts">
  import type { Ship } from '$lib/data/types';
  import { Badge } from '$lib/components/ui';
  import { StatBar } from '$lib/components/data';

  interface Props {
    ship: Ship;
    onclick?: (ship: Ship) => void;
  }

  let {
    ship,
    onclick
  }: Props = $props();

  const maxValues = {
    health: 12000,
    speed: 14,
    armor: 12
  };
</script>

<button
  class="ship-card"
  onclick={() => onclick?.(ship)}
  type="button"
>
  <div class="ship-card__header">
    <div class="ship-card__badges">
      <Badge variant="tier" value={ship.tier} size="sm" />
      <Badge variant="class" value={ship.type} size="sm" />
    </div>
  </div>

  <h3 class="ship-card__name">{ship.name}</h3>

  <div class="ship-card__stats">
    <StatBar
      value={ship.health}
      max={maxValues.health}
      variant="hp"
      size="sm"
      showValue={false}
    />
    <div class="stat-row">
      <span class="stat-label">HP</span>
      <span class="stat-value">{ship.health.toLocaleString()}</span>
    </div>

    <StatBar
      value={ship.speed}
      max={maxValues.speed}
      variant="speed"
      size="sm"
      showValue={false}
    />
    <div class="stat-row">
      <span class="stat-label">Speed</span>
      <span class="stat-value">{ship.speed.toFixed(1)}</span>
    </div>

    <StatBar
      value={ship.armor}
      max={maxValues.armor}
      variant="armor"
      size="sm"
      showValue={false}
    />
    <div class="stat-row">
      <span class="stat-label">Armor</span>
      <span class="stat-value">{ship.armor.toFixed(1)}</span>
    </div>
  </div>

  <div class="ship-card__footer">
    <span class="ship-card__capacity">
      <span class="capacity-icon" aria-hidden="true">📦</span>
      <span class="sr-only">Cargo capacity:</span>
      {ship.cargo.toLocaleString()}
    </span>
    <span class="ship-card__crew">
      <span class="crew-icon" aria-hidden="true">👥</span>
      <span class="sr-only">Crew slots:</span>
      {ship.crewSlots}
    </span>
  </div>
</button>

<style>
  .ship-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-md);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
  }

  .ship-card:hover {
    border-color: var(--brass);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .ship-card:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.3);
  }

  .ship-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ship-card__badges {
    display: flex;
    gap: var(--space-xs);
  }

  .ship-card__name {
    font-family: var(--font-display);
    font-size: var(--text-base);
    color: var(--gold-primary);
    margin: 0;
    line-height: var(--leading-tight);
  }

  .ship-card__stats {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-top: var(--space-xs);
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
  }

  .stat-label {
    color: var(--text-muted);
  }

  .stat-value {
    color: var(--canvas);
    font-family: var(--font-mono);
  }

  .ship-card__footer {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--wood-dark);
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .ship-card__capacity,
  .ship-card__crew {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .capacity-icon,
  .crew-icon {
    font-size: var(--text-sm);
  }
</style>
