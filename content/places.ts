import type { ImageAsset, Place, SourceRecord } from "@/types/content";

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
  title: "Tagbilaran City — top things to do",
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
): ImageAsset {
  return {
    src: `/images/places/${filename}`,
    alt,
    width,
    height,
    credit,
    rights,
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
  };
  additionalSources?: SourceRecord[];
}

const googlePhotoRights =
  "Google Maps community image used for prototype reference; confirm contributor permission and Google attribution requirements before publication.";

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
      ),
    ],
    sources: [
      suppliedPlaceRegisterSource,
      googleMapsPlaceSource(input.name, mapQuery),
      ...(input.additionalSources ?? []),
    ],
    verifiedAt: accessedAt,
    verificationStatus: "source-reviewed",
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
      width: 1200,
      height: 705,
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
      alt: "Altar inside Our Lady of Lourdes Parish Church",
      width: 720,
      height: 540,
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
    verificationStatus: "source-reviewed",
  },
  {
    id: "national-museum-bohol",
    slug: "national-museum-bohol",
    name: "National Museum of the Philippines – Bohol",
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
        "Facade of the National Museum of the Philippines – Bohol",
        1024,
        760,
        "City Government of Tagbilaran",
        "Public-domain government content unless otherwise stated; verify the individual image notice before publication.",
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
        "National Museum of the Philippines – Bohol",
        "National Museum of the Philippines Bohol, Tagbilaran City",
      ),
      osmSource(
        "National Museum of the Philippines – Bohol map feature",
        "way",
        242261499,
      ),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verificationStatus: "source-reviewed",
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
        "Stone facade and bell tower of St. Joseph the Worker Cathedral",
        2048,
        1536,
        "City Government of Tagbilaran",
        "Public-domain government content unless otherwise stated; verify the individual image notice before publication.",
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
    verificationStatus: "source-reviewed",
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
        "Plaza Jose P. Rizal with landscaped paths and the Rizal monument",
        2048,
        1152,
        "City Government of Tagbilaran",
        "Public-domain government content unless otherwise stated; verify the individual image notice before publication.",
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
    verificationStatus: "source-reviewed",
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
    verificationStatus: "source-reviewed",
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
    verificationStatus: "source-reviewed",
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
    verificationStatus: "source-reviewed",
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
    verificationStatus: "source-reviewed",
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
        "Colorful exterior of Island City Mall in Tagbilaran",
        300,
        183,
        "Bohol Provincial Tourism Office",
        "Image reuse terms are not stated; confirm with the publisher before launch.",
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
    verificationStatus: "source-reviewed",
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
        "Street entrance of Bohol Quality Mall in downtown Tagbilaran",
        330,
        228,
        "Bohol Provincial Tourism Office",
        "Image reuse terms are not stated; confirm with the publisher before launch.",
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
    verificationStatus: "source-reviewed",
  },
  {
    id: "baclayon-church",
    slug: "baclayon-church",
    name: "Baclayon Church",
    category: "faith-architecture",
    scope: "nearby",
    summary:
      "A prominent historic church in the neighboring municipality of Baclayon, included as a clearly labeled nearby stop rather than a Tagbilaran City site.",
    coordinates: { longitude: 123.9124751, latitude: 9.6229536 },
    address: "Poblacion, Baclayon, Bohol",
    directionsUrl: googleMapsUrl(
      "Baclayon Church, Poblacion, Baclayon, Bohol",
    ),
    features: ["Popular nearby heritage stop", "Outside Tagbilaran City"],
    accessibility: practicalDetailsNote,
    images: [
      localImage(
        "baclayon-church.webp",
        "Stone facade and bell tower of Baclayon Church",
        1920,
        1440,
        "Bohol Provincial Tourism Office",
        "Image reuse terms are not stated; confirm with the publisher before launch.",
      ),
    ],
    sources: [
      provincialTourismSource,
      popularPlacesSource,
      googleMapsSource(
        "Baclayon Church",
        "Baclayon Church, Poblacion, Baclayon, Bohol",
      ),
      osmSource("Baclayon Church map feature", "relation", 18624659),
    ],
    verifiedAt: accessedAt,
    featured: true,
    verificationStatus: "source-reviewed",
  },
  ...suppliedPlaceEntries,
];

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

export const places = [...placeEntries].sort(
  (a, b) => categoryRank[a.category] - categoryRank[b.category],
);

export function getPlace(slug: string) {
  return places.find((place) => place.slug === slug);
}
