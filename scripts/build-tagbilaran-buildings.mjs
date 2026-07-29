import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import geojsonVt from "geojson-vt";
import vtPbf from "vt-pbf";

const projectRoot = process.cwd();
const cityBoundaryPath = path.join(
  projectRoot,
  "content",
  "tagbilaran-city-boundary.json",
);
const outputDirectory = path.join(projectRoot, "public", "data", "buildings");
const manifestPath = path.join(
  projectRoot,
  "public",
  "data",
  "tagbilaran-buildings.json",
);
const overpassEndpoint =
  process.env.OVERPASS_ENDPOINT ??
  "https://overpass.kumi.systems/api/interpreter";
const inputPath = process.env.OSM_BUILDINGS_INPUT;

const cityBoundary = JSON.parse(await readFile(cityBoundaryPath, "utf8"));
const cityGeometry = cityBoundary.features?.[0]?.geometry;
if (!cityGeometry) {
  throw new Error("The Tagbilaran city boundary is missing.");
}

function flattenCoordinates(coordinates, output = []) {
  if (
    Array.isArray(coordinates) &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    output.push(coordinates);
    return output;
  }
  for (const coordinate of coordinates ?? []) {
    flattenCoordinates(coordinate, output);
  }
  return output;
}

function pointInRing([longitude, latitude], ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const [currentLongitude, currentLatitude] = ring[current];
    const [previousLongitude, previousLatitude] = ring[previous];
    const crosses =
      currentLatitude > latitude !== previousLatitude > latitude &&
      longitude <
        ((previousLongitude - currentLongitude) *
          (latitude - currentLatitude)) /
          (previousLatitude - currentLatitude) +
          currentLongitude;
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, polygon) {
  if (!pointInRing(point, polygon[0])) return false;
  return !polygon.slice(1).some((hole) => pointInRing(point, hole));
}

function pointInCity(point) {
  if (cityGeometry.type === "Polygon") {
    return pointInPolygon(point, cityGeometry.coordinates);
  }
  if (cityGeometry.type === "MultiPolygon") {
    return cityGeometry.coordinates.some((polygon) =>
      pointInPolygon(point, polygon),
    );
  }
  return false;
}

function numericTag(value) {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const match = String(value).match(/\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const number = Number(match[0]);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

const boundaryPoints = flattenCoordinates(cityGeometry.coordinates);
const longitudes = boundaryPoints.map(([longitude]) => longitude);
const latitudes = boundaryPoints.map(([, latitude]) => latitude);
const bbox = [
  Math.min(...latitudes),
  Math.min(...longitudes),
  Math.max(...latitudes),
  Math.max(...longitudes),
].join(",");
const query = `[out:json][timeout:120];way["building"](${bbox});out geom;`;
let payload;
if (inputPath) {
  payload = JSON.parse(await readFile(path.resolve(inputPath), "utf8"));
} else {
  const response = await fetch(overpassEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "HelloTagbilaran/0.1",
    },
    body: new URLSearchParams({ data: query }),
  });
  if (!response.ok) {
    throw new Error(`OpenStreetMap building request failed: ${response.status}`);
  }
  payload = await response.json();
}
const features = payload.elements.flatMap((element) => {
  const geometry = element.geometry?.map(({ lon, lat }) => [
    Number(lon.toFixed(6)),
    Number(lat.toFixed(6)),
  ]);
  if (!geometry || geometry.length < 4) return [];
  const first = geometry[0];
  const last = geometry.at(-1);
  if (first[0] !== last[0] || first[1] !== last[1]) geometry.push(first);

  const center = geometry
    .slice(0, -1)
    .reduce(
      ([longitude, latitude], [nextLongitude, nextLatitude]) => [
        longitude + nextLongitude / (geometry.length - 1),
        latitude + nextLatitude / (geometry.length - 1),
      ],
      [0, 0],
    );
  if (!pointInCity(center)) return [];

  const height = numericTag(element.tags?.height);
  const levels = numericTag(element.tags?.["building:levels"]);
  return [
    {
      type: "Feature",
      id: element.id,
      properties: {
        osmId: element.id,
        ...(height === undefined ? {} : { height }),
        ...(levels === undefined ? {} : { levels }),
      },
      geometry: {
        type: "Polygon",
        coordinates: [geometry],
      },
    },
  ];
});

const featureCollection = {
  type: "FeatureCollection",
  features,
};

function tileCoordinate(longitude, latitude, zoom) {
  const scale = 2 ** zoom;
  const latitudeRadians = (latitude * Math.PI) / 180;
  return {
    x: Math.floor(((longitude + 180) / 360) * scale),
    y: Math.floor(
      ((1 -
        Math.log(
          Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians),
        ) /
          Math.PI) /
        2) *
        scale,
    ),
  };
}

const minZoom = 13;
const maxZoom = 16;
const tileIndex = geojsonVt(featureCollection, {
  maxZoom,
  indexMaxZoom: maxZoom,
  indexMaxPoints: 0,
  tolerance: 1,
  extent: 4096,
  buffer: 64,
});
await rm(outputDirectory, { recursive: true, force: true });

let tileCount = 0;
let featureTileCount = 0;
for (let zoom = minZoom; zoom <= maxZoom; zoom += 1) {
  const northWest = tileCoordinate(
    Math.min(...longitudes),
    Math.max(...latitudes),
    zoom,
  );
  const southEast = tileCoordinate(
    Math.max(...longitudes),
    Math.min(...latitudes),
    zoom,
  );
  for (let x = northWest.x; x <= southEast.x; x += 1) {
    for (let y = northWest.y; y <= southEast.y; y += 1) {
      const tile = tileIndex.getTile(zoom, x, y);
      if (tile?.features.length) featureTileCount += 1;
      const tileDirectory = path.join(outputDirectory, String(zoom), String(x));
      await mkdir(tileDirectory, { recursive: true });
      await writeFile(
        path.join(tileDirectory, `${y}.pbf`),
        vtPbf.fromGeojsonVt({
          building: tile ?? {
            features: [],
          },
        }),
      );
      tileCount += 1;
    }
  }
}

await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(
  manifestPath,
  JSON.stringify({
    featureCount: features.length,
    tileCount,
    featureTileCount,
    minZoom,
    maxZoom,
    source: "OpenStreetMap contributors",
    sourceUrl: "https://www.openstreetmap.org/copyright",
    retrievedAt: new Date().toISOString().slice(0, 10),
    geometryNote:
      "Building footprints are clipped to the indicative Tagbilaran city boundary. Recorded height or level tags are retained; untagged buildings use a uniform illustrative extrusion in the interface.",
  }),
);
console.log(
  `Wrote ${features.length} building footprints across ${featureTileCount} populated tiles and ${tileCount} total local vector tiles.`,
);
