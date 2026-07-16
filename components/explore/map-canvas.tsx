"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  LngLatBounds,
  type Map as MapLibreMap,
  type Marker,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import barangayBoundariesJson from "@/content/tagbilaran-barangays.json";
import cityBoundaryJson from "@/content/tagbilaran-city-boundary.json";
import type { Place } from "@/types/content";

interface BarangayProperties {
  brgy_name: string;
  brgy_code: string;
}

type BarangayGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon;
type BarangayFeature = GeoJSON.Feature<BarangayGeometry, BarangayProperties>;

const barangayBoundaries = barangayBoundariesJson as unknown as GeoJSON.FeatureCollection<
  BarangayGeometry,
  BarangayProperties
>;
const cityBoundary = cityBoundaryJson as unknown as GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>;

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

function boundsForGeometry(geometry: GeoJSON.Geometry): LngLatBounds {
  const bounds = new LngLatBounds();
  if (geometry.type !== "GeometryCollection") {
    extendBounds(bounds, geometry.coordinates);
  }
  return bounds;
}

function mapPadding() {
  return window.innerWidth <= 780
    ? { top: 180, right: 36, bottom: 170, left: 36 }
    : { top: 150, right: 90, bottom: 90, left: 90 };
}

export function MapCanvas({
  places,
  highlightedIds,
  previewedId,
  selectedBarangayCode,
  onPreview,
  onActivate,
  onSelectBarangay,
}: {
  places: Place[];
  highlightedIds: string[];
  previewedId?: string;
  selectedBarangayCode?: string;
  onPreview: (id?: string) => void;
  onActivate: (id: string) => void;
  onSelectBarangay: (code?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onPreviewRef = useRef(onPreview);
  const onActivateRef = useRef(onActivate);
  const onSelectBarangayRef = useRef(onSelectBarangay);

  useEffect(() => {
    onPreviewRef.current = onPreview;
    onActivateRef.current = onActivate;
    onSelectBarangayRef.current = onSelectBarangay;
  }, [onActivate, onPreview, onSelectBarangay]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cityFeature = cityBoundary.features[0];
    if (!cityFeature) return;
    const initialBounds = boundsForGeometry(cityFeature.geometry);

    const map = new maplibregl.Map({
      container: containerRef.current,
      bounds: initialBounds,
      fitBoundsOptions: {
        padding: mapPadding(),
        maxZoom: 14.2,
      },
      cooperativeGestures: false,
      attributionControl: false,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
          barangays: {
            type: "geojson",
            data: barangayBoundaries,
          },
          "city-boundary": {
            type: "geojson",
            data: cityBoundary,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            paint: {
              "raster-saturation": -0.56,
              "raster-contrast": 0.08,
              "raster-opacity": 0.88,
            },
          },
          {
            id: "barangay-fill",
            type: "fill",
            source: "barangays",
            paint: {
              "fill-color": "#005c09",
              "fill-opacity": 0.055,
            },
          },
          {
            id: "barangay-selected-fill",
            type: "fill",
            source: "barangays",
            filter: ["==", ["get", "brgy_code"], ""],
            paint: {
              "fill-color": "#f4c542",
              "fill-opacity": 0.42,
            },
          },
          {
            id: "barangay-lines",
            type: "line",
            source: "barangays",
            paint: {
              "line-color": "#005c09",
              "line-width": 1,
              "line-opacity": 0.48,
              "line-dasharray": [3, 2],
            },
          },
          {
            id: "barangay-selected-line",
            type: "line",
            source: "barangays",
            filter: ["==", ["get", "brgy_code"], ""],
            paint: {
              "line-color": "#4a3d14",
              "line-width": 2.5,
              "line-opacity": 0.95,
            },
          },
          {
            id: "city-boundary-casing",
            type: "line",
            source: "city-boundary",
            paint: {
              "line-color": "#fff9eb",
              "line-width": 7,
              "line-opacity": 0.9,
            },
          },
          {
            id: "city-boundary-line",
            type: "line",
            source: "city-boundary",
            paint: {
              "line-color": "#005c09",
              "line-width": 3.5,
              "line-opacity": 1,
            },
          },
        ],
      },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;
    const markers = markersRef.current;

    places.forEach((place, index) => {
      if (!place.coordinates) return;
      const markerButton = document.createElement("button");
      markerButton.type = "button";
      markerButton.className = "journal-marker";
      markerButton.dataset.placeId = place.id;
      markerButton.dataset.markerNumber = String(index + 1).padStart(2, "0");
      markerButton.setAttribute("aria-label", `Show information for ${place.name}`);
      markerButton.addEventListener("pointerenter", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("pointerleave", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("focus", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("blur", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("click", (event) => {
        event.stopPropagation();
        onActivateRef.current(place.id);
      });

      const marker = new maplibregl.Marker({ element: markerButton, anchor: "bottom" })
        .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
        .addTo(map);
      markers.set(place.id, marker);
    });

    const handleBarangayClick = (
      event: maplibregl.MapLayerMouseEvent & { features?: GeoJSON.Feature[] },
    ) => {
      const code = event.features?.[0]?.properties?.brgy_code;
      if (typeof code === "string") onSelectBarangayRef.current(code);
    };
    const showPointer = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const clearPointer = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "barangay-fill", handleBarangayClick);
    map.on("mouseenter", "barangay-fill", showPointer);
    map.on("mouseleave", "barangay-fill", clearPointer);

    return () => {
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [places]);

  useEffect(() => {
    const highlighted = new Set(highlightedIds);
    markersRef.current.forEach((marker, id) => {
      const element = marker.getElement();
      element.toggleAttribute("data-highlighted", highlighted.has(id));
      element.toggleAttribute("data-muted", !highlighted.has(id));
      element.toggleAttribute("data-previewed", id === previewedId);
    });
  }, [highlightedIds, previewedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applySelection = () => {
      const filter: maplibregl.FilterSpecification = [
        "==",
        ["get", "brgy_code"],
        selectedBarangayCode ?? "",
      ];
      map.setFilter("barangay-selected-fill", filter);
      map.setFilter("barangay-selected-line", filter);

      const feature = barangayBoundaries.features.find(
        (item) => item.properties.brgy_code === selectedBarangayCode,
      ) as BarangayFeature | undefined;
      const target = feature ?? cityBoundary.features[0];
      if (!target) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.fitBounds(boundsForGeometry(target.geometry), {
        padding: mapPadding(),
        maxZoom: feature ? 15.6 : 14.2,
        duration: reducedMotion ? 0 : 650,
      });
    };

    if (map.isStyleLoaded()) applySelection();
    else map.once("style.load", applySelection);

    return () => {
      map.off("style.load", applySelection);
    };
  }, [selectedBarangayCode]);

  return (
    <div
      className="map-canvas map-canvas--city"
      ref={containerRef}
      role="region"
      aria-label="Interactive map of Tagbilaran place pins, all 15 indicative barangay areas, and the indicative city boundary. The map index provides keyboard controls for every selection."
    />
  );
}
