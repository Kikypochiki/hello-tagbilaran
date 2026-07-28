"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  GeoJSONSource,
  LngLatBounds,
  type Map as MapLibreMap,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import barangayBoundariesJson from "@/content/tagbilaran-barangays.json";
import cityBoundaryJson from "@/content/tagbilaran-city-boundary.json";
import { prefersReducedMotion } from "@/lib/motion";
import type {
  HazardInspection,
  HazardLayerMetadata,
  HazardLevel,
} from "@/types/hazards";

interface BarangayProperties {
  brgy_name: string;
  brgy_code: string;
}

type BoundaryGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon;
const barangayBoundaries =
  barangayBoundariesJson as unknown as GeoJSON.FeatureCollection<
    BoundaryGeometry,
    BarangayProperties
  >;
const cityBoundary =
  cityBoundaryJson as unknown as GeoJSON.FeatureCollection<BoundaryGeometry>;
const emptyHazards: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
const mapTileUrl =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const mapTileUrlPrefix = mapTileUrl.split("{")[0] ?? mapTileUrl;

function extendBounds(bounds: LngLatBounds, coordinates: unknown): void {
  if (!Array.isArray(coordinates)) return;
  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    bounds.extend([coordinates[0], coordinates[1]]);
    return;
  }
  coordinates.forEach((coordinate) => extendBounds(bounds, coordinate));
}

function boundsForGeometry(geometry: GeoJSON.Geometry) {
  const bounds = new LngLatBounds();
  if (geometry.type !== "GeometryCollection") {
    extendBounds(bounds, geometry.coordinates);
  }
  return bounds;
}

function patternImage(level: HazardLevel) {
  const canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare hazard pattern.");
  context.strokeStyle = "rgba(49, 34, 19, 0.58)";
  context.fillStyle = "rgba(49, 34, 19, 0.58)";
  context.lineWidth = 2;

  if (level === "low") {
    context.beginPath();
    context.arc(6, 6, 1.7, 0, Math.PI * 2);
    context.arc(18, 18, 1.7, 0, Math.PI * 2);
    context.fill();
  } else {
    context.beginPath();
    context.moveTo(-4, 20);
    context.lineTo(20, -4);
    context.moveTo(4, 28);
    context.lineTo(28, 4);
    if (level === "high") {
      context.moveTo(-4, 4);
      context.lineTo(20, 28);
      context.moveTo(4, -4);
      context.lineTo(28, 20);
    }
    context.stroke();
  }
  return context.getImageData(0, 0, 24, 24);
}

export function HazardMap({
  layer,
  opacity,
  visibleLevels,
  selectedBarangayCode,
  onSelectBarangay,
  onInspect,
  onDataState,
}: {
  layer: HazardLayerMetadata;
  opacity: number;
  visibleLevels: HazardLevel[];
  selectedBarangayCode?: string;
  onSelectBarangay: (code?: string) => void;
  onInspect: (inspection?: HazardInspection) => void;
  onDataState: (state: "loading" | "ready" | "error") => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeLayerRef = useRef(layer);
  const selectedBarangayCodeRef = useRef(selectedBarangayCode);
  const onSelectBarangayRef = useRef(onSelectBarangay);
  const onInspectRef = useRef(onInspect);

  useEffect(() => {
    activeLayerRef.current = layer;
    selectedBarangayCodeRef.current = selectedBarangayCode;
    onSelectBarangayRef.current = onSelectBarangay;
    onInspectRef.current = onInspect;
  }, [layer, onInspect, onSelectBarangay, selectedBarangayCode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const cityFeature = cityBoundary.features[0];
    if (!cityFeature) return;

    const initialBounds = boundsForGeometry(cityFeature.geometry);
    const reducedMotion = prefersReducedMotion();
    const pitch = reducedMotion ? 0 : window.innerWidth <= 780 ? 18 : 26;
    const bearing = reducedMotion ? 0 : -6;
    const buildingTileUrl = `${window.location.origin}/data/buildings/{z}/{x}/{y}.pbf`;
    const map = new maplibregl.Map({
      container: containerRef.current,
      bounds: initialBounds,
      pitch,
      bearing,
      maxPitch: 48,
      cooperativeGestures: false,
      attributionControl: false,
      fitBoundsOptions: {
        padding:
          window.innerWidth <= 780
            ? { top: 160, right: 28, bottom: 150, left: 28 }
            : { top: 130, right: 90, bottom: 90, left: 90 },
        maxZoom: 14.2,
        pitch,
        bearing,
      },
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [mapTileUrl],
            tileSize: 256,
            maxzoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
          buildings: {
            type: "vector",
            tiles: [buildingTileUrl],
            minzoom: 13,
            maxzoom: 16,
            bounds: [
              initialBounds.getWest(),
              initialBounds.getSouth(),
              initialBounds.getEast(),
              initialBounds.getNorth(),
            ],
            attribution:
              'Building footprints &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
          hazards: { type: "geojson", data: emptyHazards },
          barangays: { type: "geojson", data: barangayBoundaries },
          "city-boundary": { type: "geojson", data: cityBoundary },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            paint: {
              "raster-saturation": -0.68,
              "raster-contrast": 0.06,
              "raster-brightness-max": 0.92,
              "raster-opacity": 0.9,
            },
          },
          {
            id: "building-footprints",
            type: "fill",
            source: "buildings",
            "source-layer": "building",
            minzoom: 13,
            maxzoom: 13.75,
            paint: {
              "fill-color": "#d6c5a4",
              "fill-opacity": 0.42,
              "fill-outline-color": "rgba(0, 63, 7, 0.16)",
            },
          },
          {
            id: "buildings-3d",
            type: "fill-extrusion",
            source: "buildings",
            "source-layer": "building",
            minzoom: 13,
            paint: {
              "fill-extrusion-base": 0,
              "fill-extrusion-color": "#e6dbc2",
              "fill-extrusion-height": [
                "case",
                ["has", "height"],
                ["get", "height"],
                ["has", "levels"],
                ["*", ["get", "levels"], 3],
                4,
              ],
              "fill-extrusion-opacity": 0.72,
            },
          },
          {
            id: "hazard-fill",
            type: "fill",
            source: "hazards",
            paint: {
              "fill-color": [
                "match",
                ["get", "level"],
                1,
                "#e7cf4f",
                2,
                "#e58c3e",
                3,
                "#a83a2c",
                "#000000",
              ],
              "fill-opacity": 0.66,
            },
          },
          {
            id: "hazard-pattern",
            type: "fill",
            source: "hazards",
            paint: {
              "fill-pattern": [
                "match",
                ["get", "level"],
                1,
                "hazard-pattern-low",
                2,
                "hazard-pattern-medium",
                3,
                "hazard-pattern-high",
                "hazard-pattern-low",
              ],
              "fill-opacity": 0.37,
            },
          },
          {
            id: "hazard-line",
            type: "line",
            source: "hazards",
            paint: {
              "line-color": "rgba(49, 34, 19, 0.58)",
              "line-width": 0.8,
            },
          },
          {
            id: "barangay-fill",
            type: "fill",
            source: "barangays",
            paint: { "fill-color": "#005c09", "fill-opacity": 0.025 },
          },
          {
            id: "barangay-selected-fill",
            type: "fill",
            source: "barangays",
            filter: ["==", ["get", "brgy_code"], ""],
            paint: { "fill-color": "#fff9eb", "fill-opacity": 0.2 },
          },
          {
            id: "barangay-lines",
            type: "line",
            source: "barangays",
            paint: {
              "line-color": "#fff9eb",
              "line-width": 1.25,
              "line-opacity": 0.72,
              "line-dasharray": [3, 2],
            },
          },
          {
            id: "barangay-selected-line",
            type: "line",
            source: "barangays",
            filter: ["==", ["get", "brgy_code"], ""],
            paint: {
              "line-color": "#003f07",
              "line-width": 3,
              "line-opacity": 1,
            },
          },
          {
            id: "city-boundary-casing",
            type: "line",
            source: "city-boundary",
            paint: {
              "line-color": "#fff9eb",
              "line-width": 6,
              "line-opacity": 0.9,
            },
          },
          {
            id: "city-boundary-line",
            type: "line",
            source: "city-boundary",
            paint: {
              "line-color": "#003f07",
              "line-width": 3,
              "line-opacity": 1,
            },
          },
        ],
      },
    });
    const handleMapError = (event: { error: Error }) => {
      const error = event.error as Error & { url?: string };
      if (error.url?.startsWith(mapTileUrlPrefix)) {
        containerRef.current?.setAttribute("data-map-background", "unavailable");
        return;
      }
      console.error(error);
    };
    map.on("error", handleMapError);

    (["low", "medium", "high"] as const).forEach((level) => {
      map.addImage(`hazard-pattern-${level}`, patternImage(level), {
        pixelRatio: 2,
      });
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right",
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    const handleClick = (event: maplibregl.MapMouseEvent) => {
      const hazardFeature = map.queryRenderedFeatures(event.point, {
        layers: ["hazard-pattern", "hazard-fill"],
      })[0];
      const levelNumber = Number(hazardFeature?.properties?.level);
      if (levelNumber >= 1 && levelNumber <= 3) {
        const level = (["low", "medium", "high"] as const)[levelNumber - 1];
        const classification = activeLayerRef.current.classifications.find(
          (item) => item.level === level,
        );
        onInspectRef.current(
          classification
            ? {
                level,
                label: classification.label,
                description: classification.description,
              }
            : undefined,
        );
      } else {
        onInspectRef.current(undefined);
      }

      const barangayFeature = map.queryRenderedFeatures(event.point, {
        layers: ["barangay-selected-fill", "barangay-fill"],
      })[0];
      const code = barangayFeature?.properties?.brgy_code;
      if (code !== undefined && code !== null) {
        const nextCode = String(code);
        onSelectBarangayRef.current(
          selectedBarangayCodeRef.current === nextCode ? undefined : nextCode,
        );
      }
    };
    map.on("click", handleClick);
    map.on("mouseenter", "hazard-fill", () => {
      map.getCanvas().style.cursor = "crosshair";
    });
    map.on("mouseleave", "hazard-fill", () => {
      map.getCanvas().style.cursor = "";
    });
    mapRef.current = map;

    return () => {
      map.off("click", handleClick);
      map.off("error", handleMapError);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const controller = new AbortController();
    onDataState("loading");
    onInspect(undefined);

    const loadData = async () => {
      try {
        const response = await fetch(layer.dataUrl, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Hazard data returned ${response.status}.`);
        const data = (await response.json()) as GeoJSON.FeatureCollection;
        const apply = () => {
          (map.getSource("hazards") as GeoJSONSource | undefined)?.setData(data);
          onDataState("ready");
        };
        if (map.getSource("hazards")) apply();
        else map.once("style.load", apply);
      } catch (error) {
        if ((error as Error).name !== "AbortError") onDataState("error");
      }
    };
    void loadData();
    return () => controller.abort();
  }, [layer.dataUrl, onDataState, onInspect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("hazard-fill")) return;
    const values = visibleLevels.map((level) => {
      if (level === "low") return 1;
      if (level === "medium") return 2;
      return 3;
    });
    const filter: maplibregl.FilterSpecification = [
      "in",
      ["get", "level"],
      ["literal", values],
    ];
    ["hazard-fill", "hazard-pattern", "hazard-line"].forEach((id) =>
      map.setFilter(id, filter),
    );
  }, [visibleLevels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("hazard-fill")) return;
    map.setPaintProperty("hazard-fill", "fill-opacity", opacity / 100);
    map.setPaintProperty(
      "hazard-pattern",
      "fill-opacity",
      Math.min(0.5, opacity / 180),
    );
  }, [opacity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("barangay-selected-fill")) return;
    const filter: maplibregl.FilterSpecification = [
      "==",
      ["get", "brgy_code"],
      selectedBarangayCode ?? "",
    ];
    map.setFilter("barangay-selected-fill", filter);
    map.setFilter("barangay-selected-line", filter);
    if (!selectedBarangayCode) return;
    const feature = barangayBoundaries.features.find(
      (item) => item.properties.brgy_code === selectedBarangayCode,
    );
    if (!feature) return;
    map.fitBounds(boundsForGeometry(feature.geometry), {
      padding:
        window.innerWidth <= 780
          ? { top: 180, right: 40, bottom: 180, left: 40 }
          : { top: 140, right: 120, bottom: 110, left: 420 },
      maxZoom: 15,
      duration: prefersReducedMotion() ? 0 : 650,
    });
  }, [selectedBarangayCode]);

  return <div className="hazard-map-canvas" ref={containerRef} />;
}
