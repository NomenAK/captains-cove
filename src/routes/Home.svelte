<script lang="ts">
  import { dataStore } from '$lib/stores';

  $: shipCount = $dataStore.ships.length;
  $: weaponCount = $dataStore.weapons.length;
  $: crewCount = $dataStore.crews.length;
  $: skillCount = $dataStore.skills.length;

  const features = [
    { href: '#/ships', icon: '⛵', title: 'Ships', desc: 'Browse all playable ships with stats and comparisons' },
    { href: '#/weapons', icon: '💣', title: 'Weapons', desc: 'Cannons, carronades, mortars, and powder kegs' },
    { href: '#/crew', icon: '👥', title: 'Crew', desc: 'Sailors, boarding parties, and captain skills' },
    { href: '#/builds', icon: '⚙️', title: 'Builds', desc: 'Create and share ship loadouts' },
    { href: '#/balance', icon: '⚖️', title: 'Balance', desc: 'Meta analysis and tier rankings' }
  ];
</script>

<div class="home">
  <section class="hero">
    <div class="hero__content">
      <span class="hero__icon">⚓</span>
      <h1 class="hero__title">Captain's Cove</h1>
      <p class="hero__subtitle">World of Sea Battle Analysis Tool</p>
      <p class="hero__desc">
        Navigate the seas with confidence. Explore ships, weapons, crew, and builds
        to dominate the Golden Age of Sail.
      </p>
    </div>

    <div class="hero__stats">
      <div class="stat-card">
        <span class="stat-card__value">{shipCount}</span>
        <span class="stat-card__label">Ships</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{weaponCount}</span>
        <span class="stat-card__label">Weapons</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{crewCount}</span>
        <span class="stat-card__label">Crew</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__value">{skillCount}</span>
        <span class="stat-card__label">Skills</span>
      </div>
    </div>
  </section>

  <section class="features">
    <h2 class="section-title">Set Sail</h2>
    <div class="feature-grid">
      {#each features as feature}
        <a href={feature.href} class="feature-card hover-lift">
          <span class="feature-card__icon">{feature.icon}</span>
          <h3 class="feature-card__title">{feature.title}</h3>
          <p class="feature-card__desc">{feature.desc}</p>
          <span class="feature-card__arrow">→</span>
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
          <strong>Browse Ships</strong> - View all 71 playable ships, filter by class and tier
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

  /* Hero Section */
  .hero {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    background: var(--texture-ocean-radial);
    border-radius: var(--radius-xl);
    border: 2px solid var(--wood-grain);
  }

  .hero__icon {
    font-size: 72px;
    display: block;
    margin-bottom: var(--space-md);
    animation: ship-bob 3s ease-in-out infinite;
  }

  .hero__title {
    font-family: var(--font-display);
    font-size: var(--text-5xl);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
    margin: 0 0 var(--space-sm);
    letter-spacing: var(--tracking-wide);
  }

  .hero__subtitle {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--brass-light);
    margin: 0 0 var(--space-md);
    text-transform: uppercase;
    letter-spacing: var(--tracking-widest);
  }

  .hero__desc {
    max-width: 600px;
    margin: 0 auto var(--space-xl);
    color: var(--canvas-aged);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
  }

  .hero__stats {
    display: flex;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  .stat-card {
    background: var(--bg-card);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-lg);
    border: 2px solid var(--wood-grain);
    min-width: 100px;
    text-align: center;
  }

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

  /* Section Title */
  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-sm);
    margin: 0 0 var(--space-lg);
    text-align: center;
  }

  /* Features Grid */
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

  /* Quick Start */
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

  @media (max-width: 768px) {
    .hero__title {
      font-size: var(--text-3xl);
    }

    .hero__icon {
      font-size: 48px;
    }

    .stat-card {
      padding: var(--space-sm) var(--space-md);
      min-width: 80px;
    }

    .stat-card__value {
      font-size: var(--text-2xl);
    }
  }

  @keyframes ship-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
</style>
