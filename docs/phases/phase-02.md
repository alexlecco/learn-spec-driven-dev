# Phase 02 — Design System & Shell

## Spec

```
SPEC: Design System & Page Shell
Goal: Establish all visual design tokens, base styles, and the navigation
      shell so that every subsequent phase has a consistent foundation to
      build on without re-defining colors, spacing, or layout primitives.
Users: Developers (building future phases); all visitors (experiencing the result)
Acceptance criteria:
- AC1: tokens.css defines all color, spacing, typography, radius, and transition
       values as CSS custom properties — dark mode default, light mode override
- AC2: base.css provides a browser reset, global typography scale,
       skip-to-content link, and global focus ring
- AC3: layout.css provides .container, .section, .grid-2, .grid-3, .bento,
       .pane-layout utilities — all mobile-first
- AC4: components.css defines nav, buttons, cards, badges, modal, footer,
       progress bar, accordion, inspect button, and score meter
- AC5: animations.css defines aurora keyframes, scroll entry animations,
       typewriter cursor, confetti, and prefers-reduced-motion disabling
- AC6: index.html has all semantic landmarks with correct section IDs and ARIA
- AC7: Nav is functional: scroll behavior, hamburger menu, theme toggle
- AC8: Footer is visible with Built with SDD text and links
Out of scope:
- Any section content (hero, concept, learn, playground, meta)
- Real animation behavior (JS stubs only)
```

## Decisions Made

CSS tokens use semantic prefixes (--color-accent not --purple-500) because the
accent color carries meaning. Aurora uses three CSS-only blurred divs at different
animation durations to create organic drift. Theme is stored in sdd_theme localStorage
key and applied via data-theme on the html element.

## Trade-offs

Overlay mobile menu over side drawer: simpler, no layout shift, matches bold style.
Separate CSS files by concern over single stylesheet: each file stays small and focused.
