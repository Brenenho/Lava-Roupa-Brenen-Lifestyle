/* ============================================================
   LAVANTECH — Guide Interactivity
   💖 Kawaii Heart Journey Progression 💖
   SVG heart dots · Cloud cards · Professional animations
   ============================================================ */

// ── SVG Heart Definitions ───────────────────────────────────
// Inject SVG defs (gradients) into the page once
function injectSVGDefs() {
  if (document.getElementById('heartSvgDefs')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'heartSvgDefs';
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="heartGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF2D9F"/>
        <stop offset="50%" stop-color="#FF69B4"/>
        <stop offset="100%" stop-color="#7C3AFF"/>
      </linearGradient>
      <linearGradient id="heartGradDone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C9A7"/>
        <stop offset="50%" stop-color="#34D399"/>
        <stop offset="100%" stop-color="#00A87E"/>
      </linearGradient>
    </defs>
  `;
  document.body.prepend(svg);
}

// Create an SVG heart element
function createHeartSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('heart-bg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
  svg.appendChild(path);
  return svg;
}

// Create winding SVG connector
function createConnectorSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 26 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M1 8 C6 3, 10 13, 13 8 C16 3, 20 13, 25 8');
  svg.appendChild(path);
  return svg;
}

// ── Progress system ─────────────────────────────────────────

function getPageKey() {
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function getStepKey(stepId) {
  return `lavar__${getPageKey()}__${stepId}`;
}

function updateProgress() {
  const steps = document.querySelectorAll('.step-item');
  const total = steps.length;
  const done  = document.querySelectorAll('.step-item.completed').length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  const fill    = document.getElementById('progressFill');
  const pctEl   = document.getElementById('progressPct');
  const stepsEl = document.getElementById('progressSteps');
  const banner  = document.getElementById('completionBanner');

  if (fill)    fill.style.width = `${pct}%`;
  if (pctEl)   pctEl.textContent = `${pct}%`;
  if (stepsEl) stepsEl.textContent = `${done} de ${total}`;

  updateRoadmapDots();

  if (banner) {
    if (done === total && total > 0) {
      if (!banner.classList.contains('visible')) {
        banner.classList.add('visible');
        setTimeout(() => banner.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
      }
    } else {
      banner.classList.remove('visible');
    }
  }
}

// ── Carousel state ──────────────────────────────────────────

let currentStepIndex = 0;

function getAllSteps() {
  return [...document.querySelectorAll('.step-item')];
}

function showStep(index, direction = 'next') {
  const steps = getAllSteps();
  if (index < 0 || index >= steps.length) return;
  if (index === currentStepIndex && steps[index].classList.contains('active-card')) return;

  const prevIndex = currentStepIndex;

  if (prevIndex !== index) {
    const prev = steps[prevIndex];
    prev.classList.remove('active-card', 'active-card-prev');
    prev.classList.add('exiting');
    setTimeout(() => {
      prev.classList.remove('exiting');
      prev.style.display = 'none';
    }, 380);
  }

  steps.forEach((s, i) => {
    if (i !== index && i !== prevIndex) {
      s.classList.remove('active-card', 'active-card-prev', 'exiting');
      s.style.display = 'none';
    }
  });

  const target = steps[index];
  target.style.display = '';
  target.classList.remove('exiting');

  if (direction === 'prev') {
    target.classList.remove('active-card');
    target.classList.add('active-card-prev');
  } else {
    target.classList.remove('active-card-prev');
    target.classList.add('active-card');
  }

  currentStepIndex = index;
  updateNavButtons();
  updateRoadmapDots();
  updateNavCounter();
  spawnDotSparkle(index);
}

function nextStep() {
  const steps = getAllSteps();
  if (currentStepIndex < steps.length - 1) {
    showStep(currentStepIndex + 1, 'next');
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    showStep(currentStepIndex - 1, 'prev');
  }
}

function updateNavButtons() {
  const steps = getAllSteps();
  const prevBtn = document.getElementById('stepPrevBtn');
  const nextBtn = document.getElementById('stepNextBtn');
  if (prevBtn) prevBtn.disabled = currentStepIndex === 0;
  if (nextBtn) nextBtn.disabled = currentStepIndex === steps.length - 1;
}

function updateNavCounter() {
  const steps = getAllSteps();
  const counter = document.getElementById('stepNavCounter');
  if (counter) counter.textContent = `${currentStepIndex + 1} / ${steps.length}`;
}

// ── Sparkle effect ──────────────────────────────────────────

function spawnDotSparkle(index) {
  const dot = document.querySelectorAll('.step-dot')[index];
  if (!dot) return;
  const sparkles = ['✦', '💖', '✨', '♡', '⭐'];
  for (let i = 0; i < 3; i++) {
    const spark = document.createElement('span');
    spark.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    spark.style.cssText = `
      position: absolute;
      font-size: ${7 + Math.random() * 7}px;
      left: ${8 + Math.random() * 28}px;
      top: ${Math.random() * 18}px;
      pointer-events: none;
      z-index: 10;
      animation: miniHeartRise ${0.7 + Math.random() * 0.6}s ease-out forwards;
    `;
    dot.appendChild(spark);
    setTimeout(() => spark.remove(), 1400);
  }
}

// ── Build Roadmap — SVG Hearts ──────────────────────────────

function buildRoadmap() {
  const steps = getAllSteps();
  const container = document.querySelector('.steps-list');
  if (!container || steps.length === 0) return;

  // Inject SVG gradient defs
  injectSVGDefs();

  const roadmap = document.createElement('div');
  roadmap.className = 'step-roadmap';
  roadmap.id = 'stepRoadmap';

  // Floating mini hearts decoration
  const heartEmojis = ['💗', '💖', '♡', '✨', '💕'];
  for (let h = 0; h < 5; h++) {
    const fh = document.createElement('span');
    fh.className = 'roadmap-float-heart';
    fh.textContent = heartEmojis[h % heartEmojis.length];
    fh.style.cssText = `
      left: ${10 + Math.random() * 80}%;
      top: ${5 + Math.random() * 70}%;
      animation-delay: ${h * 0.7}s;
      animation-duration: ${2.5 + Math.random() * 2}s;
    `;
    roadmap.appendChild(fh);
  }

  // Build dots
  steps.forEach((step, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'step-dot-wrap';

    const dot = document.createElement('button');
    dot.className = 'step-dot';
    dot.dataset.index = i;
    dot.appendChild(createHeartSVG());
    const numSpan = document.createElement('span');
    numSpan.textContent = i + 1;
    dot.appendChild(numSpan);
    dot.title = step.querySelector('.step-title')?.textContent || `Passo ${i + 1}`;
    dot.setAttribute('aria-label', dot.title);

    dot.addEventListener('click', () => {
      const dir = i > currentStepIndex ? 'next' : 'prev';
      showStep(i, dir);
    });

    wrap.appendChild(dot);

    // Winding SVG connector
    if (i < steps.length - 1) {
      const connector = document.createElement('div');
      connector.className = 'step-dot-connector';
      connector.dataset.index = i;
      connector.appendChild(createConnectorSVG());
      wrap.appendChild(connector);
    }

    roadmap.appendChild(wrap);
  });

  container.parentNode.insertBefore(roadmap, container);
}

function updateRoadmapDots() {
  const steps = getAllSteps();
  const dots = document.querySelectorAll('.step-dot');
  const connectors = document.querySelectorAll('.step-dot-connector');

  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i === currentStepIndex) {
      dot.classList.add('active');
    } else if (steps[i]?.classList.contains('completed')) {
      dot.classList.add('completed');
    }
  });

  connectors.forEach((conn, i) => {
    if (steps[i]?.classList.contains('completed')) {
      conn.classList.add('completed');
    } else {
      conn.classList.remove('completed');
    }
  });
}

// ── Build Navigation ────────────────────────────────────────

function buildNavigation() {
  const container = document.querySelector('.steps-list');
  if (!container) return;

  const nav = document.createElement('div');
  nav.className = 'step-nav';
  nav.innerHTML = `
    <button class="step-nav-btn prev" id="stepPrevBtn" aria-label="Passo anterior">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      Anterior
    </button>
    <span class="step-nav-counter" id="stepNavCounter">1 / 8</span>
    <button class="step-nav-btn next" id="stepNextBtn" aria-label="Próximo passo">
      Próximo
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `;

  container.parentNode.insertBefore(nav, container.nextSibling);
  document.getElementById('stepPrevBtn').addEventListener('click', prevStep);
  document.getElementById('stepNextBtn').addEventListener('click', nextStep);
}

// ── Transform Steps for Carousel ────────────────────────────

function transformStepsForCarousel() {
  const steps = getAllSteps();

  steps.forEach((step, i) => {
    const header = step.querySelector('.step-header');
    const body = step.querySelector('.step-body');
    if (!header || !body) return;

    const numberEl = step.querySelector('.step-number');
    const completedIcon = step.querySelector('.step-completed-icon');
    const titleEl = step.querySelector('.step-title');
    const subtitleEl = step.querySelector('.step-subtitle');

    // Build new card hero
    const cardHero = document.createElement('div');
    cardHero.className = 'step-card-hero';

    if (numberEl) cardHero.appendChild(numberEl);
    if (completedIcon) cardHero.appendChild(completedIcon);

    const textDiv = document.createElement('div');
    textDiv.className = 'step-text';
    if (titleEl) textDiv.appendChild(titleEl);
    if (subtitleEl) textDiv.appendChild(subtitleEl);
    cardHero.appendChild(textDiv);

    step.insertBefore(cardHero, body);

    // Add 16 cloud puffs to completely surround the item for a full cloud shape
    for (let p = 1; p <= 16; p++) {
      const puff = document.createElement('div');
      puff.className = `cloud-puff cloud-puff-${p}`;
      step.appendChild(puff);
    }

    body.style.display = 'block';
    step.style.display = 'none';
    step.classList.remove('expanded');
  });
}

// ── Mark as Done ────────────────────────────────────────────

const CHECK_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CIRCLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;

function markDone(step, done, animate = true) {
  if (done) {
    step.classList.add('completed');
    const btn = step.querySelector('.done-btn');
    if (btn) btn.innerHTML = `${CHECK_SVG} Feito! 💖`;

    if (animate) {
      const icon = step.querySelector('.step-completed-icon');
      if (icon) {
        icon.style.animation = 'none';
        void icon.offsetWidth;
        icon.style.animation = 'completePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
      spawnCelebrationHearts(step);
      const steps = getAllSteps();
      const idx = steps.indexOf(step);
      if (idx < steps.length - 1) {
        setTimeout(() => showStep(idx + 1, 'next'), 600);
      }
    }
  } else {
    step.classList.remove('completed');
    const btn = step.querySelector('.done-btn');
    if (btn) btn.innerHTML = `${CIRCLE_SVG} Marcar como feito`;
  }

  const id = step.dataset.stepId;
  if (id) {
    done
      ? localStorage.setItem(getStepKey(id), '1')
      : localStorage.removeItem(getStepKey(id));
  }

  updateProgress();
}

function spawnCelebrationHearts(step) {
  const hearts = ['💖', '💗', '💕', '✨', '🌸', '♡', '💜'];
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('span');
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.cssText = `
      position: absolute;
      font-size: ${11 + Math.random() * 14}px;
      left: ${15 + Math.random() * 70}%;
      top: ${10 + Math.random() * 60}%;
      pointer-events: none;
      z-index: 20;
      opacity: 0;
      animation: miniHeartRise ${0.8 + Math.random() * 0.8}s ease-out ${Math.random() * 0.3}s forwards;
    `;
    step.appendChild(h);
    setTimeout(() => h.remove(), 1800);
  }
}

// ── Legacy toggleExpand ─────────────────────────────────────

function toggleExpand(step) {
  const steps = getAllSteps();
  const idx = steps.indexOf(step);
  if (idx >= 0) showStep(idx);
}

// ── Init ────────────────────────────────────────────────────

function initSteps() {
  const steps = getAllSteps();
  if (steps.length === 0) return;

  transformStepsForCarousel();
  buildRoadmap();
  buildNavigation();

  steps.forEach(step => {
    const stepId = step.dataset.stepId;
    if (stepId && localStorage.getItem(getStepKey(stepId)) === '1') {
      markDone(step, true, false);
    }
  });

  const firstUncompleted = steps.findIndex(s => !s.classList.contains('completed'));
  const startIndex = firstUncompleted >= 0 ? firstUncompleted : 0;
  showStep(startIndex, 'next');
  updateProgress();
}

window.markStepDone = function(btn) {
  const step = btn.closest('.step-item');
  if (step) {
    const isDone = step.classList.contains('completed');
    markDone(step, !isDone);
  }
};

function initReset() {
  const btn = document.getElementById('resetBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Reiniciar o progresso desta página?')) return;
    getAllSteps().forEach(step => {
      markDone(step, false, false);
      const id = step.dataset.stepId;
      if (id) localStorage.removeItem(getStepKey(id));
    });
    showStep(0, 'next');
    updateProgress();
  });
}

// ── Confetti ────────────────────────────────────────────────

function launchConfetti() {
  const container = document.getElementById('completionBanner');
  if (!container) return;
  const hearts = ['💖','💗','💕','💜','🩷','🌸','✨','⭐','♡'];
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('span');
    dot.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    dot.style.cssText = `
      position: absolute;
      font-size: ${10 + Math.random() * 16}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      animation: confettiBurst ${0.8 + Math.random() * 1.2}s ease-out ${Math.random() * 0.5}s forwards;
    `;
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 2500);
  }
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiBurst {
    0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
    100% { opacity: 0; transform: translateY(-120px) rotate(720deg) scale(0); }
  }
`;
document.head.appendChild(confettiStyle);

// ── Guide Nav ───────────────────────────────────────────────

function initGuideNav() {
  const links = document.querySelectorAll('.guide-nav-link');
  const current = window.location.pathname.split('/').pop();
  links.forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
}

// ── Keyboard + Touch Nav ────────────────────────────────────

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextStep(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevStep(); }
  });
}

function initTouchSwipe() {
  let startX = 0;
  const el = document.querySelector('.steps-section');
  if (!el) return;
  el.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 60) { diff > 0 ? nextStep() : prevStep(); }
  }, { passive: true });
}

// ── Boot ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initSteps();
  initReset();
  initGuideNav();
  initKeyboardNav();
  initTouchSwipe();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('visible')) launchConfetti();
    });
  });
  const banner = document.getElementById('completionBanner');
  if (banner) observer.observe(banner, { attributes: true, attributeFilter: ['class'] });
});
