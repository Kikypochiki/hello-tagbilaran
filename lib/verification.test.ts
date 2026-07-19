import { describe, expect, it } from "vitest";
import { getPlace } from "@/content/places";
import { hasReviewedLocation, isStreetViewCurrent } from "@/lib/verification";

describe("publication verification", () => {
  it("exposes only exact, current Street View records", () => {
    const museum = getPlace("national-museum-bohol");
    expect(museum?.streetView?.match).toBe("exact-venue");
    expect(
      isStreetViewCurrent(museum?.streetView, new Date("2026-07-19T00:00:00+08:00")),
    ).toBe(true);
    expect(
      isStreetViewCurrent(museum?.streetView, new Date("2027-01-20T00:00:00+08:00")),
    ).toBe(false);
    expect(isStreetViewCurrent(getPlace("bq-mall")?.streetView)).toBe(false);
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
});
