<script lang="ts">
  import { dataStore } from '$lib/stores';
</script>

<div class="page">
  <header class="page-header">
    <h1 class="page-title">📦 Items</h1>
    <p class="page-subtitle">Trade goods and resources</p>
  </header>

  <div class="placeholder-content">
    <span class="placeholder-icon">📦</span>
    <h2>Coming Soon</h2>
    <p>Items view is under construction.</p>
    <p class="hint">This will include tradeable resources and crafting materials from the world.</p>
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .page-header {
    text-align: center;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-xs);
  }

  .page-subtitle {
    color: var(--text-muted);
    margin: 0;
  }

  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-3xl);
    background: var(--bg-card);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-xl);
    min-height: 400px;
  }

  .placeholder-icon {
    font-size: 64px;
    margin-bottom: var(--space-lg);
    opacity: 0.6;
  }

  .placeholder-content h2 {
    font-family: var(--font-display);
    color: var(--brass-light);
    margin: 0 0 var(--space-sm);
  }

  .placeholder-content p {
    color: var(--text-muted);
    margin: 0;
  }

  .hint {
    margin-top: var(--space-md);
    font-size: var(--text-sm);
    max-width: 400px;
  }
</style>
