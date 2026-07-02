// ═══════════════════════════════════════════
// TRACKING — Baptiste & Daphné Immobilier
// Google Forms · Google Ads · Conversion Calendly
// ═══════════════════════════════════════════

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfHPxMd8HyjV-U0zfrYvoDnuHi7E7TTOhG-_-iXpWLjm9TE4Q/formResponse';

function trackProfileSelection(profile) {
  try {
    var tracked = [];
    try { tracked = JSON.parse(localStorage.getItem('bd_tracked')) || []; } catch(e) {}
    if (tracked.indexOf(profile) !== -1) return;

    var timestamp = new Date().toLocaleString('fr-FR');
    var device = navigator.userAgent.substring(0, 50);
    var data = 'entry.1134277817=' + encodeURIComponent(profile) +
               '&entry.1427303831=' + encodeURIComponent(timestamp) +
               '&entry.313323232=' + encodeURIComponent(device);
    fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data,
      mode: 'no-cors',
      keepalive: true
    }).catch(function() {});

    tracked.push(profile);
    localStorage.setItem('bd_tracked', JSON.stringify(tracked));
  } catch(e) {}
}

// Suivi conversion Calendly → Google Ads
window.addEventListener('message', function(e) {
  if (e.data && e.data.event && e.data.event === 'calendly.event_scheduled') {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-17870834052/Kd-vCIqK-v4bEISTvclC'
      });
    }
  }
});

// Tracking cards homepage
document.addEventListener('DOMContentLoaded', function() {
  var cardProfiles = {
    '/venteimmobiliere.html': 'vendeur',
    '/cessiondefonds.html':   'fonds',
    '/locataire.html':        'locataire'
  };

  document.querySelectorAll('.home-card').forEach(function(card) {
    var profile = cardProfiles[card.getAttribute('href')];
    if (!profile) return;
    card.addEventListener('click', function() {
      trackProfileSelection('card_' + profile);
    });
  });

  // Tracking nav — index.html uniquement
  var isIndex = ['/', '/index.html'].indexOf(window.location.pathname) !== -1;
  if (isIndex) {
    var navTargets = {
      '/venteimmobiliere.html': 'nav_vente_immobiliere',
      '/cessiondefonds.html':   'nav_cession_fonds'
    };
    document.querySelectorAll('#nav .nav-links a, .menu-nav-link').forEach(function(link) {
      var target = navTargets[link.getAttribute('href')];
      if (!target) return;
      link.addEventListener('click', function() {
        trackProfileSelection(target);
      });
    });
  }
});
