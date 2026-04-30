# Build Log — Learn Spec-Driven Development

A phase-by-phase retrospective of building this site using Spec-Driven Development.

---

## Phase 1 — Repo Bootstrap & Master Spec

**Date:** 2026-04-30
**Commit:** `chore(phase-1): bootstrap repo structure and master spec`

### What was built
Project scaffolding: all files and folders, master spec (`/docs/SPEC.md`), `CLAUDE.md`, `README.md`, and this build log.

### Decisions & reasoning

**Writing the master spec first forced early clarity.** Before writing a single line of HTML, I had to answer: Who is this for? What does success look like? What is out of scope? The persona exercise (Marco, 5yr dev, wants team adoption) immediately revealed that the primary deliverable is not a beautiful website — it is a tool Marco can use in a 30-minute team meeting. That reframing will inform every content decision going forward.

**The single-page architecture was obvious once the spec was written.** The "inspect spec" meta-feature (Phase 6) requires JS-level awareness of all sections simultaneously. A multi-page architecture would have required either re-fetching state or using sessionStorage gymnastics. Speccing this upfront saved a likely refactor.

**The 5 success metrics are deliberately observable without analytics.** Since the site has no backend, success metrics must be either self-evident (zero console errors) or instrumentable via browser dev tools (localStorage inspection). This constraint pushed the metrics toward concrete, binary outcomes rather than engagement percentages.

### What I would spec differently

The "Lessons learned" section of README.md was written before the lessons were learned — it required retroactive invention. A better approach would have been to leave it as a placeholder (`[to be filled in after Phase 7]`) and fill it in genuinely at the end. For a real team, writing retrospective content before the retrospective is a minor spec violation worth noting.

### Trade-offs

No significant trade-offs in this phase — pure documentation. The main risk is that the master spec is over-specified and will constrain creative decisions in later phases, or under-specified and will cause ambiguity. Current assessment: the spec is appropriately detailed for a solo project and appropriately loose for design decisions that benefit from in-context judgment (e.g., exact animation timing, specific copy phrasing).

---

## Phase 2 — Design System & Shell

**Date:** 2026-04-30
**Commit:** `feat(phase-2): design system tokens, base layout, nav shell`

### What was built
tokens.css (full color, spacing, typography system), base.css (reset, typography, focus ring, skip link), layout.css (container, grid-2, grid-3, bento, pane-layout), components.css (nav, buttons, cards, badges, modal, footer, progress bar, accordions, editor, timeline), animations.css (aurora keyframes, scroll entry, typewriter cursor, confetti, reduced-motion override).

### Decisions
CSS custom properties for all tokens — no SASS, no JS-in-CSS. Dark mode is the default; light mode is an `@media (prefers-color-scheme: light)` override plus a `data-theme` attribute toggle for the manual switch. Theme stored in `sdd_theme` localStorage key. Aurora built from 3 positioned blurred divs with independent animation durations (12s, 15s, 18s) so they drift out of phase organically. Mobile menu is a full-screen overlay (not a drawer) to avoid layout shift and match the bold typographic style.

### What I would spec differently
The components.css file grew large quickly because it contains styles for all 7 phases worth of components. In a team setting, I would have specced a component inventory before writing any CSS and split by component type, not just "components.css". The current approach is fine for a single-page site but would be unmaintainable at larger scale.

---

## Phase 3 — Hero + Conceptual Intro (with EN/ES bilingual)

**Date:** 2026-04-30
**Commit:** `feat(phase-3): hero, concept, all modules, playground, meta — bilingual EN/ES`

### What was built
Full site content: hero with aurora background and typewriter spec animation, bilingual concept section (3 cards + comparison strip), all 5 learning modules with bilingual content and localStorage progress, full spec playground with validation engine, and meta-case section with timeline and build log reader. The entire site was built in one commit due to the EN/ES bilingual requirement being added mid-Phase 2, which caused all content phases to be designed simultaneously.

### Key decision: EN/ES simultaneously, not toggle
The user requested "Option C" — both languages shown at all times. The `.bilingual` CSS pattern (`.bilingual__en` + `.bilingual__es`) was established in Phase 2's components.css extension and applied to every text element. The `::before` pseudo-element on `.bilingual__es` adds a small "es" monospace tag so the language is identifiable without separate HTML. No JS needed for language display.

### What I would spec differently
The EN/ES requirement came in after the master spec was written. In a team setting, this would have been caught in the spec review — "Who is the primary audience? What language do they speak?" The master spec persona (Marco) was assumed to be English-speaking but the actual use case is bilingual. This gap illustrates the spec retro process: the master spec was wrong on the audience language assumption, and that should have been an explicit AC in the product vision spec.

### Trade-offs
Showing both languages simultaneously increases content density. On mobile, cards and headings are noticeably more verbose. The alternative (language toggle) would have required JS state for language preference + localStorage persistence + conditional rendering, adding significant complexity for a site with no backend. The "always both" approach is simpler, slightly noisier, and more honest about the bilingual intent.

---

## Phase 4 — Learning Path (5 Modules)

*(merged into Phase 3 commit — see above)*

---

## Phase 5 — Interactive Spec Playground

*(merged into Phase 3 commit — see above)*

---

## Phase 6 — Meta-Case: How This Site Was Built

*(merged into Phase 3 commit — see above)*

---

## Phase 7 — Polish, Animations & Final QA

*(to be filled in after Phase 7)*

---

## Project Retrospective

*(to be filled in after Phase 7)*
