<script lang="ts">
  interface Props {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    onchange?: (e: Event) => void;
  }

  let {
    checked = $bindable(false),
    label,
    disabled = false,
    id,
    name,
    onchange
  }: Props = $props();

  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;
</script>

<label class="checkbox" class:checkbox--disabled={disabled}>
  <input
    type="checkbox"
    id={checkboxId}
    {name}
    {disabled}
    bind:checked
    class="checkbox__input"
    onchange={onchange}
  />
  <span class="checkbox__box">
    {#if checked}
      <span class="checkbox__check">✓</span>
    {/if}
  </span>
  {#if label}
    <span class="checkbox__label">{label}</span>
  {/if}
</label>

<style>
  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    user-select: none;
  }

  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox__box {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .checkbox:hover:not(.checkbox--disabled) .checkbox__box {
    border-color: var(--brass);
  }

  .checkbox__input:focus + .checkbox__box {
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.2);
  }

  .checkbox__input:checked + .checkbox__box {
    background: var(--gold-primary);
    border-color: var(--gold-dark);
  }

  .checkbox__check {
    color: var(--wood-dark);
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    line-height: 1;
  }

  .checkbox__label {
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  .checkbox--disabled .checkbox__label {
    color: var(--text-muted);
  }
</style>
