import { describe, expect, it } from "vitest";
import { getPlace, places } from "@/content/places";
import { hasReviewedLocation, isStreetViewCurrent } from "@/lib/verification";

describe("publication verification", () => {
  it("exposes current exact and nearby-road Street View records", () => {
    const museum = getPlace("national-museum-bohol");
    const bqMall = getPlace("bq-mall");
    expect(museum?.streetView?.match).toBe("exact-venue");
    expect(bqMall?.streetView?.match).toBe("nearby-road");
    expect(bqMall?.streetView?.distanceMeters).toBe(6);
    expect(
      isStreetViewCurrent(museum?.streetView, new Date("2026-07-19T00:00:00+08:00")),
    ).toBe(true);
    expect(
      isStreetViewCurrent(bqMall?.streetView, new Date("2026-07-26T00:00:00+08:00")),
    ).toBe(true);
    expect(
      isStreetViewCurrent(museum?.streetView, new Date("2027-01-20T00:00:00+08:00")),
    ).toBe(false);
    expect(isStreetViewCurrent(getPlace("red-house-city-taiwan-shabu-shabu")?.streetView)).toBe(
      false,
    );
  });

  it("does not map an unverified location", () => {
    const place = getPlace("plaza-rizal");
    expect(place && hasReviewedLocation(place)).toBe(true);
    expect(
      place &&
        hasReviewedLocation({
          ...place,
          verification: { ...place.verification, location: "unverified" },
        }),
    ).toBe(false);
  });

  it("publishes only recent, measured Street View coverage", () => {
    const streetViews = places.flatMap((place) =>
      place.streetView ? [{ place, streetView: place.streetView }] : [],
    );

    expect(streetViews).toHaveLength(30);
    for (const { streetView } of streetViews) {
      const captureYear = Number(streetView.captureDate.slice(0, 4));
      expect(captureYear).toBeGreaterThanOrEqual(2023);
      expect(captureYear).toBeLessThanOrEqual(2026);
      if (streetView.match === "nearby-road") {
        expect(streetView.distanceMeters).toBeGreaterThan(0);
        expect(streetView.distanceMeters).toBeLessThanOrEqual(250);
      }
    }

    expect(getPlace("island-city-mall")?.streetView).toBeUndefined();
    expect(getPlace("banat-i-hill")?.streetView).toBeUndefined();
  });
});
