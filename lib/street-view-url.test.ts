import { describe, expect, it } from "vitest";
import { getPlace } from "@/content/places";
import { buildEmbeddedStreetViewUrl } from "@/lib/street-view-url";

describe("interactive Street View URL", () => {
  it("builds the mobile-tested legacy panorama embed from reviewed data", () => {
    const streetView = getPlace("national-museum-bohol")?.streetView;
    expect(streetView).toBeDefined();

    const url = new URL(buildEmbeddedStreetViewUrl(streetView!));

    expect(url.origin).toBe("https://maps.google.com");
    expect(url.pathname).toBe("/maps");
    expect(url.searchParams.get("layer")).toBe("c");
    expect(url.searchParams.get("cbll")).toBe(
      `${streetView!.coordinates.latitude},${streetView!.coordinates.longitude}`,
    );
    expect(url.searchParams.get("cbp")).toBe("12,0,,0,0");
    expect(url.searchParams.get("source")).toBe("embed");
    expect(url.searchParams.get("output")).toBe("svembed");
    expect(url.searchParams.get("hl")).toBe("en");
    expect(url.searchParams.has("pb")).toBe(false);
  });
});
