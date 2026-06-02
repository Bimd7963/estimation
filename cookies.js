// ═══════════════════════════════════════════
// BANDEAU COOKIES — Baptiste & Daphné Immobilier
// ═══════════════════════════════════════════

var CONSENT_KEY = 'bd_cookie_consent';
var META_PIXEL_ID = '1405060961660950';

// ── Injection dynamique du HTML du bandeau
(function injectBannerHTML() {
  var html = '\
<div id="cookie-banner">\
  <div id="banner-inner">\
    <div id="banner-main">\
      <div class="banner-left">\
        <strong>🍪 Ce site utilise des cookies</strong>\
        <p>En acceptant, vous nous aidez à <em>mieux comprendre ce qui vous intéresse</em> et à améliorer notre site. Vos données restent anonymes.</p>\
      </div>\
      <div class="banner-right">\
        <div class="banner-btns-row">\
          <button class="btn-banner-refuse" onclick="bannerRefuse()">Refuser</button>\
          <button class="btn-banner-accept" onclick="bannerAccept()">Tout accepter ✓</button>\
        </div>\
        <span class="banner-reassurance">Vous pouvez changer d\'avis à tout moment</span>\
        <button class="btn-banner-custom" onclick="openCustom()">⚙ Personnaliser les cookies</button>\
      </div>\
    </div>\
    <div id="banner-custom">\
      <div class="custom-title">⚙ Personnaliser mes préférences</div>\
      <div class="custom-rows">\
        <div class="custom-row required">\
          <div class="custom-row-info">\
            <strong>🔒 Essentiels</strong>\
            <span>Nécessaires au fonctionnement du site. Toujours actifs.</span>\
          </div>\
          <label class="toggle"><input type="checkbox" checked disabled><span class="slider"></span></label>\
        </div>\
        <div class="custom-row">\
          <div class="custom-row-info">\
            <strong>📊 Google Analytics</strong>\
            <span>Mesure d\'audience anonymisée — pages vues, durée de visite.</span>\
          </div>\
          <label class="toggle"><input type="checkbox" id="c-ga"><span class="slider"></span></label>\
        </div>\
        <div class="custom-row">\
          <div class="custom-row-info">\
            <strong>📣 Google Ads</strong>\
            <span>Suivi des conversions publicitaires.</span>\
          </div>\
          <label class="toggle"><input type="checkbox" id="c-ads"><span class="slider"></span></label>\
        </div>\
        <div class="custom-row">\
          <div class="custom-row-info">\
            <strong>🎥 Microsoft Clarity</strong>\
            <span>Heatmaps et sessions anonymisées pour améliorer le site.</span>\
          </div>\
          <label class="toggle"><input type="checkbox" id="c-clarity"><span class="slider"></span></label>\
        </div>\
        <div class="custom-row">\
          <div class="custom-row-info">\
            <strong>📣 Meta (Facebook)</strong>\
            <span>Remarketing et audiences personnalisées.</span>\
          </div>\
          <label class="toggle"><input type="checkbox" id="c-meta"><span class="slider"></span></label>\
        </div>\
      </div>\
      <div class="custom-actions">\
        <button class="btn-save-custom" onclick="saveCustom()">Enregistrer mes choix ✓</button>\
        <button class="btn-back-banner" onclick="closeCustom()">← Retour</button>\
        <button class="btn-refuse-all-custom" onclick="bannerRefuse()">Tout refuser</button>\
      </div>\
    </div>\
  </div>\
</div>';
  var container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container.firstChild);
})();

// ═══════════════════════════════════════════

function getSessionId() {
  var sid = sessionStorage.getItem('bd_sid');
  if (!sid) {
    sid = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    sessionStorage.setItem('bd_sid', sid);
  }
  return sid;
}

// ── Activation des outils

function activateAnalytics() {
  if (window._gaLoaded) return; window._gaLoaded = true;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-41DC15H7KJ';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', 'G-41DC15H7KJ');
}

function activateAds() {
  if (window._adsLoaded) return; window._adsLoaded = true;
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17870834052';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date()); gtag('config', 'AW-17870834052');
}

function activateClarity() {
  if (window._clarityLoaded) return; window._clarityLoaded = true;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'vnvyypfvt5');
}

function activateMeta() {
  if (!window.fbq) return;
  fbq('consent', 'grant');
}

// ── Log Google Forms
function logToSheet(prefs, decision) {
  var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSedRoADTym4LVkXkdJ13hhbVig5mW-bO00qhG-ibnmuAhfXLA/formResponse';
  var params = [
    'entry.839408998='  + encodeURIComponent(getSessionId()),
    'entry.1724484721=' + encodeURIComponent(decision),
    'entry.1435701037=' + encodeURIComponent(prefs.analytics ? 'Oui' : 'Non'),
    'entry.1901302805=' + encodeURIComponent(prefs.ads       ? 'Oui' : 'Non'),
    'entry.203643052='  + encodeURIComponent(prefs.clarity   ? 'Oui' : 'Non'),
    'entry.1764155101=' + encodeURIComponent(window.location.pathname)
  ].join('&');
  fetch(formUrl, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  }).catch(function () {});
}

function applyAndLog(prefs, decision) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(Object.assign({}, prefs, { ts: Date.now() })));
  if (prefs.analytics) activateAnalytics();
  if (prefs.ads)       activateAds();
  if (prefs.clarity)   activateClarity();
  if (prefs.meta)      activateMeta();
  logToSheet(prefs, decision);
}

function hideBanner() {
  var banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('visible');
  document.body.classList.remove('cookie-wall');
}

function bannerAccept() {
  applyAndLog({ analytics: true, ads: true, clarity: true, meta: true }, 'accept_all');
  hideBanner();
}

function bannerRefuse() {
  applyAndLog({ analytics: false, ads: false, clarity: false, meta: false }, 'refuse_all');
  hideBanner();
}

function openCustom() {
  document.getElementById('banner-main').style.display = 'none';
  document.getElementById('banner-custom').classList.add('open');
}

function closeCustom() {
  document.getElementById('banner-custom').classList.remove('open');
  document.getElementById('banner-main').style.display = '';
}

function saveCustom() {
  var prefs = {
    analytics: document.getElementById('c-ga').checked,
    ads:       document.getElementById('c-ads').checked,
    clarity:   document.getElementById('c-clarity').checked,
    meta:      document.getElementById('c-meta').checked
  };
  applyAndLog(prefs, 'custom');
  hideBanner();
}

// ── Init au chargement
(function () {
  try {
    var saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (saved && typeof saved === 'object') {
      if (saved.analytics) activateAnalytics();
      if (saved.ads)       activateAds();
      if (saved.clarity)   activateClarity();
      if (saved.meta)      activateMeta();
      var alreadyLogged = sessionStorage.getItem('bd_session_logged');
      if (!alreadyLogged) {
        sessionStorage.setItem('bd_session_logged', '1');
        logToSheet(saved, 'returning');
      }
      return;
    }
  } catch (e) {}
  setTimeout(function () {
    var banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.add('visible');
    document.body.classList.add('cookie-wall');
  }, 1200);
})();
