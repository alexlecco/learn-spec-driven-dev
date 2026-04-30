# CLAUDE.md — Learn Spec-Driven Development

Instructions for any Claude Code session working on this repository.

---

## Stack

- **HTML5** — semantic landmarks, no template engine
- **CSS3** — vanilla only, no preprocessors. Files: `tokens.css`, `base.css`, `layout.css`, `components.css`, `animations.css`
- **Vanilla JavaScript** — ES2022+, no frameworks, no bundlers
- **Fonts/Icons via CDN:** Google Fonts (Inter, Syne, JetBrains Mono), Phosphor Icons

## How to Run Locally

```bash
open index.html
```

No build step. No server required. The site is pure static HTML/CSS/JS.

If you need to fetch local markdown files (e.g., build-log.md for Phase 6), run a simple local server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Commit Format

Use conventional commits:

```
type(scope): short description
```

- **type:** `feat`, `fix`, `chore`, `docs`, `style`, `refactor`
- **scope:** `phase-N` for phase work, or a short feature name
- **Examples:**
  - `chore(phase-1): bootstrap repo structure and master spec`
  - `feat(phase-3): hero section and SDD concept introduction`
  - `fix(nav): hamburger menu close on outside click`

One commit per phase. Commit and push at the end of every phase.

---

## Spec Format

Every file implementing a feature must start with a spec comment block:

```
/*
SPEC: [Feature Name]
Goal: ...
Users: ...
Acceptance criteria:
- AC1
- AC2
Out of scope: ...
*/
```

Every HTML section must include a hidden `<details class="meta-spec">` element with the spec that built it:

```html
<details class="meta-spec">
  <summary>Spec: [Section Name]</summary>
  <pre>
SPEC: [Feature Name]
Goal: ...
Users: ...
Acceptance criteria:
- AC1
- AC2
Out of scope: ...
  </pre>
</details>
```

---

## Ground Rules

1. **Spec-first, always.** Write the spec before writing any code.
2. **One atomic commit per phase.** Each phase ends with one conventional commit.
3. **No frameworks.** Vanilla HTML, CSS, JS only.
4. **Mobile-first CSS.** Base styles target 375px. Use `min-width` media queries.
5. **Dark mode first.** `@media (prefers-color-scheme: light)` is the override.
6. **Accessibility baseline.** Visible focus ring, ARIA labels, contrast ≥ 4.5:1.
7. **Self-documenting.** Every HTML section has `<details class="meta-spec">`.
8. **Document reasoning.** Append a phase retrospective to `/docs/build-log.md` after each phase.

---

## File Structure

```
/
├── index.html
├── css/
│   ├── tokens.css        # Design tokens
│   ├── base.css          # Reset + base typography
│   ├── layout.css        # Grid system + spacing utilities
│   ├── components.css    # Reusable UI components
│   └── animations.css    # Scroll-driven + micro-animations
├── js/
│   ├── main.js           # Init + orchestration
│   ├── playground.js     # Spec editor + validation engine
│   ├── progress.js       # Module progress tracking (localStorage)
│   └── meta.js           # Meta-case panel logic
├── docs/
│   ├── SPEC.md           # Master spec for the entire site
│   ├── build-log.md      # Phase-by-phase build retrospective
│   └── phases/           # Spec + decisions per phase
├── assets/
│   └── icons/            # Local SVG icons
├── CLAUDE.md             # This file
└── README.md
```

---

## CSS Conventions

- All custom properties defined in `tokens.css` under `:root`
- Dark mode is the default; light mode overrides in `@media (prefers-color-scheme: light)`
- Class naming: BEM-lite — `.component`, `.component__element`, `.component--modifier`
- No `!important` except for utility overrides
- Spacing always uses `--space-N` tokens

## JavaScript Conventions

- No `var` — use `const` / `let`
- No inline event handlers in HTML
- All module init functions exported and called from `main.js`
- localStorage key namespace: `sdd_*` (e.g., `sdd_progress`)
- Debounce user input callbacks at 300ms

## Phases

| Phase | Focus |
|-------|-------|
| 1 | Repo bootstrap & master spec |
| 2 | Design system & shell |
| 3 | Hero + conceptual intro |
| 4 | Learning path (5 modules) |
| 5 | Interactive spec playground |
| 6 | Meta-case: how this site was built |
| 7 | Polish, animations & final QA |
