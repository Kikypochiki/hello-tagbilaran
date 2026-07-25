import type { HistoryChapter, ImageAsset, SourceRecord } from "@/types/content";

const accessedAt = "2026-07-17";

const cityHistorySource: SourceRecord = {
  title: "History of Tagbilaran",
  url: "https://tagbilaran.gov.ph/history/",
  publisher: "City Government of Tagbilaran",
  accessedAt,
  notes:
    "Official city history used for the chronology, with uncertainty retained where the city record presents more than one interpretation.",
};

const cityGeographySource: SourceRecord = {
  title: "Location and geography",
  url: "https://tagbilaran.gov.ph/location-geography/",
  publisher: "City Government of Tagbilaran",
  accessedAt,
  notes: "Official city page used for present-day geographic and civic context.",
};

const provincialTourismSource: SourceRecord = {
  title: "Tagbilaran City",
  url: "https://tourism.bohol.gov.ph/visitbohol-tagbilaran/",
  publisher: "Bohol Provincial Tourism Office",
  accessedAt,
  notes:
    "Official provincial tourism page used for the cathedral and central civic-core context.",
};

const nationalMuseumSource: SourceRecord = {
  title: "National Museum of the Philippines - Bohol",
  url: "https://www.nationalmuseum.gov.ph/our-museums/regional-area-and-site-museums/bohol/",
  publisher: "National Museum of the Philippines",
  accessedAt,
  notes:
    "Official museum history used for the former Provincial Capitol and its restoration.",
};

const cityCharterSource: SourceRecord = {
  title: "Republic Act No. 4660",
  url: "https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/6781",
  publisher: "Supreme Court E-Library",
  accessedAt,
  notes: "Full text of the law creating the City of Tagbilaran, approved 18 June 1966.",
};

function storyImage(image: ImageAsset): ImageAsset {
  return {
    ...image,
    src: `/images/story/${image.src}`,
  };
}

export const historyChapters: HistoryChapter[] = [
  {
    id: "coast-and-current",
    visualMode: "coastal-chart",
    order: 1,
    eyebrow: "Chapter one · coast and current",
    title: "A settlement shaped by the shore",
    dateLabel: "Before the town · an origin with more than one telling",
    introduction:
      "Tagbilaran’s published city history places an early settlement near lower Mansasa and describes communities whose lives and trade were oriented toward the sea.",
    body: [
      "The account later locates a coastal community at Sitio Ubos, behind the present cathedral compound. Houses of bamboo, hardwood, nipa, limestone, and brick gathered near a harbor where mercantile and everyday activity took place before the settlement spread inland.",
      "The city’s name does not have one settled origin story. The official history records both Tinabilan, associated with being screened or sheltered, and Tagubilaan, a name preserved through local tradition. This journal leaves that uncertainty visible.",
    ],
    media: [
      storyImage({
        src: "tagbilaran-port-2009.webp",
        alt: "Passengers boarding a ferry at the Port of Tagbilaran",
        width: 1920,
        height: 1440,
        credit: "Mats Sjödin",
        rights: "CC BY 3.0",
        date: "2009",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:The_pier_at_Tagbilaran_port_-_panoramio.jpg",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
      }),
    ],
    annotations: [
      {
        label: "Name note",
        text: "The two name traditions are recorded accounts, not a resolved etymology.",
      },
    ],
    sources: [cityHistorySource, cityGeographySource],
  },
  {
    id: "sandugo-and-friendship",
    visualMode: "memory-folio",
    order: 2,
    eyebrow: "Chapter two · encounter and memory",
    title: "Sandugo, retold with care",
    dateLabel: "16 March 1565 · Bool",
    introduction:
      "The City Government’s history places the meeting associated with the Blood Compact on the coast of Bool, now a district of Tagbilaran.",
    body: [
      "Its account describes Datu Sikatuna and Miguel López de Legazpi sealing an agreement through the blood-compact ritual now remembered as Sandugo. The monument at Bool gives that civic memory a prominent place on the city’s waterfront.",
      "The familiar language of friendship is one layer of a colonial encounter. Reading the event carefully means recognizing both its role in Bohol’s public memory and the unequal history that followed Spanish arrival.",
    ],
    media: [
      storyImage({
        src: "sandugo-reenactment-2009.webp",
        alt: "A 2009 reenactment of the Sandugo ceremony in Tagbilaran",
        width: 540,
        height: 720,
        credit: "ControlFreakMe",
        rights: "CC BY-SA 3.0",
        date: "2009",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sandugo_Reenactment.jpg",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      }),
    ],
    annotations: [
      {
        label: "Context note",
        text: "Commemoration and critical historical reading can sit on the same page.",
      },
    ],
    sources: [cityHistorySource],
  },
  {
    id: "streets-of-stone",
    visualMode: "town-ledger",
    order: 3,
    eyebrow: "Chapter three · a town takes shape",
    title: "From port settlement to town",
    dateLabel: "1741-1742",
    introduction:
      "In 1741, Jesuit rector César Felipe Doria petitioned for Baclayon to be divided and proposed Mansasa or Tagbilaran as the site of a new town.",
    body: [
      "The city history describes Tagbilaran as a populated trading port visited by Chinese junks and other vessels. It also records the colonial priorities behind the petition: church administration, tribute, security, and territorial control.",
      "Officials for San José de Tagbilaran were elected in Baclayon on 4 July 1742 and installed at Tagbilaran on 11 July. The same account records the confirmation of the new town’s boundary and a tax census organized into six family groupings.",
    ],
    media: [
      storyImage({
        src: "tagbilaran-cathedral-2019.webp",
        alt: "St. Joseph the Worker Cathedral in Tagbilaran City",
        width: 1920,
        height: 1440,
        credit: "Bengoeswhere",
        rights: "CC BY-SA 4.0",
        date: "2019",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tagbilaran_cathedral_Bohol.jpg",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      }),
    ],
    annotations: [
      {
        label: "Town record",
        text: "The administrative sequence also reveals who colonial government sought to count, tax, and control.",
      },
    ],
    sources: [cityHistorySource, provincialTourismSource],
  },
  {
    id: "repair-and-cityhood",
    visualMode: "mended-archive",
    order: 4,
    eyebrow: "Chapter four · plans and rebuilding",
    title: "The long road to cityhood",
    dateLabel: "1899-1966",
    introduction:
      "Tagbilaran’s official account follows the town from civil government after Spanish rule through planning, wartime loss, postwar rebuilding, and two campaigns for a city charter.",
    body: [
      "The record credits the 1913-1916 administration of Celestino Gallares with a town plan whose street pattern continued to guide development. The former Provincial Capitol, begun in 1855, completed in 1860, and later restored as the National Museum Bohol, embodies another long layer of civic history.",
      "Republic Act No. 4660, approved on 18 June 1966, created the City of Tagbilaran. Under the charter, the city began its corporate existence on 1 July 1966.",
    ],
    media: [
      storyImage({
        src: "tagbilaran-street-1970.webp",
        alt: "Motorized tricycles on a Tagbilaran street in 1970",
        width: 1920,
        height: 1261,
        credit: "Urbain J. Kinet / UC Berkeley Department of Geography",
        rights: "No known copyright restrictions",
        date: "1970",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tagbilaran_City_typical_street_scene_70s.jpg",
        licenseUrl: "https://www.flickr.com/commons/usage/",
      }),
    ],
    annotations: [
      {
        label: "City charter",
        text: "The law was approved on 18 June; Tagbilaran’s chartered-city life began on 1 July 1966.",
      },
    ],
    sources: [cityHistorySource, nationalMuseumSource, cityCharterSource],
  },
  {
    id: "city-in-motion",
    visualMode: "city-contact-sheet",
    order: 5,
    eyebrow: "Chapter five · living city",
    title: "Tagbilaran, in the present tense",
    dateLabel: "Today · Bohol’s capital city",
    introduction:
      "Tagbilaran is Bohol’s capital and a component city whose story is visible not only in monuments, but in the ordinary movement between waterfront, plaza, parish, school, market, and neighborhood.",
    body: [
      "The compact civic core brings Plaza Rizal, the cathedral, and the former Provincial Capitol within the same walkable district. Beyond it, public markets, local malls, cafés, hotels, parish churches, parks, and the working coast connect the city’s 15 barangays.",
      "That everyday city is the point of this guide: Tagbilaran is not simply a transfer point for somewhere else. Its history continues in the routines, businesses, faith communities, and public spaces that residents make and remake each day.",
    ],
    media: [
      storyImage({
        src: "saulog-festival-2019.webp",
        alt: "Performers during the 2019 Saulog Festival in Tagbilaran City",
        width: 1920,
        height: 1280,
        credit: "Herbertkikoy",
        rights: "CC BY-SA 4.0",
        date: "2019",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Humans_of_Saulog.jpg",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      }),
    ],
    annotations: [
      {
        label: "Everyday city",
        text: "The map that follows keeps heritage landmarks beside the places used in daily city life.",
      },
    ],
    sources: [cityGeographySource, provincialTourismSource],
  },
];
