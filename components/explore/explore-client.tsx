"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useCallback, useMemo, useState } from "react";
import { PlaceDialog } from "@/components/explore/place-dialog";
import { ScopeBadge } from "@/components/scope-badge";
import {
  tagbilaranBarangays,
  tagbilaranBoundarySource,
} from "@/content/barangays";
import { categoryLabels, categoryOrder, scopeLabels } from "@/lib/place-labels";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const category = isCategory(categoryParam) ? categoryParam : null;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [previewedId, setPreviewedId] = useState<string>();

  const selectedPlace = places.find(
    (place) => place.slug === searchParams.get("place"),
  );
  const selectedBarangay = tagbilaranBarangays.find(
    (barangay) => barangay.code === searchParams.get("barangay"),
  );

  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return places.filter((place) => {
      const matchesCategory = !category || place.category === category;
      const matchesQuery =
        !normalized ||
        [place.name, place.summary, categoryLabels[place.category], place.barangay]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, places, query]);

  const availableCategories = useMemo(
    () => categoryOrder.filter((item) => places.some((place) => place.category === item)),
    [places],
  );

  const mappablePlaces = useMemo(
    () => places.filter((place) => Boolean(place.coordinates)),
    [places],
  );
  const highlightedIds = useMemo(
    () => filteredPlaces.filter((place) => place.coordinates).map((place) => place.id),
    [filteredPlaces],
  );
  const previewedPlace = mappablePlaces.find((place) => place.id === previewedId);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      startTransition(() => {
        const suffix = next.toString();
        router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const openPlace = useCallback(
    (place: Place) => {
      setPreviewedId(undefined);
      replaceParams({ place: place.slug });
    },
    [replaceParams],
  );

  function updateQuery(value: string) {
    setQuery(value);
    setPreviewedId(undefined);
    replaceParams({ q: value.trim() || null, place: null });
  }

  return (
    <section className="map-only-workspace" aria-label="Explore Tagbilaran city map">
      <h1 className="sr-only">Explore Tagbilaran</h1>

      <details className="map-index" open>
        <summary>
          <span>
            <span className="section-kicker">Journal index</span>
            <strong>Places &amp; barangays</strong>
          </span>
          <span className="map-index__count">
            {places.length} places · {tagbilaranBarangays.length} barangays
          </span>
        </summary>

        <div className="map-index__body">
          <section className="map-index__section" aria-labelledby="places-index-title">
            <header className="map-index__heading">
              <div>
                <p className="section-kicker">Place register</p>
                <h2 id="places-index-title">Find a place</h2>
              </div>
              <span aria-live="polite">
                {highlightedIds.length} mapped · {filteredPlaces.length} indexed
              </span>
            </header>

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
            </fieldset>

            <p className="map-index__source">
              This curated index contains {places.length} project-listed, source-reviewed places.
              Every entry includes a photo, a mapped point, and a direct Google Maps link.
              Time-sensitive visitor details remain withheld when no current authoritative
              source publishes them.
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
                      onPointerEnter={() => {
                        if (place.coordinates) setPreviewedId(place.id);
                      }}
                      onPointerLeave={() => setPreviewedId(undefined)}
                      onFocus={() => {
                        if (place.coordinates) setPreviewedId(place.id);
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
                      </span>
                    </Link>
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
                    replaceParams({ q: null, category: null, place: null });
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
                <p className="section-kicker">City districts</p>
                <h2 id="barangay-index-title">All 15 barangays</h2>
              </div>
            </header>
            <div className="barangay-index">
              {tagbilaranBarangays.map((barangay) => (
                <button
                  key={barangay.code}
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
              {tagbilaranBoundarySource.note} Source: {tagbilaranBoundarySource.publisher}.
            </p>
          </section>
        </div>
      </details>

      <MapCanvas
        places={mappablePlaces}
        highlightedIds={highlightedIds}
        previewedId={previewedId}
        selectedBarangayCode={selectedBarangay?.code}
        onPreview={setPreviewedId}
        onActivate={(id) => {
          const place = places.find((item) => item.id === id);
          if (place) openPlace(place);
        }}
        onSelectBarangay={(code) => replaceParams({ barangay: code ?? null })}
      />

      {highlightedIds.length === 0 ? (
        <div className="map-category-empty map-category-empty--map-only" role="status">
          <strong>No source-located pins in this filter.</strong>
          <span>Matching entries remain available inside the map index.</span>
        </div>
      ) : null}

      {previewedPlace && !selectedPlace ? (
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
          <p className="section-kicker">Place note</p>
          <h2>{previewedPlace.name}</h2>
          <p>{previewedPlace.summary}</p>
          <button className="text-link" type="button" onClick={() => openPlace(previewedPlace)}>
            Open complete information <span aria-hidden="true">→</span>
          </button>
        </aside>
      ) : null}

      {selectedBarangay ? (
        <aside className="selected-barangay" aria-live="polite">
          <p className="section-kicker">Highlighted barangay</p>
          <h2>{selectedBarangay.name}</h2>
          <p>Indicative administrative area · PSGC {selectedBarangay.code}</p>
          <button type="button" onClick={() => replaceParams({ barangay: null })}>
            Clear highlight
          </button>
        </aside>
      ) : null}

      <p className="map-boundary-note">
        Yellow marks the selected barangay. The green line marks the indicative Tagbilaran
        City boundary. Boundary geometry requires local confirmation.
      </p>

      {selectedPlace ? (
        <PlaceDialog
          key={selectedPlace.id}
          place={selectedPlace}
          onClose={() => replaceParams({ place: null })}
        />
      ) : null}
    </section>
  );
}
