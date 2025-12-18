<script lang="ts">
  interface Crumb {
    label: string;
    href?: string;  // No href = current page (not clickable)
  }

  interface Props {
    crumbs: Crumb[];
  }

  let { crumbs }: Props = $props();
</script>

<nav class="breadcrumb" aria-label="Breadcrumb navigation">
  <ol class="breadcrumb__list">
    {#each crumbs as crumb, index}
      <li class="breadcrumb__item">
        {#if crumb.href}
          <a href={crumb.href} class="breadcrumb__link">{crumb.label}</a>
        {:else}
          <span class="breadcrumb__current" aria-current="page">{crumb.label}</span>
        {/if}
        {#if index < crumbs.length - 1}
          <span class="breadcrumb__separator" aria-hidden="true">/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  .breadcrumb {
    margin-bottom: var(--space-md);
  }

  .breadcrumb__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs);
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: var(--text-sm);
  }

  .breadcrumb__item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .breadcrumb__link {
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .breadcrumb__link:hover {
    color: var(--gold-primary);
  }

  .breadcrumb__link:focus-visible {
    outline: none;
    color: var(--gold-primary);
    text-decoration: underline;
  }

  .breadcrumb__current {
    color: var(--brass-light);
    font-weight: var(--font-medium);
  }

  .breadcrumb__separator {
    color: var(--text-muted);
    opacity: 0.5;
  }
</style>
