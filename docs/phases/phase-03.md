# Phase 03 — Hero + Conceptual Intro (EN/ES Bilingual)

## Spec

```
SPEC: Hero Section + Concept Introduction (Bilingual)
Goal: Immediately communicate what SDD is in both English and Spanish,
      creating momentum to start learning with the full bilingual pattern
      established for all subsequent content.
Users: First-time visitors (mid/senior devs), Spanish and English speakers
Acceptance criteria:
- AC1: Hero has aurora CSS background, bilingual headline, bilingual CTAs
- AC2: Typewriter effect on desktop cycles 3 real spec examples
- AC3: Scroll badge fades in after 1.5s via CSS animation
- AC4: Concept section has 3-card grid (The Problem, The Spec, The Loop)
- AC5: Each concept card is bilingual with icon, title, body, and meta-spec
- AC6: Comparison strip shows 5 dimensions, bilingual labels, colored bars
- AC7: Bilingual CSS pattern (.bilingual__en, .bilingual__es) established
        and applied site-wide
Out of scope:
- Language toggle (both always shown simultaneously)
- RTL language support
```

## Key Decisions

### EN/ES display strategy
The user requested "C" — both languages simultaneously. Rather than a toggle,
the `.bilingual` pattern shows EN at full size with `.bilingual__es` directly
below in `--text-secondary` color with a small "es" tag. No JS needed for the
language display — it's pure CSS. This decision eliminates the complexity of
language state management and makes the bilingual nature of the site immediately
apparent on first render.

### Why the "es" tag prefix?
The `::before` pseudo-element on `.bilingual__es` adds a small monospace "es" 
badge to signal the language without requiring a separate HTML element per 
translation. It's decorative but functional — quickly scannable as you read.

### Typewriter on desktop only
The code panel is `display:none` on mobile and shown on desktop via the 
two-column hero grid. This avoids the cognitive overload of showing both 
the bilingual headline AND the animated code on small screens.

### Aurora: pure CSS
Three overlapping blurred divs with different animation durations (12s, 15s, 18s)
create organic drift without synchronization. The SVG noise filter is inlined
to avoid an HTTP request.

## Content note
All educational content (module texts, comparison strip labels, card bodies) was
written in both EN and ES simultaneously. No translation was done post-hoc — both
versions were authored as primary content. This revealed that some EN idioms don't
translate directly (e.g. "spec-first" became "el spec primero" rather than a
literal word-for-word translation).
