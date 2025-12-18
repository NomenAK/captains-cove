<script lang="ts">
  interface Props {
    icon?: string;
    color?: 'red' | 'gold' | 'navy';
    size?: 'sm' | 'md' | 'lg';
    rotation?: number;
    animated?: boolean;
  }

  let {
    icon = '⚓',
    color = 'red',
    size = 'md',
    rotation = -15,
    animated = false
  }: Props = $props();
</script>

<div
  class="wax-seal wax-seal--{color} wax-seal--{size}"
  class:wax-seal--animated={animated}
  style:--rotation="{rotation}deg"
  aria-hidden="true"
>
  <span class="wax-seal__icon">{icon}</span>
  <span class="wax-seal__drip"></span>
</div>

<style>
  .wax-seal {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transform: rotate(var(--rotation, -15deg));
    z-index: 20;
    /* 3D wax appearance */
    box-shadow:
      inset 0 -4px 8px rgba(0, 0, 0, 0.4),
      inset 0 4px 8px rgba(255, 255, 255, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.5);
  }

  /* Size variants */
  .wax-seal--sm {
    width: 40px;
    height: 40px;
  }

  .wax-seal--md {
    width: 60px;
    height: 60px;
  }

  .wax-seal--lg {
    width: 80px;
    height: 80px;
  }

  /* Color variants */
  .wax-seal--red {
    background: radial-gradient(
      circle at 40% 40%,
      #c41e3a 0%,
      #8b0000 50%,
      #5c0000 100%
    );
    --glow-color: rgba(139, 0, 0, 0.3);
  }

  .wax-seal--gold {
    background: radial-gradient(
      circle at 40% 40%,
      var(--gold-light) 0%,
      var(--gold-primary) 50%,
      var(--gold-dark) 100%
    );
    --glow-color: rgba(212, 168, 83, 0.3);
  }

  .wax-seal--navy {
    background: radial-gradient(
      circle at 40% 40%,
      #2c5282 0%,
      #1a365d 50%,
      #0d1b2a 100%
    );
    --glow-color: rgba(26, 54, 93, 0.3);
  }

  /* Outer glow */
  .wax-seal::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: var(--glow-color);
    filter: blur(8px);
    z-index: -1;
  }

  /* Icon */
  .wax-seal__icon {
    font-size: inherit;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  .wax-seal--sm .wax-seal__icon { font-size: var(--text-lg); }
  .wax-seal--md .wax-seal__icon { font-size: var(--text-2xl); }
  .wax-seal--lg .wax-seal__icon { font-size: var(--text-3xl); }

  /* Drip effect */
  .wax-seal__drip {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 12px;
    border-radius: 0 0 50% 50%;
  }

  .wax-seal--red .wax-seal__drip {
    background: radial-gradient(ellipse at top, #8b0000, transparent);
  }

  .wax-seal--gold .wax-seal__drip {
    background: radial-gradient(ellipse at top, var(--gold-dark), transparent);
  }

  .wax-seal--navy .wax-seal__drip {
    background: radial-gradient(ellipse at top, #1a365d, transparent);
  }

  .wax-seal--sm .wax-seal__drip {
    bottom: -6px;
    width: 12px;
    height: 8px;
  }

  .wax-seal--lg .wax-seal__drip {
    bottom: -10px;
    width: 20px;
    height: 16px;
  }

  /* Animation */
  .wax-seal--animated {
    animation: wax-seal-stamp 0.5s ease-out;
  }

  @keyframes wax-seal-stamp {
    0% {
      transform: rotate(var(--rotation)) scale(0.5);
      opacity: 0;
    }
    60% {
      transform: rotate(var(--rotation)) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: rotate(var(--rotation)) scale(1);
    }
  }

  /* Hover effect */
  .wax-seal:hover {
    transform: rotate(var(--rotation)) scale(1.05);
    transition: transform var(--transition-base);
  }

  .wax-seal:hover::before {
    filter: blur(12px);
    opacity: 0.8;
  }

  @media (prefers-reduced-motion: reduce) {
    .wax-seal--animated {
      animation: none;
    }
  }
</style>
