import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

interface BuildingManifest {
  featureCount: number;
  tileCount: number;
  minZoom: number;
  maxZoom: number;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
}

const buildings = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "public", "data", "tagbilaran-buildings.json"),
    "utf8",
  ),
) as BuildingManifest;

describe("local 3D building geometry", () => {
  it("contains a substantial attributed OpenStreetMap snapshot", () => {
    expect(buildings.featureCount).toBeGreaterThan(1_000);
    expect(buildings.tileCount).toBeGreaterThan(0);
    expect(buildings.source).toBe("OpenStreetMap contributors");
    expect(buildings.sourceUrl).toMatch(/^https:\/\/www\.openstreetmap\.org\//);
    expect(buildings.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("provides the intended close-range zoom levels", () => {
    expect(buildings.minZoom).toBe(13);
    expect(buildings.maxZoom).toBeGreaterThanOrEqual(16);
  });
});
