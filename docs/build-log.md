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

*(to be filled in after Phase 2)*

---

## Phase 3 — Hero + Conceptual Intro

*(to be filled in after Phase 3)*

---

## Phase 4 — Learning Path (5 Modules)

*(to be filled in after Phase 4)*

---

## Phase 5 — Interactive Spec Playground

*(to be filled in after Phase 5)*

---

## Phase 6 — Meta-Case: How This Site Was Built

*(to be filled in after Phase 6)*

---

## Phase 7 — Polish, Animations & Final QA

*(to be filled in after Phase 7)*

---

## Project Retrospective

*(to be filled in after Phase 7)*
