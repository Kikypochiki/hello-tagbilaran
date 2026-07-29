"""Clip Project NOAH provincial shapefiles to Tagbilaran City.

This is a content-build utility, not a runtime dependency. Install pyshp and
Shapely in a temporary Python environment before running it.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import shapefile
from shapely import make_valid, set_precision, simplify
from shapely.geometry import mapping, shape
from shapely.ops import unary_union


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--boundary", type=Path, required=True)
    parser.add_argument("--field", required=True)
    parser.add_argument("--hazard", required=True)
    parser.add_argument("--scenario", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--source-url", required=True)
    return parser.parse_args()


def load_boundary(path: Path):
    document = json.loads(path.read_text(encoding="utf-8"))
    return unary_union(
        [make_valid(shape(feature["geometry"])) for feature in document["features"]]
    )


def optimized_geometry(geometry):
    clipped = make_valid(geometry).intersection(CITY_BOUNDARY)
    if clipped.is_empty:
        return None

    # Approximately two metres at Tagbilaran's latitude. This keeps the public
    # layer responsive while preserving the source map's local shape.
    clipped = simplify(clipped, tolerance=0.000018, preserve_topology=True)
    clipped = set_precision(clipped, grid_size=0.000001)
    return mapping(clipped)


def local_shape(source_shape):
    """Construct only rings that can intersect the city before using Shapely."""
    west, south, east, north = CITY_BOUNDARY.bounds
    points = source_shape.points
    starts = list(source_shape.parts) + [len(points)]
    rings = []
    for index in range(len(starts) - 1):
        ring = points[starts[index] : starts[index + 1]]
        if not ring:
            continue
        xs = [point[0] for point in ring]
        ys = [point[1] for point in ring]
        if max(xs) < west or min(xs) > east or max(ys) < south or min(ys) > north:
            continue
        rings.append(ring)

    polygons = shapefile.organize_polygon_rings(rings)
    return shape({"type": "MultiPolygon", "coordinates": polygons})


def main() -> None:
    args = parse_args()
    global CITY_BOUNDARY
    CITY_BOUNDARY = load_boundary(args.boundary)

    reader = shapefile.Reader(str(args.source))
    features = []
    for record in reader.iterShapeRecords():
        properties = record.record.as_dict()
        value = int(properties[args.field])
        if value not in (1, 2, 3):
            continue

        geometry = optimized_geometry(local_shape(record.shape))
        if geometry is None:
            continue

        features.append(
            {
                "type": "Feature",
                "properties": {
                    "level": value,
                    "classification": ("low", "moderate", "high")[value - 1],
                },
                "geometry": geometry,
            }
        )

    document = {
        "type": "FeatureCollection",
        "features": features,
        "metadata": {
            "hazard": args.hazard,
            "scenario": args.scenario,
            "source": "Project NOAH",
            "sourceUrl": args.source_url,
            "license": "ODC-ODbL-1.0",
            "retrievedAt": "2026-07-28",
            "transformation": (
                "Clipped to the indicative Tagbilaran City boundary, "
                "topology-preserving simplification, six-decimal precision."
            ),
        },
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(document, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"{args.output}: {len(features)} features, {args.output.stat().st_size} bytes")


if __name__ == "__main__":
    main()
