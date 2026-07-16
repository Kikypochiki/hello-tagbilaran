import type { HistoryChapter } from "@/types/content";

const cityHistorySource = {
  title: "History",
  url: "https://tagbilaran.gov.ph/history/",
  publisher: "City Government of Tagbilaran",
  accessedAt: "2026-07-16",
  notes:
    "Official city history used for this prototype synthesis. Final editorial review should corroborate contested interpretations, terminology, and chronology against the page’s listed primary references.",
};

export const historyChapters: HistoryChapter[] = [
  {
    id: "coast-and-current",
    order: 1,
    eyebrow: "Chapter one · coast and current",
    title: "A settlement shaped by the shore",
    dateLabel: "Before the town · chronology under review",
    introduction:
      "Tagbilaran’s published city history places early settlement near lower Mansasa and describes a community connected to regional trade by sea.",
    body: [
      "The same account traces a later coastal community at Sitio Ubos, behind the present cathedral compound, where trade and daily activity gathered close to the water before development spread inland.",
      "The origin of the city’s name remains uncertain. The city history records Tinabilan and Tagubilaan as traditions rather than a settled etymology—an uncertainty this journal keeps visible.",
    ],
    media: [],
    annotations: [
      {
        label: "Source note",
        text: "The city’s account should be read alongside archaeological and community sources in the final edition.",
      },
    ],
    sources: [cityHistorySource],
  },
  {
    id: "sandugo-and-friendship",
    order: 2,
    eyebrow: "Chapter two · encounter and memory",
    title: "Sandugo, retold with care",
    dateLabel: "16 March 1565 · city history account",
    introduction:
      "The City Government’s history locates the meeting associated with the Blood Compact on the coast of Bool, now a district of Tagbilaran.",
    body: [
      "Its account describes Datu Sikatuna and Miguel López de Legazpi sealing an agreement through the ritual now remembered as Sandugo, and frames the event through the language of friendship.",
      "That familiar civic meaning is one layer of a more complex colonial encounter. A final edition should place the city’s account beside Indigenous, Philippine, and Spanish sources and identify where interpretations differ.",
    ],
    media: [],
    annotations: [
      {
        label: "Editorial check",
        text: "Retain the city’s commemorative context without turning one interpretation into the only account.",
      },
    ],
    sources: [cityHistorySource],
  },
  {
    id: "streets-of-stone",
    order: 3,
    eyebrow: "Chapter three · a town takes shape",
    title: "From port settlement to town",
    dateLabel: "1741–1742",
    introduction:
      "In 1741, Jesuit rector César Felipe Doria petitioned for Baclayon to be divided and proposed Mansasa or Tagbilaran as the site of a new town.",
    body: [
      "The city history describes Tagbilaran as a populated trading port visited by Chinese junks and other vessels. It also records the colonial priorities behind the petition: church administration, tribute, security, and control.",
      "After a sequence of inspections and decrees, officials for San José de Tagbilaran were elected in Baclayon and installed at Tagbilaran in July 1742. The account says the new town’s boundary was confirmed at the same time.",
    ],
    media: [],
    annotations: [
      {
        label: "Read the record",
        text: "The official history preserves the administrative sequence and also points to resistance outside Spanish control.",
      },
    ],
    sources: [cityHistorySource],
  },
  {
    id: "repair-and-cityhood",
    order: 4,
    eyebrow: "Chapter four · plans and rebuilding",
    title: "The long road to cityhood",
    dateLabel: "1899–1966",
    introduction:
      "The city’s account follows Tagbilaran from civil government after Spanish rule through town planning, wartime loss, postwar rebuilding, and a two-stage campaign for a city charter.",
    body: [
      "It credits the 1913–1916 administration of Celestino Gallares with a town plan whose street pattern continued to guide development, and remembers the Battle of Ubujan as part of Tagbilaran’s wartime history.",
      "Republic Act No. 4660 was signed in June 1966, and Tagbilaran began its life as a chartered city on 1 July 1966. The final journal will deepen this civic timeline with residents’ accounts of war, work, and rebuilding.",
    ],
    media: [],
    annotations: [
      {
        label: "Listening note",
        text: "Oral histories require consent, attribution, transcript review, and space for more than one generation’s memory.",
      },
    ],
    sources: [cityHistorySource],
  },
  {
    id: "city-in-motion",
    order: 5,
    eyebrow: "Chapter five · living city",
    title: "Tagbilaran, in the present tense",
    dateLabel: "Today · local reporting planned",
    introduction:
      "The official history describes postwar Tagbilaran as a center of learning; the city’s present-day story reaches further into the everyday life of its streets.",
    body: [
      "Markets, schools, tricycles, cafés, festivals, and the waterfront will bring the journal into the present through locally commissioned reporting and photography.",
      "This final chapter remains deliberately open: a city is not only its milestones, but the routines, choices, and voices continually making it anew.",
    ],
    media: [],
    annotations: [
      {
        label: "Open notebook",
        text: "Contemporary claims and lived experience still need interviews, consent, credits, and on-the-ground verification.",
      },
    ],
    sources: [cityHistorySource],
  },
];
