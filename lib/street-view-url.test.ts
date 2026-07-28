import { describe, expect, it } from "vitest";
import { getPlace } from "@/content/places";
import { buildInteractiveStreetViewUrl } from "@/lib/street-view-url";

describe("interactive Street View URL", () => {
  it("builds Google's cross-platform panorama handoff from reviewed data", () => {
    const streetView = getPlace("national-museum-bohol")?.streetView;
    expect(streetView).toBeDefined();

    const url = new URL(buildInteractiveStreetViewUrl(streetView!));

    expect(url.origin).toBe("https://www.google.com");
    expect(url.pathname).toBe("/maps/@");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("map_action")).toBe("pano");
    expect(url.searchParams.get("viewpoint")).toBe(
      `${streetView!.coordinates.latitude},${streetView!.coordinates.longitude}`,
    );
    expect(url.searchParams.get("heading")).toBe(
      `${streetView!.heading ?? 0}`,
    );
    expect(url.searchParams.get("pitch")).toBe("0");
    expect(url.searchParams.get("fov")).toBe("80");
  });
});
