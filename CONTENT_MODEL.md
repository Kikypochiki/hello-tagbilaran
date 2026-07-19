# Hello Tagbilaran — Content Model

## Geographic scope

Every location must declare one of:

```ts
type GeographicScope = "tagbilaran" | "nearby" | "bohol-day-trip";
```

Display these publicly as “Tagbilaran City,” “Nearby,” and “Bohol Day Trip.”

## Place

```ts
type PlaceCategory =
  | "history-culture"
  | "faith-architecture"
  | "food-drink"
  | "accommodation"
  | "shopping-market"
  | "outdoors"
  | "event"
  | "visitor-essential";

interface Place {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  scope: GeographicScope;
  summary: string;
  story?: string;
  coordinates: { longitude: number; latitude: number };
  address?: string;
  barangay?: string;
  visitDurationMinutes?: { min: number; max: number };
  priceLevel?: 0 | 1 | 2 | 3 | 4;
  features: string[];
  accessibility?: AccessibilityInfo;
  localTip?: string;
  contact?: ContactInfo;
  hours?: OpeningHours;
  images: ImageAsset[];
  sources: SourceRecord[];
  verifiedAt?: string;
  featured?: boolean;
}
```

## History chapter

```ts
interface HistoryChapter {
  id: string;
  order: number;
  eyebrow: string;
  title: string;
  dateLabel?: string;
  introduction: string;
  body: string[];
  media: ImageAsset[];
  annotations?: { label: string; text: string }[];
  sources: SourceRecord[];
}
```

## Supporting records

```ts
interface AccessibilityInfo {
  stepFreeAccess?: boolean;
  accessibleRestroom?: boolean;
  seatingAvailable?: boolean;
  sensoryNotes?: string;
  mobilityNotes?: string;
  verificationNotes?: string;
}

interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  socialUrl?: string;
}

interface OpeningHours {
  timezone: "Asia/Manila";
  displayText: string;
  notes?: string;
}

interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
  rights?: string;
  date?: string;
}

interface SourceRecord {
  title: string;
  url?: string;
  publisher?: string;
  accessedAt: string;
  notes?: string;
}
```

## Verification policy

- Coordinates, hours, prices, contacts, event dates, accessibility claims, and transport information are time-sensitive.
- Store a verification date for time-sensitive fields.
- If data cannot be verified, omit it or label it as needing confirmation; never fabricate a plausible value.
- Prefer official city, provincial tourism, venue, museum, and business sources.
- Keep editorial source notes even if citations are not shown in every compact card.

## Initial content set

Use a small, clearly marked prototype dataset covering:

- St. Joseph the Worker Cathedral
- National Museum Bohol
- Blood Compact/Sandugo heritage site
- A public plaza or waterfront space
- A local market
- Sample accommodations at different price levels
- Sample restaurants or cafés representing different experiences
- A shopping destination
- Visitor essentials

Business entries and all practical data require fresh verification before public launch.

