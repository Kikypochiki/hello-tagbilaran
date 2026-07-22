export interface TagbilaranBarangay {
  code: string;
  name: string;
  slug: string;
  summary: string;
  highlights: string[];
  officialDirectoryUrl: string;
}

export const tagbilaranBarangays: TagbilaranBarangay[] = [
  "Bool", "Booy", "Cabawan", "Cogon", "Dao", "Dampas", "Manga", "Mansasa",
  "Poblacion I", "Poblacion II", "Poblacion III", "San Isidro", "Taloto", "Tiptip", "Ubujan",
].map((name, index) => {
  const codeNumber = index < 6 ? index + 1 : index + 2;
  return {
    code: `071242${String(codeNumber).padStart(3, "0")}`,
    name,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    summary: `Open the field index for ${name} and discover source-reviewed places connected to this barangay.`,
    highlights: ["Indicative mapped boundary", "Curated place index"],
    officialDirectoryUrl: "https://tagbilaran.gov.ph/barangays/",
  };
});

export const tagbilaranAdministrativeSource = {
  title: "City of Tagbilaran — Philippine Standard Geographic Code",
  publisher: "Philippine Statistics Authority",
  url: "https://psa.gov.ph/classification/psgc/barangays/0701242000",
  accessedAt: "2026-07-19",
  note: "Canonical source for the current count, names, and PSGC codes of 15 barangays.",
};

export const tagbilaranBoundarySource = {
  title: "Indicative Tagbilaran administrative boundaries",
  publisher: "GeoRisk Philippines / Philippine Statistics Authority",
  url: "https://ulap-nga.georisk.gov.ph/arcgis/rest/services/PSA/BarangayPopMF/MapServer/0",
  accessedAt: "2026-07-16",
  note: "Display geometry is indicative and subject to ground verification.",
};
