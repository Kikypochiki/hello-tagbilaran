# Hello Tagbilaran — Design System

## Creative direction

The interface should feel like a heritage travel journal assembled in Tagbilaran: layered paper, old maps, postcards, archival captions, stamps, tape, pencil notes, and sun-faded ink. It should remain refined, spacious, and readable.

Avoid making every element look torn or tilted. Handmade details should create hierarchy and narrative, not noise.

## Color tokens

The supplied reference image establishes the two primary accents.

```css
:root {
  --sunlight-yellow: #f4c542;
  --heritage-green: #005c09;
  --paper: #f4e8ce;
  --paper-light: #fff9eb;
  --paper-deep: #ddcba8;
  --ink: #26251f;
  --ink-muted: #696253;
  --sandugo-red: #a84332;
  --sea-blue: #477a86;
  --focus: #1f5fbf;
}
```

These two primary values were sampled from `assets/color-reference.png`. The image contains a slight antialiased transition along the color boundary, so use the dominant values above as the canonical tokens.

## Color use

- Paper colors dominate surfaces.
- Heritage green is used for navigation, map structure, headings, and primary actions.
- Sunlight yellow highlights routes, selected filters, dates, and festival details.
- Sandugo red is a limited historical accent.
- Never place yellow body text on a light paper background.
- Interactive states must not rely on color alone.

## Typography

Use locally hosted or `next/font` families with these roles:

- Editorial serif for display titles and history chapters.
- Humanist sans-serif for navigation, descriptions, and map controls.
- Handwritten face only for brief marginal notes, labels, and local tips.

Suggested character: warm, highly legible, and slightly literary. Avoid distressed novelty fonts for body copy.

## Surfaces and materials

- Use CSS gradients, low-opacity noise, and subtle shadow layers for paper depth.
- Keep paper texture lightweight and seamless.
- Use irregular SVG masks sparingly for hero edges and chapter dividers.
- Postcards may rotate by no more than 1–2 degrees.
- Fold lines should be quiet and should never interfere with text.
- Tape, paper clips, and stamps are decorative and `aria-hidden`.

## Component language

### Paper tabs

Primary navigation resembles index tabs. Active state uses heritage green with light paper text. Mobile uses a compact bottom or top tab bar without obscuring content.

### Postcard place card

Contains image, category, geographic scope, name, concise description, practical metadata, Save action, and Directions action. Cards use modest corners rather than pill shapes.

### Rubber-stamp action

Use for Save, Passport, and completion actions. On press, provide a brief scale/ink animation and an equivalent non-motion state.

### Sticky note

Reserved for short verified local tips. Do not use for safety-critical or accessibility information.

### Map marker

Hand-illustrated silhouette inside a high-contrast marker. Selected marker becomes yellow and gains a shape/outline change.

## Motion language

- Scroll reveals should resemble paper being uncovered, not generic fade-ins.
- The history-to-map moment uses a fold/slide transition lasting roughly 700–1000 ms.
- Parallax movement should be subtle and disabled for reduced motion.
- Never hijack scrolling or trap the user in horizontal motion.
- On reduced motion, replace fold animations with immediate state changes or short opacity transitions.

## Responsive behavior

- Desktop: layered editorial spreads with a persistent chapter rail.
- Tablet: simplified spreads and a collapsible filter drawer.
- Mobile: a single-column paper scroll; the map opens through a clear button and supports swipe as an enhancement.
- All tap targets should be at least 44 by 44 CSS pixels.

## Imagery

Prioritize real Tagbilaran photography, licensed archival material, maps, local makers, streets, residents, markets, food, and festivals. Do not let generic beaches or Chocolate Hills imagery define the city experience.

Every image needs rights metadata, credit, alt text, location scope, and an optional historical date.
