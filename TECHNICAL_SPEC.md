# Hello Tagbilaran — Technical Specification

## Required stack

- Next.js with App Router
- React
- TypeScript in strict mode
- Tailwind CSS plus CSS custom properties for design tokens
- MapLibre GL JS for the enhanced interactive map
- A React-compatible animation library only where CSS and native browser APIs are insufficient

Use the latest stable compatible releases at implementation time. Do not pin guessed versions in planning documents.

## Rendering strategy

- Use Server Components for pages, editorial content, navigation shells, and place detail content.
- Use Client Components for scroll progress, saved-place state, filters, the map, gesture handling, and itinerary interactions.
- Dynamically import the WebGL map with server-side rendering disabled.
- Render a complete searchable place list before the map enhancement loads.

## Suggested routes

```text
app/
  page.tsx                  # story landing and transition
  explore/page.tsx          # map + synchronized results list
  places/[slug]/page.tsx    # indexable place detail
  eat/page.tsx
  stay/page.tsx
  events/page.tsx
  plan/page.tsx
  stories/[slug]/page.tsx
  accessibility/page.tsx
```

## Suggested source structure

```text
src/
  components/
    story/
    map/
    places/
    itinerary/
    ui/
  content/
    history.ts
    places.ts
    events.ts
    stories.ts
  lib/
    geo.ts
    filters.ts
    itinerary.ts
    validation.ts
  styles/
    paper.css
    tokens.css
  types/
    content.ts
public/
  images/
  textures/
  illustrations/
```

If the repository uses a root-level layout without `src`, follow the existing convention rather than moving everything.

## State

- Use URL search parameters for map filters and selected category.
- Use local storage for saved places and passport progress in the prototype.
- Keep persisted state versioned and defensively parsed.
- Do not require login for basic planning.

## Map behavior

- Center on verified Tagbilaran coordinates supplied in content data.
- Use GeoJSON generated from typed place data.
- Synchronize marker selection with the results list and URL.
- Cluster markers at low zoom if density warrants it.
- Disable scroll zoom until the user intentionally focuses the map; use cooperative gestures.
- Include visible attribution required by the selected tile provider.
- Provide “View as list” and “Open directions” options.
- Never ship demo tile endpoints as production infrastructure.

## Story implementation

- Use semantic `article`, `section`, headings, figures, and captions.
- Use Intersection Observer for chapter progress.
- Prefer CSS `position: sticky`, transforms, and scroll-linked progressive enhancement.
- Keep the history readable when scripts fail.
- The leftward transition must have a normal link/button fallback to `/explore`.

## Performance targets

- Aim for Core Web Vitals in the “good” range on mid-tier mobile hardware.
- Keep the initial page free from the map bundle.
- Lazy-load below-the-fold media.
- Use responsive AVIF/WebP images where appropriate.
- Avoid autoplaying audio or video.
- Keep texture assets small and repeatable.

## Accessibility

- Meet WCAG 2.2 AA as the baseline.
- Provide skip links, landmarks, logical headings, visible focus, and meaningful button labels.
- All drag/swipe interactions require button and keyboard alternatives.
- Announce filter-result counts and saved-place changes using restrained live regions.
- Audio stories require transcripts and manual playback.
- Do not use horizontal scroll as the only way to access content.

## SEO and sharing

- Generate route metadata and structured data for tourist attractions, restaurants, lodging, events, and breadcrumbs where verified.
- Create canonical URLs and share cards.
- Make place pages crawlable independently of the map.
- Add a sitemap and robots configuration before production release.

## Testing

- Unit-test filters, geographic scope labels, itinerary rules, and content validation.
- Component-test navigation, place cards, filters, and save behavior.
- End-to-end test the story-to-map route, keyboard map alternative, mobile controls, and reduced-motion mode.
- Add automated accessibility checks, then perform manual keyboard and screen-reader smoke tests.

## First implementation milestone

1. Project shell, fonts, tokens, and paper texture system.
2. Responsive header and paper-tab navigation.
3. Five-chapter landing-page prototype using placeholder/licensed-safe imagery.
4. Accessible story-to-map transition.
5. `/explore` with typed sample data, filters, synchronized list, and MapLibre enhancement.
6. One reusable place detail page.
7. Lint, type-check, responsive QA, and accessibility QA.

