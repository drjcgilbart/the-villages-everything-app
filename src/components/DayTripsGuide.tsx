"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TripDay } from "@/components/TripDay";

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
    lead: "The closest kind of magic. Pack a towel, not a suitcase. More springs are farther down the page.",
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
        image: "/graphics/day-trips/clearwater.jpg",
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

const MORE: Group[] = [
  {
    id: "more-springs",
    title: "More springs worth the drive",
    image: "/graphics/day-trips/devilsden.jpg",
    lead: "Florida has hundreds of named springs. These are the other clear ones a Villager can still visit in a day. Far ones say so.",
    places: [
      {
        id: "ichetucknee",
        name: "Ichetucknee Springs",
        drive: "About 1 hour 20 minutes · Fort White",
        who: "A tube day",
        image: "/graphics/day-trips/ichetucknee.jpg",
        blurb: "A spring-fed river you float in a tube. On busy summer days the park limits how many people go in.",
        more: "Ichetucknee is the classic north-Florida tube run: several springs feed a clear river, and you drift a few miles under the trees. The state park caps the number of tubers when the river is busy, so a weekday is kinder than a holiday. There is a tram on some seasons. It is cold water. Grandkids last longer than grandparents.",
        tips: ["Check whether tubing is open and if a tram is running.", "Go early. The daily tube limit is real.", "Water shoes and a change of clothes in the car."],
        query: "Ichetucknee Springs State Park Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/ichetucknee-springs-state-park", label: "State park site" },
      },
      {
        id: "ginnie",
        name: "Ginnie Springs",
        drive: "About 1 hour 15 minutes · High Springs",
        who: "A private spring day",
        image: "/graphics/day-trips/ginnie.jpg",
        blurb: "A private park with several springs, a tube run on the Santa Fe, and camping if you want to stay.",
        more: "Ginnie Springs is not a state park. You pay at the gate. The boil is clear, the Santa Fe tube run is the long float, and scuba divers use the cave system. Stay out of the caves unless you are certified for them. The park can be loud on summer weekends. A weekday is the Villages version.",
        tips: ["This is a fee park, not a state-park pass.", "The underwater caves are for trained cave divers only.", "Tubing the river takes longer than a quick swim."],
        query: "Ginnie Springs High Springs Florida",
        site: { href: "https://www.ginniespringsoutdoors.com/", label: "Ginnie Springs" },
      },
      {
        id: "devilsden",
        name: "Devil’s Den",
        drive: "About 45 minutes · Williston",
        who: "Snorkel in a cavern",
        image: "/graphics/day-trips/devilsden.jpg",
        blurb: "A private prehistoric spring inside a limestone cavern. You climb down and snorkel in the blue water.",
        more: "Devil’s Den is a privately owned spring in a dry cavern near Williston, the closest ‘wow’ water to The Villages. You pay to enter, climb down into the chamber, and snorkel. It is not a scuba cave for beginners, and it is not a state park. The water is about 72 degrees. Reservations are wise on weekends. Children have age and swimming rules — read them before you promise the grandkids.",
        tips: ["Reserve ahead on weekends.", "It is a fee cavern, not a walk-up state park.", "Check the age and swimming rules before you bring small children."],
        query: "Devil's Den Spring Williston Florida",
        site: { href: "https://www.devilsden.com/", label: "Devil’s Den" },
      },
      {
        id: "wekiwa",
        name: "Wekiwa Springs",
        drive: "About 1 hour 15 minutes · Apopka",
        who: "A swim and a paddle",
        image: "/graphics/day-trips/wekiwa.jpg",
        blurb: "A state-park spring and the head of the Wekiva River. Swim the boil, or rent a canoe if the outfitter is open.",
        more: "Wekiwa Springs State Park is the Orlando-side spring: a swimming area in the boil and a river that paddlers follow into the Wekiva. It is popular, and the swim area fills. The park is about an hour and a quarter toward Apopka. Pair it with Kelly Park the same direction if one lot is full and the other is not.",
        tips: ["Arrive early on warm weekends.", "The river paddle is longer than the swim.", "A state park pass works here."],
        query: "Wekiwa Springs State Park Apopka",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/wekiwa-springs-state-park", label: "State park site" },
      },
      {
        id: "kelly",
        name: "Kelly Park at Rock Springs",
        drive: "About 1 hour 10 minutes · Apopka",
        who: "A tube through the run",
        image: "/graphics/day-trips/kelly.jpg",
        blurb: "Orange County’s swimming spring. You tube a short, clear run. The park closes when the lot is full.",
        more: "Rock Springs Run at Kelly Park is the local’s tube: a short, cold, clear float and a walk back. It is a county park, not a state park, and it closes for the day when the parking lot fills. That happens before lunch on pretty Saturdays. Go at opening.",
        tips: ["Be there at opening on weekends.", "It is a county park. A state park pass may not cover it.", "The float is short. The walk back is the workout."],
        query: "Kelly Park Rock Springs Apopka Florida",
      },
      {
        id: "manatee-spring",
        name: "Manatee Springs",
        drive: "About 1 hour · Chiefland",
        who: "A boardwalk to the Suwannee",
        image: "/graphics/day-trips/manatee.jpg",
        blurb: "A first-magnitude spring that pours into the Suwannee River, with a boardwalk and a swim area.",
        more: "Manatee Springs is one of Florida’s big springs, west of The Villages near Chiefland. You can swim in the spring, walk the boardwalk to the Suwannee, and watch for manatees in the colder months. It is quieter than Rainbow on a Tuesday. The spring is the visit. The river is the bonus.",
        tips: ["Winter is the better manatee season here.", "The boardwalk is the easy walk.", "A state park pass covers entry."],
        query: "Manatee Springs State Park Chiefland",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/manatee-springs-state-park", label: "State park site" },
      },
      {
        id: "fanning",
        name: "Fanning Springs",
        drive: "About 1 hour 10 minutes",
        who: "A quick boil",
        image: "/graphics/day-trips/fanning.jpg",
        blurb: "A small state-park spring on the Suwannee, easy to add if you are already headed toward Manatee Springs.",
        more: "Fanning Springs is a compact state park on the Suwannee. The boil is the swim. It is not a full-day spectacle by itself, which makes it a good second stop with Manatee Springs or a short day when you do not want a theme park. Check the park page for swim closures after rain.",
        tips: ["Pair it with Manatee Springs.", "High water on the Suwannee can change the day.", "Small park. Do not expect a resort."],
        query: "Fanning Springs State Park Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/fanning-springs-state-park", label: "State park site" },
      },
      {
        id: "alexander",
        name: "Alexander Springs",
        drive: "About 1 hour · Ocala National Forest",
        who: "A forest swim",
        image: "/graphics/day-trips/alexander.jpg",
        blurb: "A wide swimming spring in the national forest, with a short canoe trail when the water is open.",
        more: "Alexander Springs is another Ocala National Forest spring, broader and often quieter than the name-brand parks. There is a swim area and a canoe trail. Forest fees and hours are not the same as a state park. Download directions before you lose the signal under the pines.",
        tips: ["National forest fee, not a state-park pass.", "Check the canoe trail before you promise it.", "Cell service fades. Save the map."],
        query: "Alexander Springs Ocala National Forest",
      },
      {
        id: "silverglen",
        name: "Silver Glen Springs",
        drive: "About 1 hour 10 minutes · Ocala National Forest",
        who: "A clear run to the St. Johns",
        image: "/graphics/day-trips/silver.jpg",
        blurb: "A recreation-area spring whose run meets the St. Johns. Pretty, and easy to overfill on a holiday.",
        more: "Silver Glen Springs Recreation Area sits in the Ocala National Forest east of the Villages side of the forest. The spring run is the reason to go. It is popular with boats on the St. Johns side, so a weekday morning is the pleasant version. Recreation.gov and the forest service are the sources for fees and closures.",
        tips: ["Weekday morning.", "Forest rules, not state-park rules.", "The run is shallow. Mind the plants."],
        query: "Silver Glen Springs Recreation Area Florida",
      },
      {
        id: "saltsprings",
        name: "Salt Springs",
        drive: "About 1 hour · Ocala National Forest",
        who: "A marina and a boil",
        image: "/graphics/day-trips/saltsprings.jpg",
        blurb: "A forest spring with a marina nearby. You can look at the boil and paddle if the wind on the lake is kind.",
        more: "Salt Springs is a recreation spot in the Ocala National Forest with a spring, a marina, and a small community around it. It is a flexible stop: swim or look, then decide if the lake is calm enough to paddle. It is not as polished as a state park visitor center. That is fine if you came for the water.",
        tips: ["Check wind before a paddle.", "Forest fee may apply at the recreation site.", "Facilities are simple."],
        query: "Salt Springs Recreation Area Ocala National Forest",
      },
      {
        id: "madison",
        name: "Madison Blue Spring",
        drive: "About 2 hours · Madison",
        who: "A long clear swim",
        image: "/graphics/day-trips/madison.jpg",
        blurb: "A state park spring on the Withlacoochee, north of town. A longer drive, and a beautiful boil if the water is open.",
        more: "Madison Blue is a first-magnitude spring north of The Villages, on the Withlacoochee River. It is a longer day than Rainbow. The spring is known to cave divers and to swimmers when the park allows swimming. High water closes it. Check the park page the morning you go, not the week before.",
        tips: ["Call or check the page for swim closures.", "Two hours each way. Leave in the morning.", "This is not the same Blue Spring as Orange City."],
        query: "Madison Blue Spring State Park Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/madison-blue-spring-state-park", label: "State park site" },
      },
      {
        id: "peacock",
        name: "Wes Skiles Peacock Springs",
        drive: "About 1 hour 30 minutes · Live Oak",
        who: "Look, unless you are a cave diver",
        image: "/graphics/day-trips/peacock.jpg",
        blurb: "A state park of sinkhole springs. The caves underneath are for certified cave divers. Everyone else walks and looks.",
        more: "Peacock Springs is one of the most important underwater cave systems in the country. The park lets you walk to the sinks and swim where it is posted. The cave lines are not a sightseeing snorkel. If nobody in the car is cave-certified, this is a short, beautiful look and then lunch, not an all-day swim.",
        tips: ["Caves are for trained cave divers only.", "The walk between sinks is the visit for everyone else.", "Pair it with a Madison or Live Oak lunch."],
        query: "Wes Skiles Peacock Springs State Park",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/wes-skiles-peacock-springs-state-park", label: "State park site" },
      },
      {
        id: "wakulla",
        name: "Wakulla Springs",
        drive: "About 3 hours · Wakulla",
        who: "A long day, leave at dawn",
        image: "/graphics/day-trips/silver.jpg",
        blurb: "One of the world’s largest springs, a jungle boat, and an old lodge. This is the far edge of a day trip.",
        more: "Wakulla Springs State Park is south of Tallahassee. The spring is enormous, the river boat is the classic tour, and the lodge is worth walking through even if you are not staying. Three hours each way means you leave early and you pick the boat, not six extra stops. It is on this list because it is one of Florida’s great springs and a determined Villager can still do it in a day. Staying at the lodge is the kinder plan.",
        tips: ["Leave at dawn or stay over.", "The river boat is the tour to book.", "Do not add Tallahassee errands and still call it a day trip."],
        query: "Edward Ball Wakulla Springs State Park",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/wakulla-springs-state-park", label: "State park site" },
      },
      {
        id: "sisters",
        name: "Three Sisters Springs",
        drive: "About 50 minutes · Crystal River",
        who: "Winter manatees, by the rules",
        image: "/graphics/day-trips/kingsbay.jpg",
        blurb: "A Crystal River spring with boardwalks. In manatee season you often need a pass. Do not plan to swim with them.",
        more: "Three Sisters Springs is a protected spring in Crystal River. In the cold months, manatees pile in and the refuge runs a boardwalk visit that can require a timed pass. Swimming with manatees here is not the casual plan people remember from old brochures. Read the current refuge rules. Kings Bay is the wider watery neighborhood if the spring itself is at capacity.",
        tips: ["Winter passes go fast. Check the refuge before you drive.", "Boardwalk viewing is the respectful visit.", "This is not a guaranteed in-water encounter."],
        query: "Three Sisters Springs Crystal River Florida",
        site: { href: "https://www.fws.gov/refuge/crystal-river", label: "Crystal River refuge" },
      },
      {
        id: "chass",
        name: "Chassahowitzka",
        drive: "About 1 hour 10 minutes",
        who: "A river of springs",
        image: "/graphics/day-trips/kingsbay.jpg",
        blurb: "A spring-fed river system you mostly see by boat or kayak. The name is worth learning how to say on the way.",
        more: "Chassahowitzka is a national wildlife refuge and a spring-fed river south of Homosassa. You do not stroll a beach up to one boil and call it done. Kayaks and small boats are how the river makes sense. It is a quieter, wilder cousin of the Crystal River trip. Say it ‘Chass-ah-witz-ka’ once in the car so nobody is guessing at the ramp.",
        tips: ["This is a boat or kayak day.", "The refuge has its own rules. Read them.", "Wind on the open river matters more than it does in a round spring."],
        query: "Chassahowitzka Springs Florida",
      },
      {
        id: "gilchrist",
        name: "Gilchrist Blue Springs",
        drive: "About 1 hour 15 minutes · High Springs",
        who: "A clear run to the Santa Fe",
        image: "/graphics/day-trips/bluespring.jpg",
        blurb: "A newer state park with a strong blue boil and a short spring run. Swim it, then decide if the river float is the rest of the day.",
        more: "Ruth B. Kirby Gilchrist Blue Springs State Park is the High Springs spring that used to be a private park and is now a state park. The headspring is the swim. The run meets the Santa Fe, which is the longer paddle or tube. It is in the same neighborhood as Ginnie Springs and Poe Springs, so pick one boil for the morning and do not try to collect every spring in Gilchrist County before lunch.",
        tips: ["A state park pass covers entry.", "Pair it with one other High Springs stop, not four.", "The water is cold. Grandkids last longer."],
        query: "Ruth B Kirby Gilchrist Blue Springs State Park",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/ruth-b-kirby-gilchrist-blue-springs-state-park", label: "State park site" },
      },
      {
        id: "bluegrotto",
        name: "Blue Grotto",
        drive: "About 45 minutes · Williston",
        who: "The other cavern, for divers",
        image: "/graphics/day-trips/devilsden.jpg",
        blurb: "A private cavern spring a few minutes from Devil’s Den. The operator has limited it to divers and dive students. Read the rules before anyone packs a snorkel.",
        more: "Blue Grotto is the neighbor cavern to Devil’s Den, outside Williston. It is privately owned. Unlike the Den, it has often been reserved for certified divers and students rather than a family snorkel. That can change, and it is the sort of rule you read on their site the week you go. If the group is not diving, Devil’s Den is the cavern on this page that is built for a snorkel visit. Do not treat the two as the same ticket.",
        tips: ["Confirm snorkel versus dive-only before you drive.", "It is a fee cavern, not a state park.", "Devil’s Den is the family snorkel. This one may not be."],
        query: "Blue Grotto Williston Florida",
        site: { href: "https://www.divebluegrotto.com/", label: "Blue Grotto" },
      },
      {
        id: "poe",
        name: "Poe Springs",
        drive: "About 1 hour 20 minutes · High Springs",
        who: "A county-park swim",
        image: "/graphics/day-trips/juniper.jpg",
        blurb: "An Alachua County park on the Santa Fe. A simpler swim than Ginnie, and a good second choice when the private park is full.",
        more: "Poe Springs Park is a county swimming spring near High Springs, on the Santa Fe River. It does not have Ginnie’s cave system or a resort gate. It has a boil, a bank, and a place to cool off. County hours and fees are not the same as a state park pass. If the water is posted closed, it is closed.",
        tips: ["County park. A state park pass may not cover it.", "Check the county page for closures.", "Combine with Gilchrist Blue only if the group still wants a second swim."],
        query: "Poe Springs Park High Springs Florida",
      },
      {
        id: "rum",
        name: "Rum Island Spring",
        drive: "About 1 hour 20 minutes · High Springs",
        who: "A riverbank afternoon",
        image: "/graphics/day-trips/rainbow.jpg",
        blurb: "A small county park where a spring meets the Santa Fe. Pretty, busy, and sometimes closed when the water is not fit to swim.",
        more: "Rum Island is a Columbia County park on the Santa Fe, just downstream of the High Springs springs. People come to swim the spring and sit on the bank. It is small, and the lot tells you when to leave. Water-quality closures happen. Look at the county notice the morning you go, not a blog from last summer.",
        tips: ["Check for a water closure before you pack the car.", "Small park. Go early on a warm Saturday.", "This is a swim, not a full-day resort."],
        query: "Rum Island Spring Columbia County Florida",
      },
      {
        id: "troy",
        name: "Troy Spring",
        drive: "About 1 hour 25 minutes · Branford",
        who: "A Suwannee boil and a river wreck",
        image: "/graphics/day-trips/silver.jpg",
        blurb: "A state-park spring on the Suwannee, with the ribs of an old steamboat in the run when the water is clear.",
        more: "Troy Spring State Park sits on the Suwannee near Branford. You swim the boil and, when the river is clear enough, look at what is left of a 19th-century steamboat in the spring run. It is a quieter stop than Ichetucknee. High water on the Suwannee changes the day, the same as Fanning. Check the park page.",
        tips: ["A state park pass covers entry.", "High river water can muddy the visit.", "Pair it with Little River or Peacock only if you started early."],
        query: "Troy Spring State Park Branford Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/troy-spring-state-park", label: "State park site" },
      },
      {
        id: "littleriver",
        name: "Little River Springs",
        drive: "About 1 hour 25 minutes · Branford",
        who: "A swim, and a cave if you are certified",
        image: "/graphics/day-trips/juniper.jpg",
        blurb: "A spring on the Suwannee that swimmers and cave divers share. Stay out of the cave unless that is your certification.",
        more: "Little River Springs, near Branford, is a clear boil on the way to the Suwannee and a known cave-diving site. The open water is the visit for everyone else. The line into the cave is not a sightseeing snorkel. Confirm who runs the gate and whether swimming is open before you promise the carpool a sure thing. It sits near Troy Spring, so one of the two is enough for a gentle day.",
        tips: ["Caves are for trained cave divers only.", "Confirm the gate is open.", "One Branford spring is a day. Two is a long one."],
        query: "Little River Springs Branford Florida",
      },
      {
        id: "lafayette",
        name: "Lafayette Blue Springs",
        drive: "About 1 hour 40 minutes · Mayo",
        who: "A Suwannee swim",
        image: "/graphics/day-trips/bluespring.jpg",
        blurb: "A state park spring on the Suwannee with a natural rock bridge. A longer drive than Rainbow, and a beautiful boil when the river allows it.",
        more: "Lafayette Blue Springs State Park is south of Mayo, where a first-magnitude spring meets the Suwannee. There is a swim, a limestone bridge over the spring, and camping if someone in the group votes to stay. It is farther than the High Springs cluster. Leave in the morning. High water closes the pretty version of this park.",
        tips: ["Check swim status the morning you go.", "About an hour and forty minutes. This is the day, not a side stop.", "A state park pass covers entry."],
        query: "Lafayette Blue Springs State Park Mayo Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/lafayette-blue-springs-state-park", label: "State park site" },
      },
      {
        id: "hart",
        name: "Hart Springs",
        drive: "About 1 hour 20 minutes · Gilchrist County",
        who: "A county park on the Suwannee",
        image: "/graphics/day-trips/weeki.jpg",
        blurb: "A county swimming spring and campground on the Suwannee. Less famous than the state parks, and that is often the point.",
        more: "Hart Springs is a Gilchrist County park: a spring boil, a river bank, and camping. It is not run by the state park service, so the annual pass in the glove box may not get you in. It is a good choice when Ichetucknee’s tube limit is already posted and the group still wants clear water. Read the county hours. They are shorter than a summer afternoon feels.",
        tips: ["County fee, not a state park pass.", "Quieter on a weekday.", "The Suwannee is the backdrop. The spring is the swim."],
        query: "Hart Springs Park Gilchrist County Florida",
      },
      {
        id: "gemini",
        name: "Gemini Springs",
        drive: "About 50 minutes · DeBary",
        who: "A close, easy walk",
        image: "/graphics/day-trips/deleon.jpg",
        blurb: "A Volusia County park around a spring-fed lake. More of a stroll and a paddle than a deep blue boil.",
        more: "Gemini Springs Park is the close-in spring on the way toward Orange City and DeLand. The water is spring-fed, the paths are easy, and it will not replace Rainbow if someone wanted to see the bottom of a boil from a tube. It will fill an afternoon when the group does not want a two-hour drive. De Leon Springs and Blue Spring in Orange City are the same direction if you want a bigger spring the same day. Pick one.",
        tips: ["County park. Check whether a fee is posted.", "Easy walking. Good when someone does not want a hike.", "Do not promise a theme-park spring. This one is gentle."],
        query: "Gemini Springs Park DeBary Florida",
      },
      {
        id: "lithia",
        name: "Lithia Springs",
        drive: "About 1 hour 45 minutes · Lithia",
        who: "A swim on the way to Tampa",
        image: "/graphics/day-trips/rainbow.jpg",
        blurb: "A Hillsborough County swimming spring on the Alafia River. Worth it when you are already pointed south.",
        more: "Lithia Springs Park is a county swimming hole east of Tampa, on the Alafia. The spring is the reason to stop. The river is the rest of the park. It is about an hour and forty-five minutes, so it makes more sense on a day you also want the Brandon or Tampa side than as a quick dip after pickleball. A state park pass does not run this gate. The county does, and they close the swim when they need to.",
        tips: ["Confirm the swim is open.", "County park, separate from the state pass.", "Pair it with a southbound plan or it is a long way for one swim."],
        query: "Lithia Springs Park Florida",
      },
      {
        id: "warm-mineral",
        name: "Warm Mineral Springs",
        drive: "About 2 hours 45 minutes · North Port",
        who: "A long day for warm water",
        image: "/graphics/day-trips/silver.jpg",
        blurb: "A city spring that stays warm, in the 80s, instead of the usual Florida 72. A real drive. The warmth is the point.",
        more: "Warm Mineral Springs in North Port is not another cold boil. The water stays warm year-round, which is why people drive past closer springs to sit in it. It is a city park with a fee, about two hours and forty-five minutes from The Villages. Leave in the morning. It is a soak and a look, not a tubing river, and it is too far to combine with a Gulf beach and still call the evening early.",
        tips: ["This is a long day. Leave in the morning.", "Fee park. Read the city page for hours.", "The water is warm on purpose. Pack accordingly."],
        query: "Warm Mineral Springs North Port Florida",
      },
    ],
  },
  {
    id: "gardens",
    title: "Botanical gardens",
    image: "/graphics/day-trips/butterfly.jpg",
    lead: "Bok Tower is already on this page. These are the other gardens a day’s drive will reach, including a few that only work if you leave at dawn.",
    places: [
      {
        id: "kanapaha",
        name: "Kanapaha Botanical Gardens",
        drive: "About 1 hour 20 minutes · Gainesville",
        who: "A slow walk",
        image: "/graphics/day-trips/kanapaha.jpg",
        blurb: "Gainesville’s big garden. Bamboo, camellias, and a long loop that is still kinder than a theme park.",
        more: "Kanapaha is one of the largest botanical gardens in the Southeast, on the southwest side of Gainesville. The paths are the visit. There is enough shade and bench to make it a real walk rather than a parking-lot photo. It pairs with the Florida Museum of Natural History if the group wants one indoor stop the same day. Hours and admission are on the garden’s site.",
        tips: ["Wear real shoes. The loop is longer than it looks.", "Combine with the Florida Museum if you want air-conditioning after.", "Check bloom calendars if someone cares about camellias."],
        query: "Kanapaha Botanical Gardens Gainesville",
        site: { href: "https://kanapaha.org/", label: "Kanapaha" },
      },
      {
        id: "leu",
        name: "Harry P. Leu Gardens",
        drive: "About 1 hour 15 minutes · Orlando",
        who: "Roses and a lake",
        image: "/graphics/day-trips/leu.jpg",
        blurb: "Orlando’s city garden on Lake Rowena. Formal beds, big trees, and a house tour when it is open.",
        more: "Leu Gardens is 50 acres on a lake inside Orlando. It is an easy, beautiful walk with camellias, roses, and a historic house. It is not a hike. Parking is on site. It is a good ‘we are already on this side of town’ garden if someone also wants Winter Park.",
        tips: ["The house tour is separate. Ask at the gate.", "Summer midday is hot even in a garden.", "City of Orlando runs it, not the state park system."],
        query: "Harry P. Leu Gardens Orlando",
        site: { href: "https://www.leugardens.org/", label: "Leu Gardens" },
      },
      {
        id: "mead",
        name: "Mead Botanical Garden",
        drive: "About 1 hour 15 minutes · Winter Park",
        who: "A free stroll",
        image: "/graphics/day-trips/mead.jpg",
        blurb: "A free city garden in Winter Park. Boardwalks, a wetland, and no ticket line.",
        more: "Mead Garden is the low-key Winter Park walk: wetland boardwalks, open lawn, and no admission. It will not replace Bok Tower. It will give you an hour outside without a transaction. Park, walk, and go eat in Winter Park if the group still has opinions.",
        tips: ["Free, so a state park pass is irrelevant.", "Pair it with lunch in Winter Park.", "It is a city park. Amenities are simple."],
        query: "Mead Botanical Garden Winter Park Florida",
      },
      {
        id: "ravine",
        name: "Ravine Gardens",
        drive: "About 1 hour 45 minutes · Palatka",
        who: "Azaleas, if you time it",
        image: "/graphics/day-trips/ravine.jpg",
        blurb: "A state-park ravine planted with azaleas. Spectacular when they bloom. A pleasant walk when they do not.",
        more: "Ravine Gardens State Park is a steep little canyon, for Florida, full of azaleas above the St. Johns in Palatka. Bloom season is the famous visit, usually late winter. The rest of the year it is still a shaded walk and a look at the river. Do not promise a wall of pink in August.",
        tips: ["Ask about bloom before you sell the family on azaleas.", "The paths have slopes. This is not a flat village sidewalk.", "A state park pass covers entry."],
        query: "Ravine Gardens State Park Palatka",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/ravine-gardens-state-park", label: "State park site" },
      },
      {
        id: "washington-oaks",
        name: "Washington Oaks",
        drive: "About 1 hour 45 minutes · Palm Coast",
        who: "Gardens and a rocky shore",
        image: "/graphics/day-trips/washington.jpg",
        blurb: "Formal gardens on one side of A1A and a coquina beach on the other.",
        more: "Washington Oaks Gardens State Park is two visits in one stop: ornamental gardens under the oaks, and a shoreline of coquina rock across the road. It is a pleasant add-on if you are already aimed at the Flagler coast. It is not worth a special azalea promise. It is worth the walk.",
        tips: ["See both sides of A1A. The beach is the surprise.", "The rocks are slippery.", "About an hour and forty-five minutes. Combine it with a beach only if you started early."],
        query: "Washington Oaks Gardens State Park Florida",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/washington-oaks-gardens-state-park", label: "State park site" },
      },
      {
        id: "mckee",
        name: "McKee Botanical Garden",
        drive: "About 2 hours 15 minutes · Vero Beach",
        who: "A garden on the way to the Atlantic",
        image: "/graphics/day-trips/mckee.jpg",
        blurb: "A historic garden in Vero Beach. Combine it with a beach, or it is a long way to go for one path.",
        more: "McKee is an old Florida garden that was nearly lost and then restored. The paths, the pond, and the trees are the visit. Vero Beach is a bit over two hours, so the honest trip is garden plus beach, not garden and straight home. Tickets are on their site.",
        tips: ["Pair it with an ocean stop or it feels like a long drive.", "Tickets are separate from state parks.", "The garden is shaded. The beach after is not."],
        query: "McKee Botanical Garden Vero Beach",
        site: { href: "https://mckeegarden.org/", label: "McKee Garden" },
      },
      {
        id: "sunken",
        image: "/graphics/day-trips/sunken.jpg",
        name: "Sunken Gardens",
        drive: "About 2 hours · St. Petersburg",
        who: "A quirky old garden",
        blurb: "A sunk-down garden that has been a St. Petersburg attraction for a century. Flamingos included, when they are out.",
        more: "Sunken Gardens is a long-running roadside garden in St. Petersburg, planted in a sink. It is smaller and stranger than a modern botanical garden, which is the charm. St. Pete is about two hours. If you go, the Dalí museum or the pier can share the day. Do not try all three and the beach.",
        tips: ["One more stop in St. Pete, not three.", "Flamingos are animals, not a guarantee at the gate.", "Tickets are on their site."],
        query: "Sunken Gardens St. Petersburg Florida",
        site: { href: "https://sunkengardens.org/", label: "Sunken Gardens" },
      },
      {
        id: "selby",
        name: "Marie Selby Botanical Gardens",
        drive: "About 2 hours 30 minutes · Sarasota",
        who: "Orchids, if you leave early",
        image: "/graphics/day-trips/garden.jpg",
        blurb: "Sarasota’s garden, famous for orchids and banyans. A long day. Worth it if Sarasota was already the plan.",
        more: "Selby is on the bay in downtown Sarasota, with a downtown campus and a second site for some shows. Orchids and huge banyan trees are the reputation. Two and a half hours each way is the edge of a day trip. Go because you want Sarasota, and let the garden be the reason you got in the car.",
        tips: ["Leave early.", "Downtown parking is part of the plan.", "Confirm which campus has the exhibit you want."],
        query: "Marie Selby Botanical Gardens Sarasota",
        site: { href: "https://selby.org/", label: "Selby Gardens" },
      },
      {
        id: "maclay",
        name: "Maclay Gardens",
        drive: "About 3 hours · Tallahassee",
        who: "Only if Wakulla is the day",
        image: "/graphics/day-trips/bok.jpg",
        blurb: "Tallahassee’s formal gardens. Too far to be its own day unless you are already going to Wakulla Springs.",
        more: "Alfred B. Maclay Gardens State Park is a beautiful formal garden north of Tallahassee. It is about three hours from The Villages. The only sensible way to see it in a day is to pair it with Wakulla Springs and leave at dawn, or to stay over. On its own it is a long way to drive for a walk, however pretty the camellias are.",
        tips: ["Do not drive it as a casual afternoon.", "Pair with Wakulla or stay the night.", "Bloom season is the famous visit. Ask first."],
        query: "Maclay Gardens State Park Tallahassee",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/alfred-b-maclay-gardens-state-park", label: "State park site" },
      },
      {
        id: "kraft",
        name: "Kraft Azalea Garden",
        drive: "About 1 hour 15 minutes · Winter Park",
        who: "A free half hour",
        image: "/graphics/day-trips/garden.jpg",
        blurb: "A small free garden on Lake Maitland. Azaleas in late winter. A quiet shore the rest of the year.",
        more: "Kraft Azalea Garden is a tiny Winter Park park on the lake, free to walk, with cypress and azaleas. It is not a destination by itself unless the blooms are on. It is a graceful add-on to Mead Garden or Leu Gardens the same day. Do not sell the family on a wall of pink in August.",
        tips: ["Free. No ticket line.", "Ask about azalea timing before you promise pink.", "Combine it with Mead or lunch in Winter Park."],
        query: "Kraft Azalea Garden Winter Park Florida",
      },
      {
        id: "wilmot",
        name: "Wilmot Botanical Gardens",
        drive: "About 1 hour 20 minutes · Gainesville",
        who: "A free campus walk",
        image: "/graphics/day-trips/bok.jpg",
        blurb: "The University of Florida’s garden. Free, shaded, and an easy add to Kanapaha if the legs still work.",
        more: "Wilmot Botanical Gardens sits on the UF campus in Gainesville. It is a teaching garden, open to the public, and it will not replace Kanapaha for size. It will give you a second, quieter loop and a place to sit. Campus parking is the annoying part. Read the garden’s note on where visitors may leave the car.",
        tips: ["Free admission. Parking is the puzzle.", "Pair with Kanapaha rather than driving up for this alone.", "Paths are gentler than a state-park ravine."],
        query: "Wilmot Botanical Gardens University of Florida",
      },
      {
        id: "flbg",
        name: "Florida Botanical Gardens",
        drive: "About 2 hours 15 minutes · Largo",
        who: "Gardens on the way to the Gulf",
        image: "/graphics/day-trips/garden.jpg",
        blurb: "Pinellas County’s garden in Largo. Combine it with a beach, or it is a long way for one path.",
        more: "Florida Botanical Gardens shares a campus with Heritage Village in Largo, inland from the Pinellas beaches. The walks are the visit: demonstration beds, a wedding garden, and enough shade to matter. Two and a quarter hours means you either leave early and add Clearwater or St. Pete, or you admit it is a garden day and skip the third stop. Admission has been free at the gardens themselves. Confirm that, and confirm parking, on the county page.",
        tips: ["Pair it with one beach, not three.", "Confirm whether the gate is still free.", "Heritage Village next door is the indoor-ish second stop."],
        query: "Florida Botanical Gardens Largo",
        site: { href: "https://www.flbgfoundation.org/visit", label: "Gardens visit page" },
      },
      {
        id: "heathcote",
        name: "Heathcote Botanical Gardens",
        drive: "About 2 hours 15 minutes · Fort Pierce",
        who: "A garden before the Atlantic",
        image: "/graphics/day-trips/butterfly.jpg",
        blurb: "A small garden in downtown Fort Pierce. The honest trip is garden plus a beach.",
        more: "Heathcote is a volunteer-run garden in Fort Pierce, a bit over two hours toward the Atlantic. It is prettier than it is large. The day works if you also want the Fort Pierce inlet or a quiet beach and you do not also try to reach Miami. Tickets and hours are on the garden’s site.",
        tips: ["One beach after, then home.", "Tickets are separate from state parks.", "Two hours and fifteen minutes. Start before the heat."],
        query: "Heathcote Botanical Gardens Fort Pierce",
        site: { href: "https://heathcotebotanicalgardens.org/", label: "Heathcote" },
      },
      {
        id: "peace-river-garden",
        name: "Peace River Botanical Gardens",
        drive: "About 2 hours 45 minutes · Punta Gorda",
        who: "Sculpture and a long drive",
        image: "/graphics/day-trips/bok.jpg",
        blurb: "Gardens and outdoor sculpture west of Punta Gorda. A longer day. Leave in the morning.",
        more: "Peace River Botanical & Sculpture Gardens is a newer garden on the way toward Punta Gorda, with paths and large sculpture rather than a historic estate. It is about two hours and forty-five minutes. That is a dawn departure if you want to walk slowly and still be home for a late supper. Tickets are on their site. Do not add a Gulf beach and call it casual.",
        tips: ["Leave in the morning.", "This is the stop. Do not stack two more towns on it.", "Confirm hours. A new garden’s schedule moves."],
        query: "Peace River Botanical and Sculpture Gardens Punta Gorda",
      },
      {
        id: "edison",
        name: "Edison and Ford Estates",
        drive: "About 3 hours · Fort Myers",
        who: "Gardens with a history ticket",
        image: "/graphics/day-trips/garden.jpg",
        blurb: "The botanical garden around Edison’s and Ford’s winter homes. A long day, and one of the great Florida walks if you commit to it.",
        more: "Edison and Ford Winter Estates in Fort Myers is a garden first and a house tour second: banyans, a botanical collection Edison planted, and the two houses. It is about three hours. Leave at dawn, tour the garden, and resist the urge to add a beach and a mall. Tickets and which houses are open are on the estate site. This is a committed day, in the same family as Wakulla.",
        tips: ["Leave at dawn.", "The garden is the part that matches this list. The houses are the bonus.", "Three hours each way. One stop."],
        query: "Edison and Ford Winter Estates Fort Myers",
        site: { href: "https://www.edisonfordwinterestates.org/", label: "Edison and Ford" },
      },
      {
        id: "naples-garden",
        name: "Naples Botanical Garden",
        drive: "About 3 hours 15 minutes · Naples",
        who: "Only if Naples was the plan",
        image: "/graphics/day-trips/garden.jpg",
        blurb: "A large garden in Naples. Too far for an afternoon. Worth the dawn start if the group wants Naples anyway.",
        more: "Naples Botanical Garden is one of the polished gardens in the state, with Caribbean and Florida gardens on a big site. It is also more than three hours from The Villages. Go because you want a Naples day, walk the garden in the cooler hours, and head home before you invent a second city. Tickets are on their site.",
        tips: ["This is a dawn departure.", "Downtown Naples can share the day. A beach and a second museum cannot.", "Check the ticket page. Hours change with the season."],
        query: "Naples Botanical Garden Florida",
        site: { href: "https://www.naplesgarden.org/", label: "Naples Botanical Garden" },
      },
      {
        id: "mounts",
        name: "Mounts Botanical Garden",
        drive: "About 3 hours 15 minutes · West Palm Beach",
        who: "A long day on the southeast coast",
        image: "/graphics/day-trips/bok.jpg",
        blurb: "Palm Beach County’s garden. Beautiful, and a dawn trip. Do not combine it with Miami.",
        more: "Mounts Botanical Garden is the county garden in West Palm Beach. The plants are the visit, and the drive is the commitment: about three hours and fifteen minutes. It pairs with one Palm Beach stop if you leave early. It does not pair with Fairchild, Morikami, and the beach. Pick this coast or the Miami coast.",
        tips: ["Leave at dawn.", "One extra stop, then home.", "County garden. Tickets are on their site."],
        query: "Mounts Botanical Garden West Palm Beach",
        site: { href: "https://www.mounts.org/", label: "Mounts Garden" },
      },
      {
        id: "morikami",
        image: "/graphics/day-trips/morikami.jpg",
        name: "Morikami Museum and Gardens",
        drive: "About 3 hours 40 minutes · Delray Beach",
        who: "A Japanese garden, if you leave at dawn",
        blurb: "Museum and Japanese gardens west of Delray. One of the finest in the state, and a very long day.",
        more: "Morikami is a Japanese garden and museum in western Delray Beach. The paths, the lake, and the bonsai are why people make the drive. From The Villages that drive is nearly four hours. This is a dawn departure or an overnight, in the same breath as Butterfly World. The museum half is a welcome air-conditioned break. Tickets are on their site.",
        tips: ["Leave at dawn or stay over.", "Do not add a cruise port the same day.", "The museum and the garden are one visit. Allow the time."],
        query: "Morikami Museum and Japanese Gardens Delray Beach",
        site: { href: "https://morikami.org/", label: "Morikami" },
      },
      {
        id: "fairchild",
        image: "/graphics/day-trips/fairchild.jpg",
        name: "Fairchild Tropical Botanic Garden",
        drive: "About 3 hours 50 minutes · Coral Gables",
        who: "The far edge of a day",
        blurb: "Miami’s great tropical garden. Palms, a tropical rain, and a drive that only works if you leave before breakfast.",
        more: "Fairchild Tropical Botanic Garden in Coral Gables is the tropical collection people mean when they say Florida has a world-class garden. It is also nearly four hours from The Villages, past the polite edge of a day trip. Leave before breakfast, walk the garden, and come home. Butterfly World is a similar drive in a similar direction. Do not do both. Do not add South Beach. If the group wants to stay in Miami, that is a wiser plan than pretending the Turnpike is short.",
        tips: ["This is a leave-at-dawn day, or an overnight.", "One garden. Fairchild or Morikami or Butterfly World.", "Tickets and tram rides are on their site."],
        query: "Fairchild Tropical Botanic Garden Coral Gables",
        site: { href: "https://fairchildgarden.org/", label: "Fairchild Garden" },
      },
    ],
  },
  {
    id: "odd",
    title: "Butterfly houses, caverns, and the odd yes",
    image: "/graphics/day-trips/butterfly.jpg",
    lead: "The places people mention by name.",
    places: [
      {
        id: "butterfly",
        name: "Butterfly World",
        drive: "About 3 hours 45 minutes · Coconut Creek",
        who: "A long day for the grandkids",
        image: "/graphics/day-trips/butterfly.jpg",
        blurb: "A huge walk-through butterfly house and gardens north of Fort Lauderdale. Beautiful, and a real drive.",
        more: "Butterfly World in Coconut Creek is one of the largest butterfly parks in the country: aviaries you walk through, a garden, and a museum side. It is also nearly four hours from The Villages, in the same league as a Miami day. Leave early, or stay the night in Broward. It is a genuine grandkid delight and a poor plan if someone also wants the beach and a cruise port the same day.",
        tips: ["This is a long day. Leave early.", "Wings are fragile. The rules about touching are serious.", "Tickets are on their site. Hours change."],
        query: "Butterfly World Coconut Creek Florida",
        site: { href: "https://www.butterflyworld.com/", label: "Butterfly World" },
      },
      {
        id: "dinoworld",
        image: "/graphics/day-trips/dinoworld.jpg",
        name: "Dinosaur World",
        drive: "About 1 hour 20 minutes · Plant City",
        who: "Grandkids who like dinosaurs",
        blurb: "A walk through a field of dinosaur statues off I-4. Not a museum. Exactly what a seven-year-old hopes.",
        more: "Dinosaur World is a roadside park between Orlando and Tampa: outdoor statues, a playground, and fossil digs. It is not science camp. It is a happy hour or two with children who want dinosaurs bigger than the golf cart. Plant City is about an hour and twenty minutes. Combine it with a Lakeland stop only if the kids still have patience left.",
        tips: ["Outdoor and sunny. Hats.", "It is statues and play, not a zoo.", "Tickets are at the gate or their site."],
        query: "Dinosaur World Plant City Florida",
        site: { href: "https://www.dinosaurworld.com/", label: "Dinosaur World" },
      },
      {
        id: "solomons",
        image: "/graphics/day-trips/solomons.jpg",
        name: "Solomon’s Castle",
        drive: "About 2 hours · Ona",
        who: "A strange beautiful detour",
        blurb: "A homemade castle of printing plates in the swamp, with a restaurant in a boat. Odd, and worth it once.",
        more: "Solomon’s Castle is an artist-built castle near Ona, west of Arcadia, skinned in old printing plates. Tours run on the owner’s schedule, and the restaurant sits in a boat-shaped building. It is about two hours and it is not on the way to anything else you had planned. That is the recommendation. Check that they are open before you go. This is a private attraction, not a park.",
        tips: ["Confirm they are open. The schedule is part of the charm and the risk.", "Two hours. Do not tack it onto Miami.", "Tours are how you see the inside."],
        query: "Solomon's Castle Ona Florida",
        site: { href: "https://www.solomonscastle.com/", label: "Solomon’s Castle" },
      },
      {
        id: "millhopper",
        image: "/graphics/day-trips/millhopper.jpg",
        name: "Devil’s Millhopper",
        drive: "About 1 hour 15 minutes · Gainesville",
        who: "A sink you walk into",
        blurb: "A geological state park: a huge sinkhole with a boardwalk to the bottom. No swimming. A lot of ferns.",
        more: "Devil’s Millhopper is the dry cousin of Devil’s Den. It is a state park in Gainesville built around a giant sink, with a boardwalk that drops into the bottom where small springs seep out of the wall. You look. You do not snorkel. The staircase is the workout, and it is real stairs, not a village sidewalk. Pair it with Kanapaha or the Florida Museum if you want a full Gainesville day.",
        tips: ["Stairs. This is not a stroller-friendly boil.", "No swimming. The visit is the walk down and the walk up.", "A state park pass covers entry."],
        query: "Devil's Millhopper Geological State Park Gainesville",
        site: { href: "https://www.floridastateparks.org/parks-and-trails/devils-millhopper-geological-state-park", label: "State park site" },
      },
    ],
  },
];

export function DayTripsGuide() {
  const sections = [...GROUPS, ...MORE];
  const [openId, setOpenId] = useState<string | null>(null);
  const open = sections.flatMap((group) => group.places).find((place) => place.id === openId) || null;

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
            {sections.map((group) => (
              <a key={group.id} className="btn btn-ghost btn-sm" href={`#${group.id}`}>
                {group.title}
              </a>
            ))}
            <a className="btn btn-ghost btn-sm" href="#trip-drive">When to leave</a>
            <a className="btn btn-ghost btn-sm" href="#trip-cards">The short list</a>
            <a className="btn btn-ghost btn-sm" href="#trip-kids">Grandkids</a>
            <a className="btn btn-ghost btn-sm" href="#trip-season">The month</a>
            <a className="btn btn-ghost btn-sm" href="#trip-senior">Benches</a>
            <a className="btn btn-ghost btn-sm" href="#trip-dinner">Dinner</a>
            <a className="btn btn-ghost btn-sm" href="#trip-pack">Packing</a>
            <a className="btn btn-ghost btn-sm" href="#trip-weather">Storms</a>
            <a className="btn btn-ghost btn-sm" href="#trip-photos">Photos</a>
          </div>
          <div className="golf-feature-grid">
            {sections.map((group) => (
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

      <TripDay />

      {sections.map((group) => (
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
