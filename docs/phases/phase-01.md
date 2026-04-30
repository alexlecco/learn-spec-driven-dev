# Phase 01 — Repo Bootstrap & Master Spec

## Spec

```
SPEC: Repository Bootstrap
Goal: Create the complete project scaffolding and master specification document
      so that all future phases have a clear structure, conventions, and shared
      understanding of what is being built and why.
Users: The developer (and any Claude Code session) working on this repo
Acceptance criteria:
- AC1: All files and folders from the defined structure exist in the repo
- AC2: /docs/SPEC.md contains the full master spec (vision, persona, goals,
       IA, design principles, technical constraints, success metrics)
- AC3: /CLAUDE.md contains actionable instructions for any Claude Code session
- AC4: /README.md is public-facing and includes the SDD statement, stack,
       run instructions, and lessons learned section
- AC5: /docs/phases/phase-01.md (this file) documents the spec and decisions
- AC6: /docs/build-log.md contains the Phase 1 retrospective entry
- AC7: All files are committed and pushed to main
Out of scope:
- Any HTML, CSS, or JavaScript implementation
- Any content beyond documentation and scaffolding
```

---

## Decisions Made

### Why a single index.html?

SDD for a marketing/educational site does not benefit from a multi-page architecture. A single-page application lets us control scroll position, animate between sections, and expose the "inspect spec" feature without page transitions. The spec playground and meta-case panel both require persistent JS state that is simpler in a SPA.

### Why vanilla HTML/CSS/JS?

The audience (mid/senior devs) is framework-opinionated. By using no framework, the site is legible to React devs, Vue devs, Angular devs, and Rails devs equally. It also means the site can be opened with `open index.html` — zero friction for anyone who wants to inspect the source as a learning exercise.

### Why dark-mode first?

Developer-facing tools trend dark. The primary audience (developers) is more likely to run in dark mode. Dark mode first also forces us to define a deliberate color system rather than defaulting to browser white.

### File naming conventions

CSS is split by concern (tokens, base, layout, components, animations) rather than by component. At this scale (single page), concern-based splitting keeps files short and navigable. If the site grew to 10+ pages, component-based splitting would become preferable.

### The persona (Marco)

The persona is concrete and named to prevent "design for everyone" drift. Every content and UX decision in future phases should be tested against: "Would Marco find this useful on a Tuesday afternoon before a sprint planning meeting?"

---

## Trade-offs Considered

| Decision | Alternative Considered | Reason Chosen |
|----------|----------------------|---------------|
| Single page | Multi-page HTML | Simpler JS state, better scroll control, no navigation overhead |
| Vanilla JS | Lit/Svelte (no-build web components) | Maximum legibility for all devs; no compilation needed |
| localStorage only | IndexedDB | Sufficient for this data volume; simpler API |
| CSS custom properties | SASS variables | No build step; native cascade and inheritance |

---

## Files Created This Phase

- `/index.html` (empty placeholder)
- `/css/tokens.css`, `base.css`, `layout.css`, `components.css`, `animations.css` (empty)
- `/js/main.js`, `playground.js`, `progress.js`, `meta.js` (empty)
- `/docs/SPEC.md` (master spec — complete)
- `/docs/build-log.md` (phase 1 entry)
- `/docs/phases/phase-01.md` (this file)
- `/docs/phases/phase-02.md` through `phase-07.md` (empty placeholders)
- `/CLAUDE.md` (complete)
- `/README.md` (complete)
- `/assets/icons/` (empty directory)
