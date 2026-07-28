import { describe, expect, it } from "vitest";
import { getPlace } from "@/content/places";
import { buildEmbeddedStreetViewUrl } from "@/lib/street-view-url";

describe("interactive Street View URL", () => {
  it("builds Google's touch-capable panorama embed from reviewed data", () => {
    const streetView = getPlace("national-museum-bohol")?.streetView;
    expect(streetView).toBeDefined();

    const url = new URL(buildEmbeddedStreetViewUrl(streetView!));

    expect(url.origin).toBe("https://www.google.com");
    expect(url.pathname).toBe("/maps/embed");
    expect(url.searchParams.get("pb")).toContain(`!1s${streetView!.panoId}`);
    expect(url.searchParams.get("pb")).toContain(
      `!1d${streetView!.coordinates.latitude}`,
    );
    expect(url.searchParams.get("pb")).toContain(
      `!2d${streetView!.coordinates.longitude}`,
    );
    expect(url.searchParams.get("pb")).toContain(
      `!3f${streetView!.heading ?? 0}`,
    );
  });
});
