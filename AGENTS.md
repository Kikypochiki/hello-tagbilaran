# Hello Tagbilaran — Codex Project Instructions

## Mission

Build a polished tourism guide for Tagbilaran City, Bohol. The experience should present Tagbilaran as a destination with its own history, food, culture, and everyday city life—not merely as a gateway to attractions elsewhere in Bohol.

## Required reading

Before changing product code, read:

1. `PROJECT_BRIEF.md`
2. `DESIGN.md`
3. `TECHNICAL_SPEC.md`
4. `CONTENT_MODEL.md`

Use `INITIAL_PROMPT.md` as the kickoff prompt for a new Codex implementation session.

## Non-negotiable experience

- The opening experience is a vertical, scroll-driven history presented as an unfolding paper travel journal.
- At the end of the history, the experience transitions horizontally to the left into an interactive city map.
- The interface uses aged paper, postcards, folds, stamps, tape, ink, and restrained handmade details.
- Primary accent colors are sunlight yellow and heritage green.
- Mobile must use an obvious button in addition to swipe gestures.
- Respect `prefers-reduced-motion`; the entire experience must remain usable without animation.
- Clearly label every place as `Tagbilaran City`, `Nearby`, or `Bohol Day Trip`.
- Never publish invented prices, schedules, coordinates, phone numbers, or operating hours.

## Engineering rules

- Use Next.js App Router, React, and TypeScript.
- Prefer React Server Components. Add `"use client"` only where browser APIs or interaction require it.
- Keep content separate from presentation using typed local data for the first release.
- Use accessible semantic HTML, visible focus styles, keyboard operation, and sufficient contrast.
- Optimize images with `next/image` and fonts with `next/font`.
- Do not hide core content behind canvas, WebGL, or JavaScript-only effects.
- Treat the interactive map as progressive enhancement and provide a synchronized list view.
- Avoid a generic tourism template, glassmorphism, neon gradients, and excessive rounded cards.

## Completion standard

For every implementation milestone:

- Run lint, type checks, and available tests.
- Check desktop and mobile layouts.
- Verify keyboard navigation and reduced-motion behavior.
- Report assumptions and any content that still requires local verification.
