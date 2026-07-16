import type { ImageAsset, Place, SourceRecord } from "@/types/content";

const accessedAt = "2026-07-16";
const officialTourismUrl = "https://stratcom.tagbilaran.gov.ph/tourism";

const officialTourismSource: SourceRecord = {
  title: "Tourism listings",
  url: officialTourismUrl,
  publisher: "City Government of Tagbilaran",
  accessedAt,
  notes:
    "Official listing used for the place name, category label, description, image, and directions link.",
};

function officialImage(
  filename: string,
  alt: string,
  width: number,
  height: number,
): ImageAsset {
  return {
    src: `https://stratcom.tagbilaran.gov.ph/images/tourism/${filename}`,
    alt,
    width,
    height,
    credit: "City Government of Tagbilaran",
    rights: "Reuse terms are not stated on the source page; confirm before publication.",
  };
}

const stakeholderRegisterSource: SourceRecord = {
  title: "Tagbilaran Places by Category",
  publisher: "Hello Tagbilaran project stakeholder",
  accessedAt,
  notes: "The place name and editorial category were supplied for this milestone.",
};

const cityWebsiteAuditSource: SourceRecord = {
  title: "City Government website content audit",
  url: "https://tagbilaran.gov.ph/",
  publisher: "City Government of Tagbilaran",
  accessedAt,
  notes:
    "The public tourism pages, sitemap, and site search were reviewed. A dedicated current profile was not available for every stakeholder-supplied entry.",
};

type RegisterPlaceInput = Pick<Place, "slug" | "name" | "category" | "summary"> &
  Partial<Omit<Place, "id" | "slug" | "name" | "category" | "summary">>;

function registerPlace(input: RegisterPlaceInput): Place {
  return {
    id: input.slug,
    scope: "tagbilaran",
    features: [
      "Category supplied by the project register",
      "Current visitor details require local confirmation",
    ],
    images: [],
    sources: [stakeholderRegisterSource, cityWebsiteAuditSource],
    verificationStatus: "needs-local-verification",
    ...input,
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
    notes: "Used for the map point and location record; confirm locally.",
  };
}

function osmDirections(longitude: number, latitude: number) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}

const placeEntries: Place[] = [
  {
    id: "blood-compact-shrine",
    slug: "blood-compact-shrine",
    name: "Blood Compact Monument (Sandugo Shrine)",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "A seaside monument commemorating the 1565 Sandugo between Datu Sikatuna and Spanish explorer Miguel López de Legazpi, presented by the City Government as a symbol of an early treaty of friendship.",
    coordinates: { longitude: 123.8792041, latitude: 9.6274622 },
    address: "Venancio P. Inting Avenue, Bool, Tagbilaran City, Bohol 6301",
    barangay: "Bool",
    directionsUrl:
      "https://www.google.com/maps?q=Blood+Compact+Shrine+Tagbilaran+City",
    features: ["Official label: History & Heritage", "Seaside monument"],
    accessibility: {
      verificationNotes:
        "Current access conditions have not been verified. Confirm locally before visiting.",
    },
    images: [
      officialImage(
        "blood-compact-shrine.jpg",
        "Blood Compact Shrine monument by the sea",
        1170,
        757,
      ),
    ],
    sources: [
      officialTourismSource,
      {
        title: "History of Tagbilaran",
        url: "https://tagbilaran.gov.ph/history/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Official city history used to cross-check the Bool setting and event context.",
      },
      {
        title: "Blood Compact Site map feature",
        url: "https://www.openstreetmap.org/node/1509857534",
        publisher: "OpenStreetMap contributors",
        accessedAt,
        notes: "Used for the map point and source-recorded address; confirm locally.",
      },
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
      "A heritage museum in the former Provincial Capitol building, with exhibitions covering Bohol’s archaeology, ethnography, natural history, and cultural material.",
    coordinates: { longitude: 123.85655, latitude: 9.64028 },
    address: "Km. 0, Carlos P. Garcia Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    directionsUrl:
      "https://www.google.com/maps?q=National+Museum+of+the+Philippines+Bohol+Tagbilaran+City",
    features: ["Official label: History & Culture", "Former Provincial Capitol"],
    accessibility: {
      verificationNotes:
        "Current access conditions have not been verified. Confirm directly with the museum.",
    },
    images: [
      officialImage(
        "national-museum.jpg",
        "National Museum of the Philippines – Bohol facade",
        1024,
        760,
      ),
    ],
    sources: [
      officialTourismSource,
      {
        title: "Bohol Area Museum",
        url: "https://www.nationalmuseum.gov.ph/our-museums/regional-area-and-site-museums/bohol/",
        publisher: "National Museum of the Philippines",
        accessedAt,
        notes: "Official museum page used to cross-check the building and address.",
      },
      {
        title: "National Museum of the Philippines – Bohol map feature",
        url: "https://www.openstreetmap.org/way/242261499",
        publisher: "OpenStreetMap contributors",
        accessedAt,
        notes: "Used for the map point; confirm locally.",
      },
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
      "Tagbilaran’s principal Catholic cathedral, set near the city plaza and described by the City Government as a religious center with Spanish-era historical roots.",
    coordinates: { longitude: 123.85571, latitude: 9.6392 },
    barangay: "Poblacion 3",
    directionsUrl:
      "https://www.google.com/maps?q=St.+Joseph+the+Worker+Cathedral+Shrine+Tagbilaran+City",
    features: ["Official label: Religion & Heritage", "Near Plaza Rizal"],
    accessibility: {
      verificationNotes:
        "Current access conditions have not been verified. Confirm directly with the cathedral.",
    },
    images: [
      officialImage(
        "st.-joseph-cathedral.jpg",
        "St. Joseph the Worker Cathedral Shrine exterior",
        2048,
        1536,
      ),
    ],
    sources: [
      officialTourismSource,
      {
        title: "Tagbilaran Cathedral",
        url: "https://www.wikidata.org/wiki/Q31440684",
        publisher: "Wikidata contributors",
        accessedAt,
        notes: "Used for the map point; confirm locally.",
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
    category: "outdoors",
    scope: "tagbilaran",
    summary:
      "Tagbilaran’s central city plaza, surrounded by historic buildings and presented as a place for walking, pausing, and cultural sightseeing.",
    coordinates: { longitude: 123.8563093, latitude: 9.6398685 },
    barangay: "Poblacion 3",
    directionsUrl:
      "https://www.google.com/maps?q=Plaza+Jose+P+Rizal+Tagbilaran+City",
    features: ["Official label: Parks & Public Spaces", "Central city plaza"],
    accessibility: {
      verificationNotes:
        "Current access conditions have not been verified. Confirm locally before visiting.",
    },
    images: [
      officialImage(
        "plaza-rizal.jpg",
        "Plaza Jose P. Rizal city park in Tagbilaran",
        2048,
        1152,
      ),
    ],
    sources: [
      officialTourismSource,
      {
        title: "Plaza Rizal map feature",
        url: "https://www.openstreetmap.org/relation/17480946",
        publisher: "OpenStreetMap contributors",
        accessedAt,
        notes: "Used for the map point and barangay; confirm locally.",
      },
    ],
    verifiedAt: accessedAt,
    verificationStatus: "source-reviewed",
  },
  {
    id: "cpg-park",
    slug: "cpg-park",
    name: "CPG Park (President Carlos P. Garcia Park)",
    category: "history-culture",
    scope: "tagbilaran",
    summary:
      "A waterfront park presented by the City Government as a setting for jogging, sunset views, and relaxed walks along the coast.",
    coordinates: { longitude: 123.8586466, latitude: 9.6597508 },
    directionsUrl:
      "https://www.google.com/maps?q=President+Carlos+P+Garcia+Park+Tagbilaran+City",
    features: ["Official label: Parks & Waterfront", "Coastal public space"],
    accessibility: {
      verificationNotes:
        "Current access conditions have not been verified. Confirm locally before visiting.",
    },
    images: [
      officialImage(
        "cpg-park.jpg",
        "President Carlos P. Garcia Park waterfront view",
        960,
        720,
      ),
    ],
    sources: [
      officialTourismSource,
      {
        title: "President Garcia Park map feature",
        url: "https://www.openstreetmap.org/relation/15320972",
        publisher: "OpenStreetMap contributors",
        accessedAt,
        notes: "Used for the map point; confirm locally.",
      },
    ],
    verifiedAt: accessedAt,
    verificationStatus: "source-reviewed",
  },
  registerPlace({
    slug: "bohol-provincial-library-archives",
    name: "Bohol Provincial Library and Archives",
    category: "history-culture",
    summary:
      "A provincial library and archives entry in central Tagbilaran. Its collection scope, public services, hours, and access conditions still require confirmation with the institution.",
    coordinates: { longitude: 123.8568477, latitude: 9.6403814 },
    address: "C. Marapao Street, Poblacion 3, Tagbilaran City, Bohol",
    barangay: "Poblacion 3",
    directionsUrl: osmDirections(123.8568477, 9.6403814),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Bohol Provincial Library map feature", "way", 793859498),
    ],
  }),
  registerPlace({
    slug: "spanish-belfry",
    name: "Spanish Belfry",
    category: "faith-architecture",
    scope: "nearby",
    summary:
      "The supplied register names a Spanish Belfry, but the City Government site and source-backed map search did not identify an exact Tagbilaran match. The intended site and municipality need confirmation before a map point is published.",
    features: ["Exact site needs identification", "Map point intentionally withheld"],
  }),
  registerPlace({
    slug: "baclayon-church",
    name: "Baclayon Church",
    category: "faith-architecture",
    scope: "nearby",
    summary:
      "A church listing in the municipality of Baclayon, outside Tagbilaran City. Historical interpretation and current visitor conditions still need a direct source review.",
    coordinates: { longitude: 123.9124751, latitude: 9.6229536 },
    address: "Poblacion, Baclayon, Bohol",
    directionsUrl: osmDirections(123.9124751, 9.6229536),
    features: ["Nearby — outside Tagbilaran City", "Current visit details require confirmation"],
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Baclayon Church map feature", "relation", 18624659),
    ],
  }),
  registerPlace({
    slug: "dauis-church",
    name: "Dauis Church / Assumption of Our Lady Shrine",
    category: "faith-architecture",
    scope: "nearby",
    summary:
      "A shrine and church listing in Dauis, Panglao Island, outside Tagbilaran City. Historical interpretation and current visitor conditions still need direct confirmation.",
    coordinates: { longitude: 123.8649847, latitude: 9.6257954 },
    address: "B. Reyes Street, Poblacion, Dauis, Bohol 6339",
    directionsUrl: osmDirections(123.8649847, 9.6257954),
    features: ["Nearby — outside Tagbilaran City", "Current visit details require confirmation"],
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Assumption of Our Lady Shrine Parish Church map feature", "way", 404708846),
    ],
  }),
  registerPlace({
    slug: "dalareich-chocolate-house",
    name: "Dalareich Chocolate House",
    category: "food-drink",
    summary:
      "A chocolate-focused Tagbilaran listing mentioned in a City Government report about a 2022 official visit. Current products, hours, prices, and visitor arrangements require direct confirmation.",
    coordinates: { longitude: 123.8505583, latitude: 9.6637245 },
    address: "Bukid Drive, Tagbilaran City, Bohol",
    directionsUrl: osmDirections(123.8505583, 9.6637245),
    features: ["City Government news mention", "Current menu and hours need confirmation"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Japan’s Consul-General admires the Balili House",
        url: "https://tagbilaran.gov.ph/2022/09/26/japans-consul-general-admires-the-balili-house/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Official report mentions a stop at Dalareich Chocolate House.",
      },
      osmSource("Dalareich Chocolate House map feature", "node", 10239835411),
    ],
  }),
  registerPlace({
    slug: "hideout-food-park",
    name: "The Hideout Food Park",
    category: "food-drink",
    summary:
      "A food-park listing mapped in Dampas. The City Government site does not publish a dedicated profile, so vendors, menus, prices, and hours remain unverified.",
    coordinates: { longitude: 123.8752874, latitude: 9.6498546 },
    address: "T. Bantol Street, Dampas, Tagbilaran City, Bohol 6300",
    barangay: "Dampas",
    directionsUrl: osmDirections(123.8752874, 9.6498546),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("The Hideout Food Park map feature", "way", 1355628534),
    ],
  }),
  registerPlace({
    slug: "chido-cafe",
    name: "Chido Cafe",
    category: "food-drink",
    summary:
      "A café listing mapped in Bool, close to the Blood Compact area. Current menu, prices, hours, contacts, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8779861, latitude: 9.6278559 },
    address: "Venancio P. Inting Avenue, Bool, Tagbilaran City, Bohol 6301",
    barangay: "Bool",
    directionsUrl: osmDirections(123.8779861, 9.6278559),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Chido Cafe map feature", "node", 11036534048),
    ],
  }),
  registerPlace({
    slug: "becca-cafe-bistro",
    name: "Becca x Bistro Cafe",
    category: "food-drink",
    summary:
      "A café and bistro listing mapped in Mansasa. The City Government site does not publish a dedicated profile; current menus, prices, hours, and contacts need direct confirmation.",
    coordinates: { longitude: 123.8668617, latitude: 9.6321918 },
    address: "Venancio P. Inting Avenue, Mansasa, Tagbilaran City, Bohol 6300",
    barangay: "Mansasa",
    directionsUrl: osmDirections(123.8668617, 9.6321918),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Becca – Café x Bistro map feature", "node", 11076363905),
    ],
  }),
  registerPlace({
    slug: "baybay-sa-taloto",
    name: "Baybay sa Taloto",
    category: "food-drink",
    summary:
      "A stakeholder-selected food-and-drink entry associated with Taloto. No dedicated City Government profile or exact source-backed map point was found, so practical details and location remain to be confirmed.",
    features: ["Taloto association needs local confirmation", "Map point intentionally withheld"],
  }),
  registerPlace({
    slug: "gerardas-family-restaurant",
    name: "Gerarda's Family Restaurant",
    category: "food-drink",
    summary:
      "A family-restaurant listing mapped on Carlos P. Garcia North Avenue. Current menu, prices, hours, contacts, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8556362, latitude: 9.6555295 },
    address: "Carlos P. Garcia North Avenue, Tagbilaran City, Bohol 6300",
    directionsUrl: osmDirections(123.8556362, 9.6555295),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("GERARDA'S Family Restaurant map feature", "node", 5017314723),
    ],
  }),
  registerPlace({
    slug: "payag-restaurant",
    name: "Payag Restaurant",
    category: "food-drink",
    summary:
      "A restaurant listing mapped in Poblacion 3. The City Government site does not publish a dedicated profile, so current menu, prices, hours, contacts, and access conditions need confirmation.",
    coordinates: { longitude: 123.858078, latitude: 9.638828 },
    address: "S. Matig-a Street, Poblacion 3, Tagbilaran City, Bohol",
    barangay: "Poblacion 3",
    directionsUrl: osmDirections(123.858078, 9.638828),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Payag Restaurant map feature", "node", 1758054268),
    ],
  }),
  registerPlace({
    slug: "oasis-balili-heritage-lodge",
    name: "Oasis Balili Heritage Lodge",
    category: "accommodation",
    summary:
      "A lodging use within the Balili heritage house. A City Government report describes the house’s adaptive reuse as a budget hostel; current room types, rates, booking channels, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8535518, latitude: 9.6461299 },
    address: "0029 J. Borja Street, Poblacion 2, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 2",
    directionsUrl: osmDirections(123.8535518, 9.6461299),
    features: ["Heritage-house adaptive reuse", "Current stay details need confirmation"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Japan’s Consul-General admires the Balili House",
        url: "https://tagbilaran.gov.ph/2022/09/26/japans-consul-general-admires-the-balili-house/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Official report describes the Balili House as a budget hostel and adaptive reuse.",
      },
      osmSource("Oasis Balili Heritage Lodge map feature", "node", 5255094222),
    ],
  }),
  registerPlace({
    slug: "bohol-tropics-resort",
    name: "Bohol Tropics Resort",
    category: "accommodation",
    summary:
      "A resort and accommodation listing mapped on Graham Street. The City Government site mentions the property in news posts but does not provide a current visitor profile; rates, rooms, booking, and access details need confirmation.",
    coordinates: { longitude: 123.8479799, latitude: 9.6539546 },
    address: "Graham Street, Poblacion 2, Tagbilaran City, Bohol",
    barangay: "Poblacion 2",
    directionsUrl: osmDirections(123.8479799, 9.6539546),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Bohol Tropics Resort map feature", "way", 242599983),
    ],
  }),
  registerPlace({
    slug: "kew-hotel",
    name: "Kew Hotel",
    category: "accommodation",
    summary:
      "A hotel listing mapped on J. A. Clarin Street. Current rates, room inventory, booking contacts, amenities, and accessibility details require direct confirmation.",
    coordinates: { longitude: 123.867069, latitude: 9.6543602 },
    address: "J. A. Clarin Street, Cogon, Tagbilaran City, Bohol 6300",
    barangay: "Cogon",
    directionsUrl: osmDirections(123.867069, 9.6543602),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Kew Hotel map feature", "way", 702415996),
    ],
  }),
  registerPlace({
    slug: "metrocentre-hotel",
    name: "MetroCentre Hotel",
    category: "accommodation",
    summary:
      "A hotel and convention-center listing mapped on Carlos P. Garcia North Avenue. Current rates, booking information, services, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8555097, latitude: 9.6442314 },
    address: "Carlos P. Garcia North Avenue, Poblacion 2, Tagbilaran City, Bohol",
    barangay: "Poblacion 2",
    directionsUrl: osmDirections(123.8555097, 9.6442314),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("The MetroCentre Hotel & Convention Center map feature", "node", 726021314),
    ],
  }),
  registerPlace({
    slug: "belian-hotel",
    name: "Belian Hotel",
    category: "accommodation",
    summary:
      "A hotel listing mapped on Graham Street. The City Government site does not publish a dedicated profile; current rates, rooms, booking contacts, and access conditions need confirmation.",
    coordinates: { longitude: 123.8509257, latitude: 9.649314 },
    address: "Graham Street, Poblacion 2, Tagbilaran City, Bohol",
    barangay: "Poblacion 2",
    directionsUrl: osmDirections(123.8509257, 9.649314),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Belian Hotel map feature", "way", 1272148201),
    ],
  }),
  registerPlace({
    slug: "island-city-mall",
    name: "Island City Mall",
    category: "shopping-market",
    summary:
      "A shopping-center listing mapped in Tagbilaran. The City Government site references the mall in news and city history, but current stores, services, hours, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8692342, latitude: 9.6557382 },
    directionsUrl: osmDirections(123.8692342, 9.6557382),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Island City Mall map feature", "way", 242260527),
    ],
  }),
  registerPlace({
    slug: "bohol-showcase-center",
    name: "Bohol Showcase Center",
    category: "shopping-market",
    summary:
      "A showcase-center listing mapped on A. Hangos Street. Current product range, operating details, contacts, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.8570879, latitude: 9.6605413 },
    address: "A. Hangos Street, Tagbilaran City, Bohol",
    directionsUrl: osmDirections(123.8570879, 9.6605413),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Bohol Showcase Center map feature", "node", 11036721676),
    ],
  }),
  registerPlace({
    slug: "bq-mall",
    name: "BQ Mall",
    category: "shopping-market",
    summary:
      "A central shopping-center listing mapped on Carlos P. Garcia North Avenue. Current stores, services, hours, parking, and access conditions require direct confirmation.",
    coordinates: { longitude: 123.855035, latitude: 9.6419184 },
    address: "Carlos P. Garcia North Avenue, Poblacion 3, Tagbilaran City, Bohol 6300",
    barangay: "Poblacion 3",
    directionsUrl: osmDirections(123.855035, 9.6419184),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("BQ Mall map feature", "node", 1587020943),
    ],
  }),
  registerPlace({
    slug: "lite-port-center",
    name: "Lite Port Center",
    category: "shopping-market",
    summary:
      "A stakeholder-selected shopping entry associated with the port area. The City Government search mentions the name, but no exact source-backed map feature or current directory was found.",
    features: ["Port-area association needs confirmation", "Map point intentionally withheld"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Senyor San Jose altars up in Tagbilaran City",
        url: "https://tagbilaran.gov.ph/2022/03/29/senyor-san-jose-altars-up-in-tagbilaran-city/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "City search returns this official post as a mention; it is not a current visitor profile.",
      },
    ],
  }),
  registerPlace({
    slug: "cogon-public-market",
    name: "Tagbilaran City Public Market / Cogon Market",
    category: "shopping-market",
    summary:
      "A public-market listing mapped near Belderol Street. The City Government site references Cogon Market in infrastructure news, but current stall, hour, transport, and access details require local confirmation.",
    coordinates: { longitude: 123.8524767, latitude: 9.6512568 },
    address: "Belderol Street, Tagbilaran City, Bohol",
    directionsUrl: osmDirections(123.8524767, 9.6512568),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Cogon Public Market map feature", "node", 678983062),
    ],
  }),
  registerPlace({
    slug: "banat-i-hill",
    name: "Banat-i Hill",
    category: "outdoors",
    summary:
      "The southern hill identified on the City Government geography page as one of Tagbilaran’s two peaks. Trail access, viewpoint conditions, transport, and safety information still require an on-site check.",
    coordinates: { longitude: 123.8828904, latitude: 9.6332137 },
    directionsUrl: osmDirections(123.8828904, 9.6332137),
    features: ["City geography source reviewed", "Trail and access details need confirmation"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Location & Geography",
        url: "https://tagbilaran.gov.ph/location-geography/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Official city page identifies Banat-i as the southern peak.",
      },
      osmSource("Banat-i Hill map feature", "node", 10936114905),
    ],
    verificationStatus: "source-reviewed",
  }),
  registerPlace({
    slug: "taloto-mangrove-boardwalk",
    name: "Taloto Mangrove Boardwalk",
    category: "outdoors",
    summary:
      "A stakeholder-selected mangrove-boardwalk entry associated with Taloto. No dedicated City Government profile or exact source-backed map point was found, so access and environmental guidance need local confirmation.",
    features: ["Taloto association needs confirmation", "Map point intentionally withheld"],
  }),
  registerPlace({
    slug: "manga-fish-port",
    name: "Manga Fish Port",
    category: "outdoors",
    summary:
      "A fish-port listing mapped in Barangay Manga. Current public access, activity times, transport, safety, and photography guidance require local confirmation.",
    coordinates: { longitude: 123.8556925, latitude: 9.6992916 },
    barangay: "Manga",
    directionsUrl: osmDirections(123.8556925, 9.6992916),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Manga Fish Port map feature", "relation", 18175784),
    ],
  }),
  registerPlace({
    slug: "tagbilaran-city-friendship-park",
    name: "Tagbilaran City Friendship Park",
    category: "outdoors",
    summary:
      "A public-park listing mapped in Bool beside the Blood Compact area. Current facilities, access conditions, and visitor guidance require local confirmation.",
    coordinates: { longitude: 123.8788215, latitude: 9.6272084 },
    barangay: "Bool",
    directionsUrl: osmDirections(123.8788215, 9.6272084),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Tagbilaran City Friendship Park map feature", "way", 242249007),
    ],
  }),
  registerPlace({
    slug: "sandugo-festival",
    name: "Sandugo Festival",
    category: "event",
    summary:
      "A festival entry connected to Bohol’s Sandugo commemoration. No current schedule, route, venue, price, or accessibility information is published here; consult an official annual announcement before planning a visit.",
    features: ["Seasonal event", "Schedule and venue intentionally withheld"],
    sources: [stakeholderRegisterSource, cityWebsiteAuditSource],
  }),
  registerPlace({
    slug: "saulog-tagbilaran",
    name: "Saulog Tagbilaran",
    category: "event",
    summary:
      "A Tagbilaran celebration described by the City Government through faith, performances, street activity, food, arts, and community events. Programs change by year, so no past schedule is presented as current.",
    features: ["City Government event coverage reviewed", "Annual program requires a fresh check"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Saulog Tagbilaran 2023 grand launching",
        url: "https://tagbilaran.gov.ph/2023/03/20/saulog-tagbilaran-2023-grand-launching-and-the-458th-blood-compact-commemoration-the-blood-compact-between-the-bol-anon-datu-sikatuna-and-the-spanish-general-miguel-lopez-de-legazpi/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Used only for the celebration overview; the 2023 program is not treated as current.",
      },
      {
        title: "Saulog 2026 launching day",
        url: "https://tagbilaran.gov.ph/2026/03/16/saulog-2026-launching-day/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "Confirms continuing official coverage; no expired schedule is republished.",
      },
    ],
    verificationStatus: "source-reviewed",
  }),
  registerPlace({
    slug: "tagbilaran-city-port",
    name: "Tagbilaran City Port",
    category: "visitor-essential",
    summary:
      "Tagbilaran’s mapped port area and a key city arrival point. Ferry schedules, fares, terminal assignments, ground transport, contacts, and access conditions are time-sensitive and intentionally withheld.",
    coordinates: { longitude: 123.8465308, latitude: 9.6498888 },
    barangay: "Poblacion 2",
    directionsUrl: osmDirections(123.8465308, 9.6498888),
    features: ["City arrival reference", "Schedules and fares intentionally withheld"],
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Port of Tagbilaran map feature", "relation", 13938930),
    ],
  }),
  registerPlace({
    slug: "bohol-provincial-capitol",
    name: "Bohol Provincial Capitol",
    category: "visitor-essential",
    summary:
      "A provincial government reference point mapped in Tagbilaran. Office directories, public services, contacts, hours, and access arrangements require confirmation from the Provincial Government.",
    coordinates: { longitude: 123.8598247, latitude: 9.6591546 },
    address: "Lino Chatto Drive, Tagbilaran City, Bohol 6300",
    directionsUrl: osmDirections(123.8598247, 9.6591546),
    sources: [
      stakeholderRegisterSource,
      cityWebsiteAuditSource,
      osmSource("Bohol Provincial Capitol Building map feature", "way", 603971128),
    ],
  }),
  registerPlace({
    slug: "tagbilaran-tourist-information-center",
    name: "Tagbilaran City Tourist Information Center",
    category: "visitor-essential",
    summary:
      "A stakeholder-selected visitor-information entry. A 2023 City Government post confirms a City Tourism Information Center, but its current public location, services, hours, and contacts need direct confirmation.",
    features: ["City Government mention reviewed", "Current public location needs confirmation"],
    sources: [
      stakeholderRegisterSource,
      {
        title: "Congratulations Tagbilaran City!",
        url: "https://tagbilaran.gov.ph/2023/01/27/congratulations-tagbilaran-city/",
        publisher: "City Government of Tagbilaran",
        accessedAt,
        notes: "The official post mentions an event at the City Tourism Information Center.",
      },
    ],
  }),
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
