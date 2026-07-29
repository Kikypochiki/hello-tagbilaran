# Hello Tagbilaran

**Release 2.0.0**

Hello Tagbilaran is an independent, editorial city guide for Tagbilaran City,
Bohol. It combines a scroll-driven paper-journal history, a three-dimensional
city atlas, barangay and place discovery, reviewed Street View, scenario-based
hazard maps, and a signed project colophon.

The project presents Tagbilaran as a destination with its own history,
neighborhoods, public places, food, and everyday city life—not merely as a
gateway to the rest of Bohol.

## Release 2 features

- Five-chapter, scroll-driven living archive with accessible reduced-motion
  behavior.
- MapLibre city atlas with locally stored building geometry and subtle 3D
  extrusion.
- Searchable guide containing 38 reviewed place records.
- Directory for all 15 Tagbilaran barangays with PSGC codes, population data,
  city-directory information, and indicative boundaries.
- Place modals with editorial descriptions, verification notes, imagery, and
  reviewed Street View where available.
- Dedicated hazard-assessment map for 100-year flood, landslide susceptibility,
  and Storm Surge Advisory 4 scenarios.
- About page for developer Dohn Michael Varquez with an optional GCash support
  flow.
- Responsive layouts, keyboard navigation, visible focus, reduced-motion
  support, and non-map fallbacks for essential content.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Five-chapter living archive and story experience |
| `/explore` | 3D city atlas, place guide, barangay directory, and Street View |
| `/hazard-assessment` | Scenario-based hazard map and source information |
| `/about` | Developer profile, project context, and optional support |

## Technology

- Next.js App Router 16
- React 19 and TypeScript
- MapLibre GL JS
- GSAP for progressive story motion
- Local typed content, GeoJSON hazard layers, and vector building tiles
- Vitest, Playwright, and Axe accessibility checks

Core editorial content remains server-rendered. Maps, motion, and Street View are
progressive enhancements rather than requirements for reading the guide.

## Local development

Requirements:

- Node.js 20.9 or newer
- npm 11 or a compatible npm release

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Requirement | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required for public indexing | Production origin used by canonical URLs, robots, and the sitemap |
| `NEXT_PUBLIC_MAP_TILE_URL` | Optional | Replaceable raster tile template; defaults to OpenStreetMap |
| `NEXT_PUBLIC_ENABLE_LEGACY_SW_CLEANUP` | Migration only | Removes service workers left by an older prototype |

Until `NEXT_PUBLIC_SITE_URL` is configured with a production HTTPS origin,
generated robots metadata disallows indexing. This prevents localhost canonicals
from being published accidentally.

## Validation

```bash
npm run lint
npm run typecheck
npm run content:validate
npm run test:unit
npm run build
npm run test:e2e
```

`npm run validate` runs the complete release sequence. Browser tests use
installed Chrome locally and Playwright Chromium in CI.

Run `npm run images:optimize` after adding large JPEG photography. It recompresses
files above 350 KB without enlarging them.

## Deploying to Vercel

1. Import the repository and use `main` as the production branch.
2. Keep the detected framework preset as **Next.js**.
3. Use Node.js 20.9 or newer.
4. Add `NEXT_PUBLIC_SITE_URL` with the final HTTPS Vercel or custom-domain URL.
5. Optionally configure `NEXT_PUBLIC_MAP_TILE_URL`.
6. Set `NEXT_PUBLIC_ENABLE_LEGACY_SW_CLEANUP=true` for the first migration
   deployment. After confirming old registrations are gone, set it to `false`.
7. Use the standard `npm run build` command.

No custom `vercel.json` is required. The Next.js adapter handles the static
routes, image optimization, security headers, sitemap, and robots metadata.

## Content and publication policy

- Place identity, location, operating status, media rights, and review dates are
  tracked separately.
- Unknown hours, contacts, prices, schedules, and accessibility conditions are
  omitted rather than invented.
- The Philippine Statistics Authority PSGC record is canonical for Tagbilaran's
  15 barangays and codes. Boundary geometry remains indicative.
- `npm run content:validate` reports stale reviews, missing evidence, invalid
  coordinates, media-rights issues, expired Street View, and incomplete owner or
  support configuration.
- `CONTENT_STRICT=1 npm run content:validate` converts warnings into release
  failures.

The normal production build currently succeeds, but several place photographs
still carry media-permission warnings. Resolve those permissions and reuse terms
before treating the guide as fully rights-cleared.

## Street View policy

Street View is limited to manually reviewed panoramas captured from 2023 through
2026. Exact venue imagery is preferred. If none qualifies, a panorama on a road
within 250 metres may be used and is labeled as a nearby-road view.

Each record stores its capture date, contributor, match type, review date, and
review deadline. Expired records automatically lose the Street View action. The
viewer uses a keyless Google Maps embed opened only after visitor action;
Google's attribution and controls remain visible.

## Hazard-data policy

The local hazard GeoJSON files are display-optimized derivatives of Project NOAH
Bohol datasets:

- 100-year rainfall return-period flood hazards
- Landslide susceptibility
- Storm Surge Advisory 4

The layers are clipped and simplified without combining or rescoring hazard
classifications. They are scenario maps—not live warnings, emergency
instructions, safety guarantees, or property-level assessments.

Source details, transformation notes, and Open Data Commons Open Database License
1.0 terms are documented in
[`public/data/hazards/README.md`](public/data/hazards/README.md).

## Project status

Hello Tagbilaran is independently developed by
[Dohn Michael Varquez](https://github.com/Kikypochiki), a fourth-year Computer
Science student at Visayas State University. The project is not affiliated with
or endorsed by the City Government of Tagbilaran, UP NOAH, Google, GCash, or
businesses included in the guide.
