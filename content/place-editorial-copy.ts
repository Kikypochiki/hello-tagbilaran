import type { Place, SourceRecord } from "@/types/content";

export const editorialCopyByPlace = {
  "blood-compact-shrine": {
    summary:
      "Napoleon Abueva's bronze Sandugo tableau overlooks the Bool coast, marking the remembered 1565 encounter between Datu Sikatuna and Miguel López de Legazpi.",
    story:
      "The monument gathers five bronze figures around a ceremonial cup above the coast of Bool. It is Tagbilaran's best-known memorial to the 1565 Sandugo, but the scene also opens a larger conversation about diplomacy, commemoration, and the colonial period that followed.",
  },
  "national-museum-bohol": {
    summary:
      "Inside the restored former Provincial Capitol, this regional museum connects Bohol's archaeology, geology, biodiversity, built heritage, and changing cultural exhibitions.",
    story:
      "The National Museum of the Philippines - Bohol occupies the former Provincial Capitol, a civic landmark built between 1855 and 1860 and restored after the 2013 earthquake. Its galleries place the island's geological and paleontological story beside archaeology, natural history, and Boholano cultural heritage.",
  },
  "plaza-rizal": {
    summary:
      "Tagbilaran's central plaza is the open-air hinge between the cathedral, National Museum, city hall area, and the traditional downtown street grid.",
    story:
      "Plaza Jose P. Rizal gives the historic civic core a shared front garden. From its paths, visitors can read the cathedral, former Provincial Capitol, government buildings, and downtown streets as one connected urban ensemble rather than isolated landmarks.",
  },
  "carlos-p-garcia-heritage-museum": {
    summary:
      "This nationally recognized heritage house preserves Tagbilaran's connection to Carlos P. Garcia, Boholano statesman and the Philippines' eighth president.",
    story:
      "The Garcia house brings national political history into the scale of a family residence. Declared a Heritage House by the National Historical Institute in 2009, it anchors the memory of Carlos P. Garcia within the same central district as the museum, plaza, and cathedral.",
  },
  "st-joseph-cathedral": {
    summary:
      "The cathedral shrine is the Diocese of Tagbilaran's principal church, with its stone frontage and bell tower defining one side of Plaza Rizal.",
    story:
      "St. Joseph the Worker Cathedral is both an active place of worship and a central piece of Tagbilaran's civic landscape. Its relationship with Plaza Rizal and the former Provincial Capitol makes the precinct one of the clearest places to understand how faith, government, and public space shaped the city center.",
  },
  "our-lady-of-lourdes-parish": {
    summary:
      "A downtown parish that grew from a Knights of Columbus clubhouse into a full parish community serving the streets north of the civic core.",
    story:
      "The parish traces its beginnings to a modest Knights of Columbus clubhouse established in 1955 and its development into a parish in the 1990s. Today it adds a living neighborhood church to a walk through Poblacion II, close to downtown commerce and the port-facing side of the city.",
  },
  "birhen-sa-barangay-parish": {
    summary:
      "This Cogon shrine-parish pairs a broad, radial worship space with an active Catholic community beyond Tagbilaran's older cathedral precinct.",
    story:
      "Birhen sa Barangay Shrine Parish is listed by the Diocese of Tagbilaran within the Saint Joseph the Worker Vicariate. Its expansive interior and distinctive radial ceiling make the experience different from the historic stone churches of the civic core.",
  },
  "immaculate-heart-of-mary-parish": {
    summary:
      "A Marian parish in Taloto that brings the guide into Tagbilaran's northern neighborhoods and the Immaculate Heart of Mary vicariate community.",
    story:
      "Immaculate Heart of Mary Parish serves Taloto from the northern side of the city. It is best understood as a living neighborhood church, complementing the guide's heritage landmarks with the everyday parish life of present-day Tagbilaran.",
  },
  "chido-cafe": {
    summary:
      "A relaxed, sea-facing café in Bool that works naturally into a visit to the Sandugo monument and the surrounding heritage waterfront.",
    story:
      "Chido Cafe offers a broad café menu from a dining space facing the water in Bool. Its strongest advantage is location: it gives visitors a comfortable pause before or after the Blood Compact Monument, Friendship Park, and other stops along the southern coastal approach.",
  },
  "gerardas-family-restaurant": {
    summary:
      "Traditional Filipino dishes are served family-style inside a converted house whose photographs and domestic details keep the atmosphere personal.",
    story:
      "Gerarda's Place turns a family house on J. S. Torralba Street into a warm dining room for Filipino cooking. The home-like setting, family photographs, and shareable dishes make it a stronger introduction to local hospitality than a generic restaurant stop.",
  },
  "al-fresco-bay-cafe-restobar": {
    summary:
      "An Italian-focused restaurant on G. Visarra Street known for pizza, pasta, and an easygoing open-air setting near the port-facing side of downtown.",
    story:
      "Al Fresco Bay brings Italian cooking and outdoor dining into Poblacion II's compact restaurant cluster. It is a practical evening stop for visitors staying near the port or exploring the downtown streets, with pizza and pasta giving the listing a clear identity in the city's dining mix.",
  },
  "red-house-city-taiwan-shabu-shabu": {
    summary:
      "A Taiwanese-style hot-pot restaurant in Dampas where broth, sliced ingredients, and table cooking make the meal a shared, interactive experience.",
    story:
      "Red House City centers the meal on shabu-shabu rather than a conventional plated menu. Its spacious hot-pot format suits families and groups looking for a longer shared meal near Tagbilaran's northern commercial corridor.",
  },
  "just-sizzlin-resto": {
    summary:
      "A casual Poblacion I restaurant built around sizzling-plate meals, close to cafés and the eastern edge of Tagbilaran's downtown core.",
    story:
      "Just Sizzlin' gives its name and menu format equal weight, with hot plates shaping the sound and pace of the meal. Its P. Del Rosario Street location makes it easy to include in a central-city food crawl without pulling visitors away from the civic and shopping districts.",
  },
  "smoque-bistro": {
    summary:
      "A meat-focused bistro and laid-back steakhouse in Bool, serving a more polished dinner experience near the city's southern heritage corridor.",
    story:
      "SMOQUE Bistro has operated in Tagbilaran since 2017 under a relaxed steakhouse and lounge concept. Its focus on grilled and smoked meats, open-kitchen energy, and evening atmosphere offers a distinct counterpoint to the nearby cafés and family restaurants.",
  },
  "garden-cafe": {
    summary:
      "A Tagbilaran institution since 1983, Garden Café pairs Filipino and international comfort food with employment and education support for Bohol's Deaf community.",
    story:
      "Garden Café sits in the historic district near Plaza Rizal and the cathedral, but its social mission is what makes it essential. Many employees are Deaf, and the enterprise supports Deaf education and livelihood programs, turning a meal into a direct connection with a long-running Boholano institution.",
  },
  "punjabi-rasoi": {
    summary:
      "A North Indian restaurant in Cogon that broadens Tagbilaran's dining map with curries, breads, rice dishes, and a cuisine uncommon in the city center.",
    story:
      "Punjabi Rasoi adds a clearly defined North Indian option to the city's restaurant mix. Its Cogon location makes it useful for visitors staying around the port-side and northern downtown districts who want a meal beyond Filipino, café, or mall dining.",
  },
  "crave-cafe-bohol": {
    summary:
      "A contemporary neighborhood café in Cogon suited to coffee, a casual meal, or a slower pause away from the busiest downtown blocks.",
    story:
      "Crave Cafe Bohol represents the smaller, everyday café culture that has grown through Tagbilaran's neighborhoods. Rather than functioning as a landmark, it works as a practical place to pause while moving between Cogon, the port-side streets, and the city center.",
  },
  "bark-coffee": {
    summary:
      "A specialty-coffee stop along the Mansasa approach, bringing a focused café experience to the southern side of Tagbilaran.",
    story:
      "Bark Coffee sits outside the denser downtown café cluster and gives Mansasa its own coffee destination. Its roadside position makes it especially useful for travelers entering the city from the south or pairing coffee with stops around Bool and Mansasa.",
  },
  "tamper-coffee-brunch": {
    summary:
      "Tamper's main Tagbilaran branch pairs carefully prepared coffee with a full brunch menu at the corner of P. Del Rosario Street and CPG East Avenue.",
    story:
      "Tamper Coffee & Brunch is designed for more than a quick espresso, with food and drinks sharing equal space on the menu. The bright Poblacion I café works well for breakfast, brunch, or a long mid-day pause close to restaurants, heritage stops, and downtown streets.",
  },
  "mosia-cafe": {
    summary:
      "A small Mansasa garden café known for artisanal cakes, homemade ice cream, low-waste practices, and an animal-rescue advocacy woven into the business.",
    story:
      "Mosia Cafe has built its identity around small-batch desserts, coffee, and a quieter plant-filled setting. The café also supports stray-animal care and promotes lower-waste service, giving the stop a purpose that extends beyond its cakes and homemade ice cream.",
  },
  "kew-hotel": {
    summary:
      "A full-service hotel opposite Tagbilaran City Hall, with 59 rooms and function spaces near Island City Mall and the northern commercial corridor.",
    story:
      "Kew Hotel is positioned for travelers who want city access, meeting facilities, and a conventional full-service stay. Its location across from City Hall and close to Island City Mall makes it more practical for business, events, and urban errands than for a secluded resort experience.",
  },
  "ocean-suites": {
    summary:
      "A boutique hotel on Bool's elevated coast, combining sea-facing rooms with immediate access to the Sandugo monument and Friendship Park.",
    story:
      "Ocean Suites uses its hillside position to face the water from the southern edge of Tagbilaran. It suits visitors who want a quieter hotel setting while remaining close to Bool's heritage waterfront, cafés, and the road toward Panglao.",
  },
  "belian-hotel": {
    summary:
      "A modern, budget-conscious city hotel on Graham Avenue, positioned close to Tagbilaran's seaport and central business district.",
    story:
      "Belian Hotel is designed as a practical base for ferry passengers, business travelers, and short city stays. Its 49-room property sits near the port, while downtown shopping, dining, and the civic core remain a short trip away.",
  },
  "kasagpan-resort": {
    summary:
      "Named for the local word for sunset, this Booy cliffside resort has two pools and a broad western view across the sea.",
    story:
      "Kasagpan Resort turns Tagbilaran's western coast into the main experience. The name refers to sunset in the local Bohol language, and the cliffside grounds, sea-facing rooms, and two pools are arranged around that late-afternoon view.",
  },
  "bohol-ecotel": {
    summary:
      "A compact Poblacion III stay whose name combines economy and eco-friendly intent, within easy reach of Tagbilaran's historic and commercial center.",
    story:
      "Bohol Ecotel was conceived as a clean, secure, reasonably priced city accommodation with an environmental and social-responsibility focus. Its Hontanosas Street location works well for travelers who prefer a smaller property near the museum, government district, dining, and shopping.",
  },
  "travelbee-seaside-inn": {
    summary:
      "A straightforward city inn near the seaport, suited to ferry-linked stopovers and travelers who want the downtown waterfront within easy reach.",
    story:
      "Travelbee Seaside Inn prioritizes location over resort-style seclusion. From its Poblacion II setting, guests are close to the port, central waterfront streets, local malls, and the compact civic district, making it a practical base for short Tagbilaran stays.",
  },
  "dao-diamond-hotel-restaurant": {
    summary:
      "A garden-set hotel and restaurant in Dao whose operations create jobs and help support education for Deaf people in Bohol and Leyte.",
    story:
      "Dao Diamond is owned and operated by Bohol Dine and Sign in partnership with IDEA Philippines. Many staff members are Deaf, and the hotel helps fund Deaf education, giving its rooms, restaurant, pool, and garden setting a social purpose rooted in the local community.",
  },
  "island-city-mall": {
    summary:
      "Opened in 2004, this home-grown Dao mall combines shopping, supermarket essentials, dining, cinemas, games, services, and a busy calendar of community events.",
    story:
      "Island City Mall is the Alturas Group's flagship retail destination and one of Tagbilaran's major everyday gathering places. Its mix of shops, food, cinema, entertainment, and services makes it useful to residents and visitors, while regular events keep the building active beyond routine errands.",
  },
  "bq-mall": {
    summary:
      "A locally rooted downtown mall from a Bohol company serving the province since 1945, close to Plaza Rizal and the traditional commercial core.",
    story:
      "Bohol Quality Mall is woven into the center of Tagbilaran rather than set apart on a suburban site. Its department-store, dining, and service mix gives visitors a practical stop, while the Bohol Quality name connects the mall to a local retail history dating to 1945.",
  },
  "alturas-mall-tagbilaran": {
    summary:
      "A long-established home-grown department store in the dense downtown retail block, useful for groceries, household needs, and everyday city shopping.",
    story:
      "Alturas Mall belongs to the traditional commercial fabric of Poblacion II. It is less a destination spectacle than an everyday downtown anchor, surrounded by local businesses, transport activity, neighboring malls, and the streets that generations of Tagbilaran shoppers use.",
  },
  "galleria-luisa-mall": {
    summary:
      "A compact Bohol Quality shopping center in Poblacion II, positioned between the port-facing streets and Tagbilaran's walkable civic core.",
    story:
      "Galleria Luisa offers a smaller-scale downtown alternative to the city's larger malls. Its place within the Bohol Quality group and its central location make it useful for quick shopping while exploring Poblacion II, the port side, and nearby heritage streets.",
  },
  "tagbilaran-city-square": {
    summary:
      "A compact downtown shopping center within the BQ and Alturas retail cluster, placing everyday stores close to the historic city center.",
    story:
      "Tagbilaran City Square sits inside one of the densest retail blocks in the city. Its value is the surrounding urban context: BQ Mall, Alturas, local storefronts, transport routes, and Plaza Rizal are all part of the same downtown sequence.",
  },
  "tagbilaran-city-central-public-market": {
    summary:
      "A working Dampas market where produce, food, household goods, and small local businesses reveal the practical rhythms of daily Tagbilaran life.",
    story:
      "The City Central Public Market is not staged as a visitor attraction. It is an active place of trade where residents buy daily needs and small vendors sustain local commerce, making it one of the guide's clearest windows into how the city works beyond monuments and malls.",
  },
  "barangay-manga-public-market": {
    summary:
      "A neighborhood market serving Manga's northern coastal community, closely tied to residential streets and the nearby fish-port economy.",
    story:
      "Barangay Manga Public Market keeps everyday trade close to the community it serves. Its relationship with the fish port and northern coastal neighborhoods gives visitors a more local-scale market experience than the larger central market in Dampas.",
  },
  "cpg-park": {
    summary:
      "A waterfront public park for walking, jogging, informal gatherings, and unhurried views across Tagbilaran's coastal edge.",
    story:
      "President Carlos P. Garcia Park gives the city a simple public place to move, rest, and meet beside the water. It is best approached as part of everyday Tagbilaran rather than a formal attraction, especially in the cooler hours when residents use the waterfront.",
  },
  "tagbilaran-city-friendship-park": {
    summary:
      "A landscaped Bool waterfront park with an amphitheater, viewing deck, ancient well, and heroes park beside the Sandugo monument.",
    story:
      "Friendship Park expands the Blood Compact stop into a broader public landscape. Its amphitheater, viewing deck, well, and heroes park support cultural events and everyday recreation, allowing visitors to spend time with the coast rather than treating the monument as a quick photo stop.",
  },
  "banat-i-hill": {
    summary:
      "Tagbilaran's 145-meter southern landmark offers an elevated view of the city's coastal form and is being considered for protection as an urban biodiversity zone.",
    story:
      "Banat-i is one of the two hills that define Tagbilaran's natural spine, rising on the southern edge of the city. The city has sought biodiversity-zone protection for the hill, so any visit should respect the landscape and begin with a current local check on access and trail conditions.",
  },
  "manga-fish-port": {
    summary:
      "A working northern landing place for fishing boats and cargo, central to current plans for strengthening Bohol's fish supply and cold-chain facilities.",
    story:
      "Manga Fish Port shows the city as a working coast. Fishing boats, traders, and cargo activity use the landing area, while a proposed modern fish-port project aims to add trading, cold-storage, repair, and support facilities. Visitors should keep access routes clear and treat the site as a workplace.",
  },
} satisfies Record<string, Pick<Place, "summary" | "story">>;

function editorialSource(
  title: string,
  url: string,
  publisher: string,
  notes: string,
): SourceRecord {
  return {
    title,
    url,
    publisher,
    accessedAt: "2026-07-26",
    notes,
  };
}

export const researchedPlaceSources: Partial<Record<string, SourceRecord[]>> = {
  "carlos-p-garcia-heritage-museum": [
    editorialSource(
      "Carlos P. Garcia House",
      "https://philhistoricsites.nhcp.gov.ph/registry_database/carlos-p-garcia-house/",
      "National Historical Commission of the Philippines",
      "Official registry record used to verify the property's Heritage House designation.",
    ),
  ],
  "our-lady-of-lourdes-parish": [
    editorialSource(
      "Our Lady of Lourdes Parish history",
      "https://ollpclinic.com/about/",
      "Our Lady of Lourdes Parish",
      "Parish source used for the community's development from a Knights of Columbus clubhouse.",
    ),
  ],
  "birhen-sa-barangay-parish": [
    editorialSource(
      "Vicariates and parishes",
      "https://www.rcdt.ph/",
      "Roman Catholic Diocese of Tagbilaran",
      "Official diocesan directory used to verify the Cogon shrine-parish.",
    ),
  ],
  "immaculate-heart-of-mary-parish": [
    editorialSource(
      "Vicariates and parishes",
      "https://www.rcdt.ph/",
      "Roman Catholic Diocese of Tagbilaran",
      "Official diocesan directory used to verify the Taloto parish.",
    ),
  ],
  "smoque-bistro": [
    editorialSource(
      "About SMOQUE Bistro",
      "https://smoquebistro.com/",
      "SMOQUE Bistro",
      "Official business site used for the restaurant concept and 2017 opening.",
    ),
  ],
  "garden-cafe": [
    editorialSource(
      "Garden Café Tagbilaran",
      "https://gardencafetagbilaran.com/",
      "Garden Café Tagbilaran",
      "Official business site used for its 1983 opening and Deaf education and employment mission.",
    ),
  ],
  "tamper-coffee-brunch": [
    editorialSource(
      "Tamper Coffee & Brunch",
      "https://tamper.ph/",
      "Tamper Coffee & Brunch",
      "Official business site used for the main-branch location and coffee-and-brunch concept.",
    ),
  ],
  "mosia-cafe": [
    editorialSource(
      "Mosia Cafe in Bohol",
      "https://primer.com.ph/food/restaurant-type/bakery-and-sweets/mosia-cafe/",
      "Philippine Primer",
      "Feature used for the café's artisanal desserts, low-waste practices, and animal-rescue advocacy.",
    ),
  ],
  "ocean-suites": [
    editorialSource(
      "Ocean Suites Bohol Boutique Hotel",
      "https://www.oceansuitesbohol.com/the-hotel",
      "Ocean Suites Bohol",
      "Official property site used to verify the Bool location and boutique-hotel identity.",
    ),
  ],
  "belian-hotel": [
    editorialSource(
      "Explore Belian Hotel",
      "https://www.belianhotel.com/explore-belian",
      "Belian Hotel",
      "Official property site used for the port-side location, room count, and traveler positioning.",
    ),
  ],
  "bohol-ecotel": [
    editorialSource(
      "About Bohol Ecotel",
      "https://boholecotel.com/about/",
      "Bohol Ecotel",
      "Official property site used for the economy and eco-friendly accommodation concept.",
    ),
  ],
  "dao-diamond-hotel-restaurant": [
    editorialSource(
      "About Dao Diamond Hotel",
      "https://daodiamond.com/about-us/",
      "Dao Diamond Hotel",
      "Official property site used for its Deaf employment and education mission.",
    ),
  ],
  "bq-mall": [
    editorialSource(
      "Bohol Quality",
      "https://boholquality.com/",
      "Bohol Quality Corporation",
      "Official company site used for the locally rooted retail history dating to 1945.",
    ),
  ],
  "tagbilaran-city-friendship-park": [
    editorialSource(
      "Friendship Park amphitheater naming ordinance",
      "https://sp.tagbilaran.gov.ph/2023/07/17/15th-sp-names-friendhsip-park-amphitheater-as-atty-zoilo-d-dejaresco-jr-amphitheater/",
      "Sangguniang Panlungsod of Tagbilaran",
      "Official city source used for the park's amphitheater, viewing deck, ancient well, and heroes park.",
    ),
  ],
  "banat-i-hill": [
    editorialSource(
      "Location and geography",
      "https://tagbilaran.gov.ph/location-geography/",
      "City Government of Tagbilaran",
      "Official city source used for Banat-i's elevation and role in the city's natural form.",
    ),
    editorialSource(
      "Tagbilaran seeks urban biodiversity protection for Banat-i and Elly Hills",
      "https://pia.gov.ph/news/tagbilaran-city-seeks-to-declare-banat-i-elly-hills-as-urban-biodiversity-zones/",
      "Philippine Information Agency",
      "Government news source used for the proposed urban biodiversity-zone protection.",
    ),
  ],
  "manga-fish-port": [
    editorialSource(
      "Bohol to build modern fish port",
      "https://pia.gov.ph/news/bohol-to-build-modern-fish-port-in-bid-to-stabilize-fish-supply/",
      "Philippine Information Agency",
      "Government news source used for the port's fisheries role and approved modernization proposal.",
    ),
  ],
};
