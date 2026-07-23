import { describe, expect, it } from "vitest";
import { hazardLayers } from "@/content/hazards";
import { isHazardKind, validateHazardLayer } from "@/lib/hazards";

describe("hazard layer safeguards", () => {
  it("recognizes only supported layers", () => {
    expect(isHazardKind("flood")).toBe(true);
    expect(isHazardKind("earthquake")).toBe(false);
  });

  it("never treats placeholder geometry as official data", () => {
    expect(hazardLayers.every(validateHazardLayer)).toBe(true);
    expect(
      hazardLayers.every(
        (layer) =>
          layer.status === "unavailable" &&
          !layer.dataUrl &&
          !layer.geometry &&
          layer.classifications.length === 3,
      ),
    ).toBe(true);
  });
});
