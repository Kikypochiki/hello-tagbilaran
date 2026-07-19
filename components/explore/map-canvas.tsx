"use client";

import { useEffect, useRef } from "react";
import maplibregl, {
  GeoJSONSource,
  LngLatBounds,
  type Map as MapLibreMap,
  type Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import barangayBoundariesJson from "@/content/tagbilaran-barangays.json";
import cityBoundaryJson from "@/content/tagbilaran-city-boundary.json";
import { prefersReducedMotion } from "@/lib/motion";
import type { Place } from "@/types/content";

interface BarangayProperties {
  brgy_name: string;
  brgy_code: string;
}

type BarangayGeometry = GeoJSON.Polygon | GeoJSON.MultiPolygon;
type BarangayFeature = GeoJSON.Feature<BarangayGeometry, BarangayProperties>;
interface PlacePointProperties {
  placeId: string;
  markerNumber: string;
}

const placePinImageId = "journal-place-pin";
const selectedPlacePinImageId = "journal-place-pin-selected";

const barangayBoundaries = barangayBoundariesJson as unknown as GeoJSON.FeatureCollection<
  BarangayGeometry,
  BarangayProperties
>;
const cityBoundary = cityBoundaryJson as unknown as GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon
>;
const mapTileUrl =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ??
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

function placePoints(places: Place[]): GeoJSON.FeatureCollection<
  GeoJSON.Point,
  PlacePointProperties
> {
  return {
    type: "FeatureCollection",
    features: places.flatMap((place, index) =>
      place.coordinates
        ? [
            {
              type: "Feature" as const,
              id: place.id,
              geometry: {
                type: "Point" as const,
                coordinates: [
                  place.coordinates.longitude,
                  place.coordinates.latitude,
                ],
              },
              properties: {
                placeId: place.id,
                markerNumber: String(index + 1).padStart(2, "0"),
              },
            },
          ]
        : [],
    ),
  };
}

function createPlacePinImage({
  fill,
  center,
}: {
  fill: string;
  center: string;
}): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 88;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("The browser could not prepare the place-pin artwork.");
  }

  context.shadowColor = "rgba(44, 35, 12, 0.3)";
  context.shadowBlur = 7;
  context.shadowOffsetY = 4;
  context.beginPath();
  context.moveTo(36, 82);
  context.bezierCurveTo(31, 70, 8, 51, 8, 32);
  context.bezierCurveTo(8, 16, 20, 5, 36, 5);
  context.bezierCurveTo(52, 5, 64, 16, 64, 32);
  context.bezierCurveTo(64, 51, 41, 70, 36, 82);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  context.shadowColor = "transparent";
  context.lineWidth = 6;
  context.strokeStyle = "#005c09";
  context.stroke();

  context.beginPath();
  context.arc(36, 32, 13, 0, Math.PI * 2);
  context.fillStyle = "#fff9eb";
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = "#005c09";
  context.stroke();

  context.beginPath();
  context.arc(36, 32, 5, 0, Math.PI * 2);
  context.fillStyle = center;
  context.fill();

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

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
  activePlaceId,
  choicePlaceId,
  streetViewTarget,
  selectedBarangayCode,
  onPreview,
  onActivate,
  onSelectBarangay,
}: {
  places: Place[];
  highlightedIds: string[];
  previewedId?: string;
  activePlaceId?: string;
  choicePlaceId?: string;
  streetViewTarget?: Place;
  selectedBarangayCode?: string;
  onPreview: (id?: string) => void;
  onActivate: (id: string, mountNode: HTMLElement) => void;
  onSelectBarangay: (code?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const choicePopupRef = useRef<Popup | null>(null);
  const choicePopupPlaceIdRef = useRef<string | undefined>(undefined);
  const renderedChoicePlaceIdRef = useRef(choicePlaceId);
  const previousStreetViewTargetRef = useRef<string | undefined>(undefined);
  const onPreviewRef = useRef(onPreview);
  const onActivateRef = useRef(onActivate);
  const onSelectBarangayRef = useRef(onSelectBarangay);
  const selectedBarangayCodeRef = useRef(selectedBarangayCode);

  useEffect(() => {
    onPreviewRef.current = onPreview;
    onActivateRef.current = onActivate;
    onSelectBarangayRef.current = onSelectBarangay;
  }, [onActivate, onPreview, onSelectBarangay]);

  useEffect(() => {
    selectedBarangayCodeRef.current = selectedBarangayCode;
  }, [selectedBarangayCode]);

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
            tiles: [mapTileUrl],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          },
          places: {
            type: "geojson",
            data: placePoints(places),
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 58,
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
          {
            id: "place-cluster-shadow",
            type: "circle",
            source: "places",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#005c09",
              "circle-opacity": 0.26,
              "circle-translate": [4, 5],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                23,
                8,
                27,
                18,
                32,
              ],
            },
          },
          {
            id: "place-cluster-paper-ring",
            type: "circle",
            source: "places",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#fff9eb",
              "circle-radius": [
                "step",
                ["get", "point_count"],
                23,
                8,
                27,
                18,
                32,
              ],
            },
          },
          {
            id: "place-clusters",
            type: "circle",
            source: "places",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#f4c542",
              "circle-stroke-color": "#005c09",
              "circle-stroke-width": 3,
              "circle-radius": [
                "step",
                ["get", "point_count"],
                18,
                8,
                22,
                18,
                27,
              ],
            },
          },
          {
            id: "place-cluster-center",
            type: "circle",
            source: "places",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "#005c09",
              "circle-radius": 6,
              "circle-stroke-color": "#fff9eb",
              "circle-stroke-width": 2,
            },
          },
          {
            id: "place-point-hitarea",
            type: "circle",
            source: "places",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": "#000000",
              "circle-radius": 30,
              "circle-opacity": 0,
              "circle-translate": [0, -18],
            },
          },
          {
            id: "place-points",
            type: "symbol",
            source: "places",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "icon-image": placePinImageId,
              "icon-size": 0.82,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          },
          {
            id: "place-point-selected",
            type: "symbol",
            source: "places",
            filter: ["==", ["get", "placeId"], ""],
            layout: {
              "icon-image": selectedPlacePinImageId,
              "icon-size": 1,
              "icon-anchor": "bottom",
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
          },
        ],
      },
    });
    const pinImages = {
      [placePinImageId]: createPlacePinImage({
        fill: "#f4c542",
        center: "#005c09",
      }),
      [selectedPlacePinImageId]: createPlacePinImage({
        fill: "#005c09",
        center: "#f4c542",
      }),
    };
    const addPinImage = (imageId: keyof typeof pinImages) => {
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, pinImages[imageId], { pixelRatio: 2 });
      }
    };
    map.on("styleimagemissing", ({ id }) => {
      if (id === placePinImageId || id === selectedPlacePinImageId) {
        addPinImage(id);
      }
    });
    addPinImage(placePinImageId);
    addPinImage(selectedPlacePinImageId);
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    const openPlaceChoice = (placeId: string) => {
      const place = places.find((item) => item.id === placeId);
      if (!place?.coordinates) return;

      choicePopupRef.current?.remove();
      const mountNode = document.createElement("div");
      mountNode.className = "journal-map-popup__mount";
      const popup = new maplibregl.Popup({
        className: "journal-map-popup",
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
        focusAfterOpen: false,
        maxWidth: "none",
        offset: 24,
      })
        .setLngLat([place.coordinates.longitude, place.coordinates.latitude])
        .setDOMContent(mountNode)
        .addTo(map);

      choicePopupRef.current = popup;
      choicePopupPlaceIdRef.current = place.id;
      popup.once("close", () => {
        if (choicePopupRef.current === popup) {
          choicePopupRef.current = null;
          choicePopupPlaceIdRef.current = undefined;
        }
      });
      onActivateRef.current(place.id, mountNode);
    };

    const handleClusterClick = async (
      event: maplibregl.MapLayerMouseEvent & { features?: GeoJSON.Feature[] },
    ) => {
      const feature = event.features?.[0];
      const clusterId = feature?.properties?.cluster_id;
      if (
        typeof clusterId !== "number" ||
        feature?.geometry.type !== "Point"
      ) {
        return;
      }
      const source = map.getSource("places") as GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: feature.geometry.coordinates as [number, number],
        zoom,
        duration: prefersReducedMotion() ? 0 : 450,
      });
    };

    const handlePlaceClick = (
      event: maplibregl.MapLayerMouseEvent & { features?: GeoJSON.Feature[] },
    ) => {
      const placeId = event.features?.[0]?.properties?.placeId;
      if (typeof placeId === "string") openPlaceChoice(placeId);
    };

    let hoveredPlaceId: string | undefined;
    const handlePlaceEnter = (
      event: maplibregl.MapLayerMouseEvent & { features?: GeoJSON.Feature[] },
    ) => {
      map.getCanvas().style.cursor = "pointer";
      const placeId = event.features?.[0]?.properties?.placeId;
      if (typeof placeId === "string") {
        if (hoveredPlaceId && hoveredPlaceId !== placeId) {
          map.setFeatureState(
            { source: "places", id: hoveredPlaceId },
            { hover: false },
          );
        }
        hoveredPlaceId = placeId;
        map.setFeatureState({ source: "places", id: placeId }, { hover: true });
        onPreviewRef.current(placeId);
      }
    };

    const handleBarangayClick = (
      event: maplibregl.MapLayerMouseEvent & { features?: GeoJSON.Feature[] },
    ) => {
      if (
        map.queryRenderedFeatures(event.point, {
          layers: ["place-clusters", "place-points", "place-point-hitarea"],
        }).length
      ) {
        return;
      }
      const code = event.features?.[0]?.properties?.brgy_code;
      if (code !== undefined && code !== null) {
        const nextCode = String(code);
        onSelectBarangayRef.current(
          selectedBarangayCodeRef.current === nextCode ? undefined : nextCode,
        );
      }
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
    map.on("click", "place-clusters", handleClusterClick);
    map.on("click", "place-point-hitarea", handlePlaceClick);
    map.on("mouseenter", "place-clusters", showPointer);
    map.on("mouseleave", "place-clusters", clearPointer);
    map.on("mouseenter", "place-point-hitarea", showPointer);
    map.on("mouseleave", "place-point-hitarea", clearPointer);
    map.on("mouseenter", "place-points", handlePlaceEnter);
    map.on("mouseleave", "place-points", () => {
      if (hoveredPlaceId) {
        map.setFeatureState(
          { source: "places", id: hoveredPlaceId },
          { hover: false },
        );
        hoveredPlaceId = undefined;
      }
      onPreviewRef.current(undefined);
    });

    return () => {
      choicePopupRef.current?.remove();
      choicePopupRef.current = null;
      choicePopupPlaceIdRef.current = undefined;
      map.remove();
      mapRef.current = null;
    };
  }, [places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyHighlight = () => {
      if (!map.getLayer("place-points")) return;
      const highlightedSet = new Set(highlightedIds);
      const source = map.getSource("places") as GeoJSONSource;
      source.setData(
        placePoints(places.filter((place) => highlightedSet.has(place.id))),
      );
      const isHighlighted: maplibregl.ExpressionSpecification = [
        "in",
        ["get", "placeId"],
        ["literal", highlightedIds],
      ];
      map.setPaintProperty("place-points", "icon-opacity", [
        "case",
        isHighlighted,
        1,
        0.22,
      ]);
      map.setFilter("place-point-selected", [
        "==",
        ["get", "placeId"],
        activePlaceId ?? previewedId ?? "",
      ]);
    };

    if (map.isStyleLoaded()) applyHighlight();
    else map.once("style.load", applyHighlight);
    return () => {
      map.off("style.load", applyHighlight);
    };
  }, [activePlaceId, highlightedIds, places, previewedId]);

  useEffect(() => {
    const previousChoicePlaceId = renderedChoicePlaceIdRef.current;
    const selectionChanged =
      previousChoicePlaceId && previousChoicePlaceId !== choicePlaceId;

    if (
      selectionChanged &&
      choicePopupPlaceIdRef.current === previousChoicePlaceId
    ) {
      choicePopupRef.current?.remove();
      choicePopupRef.current = null;
      choicePopupPlaceIdRef.current = undefined;
    }
    renderedChoicePlaceIdRef.current = choicePlaceId;
  }, [choicePlaceId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const reducedMotion = prefersReducedMotion();
    if (!streetViewTarget?.streetView) {
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
        streetViewTarget.streetView.coordinates.longitude,
        streetViewTarget.streetView.coordinates.latitude,
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

    const focusHighlightedPlaces = () => {
      const reducedMotion = prefersReducedMotion();
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
    };

    let focusTimer: number | undefined;
    const scheduleFocus = () => {
      window.clearTimeout(focusTimer);
      // Let MapLibre finish applying its initial city bounds before a filter
      // moves the camera to the matching place or places.
      focusTimer = window.setTimeout(focusHighlightedPlaces, 180);
    };

    if (map.isStyleLoaded()) scheduleFocus();
    else map.once("style.load", scheduleFocus);
    return () => {
      window.clearTimeout(focusTimer);
      map.off("style.load", scheduleFocus);
    };
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

      const reducedMotion = prefersReducedMotion();
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
      data-selected-barangay={selectedBarangayCode}
      role="region"
      aria-label="Interactive map of Tagbilaran place pins, all 15 indicative barangay areas, and the indicative city boundary. The map index provides keyboard controls for every selection."
    />
  );
}
