/*
SPEC: Main Orchestration
Goal: Initialize all site modules in the correct order and wire up global
      behaviors (nav scroll, theme toggle, hamburger menu, hero typewriter,
      module accordions, checklist download) so the page is interactive on load.
Users: All site visitors
Acceptance criteria:
- AC1: Nav gains .nav--scrolled when window.scrollY > 50
- AC2: Theme toggle persists preference to localStorage under sdd_theme
- AC3: Hamburger opens/closes mobile menu with correct aria-expanded
- AC4: Mobile menu closes when any link is clicked or Escape pressed
- AC5: Hero typewriter cycles 3 spec examples with 8s loop
- AC6: Module accordions expand/collapse with smooth CSS transition
- AC7: Checklist download generates a .md file via Blob URL
- AC8: All module init functions called after DOM ready
Out of scope:
- Analytics
- Service workers or offline mode
*/

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTheme();
  initHero();
  initModules();
  initChecklist();
  initIntersectionAnimations();

  if (typeof initProgress === 'function') initProgress();
  if (typeof initPlayground === 'function') initPlayground();
  if (typeof initMeta === 'function') initMeta();
});

/* ---- NAV ---- */

function initNav() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeLinks = mobileMenu?.querySelectorAll('[data-close-menu]');

  if (!nav) return;

  const updateScrollState = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  closeLinks?.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

/* ---- THEME ---- */

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const stored = localStorage.getItem('sdd_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;

  applyTheme(isDark);

  toggle.addEventListener('click', () => {
    const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!currentlyDark);
    localStorage.setItem('sdd_theme', !currentlyDark ? 'dark' : 'light');
  });

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    const icon = toggle.querySelector('i');
    if (icon) icon.className = dark ? 'ph ph-moon' : 'ph ph-sun';
  }
}

/* ---- HERO TYPEWRITER ---- */

function initHero() {
  const output = document.getElementById('typewriter-output');
  if (!output) return;

  const specs = [
    `<span class="spec-key">SPEC:</span><span class="spec-value"> User login</span>
<span class="spec-key">Goal:</span><span class="spec-value"> Allow users to authenticate
      and access their account data</span>
<span class="spec-key">Users:</span><span class="spec-value"> Registered users, web + mobile</span>
<span class="spec-key">Acceptance criteria:</span>
<span class="spec-ac">- Valid credentials → JWT returned</span>
<span class="spec-ac">- Invalid → 401 + error message shown</span>
<span class="spec-ac">- 5 failures/min → rate-limited</span>
<span class="spec-key">Out of scope:</span>
<span class="spec-comment">- OAuth / social login</span>
<span class="spec-comment">- Two-factor authentication</span>`,

    `<span class="spec-key">SPEC:</span><span class="spec-value"> Search results</span>
<span class="spec-key">Goal:</span><span class="spec-value"> Let users find content by keyword
      so they avoid manual browsing</span>
<span class="spec-key">Users:</span><span class="spec-value"> All authenticated users</span>
<span class="spec-key">Acceptance criteria:</span>
<span class="spec-ac">- Query returns results ≤ 200ms</span>
<span class="spec-ac">- Results sorted by relevance score</span>
<span class="spec-ac">- Empty state shown when 0 results</span>
<span class="spec-key">Out of scope:</span>
<span class="spec-comment">- Fuzzy / typo-tolerant search</span>
<span class="spec-comment">- Saved searches</span>`,

    `<span class="spec-key">SPEC:</span><span class="spec-value"> Password reset</span>
<span class="spec-key">Goal:</span><span class="spec-value"> Allow users to regain access
      without contacting support</span>
<span class="spec-key">Users:</span><span class="spec-value"> Registered users, any device</span>
<span class="spec-key">Acceptance criteria:</span>
<span class="spec-ac">- Request → email within 60 seconds</span>
<span class="spec-ac">- Reset link expires after 24h</span>
<span class="spec-ac">- New password: 8+ chars, 1 uppercase</span>
<span class="spec-key">Out of scope:</span>
<span class="spec-comment">- SMS-based reset</span>
<span class="spec-comment">- Admin-initiated resets</span>`,
  ];

  let current = 0;

  function typeSpec(html) {
    const plainText = html.replace(/<[^>]+>/g, '');
    const chars = [...plainText];
    let charIndex = 0;
    output.innerHTML = '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const fullLines = Array.from(tempDiv.childNodes).map(n => n.outerHTML || n.textContent);

    const lineTexts = plainText.split('\n');
    let lineIndex = 0;
    let lineCharIndex = 0;
    let builtHtml = '';

    function typeChar() {
      if (lineIndex >= fullLines.length) {
        setTimeout(nextSpec, 5000);
        return;
      }

      const lineHtml = fullLines[lineIndex] || '';
      const lineText = lineTexts[lineIndex] || '';

      lineCharIndex++;

      if (lineCharIndex >= lineText.length) {
        builtHtml += lineHtml + '\n';
        lineIndex++;
        lineCharIndex = 0;
        output.innerHTML = builtHtml + '<span class="typewriter-cursor"></span>';
        setTimeout(typeChar, 20);
      } else {
        output.innerHTML = builtHtml + '<span class="typewriter-cursor"></span>';
        setTimeout(typeChar, 18);
      }
    }

    typeChar();
  }

  function nextSpec() {
    current = (current + 1) % specs.length;
    output.style.opacity = '0';
    setTimeout(() => {
      output.style.opacity = '1';
      typeSpec(specs[current]);
    }, 400);
  }

  output.style.transition = 'opacity 0.4s ease';
  typeSpec(specs[0]);
}

/* ---- MODULE ACCORDIONS ---- */

function initModules() {
  const cards = document.querySelectorAll('.module-card');

  cards.forEach(card => {
    const btn = card.querySelector('.module-card__cta');
    const moduleId = card.dataset.module;
    const accordionId = `module-${moduleId?.slice(1)}-content`;
    const accordion = document.getElementById(accordionId);

    if (!btn || !accordion) return;

    btn.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('is-open');
      accordion.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));

      if (!isOpen) {
        const btnLabel = btn.querySelector('.bilingual__en');
        if (btnLabel) btnLabel.textContent = 'Collapse';
        const btnLabelEs = btn.querySelector('.bilingual__es');
        if (btnLabelEs) btnLabelEs.textContent = 'Cerrar';
      } else {
        const progress = typeof getProgress === 'function' ? getProgress() : {};
        const done = progress[moduleId];
        const btnLabel = btn.querySelector('.bilingual__en');
        if (btnLabel) btnLabel.textContent = done ? 'Review' : 'Start';
        const btnLabelEs = btn.querySelector('.bilingual__es');
        if (btnLabelEs) btnLabelEs.textContent = done ? 'Repasar' : 'Empezar';
      }
    });
  });
}

/* ---- CHECKLIST DOWNLOAD ---- */

function initChecklist() {
  const btn = document.getElementById('download-checklist');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const content = `# SDD Team Adoption Checklist / Checklist de Adopción de SDD

A 7-week playbook for introducing Spec-Driven Development to your team.
Un playbook de 7 semanas para introducir SDD en tu equipo.

---

## Week 1 — Solo pilot / Semana 1 — Piloto individual
- [ ] Write specs for your next 3 tickets — alone, before coding
- [ ] Notice how spec-writing reveals missing requirements

## Week 2 — Show one example / Semana 2 — Mostrá un ejemplo
- [ ] Share one spec in a 1:1 or standup
- [ ] Let the quality of the output speak, don't pitch the methodology

## Week 3 — Pair write / Semana 3 — Escribí en pareja
- [ ] Write a spec together with one teammate
- [ ] Ask for corrections — the spec becomes theirs too

## Week 4 — Propose the template / Semana 4 — Proponé el template
- [ ] Suggest adding spec fields to your ticket template (Jira/Linear/GitHub)
- [ ] Frame it as "5 fields that prevent rework", not "a new process"

## Week 5–6 — First team retro / Semana 5–6 — Primera retro del equipo
- [ ] After first specced feature ships, run a 15-min retro
- [ ] Use the 3-question format: What matched? What diverged? What to spec differently?
- [ ] Document the retro in the ticket or a shared doc

## Week 7+ — Make it a norm / Semana 7+ — Hacelo la norma
- [ ] "Can you add the spec fields?" becomes a normal code-review comment
- [ ] No more pitching — it's just how your team works

---

*Generated by learn-spec-driven-dev · https://github.com/alexlecco/learn-spec-driven-dev*
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sdd-adoption-checklist.md';
    a.click();
    URL.revokeObjectURL(url);
  });
}

/* ---- INTERSECTION OBSERVER ANIMATIONS ---- */

function initIntersectionAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const targets = document.querySelectorAll('.animate-on-scroll, .stagger-children');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}
