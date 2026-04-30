# Master Spec — Learn Spec-Driven Development

## Product Vision

"Learn Spec-Driven Development" is an interactive educational website that teaches mid and senior developers how to adopt Spec-Driven Development (SDD) in their teams. The site is not a passive article collection — it is a live, self-referential case study: every section was specced before it was coded, and every spec is exposed for visitors to inspect. The site teaches SDD by being SDD.

The experience is structured as a guided learning path (5 modules), an interactive spec playground with real-time validation, and a transparent meta-layer that shows the entire build process — including the specs, decisions, and retrospectives used to build the very page you are reading. Visitors leave with both conceptual clarity and practical tools they can carry into their teams the next morning.

---

## Target User Persona

**Name:** Marco
**Experience:** 5 years as a software developer, currently in a mid/senior role
**Team context:** Works on a 4–8 person agile team that ships features fast but frequently finds itself debugging misaligned expectations, rework, and vague acceptance criteria
**Goal:** Introduce a lightweight, spec-first process that his team will actually adopt — not a heavyweight methodology, not another Jira ticket template, but a real cognitive shift
**Pain points:**
- Has read about TDD, BDD, and DDD but finds them too abstract or heavyweight for his team's pace
- Has seen features get built "correctly" but solve the wrong problem
- Doesn't know how to make specs feel natural vs. bureaucratic
- Wants concrete examples, not theory

**What Marco needs from this site:**
- A clear definition of SDD that he can explain to his team in 2 minutes
- Real examples of specs (good and bad) he can reference
- A playground where he can practice writing specs and get feedback
- A proof of concept — seeing SDD used to build a real product reassures him it works

---

## Goals

### Primary Goals
1. Teach the SDD methodology through a structured 5-module learning path
2. Provide an interactive spec playground with real-time quality validation
3. Demonstrate SDD credibility by building the site itself with SDD and exposing every spec

### Non-Goals
- Teaching agile/scrum/kanban methodology
- Providing team management or project planning advice
- Offering a SaaS product or spec storage tool
- Supporting user accounts, sign-up, or backend services
- Covering Gherkin/BDD syntax (related but distinct methodology)

---

## Information Architecture

```
/ (index.html — single-page application)
│
├── #home       → Hero: headline, CTAs, animated spec snippet
├── #concept    → "What is SDD?": 3-card bento + comparison strip
├── #learn      → 5-module learning path with progress tracking
├── #playground → Interactive spec editor + real-time validation panel
└── #meta       → "How this site was built": timeline, inspect mode, build log
```

**Navigation links:**
- Home → #home
- Learn → #learn
- Playground → #playground
- How this was built → #meta

---

## Design Principles

1. **Show, don't tell.** Every concept is demonstrated with a real, working example — no lorem ipsum, no abstract diagrams without concrete grounding.

2. **The site is the proof.** The credibility of SDD comes from the site itself being built with SDD. The meta-layer is not an afterthought — it is the primary differentiator.

3. **Low friction, high signal.** The visitor should be able to understand the core idea in under 2 minutes and write their first spec in under 5. Remove every obstacle between "I want to learn this" and "I just did it."

4. **Progressive depth.** The homepage surface is immediately comprehensible; deeper layers (module content, meta specs, build log) reward exploration without overwhelming on first visit.

5. **Design for real use.** The playground output (spec templates, validation feedback) should be directly usable in a real team context — not just a toy. If Marco copies a spec from the playground into his next ticket, the site has succeeded.

---

## Technical Constraints

- **No build tools.** The site runs directly from `index.html` via `open index.html`. No webpack, Vite, or bundlers.
- **No frameworks.** Vanilla HTML5, CSS3, and JavaScript only. No React, Vue, Angular, or jQuery.
- **No backend.** All state is localStorage. No API calls except fetching local markdown files.
- **External CDN only for fonts/icons:** Google Fonts (Inter, Syne, JetBrains Mono), Phosphor Icons.
- **Mobile-first, dark-mode-first.** Base styles target 375px; light mode is an override.
- **Accessibility baseline:** WCAG AA contrast ratios, visible focus rings, semantic HTML, ARIA where needed.
- **Browser support:** Last 2 versions of Chrome, Firefox, Safari, Edge.

---

## Success Metrics

1. **Engagement depth:** A visitor completes at least 3 of 5 learning modules (measured via localStorage completion events logged to console — no analytics server).
2. **Playground interaction:** A visitor submits at least one spec to the validator and achieves a score ≥ 60.
3. **Meta exploration:** A visitor opens the "Inspect spec" mode and views at least one section's spec.
4. **Comprehension signal:** The "What is SDD?" section's comparison strip communicates clearly enough that Marco can describe SDD in one sentence to a colleague without re-reading.
5. **Zero build errors:** The site opens in any modern browser without console errors, layout breaks, or accessibility violations flagged by axe/Lighthouse.
