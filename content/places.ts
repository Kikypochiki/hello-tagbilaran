import type { Place } from "@/types/content";

const contentReviewSource = {
  title: "Hello Tagbilaran prototype content brief",
  publisher: "Hello Tagbilaran",
  accessedAt: "2026-07-16",
  notes: "Editorial scope only; local verification is still required.",
};

export const places: Place[] = [
  {
    id: "st-joseph-cathedral",
    slug: "st-joseph-cathedral",
    name: "St. Joseph the Worker Cathedral",
    category: "faith-architecture",
    scope: "tagbilaran",
    summary:
      "A prototype heritage listing. The final historical narrative and visitor guidance are intentionally withheld until local review.",
    story:
      "This future place story will connect the cathedral to the surrounding civic district using cited history and commissioned photography.",
    coordinates: { longitude: 123.85571, latitude: 9.6392 },
    features: ["Heritage research planned", "City-center story"],
    accessibility: {
      verificationNotes:
        "Access conditions have not been assessed. Contact the venue directly before relying on access information.",
    },
    images: [],
    sources: [
      {
        title: "Tagbilaran Cathedral",
        url: "https://www.wikidata.org/wiki/Q31440684",
        publisher: "Wikidata",
        accessedAt: "2026-07-16",
        notes:
          "Prototype coordinate source. Confirm against an authoritative local source before publication.",
      },
    ],
    verifiedAt: "2026-07-16",
    featured: true,
    verificationStatus: "needs-local-verification",
  },
  {
    id: "national-museum-bohol",
    slug: "national-museum-bohol",
    name: "National Museum of the Philippines – Bohol",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "The Bohol Area Museum occupies the former Provincial Capitol building in Tagbilaran City.",
    story:
      "The official museum account will anchor this listing; exhibition details and practical visitor information still need a final publication check.",
    coordinates: { longitude: 123.85655, latitude: 9.64028 },
    address: "Km. 0, Carlos P. Garcia Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    features: ["Official source reviewed", "Practical details to recheck"],
    images: [],
    sources: [
      {
        title: "Bohol – National Museum",
        url: "https://www.nationalmuseum.gov.ph/our-museums/regional-area-and-site-museums/bohol/",
        publisher: "National Museum of the Philippines",
        accessedAt: "2026-07-16",
        notes: "Official page used for the institution description and address.",
      },
      {
        title: "National Museum of the Philippines – Bohol map feature",
        url: "https://www.openstreetmap.org/way/242261499",
        publisher: "OpenStreetMap contributors",
        accessedAt: "2026-07-16",
        notes: "Prototype coordinate source; confirm locally before launch.",
      },
    ],
    verifiedAt: "2026-07-16",
    featured: true,
    verificationStatus: "source-reviewed",
  },
  {
    id: "sandugo-heritage-site",
    slug: "sandugo-heritage-site",
    name: "Blood Compact / Sandugo heritage site",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "A required prototype listing. Site interpretation, naming, and map position await authoritative local review.",
    features: ["Interpretation review needed", "Coordinate withheld"],
    images: [],
    sources: [contentReviewSource],
    verificationStatus: "needs-local-verification",
  },
  {
    id: "tagbilaran-tourist-port",
    slug: "tagbilaran-tourist-port",
    name: "Tagbilaran City Tourist Port",
    category: "outdoors",
    scope: "tagbilaran",
    summary:
      "A source-located waterfront gateway included as a prototype city-arrival story; schedules and transport advice remain withheld.",
    coordinates: { longitude: 123.84676, latitude: 9.64886 },
    features: ["Waterfront arrival story", "Schedules withheld"],
    images: [],
    sources: [
      {
        title: "Tagbilaran City Tourist Port map listing",
        url: "https://maps.apple.com/place?auid=7571387299938306828&lsp=9902",
        publisher: "Apple Maps",
        accessedAt: "2026-07-16",
        notes: "Used only as a prototype coordinate source; confirm locally before launch.",
      },
    ],
    verifiedAt: "2026-07-16",
    verificationStatus: "needs-local-verification",
  },
  {
    id: "cogon-public-market",
    slug: "cogon-public-market",
    name: "Cogon Public Market",
    category: "shopping-market",
    scope: "tagbilaran",
    summary:
      "A source-located market listing awaiting local reporting, maker stories, and a fresh check of practical visit details.",
    coordinates: { longitude: 123.85262, latitude: 9.65138 },
    features: ["Local reporting needed", "No hours published"],
    images: [],
    sources: [
      {
        title: "Cogon Public Market",
        url: "https://www.openstreetmap.org/node/678534482",
        publisher: "OpenStreetMap contributors",
        accessedAt: "2026-07-16",
        notes: "Prototype name and coordinate source; confirm locally before launch.",
      },
    ],
    verifiedAt: "2026-07-16",
    verificationStatus: "needs-local-verification",
  },
  {
    id: "neighborhood-cafe",
    slug: "neighborhood-cafe",
    name: "Neighborhood café profile",
    category: "food-drink",
    scope: "tagbilaran",
    summary:
      "A clearly marked prototype slot—not a business recommendation—awaiting selection and fresh verification.",
    features: ["Business selection pending", "No prices or hours published"],
    images: [],
    sources: [contentReviewSource],
    verificationStatus: "needs-local-verification",
  },
  {
    id: "independent-city-stay",
    slug: "independent-city-stay",
    name: "Independent city stay profile",
    category: "accommodation",
    scope: "tagbilaran",
    summary:
      "A prototype accommodation slot. No property, price, booking, or accessibility claims have been published.",
    features: ["Property selection pending", "No booking claims"],
    images: [],
    sources: [contentReviewSource],
    verificationStatus: "needs-local-verification",
  },
  {
    id: "nearby-heritage-extension",
    slug: "nearby-heritage-extension",
    name: "Nearby heritage extension",
    category: "faith-architecture",
    scope: "nearby",
    summary:
      "A prototype slot showing how places outside city limits will be clearly separated from Tagbilaran City listings.",
    features: ["Specific place pending", "Nearby scope example"],
    images: [],
    sources: [contentReviewSource],
    verificationStatus: "needs-local-verification",
  },
  {
    id: "bohol-day-trip",
    slug: "bohol-day-trip",
    name: "Bohol day-trip extension",
    category: "outdoors",
    scope: "bohol-day-trip",
    summary:
      "A prototype slot demonstrating the day-trip label; a specific place and all travel details remain unselected.",
    features: ["Specific place pending", "Travel details withheld"],
    images: [],
    sources: [contentReviewSource],
    verificationStatus: "needs-local-verification",
  },
  {
    id: "tagbilaran-city-hall",
    slug: "tagbilaran-city-hall",
    name: "Tagbilaran City Hall",
    category: "visitor-essential",
    scope: "tagbilaran",
    summary:
      "A source-located civic reference point. Specific visitor services, contacts, and access conditions still require confirmation.",
    coordinates: { longitude: 123.86606, latitude: 9.65389 },
    features: ["Civic reference point", "Service details withheld"],
    images: [],
    sources: [
      {
        title: "City Government of Tagbilaran",
        url: "https://tagbilaran.gov.ph/",
        publisher: "City Government of Tagbilaran",
        accessedAt: "2026-07-16",
        notes: "Official institution source.",
      },
      {
        title: "Tagbilaran City Hall map feature",
        url: "https://www.openstreetmap.org/node/4481562289",
        publisher: "OpenStreetMap contributors",
        accessedAt: "2026-07-16",
        notes: "Prototype coordinate source; confirm locally before launch.",
      },
    ],
    verifiedAt: "2026-07-16",
    verificationStatus: "needs-local-verification",
  },
];

export function getPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}
