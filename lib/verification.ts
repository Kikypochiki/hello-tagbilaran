import type { Place, StreetViewReference } from "@/types/content";

export function isStreetViewCurrent(
  streetView: StreetViewReference | undefined,
  today = new Date(),
) {
  if (!streetView || streetView.match !== "exact-venue") return false;
  const reviewDueAt = new Date(`${streetView.reviewDueAt}T23:59:59+08:00`);
  return Number.isFinite(reviewDueAt.getTime()) && reviewDueAt >= today;
}

export function placeReviewLabel(place: Place) {
  if (place.verification.identity === "needs-confirmation") {
    return "Needs confirmation";
  }
  if (place.verification.operatingStatus === "needs-confirmation") {
    return "Sources reviewed · Current visit details need confirmation";
  }
  return place.verification.identity === "locally-confirmed"
    ? "Locally confirmed"
    : "Reviewed";
}

export function hasReviewedLocation(place: Place) {
  return place.verification.location !== "unverified" && Boolean(place.coordinates);
}
