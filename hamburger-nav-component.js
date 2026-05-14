// ═══════════════════════════════════════════
// HAMBURGER NAV COMPONENT — Baptiste & Daphné
// Injection automatique sur toutes les pages
// ═══════════════════════════════════════════

(function() {
  // Vérifier que le composant n'est pas déjà injecté
  if (document.getElementById('hamburger-nav-injected')) return;

  // HTML à injecter
  const navHTML = `
    <button class="hamburger-btn" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div id="menu-drawer">
      <div id="menu-content">
        <a href="index.html#approche" class="menu-nav-link">Notre approche</a>
        <a href="index.html#avis" class="menu-nav-link">Avis clients</a>
        <a href="FAQ.html" class="menu-nav-link">Questions</a>
        <a href="Articles-p.html" class="menu-nav-link">Articles</a>

        <div class="menu-cta-section">
          <a href="index.html#rdv" class="menu-cta-btn">Discuter de mon projet</a>
        </div>
      </div>
    </div>

    <span id="hamburger-nav-injected"></span>
  `;

  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHamburgerNav);
  } else {
    initHamburgerNav();
  }

  function initHamburgerNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Créer un conteneur temporaire pour injecter le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navHTML;

    // Extraire les éléments du conteneur
    const hamburgerBtn = tempDiv.querySelector('.hamburger-btn');
    const menuDrawer = tempDiv.querySelector('#menu-drawer');

    // Injecter le bouton hamburger dans la nav
    if (hamburgerBtn) {
      nav.appendChild(hamburgerBtn);
    }

    // Injecter le drawer à la fin du body
    if (menuDrawer) {
      document.body.appendChild(menuDrawer);
    }

    // Initialiser les interactions avec délégation
    setTimeout(setupHamburgerInteractions, 200);
  }

  function setupHamburgerInteractions() {
    // Délégation d'événements au niveau du document
    document.addEventListener('click', function(e) {
      const hamburgerBtn = document.querySelector('.hamburger-btn');
      const menuDrawer = document.getElementById('menu-drawer');

      if (!hamburgerBtn || !menuDrawer) return;

      // Clic sur le hamburger
      if (e.target.closest('.hamburger-btn')) {
        e.preventDefault();
        e.stopPropagation();
        menuDrawer.classList.toggle('open');
        hamburgerBtn.classList.toggle('active');
        return;
      }

      // Clic sur le fond (dehors du menu)
      if (e.target === menuDrawer) {
        menuDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        return;
      }

      // Clic sur un lien du menu
      if (e.target.closest('.menu-nav-link')) {
        menuDrawer.classList.remove('open');
        hamburgerBtn.classList.remove('active');
        return;
      }
    });

    // Fermer au scroll
    window.addEventListener('scroll', function() {
      const menuDrawer = document.getElementById('menu-drawer');
      const hamburgerBtn = document.querySelector('.hamburger-btn');
      if (menuDrawer && menuDrawer.classList.contains('open')) {
        menuDrawer.classList.remove('open');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
      }
    }, { passive: true });

    // Fermer à l'ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const menuDrawer = document.getElementById('menu-drawer');
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        if (menuDrawer && menuDrawer.classList.contains('open')) {
          menuDrawer.classList.remove('open');
          if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        }
      }
    });
  }
})();
