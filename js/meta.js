/*
SPEC: Meta-Case Panel
Goal: Let visitors inspect the spec behind any section and view the full
      build process so SDD credibility is demonstrated in practice.
Users: Skeptical developers who want proof that SDD works
Acceptance criteria:
- AC1: "Inspect spec" button appears after hero is scrolled past
- AC2: Inspect mode outlines all sections with purple
- AC3: Clicking a section in inspect mode opens modal with its spec
- AC4: Modal closes on outside click or Escape
- AC5: Focus is trapped inside modal while open
- AC6: Build log fetched from /docs/build-log.md and rendered (headings, bold, bullets, code)
- AC7: Build log collapsible by phase, Phase 1 expanded by default
- AC8: Timeline commit hashes loaded from git log data embedded in page
Out of scope:
- Real-time git API integration
- Spec editing via modal
*/

const COMMIT_HASHES = {
  1: '3b06ced',
  2: 'ec3c52d',
  3: '770240d',
  4: '770240d',
  5: '770240d',
  6: '770240d',
  7: null,
};

function initMeta() {
  initInspectMode();
  initBuildLog();
  initCommitHashes();
}

/* ---- INSPECT MODE ---- */

function initInspectMode() {
  const inspectBtn = document.getElementById('inspect-btn');
  const modal = document.getElementById('spec-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  let inspectActive = false;

  if (!inspectBtn) return;

  // Show button after hero is scrolled past
  const heroSection = document.getElementById('home');
  const scrollObserver = new IntersectionObserver(
    ([entry]) => {
      inspectBtn.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  if (heroSection) scrollObserver.observe(heroSection);

  // Toggle inspect mode
  inspectBtn.addEventListener('click', () => {
    inspectActive = !inspectActive;
    document.body.classList.toggle('inspect-mode', inspectActive);
    inspectBtn.setAttribute('aria-pressed', String(inspectActive));
    inspectBtn.classList.toggle('is-active', inspectActive);

    const iconEl = inspectBtn.querySelector('i');
    if (iconEl) iconEl.className = inspectActive ? 'ph ph-x' : 'ph ph-magnifying-glass';

    if (inspectActive) {
      addSectionClickHandlers();
    } else {
      removeSectionClickHandlers();
    }
  });

  function addSectionClickHandlers() {
    document.querySelectorAll('section[id]').forEach(section => {
      section.addEventListener('click', handleSectionClick);
      let badge = section.querySelector('.view-spec-badge');
      if (!badge) {
        badge = document.createElement('button');
        badge.className = 'view-spec-badge';
        badge.textContent = 'View spec / Ver spec';
        badge.setAttribute('aria-label', `View spec for section ${section.id}`);
        section.appendChild(badge);
      }
    });
  }

  function removeSectionClickHandlers() {
    document.querySelectorAll('section[id]').forEach(section => {
      section.removeEventListener('click', handleSectionClick);
    });
  }

  function handleSectionClick(e) {
    if (!inspectActive) return;
    const section = e.currentTarget;
    const specDetails = section.querySelector('details.meta-spec');
    if (!specDetails) return;

    const specContent = specDetails.querySelector('pre')?.textContent || 'No spec found for this section.';
    const sectionName = section.getAttribute('aria-labelledby')
      ? document.getElementById(section.getAttribute('aria-labelledby'))?.textContent
      : section.id;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="margin-bottom:var(--space-3)">
          <span class="badge badge--accent">Section: ${section.id}</span>
        </div>
        <pre style="
          font-family:var(--font-mono);
          font-size:var(--text-sm);
          color:var(--text-secondary);
          white-space:pre-wrap;
          line-height:1.6;
          background:var(--bg-elevated);
          border:1px solid var(--border-default);
          border-radius:var(--radius-md);
          padding:var(--space-4);
          overflow-x:auto;
        ">${specContent.trim()}</pre>
      `;
    }

    openModal();
  }

  // Modal controls
  function openModal() {
    modal.classList.add('is-open');
    modalClose.focus();
    document.addEventListener('keydown', handleModalKeydown);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', handleModalKeydown);
    inspectBtn.focus();
  }

  function handleModalKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    // Focus trap
    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  modalClose?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ---- BUILD LOG READER ---- */

function initBuildLog() {
  const container = document.getElementById('build-log-reader');
  if (!container) return;

  fetch('docs/build-log.md')
    .then(r => r.text())
    .then(md => {
      container.innerHTML = renderBuildLog(md);
      // Expand first phase by default
      const firstAccordion = container.querySelector('.log-accordion');
      if (firstAccordion) firstAccordion.classList.add('is-open');
    })
    .catch(() => {
      container.innerHTML = `
        <p style="font-size:var(--text-sm);color:var(--text-muted)">
          Build log available when running from a local server.
          Run: <code>python3 -m http.server 8080</code>
          <br>
          Build log disponible desde un servidor local.
        </p>
      `;
    });
}

function renderBuildLog(md) {
  const lines = md.split('\n');
  let html = '';
  let inPhase = false;
  let phaseContent = '';
  let phaseTitle = '';
  let phaseIndex = 0;

  function flushPhase() {
    if (!phaseTitle) return;
    phaseIndex++;
    const id = `log-phase-${phaseIndex}`;
    html += `
      <div class="log-phase">
        <button
          class="log-phase__header"
          aria-expanded="${phaseIndex === 1 ? 'true' : 'false'}"
          aria-controls="${id}"
          onclick="toggleLogPhase(this, '${id}')"
          style="
            width:100%;
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:var(--space-3) var(--space-4);
            background:var(--bg-elevated);
            border:1px solid var(--border-default);
            border-radius:var(--radius-md);
            cursor:pointer;
            font-family:var(--font-sans);
            font-size:var(--text-sm);
            font-weight:600;
            color:var(--text-primary);
            text-align:left;
          "
        >
          <span>${phaseTitle}</span>
          <i class="ph ph-caret-down" style="transition:transform var(--duration-default) var(--ease-default)"></i>
        </button>
        <div
          class="log-accordion ${phaseIndex === 1 ? 'is-open' : ''}"
          id="${id}"
          style="padding: 0 var(--space-4);"
        >
          <div class="accordion__content" style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7">
            ${renderMarkdownContent(phaseContent)}
          </div>
        </div>
      </div>
    `;
    phaseContent = '';
  }

  lines.forEach(line => {
    if (/^## Phase/.test(line)) {
      flushPhase();
      phaseTitle = line.replace(/^##\s+/, '');
      inPhase = true;
    } else if (/^## /.test(line) && !line.includes('Phase')) {
      flushPhase();
      phaseTitle = line.replace(/^##\s+/, '');
      inPhase = true;
    } else if (/^# /.test(line)) {
      // Skip main title
    } else if (inPhase) {
      phaseContent += line + '\n';
    }
  });
  flushPhase();

  return html;
}

function renderMarkdownContent(md) {
  return md
    .replace(/^### (.+)$/gm, '<h4 style="font-size:var(--text-base);font-weight:600;color:var(--text-primary);margin-top:var(--space-4);margin-bottom:var(--space-2)">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\| .+$/gm, '') // Skip tables
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, m => `<ul style="list-style:none;padding-left:var(--space-4);display:flex;flex-direction:column;gap:var(--space-1);">${m}</ul>`)
    .replace(/\n{2,}/g, '</p><p style="margin-bottom:var(--space-2)">')
    .replace(/^([^<\n].+)$/gm, '<p style="margin-bottom:var(--space-2)">$1</p>');
}

window.toggleLogPhase = function(btn, id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const isOpen = panel.classList.contains('is-open');
  panel.classList.toggle('is-open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  const icon = btn.querySelector('i');
  if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
};

/* ---- COMMIT HASHES ---- */

function initCommitHashes() {
  Object.entries(COMMIT_HASHES).forEach(([phase, hash]) => {
    const el = document.getElementById(`commit-${phase}`);
    if (!el) return;
    el.textContent = hash
      ? `git: ${hash}`
      : 'Commit pending / Commit pendiente';
    el.style.color = hash ? 'var(--color-accent-2)' : 'var(--text-muted)';
  });
}
