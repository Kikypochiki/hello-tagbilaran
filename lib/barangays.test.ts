import { describe, expect, it } from "vitest";
import { tagbilaranBarangays } from "@/content/barangays";
import { places } from "@/content/places";
import { categoryCountsForBarangay, placesForBarangay } from "@/lib/barangays";

describe("barangay discovery", () => {
  it("keeps the 15 official PSGC entries unique", () => {
    expect(tagbilaranBarangays).toHaveLength(15);
    expect(new Set(tagbilaranBarangays.map((item) => item.code)).size).toBe(15);
    expect(
      tagbilaranBarangays.reduce(
        (total, barangay) => total + barangay.population2024,
        0,
      ),
    ).toBe(106120);
    expect(
      tagbilaranBarangays.filter(
        (barangay) => barangay.classification === "Rural",
      ).map((barangay) => barangay.name),
    ).toEqual(["Cabawan"]);
  });

  it("publishes the official directory details for every barangay", () => {
    for (const barangay of tagbilaranBarangays) {
      expect(barangay.officialDirectoryUrl).toBe(
        "https://tagbilaran.gov.ph/barangays/",
      );
      expect(barangay.punongBarangay).toMatch(/^Hon\. /);
      expect(barangay.contact.length).toBeGreaterThan(0);
      expect(barangay.population2024).toBeGreaterThan(0);
      expect(barangay.summary.length).toBeGreaterThan(100);
      expect(barangay.highlights.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("normalizes roman-numeral barangay names and derives categories", () => {
    const poblacion = tagbilaranBarangays.find((item) => item.name === "Poblacion I")!;
    expect(placesForBarangay(places, poblacion).length).toBeGreaterThan(0);
    expect(Object.values(categoryCountsForBarangay(places, poblacion)).reduce((a, b) => a + b, 0))
      .toBe(placesForBarangay(places, poblacion).length);
  });
});
