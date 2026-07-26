import { describe, expect, it } from "vitest";
import { getPlace, places } from "@/content/places";

const refreshedPlaceSlugs = [
  "national-museum-bohol",
  "plaza-rizal",
  "st-joseph-cathedral",
  "carlos-p-garcia-heritage-museum",
  "our-lady-of-lourdes-parish",
  "island-city-mall",
  "bq-mall",
] as const;

describe("place photography", () => {
  it("does not include the removed Baclayon Church listing", () => {
    expect(getPlace("baclayon-church")).toBeUndefined();
    expect(places.some((place) => place.name === "Baclayon Church")).toBe(false);
  });

  it.each(refreshedPlaceSlugs)(
    "keeps a traceable, recent, high-resolution image for %s",
    (slug) => {
      const image = getPlace(slug)?.images[0];

      expect(image).toBeDefined();
      expect(Math.min(image?.width ?? 0, image?.height ?? 0)).toBeGreaterThanOrEqual(
        1600,
      );
      expect(image?.date).toMatch(/^202[3-6]-/);
      expect(image?.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(image?.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
      expect(getPlace(slug)?.verification.mediaRights).toBe("cleared");
    },
  );
});
