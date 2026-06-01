/**
 * ═══════════════════════════════════════════════════════════════
 * LANDING PAGE — CARROUSEL COVERFLOW 3D HORIZONTAL
 * Baptiste & Daphné Immobilier
 * ═══════════════════════════════════════════════════════════════
 */

// ── ÉLÉMENTS DOM ──
const slides = Array.from(document.querySelectorAll('.coverflow-slide'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');

console.log('=== INITIALISATION ===');
console.log('Nombre de slides:', slides.length);
slides.forEach((s, i) => console.log(`Slide ${i}:`, s, 'data-index:', s.dataset.index, 'data-profile:', s.dataset.profile));

// ── VARIABLES D'ÉTAT ──
let currentIndex = 0;
const slideCount = slides.length;
let cx = 0, cy = 0, rx = 0, ry = 0;
let hasPlayedInitAnimation = false;
let isAnimating = false;

/**
 * Normalise un index pour la boucle infinie
 */
function normalizeIndex(index) {
  return ((index % slideCount) + slideCount) % slideCount;
}

/**
 * Calcule l'offset horizontal
 */
function calculateOffset(index) {
  let offset = index - currentIndex;
  if (offset > slideCount / 2) offset -= slideCount;
  if (offset < -slideCount / 2) offset += slideCount;
  return offset;
}

/**
 * Applique les transforms 3D
 */
function applyTransform(slide, offset) {
  const baseGap = 60;
  const slideWidth = slide.offsetWidth || 320;
  const spacing = slideWidth / 2 + baseGap;
  
  let rotateY = 0, translateX = 0, translateZ = 0, scale = 1, opacity = 1, zIndex = 50;

  if (offset === 0) {
    rotateY = 0; translateX = 0; translateZ = 0; scale = 1; opacity = 1; zIndex = 100;
  } else if (offset === -1) {
    rotateY = 40; translateX = -spacing; translateZ = -300; scale = 0.6; opacity = 0.7; zIndex = 50;
  } else if (offset === 1) {
    rotateY = -40; translateX = spacing; translateZ = -300; scale = 0.6; opacity = 0.7; zIndex = 50;
  } else if (offset < -1) {
    rotateY = 60; translateX = -spacing * Math.abs(offset); translateZ = -500; scale = 0.3; opacity = 0.01; zIndex = 0;
  } else if (offset > 1) {
    rotateY = -60; translateX = spacing * offset; translateZ = -500; scale = 0.3; opacity = 0.01; zIndex = 0;
  }

  gsap.to(slide, {
    rotateY, rotateX: 0, rotateZ: 0, x: translateX, z: translateZ, scale, opacity,
    duration: 0.8,
    ease: 'power2.inOut'
  });

  slide.style.zIndex = zIndex;
}

/**
 * Met à jour tout le carrousel
 */
function updateCoverflow() {
  slides.forEach((slide, idx) => {
    const offset = calculateOffset(idx);
    applyTransform(slide, offset);
    if (offset === 0) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
}

/**
 * Naviguer vers un index
 */
function goToSlide(index) {
  const newIndex = normalizeIndex(index);
  
  if (isAnimating || newIndex === currentIndex) {
    console.log('goToSlide bloqué: isAnimating=' + isAnimating + ', newIndex=' + newIndex + ', currentIndex=' + currentIndex);
    return;
  }
  
  console.log('goToSlide(' + newIndex + ')');
  isAnimating = true;
  currentIndex = newIndex;
  updateCoverflow();
  
  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * GESTION DES INTERACTIONS SUR LES SLIDES
 * ═══════════════════════════════════════════════════════════════
 */

console.log('=== SETUP ÉVÉNEMENTS SLIDES ===');
console.log('Slides trouvées:', slides.length);

const container = document.querySelector('.coverflow-container');
console.log('Container trouvé:', container);
console.log('Container existe?', !!container);

if (!container) {
  console.error('❌ ERREUR: Container .coverflow-container non trouvé!');
}

let lastSlideHovered = -1;
let hoverTimeout = null;
let hoverWasTriggered = false;
const HOVER_DELAY = 300;

if (container) {
  console.log('✓ Ajout des event listeners sur le container');
  
  container.addEventListener('mousemove', (e) => {
    let currentSlideUnder = -1;
    
    for (let i = 0; i < slides.length; i++) {
      const rect = slides[i].getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        currentSlideUnder = i;
        break;
      }
    }
    
    // Si un hover a déclenché une animation ET on est sur une slide latérale, ignorer
    if (hoverWasTriggered && currentSlideUnder !== -1) {
      return;
    }
    
    // Si changement de slide
    if (currentSlideUnder !== lastSlideHovered) {
      lastSlideHovered = currentSlideUnder;
      
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      if (currentSlideUnder !== -1) {
        console.log('➤ HOVER SLIDE', currentSlideUnder, '(attente de', HOVER_DELAY, 'ms)');
        
        hoverTimeout = setTimeout(() => {
          if (currentSlideUnder !== currentIndex && !isAnimating) {
            console.log('  → Appel goToSlide(' + currentSlideUnder + ')');
            hoverWasTriggered = true;
            goToSlide(currentSlideUnder);
            
            // Réinitialiser après 1 seconde (après que l'animation soit finie)
            setTimeout(() => {
              hoverWasTriggered = false;
              console.log('  → hoverWasTriggered réinitialisé');
            }, 1000);
          }
          hoverTimeout = null;
        }, HOVER_DELAY);
      }
    }
  });

  container.addEventListener('mouseleave', () => {
    lastSlideHovered = -1;
    hoverWasTriggered = false;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    console.log('➤ MOUSELEAVE');
  });

  container.addEventListener('click', (e) => {
    let clickedSlideIndex = -1;
    
    for (let i = 0; i < slides.length; i++) {
      const rect = slides[i].getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        clickedSlideIndex = i;
        break;
      }
    }
    
    if (clickedSlideIndex !== -1) {
      const profile = slides[clickedSlideIndex].dataset.profile;
      
      console.log('➤ CLIC SLIDE', clickedSlideIndex, 'profile:', profile, 'currentIndex:', currentIndex);
      
      if (clickedSlideIndex === currentIndex) {
        console.log('  → Slide centrale, redirection vers', profile);
        const urls = {
          proprio: './index-proprietaire.html',
          locataire: './index-locataire.html',
          fonds: './index-fonds.html'
        };
       if (urls[profile]) {
        console.log('  → Redirection vers:', urls[profile]);
        trackProfileSelection(profile);
        setTimeout(function() {
          window.location.href = urls[profile];
        }, 300);
      }
      } else {
        console.log('  → Slide latérale, goToSlide(' + clickedSlideIndex + ')');
        if (!isAnimating) {
          goToSlide(clickedSlideIndex);
        }
      }
    }
  });
} else {
  console.error('❌ Impossible d\'ajouter les event listeners, container manquant');
}

/**
 * AUTRES CONTRÔLES
 */
container.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY > 0) nextSlide();
  else prevSlide();
}, { passive: false });

// Swipe tactile
let touchStartX = 0;
let touchEndX = 0;

container.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

container.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  const swipeDistance = touchStartX - touchEndX;
  const minSwipeDistance = 50;
  
  if (Math.abs(swipeDistance) < minSwipeDistance) return;
  if (swipeDistance > 0) nextSlide();
  else prevSlide();
}, { passive: true });

// Clavier
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextSlide();
  }
});

// Boutons
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

/**
 * CURSEUR PERSONNALISÉ
 */
document.addEventListener('mousemove', (e) => {
  cx = e.clientX;
  cy = e.clientY;
  if (cur) {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
  }
});

// Animation smooth du curseur
(function animateCursor() {
  if (ring) {
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    ring.style.left = (rx - 16) + 'px';
    ring.style.top = (ry - 16) + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

// Hover effects sur slides et boutons
document.addEventListener('mouseover', (e) => {
  const isSlide = e.target.closest('.coverflow-slide');
  const isBtn = e.target.closest('.coverflow-arrow');
  if (isSlide || isBtn) {
    if (ring) gsap.to(ring, { width: '50px', height: '50px', opacity: 0.55, duration: 0.3 });
    if (cur) gsap.to(cur, { opacity: 0, duration: 0.3 });
  }
});

document.addEventListener('mouseout', (e) => {
  const isSlide = e.target.closest('.coverflow-slide');
  const isBtn = e.target.closest('.coverflow-arrow');
  if (isSlide || isBtn) {
    if (ring) gsap.to(ring, { width: '32px', height: '32px', opacity: 0.3, duration: 0.3 });
    if (cur) gsap.to(cur, { opacity: 1, duration: 0.3 });
  }
});

/**
 * ANIMATION DE DÉMARRAGE
 */
function playInitAnimation() {
  if (hasPlayedInitAnimation) return;
  hasPlayedInitAnimation = true;

  console.log('=== ANIMATION DÉMARRAGE ===');
  const sequence = [2, 0];
  let step = 0;

  function nextStep() {
    if (step < sequence.length) {
      console.log('Animation step', step, '→ index', sequence[step]);
      isAnimating = true;
      currentIndex = sequence[step];
      updateCoverflow();
      step++;
      
      setTimeout(() => {
        isAnimating = false;
      }, 800);
      
      if (step < sequence.length) {
        setTimeout(nextStep, 1200);
      }
    }
  }

  setTimeout(nextStep, 800);
}

/**
 * INITIALISATION
 */
function init() {
  console.log('=== INIT ===');
  currentIndex = 0;
  updateCoverflow();
  playInitAnimation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
