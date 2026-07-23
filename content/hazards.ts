import type { HazardLayerMetadata } from "@/types/hazards";

const sourceUrl = "https://noah.up.edu.ph/know-your-hazards";

const classifications = [
  {
    level: "low",
    label: "Low",
    description: "Lower susceptibility within the selected official scenario.",
    color: "#e5d66b",
    pattern: "dots",
  },
  {
    level: "medium",
    label: "Moderate",
    description: "Moderate susceptibility within the selected official scenario.",
    color: "#e89b50",
    pattern: "diagonal",
  },
  {
    level: "high",
    label: "High",
    description: "Higher susceptibility within the selected official scenario.",
    color: "#a84332",
    pattern: "crosshatch",
  },
] as const;

export const hazardLayers: HazardLayerMetadata[] = [
  {
    id: "flood",
    label: "Flood susceptibility",
    scenario: "Official return-period layer pending reuse review",
    description: "Areas may experience different flood depths under the scenario represented by the official dataset.",
    classifications: [...classifications],
    source: "UP NOAH",
    sourceUrl,
    status: "unavailable",
  },
  {
    id: "storm-surge",
    label: "Storm-surge susceptibility",
    scenario: "Official surge-height layer pending reuse review",
    description: "Coastal areas may be affected differently depending on the official surge scenario.",
    classifications: [...classifications],
    source: "UP NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/storm-surge",
    status: "unavailable",
  },
  {
    id: "landslide",
    label: "Landslide susceptibility",
    scenario: "Official susceptibility layer pending reuse review",
    description: "Susceptibility is not a prediction and must be read with current official advisories.",
    classifications: [...classifications],
    source: "UP NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/landslide",
    status: "unavailable",
  },
];
