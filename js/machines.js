/* ============================================================
   LAVANTECH — Machine Selector & Adapter
   Suporte para Electrolux LAC09 & LES09
   ============================================================ */

// ── Base de dados de máquinas ─────────────────────────────────

const MACHINES = {
  LAC09: {
    id: 'LAC09',
    name: 'Electrolux LAC09',
    type: 'Top Load · Água Fria',
    features: {
      coldWaterOnly: true,
      hasDispenser:  true,   // dispenser de sabão líquido
      noPrewash:     true,   // sem compartimento pré-lavagem
    },
    cycles: [
      { id: 'rapido',     name: 'Rápido',           duration: 19,  guides: [] },
      { id: 'coloridas',  name: 'Coloridas',         duration: 42,  guides: ['coloridas'] },
      { id: 'escuras',    name: 'Escuras',           duration: 46,  guides: ['pretas'] },
      { id: 'delicado',   name: 'Delicado',          duration: 50,  guides: [] },
      { id: 'normal',     name: 'Normal',            duration: 62,  guides: [] },
      { id: 'edredom',    name: 'Edredom',           duration: 73,  guides: ['edredom'] },
      { id: 'cama-banho', name: 'Cama & Banho',      duration: 78,  guides: ['cama', 'toalha'] },
      { id: 'manchas',    name: 'Tira Manchas',      duration: 78,  guides: ['percarbonato'] },
      { id: 'limpeza',    name: 'Limpeza de Cesto',  duration: 85,  guides: [] },
      { id: 'brancas',    name: 'Brancas',           duration: 107, guides: ['brancas'] },
      { id: 'tenis',      name: 'Tênis',             duration: 112, guides: [] },
      { id: 'pesado',     name: 'Pesado / Jeans',    duration: 117, guides: [] },
    ],
  },
  LES09: {
    id: 'LES09',
    name: 'Electrolux LES09',
    type: 'Top Load · Água Fria',
    features: {
      coldWaterOnly: true,
      hasDispenser:  false,  // sem dispenser
      noPrewash:     true,
    },
    cycles: [
      { id: 'pesado',   name: 'Pesado / Jeans',          duration: 115, guides: ['percarbonato', 'edredom', 'cama'] },
      { id: 'rapido',   name: 'Rápido',                  duration: 19,  guides: [] },
      { id: 'brancas',  name: 'Brancas',                 duration: 105, guides: ['brancas'] },
      { id: 'normal',   name: 'Normal',                  duration: 65,  guides: ['toalha'] },
      { id: 'delicado', name: 'Delicado / Esporte',      duration: 45,  guides: [] },
      { id: 'enxague',  name: 'Enxágue / Centrifugação', duration: 15,  guides: [] },
      { id: 'escuras',  name: 'Escuras / Coloridas',     duration: 55,  guides: ['pretas', 'coloridas'] },
    ],
  },
};

// ── Ciclo pré-selecionado por página ─────────────────────────

const PAGE_PREFERRED_CYCLE = {
  brancas:      { LAC09: 'brancas',    LES09: 'brancas'    },
  pretas:       { LAC09: 'escuras',    LES09: 'escuras'    },
  coloridas:    { LAC09: 'coloridas',  LES09: 'escuras'    },
  percarbonato: { LAC09: 'manchas',    LES09: 'pesado'     },
  toalha:       { LAC09: 'cama-banho', LES09: 'normal'     },
  cama:         { LAC09: 'cama-banho', LES09: 'pesado'     },
  edredom:      { LAC09: 'edredom',    LES09: 'pesado'     },
  utensilios:   { LAC09: 'normal',     LES09: 'normal'     },
};

const STORAGE_KEY = 'lt__machine';

// ── Estado ───────────────────────────────────────────────────

let selectedMachineId = null;
let timerSeconds      = 0;
let timerInterval     = null;
let timerRunning      = false;

// ── Utils ────────────────────────────────────────────────────

function getPageId() {
  return location.pathname.split('/').pop().replace('.html', '') || 'index';
}

function saveMachine(id) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
}

function loadMachine() {
  try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
}

function formatTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

function $id(id) { return document.getElementById(id); }

// ── Widget HTML ──────────────────────────────────────────────

function buildWidgetHTML() {
  return `
<div class="mw-widget" id="mwWidget" role="complementary" aria-label="Seletor de máquina">
  <div class="mw-header">
    <div class="mw-header-glyph" aria-hidden="true">🧺</div>
    <div class="mw-header-text">
      <div class="mw-header-title">Qual é a sua máquina?</div>
      <div class="mw-header-sub">O guia adapta-se automaticamente às suas instruções</div>
    </div>
  </div>

  <div class="mw-picker" id="mwPicker" role="group" aria-label="Selecionar máquina">
    <button class="mw-machine-btn" data-machine="LAC09" aria-pressed="false">
      <span class="mw-machine-model">LAC09</span>
      <span class="mw-machine-feat">Com dispenser líquido</span>
    </button>
    <button class="mw-machine-btn" data-machine="LES09" aria-pressed="false">
      <span class="mw-machine-model">LES09</span>
      <span class="mw-machine-feat">Sem dispenser</span>
    </button>
  </div>

  <div class="mw-panel" id="mwPanel" hidden>

    <div class="mw-cycle-row">
      <div class="mw-cycle-field">
        <label class="mw-cycle-label" for="mwCycleSelect">✨ Ciclo ideal para este guia</label>
        <select class="mw-cycle-select" id="mwCycleSelect" aria-label="Selecionar ciclo da máquina"></select>
      </div>
      <div class="mw-duration-pill" id="mwDurationPill">
        <span class="mw-duration-num" id="mwDurationNum">—</span>
        <span class="mw-duration-unit">min</span>
      </div>
    </div>

    <div class="mw-timer-card" id="mwTimerCard">
      <div class="mw-timer-display" id="mwTimerDisplay" aria-live="off" aria-label="Cronómetro">
        <span class="mw-timer-digits" id="mwTimerDigits">00:00:00</span>
      </div>
      <div class="mw-timer-controls">
        <button class="mw-timer-btn mw-btn-start" id="mwTimerStart" aria-label="Iniciar cronómetro">
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
          Iniciar
        </button>
        <button class="mw-timer-btn mw-btn-pause" id="mwTimerPause" hidden aria-label="Pausar cronómetro">
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Pausar
        </button>
        <button class="mw-timer-btn mw-btn-reset" id="mwTimerReset" aria-label="Reiniciar cronómetro">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5.1"/></svg>
          Reiniciar
        </button>
      </div>
    </div>

    <div class="mw-reuso-alert" role="note">
      <span class="mw-reuso-icon" aria-hidden="true">⚠️</span>
      <p><strong>Atenção:</strong> Se a tecla <strong>Reuso de Água</strong> estiver ativa, a máquina pausará antes de drenar o enxágue — não se assuste, é completamente normal!</p>
    </div>

  </div>
</div>`;
}

// ── Injetar Widget na Página ─────────────────────────────────

function injectWidget() {
  const anchor = document.querySelector('.progress-sticky');
  if (!anchor) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'mw-widget-outer';
  wrapper.innerHTML = buildWidgetHTML();
  anchor.insertAdjacentElement('afterend', wrapper);

  bindWidgetEvents();
}

// ── Eventos do Widget ────────────────────────────────────────

function bindWidgetEvents() {
  document.querySelectorAll('.mw-machine-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMachine(btn.dataset.machine));
  });

  $id('mwCycleSelect')?.addEventListener('change', () => {
    const machine = MACHINES[selectedMachineId];
    const cycle = machine?.cycles.find(c => c.id === $id('mwCycleSelect').value);
    if (cycle) setDuration(cycle.duration);
  });

  $id('mwTimerStart')?.addEventListener('click', startTimer);
  $id('mwTimerPause')?.addEventListener('click', pauseTimer);
  $id('mwTimerReset')?.addEventListener('click', resetTimer);
}

// ── Selecionar Máquina ───────────────────────────────────────

function selectMachine(id, animate = true) {
  const machine = MACHINES[id];
  if (!machine) return;

  selectedMachineId = id;
  saveMachine(id);

  // Atualizar botões
  document.querySelectorAll('.mw-machine-btn').forEach(btn => {
    const active = btn.dataset.machine === id;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Mostrar painel
  const panel = $id('mwPanel');
  if (panel) {
    panel.hidden = false;
    if (animate) {
      panel.classList.remove('mw-panel-enter');
      void panel.offsetWidth; // reflow
      panel.classList.add('mw-panel-enter');
    }
  }

  populateCycles(id);
  applyMachineRules(id);
}

// ── Popular Ciclos ───────────────────────────────────────────

function populateCycles(machineId) {
  const machine = MACHINES[machineId];
  const select = $id('mwCycleSelect');
  if (!machine || !select) return;

  const pageId = getPageId();
  const preferredId = PAGE_PREFERRED_CYCLE[pageId]?.[machineId];

  select.innerHTML = '';
  machine.cycles.forEach(cycle => {
    const opt = document.createElement('option');
    opt.value = cycle.id;
    const isIdeal = cycle.id === preferredId;
    opt.textContent = `${cycle.name} — ${cycle.duration} min${isIdeal ? ' ✨' : ''}`;
    if (isIdeal) opt.selected = true;
    select.appendChild(opt);
  });

  const chosen = machine.cycles.find(c => c.id === preferredId) || machine.cycles[0];
  if (chosen) {
    select.value = chosen.id;
    setDuration(chosen.duration);
  }

  resetTimer();
}

// ── Duração ──────────────────────────────────────────────────

function setDuration(minutes) {
  const numEl = $id('mwDurationNum');
  if (numEl) numEl.textContent = minutes ?? '—';
  timerSeconds = (minutes || 0) * 60;
  refreshTimerDisplay();
}

// ── Cronómetro ───────────────────────────────────────────────

function refreshTimerDisplay() {
  const el = $id('mwTimerDigits');
  if (el) el.textContent = formatTime(timerSeconds);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  const startBtn = $id('mwTimerStart');
  if (startBtn) startBtn.hidden = true;
  $id('mwTimerPause').hidden = false;

  const display = $id('mwTimerDisplay');
  display?.classList.add('running');
  display?.classList.remove('done');

  timerInterval = setInterval(() => {
    timerSeconds = Math.max(0, timerSeconds - 1);
    refreshTimerDisplay();

    if (timerSeconds <= 300 && timerSeconds > 0) {
      $id('mwTimerDisplay')?.classList.add('warn');
    }

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      onTimerDone();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;

  const startBtn = $id('mwTimerStart');
  if (startBtn) {
    startBtn.hidden = false;
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
      Continuar`;
  }
  $id('mwTimerPause').hidden = true;
  $id('mwTimerDisplay')?.classList.remove('running');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;

  // Recalcular a partir do ciclo selecionado
  const machine = MACHINES[selectedMachineId];
  const select = $id('mwCycleSelect');
  if (machine && select) {
    const cycle = machine.cycles.find(c => c.id === select.value);
    timerSeconds = (cycle?.duration || 0) * 60;
  }

  refreshTimerDisplay();

  const startBtn = $id('mwTimerStart');
  if (startBtn) {
    startBtn.hidden = false;
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>
      Iniciar`;
  }
  $id('mwTimerPause').hidden = true;

  const disp = $id('mwTimerDisplay');
  if (disp) disp.classList.remove('running', 'warn', 'done');
}

function onTimerDone() {
  const disp = $id('mwTimerDisplay');
  if (disp) {
    disp.classList.remove('running', 'warn');
    disp.classList.add('done');
  }

  const digits = $id('mwTimerDigits');
  if (digits) digits.textContent = '✓ Pronto!';

  const startBtn = $id('mwTimerStart');
  if (startBtn) {
    startBtn.hidden = false;
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5.1"/></svg>
      Reiniciar`;
  }
  $id('mwTimerPause').hidden = true;

  // Animação de celebração no widget
  const widget = $id('mwWidget');
  if (widget) {
    widget.classList.add('mw-celebrate');
    setTimeout(() => widget.classList.remove('mw-celebrate'), 2500);
  }
}

// ── Regras de Segurança por Máquina ─────────────────────────

function applyMachineRules(machineId) {
  const machine = MACHINES[machineId];
  if (!machine) return;

  // Limpar alertas anteriores
  document.querySelectorAll('.mw-injected').forEach(el => el.remove());

  // Processar steps com tags
  document.querySelectorAll('.step-item[data-machine-tags]').forEach(step => {
    const tags = step.dataset.machineTags.trim().split(/\s+/).filter(Boolean);
    const body = step.querySelector('.step-body');
    if (!body || !tags.length) return;

    const alertEl = buildAlertGroup(tags, machine);
    if (alertEl) {
      alertEl.classList.add('mw-injected');
      body.prepend(alertEl);
    }
  });
}

function buildAlertGroup(tags, machine) {
  const items = [];

  tags.forEach(tag => {
    switch (tag) {

      case 'cold-water-molho':
        items.push(
          {
            icon: '🧊', kind: 'info',
            title: `${machine.id} — só água fria: ative o percarbonato na bacia`,
            text: 'O percarbonato <strong>não dissolve em água fria</strong>. A ativação tem de ser feita 100% numa bacia com água quente — nunca diretamente na máquina.',
          },
          {
            icon: '☕', kind: 'info',
            title: 'Como aquecer a água',
            text: 'Use a torneira quente, chaleira ou panela. <strong>60°C</strong> para peças de algodão liso. <strong>Máx. 40°C</strong> para estampas plásticas ou silk.',
          },
          {
            icon: '🚫', kind: 'danger',
            title: 'ALERTA DE SEGURANÇA — nunca água quente no cesto!',
            text: 'Deitar água quente diretamente no cesto pode <strong>derreter componentes plásticos e estourar vedações</strong> da máquina. A água quente vai <em>sempre</em> na bacia.',
          },
          {
            icon: '⏳', kind: 'info',
            title: 'Deixe a água arrefecer naturalmente',
            text: 'Coloque a roupa na bacia com a mistura. A água irá arrefecer por si própria. No dia seguinte, despeje a roupa <strong>juntamente com a água já fria</strong> no cesto e inicie o ciclo.',
          }
        );
        break;

      case 'prewash':
        items.push({
          icon: '❌', kind: 'warning',
          title: `${machine.id} — sem compartimento de pré-lavagem`,
          text: `A ${machine.name} não possui pré-lavagem. Faça todo o pré-tratamento <strong>na bacia</strong> antes de colocar na máquina.`,
        });
        break;

      case 'dispenser':
        if (!machine.features.hasDispenser) {
          items.push({
            icon: '🧴', kind: 'warning',
            title: 'LES09 — sem dispenser: sabão vai no fundo do cesto',
            text: 'A LES09 não tem dispenser de sabão líquido. Coloque o sabão líquido diretamente no <strong>fundo do cesto</strong>, antes de adicionar as roupas.',
          });
        } else {
          items.push({
            icon: '⚠️', kind: 'warning',
            title: 'LAC09 — percarbonato NÃO pode ir no dispenser!',
            text: 'Em água fria, o percarbonato <strong>não dissolve e pode entupir o dispenser</strong>. Ative-o sempre na bacia com água quente. Despeje a roupa + água fria no cesto.',
          });
        }
        break;

      case 'cold-water-activation':
        items.push(
          {
            icon: '🔥', kind: 'info',
            title: `${machine.id} — ativação do percarbonato obrigatoriamente na bacia`,
            text: 'O percarbonato só ativa em água quente. Como a máquina usa apenas água fria, <strong>a ativação tem de ser feita 100% numa bacia com água quente</strong> — nunca na máquina.',
          },
          {
            icon: '🚫', kind: 'danger',
            title: 'ALERTA DE SEGURANÇA',
            text: '<strong>NUNCA</strong> deite água quente diretamente no cesto da máquina. Pode derreter componentes plásticos e estourar vedações. Use sempre a bacia.',
          },
          {
            icon: '💧', kind: 'info',
            title: 'Procedimento correto',
            text: 'Ative o percarbonato na bacia com água quente. Coloque a roupa. Deixe de molho overnight. A água arrefece naturalmente. No dia seguinte, despeje a roupa <strong>com a água já fria</strong> no cesto e inicie o ciclo.',
          }
        );
        break;

      case 'cold-water-cycle':
        items.push({
          icon: '🧊', kind: 'info',
          title: `${machine.id} — temperatura não é ajustável`,
          text: `A ${machine.name} usa apenas água fria. O pré-molho que você fez na bacia já fez o trabalho de ativação. Selecione o ciclo recomendado no seletor acima e inicie a lavagem.`,
        });
        break;
    }
  });

  if (!items.length) return null;

  const group = document.createElement('div');
  group.className = 'mw-alert-group';

  const badge = document.createElement('div');
  badge.className = 'mw-alert-badge';
  badge.innerHTML = `<span aria-hidden="true">🧺</span> Instruções específicas para <strong>${machine.id}</strong>`;
  group.appendChild(badge);

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = `mw-alert-card mw-alert-card--${item.kind}`;
    card.innerHTML = `
      <span class="mw-alert-icon" aria-hidden="true">${item.icon}</span>
      <div class="mw-alert-body">
        <div class="mw-alert-title">${item.title}</div>
        <p class="mw-alert-text">${item.text}</p>
      </div>`;
    group.appendChild(card);
  });

  return group;
}

// ── Seletor de Máquina na Calculadora (index.html) ───────────

function initCalcMachineSelector() {
  const calcHeader = document.querySelector('.calc-header');
  if (!calcHeader) return;

  const row = document.createElement('div');
  row.className = 'calc-machine-row';
  row.setAttribute('role', 'group');
  row.setAttribute('aria-label', 'Filtrar por máquina');
  row.innerHTML = `
    <span class="calc-machine-label">🧺 Minha máquina:</span>
    <div class="calc-machine-pills">
      <button class="calc-machine-pill active" data-machine="">Todas</button>
      <button class="calc-machine-pill" data-machine="LAC09">LAC09 · Com dispenser</button>
      <button class="calc-machine-pill" data-machine="LES09">LES09 · Sem dispenser</button>
    </div>`;
  calcHeader.appendChild(row);

  row.querySelectorAll('.calc-machine-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.calc-machine-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const id = btn.dataset.machine;
      selectedMachineId = id || null;
      if (id) saveMachine(id);
      updateCalcForMachine(id);
    });
  });

  // Restaurar escolha salva
  const saved = loadMachine();
  if (saved && MACHINES[saved]) {
    const btn = row.querySelector(`[data-machine="${saved}"]`);
    if (btn) {
      row.querySelectorAll('.calc-machine-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMachineId = saved;
      updateCalcForMachine(saved);
    }
  }
}

function updateCalcForMachine(machineId) {
  // Elementos com data-show-for="LAC09" ou data-show-for="LES09"
  document.querySelectorAll('[data-show-for]').forEach(el => {
    const targets = el.dataset.showFor.split(',').map(s => s.trim());
    el.hidden = machineId ? !targets.includes(machineId) : false;
  });

  // Elementos com data-hide-for="LES09" etc.
  document.querySelectorAll('[data-hide-for]').forEach(el => {
    const targets = el.dataset.hideFor.split(',').map(s => s.trim());
    el.hidden = machineId ? targets.includes(machineId) : false;
  });
}

// ── Bootstrap ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const pageId = getPageId();

  if (pageId === 'index') {
    initCalcMachineSelector();
    return;
  }

  // Páginas de guia
  injectWidget();

  // Restaurar escolha da máquina
  const saved = loadMachine();
  if (saved && MACHINES[saved]) {
    selectMachine(saved, false);
  }
});
