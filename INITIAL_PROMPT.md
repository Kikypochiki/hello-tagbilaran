# Initial Codex Prompt

Copy the prompt below into a new Codex session opened at the website repository root.

---

Build the first polished front-end milestone of **Hello Tagbilaran**, a tourism and local-discovery website for Tagbilaran City, Bohol.

First inspect the repository and read `AGENTS.md`, `PROJECT_BRIEF.md`, `DESIGN_SYSTEM.md`, `TECHNICAL_SPEC.md`, and `CONTENT_MODEL.md`. Treat those files as the product source of truth. Preserve any sound existing project conventions and user changes.

The required stack is Next.js App Router, React, TypeScript, and Tailwind CSS. If the repository is empty, scaffold a current stable Next.js project with TypeScript, App Router, Tailwind, ESLint, and an appropriate package manager based on available lockfiles. Use MapLibre GL JS for the enhanced interactive map, loaded only on the client and only on the explore route.

Implement this first milestone:

1. Establish the paper-inspired visual system using CSS variables, warm paper surfaces, subtle grain, heritage green, sunlight yellow, restrained Sandugo red, editorial typography, accessible focus states, and responsive spacing.
2. Build a responsive header using paper-tab navigation.
3. Create the landing page as a five-chapter, vertically scrolling history journal. Use semantic HTML and clearly labeled placeholder content where verified final material is unavailable.
4. Create the signature transition at the end: the paper story folds/slides left into exploration. Provide a visible “Explore the map” button and standard route fallback. Respect `prefers-reduced-motion` and never hijack scrolling.
5. Build `/explore` with typed sample place data, geographic-scope badges, category filters, a synchronized accessible list, and a progressively enhanced MapLibre map. Keep the page useful if the map or JavaScript does not load.
6. Build one reusable `/places/[slug]` detail route using the content model.
7. Persist saved places locally with defensive, versioned storage. Show saves as a restrained rubber-stamp interaction.
8. Add metadata, a strong empty state, loading states, and error boundaries where appropriate.

Quality requirements:

- Make the result feel like a refined Boholano travel journal, not a generic tourism template.
- Do not use glassmorphism, neon gradients, excessive pill shapes, or randomly tilted cards.
- Keep core content available outside canvas/WebGL.
- All swipe and drag interactions need keyboard and button alternatives.
- Meet WCAG 2.2 AA as a baseline.
- Optimize media and keep the map bundle off the landing page.
- Do not invent historical facts, operating hours, prices, coordinates, schedules, contacts, or accessibility claims. Mark prototype data and verification needs explicitly.
- Clearly distinguish Tagbilaran City locations from Nearby and Bohol Day Trip locations.

Work autonomously through implementation and verification. Run lint, type checks, and available tests. Inspect the finished pages at desktop and mobile sizes, fix obvious layout or interaction issues, and summarize what was completed, what was verified, and which content still needs local confirmation.

---

## Optional follow-up prompt

After the first milestone is stable:

> Continue Hello Tagbilaran with the itinerary builder, digital city passport, Then & Now comparison, resident audio stories with transcripts, and festival mode. Re-read the project reference files first. Implement one feature at a time with typed data, accessibility, responsive QA, and tests. Do not add accounts, payments, or a CMS unless explicitly requested.

