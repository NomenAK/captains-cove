<script lang="ts">
  interface Option {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    options: Option[];
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    onchange?: (e: Event) => void;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Select an option',
    label,
    error,
    disabled = false,
    required = false,
    id,
    name,
    onchange
  }: Props = $props();

  const selectId = id || `select-${Math.random().toString(36).slice(2)}`;
</script>

<div class="select-wrapper" class:select-wrapper--error={error}>
  {#if label}
    <label class="select-label" for={selectId}>
      {label}
      {#if required}
        <span class="select-required">*</span>
      {/if}
    </label>
  {/if}

  <div class="select-container">
    <select
      id={selectId}
      {name}
      {disabled}
      {required}
      bind:value
      class="select"
      aria-required={required ? 'true' : undefined}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${selectId}-error` : undefined}
      onchange={onchange}
    >
      {#if placeholder}
        <option value="" disabled>{placeholder}</option>
      {/if}
      {#each options as option (option.value)}
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      {/each}
    </select>
    <span class="select-arrow">▼</span>
  </div>

  {#if error}
    <span id="{selectId}-error" class="select-error" role="alert">{error}</span>
  {/if}
</div>

<style>
  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .select-label {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .select-required {
    color: var(--error);
    margin-left: 2px;
  }

  .select-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .select {
    width: 100%;
    padding: var(--space-sm) var(--space-lg) var(--space-sm) var(--space-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--canvas);
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-md);
    cursor: pointer;
    appearance: none;
    transition: all var(--transition-fast);
  }

  .select:hover:not(:disabled) {
    border-color: var(--brass);
  }

  .select:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.2);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select-arrow {
    position: absolute;
    right: var(--space-md);
    font-size: var(--text-xs);
    color: var(--brass-light);
    pointer-events: none;
    transition: transform var(--transition-fast);
  }

  .select:focus + .select-arrow {
    color: var(--gold-primary);
  }

  .select-wrapper--error .select {
    border-color: var(--error);
  }

  .select-wrapper--error .select:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  .select-error {
    font-size: var(--text-xs);
    color: var(--error-light);
  }

  /* Option styling (limited browser support) */
  .select option {
    background: var(--bg-secondary);
    color: var(--canvas);
    padding: var(--space-sm);
  }

  .select option:disabled {
    color: var(--text-muted);
  }
</style>
