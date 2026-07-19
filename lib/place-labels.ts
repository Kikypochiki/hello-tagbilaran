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
  accommodation: "Stay",
  "shopping-market": "Shopping & Markets",
  outdoors: "Outdoors & Viewpoints",
  event: "Events & Festivals",
  "visitor-essential": "Visitor Essentials",
};

export const categoryOrder = Object.keys(categoryLabels) as PlaceCategory[];
