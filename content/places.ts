import type {
  ImageAsset,
  Place,
  SourceRecord,
  StreetViewReference,
} from "@/types/content";

const accessedAt = "2026-07-17";

const cityTourismSource: SourceRecord = {
  title: "Tourism listings",
  url: "https://stratcom.tagbilaran.gov.ph/tourism",
  publisher: "City Government of Tagbilaran",
  accessedAt,
  notes:
    "Official city tourism listing used for the place description and city-owned photography.",
};

const provincialTourismSource: SourceRecord = {
  title: "Tagbilaran City - top things to do",
  url: "https://tourism.bohol.gov.ph/visitbohol-tagbilaran/",
  publisher: "Bohol Provincial Tourism Office",
  accessedAt,
  notes: "Official provincial tourism page used to confirm prominent visitor places.",
};

const popularPlacesSource: SourceRecord = {
  title: "Tagbilaran City tourism overview",
  url: "https://www.tripadvisor.com/Tourism-g1066348-Tagbilaran_City_Bohol_Island_Bohol_Province_Visayas-Vacations.html",
  publisher: "Tripadvisor",
  accessedAt,
  notes:
    "Used only as a current popularity signal for attractions, restaurants, hotels, and shopping. Ratings, prices, and hours are intentionally not republished.",
};

function localImage(
  filename: string,
  alt: string,
  width: number,
  height: number,
  credit: string,
  rights: string,
  metadata: Pick<ImageAsset, "date" | "sourceUrl" | "licenseUrl"> = {},
): ImageAsset {
  return {
    src: `/images/places/${filename}`,
    alt,
    width,
    height,
    credit,
    rights,
    ...metadata,
  };
}

function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleMapsSource(name: string, query: string): SourceRecord {
  return {
    title: `${name} on Google Maps`,
    url: googleMapsUrl(query),
    publisher: "Google Maps",
    accessedAt,
    notes:
      "Direct visitor map link. The displayed point is also cross-checked against the cited OpenStreetMap record.",
  };
}

function googleMapsPlaceSource(name: string, query: string): SourceRecord {
  return {
    title: `${name} place record and photo`,
    url: googleMapsUrl(query),
    publisher: "Google Maps",
    accessedAt,
    notes:
      "Used to match the supplied name and coordinates to the corresponding place record and displayed photo. Photo reuse and Google attribution requirements must be confirmed before publication.",
  };
}

function osmSource(
  title: string,
  type: "node" | "way" | "relation",
  id: number,
): SourceRecord {
  return {
    title,
    url: `https://www.openstreetmap.org/${type}/${id}`,
    publisher: "OpenStreetMap contributors",
    accessedAt,
    notes: "Used to cross-check the map point; confirm locally before publication.",
  };
}

const practicalDetailsNote = {
  verificationNotes:
    "Current accessibility and on-site conditions have not been independently verified. Confirm directly before visiting.",
};

const suppliedPlaceRegisterSource: SourceRecord = {
  title: "Tagbilaran place register and coordinates",
  publisher: "Hello Tagbilaran project stakeholder",
  accessedAt,
  notes:
    "Place name, editorial category, and coordinates were supplied directly for this listing milestone.",
};

const barangayBoundarySource: SourceRecord = {
  title: "Indicative Tagbilaran barangay boundaries",
  url: "https://ulap-nga.georisk.gov.ph/arcgis/rest/services/PSA/BarangayPopMF/MapServer/0",
  publisher: "GeoRisk Philippines / Philippine Statistics Authority",
  accessedAt,
  notes:
    "Used to identify the barangay containing each supplied map point. Boundary geometry is indicative, not a legal boundary survey.",
};

interface SuppliedPlaceInput {
  slug: string;
  name: string;
  category: Place["category"];
  summary: string;
  latitude: number;
  longitude: number;
  image: {
    filename: string;
    alt: string;
    width: number;
    height: number;
    credit?: string;
    rights?: string;
    date?: string;
    sourceUrl?: string;
    licenseUrl?: string;
  };
  additionalSources?: SourceRecord[];
}

const googlePhotoRights =
  "Google Maps community image used as a place reference; confirm contributor permission and Google attribution requirements before publication.";

function reviewDueAt(category: Place["category"]) {
  return category === "food-drink" ||
    category === "accommodation" ||
    category === "shopping-market"
    ? "2026-10-15"
    : "2027-07-17";
}

function mediaRightsStatus(images: ImageAsset[]): Place["verification"]["mediaRights"] {
  if (!images.length) return "not-applicable";
  return images.some((image) =>
    /confirm|obtain|permission|required|before publication/i.test(image.rights ?? ""),
  )
    ? "needs-permission"
    : "cleared";
}

function sourceReviewedVerification(
  category: Place["category"],
  images: ImageAsset[],
  hasCoordinates: boolean,
  fallbackMediaRights: Place["verification"]["mediaRights"] = "needs-permission",
): Place["verification"] {
  return {
    identity: "source-reviewed",
    location: hasCoordinates ? "source-reviewed" : "unverified",
    operatingStatus: "needs-confirmation",
    mediaRights: images.length ? mediaRightsStatus(images) : fallbackMediaRights,
    reviewedAt: accessedAt,
    reviewDueAt: reviewDueAt(category),
  };
}

function suppliedPlace(input: SuppliedPlaceInput): Place {
  const mapQuery = `${input.name}, ${input.latitude}, ${input.longitude}`;

  return {
    id: input.slug,
    slug: input.slug,
    name: input.name,
    category: input.category,
    scope: "tagbilaran",
    summary: input.summary,
    coordinates: {
      longitude: input.longitude,
      latitude: input.latitude,
    },
    directionsUrl: googleMapsUrl(mapQuery),
    features: [
      "Included in the supplied Tagbilaran place register",
      "Map point uses the stakeholder-supplied coordinates",
    ],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        input.image.filename,
        input.image.alt,
        input.image.width,
        input.image.height,
        input.image.credit ?? "Google Maps community contributor",
        input.image.rights ?? googlePhotoRights,
        {
          date: input.image.date,
          sourceUrl: input.image.sourceUrl,
          licenseUrl: input.image.licenseUrl,
        },
      ),
    ],
    sources: [
      suppliedPlaceRegisterSource,
      googleMapsPlaceSource(input.name, mapQuery),
      barangayBoundarySource,
      ...(input.additionalSources ?? []),
    ],
    verifiedAt: accessedAt,
    verification: sourceReviewedVerification(
      input.category,
      [
        localImage(
          input.image.filename,
          input.image.alt,
          input.image.width,
          input.image.height,
          input.image.credit ?? "Google Maps community contributor",
          input.image.rights ?? googlePhotoRights,
          {
            date: input.image.date,
            sourceUrl: input.image.sourceUrl,
            licenseUrl: input.image.licenseUrl,
          },
        ),
      ],
      true,
    ),
  };
}

const suppliedPlaceEntries: Place[] = [
  suppliedPlace({
    slug: "carlos-p-garcia-heritage-museum",
    name: "Carlos P. Garcia Heritage Museum",
    category: "history-culture",
    summary:
      "A heritage museum in central Tagbilaran associated with Boholano president Carlos P. Garcia.",
    latitude: 9.64143,
    longitude: 123.858087,
    image: {
      filename: "carlos-p-garcia-heritage-museum.jpg",
      alt: "Grounds and heritage house at the Carlos P. Garcia Heritage Museum",
      width: 2200,
      height: 1650,
      credit: "Patrickroque01 / Wikimedia Commons",
      rights: "Creative Commons Attribution-ShareAlike 4.0 International.",
      date: "2023-01-12",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Carlos_P._Garcia_House_(F._Rocha,_Tagbilaran,_Bohol;_01-12-2023).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  }),
  suppliedPlace({
    slug: "our-lady-of-lourdes-parish",
    name: "Our Lady of Lourdes Parish Church",
    category: "faith-architecture",
    summary:
      "A Catholic parish church serving worshippers in central Tagbilaran City.",
    latitude: 9.645776,
    longitude: 123.852681,
    image: {
      filename: "our-lady-of-lourdes-parish.jpg",
      alt: "Street-facing exterior of Our Lady of Lourdes Parish Church",
      width: 2200,
      height: 1650,
      credit: "Deepak-nsk / Wikimedia Commons",
      rights: "Dedicated to the public domain under Creative Commons CC0 1.0.",
      date: "2024-09-19",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Our_Lady_of_Lourdes_Parish_Church,_Tagbilaran.jpg",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  }),
  suppliedPlace({
    slug: "birhen-sa-barangay-parish",
    name: "Birhen sa Barangay Parish",
    category: "faith-architecture",
    summary:
      "A distinctive Catholic parish church in Tagbilaran City’s northern urban area.",
    latitude: 9.655553,
    longitude: 123.854874,
    image: {
      filename: "birhen-sa-barangay-parish.jpg",
      alt: "Radial ceiling and rows of pews inside Birhen sa Barangay Parish",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "immaculate-heart-of-mary-parish",
    name: "Immaculate Heart of Mary Parish",
    category: "faith-architecture",
    summary:
      "A Catholic parish church serving communities in northern Tagbilaran City.",
    latitude: 9.675067,
    longitude: 123.853698,
    image: {
      filename: "immaculate-heart-of-mary-parish.jpg",
      alt: "Bright nave and altar inside Immaculate Heart of Mary Parish",
      width: 1200,
      height: 816,
    },
  }),
  suppliedPlace({
    slug: "al-fresco-bay-cafe-restobar",
    name: "Al Fresco Bay Cafe & Restobar",
    category: "food-drink",
    summary:
      "A cafe and restobar listing near Tagbilaran’s central waterfront area.",
    latitude: 9.644914,
    longitude: 123.853825,
    image: {
      filename: "al-fresco-bay-cafe-restobar.jpg",
      alt: "Nighttime exterior of Al Fresco Bay Cafe and Restobar",
      width: 1200,
      height: 568,
    },
  }),
  suppliedPlace({
    slug: "red-house-city-taiwan-shabu-shabu",
    name: "Red House City Taiwan Shabu Shabu",
    category: "food-drink",
    summary:
      "A Taiwanese-style shabu-shabu restaurant in Tagbilaran City.",
    latitude: 9.653992,
    longitude: 123.872363,
    image: {
      filename: "red-house-city-taiwan-shabu-shabu.jpg",
      alt: "Entrance of Red House City Taiwan Shabu Shabu",
      width: 1200,
      height: 860,
    },
  }),
  suppliedPlace({
    slug: "just-sizzlin-resto",
    name: "Just Sizzlin’ Resto",
    category: "food-drink",
    summary:
      "A casual restaurant in central Tagbilaran included in the project’s dining register.",
    latitude: 9.63821,
    longitude: 123.860019,
    image: {
      filename: "just-sizzlin-resto.jpg",
      alt: "Diners gathered around a table at Just Sizzlin’ Resto",
      width: 1170,
      height: 986,
    },
  }),
  suppliedPlace({
    slug: "smoque-bistro",
    name: "SMOQUE Bistro",
    category: "food-drink",
    summary:
      "A bistro and dining destination in the Bool area of Tagbilaran City.",
    latitude: 9.630978,
    longitude: 123.877166,
    image: {
      filename: "smoque-bistro.jpg",
      alt: "Dining room and open kitchen at SMOQUE Bistro",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "garden-cafe",
    name: "Garden Café",
    category: "food-drink",
    summary:
      "A cafe close to Plaza Rizal and St. Joseph the Worker Cathedral in central Tagbilaran.",
    latitude: 9.639684,
    longitude: 123.855534,
    image: {
      filename: "garden-cafe.jpg",
      alt: "Illuminated street entrance of Garden Café",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "punjabi-rasoi",
    name: "Punjabi Rasoi",
    category: "food-drink",
    summary:
      "An Indian restaurant in Tagbilaran City included in the project’s dining register.",
    latitude: 9.656301,
    longitude: 123.852927,
    image: {
      filename: "punjabi-rasoi.jpg",
      alt: "Dining room inside Punjabi Rasoi",
      width: 1200,
      height: 675,
    },
  }),
  suppliedPlace({
    slug: "crave-cafe-bohol",
    name: "Crave Cafe Bohol",
    category: "food-drink",
    summary:
      "A city cafe listed among Tagbilaran’s contemporary food and drink stops.",
    latitude: 9.650604,
    longitude: 123.852991,
    image: {
      filename: "crave-cafe-bohol.jpg",
      alt: "Illuminated Crave Cafe Bohol sign",
      width: 1200,
      height: 1500,
    },
  }),
  suppliedPlace({
    slug: "bark-coffee",
    name: "Bark Coffee",
    category: "food-drink",
    summary:
      "A coffee shop in Tagbilaran City included in the project’s cafe register.",
    latitude: 9.631656,
    longitude: 123.869384,
    image: {
      filename: "bark-coffee.jpg",
      alt: "Roadside sign and facade of Bark Coffee",
      width: 1200,
      height: 1600,
    },
  }),
  suppliedPlace({
    slug: "tamper-coffee-brunch",
    name: "Tamper Coffee & Brunch",
    category: "food-drink",
    summary:
      "A coffee and brunch destination in central Tagbilaran City.",
    latitude: 9.638198,
    longitude: 123.860145,
    image: {
      filename: "tamper-coffee-brunch.jpg",
      alt: "Bright dining room inside Tamper Coffee and Brunch",
      width: 1200,
      height: 800,
    },
  }),
  suppliedPlace({
    slug: "mosia-cafe",
    name: "Mosia Cafe",
    category: "food-drink",
    summary:
      "A cafe in Tagbilaran City included in the project’s food and drink register.",
    latitude: 9.633763,
    longitude: 123.865996,
    image: {
      filename: "mosia-cafe.jpg",
      alt: "Light-filled interior and seating at Mosia Cafe",
      width: 1200,
      height: 1600,
    },
  }),
  suppliedPlace({
    slug: "ocean-suites",
    name: "Ocean Suites",
    category: "accommodation",
    summary:
      "A hotel beside the Blood Compact area in Bool, overlooking the water east of central Tagbilaran.",
    latitude: 9.627505,
    longitude: 123.879278,
    image: {
      filename: "ocean-suites.jpg",
      alt: "Lobby and staircase inside Ocean Suites",
      width: 1200,
      height: 1600,
    },
  }),
  suppliedPlace({
    slug: "belian-hotel",
    name: "Belian Hotel",
    category: "accommodation",
    summary:
      "A city hotel on Graham Avenue near Tagbilaran’s port and central commercial area.",
    latitude: 9.649326,
    longitude: 123.850899,
    image: {
      filename: "belian-hotel.jpg",
      alt: "Evening exterior of Belian Hotel",
      width: 1200,
      height: 1112,
    },
  }),
  suppliedPlace({
    slug: "kasagpan-resort",
    name: "Kasagpan Resort",
    category: "accommodation",
    summary:
      "A cliffside resort in Booy with sea views and waterfront-facing grounds.",
    latitude: 9.663314,
    longitude: 123.844574,
    image: {
      filename: "kasagpan-resort.jpg",
      alt: "Pool and sea view at Kasagpan Resort",
      width: 2500,
      height: 1669,
      credit: "Kasagpan Resort",
      rights:
        "Business-owned image; obtain publication permission before launch.",
    },
    additionalSources: [
      {
        title: "Kasagpan Resort",
        url: "https://www.kasagpanresort.ph/",
        publisher: "Kasagpan Resort",
        accessedAt,
        notes: "Official property site used for the displayed photograph.",
      },
    ],
  }),
  suppliedPlace({
    slug: "bohol-ecotel",
    name: "Bohol Ecotel",
    category: "accommodation",
    summary:
      "A lodging property in central Tagbilaran City.",
    latitude: 9.639417,
    longitude: 123.860948,
    image: {
      filename: "bohol-ecotel.jpg",
      alt: "Street exterior of Bohol Ecotel",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "travelbee-seaside-inn",
    name: "Travelbee Seaside Inn",
    category: "accommodation",
    summary:
      "A city inn close to Tagbilaran’s port and central waterfront streets.",
    latitude: 9.647608,
    longitude: 123.851266,
    image: {
      filename: "travelbee-seaside-inn.webp",
      alt: "Bright guest room inside Travelbee Seaside Inn",
      width: 1080,
      height: 700,
      credit: "Travelbee Seaside Inn hotel listing",
      rights:
        "Third-party property image; confirm reuse permission before publication.",
    },
    additionalSources: [
      {
        title: "Travelbee Seaside Inn property page",
        url: "https://travelbee-seaside-inn.allvisayashotels.com/en/",
        publisher: "All Visayas Hotels",
        accessedAt,
        notes: "Property-specific hotel page used for the displayed photograph.",
      },
    ],
  }),
  suppliedPlace({
    slug: "dao-diamond-hotel-restaurant",
    name: "Dao Diamond Hotel and Restaurant",
    category: "accommodation",
    summary:
      "A hotel and restaurant property in Tagbilaran’s Dao district.",
    latitude: 9.664172,
    longitude: 123.867781,
    image: {
      filename: "dao-diamond-hotel-restaurant.jpg",
      alt: "Aerial view of Dao Diamond Hotel and Restaurant",
      width: 1200,
      height: 675,
    },
  }),
  suppliedPlace({
    slug: "alturas-mall-tagbilaran",
    name: "Alturas Mall Tagbilaran",
    category: "shopping-market",
    summary:
      "A longstanding downtown shopping destination on Tagbilaran’s central commercial streets.",
    latitude: 9.643363,
    longitude: 123.856293,
    image: {
      filename: "alturas-mall-tagbilaran.jpg",
      alt: "Street facade of Alturas Mall Tagbilaran",
      width: 1200,
      height: 675,
    },
  }),
  suppliedPlace({
    slug: "galleria-luisa-mall",
    name: "Galleria Luisa Mall",
    category: "shopping-market",
    summary:
      "A central Tagbilaran mall included in the project’s shopping register.",
    latitude: 9.642251,
    longitude: 123.853888,
    image: {
      filename: "galleria-luisa-mall.jpg",
      alt: "Retail area inside Galleria Luisa Mall",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "tagbilaran-city-square",
    name: "Tagbilaran City Square",
    category: "shopping-market",
    summary:
      "A downtown shopping center close to BQ Mall and the city’s central commercial corridor.",
    latitude: 9.642301,
    longitude: 123.85605,
    image: {
      filename: "tagbilaran-city-square.jpg",
      alt: "Street frontage of Tagbilaran City Square",
      width: 1200,
      height: 675,
    },
  }),
  suppliedPlace({
    slug: "tagbilaran-city-central-public-market",
    name: "Tagbilaran City Central Public Market",
    category: "shopping-market",
    summary:
      "A central public market serving everyday shopping and local commerce in Tagbilaran City.",
    latitude: 9.655592,
    longitude: 123.871593,
    image: {
      filename: "tagbilaran-city-central-public-market.jpg",
      alt: "Packaged goods displayed at Tagbilaran City Central Public Market",
      width: 1200,
      height: 1600,
    },
  }),
  suppliedPlace({
    slug: "barangay-manga-public-market",
    name: "Barangay Manga Public Market",
    category: "shopping-market",
    summary:
      "A neighborhood public market serving Barangay Manga in northern Tagbilaran.",
    latitude: 9.693332,
    longitude: 123.863564,
    image: {
      filename: "barangay-manga-public-market.jpg",
      alt: "Evening activity outside Barangay Manga Public Market",
      width: 1200,
      height: 1200,
    },
  }),
  suppliedPlace({
    slug: "tagbilaran-city-friendship-park",
    name: "Tagbilaran City Friendship Park",
    category: "outdoors",
    summary:
      "A public park beside the Blood Compact area in Bool.",
    latitude: 9.627279,
    longitude: 123.878509,
    image: {
      filename: "tagbilaran-city-friendship-park.jpg",
      alt: "Blood Compact monument and landscaped grounds at Friendship Park",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "banat-i-hill",
    name: "Banat-i Hill",
    category: "outdoors",
    summary:
      "A hill and viewpoint area in southern Tagbilaran City.",
    latitude: 9.635795,
    longitude: 123.879611,
    image: {
      filename: "banat-i-hill.jpg",
      alt: "Coastal and city view from Banat-i Hill",
      width: 1200,
      height: 900,
    },
  }),
  suppliedPlace({
    slug: "manga-fish-port",
    name: "Manga Fish Port",
    category: "outdoors",
    summary:
      "A working coastal fish port in Barangay Manga, northern Tagbilaran.",
    latitude: 9.699722,
    longitude: 123.855502,
    image: {
      filename: "manga-fish-port.jpg",
      alt: "Sunset over the water at Manga Fish Port",
      width: 1200,
      height: 900,
    },
  }),
];

const placeEntries: Place[] = [
  {
    id: "blood-compact-shrine",
    slug: "blood-compact-shrine",
    name: "Blood Compact Monument (Sandugo Shrine)",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "A seaside monument in Bool commemorating the 1565 Sandugo between Datu Sikatuna and Miguel López de Legazpi.",
    coordinates: { longitude: 123.878766, latitude: 9.627316 },
    address: "Venancio P. Inting Avenue, Bool, Tagbilaran City, Bohol 6301",
    barangay: "Bool",
    directionsUrl: googleMapsUrl(
      "Blood Compact Monument, Bool, Tagbilaran City, Bohol",
    ),
    features: ["Major city heritage landmark", "Seaside monument"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "blood-compact-shrine.jpg",
        "The bronze Blood Compact Monument overlooking the sea in Bool",
        1170,
        757,
        "City Government of Tagbilaran",
        "Public-domain government content unless otherwise stated; verify the individual image notice before publication.",
      ),
    ],
    sources: [
      cityTourismSource,
      provincialTourismSource,
      popularPlacesSource,
      googleMapsSource(
        "Blood Compact Monument",
        "Blood Compact Monument, Bool, Tagbilaran City, Bohol",
      ),
      osmSource("Blood Compact Site map feature", "node", 1509857534),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification("history-culture", [], true),
  },
  {
    id: "national-museum-bohol",
    slug: "national-museum-bohol",
    name: "National Museum of the Philippines - Bohol",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "A regional museum in the restored former Provincial Capitol, presenting Bohol’s archaeology, natural history, and cultural heritage.",
    coordinates: { longitude: 123.856485, latitude: 9.640203 },
    address:
      "Km. 0, Carlos P. Garcia Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    directionsUrl: googleMapsUrl(
      "National Museum of the Philippines Bohol, Tagbilaran City",
    ),
    features: ["Major city museum", "Former Provincial Capitol"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "national-museum-bohol.jpg",
        "Pagpauli exhibition and Carlos P. Garcia sculpture inside the National Museum of the Philippines - Bohol",
        1600,
        2133,
        "Nirmaljoshi / Wikimedia Commons",
        "Creative Commons Attribution-ShareAlike 4.0 International.",
        {
          date: "2025-04-26",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:National_Museum_Bohol.jpg",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
      ),
    ],
    sources: [
      cityTourismSource,
      provincialTourismSource,
      popularPlacesSource,
      {
        title: "National Museum Bohol",
        url: "https://www.nationalmuseum.gov.ph/our-museums/regional-area-and-site-museums/bohol/",
        publisher: "National Museum of the Philippines",
        accessedAt,
        notes: "Official museum page used to confirm the building and address.",
      },
      googleMapsSource(
        "National Museum of the Philippines - Bohol",
        "National Museum of the Philippines Bohol, Tagbilaran City",
      ),
      osmSource(
        "National Museum of the Philippines - Bohol map feature",
        "way",
        242261499,
      ),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification(
      "history-culture",
      [],
      true,
      "cleared",
    ),
  },
  {
    id: "st-joseph-cathedral",
    slug: "st-joseph-cathedral",
    name: "St. Joseph the Worker Cathedral",
    category: "faith-architecture",
    scope: "tagbilaran",
    summary:
      "Tagbilaran’s principal Catholic cathedral and a central heritage landmark beside Plaza Rizal.",
    coordinates: { longitude: 123.85588, latitude: 9.639507 },
    address: "Carlos P. Garcia Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    directionsUrl: googleMapsUrl(
      "St Joseph the Worker Cathedral Shrine, Tagbilaran City, Bohol",
    ),
    features: ["Major faith landmark", "Beside Plaza Rizal"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "st-joseph-cathedral.jpg",
        "Street-facing facade and historic bell tower of St. Joseph the Worker Cathedral",
        2200,
        1650,
        "Patrickroque01 / Wikimedia Commons",
        "Creative Commons Attribution-ShareAlike 4.0 International.",
        {
          date: "2023-01-09",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Saint_Joseph_Cathedral_Tagbilaran_(JA_Clarin,_Tagbilaran,_Bohol;_01-09-2023).jpg",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
      ),
    ],
    sources: [
      cityTourismSource,
      provincialTourismSource,
      popularPlacesSource,
      googleMapsSource(
        "St. Joseph the Worker Cathedral",
        "St Joseph the Worker Cathedral Shrine, Tagbilaran City, Bohol",
      ),
      {
        title: "Tagbilaran Cathedral map record",
        url: "https://www.wikidata.org/wiki/Q31440684",
        publisher: "Wikidata contributors",
        accessedAt,
        notes: "Used to cross-check the map point; confirm locally.",
      },
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification(
      "faith-architecture",
      [],
      true,
      "cleared",
    ),
  },
  {
    id: "plaza-rizal",
    slug: "plaza-rizal",
    name: "Plaza Jose P. Rizal",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "The city’s central public plaza, framed by the cathedral, museum, and historic civic core.",
    coordinates: { longitude: 123.856197, latitude: 9.639878 },
    address: "Carlos P. Garcia Avenue, Poblacion 3, Tagbilaran City, Bohol",
    barangay: "Poblacion 3",
    directionsUrl: googleMapsUrl("Plaza Rizal, Tagbilaran City, Bohol"),
    features: ["Central city plaza", "Walkable heritage area"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "plaza-rizal.jpg",
        "Plaza Jose P. Rizal and its monument facing St. Joseph Cathedral",
        2200,
        1650,
        "Patrickroque01 / Wikimedia Commons",
        "Creative Commons Attribution-ShareAlike 4.0 International.",
        {
          date: "2023-01-09",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Tagbilaran_Plaza_Rizal,_Cathedral_(CPG_Avenue,_Tagbilaran,_Bohol;_01-09-2023).jpg",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
      ),
    ],
    sources: [
      cityTourismSource,
      provincialTourismSource,
      googleMapsSource(
        "Plaza Jose P. Rizal",
        "Plaza Rizal, Tagbilaran City, Bohol",
      ),
      osmSource("Plaza Rizal map feature", "relation", 17480946),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification(
      "history-culture",
      [],
      true,
      "cleared",
    ),
  },
  {
    id: "cpg-park",
    slug: "cpg-park",
    name: "President Carlos P. Garcia Park",
    category: "outdoors",
    scope: "tagbilaran",
    summary:
      "A waterfront public park used for relaxed walks, jogging, and sunset views along Tagbilaran’s coast.",
    coordinates: { longitude: 123.858287, latitude: 9.659834 },
    address: "Lino Chatto Drive, Tagbilaran City, Bohol",
    directionsUrl: googleMapsUrl(
      "President Carlos P Garcia Park, Tagbilaran City, Bohol",
    ),
    features: ["Waterfront public space", "Popular local walking area"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "cpg-park.jpg",
        "Waterfront view at President Carlos P. Garcia Park",
        960,
        720,
        "City Government of Tagbilaran",
        "Public-domain government content unless otherwise stated; verify the individual image notice before publication.",
      ),
    ],
    sources: [
      cityTourismSource,
      googleMapsSource(
        "President Carlos P. Garcia Park",
        "President Carlos P Garcia Park, Tagbilaran City, Bohol",
      ),
      osmSource("President Carlos P. Garcia Park map feature", "relation", 15320972),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification("outdoors", [], true),
  },
  {
    id: "chido-cafe",
    slug: "chido-cafe",
    name: "Chido Cafe",
    category: "food-drink",
    scope: "tagbilaran",
    summary:
      "A popular cafe in Bool with a sea-facing dining space and a menu that draws from local and international flavors.",
    coordinates: { longitude: 123.8779861, latitude: 9.6278559 },
    address:
      "KN Plaza, 0676 Venancio P. Inting Avenue, Bool, Tagbilaran City, Bohol 6300",
    barangay: "Bool",
    directionsUrl: googleMapsUrl("Chido Cafe, Bool, Tagbilaran City, Bohol"),
    features: ["Current traveler-popularity pick", "Sea-facing dining space"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "chido-cafe.jpg",
        "Chido Cafe dining room and terrace overlooking the water",
        900,
        900,
        "Chido Cafe official Linktree / linked Google Business profile",
        "Business-owned or user-contributed image; obtain publication permission before launch.",
      ),
    ],
    sources: [
      popularPlacesSource,
      {
        title: "Chido Cafe official links",
        url: "https://linktr.ee/Chidocafe_bohol",
        publisher: "Chido Cafe",
        accessedAt,
        notes: "Business-managed page used to confirm the current identity and location link.",
      },
      googleMapsSource(
        "Chido Cafe",
        "Chido Cafe, Bool, Tagbilaran City, Bohol",
      ),
      osmSource("Chido Cafe map feature", "node", 11036534048),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification("food-drink", [], true),
  },
  {
    id: "gerardas-family-restaurant",
    slug: "gerardas-family-restaurant",
    name: "Gerarda’s Place",
    category: "food-drink",
    scope: "tagbilaran",
    summary:
      "A longstanding family restaurant known for Filipino cooking served in a warm, home-like setting.",
    coordinates: { longitude: 123.858186, latitude: 9.643074 },
    address: "30 J. S. Torralba Street, Tagbilaran City, Bohol 6300",
    directionsUrl: googleMapsUrl(
      "Gerarda's Place, 30 J S Torralba Street, Tagbilaran City",
    ),
    features: [
      "Current traveler-popularity pick",
      "Main-place pin supplied for the project register",
    ],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "gerardas-family-restaurant.jpg",
        "The warmly lit exterior of Gerarda’s Family Restaurant",
        1200,
        900,
        "Gerarda’s Place",
        "Business-owned image; obtain publication permission before launch.",
      ),
    ],
    sources: [
      suppliedPlaceRegisterSource,
      popularPlacesSource,
      {
        title: "Gerarda’s Place",
        url: "https://gerardasplace.shop/",
        publisher: "Gerarda’s Place",
        accessedAt,
        notes:
          "Business website used for the restaurant overview and image. Branch-specific practical details still require direct confirmation.",
      },
      googleMapsSource(
        "Gerarda’s Place",
        "Gerarda's Place, 30 J S Torralba Street, Tagbilaran City",
      ),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification("food-drink", [], true),
  },
  {
    id: "kew-hotel",
    slug: "kew-hotel",
    name: "Kew Hotel Tagbilaran",
    category: "accommodation",
    scope: "tagbilaran",
    summary:
      "A popular city hotel on J. A. Clarin Street with rooms, dining, and event spaces near key Tagbilaran destinations.",
    coordinates: { longitude: 123.867058, latitude: 9.654346 },
    address:
      "0554 J. A. Clarin Street, Dampas District, Tagbilaran City, Bohol 6300",
    barangay: "Dampas",
    directionsUrl: googleMapsUrl(
      "Kew Hotel Tagbilaran, J A Clarin Street, Tagbilaran City, Bohol",
    ),
    features: ["Current popular-hotel pick", "Active official hotel site"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "kew-hotel.jpg",
        "Warmly illuminated lobby at Kew Hotel Tagbilaran",
        2400,
        1600,
        "Kew Hotel Tagbilaran",
        "Business-owned image; obtain publication permission before launch.",
      ),
    ],
    sources: [
      popularPlacesSource,
      {
        title: "Kew Hotel Tagbilaran",
        url: "https://kewhotel.com.ph/tagbilaran/",
        publisher: "Kew Hotel",
        accessedAt,
        notes: "Official hotel site used to confirm the property and address.",
      },
      googleMapsSource(
        "Kew Hotel Tagbilaran",
        "Kew Hotel Tagbilaran, J A Clarin Street, Tagbilaran City, Bohol",
      ),
      osmSource("Kew Hotel map feature", "way", 702415996),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification("accommodation", [], true),
  },
  {
    id: "island-city-mall",
    slug: "island-city-mall",
    name: "Island City Mall",
    category: "shopping-market",
    scope: "tagbilaran",
    summary:
      "A major Tagbilaran shopping, dining, cinema, and community-events destination in the Dao district.",
    coordinates: { longitude: 123.869636, latitude: 9.655303 },
    address:
      "Rajah Sikatuna Avenue, Dao District, Tagbilaran City, Bohol 6300",
    barangay: "Dao",
    directionsUrl: googleMapsUrl(
      "Island City Mall, Dao, Tagbilaran City, Bohol",
    ),
    features: ["Major city shopping destination", "Local retail flagship"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "island-city-mall.jpg",
        "Upper-level view through the contemporary interior of Island City Mall",
        2200,
        1650,
        "OxyLight / Wikimedia Commons",
        "Dedicated to the public domain under Creative Commons CC0 1.0.",
        {
          date: "2026-06-25",
          sourceUrl:
            "https://commons.wikimedia.org/wiki/File:Island_city_mall_tagbilaran.jpg",
          licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        },
      ),
    ],
    sources: [
      popularPlacesSource,
      {
        title: "Island City Mall",
        url: "https://icmbohol.com/",
        publisher: "Island City Mall",
        accessedAt,
        notes: "Official mall site used to confirm its role and address.",
      },
      {
        title: "Where to shop",
        url: "https://tourism.bohol.gov.ph/where-to-shop/",
        publisher: "Bohol Provincial Tourism Office",
        accessedAt,
        notes: "Official provincial tourism listing used for the mall image.",
      },
      googleMapsSource(
        "Island City Mall",
        "Island City Mall, Dao, Tagbilaran City, Bohol",
      ),
      osmSource("Island City Mall map feature", "way", 242260527),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification(
      "shopping-market",
      [],
      true,
      "cleared",
    ),
  },
  {
    id: "bq-mall",
    slug: "bq-mall",
    name: "Bohol Quality Mall (BQ Mall)",
    category: "shopping-market",
    scope: "tagbilaran",
    summary:
      "A popular locally rooted mall in Tagbilaran’s downtown core, close to Plaza Rizal and the city’s main commercial streets.",
    coordinates: { longitude: 123.855207, latitude: 9.641588 },
    address:
      "Carlos P. Garcia North Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    directionsUrl: googleMapsUrl(
      "Bohol Quality Mall, CPG Avenue, Tagbilaran City, Bohol",
    ),
    features: ["Popular downtown shopping destination", "Locally rooted mall"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "bq-mall.jpg",
        "Bohol Quality Mall and downtown traffic along Carlos P. Garcia Avenue",
        2200,
        2019,
        "2hydh / Wikimedia Commons",
        "Creative Commons Attribution-ShareAlike 4.0 International.",
        {
          date: "2023-06-15",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:BQ_MALL.jpg",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
        },
      ),
    ],
    sources: [
      popularPlacesSource,
      {
        title: "Where to shop",
        url: "https://tourism.bohol.gov.ph/where-to-shop/",
        publisher: "Bohol Provincial Tourism Office",
        accessedAt,
        notes: "Official provincial tourism listing used for the description and image.",
      },
      googleMapsSource(
        "Bohol Quality Mall",
        "Bohol Quality Mall, CPG Avenue, Tagbilaran City, Bohol",
      ),
      osmSource("BQ Mall map feature", "node", 1587020943),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verification: sourceReviewedVerification(
      "shopping-market",
      [],
      true,
      "cleared",
    ),
  },
  ...suppliedPlaceEntries,
];

type PlaceEnhancement = Pick<Place, "story" | "features"> &
  Partial<Pick<Place, "barangay" | "localTip">>;

function guideDetails(
  story: string,
  features: string[],
  barangay?: string,
  localTip?: string,
): PlaceEnhancement {
  return { story, features, barangay, localTip };
}

const placeEnhancements: Record<string, PlaceEnhancement> = {
  "blood-compact-shrine": guideDetails(
    "Napoleon Abueva’s bronze tableau stands above the coast at Bool, marking the city’s best-known memorial to the 1565 Sandugo. The monument is both a major visitor landmark and a prompt to read the encounter within the wider history of Spanish colonization.",
    ["Sandugo memorial", "Waterfront heritage stop"],
    undefined,
    "Friendship Park, Ocean Suites, and the Bool dining cluster are close enough to combine in one area visit.",
  ),
  "national-museum-bohol": guideDetails(
    "The Bohol Area Museum occupies the restored former Provincial Capitol. Built from 1855 to 1860, the structure served civic and military functions, survived major earthquake damage in 2013, and reopened as a National Museum site in 2018.",
    ["Former Provincial Capitol", "Bohol art, history, and natural-history galleries"],
    undefined,
    "Plaza Rizal and the cathedral sit beside the museum in the compact civic core.",
  ),
  "carlos-p-garcia-heritage-museum": guideDetails(
    "This heritage house and museum keeps the memory of Carlos P. Garcia, Boholano statesman and the Philippines’ eighth president, within Tagbilaran’s central heritage district.",
    ["Presidential heritage museum", "Central heritage district"],
    "Poblacion III",
    "Include it in a downtown heritage walk with the National Museum, Plaza Rizal, and the cathedral.",
  ),
  "plaza-rizal": guideDetails(
    "Plaza Jose P. Rizal is the green center of Tagbilaran’s historic civic ensemble. Its paths and monument connect the cathedral, National Museum, city hall area, and nearby downtown streets.",
    ["Central public plaza", "Walkable civic and heritage core"],
    undefined,
    "Use the plaza as the starting point for the downtown heritage cluster.",
  ),
  "st-joseph-cathedral": guideDetails(
    "The Cathedral Shrine of St. Joseph the Worker is the principal Catholic seat in Bohol. Its stone facade, bell tower, and position beside Plaza Rizal make it one of Tagbilaran’s defining pieces of faith architecture.",
    ["Cathedral and diocesan seat", "Part of the Plaza Rizal civic ensemble"],
    undefined,
    "Dress and move respectfully when liturgies or parish activities are underway.",
  ),
  "our-lady-of-lourdes-parish": guideDetails(
    "Our Lady of Lourdes Parish is a neighborhood Catholic church just north of the central civic core, serving worshippers around Poblacion II and nearby downtown streets.",
    ["Catholic parish church", "Downtown neighborhood landmark"],
    "Poblacion II",
  ),
  "birhen-sa-barangay-parish": guideDetails(
    "Birhen sa Barangay Parish is recognizable for its broad worship space and radial interior ceiling. It serves the Cogon area within Tagbilaran’s northern urban center.",
    ["Catholic parish church", "Distinctive radial interior"],
    "Cogon",
  ),
  "immaculate-heart-of-mary-parish": guideDetails(
    "The Immaculate Heart of Mary Parish is a Catholic parish in Taloto, adding a northern neighborhood church to the guide beyond the downtown heritage cluster.",
    ["Catholic parish church", "Taloto neighborhood landmark"],
    "Taloto",
  ),
  "al-fresco-bay-cafe-restobar": guideDetails(
    "Al Fresco Bay combines café and restobar service near the central waterfront side of Poblacion II, making it a city dining stop close to the port-facing streets.",
    ["Café and restobar", "Central waterfront vicinity"],
    "Poblacion II",
  ),
  "red-house-city-taiwan-shabu-shabu": guideDetails(
    "Red House City specializes in Taiwanese-style shabu-shabu, built around hot-pot dining in Tagbilaran’s Dampas district.",
    ["Taiwanese-style hot pot", "Dampas dining stop"],
    "Dampas",
  ),
  "just-sizzlin-resto": guideDetails(
    "Just Sizzlin’ is a casual central-city restaurant focused on sizzling-plate dining, positioned in Poblacion I close to several cafés and downtown stops.",
    ["Casual sizzling-plate restaurant", "Central Poblacion location"],
    "Poblacion I",
  ),
  "gerardas-family-restaurant": guideDetails(
    "Gerarda’s Place serves Filipino family-style cooking from a home-like setting on J. S. Torralba Street. Its longstanding local identity makes it a useful introduction to Tagbilaran dining beyond mall and hotel restaurants.",
    ["Filipino family-style cooking", "Heritage-house atmosphere"],
    undefined,
    "This is the main city location recorded by the guide; confirm the branch when opening directions.",
  ),
  "smoque-bistro": guideDetails(
    "SMOQUE Bistro is a contemporary restaurant in Bool with a bistro menu and an open-kitchen dining room, close to the Blood Compact area.",
    ["Contemporary bistro", "Bool dining cluster"],
    "Bool",
  ),
  "garden-cafe": guideDetails(
    "Garden Café sits beside the Plaza Rizal and cathedral area, offering a convenient café-and-restaurant stop within Tagbilaran’s central heritage walk.",
    ["Café and restaurant", "Beside the downtown heritage core"],
    "Poblacion I",
  ),
  "punjabi-rasoi": guideDetails(
    "Punjabi Rasoi adds Indian cooking to Tagbilaran’s restaurant mix from its location in Cogon, north of the central civic district.",
    ["Indian restaurant", "Cogon dining stop"],
    "Cogon",
  ),
  "crave-cafe-bohol": guideDetails(
    "Crave Cafe Bohol is a contemporary neighborhood café in Cogon, suited to a coffee or casual meal stop while moving through the northern side of central Tagbilaran.",
    ["Contemporary café", "Cogon neighborhood stop"],
    "Cogon",
  ),
  "bark-coffee": guideDetails(
    "Bark Coffee is a roadside specialty-coffee stop in Mansasa, away from the denser downtown café cluster and closer to the city’s southern approach.",
    ["Specialty coffee shop", "Mansasa roadside location"],
    "Mansasa",
  ),
  "tamper-coffee-brunch": guideDetails(
    "Tamper Coffee & Brunch pairs coffee with daytime brunch dining in Poblacion I, within the same compact central area as several restaurants and heritage stops.",
    ["Coffee and brunch", "Central Poblacion location"],
    "Poblacion I",
  ),
  "mosia-cafe": guideDetails(
    "Mosia Cafe is a bright, contemporary café in Mansasa that adds a quieter coffee stop on the southern side of the city center.",
    ["Contemporary café", "Mansasa neighborhood stop"],
    "Mansasa",
  ),
  "chido-cafe": guideDetails(
    "Chido Cafe occupies a sea-facing space in Bool and serves a broad café menu in a relaxed setting. Its position makes it easy to combine with the Blood Compact waterfront cluster.",
    ["Sea-facing café", "Bool waterfront cluster"],
    undefined,
    "Pair the stop with the Blood Compact Monument and Friendship Park nearby.",
  ),
  "ocean-suites": guideDetails(
    "Ocean Suites is a hotel in Bool beside the Blood Compact area, with an elevated position facing the water east of central Tagbilaran.",
    ["City hotel", "Water-facing Bool location"],
    "Bool",
    "Its location is best suited to visitors planning time around the Bool heritage and dining cluster.",
  ),
  "kew-hotel": guideDetails(
    "Kew Hotel Tagbilaran is a full-service city hotel on J. A. Clarin Street, with rooms, dining, and event facilities in the Dampas district near major commercial stops.",
    ["Full-service city hotel", "Dining and event facilities"],
    undefined,
  ),
  "belian-hotel": guideDetails(
    "Belian Hotel is a city hotel on the port side of Cogon, positioned for access to the downtown commercial area and Tagbilaran’s sea-terminal district.",
    ["City hotel", "Near the port and downtown"],
    "Cogon",
  ),
  "kasagpan-resort": guideDetails(
    "Kasagpan Resort is a cliffside property in Booy with landscaped grounds, pools, and a broad sea-facing outlook on Tagbilaran’s western coast.",
    ["Cliffside resort", "Pools and sea views"],
    "Booy",
  ),
  "bohol-ecotel": guideDetails(
    "Bohol Ecotel is a compact lodging option in Poblacion III, close to central Tagbilaran’s government, museum, dining, and shopping streets.",
    ["Central city lodging", "Poblacion III location"],
    "Poblacion III",
  ),
  "travelbee-seaside-inn": guideDetails(
    "Travelbee Seaside Inn is a city inn in Poblacion II, positioned near the port, waterfront streets, and Tagbilaran’s downtown core.",
    ["City inn", "Near the port and waterfront"],
    "Poblacion II",
  ),
  "dao-diamond-hotel-restaurant": guideDetails(
    "Dao Diamond Hotel and Restaurant is a hotel-and-dining property in Dao, north of the central district and close to the city’s major transport and shopping corridor.",
    ["Hotel and restaurant", "Dao district location"],
    "Dao",
  ),
  "island-city-mall": guideDetails(
    "Island City Mall is a major retail and community destination in Dao, bringing shops, dining, cinema, services, and events together beside Tagbilaran’s northern commercial corridor.",
    ["Shopping, dining, and cinema", "Major Dao commercial landmark"],
    undefined,
  ),
  "bq-mall": guideDetails(
    "Bohol Quality Mall is a locally rooted downtown mall close to Plaza Rizal. It anchors shopping and everyday services in the compact central business district.",
    ["Downtown shopping and services", "Near Plaza Rizal"],
    undefined,
  ),
  "alturas-mall-tagbilaran": guideDetails(
    "Alturas Mall is a longstanding downtown shopping destination in Poblacion II, embedded in the traditional commercial streets of central Tagbilaran.",
    ["Downtown department-store shopping", "Central commercial district"],
    "Poblacion II",
  ),
  "galleria-luisa-mall": guideDetails(
    "Galleria Luisa is a central mall in Poblacion II, close to the port-facing side of downtown and within walking distance of the civic core.",
    ["Central shopping center", "Poblacion II location"],
    "Poblacion II",
  ),
  "tagbilaran-city-square": guideDetails(
    "Tagbilaran City Square is a downtown shopping center in Poblacion II, positioned near BQ Mall, Alturas, and the city’s busiest central retail streets.",
    ["Downtown shopping center", "Central retail cluster"],
    "Poblacion II",
  ),
  "tagbilaran-city-central-public-market": guideDetails(
    "The City Central Public Market is an everyday trading hub in Dampas where produce, household goods, and small local businesses meet the routines of city life.",
    ["Public market", "Everyday local commerce"],
    "Dampas",
    "Visit as a working community market and be considerate when photographing vendors or customers.",
  ),
  "barangay-manga-public-market": guideDetails(
    "Barangay Manga Public Market serves the city’s northern coastal community, keeping neighborhood-scale trade close to Manga’s residential streets and fish-port activity.",
    ["Neighborhood public market", "Northern coastal community"],
    "Manga",
  ),
  "cpg-park": guideDetails(
    "President Carlos P. Garcia Park is a waterfront public space used for walking, jogging, informal gatherings, and views across the coast.",
    ["Waterfront public park", "Walking and sunset views"],
    undefined,
  ),
  "tagbilaran-city-friendship-park": guideDetails(
    "Friendship Park is the landscaped public space around the Blood Compact area in Bool, joining the monument and waterfront outlook into one open-air stop.",
    ["Public waterfront park", "Blood Compact monument setting"],
    "Bool",
  ),
  "banat-i-hill": guideDetails(
    "Banat-i Hill is a southern Tagbilaran viewpoint in Bool, valued for its elevated perspective across the city edge, coast, and neighboring water.",
    ["Elevated city viewpoint", "Coastal outlook"],
    "Bool",
    "Conditions on viewpoint access can change, so check the current approach before setting out.",
  ),
  "manga-fish-port": guideDetails(
    "Manga Fish Port is a working coastal landing place in northern Tagbilaran, where fishing activity and the city’s relationship with the sea remain visible.",
    ["Working fish port", "Northern coastal outlook"],
    "Manga",
    "Treat the port as a workplace: keep routes clear and ask before photographing people at work.",
  ),
};

const categoryRank: Record<Place["category"], number> = {
  "history-culture": 0,
  "faith-architecture": 1,
  "food-drink": 2,
  accommodation: 3,
  "shopping-market": 4,
  outdoors: 5,
  event: 6,
  "visitor-essential": 7,
};

function reviewedStreetView(
  input: Omit<
    StreetViewReference,
    "provider" | "verifiedAt" | "reviewDueAt"
  >,
): StreetViewReference {
  return {
    ...input,
    provider: "Google Maps",
    verifiedAt: "2026-07-26",
    reviewDueAt: "2027-01-26",
  };
}

const reviewedStreetViews = {
  nationalMuseum: {
    panoId: "CIABIhA0PJrzmUK6HV6cIY56Z_bE",
    coordinates: { latitude: 9.640203021384755, longitude: 123.8564854360567 },
    captureDate: "2025-11",
    provider: "Google Maps",
    contributor: "EARL JOHN LASQUITE",
    label: "National Museum of the Philippines - Bohol",
    verifiedAt: "2026-07-19",
    match: "exact-venue",
    reviewDueAt: "2027-01-19",
  },
  cathedralInterior: {
    panoId: "CIHM0ogKEICAgICtvJiUxgE",
    coordinates: { latitude: 9.638943034894051, longitude: 123.8556794610127 },
    captureDate: "2024-01",
    provider: "Google Maps",
    contributor: "Jeremy Bowling",
    label: "St. Joseph the Worker Cathedral Shrine",
    verifiedAt: "2026-07-19",
    match: "exact-venue",
    reviewDueAt: "2027-01-19",
  },
  kewHotel: {
    panoId: "CIABIhDo-O7eMDbhHPr-6st_p_Sy",
    coordinates: { latitude: 9.654375974433567, longitude: 123.8670299977546 },
    captureDate: "2025-09",
    provider: "Google Maps",
    contributor: "KEW GC",
    label: "Kew Hotel Tagbilaran",
    verifiedAt: "2026-07-19",
    match: "exact-venue",
    reviewDueAt: "2027-01-19",
  },
  kasagpan: {
    panoId: "CIABIhAYRKnu_dwktfbXPmuKn5lQ",
    coordinates: { latitude: 9.663289990796574, longitude: 123.8445793869299 },
    captureDate: "2025-05",
    provider: "Google Maps",
    contributor: "360 Tour Philippines",
    label: "Kasagpan Resort",
    verifiedAt: "2026-07-19",
    match: "exact-venue",
    reviewDueAt: "2027-01-19",
  },
  plazaRizal: reviewedStreetView({
    panoId: "K8N_nk2a_-UaclF8LoaPMw",
    coordinates: { latitude: 9.639742, longitude: 123.8560645 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Sarmiento Street",
    heading: 43.85,
    match: "nearby-road",
    distanceMeters: 21,
  }),
  carlosPGarciaHouse: reviewedStreetView({
    panoId: "hdquTgLQlTIVCSOnYdsnug",
    coordinates: { latitude: 9.6415533, longitude: 123.8578845 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby F. Rocha Street",
    heading: 121.7,
    match: "nearby-road",
    distanceMeters: 26,
  }),
  lourdesParish: reviewedStreetView({
    panoId: "w9pvUBU4haUDZf8Z7RJ5Qg",
    coordinates: { latitude: 9.6458606, longitude: 123.8527811 },
    captureDate: "2023-08",
    contributor: "Google Street View",
    label: "Nearby Celestino Gallares Street",
    heading: -130.61,
    match: "nearby-road",
    distanceMeters: 14,
  }),
  birhenParish: reviewedStreetView({
    panoId: "Qk22zzUFiE3zqrydvl-BfA",
    coordinates: { latitude: 9.6552271, longitude: 123.8546176 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Benigno Aquino Avenue",
    heading: 37.8,
    match: "nearby-road",
    distanceMeters: 46,
  }),
  immaculateHeartParish: reviewedStreetView({
    panoId: "OS1I9m9dKga1TuLuOBovcg",
    coordinates: { latitude: 9.6753508, longitude: 123.8537795 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Cabalit Street",
    heading: -164.18,
    match: "nearby-road",
    distanceMeters: 33,
  }),
  chidoCafe: reviewedStreetView({
    panoId: "GmqBFLdhr_oYe8LWfFrqFQ",
    coordinates: { latitude: 9.628046, longitude: 123.8780369 },
    captureDate: "2023-07",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran East Road",
    heading: -165.25,
    match: "nearby-road",
    distanceMeters: 22,
  }),
  gerardas: reviewedStreetView({
    panoId: "BaMESnuA8DAvOBanX5hxYA",
    coordinates: { latitude: 9.643124, longitude: 123.8581135 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby J.S. Torralba Street",
    heading: 124.98,
    match: "nearby-road",
    distanceMeters: 10,
  }),
  alFrescoBay: reviewedStreetView({
    panoId: "1WrJpCkKUpdEuEZgTpzFoQ",
    coordinates: { latitude: 9.6450457, longitude: 123.8537733 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby G. Visarra Street",
    heading: 158.86,
    match: "nearby-road",
    distanceMeters: 16,
  }),
  justSizzlin: reviewedStreetView({
    panoId: "F7CP7pXoDp-bpzLR3s0UZg",
    coordinates: { latitude: 9.6382123, longitude: 123.8599129 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby P. Del Rosario Street",
    heading: 91.23,
    match: "nearby-road",
    distanceMeters: 12,
  }),
  smoqueBistro: reviewedStreetView({
    panoId: "W2BYCe4pTkE24UKAEixowA",
    coordinates: { latitude: 9.6310373, longitude: 123.8772423 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Carlos P. Garcia East Avenue",
    heading: -128.23,
    match: "nearby-road",
    distanceMeters: 11,
  }),
  gardenCafe: reviewedStreetView({
    panoId: "jD3_BQIdo_vd-e92g8yZRw",
    coordinates: { latitude: 9.6397858, longitude: 123.8553656 },
    captureDate: "2023-07",
    contributor: "Google Street View",
    label: "Nearby J.S. Torralba Street",
    heading: 121.53,
    match: "nearby-road",
    distanceMeters: 22,
  }),
  punjabiRasoi: reviewedStreetView({
    panoId: "ZrXIx7LGz7OUV3EqmjZUmA",
    coordinates: { latitude: 9.6561916, longitude: 123.8528976 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Airport Road",
    heading: 14.84,
    match: "nearby-road",
    distanceMeters: 13,
  }),
  craveCafe: reviewedStreetView({
    panoId: "USlJaIcy37TBp5mbbth6pg",
    coordinates: { latitude: 9.6506273, longitude: 123.8530979 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Lamdagan Street",
    heading: -102.46,
    match: "nearby-road",
    distanceMeters: 12,
  }),
  barkCoffee: reviewedStreetView({
    panoId: "e2JB9tt-yIRWxNDCQ5g92Q",
    coordinates: { latitude: 9.6318004, longitude: 123.8694332 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran East Road",
    heading: -161.43,
    match: "nearby-road",
    distanceMeters: 17,
  }),
  tamperCoffee: reviewedStreetView({
    panoId: "p06iN5WHY2o45YkRBkn9nw",
    coordinates: { latitude: 9.6384069, longitude: 123.860171 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Carlos P. Garcia East Avenue",
    heading: -173,
    match: "nearby-road",
    distanceMeters: 23,
  }),
  mosiaCafe: reviewedStreetView({
    panoId: "b_1xH0skZvIo4Ii2H9sNXg",
    coordinates: { latitude: 9.6336773, longitude: 123.8659601 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran East Road",
    heading: 22.42,
    match: "nearby-road",
    distanceMeters: 10,
  }),
  oceanSuitesRoad: reviewedStreetView({
    panoId: "PX3DXU1DM1Qif2lU9Qe94Q",
    coordinates: { latitude: 9.6278435, longitude: 123.8786534 },
    captureDate: "2023-07",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran East Road",
    heading: 119,
    match: "nearby-road",
    distanceMeters: 78,
  }),
  boholEcotel: reviewedStreetView({
    panoId: "_NmGkXxm1fF21l7-NDhLwQ",
    coordinates: { latitude: 9.6394927, longitude: 123.8609586 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Hontanosas Street",
    heading: -172.13,
    match: "nearby-road",
    distanceMeters: 8,
  }),
  travelbee: reviewedStreetView({
    panoId: "gqgVXqeWY163-RYTlZY6og",
    coordinates: { latitude: 9.6477207, longitude: 123.851325 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Celestino Gallares Street",
    heading: -152.7,
    match: "nearby-road",
    distanceMeters: 14,
  }),
  daoDiamond: reviewedStreetView({
    panoId: "UBo8h7mCq0nnU4XbsF7KZg",
    coordinates: { latitude: 9.6637914, longitude: 123.8681589 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran-Corella Road",
    heading: -44.38,
    match: "nearby-road",
    distanceMeters: 59,
  }),
  bqMall: reviewedStreetView({
    panoId: "c5aTPdX0HOVGIYWibwZUew",
    coordinates: { latitude: 9.6415448, longitude: 123.8552465 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Honorio Grupo Street",
    heading: -42.02,
    match: "nearby-road",
    distanceMeters: 6,
  }),
  alturasMall: reviewedStreetView({
    panoId: "zhXJuXAMvwulgO95lg9rVA",
    coordinates: { latitude: 9.6430947, longitude: 123.8565919 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby B. Inting Street",
    heading: -47.68,
    match: "nearby-road",
    distanceMeters: 44,
  }),
  galleriaLuisa: reviewedStreetView({
    panoId: "YoYUj9vU--MjaBbIiAkyBg",
    coordinates: { latitude: 9.6422977, longitude: 123.8540517 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby downtown road",
    heading: -106.15,
    match: "nearby-road",
    distanceMeters: 19,
  }),
  centralMarket: reviewedStreetView({
    panoId: "-FP5Uz0cUv7ZIgS3RxzR4A",
    coordinates: { latitude: 9.6557571, longitude: 123.8715479 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby market access road",
    heading: 164.92,
    match: "nearby-road",
    distanceMeters: 19,
  }),
  mangaMarket: reviewedStreetView({
    panoId: "H8YmQZg4r7dHkjruUfKUbg",
    coordinates: { latitude: 9.6933677, longitude: 123.8635854 },
    captureDate: "2024-04",
    contributor: "Google Street View",
    label: "Nearby Elly Hill Road",
    heading: -149.49,
    match: "nearby-road",
    distanceMeters: 5,
  }),
  friendshipParkRoad: reviewedStreetView({
    panoId: "PX3DXU1DM1Qif2lU9Qe94Q",
    coordinates: { latitude: 9.6278435, longitude: 123.8786534 },
    captureDate: "2023-07",
    contributor: "Google Street View",
    label: "Nearby Tagbilaran East Road",
    heading: -165.85,
    match: "nearby-road",
    distanceMeters: 65,
  }),
} satisfies Record<string, StreetViewReference>;

const streetViewByPlace: Partial<Record<string, StreetViewReference>> = {
  "national-museum-bohol": reviewedStreetViews.nationalMuseum,
  "st-joseph-cathedral": reviewedStreetViews.cathedralInterior,
  "plaza-rizal": reviewedStreetViews.plazaRizal,
  "carlos-p-garcia-heritage-museum": reviewedStreetViews.carlosPGarciaHouse,
  "our-lady-of-lourdes-parish": reviewedStreetViews.lourdesParish,
  "birhen-sa-barangay-parish": reviewedStreetViews.birhenParish,
  "immaculate-heart-of-mary-parish": reviewedStreetViews.immaculateHeartParish,
  "chido-cafe": reviewedStreetViews.chidoCafe,
  "gerardas-family-restaurant": reviewedStreetViews.gerardas,
  "al-fresco-bay-cafe-restobar": reviewedStreetViews.alFrescoBay,
  "just-sizzlin-resto": reviewedStreetViews.justSizzlin,
  "smoque-bistro": reviewedStreetViews.smoqueBistro,
  "garden-cafe": reviewedStreetViews.gardenCafe,
  "punjabi-rasoi": reviewedStreetViews.punjabiRasoi,
  "crave-cafe-bohol": reviewedStreetViews.craveCafe,
  "bark-coffee": reviewedStreetViews.barkCoffee,
  "tamper-coffee-brunch": reviewedStreetViews.tamperCoffee,
  "mosia-cafe": reviewedStreetViews.mosiaCafe,
  "kew-hotel": reviewedStreetViews.kewHotel,
  "ocean-suites": reviewedStreetViews.oceanSuitesRoad,
  "kasagpan-resort": reviewedStreetViews.kasagpan,
  "bohol-ecotel": reviewedStreetViews.boholEcotel,
  "travelbee-seaside-inn": reviewedStreetViews.travelbee,
  "dao-diamond-hotel-restaurant": reviewedStreetViews.daoDiamond,
  "bq-mall": reviewedStreetViews.bqMall,
  "alturas-mall-tagbilaran": reviewedStreetViews.alturasMall,
  "galleria-luisa-mall": reviewedStreetViews.galleriaLuisa,
  "tagbilaran-city-central-public-market": reviewedStreetViews.centralMarket,
  "barangay-manga-public-market": reviewedStreetViews.mangaMarket,
  "tagbilaran-city-friendship-park": reviewedStreetViews.friendshipParkRoad,
};

export const places = placeEntries
  .map((place) => ({
    ...place,
    ...placeEnhancements[place.slug],
    streetView: streetViewByPlace[place.slug],
  }))
  .sort((a, b) => categoryRank[a.category] - categoryRank[b.category]);

export function getPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}
