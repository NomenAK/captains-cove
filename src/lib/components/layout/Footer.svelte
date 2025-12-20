<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="footer__content">
    <div class="footer__section footer__section--brand">
      <span class="footer__logo">⚓</span>
      <div class="footer__brand-text">
        <span class="footer__title">Captain's Cove</span>
        <span class="footer__subtitle">World of Sea Battle Analysis Tool</span>
      </div>
    </div>

    <div class="footer__section footer__section--links">
      <h4 class="footer__heading">Navigation</h4>
      <nav class="footer__nav">
        <a href="#/ships">Ships</a>
        <a href="#/weapons">Weapons</a>
        <a href="#/builds">Builds</a>
        <a href="#/balance">Balance</a>
      </nav>
    </div>

    <div class="footer__section footer__section--links">
      <h4 class="footer__heading">Resources</h4>
      <nav class="footer__nav">
        <a href="#/about">About</a>
        <a href="https://world-of-sea-battle.fandom.com/" target="_blank" rel="noopener noreferrer">Wiki</a>
        <a href="https://store.steampowered.com/app/2948190/World_of_Sea_Battle/" target="_blank" rel="noopener noreferrer">Steam</a>
        <a href="https://discord.com/invite/3XJyVctcTd" target="_blank" rel="noopener noreferrer">Discord</a>
      </nav>
    </div>

    <div class="footer__section footer__section--info">
      <h4 class="footer__heading">Data Source</h4>
      <p class="footer__text">
        Game data extracted from World of Sea Battle game files.
        Not affiliated with the game developers.
      </p>
    </div>
  </div>

  <div class="footer__bottom">
    <div class="footer__divider"></div>
    <p class="footer__copyright">
      © {currentYear} Captain's Cove. Fan-made analysis tool.
    </p>
    <p class="footer__disclaimer">
      World of Sea Battle is a trademark of its respective owners.
    </p>
  </div>

  <div class="footer__decoration">
    <span class="footer__wave">〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</span>
  </div>
</footer>

<style>
  .footer {
    background: var(--texture-wood);
    border-top: 3px solid var(--brass-dark);
    padding: var(--space-xl) var(--space-lg) var(--space-lg);
    margin-top: auto;
  }

  .footer__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer__section--brand {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .footer__logo {
    font-size: var(--text-4xl);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  .footer__brand-text {
    display: flex;
    flex-direction: column;
  }

  .footer__title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--gold-primary);
    text-shadow: var(--text-shadow-gold);
  }

  .footer__subtitle {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .footer__heading {
    font-family: var(--font-display);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--brass-light);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-md);
  }

  .footer__nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .footer__nav a {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .footer__nav a:hover {
    color: var(--gold-light);
  }

  .footer__text {
    font-size: var(--text-sm);
    color: var(--text-muted);
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  .footer__bottom {
    max-width: 1200px;
    margin: var(--space-xl) auto 0;
    text-align: center;
  }

  .footer__divider {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--wood-grain),
      var(--brass-dark),
      var(--wood-grain),
      transparent
    );
    margin-bottom: var(--space-lg);
  }

  .footer__copyright {
    font-size: var(--text-sm);
    color: var(--canvas-aged);
    margin: 0 0 var(--space-xs);
  }

  .footer__disclaimer {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
  }

  .footer__decoration {
    text-align: center;
    margin-top: var(--space-lg);
    opacity: 0.3;
    overflow: hidden;
  }

  .footer__wave {
    font-size: var(--text-lg);
    letter-spacing: -2px;
    display: inline-block;
    animation: wave-flow 4s linear infinite;
  }

  @media (max-width: 768px) {
    .footer {
      padding: var(--space-lg) var(--space-md) var(--space-md);
    }

    .footer__content {
      grid-template-columns: 1fr;
      gap: var(--space-lg);
      text-align: center;
    }

    .footer__section--brand {
      justify-content: center;
    }

    .footer__nav {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-md);
    }
  }

  @keyframes wave-flow {
    0% { transform: translateX(-20px); }
    100% { transform: translateX(20px); }
  }
</style>
