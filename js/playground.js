/*
SPEC: Spec Playground
Goal: Allow users to write a spec and receive real-time structured quality
      feedback so they practice SDD and leave with a validated spec.
Users: Developers actively learning or practicing SDD
Acceptance criteria:
- AC1: Tab key inserts 2 spaces without losing focus
- AC2: Ctrl+Enter triggers validation animation
- AC3: Line numbers update in real time as text changes
- AC4: char count and estimated read time update live
- AC5: Validation engine scores 4 dimensions (25 pts each)
- AC6: Score meter uses CSS conic-gradient and shifts color by range
- AC7: Field checklist updates with check/x icons and tips
- AC8: AC quality badges shown (Good/Vague/Untestable)
- AC9: Three example spec loaders work
- AC10: Copy button copies to clipboard
Out of scope:
- Server-side saving
- URL-shareable specs
*/

const VAGUE_WORDS = ['works', 'good', 'nice', 'easy', 'fast', 'smooth', 'better',
  'improved', 'simple', 'intuitive', 'user-friendly', 'etc', 'and more',
  'funciona', 'bueno', 'bonito', 'fácil', 'rápido', 'suave', 'mejor'];

const OUTCOME_PHRASES = ['so that', 'in order to', 'allowing', 'para que',
  'con el fin de', 'permitiendo', 'so they', 'so the user', 'allowing the'];

const ACTION_VERBS = ['allow', 'enable', 'let', 'display', 'show', 'return',
  'redirect', 'send', 'create', 'update', 'delete', 'validate', 'save',
  'load', 'render', 'fetch', 'submit', 'log', 'track', 'prevent', 'permit',
  'permitir', 'mostrar', 'retornar', 'redirigir', 'enviar', 'crear', 'actualizar',
  'eliminar', 'validar', 'guardar', 'cargar', 'renderizar', 'obtener', 'enviar'];

const EXAMPLES = {
  feature: `SPEC: Dark mode toggle
Goal: Allow users to switch between light and dark themes so they can
      reduce eye strain in low-light environments.
Users: All authenticated users, primarily on desktop
Acceptance criteria:
- Toggle button in top-right nav switches between light and dark mode
- Preference is persisted to localStorage under key "theme"
- System default is respected on first visit (prefers-color-scheme)
- Transition between themes takes 250ms, no flash
Out of scope:
- Per-page theme overrides
- High-contrast accessibility mode`,

  bugfix: `SPEC: Fix broken pagination on mobile
Goal: Restore correct pagination behavior on mobile viewports so users
      can navigate between pages without losing scroll position.
Users: Mobile users on screens < 768px wide
Acceptance criteria:
- Clicking Next/Previous updates the page URL and loads correct data
- Scroll position resets to top of list on page change
- Pagination controls are visible above the fold on 375px screen
- Loading state shown while data fetches (spinner, controls disabled)
Out of scope:
- Desktop pagination (not broken)
- Infinite scroll (separate feature)`,

  api: `SPEC: GET /api/v1/users/:id endpoint
Goal: Return a single user's public profile data so client applications
      can display user information without fetching the full user list.
Users: Internal API consumers (web app, mobile app)
Acceptance criteria:
- Returns 200 + JSON { id, name, email, avatar_url, created_at }
- Returns 404 if user not found, with { error: "User not found" }
- Returns 401 if no valid bearer token in Authorization header
- Response time < 100ms at p95 under normal load
- email field is omitted if requesting user is not the owner
Out of scope:
- Updating user data (use PATCH /api/v1/users/:id)
- Fetching followers/following lists`,
};

function validateSpec(text) {
  const lines = text.split('\n');
  const lower = text.toLowerCase();

  // --- Structure completeness (25 pts) ---
  const hasSpec = /^spec:/im.test(text) && text.match(/^spec:\s*.+/im)?.[0]?.length > 8;
  const hasGoal = /^goal:/im.test(text) && text.match(/^goal:\s*.+/im)?.[0]?.length > 12;
  const hasUsers = /^users:/im.test(text);
  const hasAC = /^acceptance criteria:/im.test(text);
  const hasScope = /^out of scope:/im.test(text);

  const fieldCount = [hasSpec, hasGoal, hasUsers, hasAC, hasScope].filter(Boolean).length;
  const structureScore = Math.round((fieldCount / 5) * 25);

  // --- AC quality (25 pts) ---
  const acLines = lines.filter(l => /^\s*-\s+\S/.test(l) &&
    lines.indexOf(l) > lines.findIndex(l => /^acceptance criteria:/i.test(l)) &&
    lines.indexOf(l) < lines.findIndex(l => /^out of scope:/i.test(l)) + 100
  );

  const acAfterHeader = extractSection(lines, 'acceptance criteria:', 'out of scope:');
  const acItems = acAfterHeader.filter(l => /^\s*-\s+\S/.test(l));

  let acScore = 0;
  const acResults = acItems.map(ac => {
    const cleanAC = ac.replace(/^\s*-\s+/, '').trim();
    const startsWithVerb = ACTION_VERBS.some(v => cleanAC.toLowerCase().startsWith(v));
    const hasVague = VAGUE_WORDS.some(w => cleanAC.toLowerCase().includes(w));
    const isLong = cleanAC.length > 15;
    const hasArrow = cleanAC.includes('→') || cleanAC.includes('->');
    const isTestable = (startsWithVerb || hasArrow) && !hasVague && isLong;
    const isGood = isTestable && startsWithVerb;

    if (isGood) acScore += 5;
    else if (isTestable) acScore += 2;

    return {
      text: cleanAC.length > 60 ? cleanAC.slice(0, 57) + '…' : cleanAC,
      quality: isGood ? 'good' : hasVague ? 'vague' : 'untestable',
    };
  });

  const normalizedAcScore = Math.min(25, Math.round((Math.min(acScore, 25) / 25) * 25));

  // --- Goal clarity (25 pts) ---
  const goalLine = lines.find(l => /^goal:/i.test(l)) || '';
  const goalText = lines.slice(lines.indexOf(goalLine), lines.indexOf(goalLine) + 3)
    .join(' ')
    .replace(/^goal:/i, '')
    .trim();

  const goalWords = goalText.split(/\s+/).filter(Boolean).length;
  const hasOutcome = OUTCOME_PHRASES.some(p => goalText.toLowerCase().includes(p));
  const goalLong = goalWords >= 10;

  let goalScore = 0;
  if (hasGoal) goalScore += 10;
  if (goalLong) goalScore += 8;
  if (hasOutcome) goalScore += 7;

  // --- Scope definition (25 pts) ---
  const scopeItems = extractSection(lines, 'out of scope:', null)
    .filter(l => /^\s*-\s+\S/.test(l));

  const hasVagueScope = scopeItems.some(l =>
    ['other things', 'etc', 'and more', 'anything else', 'other'].some(v => l.toLowerCase().includes(v))
  );

  let scopeScore = 0;
  if (hasScope) scopeScore += 10;
  if (scopeItems.length >= 1) scopeScore += 8;
  if (scopeItems.length >= 2) scopeScore += 4;
  if (!hasVagueScope && scopeItems.length >= 1) scopeScore += 3;

  const total = structureScore + normalizedAcScore + goalScore + Math.min(scopeScore, 25);

  return {
    total: Math.min(100, total),
    structureScore,
    acScore: normalizedAcScore,
    goalScore: Math.min(25, goalScore),
    scopeScore: Math.min(25, scopeScore),
    fields: { hasSpec, hasGoal, hasUsers, hasAC, hasScope },
    acResults,
  };
}

function extractSection(lines, startPattern, endPattern) {
  const startIdx = lines.findIndex(l => new RegExp(startPattern, 'i').test(l));
  if (startIdx === -1) return [];
  const endIdx = endPattern
    ? lines.findIndex((l, i) => i > startIdx && new RegExp(endPattern, 'i').test(l))
    : -1;
  return endIdx === -1
    ? lines.slice(startIdx + 1)
    : lines.slice(startIdx + 1, endIdx);
}

function scoreColor(score) {
  if (score >= 80) return '#22C55E';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

function scoreSummary(score) {
  if (score >= 80) return {
    en: 'Strong spec — ready for a team ticket.',
    es: 'Spec sólido — listo para un ticket del equipo.'
  };
  if (score >= 50) return {
    en: 'Good start. Sharpen the ACs and clarify the goal.',
    es: 'Buen comienzo. Afinà los ACs y clarificà el objetivo.'
  };
  return {
    en: 'Keep going — add the required fields to improve your score.',
    es: 'Seguí — agregà los campos obligatorios para mejorar el puntaje.'
  };
}

function updateUI(result, score) {
  const circle = document.getElementById('score-circle');
  const valueEl = document.getElementById('score-value');
  const summaryEl = document.getElementById('score-summary');

  if (circle) {
    const color = scoreColor(score);
    circle.style.background = `conic-gradient(${color} ${score}%, var(--bg-elevated) 0)`;
  }
  if (valueEl) valueEl.textContent = score;

  if (summaryEl) {
    const s = scoreSummary(score);
    summaryEl.innerHTML = `${s.en}<br><span style="color:var(--text-muted);font-size:0.9em">${s.es}</span>`;
  }

  const fieldMap = {
    spec: result.fields.hasSpec,
    goal: result.fields.hasGoal,
    users: result.fields.hasUsers,
    ac: result.fields.hasAC,
    scope: result.fields.hasScope,
  };

  const tips = {
    spec: { ok: 'Feature name present', fail: 'Add feature name / Agregá el nombre' },
    goal: { ok: 'Goal defined', fail: 'Describe user outcome / Describí el resultado' },
    users: { ok: 'Users defined', fail: 'Who uses this? / ¿Quién lo usa?' },
    ac: { ok: 'ACs present', fail: 'Add testable ACs / Agregà ACs verificables' },
    scope: { ok: 'Scope defined', fail: 'Add at least 1 exclusion / Agregà 1 exclusión' },
  };

  Object.entries(fieldMap).forEach(([field, present]) => {
    const item = document.querySelector(`[data-field="${field}"]`);
    if (!item) return;
    const icon = item.querySelector('.checklist__icon');
    const tip = item.querySelector('.checklist__tip');
    if (icon) {
      icon.className = present
        ? 'ph ph-check-circle checklist__icon checklist__icon--ok'
        : 'ph ph-circle checklist__icon checklist__icon--fail';
    }
    if (tip) tip.textContent = present ? tips[field].ok : tips[field].fail;
  });

  const acList = document.getElementById('ac-analysis');
  if (acList) {
    if (!result.acResults.length) {
      acList.innerHTML = '<p style="font-size:var(--text-xs);color:var(--text-muted)">ACs will appear here as you write them. / Los ACs aparecerán aquí.</p>';
    } else {
      acList.innerHTML = result.acResults.map(ac => {
        const colorMap = { good: 'badge--green', vague: 'badge--amber', untestable: 'badge--red' };
        const labelMap = {
          good: 'Good / Bueno',
          vague: 'Vague / Vago',
          untestable: 'Untestable / No verificable',
        };
        return `<div class="ac-item">
          <span class="badge ${colorMap[ac.quality]}" style="flex-shrink:0">${labelMap[ac.quality]}</span>
          <span>${ac.text}</span>
        </div>`;
      }).join('');
    }
  }
}

function updateLineNumbers(textarea) {
  const lineNumbers = document.getElementById('line-numbers');
  if (!lineNumbers) return;
  const lines = textarea.value.split('\n').length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) =>
    `<span class="editor-line-num">${i + 1}</span>`
  ).join('');
}

function updateEditorMeta(textarea) {
  const charCount = document.getElementById('char-count');
  const readTime = document.getElementById('read-time');
  if (charCount) charCount.textContent = `${textarea.value.length} chars`;
  if (readTime) {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    readTime.textContent = `~${mins} min read`;
  }
}

let debounceTimer;

function initPlayground() {
  const editor = document.getElementById('spec-editor');
  if (!editor) return;

  editor.addEventListener('input', () => {
    updateLineNumbers(editor);
    updateEditorMeta(editor);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const result = validateSpec(editor.value);
      updateUI(result, result.total);
    }, 300);
  });

  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.slice(0, start) + '  ' + editor.value.slice(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
      editor.dispatchEvent(new Event('input'));
    }

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      const circle = document.getElementById('score-circle');
      if (circle) {
        circle.style.transform = 'scale(1.05)';
        setTimeout(() => { circle.style.transform = ''; }, 200);
      }
      const result = validateSpec(editor.value);
      updateUI(result, result.total);
    }
  });

  updateLineNumbers(editor);

  document.querySelectorAll('[data-example]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.example;
      if (EXAMPLES[key]) {
        editor.value = EXAMPLES[key];
        editor.dispatchEvent(new Event('input'));
        editor.focus();
      }
    });
  });

  const copyBtn = document.getElementById('copy-spec-btn');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(editor.value);
      const span = copyBtn.querySelector('span');
      if (span) {
        span.textContent = 'Copied! / ¡Copiado!';
        setTimeout(() => { span.textContent = 'Copy spec / Copiar spec'; }, 2000);
      }
    } catch {
      // Fallback for insecure contexts
      editor.select();
      document.execCommand('copy');
    }
  });
}
