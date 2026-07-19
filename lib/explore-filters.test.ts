import { describe, expect, it } from "vitest";
import { places } from "@/content/places";
import { filterPlaces } from "@/lib/explore-filters";

describe("filterPlaces", () => {
  it("matches names, barangays, and categories", () => {
    const results = filterPlaces(places, {
      category: null,
      query: "museum",
      savedOnly: false,
      savedIds: new Set(),
    });
    expect(results.some((place) => place.slug === "national-museum-bohol")).toBe(true);
  });

  it("combines category and saved-only filters", () => {
    const saved = new Set(["chido-cafe", "kew-hotel"]);
    const results = filterPlaces(places, {
      category: "food-drink",
      query: "",
      savedOnly: true,
      savedIds: saved,
    });
    expect(results.map((place) => place.id)).toEqual(["chido-cafe"]);
  });
});
