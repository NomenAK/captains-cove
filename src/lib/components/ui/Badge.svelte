<script lang="ts">
  interface Props {
    variant?: 'tier' | 'class' | 'archetype' | 'category' | 'size' | 'status';
    value: string | number;
    size?: 'sm' | 'md';
  }

  let {
    variant = 'status',
    value,
    size = 'md'
  }: Props = $props();

  // Normalize value for class names
  const normalizedValue = String(value).toLowerCase().replace(/\s+/g, '-');
</script>

<span class="badge badge--{variant} badge--{variant}--{normalizedValue} badge--{size}">
  {#if variant === 'tier' && typeof value === 'number'}
    T{value}
  {:else}
    {value}
  {/if}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-semibold);
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
  }

  /* Sizes */
  .badge--sm {
    padding: 2px var(--space-xs);
    font-size: var(--text-2xs);
  }

  .badge--md {
    padding: var(--space-0-5) var(--space-sm);
    font-size: var(--text-xs);
  }

  /* Tier badges */
  .badge--tier {
    font-family: var(--font-display);
  }

  .badge--tier--1 { background: rgba(255, 215, 0, 0.2); color: var(--tier-1); border: 1px solid var(--gold-dark); }
  .badge--tier--2 { background: rgba(192, 192, 192, 0.2); color: var(--tier-2); }
  .badge--tier--3 { background: rgba(205, 127, 50, 0.2); color: var(--tier-3); }
  .badge--tier--4 { background: rgba(74, 222, 128, 0.2); color: var(--tier-4); }
  .badge--tier--5 { background: rgba(96, 165, 250, 0.2); color: var(--tier-5); }
  .badge--tier--6 { background: rgba(167, 139, 250, 0.2); color: var(--tier-6); }
  .badge--tier--7 { background: rgba(244, 114, 182, 0.2); color: var(--tier-7); }

  /* Class/Type badges */
  .badge--class--combat { background: rgba(59, 130, 246, 0.2); color: var(--class-combat); }
  .badge--class--fast { background: rgba(34, 197, 94, 0.2); color: var(--class-fast); }
  .badge--class--heavy { background: rgba(168, 85, 247, 0.2); color: var(--class-heavy); }
  .badge--class--transport { background: rgba(234, 179, 8, 0.2); color: var(--class-transport); }
  .badge--class--siege { background: rgba(239, 68, 68, 0.2); color: var(--class-siege); }
  .badge--class--imperial { background: rgba(212, 168, 83, 0.2); color: var(--gold-primary); }

  /* Archetype badges */
  .badge--archetype--brawler { background: rgba(220, 53, 69, 0.2); color: var(--archetype-brawler); }
  .badge--archetype--kite { background: rgba(40, 167, 69, 0.2); color: var(--archetype-kite); }
  .badge--archetype--sniper { background: rgba(0, 123, 255, 0.2); color: var(--archetype-sniper); }
  .badge--archetype--pursuit { background: rgba(255, 193, 7, 0.2); color: var(--archetype-pursuit); }
  .badge--archetype--trade { background: rgba(108, 117, 125, 0.2); color: var(--archetype-trade); }
  .badge--archetype--siege { background: rgba(111, 66, 193, 0.2); color: var(--archetype-siege); }

  /* Category badges (weapons) */
  .badge--category--cannon { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
  .badge--category--culverin { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
  .badge--category--carronade { background: rgba(234, 179, 8, 0.2); color: #facc15; }
  .badge--category--bombard { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
  .badge--category--mortar { background: rgba(239, 68, 68, 0.2); color: #f87171; }

  /* Size class badges */
  .badge--size--light { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
  .badge--size--medium { background: rgba(212, 168, 83, 0.2); color: var(--gold-primary); }
  .badge--size--heavy { background: rgba(239, 68, 68, 0.2); color: #f87171; }

  /* Status badges */
  .badge--status--active { background: rgba(34, 197, 94, 0.2); color: var(--success); }
  .badge--status--inactive { background: rgba(107, 114, 128, 0.2); color: var(--text-muted); }
  .badge--status--warning { background: rgba(234, 179, 8, 0.2); color: var(--warning); }
  .badge--status--error { background: rgba(239, 68, 68, 0.2); color: var(--error); }

  /* Crew type badges */
  .badge--class--sailor { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
  .badge--class--boarding { background: rgba(239, 68, 68, 0.2); color: #f87171; }
  .badge--class--special { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
</style>
