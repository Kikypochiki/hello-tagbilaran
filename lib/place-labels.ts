import type { GeographicScope, PlaceCategory } from "@/types/content";

export const scopeLabels: Record<GeographicScope, string> = {
  tagbilaran: "Tagbilaran City",
  nearby: "Nearby",
  "bohol-day-trip": "Bohol Day Trip",
};

export const categoryLabels: Record<PlaceCategory, string> = {
  "history-culture": "History & Culture",
  "faith-architecture": "Faith & Architecture",
  "food-drink": "Food & Drink",
  accommodation: "Hotels & Stays",
  "shopping-market": "Shopping & Markets",
  outdoors: "Parks & Viewpoints",
  event: "Events & Festivals",
  "visitor-essential": "Visitor Essentials",
};

export const categoryDescriptions: Record<PlaceCategory, string> = {
  "history-culture": "Museums, monuments, and civic landmarks",
  "faith-architecture": "Cathedrals, parish churches, and sacred spaces",
  "food-drink": "Restaurants, cafés, and local dining",
  accommodation: "Hotels, inns, and coastal resorts",
  "shopping-market": "Malls, public markets, and everyday retail",
  outdoors: "Waterfront parks, hills, and open-air stops",
  event: "Verified celebrations and seasonal gatherings",
  "visitor-essential": "Practical services for navigating the city",
};

export const categoryOrder = Object.keys(categoryLabels) as PlaceCategory[];
