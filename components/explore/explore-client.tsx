"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { MapPlaceChoice } from "@/components/explore/map-place-choice";
import { MapErrorBoundary } from "@/components/explore/map-error-boundary";
import { PlaceDialog } from "@/components/explore/place-dialog";
import { StreetViewExperience } from "@/components/explore/street-view-experience";
import { BarangaySheet } from "@/components/explore/barangay-sheet";
import { ScopeBadge } from "@/components/scope-badge";
import {
  tagbilaranBarangays,
} from "@/content/barangays";
import { filterPlaces } from "@/lib/explore-filters";
import {
  categoryDescriptions,
  categoryLabels,
  categoryOrder,
} from "@/lib/place-labels";
import { readSavedPlaceIds, subscribeToSavedPlaces } from "@/lib/saved-places";
import { hasReviewedLocation } from "@/lib/verification";
import type { Place, PlaceCategory } from "@/types/content";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((module) => module.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="map-loading map-loading--full" role="status">
        <span className="map-loading__compass" aria-hidden="true" />
        Drawing the Tagbilaran map…
      </div>
    ),
  },
);

function isCategory(value: string | null): value is PlaceCategory {
  return Boolean(value && value in categoryLabels);
}

export function ExploreClient({ places }: { places: Place[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const category = isCategory(categoryParam) ? categoryParam : null;
  const savedOnly = searchParams.get("saved") === "1";
  const queryParam = searchParams.get("q") ?? "";
  const indexRef = useRef<HTMLDetailsElement>(null);
  const barangayBrowseRef = useRef<HTMLButtonElement>(null);
  const barangayDirectoryCloseRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState(queryParam);
  const [barangayDirectoryOpen, setBarangayDirectoryOpen] = useState(false);
  const [previewedId, setPreviewedId] = useState<string>();
  const [promptedPlace, setPromptedPlace] = useState<Place>();
  const [promptMountNode, setPromptMountNode] = useState<HTMLElement>();
  const [streetViewPlace, setStreetViewPlace] = useState<Place>();
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedPlaces,
    () => readSavedPlaceIds().join("\u0000"),
    () => "",
  );
  const savedIds = useMemo(
    () => new Set(savedSnapshot ? savedSnapshot.split("\u0000") : []),
    [savedSnapshot],
  );

  useEffect(() => {
    // Browser back/forward is an external state change that must update the draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const index = indexRef.current;
    if (!index) return;
    if (window.matchMedia("(max-width: 780px)").matches) index.open = false;
    index.dataset.mobileReady = "true";
  }, []);

  const selectedPlace = places.find(
    (place) => place.slug === searchParams.get("place"),
  );
  const selectedBarangay = tagbilaranBarangays.find(
    (barangay) => barangay.code === searchParams.get("barangay"),
  );
  const selectedBarangayIndex = selectedBarangay
    ? tagbilaranBarangays.findIndex((item) => item.code === selectedBarangay.code)
    : -1;

  const filteredPlaces = useMemo(
    () =>
      filterPlaces(places, {
        category,
        query,
        savedOnly,
        savedIds,
      }),
    [category, places, query, savedIds, savedOnly],
  );

  const availableCategories = useMemo(
    () => categoryOrder.filter((item) => places.some((place) => place.category === item)),
    [places],
  );
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categoryOrder.map((item) => [
          item,
          places.filter((place) => place.category === item).length,
        ]),
      ) as Record<PlaceCategory, number>,
    [places],
  );

  const [mappablePlaces] = useState(() =>
    places.filter(hasReviewedLocation),
  );
  const highlightedIds = useMemo(
    () => filteredPlaces.filter((place) => place.coordinates).map((place) => place.id),
    [filteredPlaces],
  );
  const previewedPlace = mappablePlaces.find((place) => place.id === previewedId);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const current = window.location.search.slice(1);
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const suffix = next.toString();
      if (suffix === current) return;

      window.history.replaceState(
        null,
        "",
        suffix ? `${pathname}?${suffix}` : pathname,
      );
    },
    [pathname],
  );

  useEffect(() => {
    if (!selectedBarangay) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") replaceParams({ barangay: null });
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [replaceParams, selectedBarangay]);

  useEffect(() => {
    if (!barangayDirectoryOpen) return;
    barangayDirectoryCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setBarangayDirectoryOpen(false);
      window.setTimeout(() => barangayBrowseRef.current?.focus());
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [barangayDirectoryOpen]);

  const openPlace = useCallback(
    (place: Place) => {
      setPreviewedId(undefined);
      replaceParams({ place: place.slug });
    },
    [replaceParams],
  );

  const promptForPlace = useCallback(
    (place: Place, mountNode: HTMLElement) => {
      setPreviewedId(undefined);
      setStreetViewPlace(undefined);
      setPromptedPlace(place);
      setPromptMountNode(mountNode);
    },
    [],
  );

  const dismissPlaceChoice = useCallback(() => {
    setPromptedPlace(undefined);
    setPromptMountNode(undefined);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setPreviewedId(undefined);
    replaceParams({ q: value || null, place: null });
  }

  return (
    <section
      className="map-only-workspace"
      aria-label="Explore Tagbilaran city map"
    >
      <h1 className="sr-only">Explore Tagbilaran</h1>

      <details className="map-index" ref={indexRef} open>
        <summary>
          <span className="map-index__summary-copy">
            <strong>Find a place</strong>
            <small>
              {category
                ? categoryLabels[category]
                : selectedBarangay
                  ? selectedBarangay.name
                  : savedOnly
                    ? "Saved places"
                    : "Explore Tagbilaran"}
            </small>
          </span>
          <span className="map-index__count">
            {filteredPlaces.length} matches
          </span>
          <span className="map-index__toggle-label" aria-hidden="true">
            <span data-when-open>Close</span>
            <span data-when-closed>Open</span>
          </span>
        </summary>

        <div className="map-index__body">
          <section className="map-index__section" aria-labelledby="explore-index-title">
            <header className="map-index__intro">
              <div>
                <h2 id="explore-index-title">What would you like to find?</h2>
                <p>Choose an interest, search by name, or focus on one barangay.</p>
              </div>
              {category || query || savedOnly || selectedBarangay ? (
                <button
                  className="map-index__reset"
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPreviewedId(undefined);
                    replaceParams({
                      q: null,
                      category: null,
                      saved: null,
                      barangay: null,
                      place: null,
                    });
                  }}
                >
                  Reset
                </button>
              ) : null}
            </header>
            <p className="sr-only" aria-live="polite">
              {filteredPlaces.length} places shown
            </p>

            <label className="search-field search-field--index">
              <span>Search by place or barangay</span>
              <span className="search-field__control">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Try “museum” or “Bool”"
                />
              </span>
            </label>

            <fieldset className="category-filters category-filters--index">
              <legend>Browse by interest</legend>
              <button
                className="category-choice"
                type="button"
                aria-pressed={!category}
                onClick={() => {
                  setPreviewedId(undefined);
                  replaceParams({ category: null, place: null });
                }}
              >
                <span>
                  <strong>All places</strong>
                  <small>Museums, dining, stays, shops, and outdoor spaces</small>
                </span>
                <b>{places.length}</b>
              </button>
              {availableCategories.map((item) => (
                <button
                  className="category-choice"
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => {
                    setPreviewedId(undefined);
                    replaceParams({ category: item, place: null });
                  }}
                >
                  <span>
                    <strong>{categoryLabels[item]}</strong>
                    <small>{categoryDescriptions[item]}</small>
                  </span>
                  <b>{categoryCounts[item]}</b>
                </button>
              ))}
            </fieldset>

            <div className="map-index__utilities">
              <button
                className="barangay-browse"
                type="button"
                ref={barangayBrowseRef}
                onClick={() => setBarangayDirectoryOpen(true)}
              >
                <span>
                  <strong>Browse barangays</strong>
                  <small>
                    {selectedBarangay?.name ?? "Open the city directory"}
                  </small>
                </span>
                <b>15</b>
              </button>
              <button
                className="saved-filter"
                type="button"
                aria-pressed={savedOnly}
                onClick={() =>
                  replaceParams({ saved: savedOnly ? null : "1", place: null })
                }
              >
                <span>
                  <strong>Saved places</strong>
                  <small>Your personal shortlist</small>
                </span>
                <b>{savedIds.size}</b>
              </button>
            </div>

            <footer className="map-index__status" role="status">
              <strong>
                {filteredPlaces.length}{" "}
                {filteredPlaces.length === 1 ? "place" : "places"} highlighted
              </strong>
              <span>
                Select a marker on the map to open its description and visit details.
              </span>
            </footer>
          </section>
        </div>
      </details>

      {barangayDirectoryOpen ? (
        <div
          className="barangay-directory"
          role="dialog"
          aria-modal="true"
          aria-labelledby="barangay-directory-title"
        >
          <header>
            <div>
              <small>Tagbilaran City</small>
              <h2 id="barangay-directory-title">Choose a barangay</h2>
            </div>
            <button
              type="button"
              ref={barangayDirectoryCloseRef}
              onClick={() => {
                setBarangayDirectoryOpen(false);
                window.setTimeout(() => barangayBrowseRef.current?.focus());
              }}
            >
              Close
            </button>
          </header>
          <p>Select a district to highlight its boundary and open its city profile.</p>
          <div className="barangay-directory__list">
            <button
              type="button"
              aria-pressed={!selectedBarangay}
              onClick={() => {
                setBarangayDirectoryOpen(false);
                replaceParams({ barangay: null, place: null });
              }}
            >
              <span>All barangays</span>
              <small>Clear district focus</small>
            </button>
            {tagbilaranBarangays.map((barangay, index) => (
              <button
                type="button"
                key={barangay.code}
                data-barangay-code={barangay.code}
                aria-pressed={selectedBarangay?.code === barangay.code}
                onClick={() => {
                  setBarangayDirectoryOpen(false);
                  replaceParams({ barangay: barangay.code, place: null });
                }}
              >
                <span>{barangay.name}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <MapErrorBoundary>
        <MapCanvas
          places={mappablePlaces}
          highlightedIds={highlightedIds}
          previewedId={previewedId}
          activePlaceId={promptedPlace?.id ?? streetViewPlace?.id}
          choicePlaceId={promptedPlace?.id}
          streetViewTarget={streetViewPlace}
          selectedBarangayCode={selectedBarangay?.code}
          onPreview={setPreviewedId}
          onActivate={(id, mountNode) => {
            const place = places.find((item) => item.id === id);
            if (place) promptForPlace(place, mountNode);
          }}
          onSelectBarangay={(code) => replaceParams({ barangay: code ?? null })}
        />
      </MapErrorBoundary>

      {highlightedIds.length === 0 ? (
        <div className="map-category-empty map-category-empty--map-only" role="status">
          <strong>No map markers match these filters.</strong>
          <span>Reset the search, category, or saved-place filter to continue.</span>
        </div>
      ) : null}

      {previewedPlace && !selectedPlace && !promptedPlace && !streetViewPlace ? (
        <aside className="map-place-preview map-place-preview--map-only" aria-live="polite">
          <button
            className="map-place-preview__close"
            type="button"
            aria-label={`Close preview of ${previewedPlace.name}`}
            onClick={() => setPreviewedId(undefined)}
          >
            <span aria-hidden="true">×</span>
          </button>
          <Image
            className="map-place-preview__photo"
            src={previewedPlace.images[0].src}
            alt=""
            width={previewedPlace.images[0].width}
            height={previewedPlace.images[0].height}
            sizes="(max-width: 780px) calc(100vw - 1.5rem), 390px"
            loading="lazy"
          />
          <div className="map-place-preview__labels">
            <ScopeBadge scope={previewedPlace.scope} />
            <span className="category-label">
              {categoryLabels[previewedPlace.category]}
            </span>
          </div>
          <h2>{previewedPlace.name}</h2>
        </aside>
      ) : null}

      {selectedBarangay ? (
        <BarangaySheet
          barangay={selectedBarangay}
          places={places}
          previous={tagbilaranBarangays[(selectedBarangayIndex - 1 + tagbilaranBarangays.length) % tagbilaranBarangays.length]}
          next={tagbilaranBarangays[(selectedBarangayIndex + 1) % tagbilaranBarangays.length]}
          onChoose={(code) => replaceParams({ barangay: code })}
          onClose={() => {
            replaceParams({ barangay: null });
            window.setTimeout(() => barangayBrowseRef.current?.focus());
          }}
        />
      ) : null}

      <aside className="map-boundary-note map-legend" aria-label="Map symbol legend">
        <span className="map-legend__items">
          <span>
            <i data-symbol="place" aria-hidden="true" />
            Place
          </span>
          <span>
            <i data-symbol="group" aria-hidden="true" />
            Group
          </span>
          <span>
            <i data-symbol="boundary" aria-hidden="true" />
            City boundary
          </span>
        </span>
        <small>
          Yellow marks a selected barangay. Boundary geometry requires local confirmation.
        </small>
      </aside>

      {selectedPlace ? (
        <PlaceDialog
          key={selectedPlace.id}
          place={selectedPlace}
          onClose={() => replaceParams({ place: null })}
        />
      ) : null}

      {promptedPlace && promptMountNode ? (
        <MapPlaceChoice
          key={promptedPlace.id}
          place={promptedPlace}
          mountNode={promptMountNode}
          onClose={dismissPlaceChoice}
          onDetails={() => {
            dismissPlaceChoice();
            openPlace(promptedPlace);
          }}
          onStreetView={() => {
            dismissPlaceChoice();
            setStreetViewPlace(promptedPlace);
          }}
        />
      ) : null}

      {streetViewPlace ? (
        <StreetViewExperience
          key={streetViewPlace.id}
          place={streetViewPlace}
          onClose={() => setStreetViewPlace(undefined)}
        />
      ) : null}
    </section>
  );
}
