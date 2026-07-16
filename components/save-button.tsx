"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import {
  readSavedPlaceIds,
  subscribeToSavedPlaces,
  writeSavedPlaceIds,
} from "@/lib/saved-places";

export function SaveButton({ placeId, placeName }: { placeId: string; placeName: string }) {
  const [announcement, setAnnouncement] = useState("");
  const getSnapshot = useCallback(
    () => readSavedPlaceIds().includes(placeId),
    [placeId],
  );
  const getServerSnapshot = useCallback(() => false, []);
  const saved = useSyncExternalStore(
    subscribeToSavedPlaces,
    getSnapshot,
    getServerSnapshot,
  );

  function toggleSaved() {
    const current = readSavedPlaceIds();
    const nextSaved = !current.includes(placeId);
    const next = nextSaved
      ? [...current, placeId]
      : current.filter((id) => id !== placeId);

    if (writeSavedPlaceIds(next)) {
      setAnnouncement(
        nextSaved ? `${placeName} saved.` : `${placeName} removed from saved places.`,
      );
    } else {
      setAnnouncement("Saving is unavailable in this browser.");
    }
  }

  return (
    <>
      <button
        className="stamp-button"
        data-saved={saved || undefined}
        type="button"
        aria-pressed={saved}
        onClick={toggleSaved}
      >
        <span aria-hidden="true">{saved ? "✓" : "+"}</span>
        {saved ? "Saved" : "Save stop"}
      </button>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
