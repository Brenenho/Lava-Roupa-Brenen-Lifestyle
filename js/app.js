/* ============================================================
   LAVANTECH — Homepage JS
   ============================================================ */

// ── Calculator Data ──────────────────────────────────────────
// Amounts based on real guide content.
// Sizes: 'half' = ~½ máquina | 'full' = máquina cheia

const CALC_DATA = {
  brancas: {
    label: 'Roupas Brancas',
    emoji: '🤍',
    temp: '40°C · pré-molho a 60°C',
    tempClass: 'temp-warm',
    tip: 'Faça sempre o pré-molho com percarbonato e água quente (60°C) antes de colocar na máquina — o oxigênio ativo age muito melhor em água quente.',
    half: [
      { emoji: '✨', name: 'Percarbonato', amount: '1 scoop', note: 'pré-molho ou compartimento pré-lavagem' },
      { emoji: '🧴', name: 'Sabão p/ Brancas', amount: '½ tampinha', note: 'sabão líquido branco (Comfort, Omo Branco)' },
      { emoji: '🧻', name: 'Lencinho Branqueador', amount: '1 lencinho', note: 'direto no tambor — opcional' },
    ],
    full: [
      { emoji: '✨', name: 'Percarbonato', amount: '2 scoops', note: 'pré-molho ou compartimento pré-lavagem' },
      { emoji: '🧴', name: 'Sabão p/ Brancas', amount: '1 tampinha', note: 'sabão líquido branco (Comfort, Omo Branco)' },
      { emoji: '🧻', name: 'Lencinho Branqueador', amount: '1–2 lencinhos', note: 'direto no tambor da máquina' },
    ],
  },
  pretas: {
    label: 'Roupas Pretas',
    emoji: '🖤',
    temp: '20°C — água fria sempre',
    tempClass: 'temp-cold',
    tip: 'Água quente abre as fibras do tecido e libera o pigmento preto. Frio mantém a trama fechada e a cor no lugar por muito mais tempo.',
    half: [
      { emoji: '🧴', name: 'Sabão p/ Pretas', amount: '½ tampinha', note: 'Omom, Comfort Dark ou Persil Black' },
      { emoji: '🧻', name: 'Lencinho Tingidor', amount: '1 lencinho', note: 'direto no tambor — re-tinge o tecido' },
      { emoji: '⚠️', name: 'Amaciante', amount: 'NUNCA', note: 'remove o pigmento preto das fibras' },
    ],
    full: [
      { emoji: '🧴', name: 'Sabão p/ Pretas', amount: '1 tampinha', note: 'Omom, Comfort Dark ou Persil Black' },
      { emoji: '🧻', name: 'Lencinho Tingidor', amount: '1–3 lencinhos', note: '3 lencinhos para roupa muito desbotada' },
      { emoji: '⚠️', name: 'Amaciante', amount: 'NUNCA', note: 'remove o pigmento preto das fibras' },
    ],
  },
  coloridas: {
    label: 'Roupas Coloridas',
    emoji: '🌈',
    temp: 'Claras: 40°C · Escuras: 20°C',
    tempClass: 'temp-warm',
    tip: 'Tons escuros tratam-se como roupas pretas (sabão específico, 20°C). Tons claros tratam-se como brancas (percarbonato, 40°C). Sempre vire a roupa ao avesso.',
    half: [
      { emoji: '🧴', name: 'Sabão Cores Vivas', amount: '½ tampinha', note: 'conforme o rótulo do produto' },
      { emoji: '🌿', name: 'Pinho Sol / Lisoforme', amount: '½ tampinha', note: 'cheiro marcante e desinfecção' },
    ],
    full: [
      { emoji: '🧴', name: 'Sabão Cores Vivas', amount: '1 tampinha', note: 'conforme o rótulo do produto' },
      { emoji: '🌿', name: 'Pinho Sol / Lisoforme', amount: '1 tampinha', note: 'cheiro marcante e desinfecção' },
    ],
  },
  toalhas: {
    label: 'Toalhas',
    emoji: '🛁',
    temp: '40–60°C',
    tempClass: 'temp-hot',
    tip: 'Vinagre de álcool no lugar do amaciante amacia as fibras SEM deixar resíduo. Amaciante cria uma camada que endurece a toalha e causa cheiro de mofo ao longo do tempo.',
    half: [
      { emoji: '🧴', name: 'Sabão Neutro', amount: '1 tampinha', note: 'conforme o rótulo do produto' },
      { emoji: '🍶', name: 'Vinagre de Álcool', amount: '1 copo americano', note: '~200ml no compartimento do amaciante' },
      { emoji: '🌿', name: 'Pinho Sol / Lisoforme', amount: '½ tampinha', note: 'elimina bactérias que causam mau cheiro' },
    ],
    full: [
      { emoji: '🧴', name: 'Sabão Neutro', amount: '2 tampinhas', note: 'conforme o rótulo do produto' },
      { emoji: '🍶', name: 'Vinagre de Álcool', amount: '1 copo americano', note: '~200ml no compartimento do amaciante' },
      { emoji: '🌿', name: 'Pinho Sol / Lisoforme', amount: '1 tampinha', note: 'elimina bactérias que causam mau cheiro' },
    ],
  },
  cama: {
    label: 'Roupas de Cama',
    emoji: '🛏️',
    temp: '40–60°C',
    tempClass: 'temp-warm',
    tip: 'Lave lençóis e fronhas separados dos edredons e cobertores — juntos, a máquina não consegue agitar bem nenhum dos dois.',
    half: [
      { emoji: '🧴', name: 'Sabão Neutro', amount: '1 tampinha', note: 'conforme o rótulo do produto' },
      { emoji: '✨', name: 'Percarbonato', amount: '1 scoop', note: 'para lençóis brancos ou cores claras' },
    ],
    full: [
      { emoji: '🧴', name: 'Sabão Neutro', amount: '2 tampinhas', note: 'conforme o rótulo do produto' },
      { emoji: '✨', name: 'Percarbonato', amount: '2 scoops', note: 'para lençóis brancos ou cores claras' },
    ],
  },
  edredom: {
    label: 'Edredom & Cobertores',
    emoji: '🌸',
    temp: '30°C — ou temperatura da etiqueta',
    tempClass: 'temp-cold',
    tip: 'Nunca exceda a dose de sabão — o excesso fica preso no enchimento, não sai no enxágue e vira criadouro de bactérias.',
    half: [
      { emoji: '🧴', name: 'Sabão Delicados', amount: 'conforme rótulo', note: 'dose indicada na embalagem do produto' },
      { emoji: '⚠️', name: 'Amaciante', amount: 'NUNCA', note: 'gruda nas fibras do enchimento e reduz a maciez' },
    ],
    full: [
      { emoji: '🧴', name: 'Sabão Delicados', amount: 'conforme rótulo', note: 'dose indicada na embalagem do produto' },
      { emoji: '⚠️', name: 'Amaciante', amount: 'NUNCA', note: 'gruda nas fibras do enchimento e reduz a maciez' },
    ],
  },
};

// ── Full Calculator ───────────────────────────────────────────

let calcCategory = 'brancas';
let calcLoad = 'half';

function renderCalcResults() {
  const data     = CALC_DATA[calcCategory];
  const products = data[calcLoad];
  const resultsEl= document.getElementById('calcResults');
  const tempEl   = document.getElementById('calcTemp');
  const tipTextEl= document.getElementById('calcTipText');

  if (!resultsEl || !data) return;

  if (tempEl) {
    tempEl.textContent  = data.temp;
    tempEl.className = `calc-temp-badge ${data.tempClass || ''}`;
  }
  if (tipTextEl) tipTextEl.textContent = data.tip;

  resultsEl.innerHTML = products.map(p => {
    const isNever = p.amount === 'NUNCA';
    return `
      <div class="calc-product-card${isNever ? ' calc-product-never' : ''}">
        <span class="calc-product-emoji">${p.emoji}</span>
        <span class="calc-product-amount">${p.amount}</span>
        <span class="calc-product-name">${p.name}</span>
        <span class="calc-product-note">${p.note}</span>
      </div>`;
  }).join('');
}

function initFullCalculator() {
  const tabsEl     = document.getElementById('calcTabs');
  const loadToggle = document.getElementById('calcLoadToggle');

  if (!tabsEl) return;

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.calc-tab');
    if (!tab) return;

    tabsEl.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    calcCategory = tab.dataset.category;
    renderCalcResults();
  });

  if (loadToggle) {
    loadToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.load-btn');
      if (!btn) return;

      loadToggle.querySelectorAll('.load-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcLoad = btn.dataset.load;
      renderCalcResults();
    });
  }

  renderCalcResults();
}

// ── Card entrance animation ───────────────────────────────────

function animateCards() {
  const cards = document.querySelectorAll('.guide-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = parseInt(card.dataset.delay || 0);
        setTimeout(() => card.classList.add('visible'), delay);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((card, i) => {
    card.dataset.delay = i * 70;
    observer.observe(card);
  });
}

// ── Scroll reveal ─────────────────────────────────────────────

function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ── Bubble float animation ────────────────────────────────────

function spawnBubbles() {
  const container = document.getElementById('heroBubbles');
  if (!container) return;

  const colors = ['#C95272', '#F2A8BC', '#E8854A', '#9B8ECF', '#6B9E83'];
  const count  = 18;

  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'hero-bubble';
    const size  = 10 + Math.random() * 50;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const delay = Math.random() * 12;
    const dur   = 8 + Math.random() * 10;

    Object.assign(b.style, {
      width:           `${size}px`,
      height:          `${size}px`,
      left:            `${left}%`,
      background:      color,
      animationDuration:`${dur}s`,
      animationDelay:  `${delay}s`,
      opacity:         (0.04 + Math.random() * 0.08).toFixed(2),
    });

    container.appendChild(b);
  }
}

// ── Init ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  spawnBubbles();
  animateCards();
  initScrollReveal();
  initFullCalculator();
});
