const STORAGE_KEY = "hello-tagbilaran:saved-places";
const STORAGE_VERSION = 1;
const CHANGE_EVENT = "hello-tagbilaran:saved-places-change";

interface SavedPlacesPayload {
  version: number;
  placeIds: string[];
  updatedAt: string;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 100 &&
    value.every((item) => typeof item === "string" && item.length <= 120)
  );
}

export function readSavedPlaceIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== STORAGE_VERSION ||
      !("placeIds" in parsed) ||
      !isStringArray(parsed.placeIds)
    ) {
      return [];
    }

    return [...new Set(parsed.placeIds)];
  } catch {
    return [];
  }
}

export function writeSavedPlaceIds(placeIds: string[]) {
  if (typeof window === "undefined") return false;

  try {
    const payload: SavedPlacesPayload = {
      version: STORAGE_VERSION,
      placeIds: [...new Set(placeIds)].slice(0, 100),
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function subscribeToSavedPlaces(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
