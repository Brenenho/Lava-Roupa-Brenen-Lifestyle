/* ============================================================
   LAVAR ROUPA — Enhanced Guide Interactivity
   ============================================================ */

// ── Scroll-triggered entrance animations ───────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.step-item').forEach((el, i) => {
    el.dataset.delay = i * 70;
    observer.observe(el);
  });
}

// ── Progress system ─────────────────────────────────────────

function getPageKey() {
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function getStepKey(stepId) {
  return `lavar__${getPageKey()}__${stepId}`;
}

function updateProgress() {
  const steps    = document.querySelectorAll('.step-item');
  const total    = steps.length;
  const done     = document.querySelectorAll('.step-item.completed').length;
  const pct      = total ? Math.round((done / total) * 100) : 0;

  const fill      = document.getElementById('progressFill');
  const pctEl     = document.getElementById('progressPct');
  const stepsEl   = document.getElementById('progressSteps');
  const banner    = document.getElementById('completionBanner');

  if (fill)    fill.style.width = `${pct}%`;
  if (pctEl)   pctEl.textContent = `${pct}%`;
  if (stepsEl) stepsEl.textContent = `${done} de ${total}`;

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

// ── Step expand/collapse ────────────────────────────────────

function toggleExpand(step) {
  const wasOpen = step.classList.contains('expanded');
  // Close all
  document.querySelectorAll('.step-item.expanded').forEach(s => s.classList.remove('expanded'));
  if (!wasOpen) {
    step.classList.add('expanded');
    if (window.innerWidth < 640) {
      setTimeout(() => step.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }
}

// ── Mark as done ────────────────────────────────────────────

const CHECK_SVG   = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const CIRCLE_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
const UNDO_SVG    = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5.1"/></svg>`;

function markDone(step, done, animate = true) {
  if (done) {
    step.classList.add('completed');
    step.classList.remove('expanded');

    const btn = step.querySelector('.done-btn');
    if (btn) btn.innerHTML = `${CHECK_SVG} Feito! (desfazer)`;

    // Animate check icon
    if (animate) {
      const icon = step.querySelector('.step-completed-icon');
      if (icon) {
        icon.style.animation = 'none';
        void icon.offsetWidth;
        icon.style.animation = 'checkBounce 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    }

    // Auto-open next step
    if (animate) {
      const all  = [...document.querySelectorAll('.step-item')];
      const idx  = all.indexOf(step);
      const next = all.slice(idx + 1).find(s => !s.classList.contains('completed'));
      if (next) setTimeout(() => toggleExpand(next), 350);
    }
  } else {
    step.classList.remove('completed');
    const btn = step.querySelector('.done-btn');
    if (btn) btn.innerHTML = `${CIRCLE_SVG} Marcar como feito`;
  }

  // Persist
  const id = step.dataset.stepId;
  if (id) {
    done
      ? localStorage.setItem(getStepKey(id), '1')
      : localStorage.removeItem(getStepKey(id));
  }

  updateProgress();
}

// ── Init all steps ──────────────────────────────────────────

function initSteps() {
  const steps = document.querySelectorAll('.step-item');

  steps.forEach(step => {
    const header  = step.querySelector('.step-header');
    const doneBtn = step.querySelector('.done-btn');
    const stepId  = step.dataset.stepId;

    // Click to expand
    if (header) {
      header.addEventListener('click', e => {
        if (e.target.closest('.done-btn')) return;
        if (step.classList.contains('completed')) return;
        toggleExpand(step);
      });
    }

    // Mark done button
    if (doneBtn) {
      doneBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isDone = step.classList.contains('completed');
        markDone(step, !isDone);
      });
    }

    // Restore from localStorage
    if (stepId && localStorage.getItem(getStepKey(stepId)) === '1') {
      markDone(step, true, false);
    }
  });

  // Open first uncompleted
  const first = [...steps].find(s => !s.classList.contains('completed'));
  if (first) toggleExpand(first);

  updateProgress();
}

// ── Reset button ────────────────────────────────────────────

function initReset() {
  const btn = document.getElementById('resetBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Reiniciar o progresso desta página?')) return;
    document.querySelectorAll('.step-item').forEach(step => {
      markDone(step, false, false);
      step.classList.remove('expanded');
      const id = step.dataset.stepId;
      if (id) localStorage.removeItem(getStepKey(id));
    });
    const first = document.querySelector('.step-item');
    if (first) toggleExpand(first);
    updateProgress();
  });
}

// ── Floating particles on complete ─────────────────────────

function launchConfetti() {
  const container = document.getElementById('completionBanner');
  if (!container) return;
  const colors = ['#22C55E','#D97706','#3B82F6','#EC4899','#F59E0B','#10B981'];
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('span');
    dot.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      animation: confettiFly ${0.8 + Math.random() * 1.2}s ease-out ${Math.random() * 0.5}s forwards;
    `;
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 2000);
  }
}

// Inject confetti keyframe
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFly {
    0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
    100% { opacity: 0; transform: translateY(-120px) rotate(720deg) scale(0); }
  }
  @keyframes checkBounce {
    0%   { transform: scale(0); }
    60%  { transform: scale(1.4); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(confettiStyle);

// ── Guide nav strip ─────────────────────────────────────────

function initGuideNav() {
  const links = document.querySelectorAll('.guide-nav-link');
  const current = window.location.pathname.split('/').pop();
  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
}

// ── Boot ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSteps();
  initReset();
  initGuideNav();

  // Launch confetti when banner becomes visible
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('visible')) launchConfetti();
    });
  });
  const banner = document.getElementById('completionBanner');
  if (banner) observer.observe(banner, { attributes: true, attributeFilter: ['class'] });
});
