# Learn Spec-Driven Development

> **This site was built with Spec-Driven Development.**
> Every section was specced before it was coded. Every spec is visible.

An interactive educational website that teaches mid and senior developers how to adopt **Spec-Driven Development (SDD)** in their teams — by being a live example of SDD itself.

---

## What is Spec-Driven Development?

SDD is a lightweight practice: before writing any code, you write a structured spec that defines the goal, the users, the acceptance criteria, and what's out of scope. Then you build to the spec. Then you write a brief retrospective that feeds the next spec.

That's it. No heavyweight methodology. No special tooling. Just: **write the spec first, always.**

---

## What's on the site

- **Learning path** — 5 interactive modules covering spec anatomy, writing good ACs, granularity, retros, and team adoption
- **Live playground** — Write a spec and get real-time quality feedback (structure, AC quality, goal clarity, scope definition)
- **Meta-case** — The entire build process is exposed: every phase's spec, decisions, and retrospective are readable on-page. You can inspect the spec for any section by clicking "Inspect spec."

---

## Tech stack

- HTML5 + CSS3 + Vanilla JavaScript (no build tool, no framework)
- Google Fonts: Inter, Syne, JetBrains Mono
- Phosphor Icons (CDN)
- Zero dependencies. Zero bundlers.

---

## Run locally

```bash
open index.html
```

No installation. No `npm install`. Just open the file.

For the build log reader (fetches a local markdown file), use a local server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Build log

Every phase of development is documented in [`/docs/build-log.md`](docs/build-log.md), including the spec used, decisions made, and trade-offs considered.

→ [View the full build log](docs/build-log.md)

---

## Lessons learned

1. **Writing the spec first surfaces ambiguity before it becomes code.** In every phase, the act of writing acceptance criteria revealed at least one assumption that would have caused rework if discovered mid-implementation.

2. **The meta-layer changes how you write every component.** Knowing that every HTML section would expose its own spec made specs more honest — there was no hiding vague goals behind "it'll be obvious when I see it."

3. **SDD's real value is team alignment, not individual productivity.** A solo dev writing specs gains some clarity. A team writing specs together gains shared mental models. The playground is designed so Marco can walk his team through it in a 30-minute kickoff session.

---

## Contributing

This repo is a reference implementation of SDD. If you find a section where the code diverged from the spec, open an issue — that gap is itself a lesson worth documenting.

---

*Built with [Spec-Driven Development](https://github.com/alexlecco/learn-spec-driven-dev) · [View build log](docs/build-log.md)*
