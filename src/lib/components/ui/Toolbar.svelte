<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;        // Filter content
    actions?: Snippet;        // Right-side actions (count, buttons)
    variant?: 'default' | 'compact';
  }

  let {
    children,
    actions,
    variant = 'default'
  }: Props = $props();
</script>

<div class="toolbar toolbar--{variant}">
  <div class="toolbar__filters">
    {@render children()}
  </div>
  {#if actions}
    <div class="toolbar__actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    padding: var(--space-md);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
  }

  .toolbar--compact {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  .toolbar__filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    align-items: flex-end;
    flex: 1;
  }

  .toolbar--compact .toolbar__filters {
    gap: var(--space-sm);
  }

  .toolbar__actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-left: auto;
  }

  @media (max-width: 768px) {
    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar__filters {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar__actions {
      margin-left: 0;
      justify-content: center;
    }
  }
</style>
