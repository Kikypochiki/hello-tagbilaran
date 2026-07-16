export interface TagbilaranBarangay {
  code: string;
  name: string;
}

export const tagbilaranBarangays: TagbilaranBarangay[] = [
  { code: "071242001", name: "Bool" },
  { code: "071242002", name: "Booy" },
  { code: "071242003", name: "Cabawan" },
  { code: "071242004", name: "Cogon" },
  { code: "071242005", name: "Dao" },
  { code: "071242006", name: "Dampas" },
  { code: "071242008", name: "Manga" },
  { code: "071242009", name: "Mansasa" },
  { code: "071242010", name: "Poblacion I" },
  { code: "071242011", name: "Poblacion II" },
  { code: "071242012", name: "Poblacion III" },
  { code: "071242013", name: "San Isidro" },
  { code: "071242014", name: "Taloto" },
  { code: "071242015", name: "Tiptip" },
  { code: "071242016", name: "Ubujan" },
];

export const tagbilaranBoundarySource = {
  title: "Indicative Tagbilaran administrative boundaries",
  publisher: "GeoRisk Philippines / Philippine Statistics Authority",
  url: "https://ulap-nga.georisk.gov.ph/arcgis/rest/services/PSA/BarangayPopMF/MapServer/0",
  accessedAt: "2026-07-16",
  note: "Display geometry is indicative and subject to ground verification.",
};
