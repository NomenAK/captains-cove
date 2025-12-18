<script lang="ts">
  import { dataStore } from '$lib/stores';

  // Svelte 5 reactive derivations
  const shipCount = $derived($dataStore.ships.length);
  const weaponCount = $derived($dataStore.weapons.length);
  const crewCount = $derived($dataStore.crews.length);
  const skillCount = $derived($dataStore.skills.length);

  const features = [
    { href: '#/ships', icon: '⛵', title: 'Ships', desc: 'Browse all playable ships with stats and comparisons' },
    { href: '#/weapons', icon: '💣', title: 'Weapons', desc: 'Cannons, carronades, mortars, and powder kegs' },
    { href: '#/crew', icon: '👥', title: 'Crew', desc: 'Sailors, boarding parties, and captain skills' },
    { href: '#/builds', icon: '⚙️', title: 'Builds', desc: 'Create and share ship loadouts' },
    { href: '#/balance', icon: '⚖️', title: 'Balance', desc: 'Meta analysis and tier rankings' }
  ];

  const stats = $derived([
    { value: shipCount, label: 'Ships' },
    { value: weaponCount, label: 'Weapons' },
    { value: crewCount, label: 'Crew' },
    { value: skillCount, label: 'Skills' }
  ]);
</script>

<div class="home">
  <section class="hero">
    <!-- Animated ocean background layers -->
    <div class="hero__ocean" aria-hidden="true">
      <div class="hero__wave hero__wave--1"></div>
      <div class="hero__wave hero__wave--2"></div>
      <div class="hero__wave hero__wave--3"></div>
    </div>

    <!-- Fog overlay -->
    <div class="hero__fog" aria-hidden="true"></div>

    <!-- Vignette effect -->
    <div class="hero__vignette" aria-hidden="true"></div>

    <div class="hero__content">
      <!-- Ship silhouette with SVG -->
      <div class="hero__ship" aria-hidden="true">
        <svg viewBox="0 0 100 80" class="ship-silhouette">
          <!-- Hull -->
          <path d="M10 60 Q15 75 50 75 Q85 75 90 60 L85 55 Q50 58 15 55 Z" fill="currentColor"/>
          <!-- Deck -->
          <path d="M15 55 Q50 58 85 55 L82 50 Q50 52 18 50 Z" fill="currentColor" opacity="0.9"/>
          <!-- Mast -->
          <rect x="48" y="10" width="4" height="45" fill="currentColor"/>
          <!-- Crow's nest -->
          <rect x="44" y="8" width="12" height="6" rx="1" fill="currentColor"/>
          <!-- Main sail -->
          <path d="M20 18 Q35 15 50 18 L50 48 Q35 50 20 48 Z" fill="currentColor" opacity="0.7"/>
          <!-- Secondary sail -->
          <path d="M52 18 Q67 15 80 18 L80 45 Q67 47 52 45 Z" fill="currentColor" opacity="0.6"/>
          <!-- Flag -->
          <path d="M50 5 L50 10 L60 7.5 Z" fill="currentColor"/>
          <!-- Bowsprit -->
          <line x1="10" y1="55" x2="0" y2="45" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>

      <h1 class="hero__title">
        <span class="hero__title-text">Captain's Cove</span>
      </h1>
      <p class="hero__subtitle">World of Sea Battle Analysis Tool</p>
      <p class="hero__desc">
        Navigate the seas with confidence. Explore ships, weapons, crew, and builds
        to dominate the Golden Age of Sail.
      </p>

      <!-- CTA Buttons -->
      <div class="hero__cta">
        <a href="#/ships" class="btn btn--primary">
          <span class="btn__text">Explore Ships</span>
          <span class="btn__shine" aria-hidden="true"></span>
        </a>
        <a href="#/builds" class="btn btn--secondary">Create Build</a>
      </div>
    </div>

    <div class="hero__stats">
      {#each stats as stat}
        <div class="stat-card">
          <div class="stat-card__corner stat-card__corner--tl" aria-hidden="true"></div>
          <div class="stat-card__corner stat-card__corner--tr" aria-hidden="true"></div>
          <div class="stat-card__corner stat-card__corner--bl" aria-hidden="true"></div>
          <div class="stat-card__corner stat-card__corner--br" aria-hidden="true"></div>
          <span class="stat-card__value">{stat.value}</span>
          <span class="stat-card__label">{stat.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="features">
    <h2 class="section-title">Set Sail</h2>
    <div class="feature-grid">
      {#each features as feature}
        <a href={feature.href} class="feature-card">
          <span class="feature-card__icon">{feature.icon}</span>
          <h3 class="feature-card__title">{feature.title}</h3>
          <p class="feature-card__desc">{feature.desc}</p>
          <span class="feature-card__arrow" aria-hidden="true">→</span>
        </a>
      {/each}
    </div>
  </section>

  <section class="quick-start">
    <div class="quick-start__content">
      <h2 class="section-title">Quick Start</h2>
      <p>New to Captain's Cove? Here's how to get started:</p>
      <ol class="quick-start__list">
        <li>
          <strong>Browse Ships</strong> - View all {shipCount} playable ships, filter by class and tier
        </li>
        <li>
          <strong>Compare Weapons</strong> - Find the best cannons for your playstyle
        </li>
        <li>
          <strong>Create Builds</strong> - Save your favorite ship loadouts
        </li>
        <li>
          <strong>Analyze Meta</strong> - Check balance stats and tier rankings
        </li>
      </ol>
    </div>
  </section>
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
  }

  /* ═══════════════════════════════════════════════════ */
  /* HERO SECTION - Dramatic Ocean Scene                 */
  /* ═══════════════════════════════════════════════════ */
  .hero {
    position: relative;
    text-align: center;
    padding: var(--space-3xl) var(--space-lg) var(--space-2xl);
    background: linear-gradient(
      180deg,
      var(--ocean-abyss) 0%,
      var(--ocean-deep) 30%,
      var(--ocean-medium) 70%,
      var(--ocean-surface) 100%
    );
    border-radius: var(--radius-xl);
    border: 2px solid var(--wood-grain);
    overflow: hidden;
    min-height: 500px;
  }

  /* Animated Wave Layers */
  .hero__ocean {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .hero__wave {
    position: absolute;
    bottom: 0;
    left: -50%;
    width: 200%;
    height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath fill='%230a1628' d='M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E") repeat-x;
    background-size: 600px 100%;
  }

  .hero__wave--1 {
    opacity: 0.3;
    animation: wave-flow 12s linear infinite;
  }

  .hero__wave--2 {
    opacity: 0.5;
    bottom: 10px;
    animation: wave-flow 8s linear infinite reverse;
  }

  .hero__wave--3 {
    opacity: 0.2;
    bottom: 20px;
    animation: wave-flow 15s linear infinite;
  }

  @keyframes wave-flow {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* Fog Overlay */
  .hero__fog {
    position: absolute;
    inset: 0;
    background: var(--texture-fog);
    opacity: 0.4;
    animation: fog-drift 20s ease-in-out infinite alternate;
    pointer-events: none;
  }

  /* Vignette Effect */
  .hero__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 30%,
      rgba(5, 10, 18, 0.4) 70%,
      rgba(5, 10, 18, 0.8) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .hero__content {
    position: relative;
    z-index: 2;
  }

  /* Ship Silhouette */
  .hero__ship {
    width: 120px;
    height: 100px;
    margin: 0 auto var(--space-lg);
    color: var(--gold-primary);
    filter: drop-shadow(0 0 20px rgba(212, 168, 83, 0.4));
    animation: ship-rock 4s ease-in-out infinite;
  }

  .ship-silhouette {
    width: 100%;
    height: 100%;
  }

  @keyframes ship-rock {
    0%, 100% {
      transform: translateY(0) rotate(-2deg);
    }
    25% {
      transform: translateY(-5px) rotate(0deg);
    }
    50% {
      transform: translateY(0) rotate(2deg);
    }
    75% {
      transform: translateY(-3px) rotate(0deg);
    }
  }

  /* Dramatic Title with Shimmer */
  .hero__title {
    font-family: var(--font-display);
    font-size: var(--text-5xl);
    margin: 0 0 var(--space-sm);
    letter-spacing: var(--tracking-wide);
    position: relative;
  }

  .hero__title-text {
    background: linear-gradient(
      90deg,
      var(--gold-dark) 0%,
      var(--gold-primary) 25%,
      var(--gold-light) 50%,
      var(--gold-primary) 75%,
      var(--gold-dark) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gold-shimmer 4s ease-in-out infinite;
    text-shadow: none;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  @keyframes gold-shimmer {
    0%, 100% {
      background-position: 0% center;
    }
    50% {
      background-position: 100% center;
    }
  }

  .hero__subtitle {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-widest);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .hero__desc {
    max-width: 600px;
    margin: 0 auto var(--space-xl);
    color: var(--canvas-aged);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  /* CTA Buttons */
  .hero__cta {
    display: flex;
    justify-content: center;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-xl);
    border-radius: var(--radius-md);
    font-family: var(--font-display);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
  }

  .btn--primary {
    background: linear-gradient(
      135deg,
      var(--gold-dark) 0%,
      var(--gold-primary) 50%,
      var(--gold-light) 100%
    );
    color: var(--wood-charred);
    border: 2px solid var(--gold-dark);
    box-shadow:
      0 4px 12px rgba(212, 168, 83, 0.3),
      inset 0 1px 0 var(--gold-light);
  }

  .btn--primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(212, 168, 83, 0.4),
      inset 0 1px 0 var(--gold-light);
  }

  .btn__shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  .btn--primary:hover .btn__shine {
    left: 150%;
  }

  .btn--secondary {
    background: transparent;
    color: var(--brass-light);
    border: 2px solid var(--brass);
  }

  .btn--secondary:hover {
    background: rgba(181, 166, 66, 0.1);
    border-color: var(--brass-light);
    color: var(--gold-light);
  }

  /* Enhanced Stat Cards */
  .hero__stats {
    display: flex;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .stat-card {
    position: relative;
    background: var(--bg-card);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    min-width: 100px;
    text-align: center;
    transition: all var(--transition-base);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--brass);
    box-shadow: var(--shadow-lg), var(--glow-gold-sm);
  }

  /* Brass corner dots */
  .stat-card__corner {
    position: absolute;
    width: 8px;
    height: 8px;
    background: radial-gradient(
      circle at 30% 30%,
      var(--brass-light),
      var(--brass-dark)
    );
    border-radius: 50%;
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .stat-card__corner--tl { top: 8px; left: 8px; }
  .stat-card__corner--tr { top: 8px; right: 8px; }
  .stat-card__corner--bl { bottom: 8px; left: 8px; }
  .stat-card__corner--br { bottom: 8px; right: 8px; }

  .stat-card__value {
    display: block;
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-sm);
  }

  .stat-card__label {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  /* ═══════════════════════════════════════════════════ */
  /* FEATURES SECTION                                    */
  /* ═══════════════════════════════════════════════════ */
  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-sm);
    margin: 0 0 var(--space-lg);
    text-align: center;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-lg);
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    padding: var(--space-xl);
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    text-decoration: none;
    color: inherit;
    transition: all var(--transition-base);
    position: relative;
  }

  .feature-card:hover {
    border-color: var(--brass);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), var(--glow-subtle);
  }

  .feature-card__icon {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-md);
  }

  .feature-card__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--gold-primary);
    margin: 0 0 var(--space-sm);
  }

  .feature-card__desc {
    font-size: var(--text-sm);
    color: var(--text-muted);
    flex: 1;
    margin: 0;
  }

  .feature-card__arrow {
    position: absolute;
    bottom: var(--space-md);
    right: var(--space-md);
    font-size: var(--text-xl);
    color: var(--brass);
    opacity: 0;
    transform: translateX(-10px);
    transition: all var(--transition-fast);
  }

  .feature-card:hover .feature-card__arrow {
    opacity: 1;
    transform: translateX(0);
  }

  /* ═══════════════════════════════════════════════════ */
  /* QUICK START SECTION                                 */
  /* ═══════════════════════════════════════════════════ */
  .quick-start {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    padding: var(--space-xl);
  }

  .quick-start__content p {
    color: var(--canvas-aged);
    margin-bottom: var(--space-md);
    text-align: center;
  }

  .quick-start__list {
    max-width: 600px;
    margin: 0 auto;
    padding-left: var(--space-xl);
  }

  .quick-start__list li {
    color: var(--canvas-aged);
    margin-bottom: var(--space-md);
    line-height: var(--leading-relaxed);
  }

  .quick-start__list strong {
    color: var(--gold-primary);
  }

  /* ═══════════════════════════════════════════════════ */
  /* RESPONSIVE                                          */
  /* ═══════════════════════════════════════════════════ */
  @media (max-width: 768px) {
    .hero {
      padding: var(--space-xl) var(--space-md) var(--space-lg);
      min-height: auto;
    }

    .hero__ship {
      width: 80px;
      height: 65px;
    }

    .hero__title {
      font-size: var(--text-3xl);
    }

    .hero__subtitle {
      font-size: var(--text-base);
    }

    .hero__desc {
      font-size: var(--text-base);
    }

    .hero__cta {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 280px;
    }

    .stat-card {
      padding: var(--space-sm) var(--space-md);
      min-width: 70px;
    }

    .stat-card__value {
      font-size: var(--text-2xl);
    }

    .stat-card__corner {
      width: 6px;
      height: 6px;
    }

    .stat-card__corner--tl { top: 6px; left: 6px; }
    .stat-card__corner--tr { top: 6px; right: 6px; }
    .stat-card__corner--bl { bottom: 6px; left: 6px; }
    .stat-card__corner--br { bottom: 6px; right: 6px; }
  }

  /* ═══════════════════════════════════════════════════ */
  /* REDUCED MOTION                                      */
  /* ═══════════════════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    .hero__wave,
    .hero__fog,
    .hero__ship,
    .hero__title-text {
      animation: none;
    }

    .btn__shine {
      display: none;
    }
  }
</style>
