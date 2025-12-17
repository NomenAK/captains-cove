<script lang="ts">
  import type { CaptainSkill } from '$lib/data/types';
  import { Modal, Badge } from '$lib/components/ui';

  interface Props {
    skill: CaptainSkill | null;
    open?: boolean;
    onclose?: () => void;
  }

  let {
    skill,
    open = false,
    onclose
  }: Props = $props();

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      economy: 'var(--class-transport)',
      logistics: 'var(--class-fast)',
      combat: 'var(--archetype-brawler)',
      legend: 'var(--gold-primary)'
    };
    return colors[category] || 'var(--brass)';
  }
</script>

<Modal {open} title={skill?.name || 'Skill Details'} size="md" {onclose}>
  {#if skill}
    <div class="skill-detail">
      <div class="skill-detail__header">
        <div class="skill-badges">
          <Badge variant="category" value={skill.category} />
          {#if skill.pvpRelevant}
            <Badge variant="status" value="PvP" />
          {/if}
        </div>
        <div class="skill-cost">
          <span class="cost-value">{skill.costPoints}</span>
          <span class="cost-label">pts</span>
        </div>
      </div>

      <div class="skill-detail__content">
        <section class="effect-section">
          <h3 class="section-title">Effect</h3>
          <p class="effect-text">{skill.effect}</p>
        </section>

        <section class="details-section">
          <h3 class="section-title">Requirements</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Cost</span>
              <span class="detail-value">{skill.cost || 'None'}</span>
            </div>
            {#if skill.requiredRank}
              <div class="detail-item">
                <span class="detail-label">Required Rank</span>
                <span class="detail-value">{skill.requiredRank}</span>
              </div>
            {/if}
            {#if skill.dependsOn}
              <div class="detail-item">
                <span class="detail-label">Depends On</span>
                <span class="detail-value">{skill.dependsOn}</span>
              </div>
            {/if}
            {#if skill.requiredAchievements}
              <div class="detail-item">
                <span class="detail-label">Achievements</span>
                <span class="detail-value">{skill.requiredAchievements}</span>
              </div>
            {/if}
            {#if skill.requiredShips}
              <div class="detail-item">
                <span class="detail-label">Ships</span>
                <span class="detail-value">{skill.requiredShips}</span>
              </div>
            {/if}
          </div>
        </section>

        <section class="meta-section">
          <div class="detail-item">
            <span class="detail-label">ID</span>
            <span class="detail-value mono">{skill.id}</span>
          </div>
        </section>
      </div>
    </div>
  {/if}
</Modal>

<style>
  .skill-detail {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .skill-detail__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--wood-dark);
  }

  .skill-badges {
    display: flex;
    gap: var(--space-sm);
  }

  .skill-cost {
    display: flex;
    align-items: baseline;
    gap: var(--space-xs);
  }

  .cost-value {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--gold-primary);
    font-weight: var(--font-bold);
  }

  .cost-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .skill-detail__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .effect-section,
  .details-section,
  .meta-section {
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

  .effect-text {
    font-family: var(--font-mono);
    font-size: var(--text-base);
    color: var(--gold-primary);
    padding: var(--space-md);
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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

  .detail-value.mono {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
</style>
