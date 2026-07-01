// ═══════════════════════════════════════════
// MAP COMMUNES COMPONENT — Baptiste & Daphné
// Injection de la carte SVG des 14 communes
// dans tout élément #map-container trouvé.
// ═══════════════════════════════════════════

(function() {
  const mapHTML = `
<div class="map" aria-hidden="false">
<svg class="map-svg" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid meet" role="img"
     aria-label="Carte dessinée à la main des communes d'intervention autour de Chambéry">

  <!-- ═══ COURS D'EAU ═══ -->

  <!-- La Leysse : arc du nord-ouest vers le nord-est, passe par Chambéry -->
  <path class="map-river"
        d="M 20 180 C 110 220, 180 260, 290 340 C 340 380, 420 360, 520 320 C 560 305, 580 295, 600 285"
        stroke="currentColor" stroke-width="1.3" fill="none"
        stroke-linecap="round" opacity="0.75"></path>
  <text x="24" y="330" class="map-river-label"
        transform="rotate(20 395 510)">
    <tspan font-style="italic">La Leysse</tspan>
  </text>

  <!-- L'Albanne : descend du centre (Chambéry) vers le sud-est -->
  <path class="map-river"
        d="M 295 348 C 320 420, 380 480, 430 560 C 450 600, 470 640, 490 700"
        stroke="currentColor" stroke-width="1.3" fill="none"
        stroke-linecap="round" opacity="0.75"></path>
  <text x="395" y="495" class="map-river-label"
        transform="rotate(62 395 510)">
    <tspan font-style="italic">L'Albanne</tspan>
  </text>

  <!-- ═══ COMMUNES (14) ═══ -->
  <g class="map-points" fill="currentColor">

    <!-- CHAMBÉRY (centre, pivot, plus gros) -->
    <circle cx="295" cy="345" r="4.5" class="map-point-main"></circle>
    <text x="306" y="340" class="map-label map-label--strong"
          font-style="italic">Chambéry</text>

    <!-- ═══ AXE NORD ═══ -->

    <!-- La Motte-Servolex (NO) -->
    <circle cx="80" cy="250" r="2.5"></circle>
    <text x="80" y="290" class="map-label">La Motte-Servolex</text>

    <!-- Bassens (N, centre-haut) -->
    <circle cx="305" cy="260" r="2.5"></circle>
    <text x="316" y="230" class="map-label">Bassens</text>

    <!-- Saint-Alban-Leysse (NE) -->
    <circle cx="420" cy="170" r="2.5"></circle>
    <text x="345" y="148" class="map-label">Saint-Alban-Leysse</text>

    <!-- Saint-Jean-d'Arvey (extrême NE) -->
    <circle cx="540" cy="120" r="2.5"></circle>
    <text x="478" y="100" class="map-label">Saint-Jean-d'Arvey</text>

    <!-- ═══ AXE EST ═══ -->

    <!-- Barby (E, près de Chambéry) -->
    <circle cx="395" cy="290" r="2.5"></circle>
    <text x="406" y="285" class="map-label">Barby</text>

    <!-- La Ravoire (SE proche) -->
    <circle cx="395" cy="365" r="2.5"></circle>
    <text x="406" y="390" class="map-label">La Ravoire</text>

    <!-- Challes-les-Eaux (extrême E) -->
    <circle cx="510" cy="500" r="2.5"></circle>
    <text x="521" y="480" class="map-label">Challes-les-Eaux</text>

    <!-- ═══ AXE SUD-EST ═══ -->

    <!-- Saint-Baldoph (SE lointain, sur l'Albanne) -->
    <circle cx="425" cy="600" r="2.5"></circle>
    <text x="436" y="595" class="map-label">Saint-Baldoph</text>

    <!-- ═══ AXE SUD-CENTRE ═══ -->

    <!-- Barberaz (juste sous Chambéry, vers Jacob) -->
    <circle cx="320" cy="450" r="2.5"></circle>
    <text x="260" y="445" class="map-label">Barberaz</text>

    <!-- Jacob-Bellecombette (S de Chambéry) -->
    <circle cx="260" cy="400" r="2.5"></circle>
    <text x="200" y="380" class="map-label">Jacob-Bellecombette</text>

    <!-- ═══ AXE SUD-OUEST ═══ -->

    <!-- Cognin (SO de Chambéry) -->
    <circle cx="170" cy="450" r="2.5"></circle>
    <text x="85" y="445" class="map-label">Cognin</text>

    <!-- Montagnole (S, sous Jacob) -->
    <circle cx="280" cy="540" r="2.5"></circle>
    <text x="291" y="536" class="map-label">Montagnole</text>

    <!-- Saint-Cassin (SO lointain) -->
    <circle cx="125" cy="555" r="2.5"></circle>
    <text x="35" y="571" class="map-label">Saint-Cassin</text>

  </g>

  <!-- ═══ COORDONNÉES & MENTIONS ═══ -->
  <text x="20" y="30" class="map-coords">45.5646° N · 5.9178° E</text>
  <text x="20" y="685" class="map-coords">Territoire d'intervention · 14 communes</text>

</svg>
</div>`;

  function inject() {
    const container = document.getElementById('map-container');
    if (container) container.innerHTML = mapHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
