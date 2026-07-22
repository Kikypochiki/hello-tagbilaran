import type { HazardLayerMetadata } from "@/types/hazards";

const sourceUrl = "https://noah.up.edu.ph/know-your-hazards";

export const hazardLayers: HazardLayerMetadata[] = [
  {
    id: "flood",
    label: "Flood susceptibility",
    scenario: "Official return-period layer pending reuse review",
    description: "Areas may experience different flood depths under the scenario represented by the official dataset.",
    source: "UP NOAH",
    sourceUrl,
    status: "unavailable",
  },
  {
    id: "storm-surge",
    label: "Storm-surge susceptibility",
    scenario: "Official surge-height layer pending reuse review",
    description: "Coastal areas may be affected differently depending on the official surge scenario.",
    source: "UP NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/storm-surge",
    status: "unavailable",
  },
  {
    id: "landslide",
    label: "Landslide susceptibility",
    scenario: "Official susceptibility layer pending reuse review",
    description: "Susceptibility is not a prediction and must be read with current official advisories.",
    source: "UP NOAH",
    sourceUrl: "https://noah.up.edu.ph/know-your-hazards/landslide",
    status: "unavailable",
  },
];
