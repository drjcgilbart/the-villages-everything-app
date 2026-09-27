"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Outing = {
  id: string;
  name: string;
  drive: string;
  who: string;
  blurb: string;
  more: string;
  tips: string[];
  query: string;
  image: string;
  site?: { href: string; label: string };
};

type Group = {
  id: string;
  title: string;
  image: string;
  lead: string;
  places: Outing[];
};

const GROUPS: Group[] = [
  {
    id: "springs",
    title: "Springs and clear water",
    image: "/graphics/boating/springs.jpg",
    lead: "The closest kind of magic. Pack a towel, not a suitcase.",
    places: [
      {
        id: "rainbow",
        name: "Rainbow Springs",
        drive: "About 40 minutes · Dunnellon",
        who: "Everybody",
        image: "/graphics/day-trips/rainbow.jpg",
        blurb:
          "Glass-clear river, a state park at the headspring, and a lazy paddle from KP Hole. Motors are limited. Grandkids will refuse to get out.",
        more: "The headspring is a state park with a walk around the boil, a small garden, and a place to stare at water so clear it looks fake. The longer float is the river itself: put in upstream and drift toward the Rainbow River. Kayaks and tubes are the usual craft. Motors are tightly limited, so this is not a bass-boat day. Plan a half day if you only walk the park, or most of the day if someone is paddling. Restrooms and a snack window exist; the line for rentals grows after 10.",
        tips: [
          "Go on a weekday morning. Weekends fill the river with tubes.",
          "Water shoes help on the limestone.",
          "Manatees use this river. Give them the whole channel.",
        ],
        query: "Rainbow Springs State Park Dunnellon Florida",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/rainbow-springs-state-park",
          label: "State park site",
        },
      },
      {
        id: "silver",
        name: "Silver Springs",
        drive: "About 50 minutes · Ocala",
        who: "Everybody",
        image: "/graphics/day-trips/silver.jpg",
        blurb:
          "Glass-bottom boats on the Silver River, monkeys in the trees if you are lucky, and a walk that does not require a theme-park ticket.",
        more: "Silver Springs is the old Florida attraction that became a state park. The glass-bottom boat is the reason to go: you look straight down into the main boil and the river. A boardwalk and a museum cover the rest if the boat line is long. Rhesus monkeys live along the river. They are wild animals, not a petting zoo. The park is an easy add-on to a morning in Ocala, including the Garlits museum if the group splits between boats and race cars.",
        tips: [
          "Boat tickets are separate from park entry. Check the day’s schedule.",
          "Do not feed the monkeys.",
          "The glass bottom is better on a bright day.",
        ],
        query: "Silver Springs State Park Florida",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/silver-springs-state-park",
          label: "State park site",
        },
      },
      {
        id: "weeki",
        name: "Weeki Wachee",
        drive: "About 1 hour 15 minutes",
        who: "Grandkids first",
        image: "/graphics/day-trips/weeki.jpg",
        blurb:
          "Mermaids, a spring so blue it looks invented, and Buccaneer Bay when the water park is open for the season. Check the show schedule before you leave the villa.",
        more: "The mermaid show is the famous part: performers in an underwater theater built into the spring. There is also a river boat and, in season, Buccaneer Bay, the water park on the same spring. This is a grandkid day more than a quiet nature walk. Shows run on a schedule, so a late arrival can miss the one you drove for. The spring is cold. Tell the kids before they jump.",
        tips: [
          "Look up the show times the night before.",
          "Buccaneer Bay is seasonal. The theater is the year-round draw.",
          "Bring a sweatshirt for the theater. The glass faces cold water.",
        ],
        query: "Weeki Wachee Springs State Park Florida",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/weeki-wachee-springs-state-park",
          label: "State park site",
        },
      },
      {
        id: "deleon",
        name: "De Leon Springs",
        drive: "About 1 hour",
        who: "Breakfast people",
        image: "/graphics/day-trips/deleon.jpg",
        blurb:
          "You cook pancakes at the table in the old mill, then walk the spring run. Go early. The griddle line is a sport.",
        more: "The Old Spanish Sugar Mill has griddles set into the tables. You mix the batter and cook the pancakes yourself. That is the whole personality of the place, and the line starts early. After breakfast, the spring is a swimming hole with a short run you can walk. It is one of the easiest “we did something” days with visiting family: one meal, one swim, home for a nap.",
        tips: [
          "Arrive when the mill opens, or accept a wait.",
          "The griddle is hot. Grandkids need a grown-up at the table.",
          "Swimming is included with park entry after you eat.",
        ],
        query: "De Leon Springs State Park Florida",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/de-leon-springs-state-park",
          label: "State park site",
        },
      },
      {
        id: "juniper",
        name: "Juniper Springs",
        drive: "About 1 hour · Ocala National Forest",
        who: "A quieter day",
        image: "/graphics/day-trips/juniper.jpg",
        blurb:
          "A round swimming spring in the national forest, with a short canoe run if the water is open. Bring cash for the iron ranger and a chair for the shade.",
        more: "Juniper Springs is a recreation area in the Ocala National Forest, not a state park with a gift shop on every corner. The swimming spring is a circle of clear water under the pines, with a little mill house beside it. A canoe run leaves from here when the water and the season allow; it is a one-way paddle with a shuttle, so read the rules before you rent. Cell service is spotty. That is part of the charm and also why you download the map first.",
        tips: [
          "Check whether the canoe run is open before you promise it.",
          "The forest fee is separate from a state-park pass.",
          "Arrive with water and a chair. Shade is pine shade, not a pavilion.",
        ],
        query: "Juniper Springs Recreation Area Florida",
        site: {
          href: "https://www.fs.usda.gov/ocala",
          label: "Forest service page",
        },
      },
    ],
  },
  {
    id: "animals",
    title: "Animals that are not golf carts",
    image: "/graphics/day-trips/animals.jpg",
    lead: "Manatees, a famous hippo, and the usual Florida supporting cast.",
    places: [
      {
        id: "homosassa",
        name: "Homosassa Springs Wildlife Park",
        drive: "About 1 hour",
        who: "Grandkids and anyone who likes Lu",
        image: "/graphics/day-trips/homosassa.jpg",
        blurb:
          "A state park with manatees under a floating observatory, native Florida animals, and Lu the hippopotamus, who has lived here longer than most villages.",
        more: "You walk a boardwalk through Florida wildlife — birds, reptiles, a black bear, and the manatee spring you look into from underwater windows. Lu the hippo is the celebrity and has been here for decades. A short boat can connect the visitor center to the wildlife walk when it is running. This is a paved, shaded, grandkid-scale park. You will not cover it in twenty minutes, and you do not need a full day unless someone wants the gift shop twice.",
        tips: [
          "The manatee program is the center of the visit. Don’t rush past it.",
          "Lu is not a petting animal. The fence is the view.",
          "Strollers work on most of the walk.",
        ],
        query: "Ellie Schiller Homosassa Springs Wildlife State Park",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/ellie-schiller-homosassa-springs-wildlife-state-park",
          label: "State park site",
        },
      },
      {
        id: "bluespring",
        name: "Blue Spring",
        drive: "About 1 hour · Orange City",
        who: "Winter mornings",
        image: "/graphics/day-trips/bluespring.jpg",
        blurb:
          "Manatees stack up in the run when the river is cold. Boardwalks, no chasing, and a thermos. Summer is for swimming, not the crowd of sea cows.",
        more: "When the St. Johns is cold, manatees come up the run to the 72-degree spring and stay in a pile you can see from the boardwalk. That is a winter visit. The park limits how close boats and swimmers can get, and on the busiest cold mornings it can reach capacity and close the gate. Summer is a swimming spring without the manatee show. Either way it is an easy hour from the south side of The Villages.",
        tips: [
          "In winter, leave early. The park closes when the lot is full.",
          "Stay on the boardwalk. The manatees are not a swim-with attraction here.",
          "A state park pass covers entry.",
        ],
        query: "Blue Spring State Park Orange City Florida",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/blue-spring-state-park",
          label: "State park site",
        },
      },
      {
        id: "kingsbay",
        name: "Kings Bay",
        drive: "About 50 minutes · Crystal River",
        who: "A boat morning",
        image: "/graphics/day-trips/kingsbay.jpg",
        blurb:
          "The in-town springs where manatees winter. Tour boats and kayaks are everywhere. Idle speed, and give the animals the whole canal.",
        more: "Kings Bay is the spring-fed bay in the middle of Crystal River. In cold weather it is one of the best places in Florida to see manatees from a boat or a kayak. Tour operators run trips from the waterfront; you can also launch your own boat if you already know the idle-speed rules. This is not a chase. The bay is a sanctuary, and the animals have the right of way. Pair it with lunch in Crystal River and you are home before the square lights up.",
        tips: [
          "Winter mornings are the manatee mornings.",
          "Book a tour if you do not want to trailer a boat.",
          "Idle speed means idle. The fines are not theoretical.",
        ],
        query: "Kings Bay Crystal River Florida",
      },
      {
        id: "gatorland",
        name: "Gatorland",
        drive: "About 1 hour 15 minutes · Orlando",
        who: "Grandkids who asked",
        image: "/graphics/day-trips/gatorland.jpg",
        blurb:
          "The old-Florida gator park, not a golf-course pond with one shy reptile. Shows, a boardwalk, and a reminder that Florida was here first.",
        more: "Gatorland is a classic roadside park that grew up: breeding marsh, a boardwalk, and shows where the alligators jump. It is smaller and stranger than the Orlando theme parks, which is why it works as a day trip instead of a vacation. Kids who have only seen a village pond alligator will recalibrate. The walk is mostly boardwalk. Midday in July is hot; morning is the humane choice.",
        tips: [
          "The jumping show is the one to time your visit around.",
          "This is not a petting zoo. Hands stay on your side of the rail.",
          "Tickets are on their site. Hours change with the season.",
        ],
        query: "Gatorland Orlando",
        site: { href: "https://www.gatorland.com/", label: "Gatorland" },
      },
    ],
  },
  {
    id: "grandkids",
    title: "When the grandkids are in town",
    image: "/graphics/day-trips/space.jpg",
    lead: "These are full days. Leave before the early-bird special.",
    places: [
      {
        id: "ksc",
        name: "Kennedy Space Center",
        drive: "About 1 hour 45 minutes",
        who: "Kids, parents, and the rocket uncle",
        image: "/graphics/day-trips/ksc.jpg",
        blurb:
          "Rockets, a shuttle, and the bus tour when it is running. One hall is enough if the little ones fade. The Atlantis building is the one they talk about in the cart on the way home.",
        more: "The Visitor Complex is a full day if you try to see everything and a good half day if you pick. The Atlantis exhibit is the emotional center: the shuttle, overhead, close enough to touch the story. Rockets stand outside. A bus tour of the working space center runs when launches and security allow, so do not promise the launch pad if a mission is on the calendar. Little kids do better with one building and the rocket garden than with a forced march. Tickets are timed. Buy them before you merge onto I-4.",
        tips: [
          "Check the launch schedule. A launch day changes traffic and tours.",
          "Atlantis first, then whatever energy is left.",
          "Sunscreen for the rocket garden. The buildings are cold.",
        ],
        query: "Kennedy Space Center Visitor Complex",
        site: { href: "https://www.kennedyspacecenter.com/", label: "Kennedy Space Center" },
      },
      {
        id: "legoland",
        name: "LEGOLAND Florida",
        drive: "About 1 hour 15 minutes · Winter Haven",
        who: "Younger grandkids",
        image: "/graphics/day-trips/legoland.jpg",
        blurb:
          "Built for kids who still fit the rides. Water park add-on in warm months. Closer and calmer than a full Orlando park day.",
        more: "LEGOLAND is scaled for elementary-school kids: shorter rides, a lot of building, Miniland, and a water park that opens in the warm season. It is the right park when Disney would flatten a six-year-old and bore a grandparent who did not come to stand in line for three hours. Older teens will tell you so. Tickets and the water-park add-on are on their site, and the parking lot is part of the budget.",
        tips: [
          "Best for roughly ages 2 to 12.",
          "Water park days need swimsuits in the car, not a second trip.",
          "Weekdays in the school year are the calm ones.",
        ],
        query: "LEGOLAND Florida Winter Haven",
        site: { href: "https://www.legoland.com/florida/", label: "LEGOLAND Florida" },
      },
      {
        id: "disney",
        name: "Walt Disney World",
        drive: "About 1 hour 15 minutes",
        who: "A planned invasion",
        image: "/graphics/day-trips/disney.jpg",
        blurb:
          "One park, not four. Pick it the night before, leave at dawn, and agree on the exit time while everyone is still cheerful.",
        more: "From The Villages, Disney is a day trip only if you treat it like one park. Magic Kingdom, Epcot, Hollywood Studios, or Animal Kingdom — pick before you leave, because deciding in the parking lot is how the day goes sour. Park hopper tickets exist and also exist to exhaust grandparents. Buy tickets ahead. The app holds the reservations and the line times. A rest at the villa that night is not optional.",
        tips: [
          "One park. Say it out loud in the car.",
          "Tickets and park reservations are on Disney’s site.",
          "Leave a water bottle and a jacket in the car for the ride home.",
        ],
        query: "Walt Disney World Orlando",
        site: { href: "https://disneyworld.disney.go.com/", label: "Disney World" },
      },
      {
        id: "universal",
        name: "Universal Orlando",
        drive: "About 1 hour 20 minutes",
        who: "Older grandkids and their parents",
        image: "/graphics/day-trips/universal.jpg",
        blurb:
          "The movie parks. Better for kids who have outgrown teacups. Still a full day, and the sun on the parking tram is personal.",
        more: "Universal is the movie-studio parks: Harry Potter’s corners, roller coasters, and a city-walk of restaurants if you are still speaking to each other at dinner. It suits older grandkids more than toddlers. Two parks sit next to each other; a one-day ticket might be one park unless you bought the hopper. Nighttime lights are part of the show, so an early dinner inside the park beats racing home at 4.",
        tips: [
          "Check height rules before you promise a ride.",
          "One park is a full day. Two parks is a negotiation.",
          "Buy tickets before you go. The gate is the expensive place to decide.",
        ],
        query: "Universal Orlando Resort",
        site: { href: "https://www.universalorlando.com/", label: "Universal Orlando" },
      },
    ],
  },
  {
    id: "towns",
    title: "Towns worth the passenger seat",
    image: "/graphics/day-trips/town.jpg",
    lead: "Walk a main street, eat something fried, and be home for the news.",
    places: [
      {
        id: "mountdora",
        name: "Mount Dora",
        drive: "About 50 minutes",
        who: "A stroll and a lake",
        image: "/graphics/day-trips/mountdora.jpg",
        blurb:
          "Hills, antiques, and a downtown that faces the water. Easy with adult kids. Ice cream is the grandkid strategy.",
        more: "Mount Dora is a real downtown on a hill above Lake Dora, which already makes it exotic in Florida. Shops, a park, boat tours on the chain, and enough restaurants that nobody has to eat in the car. It is walkable if you park once. The antique stores are the adult sport. The lighthouse and the lake path are the part children will remember. You can be home for a normal dinner without heroics.",
        tips: [
          "Park in a public lot and walk. The hill is the point.",
          "Weekend festivals fill the streets. Check the city calendar.",
          "A lake breeze does not mean you can skip the hat.",
        ],
        query: "Downtown Mount Dora Florida",
      },
      {
        id: "micanopy",
        name: "Micanopy",
        drive: "About 1 hour 10 minutes",
        who: "Antique people",
        image: "/graphics/day-trips/micanopy.jpg",
        blurb:
          "A short oak-shaded main street of shops under the canopy. Pair it with Payne’s Prairie if the group can stand one more stop.",
        more: "Micanopy is a few blocks of old stores under a live-oak canopy, south of Gainesville. Antiquing is the reason most Villages neighbors go. It is not a full-day town unless you browse slowly, which is allowed. Payne’s Prairie is a short drive farther and gives the non-shoppers a boardwalk and a sky. Do both and you have used the day well without a ticket line.",
        tips: [
          "Many shops close early. Don’t arrive at 4.",
          "The prairie is the add-on, not a second marathon.",
          "Cash still helps in the smaller stores.",
        ],
        query: "Downtown Micanopy Florida",
      },
      {
        id: "cedarkey",
        name: "Cedar Key",
        drive: "About 1 hour 30 minutes",
        who: "Seafood and a dead-end road",
        image: "/graphics/day-trips/cedarkey.jpg",
        blurb:
          "Old Florida on the Gulf, with a pier, an art walk, and clam chowder. The drive is the point. Stay for the sunset if the cart path can survive a late return.",
        more: "Cedar Key is the end of a two-lane road on the Gulf: a small harbor, a pier, galleries, and restaurants that built their reputation on clams. There is a museum and a short nature trail if you want to walk off lunch. It is not a swimming beach in the Daytona sense. Sunset here is the famous part, and it also means driving home in the dark. Decide that before you order dessert.",
        tips: [
          "The road in is the road out. There is no clever shortcut.",
          "Clam chowder is the local argument. Pick a porch and commit.",
          "A sunset stay is a night drive. Pack the brighter eyes for the passenger seat.",
        ],
        query: "Cedar Key Florida",
      },
      {
        id: "staugustine",
        name: "St. Augustine",
        drive: "About 2 hours 15 minutes",
        who: "An early start",
        image: "/graphics/day-trips/staugustine.jpg",
        blurb:
          "The old city, the fort, and a beach on the way out. This is the far edge of a day trip. Leave at dawn or stay over.",
        more: "St. Augustine is the oldest city on this list and the longest drive. The fort, the old gates, a carriage or a trolley, and St. George Street will fill a day by themselves. A beach stop on the way home is how people pretend the drive was short. It is a legitimate day trip only if you leave early and pick two things, not eight. Staying over is the honest version. If you do it in a day, the fort and one walk are enough.",
        tips: [
          "Leave early. Two hours and change is the optimistic time.",
          "The fort is the Castillo. Tickets are timed in busy seasons.",
          "One neighborhood on foot beats a checklist.",
        ],
        query: "Castillo de San Marcos St. Augustine Florida",
      },
    ],
  },
  {
    id: "beach",
    title: "A beach before dinner",
    image: "/graphics/day-trips/beach.jpg",
    lead: "Salt, a chair, and a promise to rinse the sand out of the cart.",
    places: [
      {
        id: "daytona",
        name: "Daytona Beach",
        drive: "About 1 hour 15 minutes",
        who: "Boardwalk and a drive on the sand",
        image: "/graphics/day-trips/daytona.jpg",
        blurb:
          "The closest big beach. The pier and the Boardwalk are the grandkid version. Driving on the sand is allowed where it is marked — read the tide signs.",
        more: "Daytona is the nearest full beach day: a pier, the Boardwalk, and the famous stretch where cars still drive on the sand in marked zones. Read the tide and the traffic rules before you follow someone onto the beach. The Boardwalk is the easy grandkid version if you would rather not rinse the sedan. You can be in the water before lunch and home for a normal evening if you do not try to see the speedway too.",
        tips: [
          "Beach driving has a fee, a speed limit, and a tide. Obey all three.",
          "The Boardwalk is plenty if the group is small children.",
          "Rinse sand off before it becomes a cart-floor problem.",
        ],
        query: "Daytona Beach Boardwalk Florida",
      },
      {
        id: "newsmyrna",
        name: "New Smyrna Beach",
        drive: "About 1 hour 30 minutes",
        who: "A softer beach day",
        image: "/graphics/day-trips/newsmyrna.jpg",
        blurb:
          "Fewer neon lights than Daytona, a flag system for the surf, and a walkable downtown if the water is too rough.",
        more: "New Smyrna is the calmer beach neighbor of Daytona. The flag on the beach tells you whether swimming is a good idea that hour; believe it. Flagler Avenue is the walk if the surf is up or the kids are done. It is a chairs-and-umbrella day more than a boardwalk day. Sharks and baitfish are part of this coast. The lifeguard flag is the rule, not a suggestion.",
        tips: [
          "Red flag means stay out. Do not negotiate with the ocean.",
          "Park in a public lot early. The good ones fill.",
          "Downtown is the backup plan if the wind is sideways.",
        ],
        query: "New Smyrna Beach Florida Flagler Avenue",
      },
      {
        id: "clearwater",
        name: "Clearwater Beach",
        drive: "About 2 hours",
        who: "A postcard afternoon",
        image: "/graphics/day-trips/beach.jpg",
        blurb:
          "White sand and a long pier. Go on a weekday. Sunset here is a commitment, not a quick cart-path loop.",
        more: "Clearwater Beach is the postcard: white sand, a long pier, and water that looks edited. It is also a two-hour drive and a parking project on a pretty weekend. Weekdays are the version that still feels like a day trip. Sunset is beautiful and also means you get home late. Pier 60 has a small evening market. If the group wants one “we went to the Gulf” photo for the year, this is a fair choice. Bring the beach cart. The walk from the garage is longer than it looks on the map.",
        tips: [
          "Weekday, or accept the parking hunt.",
          "The pier is the easy walk if someone does not want to swim.",
          "Sunset stays are a night return. Agree on that at lunch.",
        ],
        query: "Clearwater Beach Florida Pier 60",
      },
    ],
  },
  {
    id: "slow",
    title: "Gardens, garages, and the odd stop",
    image: "/graphics/day-trips/garden.jpg",
    lead: "For the day nobody wants a roller coaster.",
    places: [
      {
        id: "bok",
        name: "Bok Tower Gardens",
        drive: "About 1 hour 15 minutes · Lake Wales",
        who: "A quiet beautiful hour",
        image: "/graphics/day-trips/bok.jpg",
        blurb:
          "A singing tower, formal gardens, and a hill that counts as a mountain in Florida. The carillon plays. Phones can wait.",
        more: "Bok Tower is a carillon on the Lake Wales Ridge, surrounded by gardens designed to be walked slowly. The tower sings at set times. You do not climb it. You listen, walk the paths, and look at a hill that Floridians insist on calling a mountain. It is one of the most peaceful afternoons on this list. People who need a thrill ride should be warned in the driveway.",
        tips: [
          "Check the carillon schedule so you are there when it plays.",
          "The walk is gentle. Benches are part of the design.",
          "It is a garden, not a playground. Set that expectation.",
        ],
        query: "Bok Tower Gardens Lake Wales",
        site: { href: "https://boktowergardens.org/", label: "Bok Tower Gardens" },
      },
      {
        id: "garlits",
        name: "Don Garlits Museum",
        drive: "About 40 minutes · Ocala",
        who: "Grandpa, the son-in-law, and a willing grandchild",
        image: "/graphics/day-trips/garlits.jpg",
        blurb:
          "Drag racing history in big indoor halls. Loud even when the cars are parked. One of the easiest yeses from the north gate.",
        more: "Big Daddy’s museum is two large halls of dragsters and antique cars just off I-75 in Ocala. It is indoors, which makes it the summer backup when the sky is building thunder. The cars are the show. A grandchild who likes anything with wheels will give you an hour without complaint, often two. It pairs cleanly with Silver Springs if you want one indoor stop and one outdoor stop in the same day.",
        tips: [
          "Indoors, so it survives a hot or wet afternoon.",
          "Allow a couple of hours if anyone reads the plaques.",
          "Confirm hours on the museum site. It is not a state park.",
        ],
        query: "Don Garlits Museum of Drag Racing Ocala",
        site: { href: "https://garlits.com/", label: "Garlits museum" },
      },
      {
        id: "prairie",
        name: "Payne’s Prairie",
        drive: "About 1 hour 20 minutes",
        who: "A boardwalk and maybe bison",
        image: "/graphics/day-trips/prairie.jpg",
        blurb:
          "A wide savanna south of Gainesville. The observation tower is the whole workout. Bison are not guaranteed. The sky is.",
        more: "Paynes Prairie is a huge preserved marsh and savanna. The observation tower is the easy visit: climb, look for bison and wild horses, watch the birds, and climb down. Trails go farther if someone packed real shoes. It pairs with Micanopy, a few minutes up the road. You will not see bison every time. Tell the truth in the car so nobody treats a landscape as a failed zoo.",
        tips: [
          "The tower is the short version. Trails are the long one.",
          "Bison are wild and sometimes elsewhere. The prairie is still the point.",
          "Hats. The tower is in the sun on purpose.",
        ],
        query: "Paynes Prairie Preserve State Park",
        site: {
          href: "https://www.floridastateparks.org/parks-and-trails/paynes-prairie-preserve-state-park",
          label: "State park site",
        },
      },
      {
        id: "cassadaga",
        name: "Cassadaga",
        drive: "About 1 hour",
        who: "Curious adult kids",
        image: "/graphics/day-trips/cassadaga.jpg",
        blurb:
          "A century-old spiritualist camp in the trees. Shops, a bookstore, and readings if someone in the cart is brave. Look, be polite, and don’t mock the neighbors.",
        more: "Cassadaga is a spiritualist camp that has been a town since the 1890s. Narrow roads, small cottages, a hotel, a bookstore, and people who offer readings. It is a curious afternoon, not a haunted house. The people who live there are neighbors. Walk, look, buy a book if you want, and skip the jokes at anyone’s porch. It is an easy drive and a strange one, which is why adult kids like it.",
        tips: [
          "Be a guest. People live in the cottages.",
          "Readings are optional and paid. Ask the price first.",
          "The bookstore is the low-pressure way to see the place.",
        ],
        query: "Cassadaga Florida spiritualist camp",
        site: { href: "https://www.cassadaga.org/", label: "Cassadaga camp" },
      },
    ],
  },
];

export function DayTripsGuide() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = GROUPS.flatMap((group) => group.places).find((place) => place.id === openId) || null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <section className="section">
        <div className="shell">
          <div className="ms-boat-jump">
            {GROUPS.map((group) => (
              <a key={group.id} className="btn btn-ghost btn-sm" href={`#${group.id}`}>
                {group.title}
              </a>
            ))}
          </div>
          <div className="golf-feature-grid">
            {GROUPS.map((group) => (
              <a key={group.id} href={`#${group.id}`} className="golf-feature-card about-panel">
                <div className="golf-feature-art">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.image} alt="" className="golf-feature-img" />
                </div>
                <div className="golf-feature-body">
                  <strong>{group.title}</strong>
                  <span>{group.lead}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {GROUPS.map((group) => (
        <section key={group.id} className="section" id={group.id} style={{ paddingTop: 0 }}>
          <div className="shell">
            <div className="section-head">
              <div>
                <h2>{group.title}</h2>
                <p>{group.lead}</p>
              </div>
            </div>
            <div className="ms-boat-grid">
              {group.places.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  className="about-panel trip-card"
                  onClick={() => setOpenId(place.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={place.image} alt="" />
                  <div className="trip-card-body">
                    <p className="ms-boat-meta">{place.drive}</p>
                    <h3>{place.name}</h3>
                    <p className="ms-boat-meta">{place.who}</p>
                    <p>{place.blurb}</p>
                    <p className="trip-card-more">More about this trip</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="trip-pop-scrim" onClick={() => setOpenId(null)}>
              <div
                className="trip-pop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="trip-pop-title"
                onClick={(event) => event.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="trip-pop-art" src={open.image} alt="" />
                <div className="trip-pop-body">
                  <div className="ms-cal-pop-bar">
                    <p className="panel-hint" style={{ margin: 0 }}>
                      {open.drive}
                    </p>
                    <button type="button" className="ms-cal-pop-close" onClick={() => setOpenId(null)}>
                      Close
                    </button>
                  </div>
                  <h3 id="trip-pop-title">{open.name}</h3>
                  <p className="ms-boat-meta">{open.who}</p>
                  <p>{open.more}</p>
                  <ul className="trip-pop-tips">
                    {open.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                  <div className="hero-actions">
                    <a
                      className="btn btn-primary btn-sm"
                      href={mapsSearch(open.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in maps
                    </a>
                    {open.site ? (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={open.site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {open.site.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
