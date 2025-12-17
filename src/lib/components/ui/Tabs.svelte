<script lang="ts">
  interface Tab {
    id: string;
    label: string;
    icon?: string;
    count?: number;
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    onchange?: (tabId: string) => void;
  }

  let {
    tabs,
    activeTab = tabs[0]?.id,
    onchange
  }: Props = $props();

  function handleTabClick(tabId: string) {
    onchange?.(tabId);
  }

  function handleKeydown(e: KeyboardEvent, index: number) {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      onchange?.(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onchange?.(tabs[prevIndex].id);
    }
  }
</script>

<div class="tabs" role="tablist">
  {#each tabs as tab, index (tab.id)}
    <button
      class="tabs__tab"
      class:tabs__tab--active={activeTab === tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      tabindex={activeTab === tab.id ? 0 : -1}
      onclick={() => handleTabClick(tab.id)}
      onkeydown={(e) => handleKeydown(e, index)}
    >
      {#if tab.icon}
        <span class="tabs__icon">{tab.icon}</span>
      {/if}
      <span class="tabs__label">{tab.label}</span>
      {#if tab.count !== undefined}
        <span class="tabs__count">{tab.count}</span>
      {/if}
    </button>
  {/each}
  <div class="tabs__indicator"></div>
</div>

<style>
  .tabs {
    display: flex;
    gap: var(--space-xs);
    background: var(--bg-tertiary);
    padding: var(--space-xs);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    position: relative;
  }

  .tabs__tab {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-muted);
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
  }

  .tabs__tab:hover:not(.tabs__tab--active) {
    color: var(--canvas);
    background: var(--bg-secondary);
  }

  .tabs__tab--active {
    color: var(--gold-primary);
    background: var(--bg-card);
    border-color: var(--wood-grain);
    box-shadow: var(--shadow-sm);
  }

  .tabs__icon {
    font-size: var(--text-base);
  }

  .tabs__count {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 2px var(--space-xs);
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    color: var(--brass-light);
  }

  .tabs__tab--active .tabs__count {
    background: var(--gold-primary);
    color: var(--wood-dark);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .tabs {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .tabs__tab {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--text-xs);
    }

    .tabs__label {
      display: none;
    }

    .tabs__tab--active .tabs__label {
      display: inline;
    }
  }
</style>
