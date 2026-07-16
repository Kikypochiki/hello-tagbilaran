export type GeographicScope = "tagbilaran" | "nearby" | "bohol-day-trip";

export type PlaceCategory =
  | "history-culture"
  | "faith-architecture"
  | "food-drink"
  | "accommodation"
  | "shopping-market"
  | "outdoors"
  | "event"
  | "visitor-essential";

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface AccessibilityInfo {
  stepFreeAccess?: boolean;
  accessibleRestroom?: boolean;
  seatingAvailable?: boolean;
  sensoryNotes?: string;
  mobilityNotes?: string;
  verificationNotes?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  socialUrl?: string;
}

export interface OpeningHours {
  timezone: "Asia/Manila";
  displayText: string;
  notes?: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
  rights?: string;
  date?: string;
}

export interface SourceRecord {
  title: string;
  url?: string;
  publisher?: string;
  accessedAt: string;
  notes?: string;
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: PlaceCategory;
  scope: GeographicScope;
  summary: string;
  story?: string;
  /** Omitted in the prototype until a source-backed coordinate is available. */
  coordinates?: Coordinates;
  /** Source-provided directions link. Omit when the source does not publish one. */
  directionsUrl?: string;
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
  verificationStatus: "source-reviewed" | "needs-local-verification";
}

export interface HistoryChapter {
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
