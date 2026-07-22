import { describe, expect, it } from "vitest";
import { tagbilaranBarangays } from "@/content/barangays";
import { places } from "@/content/places";
import { categoryCountsForBarangay, placesForBarangay } from "@/lib/barangays";

describe("barangay discovery", () => {
  it("keeps the 15 official PSGC entries unique", () => {
    expect(tagbilaranBarangays).toHaveLength(15);
    expect(new Set(tagbilaranBarangays.map((item) => item.code)).size).toBe(15);
  });

  it("normalizes roman-numeral barangay names and derives categories", () => {
    const poblacion = tagbilaranBarangays.find((item) => item.name === "Poblacion I")!;
    expect(placesForBarangay(places, poblacion).length).toBeGreaterThan(0);
    expect(Object.values(categoryCountsForBarangay(places, poblacion)).reduce((a, b) => a + b, 0))
      .toBe(placesForBarangay(places, poblacion).length);
  });
});
