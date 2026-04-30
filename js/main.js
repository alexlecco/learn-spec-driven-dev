/*
SPEC: Main Orchestration
Goal: Initialize all site modules in the correct order and wire up global
      behaviors (nav scroll, theme toggle, hamburger menu) so that the page
      is interactive on load.
Users: All site visitors (this runs on every page load)
Acceptance criteria:
- AC1: Nav gains .nav--scrolled class when window.scrollY > 50
- AC2: Theme toggle persists preference to localStorage under key sdd_theme
- AC3: Hamburger opens/closes mobile menu with correct aria-expanded state
- AC4: Mobile menu closes when any menu link is clicked
- AC5: All module init functions are called after DOM is ready
Out of scope:
- Analytics
- Service workers or offline mode
*/

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTheme();
  initHero();
  initModules();
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

  // Scroll state
  const updateScrollState = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close menu on link click
  closeLinks?.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
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
    if (icon) {
      icon.className = dark ? 'ph ph-moon' : 'ph ph-sun';
    }
  }
}

/* ---- HERO (stub — expanded in Phase 3) ---- */

function initHero() {
  // Phase 3 will populate this
}

/* ---- MODULE ACCORDIONS (stub — expanded in Phase 4) ---- */

function initModules() {
  // Phase 4 will populate this
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
