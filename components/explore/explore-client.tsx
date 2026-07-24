"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
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
import { PlaceVerificationNote } from "@/components/place-verification-note";
import { ScopeBadge } from "@/components/scope-badge";
import {
  tagbilaranAdministrativeSource,
  tagbilaranBarangays,
  tagbilaranBoundarySource,
} from "@/content/barangays";
import { filterPlaces } from "@/lib/explore-filters";
import { categoryLabels, categoryOrder, scopeLabels } from "@/lib/place-labels";
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
  const [query, setQuery] = useState(queryParam);
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
          <span>
            <strong>Places &amp; barangays</strong>
          </span>
          <span className="map-index__count">
            {places.length} places · {tagbilaranBarangays.length} barangays
          </span>
        </summary>

        <div className="map-index__body">
          <section className="map-index__section" aria-labelledby="places-index-title">
            <h2 className="sr-only" id="places-index-title">
              Search and filter places
            </h2>
            <p className="sr-only" aria-live="polite">
              {filteredPlaces.length} places shown
            </p>

            <label className="search-field search-field--index">
              <span>Search the place index</span>
              <span className="search-field__control">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 5 5" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder="Name, barangay, or category"
                />
              </span>
            </label>

            <fieldset className="category-filters category-filters--index">
              <legend>Highlight a place category</legend>
              <button
                type="button"
                aria-pressed={!category}
                onClick={() => {
                  setPreviewedId(undefined);
                  replaceParams({ category: null, place: null });
                }}
              >
                All
              </button>
              {availableCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => {
                    setPreviewedId(undefined);
                    replaceParams({ category: item, place: null });
                  }}
                >
                  {categoryLabels[item]}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={savedOnly}
                onClick={() =>
                  replaceParams({ saved: savedOnly ? null : "1", place: null })
                }
              >
                Saved ({savedIds.size})
              </button>
            </fieldset>

            <p className="map-index__source">
              Explore {places.length} curated entries. Map points and directions appear
              only where the location has been source-reviewed.
            </p>

            {filteredPlaces.length ? (
              <ol className="map-index__places">
                {filteredPlaces.map((place) => (
                  <li className="map-index__place-entry" key={place.id}>
                    <Link
                      className="map-index__place-link"
                      href={`/places/${place.slug}`}
                      onClick={(event) => {
                        if (
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return;
                        }
                        event.preventDefault();
                        openPlace(place);
                      }}
                      onPointerEnter={(event) => {
                        if (event.pointerType === "mouse" && place.coordinates) {
                          setPreviewedId(place.id);
                        }
                      }}
                      onPointerLeave={() => setPreviewedId(undefined)}
                      onFocus={() => {
                        if (
                          window.matchMedia("(hover: hover)").matches &&
                          place.coordinates
                        ) {
                          setPreviewedId(place.id);
                        }
                      }}
                      onBlur={() => setPreviewedId(undefined)}
                    >
                      <Image
                        className="map-index__place-photo"
                        src={place.images[0].src}
                        alt=""
                        width={place.images[0].width}
                        height={place.images[0].height}
                        sizes="72px"
                        loading="lazy"
                      />
                      <span className="map-index__place-copy">
                        <span className="map-index__place-name">{place.name}</span>
                        <span className="map-index__place-meta">
                          <span>{categoryLabels[place.category]}</span>
                          <span>{scopeLabels[place.scope]}</span>
                        </span>
                        <PlaceVerificationNote place={place} compact />
                      </span>
                    </Link>
                    {hasReviewedLocation(place) && place.directionsUrl ? (
                    <a
                      className="map-index__directions"
                      href={place.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Maps
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only">Open Google Maps for {place.name}</span>
                    </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="map-index__empty" role="status">
                <strong>No matching place entries.</strong>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    replaceParams({
                      q: null,
                      category: null,
                      saved: null,
                      place: null,
                    });
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="map-index__section" aria-labelledby="barangay-index-title">
            <header className="map-index__heading">
              <div>
                <h2 id="barangay-index-title">All 15 barangays</h2>
              </div>
            </header>
            <div className="barangay-index">
              {tagbilaranBarangays.map((barangay) => (
                <button
                  key={barangay.code}
                  data-barangay-code={barangay.code}
                  type="button"
                  aria-pressed={selectedBarangay?.code === barangay.code}
                  onClick={() =>
                    replaceParams({
                      barangay:
                        selectedBarangay?.code === barangay.code ? null : barangay.code,
                    })
                  }
                >
                  <span>{barangay.name}</span>
                  <small>{barangay.code}</small>
                </button>
              ))}
            </div>
            <p className="map-index__source">
              Names and codes: {tagbilaranAdministrativeSource.publisher}.{" "}
              {tagbilaranBoundarySource.note} Boundary source:{" "}
              {tagbilaranBoundarySource.publisher}.
            </p>
          </section>
        </div>
      </details>

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
          <strong>No source-located pins in this filter.</strong>
          <span>Matching entries remain available inside the map index.</span>
        </div>
      ) : null}

      {previewedPlace && !selectedPlace && !promptedPlace && !streetViewPlace ? (
        <aside className="map-place-preview map-place-preview--map-only" aria-live="polite">
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
          <p>{previewedPlace.summary}</p>
          <button className="text-link" type="button" onClick={() => openPlace(previewedPlace)}>
            Open complete information <span aria-hidden="true">→</span>
          </button>
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
            const code = selectedBarangay.code;
            replaceParams({ barangay: null });
            window.setTimeout(() => document.querySelector<HTMLButtonElement>(`[data-barangay-code="${code}"]`)?.focus());
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
