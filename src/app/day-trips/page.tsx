import Image from "next/image";
import { PageHeroMascot } from "@/components/PageHeroMascot";

export const metadata = {
  title: "Day Trips & Fun Stuff",
  description:
    "Springs, beaches, animals, space, and small towns within a day’s drive of The Villages, Florida — for residents, their grown kids, and the grandkids.",
};

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Outing = {
  name: string;
  drive: string;
  who: string;
  blurb: string;
  query: string;
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
        name: "Rainbow Springs",
        drive: "About 40 minutes · Dunnellon",
        who: "Everybody",
        blurb:
          "Glass-clear river, a state park at the headspring, and a lazy paddle from KP Hole. Motors are limited. Grandkids will refuse to get out.",
        query: "Rainbow Springs State Park Dunnellon Florida",
      },
      {
        name: "Silver Springs",
        drive: "About 50 minutes · Ocala",
        who: "Everybody",
        blurb:
          "Glass-bottom boats on the Silver River, monkeys in the trees if you are lucky, and a walk that does not require a theme-park ticket.",
        query: "Silver Springs State Park Florida",
      },
      {
        name: "Weeki Wachee",
        drive: "About 1 hour 15 minutes",
        who: "Grandkids first",
        blurb:
          "Mermaids, a spring so blue it looks invented, and Buccaneer Bay when the water park is open for the season. Check the show schedule before you leave the villa.",
        query: "Weeki Wachee Springs State Park Florida",
      },
      {
        name: "De Leon Springs",
        drive: "About 1 hour",
        who: "Breakfast people",
        blurb:
          "You cook pancakes at the table in the old mill, then walk the spring run. Go early. The griddle line is a sport.",
        query: "De Leon Springs State Park Florida",
      },
      {
        name: "Juniper Springs",
        drive: "About 1 hour · Ocala National Forest",
        who: "A quieter day",
        blurb:
          "A round swimming spring in the national forest, with a short canoe run if the water is open. Bring cash for the iron ranger and a chair for the shade.",
        query: "Juniper Springs Recreation Area Florida",
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
        name: "Homosassa Springs Wildlife Park",
        drive: "About 1 hour",
        who: "Grandkids and anyone who likes Lu",
        blurb:
          "A state park with manatees under a floating observatory, native Florida animals, and Lu the hippopotamus, who has lived here longer than most villages.",
        query: "Ellie Schiller Homosassa Springs Wildlife State Park",
      },
      {
        name: "Blue Spring",
        drive: "About 1 hour · Orange City",
        who: "Winter mornings",
        blurb:
          "Manatees stack up in the run when the river is cold. Boardwalks, no chasing, and a thermos. Summer is for swimming, not the crowd of sea cows.",
        query: "Blue Spring State Park Orange City Florida",
      },
      {
        name: "Kings Bay",
        drive: "About 50 minutes · Crystal River",
        who: "A boat morning",
        blurb:
          "The in-town springs where manatees winter. Tour boats and kayaks are everywhere. Idle speed, and give the animals the whole canal.",
        query: "Kings Bay Crystal River Florida",
      },
      {
        name: "Gatorland",
        drive: "About 1 hour 15 minutes · Orlando",
        who: "Grandkids who asked",
        blurb:
          "The old-Florida gator park, not a golf-course pond with one shy reptile. Shows, a boardwalk, and a reminder that Florida was here first.",
        query: "Gatorland Orlando",
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
        name: "Kennedy Space Center",
        drive: "About 1 hour 45 minutes",
        who: "Kids, parents, and the rocket uncle",
        blurb:
          "Rockets, a shuttle, and the bus tour when it is running. One hall is enough if the little ones fade. The Atlantis building is the one they talk about in the cart on the way home.",
        query: "Kennedy Space Center Visitor Complex",
      },
      {
        name: "LEGOLAND Florida",
        drive: "About 1 hour 15 minutes · Winter Haven",
        who: "Younger grandkids",
        blurb:
          "Built for kids who still fit the rides. Water park add-on in warm months. Closer and calmer than a full Orlando park day.",
        query: "LEGOLAND Florida Winter Haven",
      },
      {
        name: "Walt Disney World",
        drive: "About 1 hour 15 minutes",
        who: "A planned invasion",
        blurb:
          "One park, not four. Pick it the night before, leave at dawn, and agree on the exit time while everyone is still cheerful.",
        query: "Walt Disney World Orlando",
      },
      {
        name: "Universal Orlando",
        drive: "About 1 hour 20 minutes",
        who: "Older grandkids and their parents",
        blurb:
          "The movie parks. Better for kids who have outgrown teacups. Still a full day, and the sun on the parking tram is personal.",
        query: "Universal Orlando Resort",
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
        name: "Mount Dora",
        drive: "About 50 minutes",
        who: "A stroll and a lake",
        blurb:
          "Hills, antiques, and a downtown that faces the water. Easy with adult kids. Ice cream is the grandkid strategy.",
        query: "Downtown Mount Dora Florida",
      },
      {
        name: "Micanopy",
        drive: "About 1 hour 10 minutes",
        who: "Antique people",
        blurb:
          "A short oak-shaded main street of shops under the canopy. Pair it with Payne’s Prairie if the group can stand one more stop.",
        query: "Downtown Micanopy Florida",
      },
      {
        name: "Cedar Key",
        drive: "About 1 hour 30 minutes",
        who: "Seafood and a dead-end road",
        blurb:
          "Old Florida on the Gulf, with a pier, an art walk, and clam chowder. The drive is the point. Stay for the sunset if the cart path can survive a late return.",
        query: "Cedar Key Florida",
      },
      {
        name: "St. Augustine",
        drive: "About 2 hours 15 minutes",
        who: "An early start",
        blurb:
          "The old city, the fort, and a beach on the way out. This is the far edge of a day trip. Leave at dawn or stay over.",
        query: "Historic downtown St. Augustine Florida",
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
        name: "Daytona Beach",
        drive: "About 1 hour 15 minutes",
        who: "Boardwalk and a drive on the sand",
        blurb:
          "The closest big beach. The pier and the Boardwalk are the grandkid version. Driving on the sand is allowed where it is marked — read the tide signs.",
        query: "Daytona Beach Boardwalk Florida",
      },
      {
        name: "New Smyrna Beach",
        drive: "About 1 hour 30 minutes",
        who: "A softer beach day",
        blurb:
          "Fewer neon lights than Daytona, a flag system for the surf, and a walkable downtown if the water is too rough.",
        query: "New Smyrna Beach Florida flagler avenue",
      },
      {
        name: "Clearwater Beach",
        drive: "About 2 hours",
        who: "A postcard afternoon",
        blurb:
          "White sand and a long pier. Go on a weekday. Sunset here is a commitment, not a quick cart-path loop.",
        query: "Clearwater Beach Florida",
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
        name: "Bok Tower Gardens",
        drive: "About 1 hour 15 minutes · Lake Wales",
        who: "A quiet beautiful hour",
        blurb:
          "A singing tower, formal gardens, and a hill that counts as a mountain in Florida. The carillon plays. Phones can wait.",
        query: "Bok Tower Gardens Lake Wales",
      },
      {
        name: "Don Garlits Museum",
        drive: "About 40 minutes · Ocala",
        who: "Grandpa, the son-in-law, and a willing grandchild",
        blurb:
          "Drag racing history in big indoor halls. Loud even when the cars are parked. One of the easiest yeses from the north gate.",
        query: "Don Garlits Museum of Drag Racing Ocala",
      },
      {
        name: "Payne’s Prairie",
        drive: "About 1 hour 20 minutes",
        who: "A boardwalk and maybe bison",
        blurb:
          "A wide savanna south of Gainesville. The observation tower is the whole workout. Bison are not guaranteed. The sky is.",
        query: "Paynes Prairie Preserve State Park",
      },
      {
        name: "Cassadaga",
        drive: "About 1 hour",
        who: "Curious adult kids",
        blurb:
          "A century-old spiritualist camp in the trees. Shops, a bookstore, and readings if someone in the cart is brave. Look, be polite, and don’t mock the neighbors.",
        query: "Cassadaga Florida spiritualist camp",
      },
    ],
  },
];

export default function DayTripsPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Home by bedtime</span>
            <h1>Day Trips &amp; Fun Stuff</h1>
            <p>
              Places a Villages neighbor can reach in a day — with the grown
              kids, the grandkids, or just the passenger who picks the music.
              Drive times start from the middle of town. Tickets, shows, and
              tides change. Check before you put the cart on the charger and
              steal the car.
            </p>
          </div>
          <PageHeroMascot
            src="/graphics/day-trips/mascot.jpg"
            alt="Golf-ball mascot with a sun hat, a map, and a cooler"
          />
        </div>
      </div>

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
                  <Image
                    src={group.image}
                    alt=""
                    width={640}
                    height={640}
                    className="golf-feature-img"
                  />
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
                <article key={place.name} className="about-panel ms-boat-card">
                  <p className="ms-boat-meta">{place.drive}</p>
                  <h3>{place.name}</h3>
                  <p className="ms-boat-meta">{place.who}</p>
                  <p>{place.blurb}</p>
                  <div className="hero-actions">
                    <a
                      className="btn btn-primary btn-sm"
                      href={mapsSearch(place.query)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in maps
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
