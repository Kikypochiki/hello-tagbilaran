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
import type { MapChoiceAnchor } from "@/components/explore/map-place-choice";
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

function choiceAnchorForMarker(
  markerButton: HTMLElement,
  container: HTMLElement,
): MapChoiceAnchor {
  const containerBounds = container.getBoundingClientRect();
  const markerBounds = markerButton.getBoundingClientRect();
  const popoverHalfWidth = Math.min(175, containerBounds.width / 2 - 8);
  const popoverHeight = 72;
  const rawX = markerBounds.left + markerBounds.width / 2 - containerBounds.left;
  const markerTop = markerBounds.top - containerBounds.top;
  const markerBottom = markerBounds.bottom - containerBounds.top;
  const placement = markerTop < popoverHeight + 20 ? "below" : "above";

  return {
    x: Math.min(
      Math.max(rawX, popoverHalfWidth + 8),
      containerBounds.width - popoverHalfWidth - 8,
    ),
    y:
      placement === "above"
        ? Math.min(
            Math.max(markerTop - 10, popoverHeight + 8),
            containerBounds.height - 8,
          )
        : Math.min(
            Math.max(markerBottom + 10, 8),
            containerBounds.height - popoverHeight - 8,
          ),
    placement,
  };
}

export function MapCanvas({
  places,
  highlightedIds,
  previewedId,
  activePlaceId,
  streetViewTarget,
  selectedBarangayCode,
  onPreview,
  onActivate,
  onChoiceAnchorChange,
  onSelectBarangay,
}: {
  places: Place[];
  highlightedIds: string[];
  previewedId?: string;
  activePlaceId?: string;
  streetViewTarget?: Place;
  selectedBarangayCode?: string;
  onPreview: (id?: string) => void;
  onActivate: (
    id: string,
    anchor: MapChoiceAnchor,
  ) => void;
  onChoiceAnchorChange: (anchor: MapChoiceAnchor) => void;
  onSelectBarangay: (code?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const previousStreetViewTargetRef = useRef<string | undefined>(undefined);
  const activePlaceIdRef = useRef(activePlaceId);
  const onPreviewRef = useRef(onPreview);
  const onActivateRef = useRef(onActivate);
  const onChoiceAnchorChangeRef = useRef(onChoiceAnchorChange);
  const onSelectBarangayRef = useRef(onSelectBarangay);

  useEffect(() => {
    activePlaceIdRef.current = activePlaceId;
    onPreviewRef.current = onPreview;
    onActivateRef.current = onActivate;
    onChoiceAnchorChangeRef.current = onChoiceAnchorChange;
    onSelectBarangayRef.current = onSelectBarangay;
  }, [
    activePlaceId,
    onActivate,
    onChoiceAnchorChange,
    onPreview,
    onSelectBarangay,
  ]);

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
      markerButton.setAttribute("aria-label", `Choose how to explore ${place.name}`);
      markerButton.addEventListener("pointerenter", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("pointerleave", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("focus", () => onPreviewRef.current(place.id));
      markerButton.addEventListener("blur", () => onPreviewRef.current(undefined));
      markerButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const container = containerRef.current;
        if (!container) return;
        onActivateRef.current(
          place.id,
          choiceAnchorForMarker(markerButton, container),
        );
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
    let choiceAnimationFrame = 0;
    const updateChoiceAnchor = () => {
      choiceAnimationFrame = 0;
      const activeId = activePlaceIdRef.current;
      const marker = activeId ? markers.get(activeId) : undefined;
      const container = containerRef.current;
      if (!marker || !container) return;
      onChoiceAnchorChangeRef.current(
        choiceAnchorForMarker(marker.getElement(), container),
      );
    };
    const scheduleChoiceAnchorUpdate = () => {
      if (!choiceAnimationFrame) {
        choiceAnimationFrame = window.requestAnimationFrame(updateChoiceAnchor);
      }
    };

    map.on("click", "barangay-fill", handleBarangayClick);
    map.on("mouseenter", "barangay-fill", showPointer);
    map.on("mouseleave", "barangay-fill", clearPointer);
    map.on("move", scheduleChoiceAnchorUpdate);
    map.on("resize", scheduleChoiceAnchorUpdate);

    return () => {
      map.off("move", scheduleChoiceAnchorUpdate);
      map.off("resize", scheduleChoiceAnchorUpdate);
      if (choiceAnimationFrame) window.cancelAnimationFrame(choiceAnimationFrame);
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
      element.toggleAttribute("data-selected", id === activePlaceId);
    });
  }, [activePlaceId, highlightedIds, previewedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!streetViewTarget?.coordinates) {
      if (!previousStreetViewTargetRef.current) return;
      previousStreetViewTargetRef.current = undefined;
      map.easeTo({
        zoom: Math.min(map.getZoom(), 15.8),
        pitch: 0,
        bearing: 0,
        duration: reducedMotion ? 0 : 420,
      });
      return;
    }

    previousStreetViewTargetRef.current = streetViewTarget.id;
    map.easeTo({
      center: [
        streetViewTarget.coordinates.longitude,
        streetViewTarget.coordinates.latitude,
      ],
      zoom: 18.4,
      pitch: reducedMotion ? 0 : 52,
      bearing: reducedMotion ? 0 : 18,
      duration: reducedMotion ? 0 : 620,
      easing: (time) => 1 - Math.pow(1 - time, 4),
    });
  }, [streetViewTarget]);

  useEffect(() => {
    const map = mapRef.current;
    if (
      !map ||
      selectedBarangayCode ||
      highlightedIds.length === 0 ||
      highlightedIds.length === places.length
    ) {
      return;
    }

    const highlighted = new Set(highlightedIds);
    const points = places.filter(
      (place) => place.coordinates && highlighted.has(place.id),
    );
    if (points.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (points.length === 1 && points[0]?.coordinates) {
      map.easeTo({
        center: [points[0].coordinates.longitude, points[0].coordinates.latitude],
        zoom: 15.2,
        duration: reducedMotion ? 0 : 550,
      });
      return;
    }

    const bounds = new LngLatBounds();
    points.forEach((place) => {
      if (place.coordinates) {
        bounds.extend([place.coordinates.longitude, place.coordinates.latitude]);
      }
    });
    map.fitBounds(bounds, {
      padding: mapPadding(),
      maxZoom: 15.2,
      duration: reducedMotion ? 0 : 650,
    });
  }, [highlightedIds, places, selectedBarangayCode]);

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
