export interface TagbilaranBarangay {
  code: string;
  name: string;
  slug: string;
  classification: "Urban" | "Rural";
  population2024: number;
  punongBarangay: string;
  contact: string[];
  summary: string;
  highlights: string[];
  officialDirectoryUrl: string;
  directoryReviewedAt: string;
}

const officialDirectoryUrl = "https://tagbilaran.gov.ph/barangays/";
const directoryReviewedAt = "2026-07-26";

export const tagbilaranBarangays: TagbilaranBarangay[] = [
  {
    code: "071242001",
    name: "Bool",
    slug: "bool",
    classification: "Urban",
    population2024: 7411,
    punongBarangay: "Hon. Jose Floro B. Ringca",
    contact: ["411-0103", "City trunkline 209"],
    summary:
      "Bool is Tagbilaran's southern coastal heritage district. The Sandugo monument, Friendship Park, sea-facing stays, and nearby restaurants make it one of the guide's strongest visitor clusters.",
    highlights: ["Southern coast", "Sandugo heritage cluster"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242002",
    name: "Booy",
    slug: "booy",
    classification: "Urban",
    population2024: 9471,
    punongBarangay: "Hon. Eutorgio Telmo Jr.",
    contact: ["235-4149", "City trunkline 213"],
    summary:
      "Booy occupies Tagbilaran's western coast, where residential streets meet cliffside and sea-facing properties. Kasagpan Resort is the guide's current reviewed stop in the barangay.",
    highlights: ["Western coast", "Sea-facing stays"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242003",
    name: "Cabawan",
    slug: "cabawan",
    classification: "Rural",
    population2024: 2195,
    punongBarangay: "Hon. Sergio Bangalao",
    contact: ["City trunkline 206"],
    summary:
      "Cabawan lies on Tagbilaran's northeastern inland edge. It is the city's only barangay classified as rural by the Philippine Statistics Authority.",
    highlights: ["Northeastern edge", "Only PSA-classified rural barangay"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242004",
    name: "Cogon",
    slug: "cogon",
    classification: "Urban",
    population2024: 15171,
    punongBarangay: "Hon. Geneson Balbin",
    contact: ["412-5492", "City trunkline 202"],
    summary:
      "Cogon is Tagbilaran's most populous barangay in the 2024 census. Its port-side streets, parish communities, cafés, restaurants, and hotels connect downtown with the northern city.",
    highlights: ["Most populous barangay", "Port-side urban district"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242005",
    name: "Dao",
    slug: "dao",
    classification: "Urban",
    population2024: 10799,
    punongBarangay: "Hon. Alberto Puagang",
    contact: ["412-0599", "City trunkline 201"],
    summary:
      "Dao is a major commercial and transport district north of central Tagbilaran. Island City Mall and Dao Diamond Hotel anchor the guide's current listings here.",
    highlights: ["Northern commercial corridor", "Shopping and accommodation"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242006",
    name: "Dampas",
    slug: "dampas",
    classification: "Urban",
    population2024: 9902,
    punongBarangay: "Hon. Marlou Añana",
    contact: ["501-0720", "411-4699", "City trunkline 200"],
    summary:
      "Dampas is an east-central urban district shaped by everyday commerce. The City Central Public Market, hotels, and dining stops make it useful for both residents and visitors.",
    highlights: ["Central public market", "East-central city district"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242008",
    name: "Manga",
    slug: "manga",
    classification: "Urban",
    population2024: 7662,
    punongBarangay: "Hon. Nilo Lumantas",
    contact: ["411-1961", "City trunkline 204"],
    summary:
      "Manga is a northern coastal barangay where the public market and working fish port keep the city's fishing economy visible within everyday neighborhood life.",
    highlights: ["Northern coast", "Market and fish-port activity"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242009",
    name: "Mansasa",
    slug: "mansasa",
    classification: "Urban",
    population2024: 6450,
    punongBarangay: "Hon. Arvin Visarra",
    contact: ["235-6051", "City trunkline 207"],
    summary:
      "Mansasa forms part of Tagbilaran's southern urban approach. Neighborhood cafés and the area's connection to the city's early-settlement history give it a character beyond the civic core.",
    highlights: ["Southern urban approach", "Neighborhood café stops"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242010",
    name: "Poblacion I",
    slug: "poblacion-i",
    classification: "Urban",
    population2024: 3566,
    punongBarangay: "Hon. Ma. Luz Quiobe",
    contact: ["422-8367", "City trunkline 208"],
    summary:
      "Poblacion I sits on the eastern side of the compact downtown core. Its restaurants and cafés are close enough to combine with the cathedral, plaza, and museum district.",
    highlights: ["Downtown dining", "Walkable civic-core access"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242011",
    name: "Poblacion II",
    slug: "poblacion-ii",
    classification: "Urban",
    population2024: 4483,
    punongBarangay: "Hon. June Ramon Duroy",
    contact: ["501-0680", "City trunkline 211"],
    summary:
      "Poblacion II covers port-facing downtown streets and a dense traditional retail cluster. Parish life, hotels, restaurants, and several local malls sit within a compact area.",
    highlights: ["Port-facing downtown", "Traditional retail cluster"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242012",
    name: "Poblacion III",
    slug: "poblacion-iii",
    classification: "Urban",
    population2024: 4904,
    punongBarangay: "Hon. Felix Berto Remolador",
    contact: ["422-8785", "City trunkline 212"],
    summary:
      "Poblacion III contains much of Tagbilaran's historic civic center. The National Museum, Plaza Rizal, Garcia heritage house, cathedral precinct, and nearby lodging form a walkable cultural district.",
    highlights: ["Historic civic core", "Museums and heritage landmarks"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242013",
    name: "San Isidro",
    slug: "san-isidro",
    classification: "Urban",
    population2024: 6149,
    punongBarangay: "Hon. Joseph Sagaral",
    contact: ["412-5737", "City trunkline 210"],
    summary:
      "San Isidro is an inland barangay on Tagbilaran's eastern side. The guide does not yet have a locally confirmed visitor listing here, so its directory information remains the starting point.",
    highlights: ["Eastern inland district", "Directory profile available"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242014",
    name: "Taloto",
    slug: "taloto",
    classification: "Urban",
    population2024: 6619,
    punongBarangay: "Hon. Francis Eugene Zamora",
    contact: ["235-7146", "City trunkline 205"],
    summary:
      "Taloto is a northern urban barangay with coastal and residential areas. The Immaculate Heart of Mary Parish is the guide's present anchor for understanding community life here.",
    highlights: ["Northern city district", "Parish community"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242015",
    name: "Tiptip",
    slug: "tiptip",
    classification: "Urban",
    population2024: 5774,
    punongBarangay: "Hon. Jeminador Lantape",
    contact: ["411-0815", "City trunkline 198"],
    summary:
      "Tiptip occupies part of Tagbilaran's northeastern urban edge. No source-reviewed visitor stop is assigned yet, but the official directory provides its current civic information.",
    highlights: ["Northeastern urban edge", "Directory profile available"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
  {
    code: "071242016",
    name: "Ubujan",
    slug: "ubujan",
    classification: "Urban",
    population2024: 5564,
    punongBarangay: "Hon. Mary Jane Ruiz",
    contact: ["235-6365", "City trunkline 203"],
    summary:
      "Ubujan is a northern barangay with residential and coastal community ties. It also carries local wartime history through the Battle of Ubujan recorded by the city.",
    highlights: ["Northern community district", "Battle of Ubujan history"],
    officialDirectoryUrl,
    directoryReviewedAt,
  },
];

export const tagbilaranAdministrativeSource = {
  title: "City of Tagbilaran - Philippine Standard Geographic Code",
  publisher: "Philippine Statistics Authority",
  url: "https://psa.gov.ph/classification/psgc/barangays/0701242000",
  accessedAt: "2026-07-26",
  note:
    "Canonical source for the count, names, PSGC codes, urban or rural classification, and 2024 population of Tagbilaran's 15 barangays.",
};

export const tagbilaranBarangayDirectorySource = {
  title: "Barangays",
  publisher: "City Government of Tagbilaran",
  url: officialDirectoryUrl,
  accessedAt: directoryReviewedAt,
  note:
    "Official city directory used for the current Punong Barangay and published barangay contact details.",
};

export const tagbilaranBoundarySource = {
  title: "Indicative Tagbilaran administrative boundaries",
  publisher: "GeoRisk Philippines / Philippine Statistics Authority",
  url: "https://ulap-nga.georisk.gov.ph/arcgis/rest/services/PSA/BarangayPopMF/MapServer/0",
  accessedAt: "2026-07-16",
  note: "Display geometry is indicative and subject to ground verification.",
};
