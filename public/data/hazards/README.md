# Tagbilaran hazard layers

These display-optimized GeoJSON files are derived from Project NOAH's Bohol
provincial downloads:

- `flood-100yr.geojson` — 100-year rainfall return-period flood hazards
- `landslide-susceptibility.geojson` — merged landslide susceptibility models
- `storm-surge-ssa4.geojson` — Storm Surge Advisory 4 hazards

Source files were retrieved on 2026-07-28 from the
[BetterGov.PH Project NOAH archive](https://huggingface.co/datasets/bettergovph/project-noah-hazard-maps),
which republishes the downloadable Project NOAH products with their metadata
and source license. The map links users to
[UP NOAH Know Your Hazards](https://noah.up.edu.ph/know-your-hazards) for
official interpretation and verification.

## Transformation

The provincial source polygons were:

1. clipped to the indicative Tagbilaran City boundary used by this project;
2. simplified with topology preservation at approximately two metres; and
3. reduced to the source classification and scenario fields needed by the map.

These transformations do not create, interpolate, combine, or rescore hazard
geometry. City and barangay boundaries still require local verification.

## License

The source and these derived database files are distributed under the
[Open Data Commons Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
Any public derivative must retain attribution and the same database license.

The data is scenario-based and is not a live warning, emergency instruction,
or guarantee that a location is safe.
