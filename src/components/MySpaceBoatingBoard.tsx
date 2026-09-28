import { BoatingDesk } from "@/components/BoatingDesk";

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Spot = {
  name: string;
  where: string;
  drive: string;
  blurb: string;
  query: string;
};

const RAMPS: Spot[] = [
  {
    name: "Coleman Landing",
    where: "Lake Panasoffkee · Sumter County",
    drive: "About 20 minutes north",
    blurb:
      "A public ramp on the lake Villages anglers actually talk about. Largemouth most of the year, speckled perch when the water cools.",
    query: "Coleman Landing boat ramp Lake Panasoffkee Florida",
  },
  {
    name: "Marsh Bend Outlet Park",
    where: "Lake Panasoffkee outlet",
    drive: "About 20 minutes north",
    blurb:
      "County ramp where the lake squeezes toward the outlet. A useful second launch when Coleman Landing’s lot is full of trailers.",
    query: "Marsh Bend Outlet Park boat ramp Lake Panasoffkee",
  },
  {
    name: "Lake Okahumpka Park",
    where: "Wildwood · Lake Okahumpka",
    drive: "About 15 minutes west",
    blurb:
      "The close-in lake. A real park and ramp, not a golf-course pond. Fine for a short evening cast after the cart is parked.",
    query: "Lake Okahumpka Park boat ramp Wildwood Florida",
  },
  {
    name: "Hernando boat ramp",
    where: "Tsala Apopka · Hernando pool",
    drive: "About 25 minutes northwest",
    blurb:
      "Public launch into the Hernando pool of the Tsala Apopka chain. Canals, pads, and bass water without a gulf drive.",
    query: "Hernando Public Boat Ramp Tsala Apopka Florida",
  },
  {
    name: "Duval Island ramp",
    where: "Floral City pool · Tsala Apopka",
    drive: "About 35 minutes northwest",
    blurb:
      "Puts you on the Floral City side of the chain. A good hop if you want to poke canals instead of one round lake.",
    query: "Duval Island Public Boat Ramp Floral City Florida",
  },
  {
    name: "Venetian Gardens",
    where: "Lake Harris · Leesburg",
    drive: "About 30 minutes east",
    blurb:
      "City park ramp on the Harris Chain. Big water, a real parking lot, and lunch in Leesburg when the bite dies.",
    query: "Venetian Gardens Public Boat Ramp Leesburg Florida",
  },
  {
    name: "Fort Island Gulf Beach",
    where: "Crystal River · the Gulf",
    drive: "About 50 minutes west",
    blurb:
      "The saltwater ramp. Redfish, trout, and the summer scallop boats stage here. Check the ramp lot before a holiday weekend.",
    query: "Fort Island Gulf Beach boat ramp Crystal River Florida",
  },
  {
    name: "MacRae’s boat ramp",
    where: "Homosassa River",
    drive: "About an hour west",
    blurb:
      "Public ramp on the Homosassa. A longer haul than Panasoffkee, and the river is the payoff: tides, mangroves, and a shot at the Gulf.",
    query: "Duncan J MacRae Public Boat Ramp Homosassa Florida",
  },
];

const TRIPS: Spot[] = [
  {
    name: "Lake Sumter Landing by pontoon",
    where: "Inside The Villages · Lake Sumter",
    drive: "In town",
    blurb:
      "The sanctioned way to see a town square from the water. Rent the landing’s pontoon. Neighborhood ponds and golf-course lakes are not a private-boat trail.",
    query: "Lake Sumter Landing The Villages Florida",
  },
  {
    name: "Panasoffkee at first light",
    where: "Lake Panasoffkee",
    drive: "About 20 minutes",
    blurb:
      "Shallow natural lake. Bass on the pads in warm months, speckled perch in the cold ones. Be off before the afternoon boom.",
    query: "Lake Panasoffkee Florida",
  },
  {
    name: "Tsala canal hop",
    where: "Hernando to Floral City",
    drive: "About 25–40 minutes",
    blurb:
      "Three pools tied by canals. Idle through the cuts, fish the pads, and don’t trust a shortcut you have not run in daylight.",
    query: "Tsala Apopka Chain of Lakes Florida",
  },
  {
    name: "Rainbow River drift",
    where: "Dunnellon",
    drive: "About 40 minutes",
    blurb:
      "Spring water you can see the bottom through. Kayaks and tubes from KP Hole. Motors are limited. This is a drift, not a bass-boat lake.",
    query: "KP Hole County Park Rainbow River Dunnellon",
  },
  {
    name: "Inglis and Lake Rousseau",
    where: "Withlacoochee · the barge canal",
    drive: "About 45 minutes",
    blurb:
      "Bass on Rousseau, then the Inglis lock if you want the canal toward the Gulf. Check lock hours before you point the bow that way.",
    query: "Inglis Lock Lake Rousseau Florida boat ramp",
  },
  {
    name: "Kings Bay manatees",
    where: "Crystal River",
    drive: "About 50 minutes",
    blurb:
      "Winter gathers the manatees in the springs. Idle speed, no chasing, no crowding the animals. Look, then go fish the river.",
    query: "Kings Bay Crystal River Florida boat ramp",
  },
];

const SEASONS = [
  {
    title: "Winter",
    text: "Speckled perch on Panasoffkee and the Harris Chain. Sheepshead show up in the rivers. Dress like the dawn is January, because it is.",
  },
  {
    title: "Spring",
    text: "Bass move shallow on Tsala and Panasoffkee. Afternoon storms are still a rumor. Mornings are the whole plan.",
  },
  {
    title: "Summer",
    text: "Be on the ramp early and off before the lightning. Citrus County scalloping is a summer fishery offshore — open only on the dates FWC posts.",
  },
  {
    title: "Fall",
    text: "Water cools, bass wake up, and the gulf is calmer than July. A fine time to learn a new ramp before the specks arrive.",
  },
];

export function MySpaceBoatingBoard() {
  return (
    <div className="ms-boat">
      <div className="ms-boat-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/graphics/boating/mascot.jpg"
          alt="Golf-ball mascot with a fishing hat, a rod, and a bass"
          className="ms-boat-mascot"
        />
        <div className="ms-boat-hero-copy">
          <span className="kicker">Just outside the gates</span>
          <p>
            Ramps, bass water, a pontoon at the square, and the gulf when you
            want salt on the console. The pictures are ours. The water is real.
          </p>
        </div>
        <div className="ms-boat-hero-scenes">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/graphics/boating/ramp.jpg" alt="Cartoon sunrise at a lake boat ramp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/graphics/boating/pontoon.jpg" alt="Cartoon pontoon boat at a waterfront square" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/graphics/boating/bass.jpg" alt="Cartoon largemouth bass jumping by the lily pads" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/graphics/boating/gulf.jpg" alt="Cartoon fishing boat headed toward a gulf beach" />
        </div>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Water worth a trailer is just outside the gates. Golf-course lakes and
        village ponds stay off the hitch. Drive times are from the middle of
        The Villages, and ramps can close after a storm — look before you tow.
      </p>
      <div className="ms-boat-jump">
        <a className="btn btn-ghost btn-sm" href="#ms-boat-ramps">
          Boat ramps
        </a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-trips">
          By boat
        </a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-fish">
          What bites
        </a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-rules">
          Before you splash
        </a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-drive">When to leave</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-directory">Harris Chain and the river</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-report">Catches</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-wind">Wind</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-senior">Docks and ramps</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-pack">Packing</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-photos">Photos</a>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-ramps">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/ramp.jpg" alt="" />
        <h3 className="my-space-block-title">Boat ramps</h3>
      </div>
      <div className="ms-boat-grid">
        {RAMPS.map((spot) => (
          <article key={spot.name} className="about-panel ms-boat-card">
            <p className="ms-boat-meta">{spot.drive}</p>
            <h3>{spot.name}</h3>
            <p className="ms-boat-meta">{spot.where}</p>
            <p>{spot.blurb}</p>
            <div className="hero-actions">
              <a
                className="btn btn-primary btn-sm"
                href={mapsSearch(spot.query)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in maps
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="ms-boat-section-art" id="ms-boat-trips">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/pontoon.jpg" alt="" />
        <h3 className="my-space-block-title">Worth the launch</h3>
      </div>
      <div className="ms-boat-grid">
        {TRIPS.map((spot) => (
          <article key={spot.name} className="about-panel ms-boat-card">
            <p className="ms-boat-meta">{spot.drive}</p>
            <h3>{spot.name}</h3>
            <p className="ms-boat-meta">{spot.where}</p>
            <p>{spot.blurb}</p>
            <div className="hero-actions">
              <a
                className="btn btn-primary btn-sm"
                href={mapsSearch(spot.query)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in maps
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="ms-boat-section-art" id="ms-boat-fish">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/bass.jpg" alt="" />
        <h3 className="my-space-block-title">What bites when</h3>
      </div>
      <div className="ms-boat-grid">
        {SEASONS.map((row) => (
          <article key={row.title} className="about-panel ms-boat-card">
            <h3>{row.title}</h3>
            <p>{row.text}</p>
          </article>
        ))}
        <article className="about-panel ms-boat-card">
          <h3>The usual suspects</h3>
          <p>
            Fresh water: largemouth bass, speckled perch, bluegill, shellcracker,
            and the occasional catfish that was not invited. Salt water, once you
            clear the rivers: redfish, trout, mangrove snapper, and sheepshead
            in the cool months.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>A Villages morning</h3>
          <p>
            Summer thunder builds after lunch. If the sky goes pewter, the fish
            can wait. The same rule as the golf course: when you hear it, you
            are already late.
          </p>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-rules">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/springs.jpg" alt="" />
        <h3 className="my-space-block-title">Before you splash</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>License</h3>
          <p>
            Florida residents 65 and older are generally exempt from the basic
            recreational fishing license. Bring ID that shows your age and
            Florida residency. Snook, lobster, and a few other stamps are
            separate. Confirm this year’s rules before you wet a line.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-primary btn-sm"
              href="https://myfwc.com/license/recreational/"
              target="_blank"
              rel="noopener noreferrer"
            >
              MyFWC licenses
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Not the golf lakes</h3>
          <p>
            The ponds along the cart paths are scenery. Lake Sumter is for the
            landing’s pontoon, not a bass boat on a trailer. Tow to a county or
            city ramp on this page.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Scallops and the Gulf</h3>
          <p>
            Citrus County has a summer scallop season, and the dates move.
            Fort Island is the usual Villages launch. Read this year’s FWC
            notice before you buy a snorkel.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-ghost btn-sm"
              href="https://myfwc.com/fishing/saltwater/recreational/scallops/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FWC scallop rules
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Every ramp, official</h3>
          <p>
            FWC keeps the statewide ramp list, and it is the one to trust after
            a flood or a closed park road. Life jacket on, kill switch clipped,
            lights if you will still be out at dusk.
          </p>
          <div className="hero-actions">
            <a
              className="btn btn-ghost btn-sm"
              href="https://myfwc.com/boating/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FWC boating
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href={mapsSearch("public boat ramps near The Villages Florida")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ramps near home
            </a>
          </div>
        </article>
      </div>
      <BoatingDesk />
    </div>
  );
}
