import type { HazardLayerMetadata } from "@/types/hazards";

const sourceUrl = "https://noah.up.edu.ph/know-your-hazards";
const dataRepositoryUrl =
  "https://huggingface.co/datasets/bettergovph/project-noah-hazard-maps";

const classifications = [
  {
    level: "low",
    label: "Low",
    description: "Lower susceptibility within the selected official scenario.",
    color: "#e7cf4f",
    pattern: "dots",
  },
  {
    level: "medium",
    label: "Moderate",
    description: "Moderate susceptibility within the selected official scenario.",
    color: "#e58c3e",
    pattern: "diagonal",
  },
  {
    level: "high",
    label: "High",
    description: "Higher susceptibility within the selected official scenario.",
    color: "#a83a2c",
    pattern: "crosshatch",
  },
] as const;

export const hazardLayers: HazardLayerMetadata[] = [
  {
    id: "flood",
    scenarioId: "flood-100yr",
    label: "Flood susceptibility",
    scenario: "100-year rainfall return period",
    shortScenario: "100-year rainfall",
    description:
      "Classification considers modeled flood depth and water velocity for a 100-year rainfall return-period scenario.",
    classifications: [...classifications],
    source: "Project NOAH",
    sourceUrl,
    dataRepositoryUrl,
    status: "available",
    version: "Bohol provincial download",
    retrievedAt: "2026-07-28",
    license: "ODC-ODbL-1.0",
    dataUrl: "/data/hazards/flood-100yr.geojson",
  },
  {
    id: "storm-surge",
    scenarioId: "storm-surge-ssa4",
    label: "Storm-surge susceptibility",
    scenario: "Storm Surge Advisory 4 — peak height above 4 metres",
    shortScenario: "SSA 4 · above 4 m",
    description:
      "Modeled maximum depth and flow indicate low, moderate, or high susceptibility under the SSA 4 scenario.",
    classifications: [...classifications],
    source: "Project NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/storm-surge",
    dataRepositoryUrl,
    status: "available",
    version: "Bohol SSA 4 provincial download",
    retrievedAt: "2026-07-28",
    license: "ODC-ODbL-1.0",
    dataUrl: "/data/hazards/storm-surge-ssa4.geojson",
  },
  {
    id: "landslide",
    scenarioId: "landslide-susceptibility",
    label: "Landslide susceptibility",
    scenario: "Merged shallow, structurally controlled, and debris-flow models",
    shortScenario: "Susceptibility model",
    description:
      "Susceptibility combines Project NOAH models for shallow landslides, unstable slopes, runout zones, and debris flows.",
    classifications: [...classifications],
    source: "Project NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/landslide",
    dataRepositoryUrl,
    status: "available",
    version: "Bohol provincial download",
    retrievedAt: "2026-07-28",
    license: "ODC-ODbL-1.0",
    dataUrl: "/data/hazards/landslide-susceptibility.geojson",
  },
];
