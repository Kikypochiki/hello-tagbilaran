# Hello Tagbilaran

An editorial tourism guide for Tagbilaran City, Bohol. The product keeps a focused
three-route structure:

- `/` — five-chapter paper-journal Story
- `/explore` — synchronized place index and MapLibre map
- `/places/[slug]` — independently indexable place details

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and replace `NEXT_PUBLIC_SITE_URL` before a
public deployment. Until it is configured, generated robots metadata prevents
indexing so localhost canonicals cannot be published accidentally.

## Validation

```bash
npm run lint
npm run typecheck
npm run content:validate
npm run test:unit
npm run build
npm run test:e2e
```

`npm run validate` runs the complete sequence. Browser tests use installed Chrome
locally and Playwright Chromium in CI.

Run `npm run images:optimize` after adding large JPEG photography. It recompresses
only files above 350 KB and does not enlarge images.

## Content and publication rules

- Place identity, location, operating status, media rights, and review dates are
  tracked separately.
- Unknown hours, contacts, prices, schedules, and accessibility conditions are
  omitted.
- The Philippine Statistics Authority PSGC record is canonical for Tagbilaran's
  15 barangays and codes. Boundary geometry remains indicative.
- `npm run content:validate` reports stale reviews, missing evidence, invalid
  coordinates, media-rights issues, and expired Street View.
- Set `CONTENT_STRICT=1` in a publication pipeline to convert unresolved warnings
  into release failures.

Current photography remains blocked for a strict public launch until its listed
permissions and reuse terms are resolved. Credits and rights notes remain visible
on place pages while the project is reviewed.

## Street View

Street View is available only for manually reviewed panoramas that depict the
listed venue itself. Nearby imagery is never substituted. Each eligible record
stores its capture position, contributor, capture date, exact-match state, review
date, and six-month review deadline. Expired records automatically lose the
Street View action.

The viewer uses a keyless Google Maps embed opened only after visitor action.
Google's attribution and controls must remain visible.

## Maps and offline behavior

The map source is configurable with `NEXT_PUBLIC_MAP_TILE_URL`; OpenStreetMap
attribution remains visible. The complete searchable list is the accessible and
network-failure fallback.

An older prototype registered a service worker. Keep
`NEXT_PUBLIC_ENABLE_LEGACY_SW_CLEANUP=true` for the first migration deployment,
confirm stale registrations are gone, then set it to `false` and remove the
cleanup component and `public/sw.js` in the following release.
