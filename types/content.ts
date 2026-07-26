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

export interface StreetViewReference {
  /** Exact capture position of the reviewed panorama. */
  coordinates: Coordinates;
  /**
   * Audit reference only. Google panorama IDs are not passed to the keyless
   * embed because they are not guaranteed to remain reusable across sessions.
   */
  panoId: string;
  /** Capture month, constrained to the approved 2023-2026 window. */
  captureDate: `${2023 | 2024 | 2025 | 2026}-${string}`;
  provider: "Google Maps";
  contributor: string;
  /** The venue itself or the nearby road represented by the panorama. */
  label: string;
  /** Initial compass heading used by the keyless embed. */
  heading?: number;
  /** Date the panorama, venue match, and capture date were last reviewed. */
  verifiedAt: string;
  /** Whether the panorama depicts the venue or a reviewed nearby road. */
  match: "exact-venue" | "nearby-road";
  /** Required for nearby-road fallbacks and measured from the listing coordinates. */
  distanceMeters?: number;
  /** Review again after this date and hide the action when overdue. */
  reviewDueAt: string;
}

export interface PlaceVerification {
  identity: "source-reviewed" | "locally-confirmed" | "needs-confirmation";
  location: "source-reviewed" | "locally-confirmed" | "unverified";
  operatingStatus: "reviewed-active" | "needs-confirmation";
  mediaRights: "cleared" | "needs-permission" | "not-applicable";
  reviewedAt: string;
  reviewDueAt: string;
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
  sourceUrl?: string;
  licenseUrl?: string;
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
  /**
   * Omitted unless a 2023-2026 Google Maps panorama has passed a manual
   * resolution, stitching, framing, recency, and proximity review.
   * Exact venue imagery is preferred; a clearly labelled nearby-road
   * panorama is allowed when no qualifying exact view exists.
   */
  streetView?: StreetViewReference;
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
  verification: PlaceVerification;
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
  visualMode:
    | "coastal-chart"
    | "memory-folio"
    | "town-ledger"
    | "mended-archive"
    | "city-contact-sheet";
}
