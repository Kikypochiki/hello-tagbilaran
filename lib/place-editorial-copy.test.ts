import { describe, expect, it } from "vitest";
import {
  editorialCopyByPlace,
  researchedPlaceSources,
} from "@/content/place-editorial-copy";
import { places } from "@/content/places";

describe("place editorial copy", () => {
  it("covers every published place exactly once", () => {
    expect(Object.keys(editorialCopyByPlace).sort()).toEqual(
      places.map((place) => place.slug).sort(),
    );
  });

  it("uses substantial, place-specific summaries and stories", () => {
    const genericPhrases =
      /included in the project|project's .* register|listing near|a lodging property/i;

    for (const place of places) {
      expect(place.summary.length, `${place.slug} summary`).toBeGreaterThan(100);
      expect(place.story.length, `${place.slug} story`).toBeGreaterThan(180);
      expect(place.story, `${place.slug} story`).not.toBe(place.summary);
      expect(place.summary, `${place.slug} summary`).not.toMatch(genericPhrases);
      expect(place.story, `${place.slug} story`).not.toMatch(genericPhrases);
      expect(`${place.summary}${place.story}`, `${place.slug} punctuation`).not.toMatch(
        /[\u2013\u2014]/,
      );
    }
  });

  it("keeps researched source records publishable", () => {
    for (const sources of Object.values(researchedPlaceSources)) {
      for (const source of sources ?? []) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.title.trim()).not.toBe("");
        expect(source.publisher?.trim()).not.toBe("");
        expect(source.accessedAt).toBe("2026-07-26");
      }
    }
  });
});
