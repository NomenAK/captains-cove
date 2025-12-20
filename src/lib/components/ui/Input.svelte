<script lang="ts">
  interface Props {
    type?: 'text' | 'number' | 'email' | 'password' | 'search';
    value?: string | number;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    id?: string;
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }

  let {
    type = 'text',
    value = $bindable(''),
    placeholder,
    label,
    error,
    disabled = false,
    required = false,
    id,
    name,
    min,
    max,
    step,
    oninput,
    onchange
  }: Props = $props();

  const inputId = id || `input-${Math.random().toString(36).slice(2)}`;
</script>

<div class="input-wrapper" class:input-wrapper--error={error}>
  {#if label}
    <label class="input-label" for={inputId}>
      {label}
      {#if required}
        <span class="input-required">*</span>
      {/if}
    </label>
  {/if}

  <div class="input-container">
    {#if type === 'search'}
      <span class="input-icon">🔍</span>
    {/if}

    <input
      id={inputId}
      {type}
      {name}
      {placeholder}
      {disabled}
      {required}
      {min}
      {max}
      {step}
      bind:value
      class="input"
      class:input--has-icon={type === 'search'}
      aria-required={required ? 'true' : undefined}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${inputId}-error` : undefined}
      oninput={oninput}
      onchange={onchange}
    />
  </div>

  {#if error}
    <span id="{inputId}-error" class="input-error" role="alert">{error}</span>
  {/if}
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .input-label {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .input-required {
    color: var(--error);
    margin-left: 2px;
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: var(--space-sm);
    font-size: var(--text-sm);
    opacity: 0.6;
    pointer-events: none;
  }

  .input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--canvas);
    background: var(--bg-tertiary);
    border: 2px solid var(--wood-grain);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .input--has-icon {
    padding-left: calc(var(--space-md) + 20px);
  }

  .input::placeholder {
    color: var(--text-muted);
  }

  .input:hover:not(:disabled) {
    border-color: var(--brass);
  }

  .input:focus {
    outline: none;
    border-color: var(--gold-primary);
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.2);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input-wrapper--error .input {
    border-color: var(--error);
  }

  .input-wrapper--error .input:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  .input-error {
    font-size: var(--text-xs);
    color: var(--error-light);
  }

  /* Number input adjustments */
  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }
</style>
