import { tagbilaranBarangays } from "../content/barangays";
import { places } from "../content/places";
import { isStreetViewCurrent } from "../lib/verification";

const warnings: string[] = [];
const errors: string[] = [];
const today = new Date();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function warn(message: string) {
  warnings.push(message);
}

function error(message: string) {
  errors.push(message);
}

function validDate(value: string) {
  return datePattern.test(value) && Number.isFinite(new Date(value).getTime());
}

const ids = new Set<string>();
const slugs = new Set<string>();

for (const place of places) {
  const label = `${place.name} (${place.slug})`;
  if (ids.has(place.id)) error(`${label}: duplicate id "${place.id}".`);
  if (slugs.has(place.slug)) error(`${label}: duplicate slug "${place.slug}".`);
  ids.add(place.id);
  slugs.add(place.slug);

  if (!place.sources.length) error(`${label}: at least one source is required.`);
  for (const source of place.sources) {
    if (!source.title.trim()) error(`${label}: a source is missing its title.`);
    if (!source.publisher?.trim()) warn(`${label}: "${source.title}" has no publisher.`);
    if (!validDate(source.accessedAt)) {
      error(`${label}: "${source.title}" has an invalid access date.`);
    }
  }

  if (!validDate(place.verification.reviewedAt)) {
    error(`${label}: invalid verification review date.`);
  }
  if (!validDate(place.verification.reviewDueAt)) {
    error(`${label}: invalid verification due date.`);
  } else if (new Date(place.verification.reviewDueAt) < today) {
    warn(`${label}: listing review is overdue.`);
  }

  if (place.coordinates) {
    const { latitude, longitude } = place.coordinates;
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      error(`${label}: coordinates are outside valid latitude/longitude bounds.`);
    }
    if (place.verification.location === "unverified") {
      error(`${label}: unverified coordinates cannot create a map marker.`);
    }
  } else if (place.directionsUrl) {
    error(`${label}: directions cannot publish without reviewed coordinates.`);
  }

  if (!place.images.length) warn(`${label}: no visitor image is available.`);
  for (const image of place.images) {
    if (!image.alt.trim()) error(`${label}: an image is missing alternative text.`);
    if (!image.credit?.trim()) warn(`${label}: "${image.src}" has no credit.`);
    if (!image.rights?.trim()) warn(`${label}: "${image.src}" has no rights note.`);
  }
  if (place.verification.mediaRights === "needs-permission") {
    warn(`${label}: media permission or publication rights remain unresolved.`);
  }

  if (place.streetView) {
    if (place.streetView.match !== "exact-venue") {
      error(`${label}: Street View must be an exact-venue match.`);
    }
    if (!validDate(place.streetView.verifiedAt)) {
      error(`${label}: Street View has an invalid review date.`);
    }
    if (!validDate(place.streetView.reviewDueAt)) {
      error(`${label}: Street View has an invalid review due date.`);
    }
    if (!isStreetViewCurrent(place.streetView, today)) {
      error(`${label}: expired Street View must not publish.`);
    }
  }
}

if (tagbilaranBarangays.length !== 15) {
  error(`Expected the PSA-confirmed 15 Tagbilaran barangays; found ${tagbilaranBarangays.length}.`);
}
if (new Set(tagbilaranBarangays.map((barangay) => barangay.code)).size !== 15) {
  error("Tagbilaran barangay codes must be unique.");
}

for (const message of warnings) console.warn(`CONTENT WARNING: ${message}`);
for (const message of errors) console.error(`CONTENT ERROR: ${message}`);

console.log(
  `Content health: ${places.length} places, ${warnings.length} warnings, ${errors.length} errors.`,
);

if (errors.length || (process.env.CONTENT_STRICT === "1" && warnings.length)) {
  process.exitCode = 1;
}
