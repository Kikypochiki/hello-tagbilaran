import { placeReviewLabel } from "@/lib/verification";
import type { Place } from "@/types/content";

export function PlaceVerificationNote({
  place,
  compact = false,
}: {
  place: Place;
  compact?: boolean;
}) {
  const label = compact
    ? place.verification.identity === "locally-confirmed"
      ? "Locally confirmed"
      : place.verification.identity === "needs-confirmation"
        ? "Needs confirmation"
        : "Sources reviewed"
    : placeReviewLabel(place);

  return (
    <p className="place-verification" data-compact={compact || undefined}>
      <span aria-hidden="true">✓</span>
      <span>
        <strong>{label}</strong>
        {!compact ? <small>Reviewed {place.verification.reviewedAt}</small> : null}
      </span>
    </p>
  );
}
