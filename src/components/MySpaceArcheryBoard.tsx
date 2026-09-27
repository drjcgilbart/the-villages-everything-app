function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Spot = {
  name: string;
  where: string;
  drive: string;
  blurb: string;
  query: string;
  href?: string;
  hrefLabel?: string;
};

const RANGES: Spot[] = [
  {
    name: "Shooters World",
    where: "4988 County Road 44A · The Villages",
    drive: "In town",
    blurb:
      "The indoor range on County Road 44A. Their page describes 15-yard, 25-yard, and 100-yard lanes, a shop, and classes. Range time is a fee. Hours on their site have been 10 a.m. to 7 p.m. Sunday through Friday and 9 a.m. to 7 p.m. Saturday — confirm, because they stop new shooters before the door locks. Phone (352) 500-4867.",
    query: "Shooters World 4988 County Road 44A The Villages Florida",
    href: "https://shootersworld.com/shooting-range-gun-store-locations/the-villages-indoor-shooting-range/",
    hrefLabel: "Shooters World",
  },
  {
    name: "Tenoroc Public Shooting Range",
    where: "3755 Tenoroc Mine Road · Lakeland",
    drive: "About 1 hour 20 minutes",
    blurb:
      "FWC’s supervised outdoor range. Rifle, handgun, sporting clays, trap, a 5-stand, air rifle, and archery. FWC lists the rifle and handgun day fee at $12 plus tax, and the same idea for archery only. Youth 15 and under are free with a paying adult 21 or older. Sporting clays are listed at $38 per 100 targets. Read the range page the week you go. Phone (863) 606-0093.",
    query: "Tenoroc Public Shooting Range Lakeland Florida",
    href: "https://myfwc.com/hunting/safety-education/shooting-ranges/tenoroc/",
    hrefLabel: "FWC range page",
  },
  {
    name: "Ridge Archers 3-D course",
    where: "Same gate as Tenoroc · Lakeland",
    drive: "About 1 hour 20 minutes",
    blurb:
      "A nonprofit 3-D archery course on the Tenoroc property. Check in through the FWC office unless you are on a club event. Broadheads stay off the practice course. Membership is separate from the day fee, and the club posts it on their own site.",
    query: "Ridge Archers Tenoroc Mine Road Lakeland",
    href: "https://ridgearchersattenoroc.com/",
    hrefLabel: "Ridge Archers",
  },
  {
    name: "Ocala Shooting Range",
    where: "Forest Road 11, north of State Road 40",
    drive: "About 50 minutes · Ocala National Forest",
    blurb:
      "FWC’s unsupervised range in the national forest. Rifle and handgun lanes, plus a self-throw shotgun pad. Free. Open sunrise to sunset, and closed Wednesday until 2 p.m. Bring your own targets. Nobody is there to call the line for you. Phone (352) 625-2804.",
    query: "Ocala Shooting Range Forest Road 11 Ocala National Forest",
    href: "https://myfwc.com/hunting/safety-education/shooting-ranges/ocala/",
    hrefLabel: "FWC range page",
  },
  {
    name: "Shooters World Orlando",
    where: "4850 Lawing Lane · Orlando",
    drive: "About 1 hour 20 minutes",
    blurb:
      "The same company’s Orlando store, useful when the Villages lanes are full. Indoor, fee, and a longer drive than County Road 44A. Confirm hours on their site.",
    query: "Shooters World 4850 Lawing Lane Orlando Florida",
    href: "https://shootersworld.com/",
    hrefLabel: "Shooters World",
  },
];

export function MySpaceArcheryBoard() {
  return (
    <div className="ms-boat">
      <div className="ms-boat-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/graphics/outdoors/archery.jpg"
          alt="Cartoon grandfather teaching a child archery while shooters practice on a supervised range"
          className="ms-boat-mascot"
        />
        <div className="ms-boat-hero-copy">
          <span className="kicker">Eyes, ears, and a posted rule</span>
          <p>
            Places to shoot and loose a few arrows within a day’s drive, plus
            the paperwork an outdoorsman actually needs. Fees and seasons
            change. The official page beats a neighbor’s memory.
          </p>
        </div>
      </div>

      <div className="ms-boat-jump">
        <a className="btn btn-ghost btn-sm" href="#ms-arch-ranges">Ranges</a>
        <a className="btn btn-ghost btn-sm" href="#ms-arch-bow">Archery</a>
        <a className="btn btn-ghost btn-sm" href="#ms-arch-woods">Woods and licenses</a>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-ranges">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Places to shoot</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Drive times are from the middle of The Villages. FWC’s statewide list
        is the backup when a gate is locked.
      </p>
      <div className="ms-boat-grid">
        {RANGES.map((spot) => (
          <article key={spot.name} className="about-panel ms-boat-card">
            <p className="ms-boat-meta">{spot.drive}</p>
            <h3>{spot.name}</h3>
            <p className="ms-boat-meta">{spot.where}</p>
            <p>{spot.blurb}</p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-sm" href={mapsSearch(spot.query)} target="_blank" rel="noopener noreferrer">
                Open in maps
              </a>
              {spot.href ? (
                <a className="btn btn-ghost btn-sm" href={spot.href} target="_blank" rel="noopener noreferrer">
                  {spot.hrefLabel}
                </a>
              ) : null}
            </div>
          </article>
        ))}
        <article className="about-panel ms-boat-card">
          <h3>Every public range</h3>
          <p>
            FWC posts the other state ranges, including ones farther toward
            Orlando and the coasts. WhereToShoot.org is the wider directory
            when you want a club that is not on the state list. Read the
            safety page before the first visit. Eyes and ears are not optional,
            and a cold range means the muzzle stays in a safe direction until
            the line is called.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="https://myfwc.com/hunting/safety-education/shooting-ranges/" target="_blank" rel="noopener noreferrer">
              FWC ranges
            </a>
            <a className="btn btn-ghost btn-sm" href="https://myfwc.com/hunting/safety-education/shooting-ranges/safety-rules/" target="_blank" rel="noopener noreferrer">
              Safety rules
            </a>
            <a className="btn btn-ghost btn-sm" href="https://www.wheretoshoot.org/" target="_blank" rel="noopener noreferrer">
              Where to shoot
            </a>
          </div>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-bow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Archery</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>Inside The Villages</h3>
          <p>
            Recreation centers run archery on their own schedules. That is a
            resident activity, not a public gun range, and it does not have a
            single clubhouse address worth inventing. Open Rec Centers and
            read the current board.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="/rec-centers">
              Rec Centers
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Tenoroc and Ridge Archers</h3>
          <p>
            The known-distance and elevated archery at Tenoroc is the FWC
            side. The woods course is Ridge Archers. One driveway, two sets of
            rules. Pay the day fee or show the membership card they ask for,
            and leave broadheads at home unless the event says otherwise.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://ridgearchersattenoroc.com/" target="_blank" rel="noopener noreferrer">
              Ridge Archers
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>A club that is not on this list</h3>
          <p>
            USA Archery and the Florida Archery Association keep club finders.
            Use those when you want a league closer than Lakeland. A range
            that will not publish an address on its own site does not get one
            from this page.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://www.usarchery.org/" target="_blank" rel="noopener noreferrer">
              USA Archery
            </a>
          </div>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-woods">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/juniper.jpg" alt="" />
        <h3 className="my-space-block-title">Licenses, woods, and a calm morning</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>The 65-and-over question</h3>
          <p>
            Florida residents 65 and older are generally exempt from the basic
            hunting license and from the basic freshwater and saltwater fishing
            licenses. That does not automatically cover a wildlife management
            area permit, a deer permit, a turkey permit, or a migratory-bird
            permit. Bring ID that shows your age and Florida residency, and
            confirm this year’s line on MyFWC before you buy the wrong stamp
            or skip the right one.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="https://myfwc.com/license/recreational/" target="_blank" rel="noopener noreferrer">
              MyFWC licenses
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Hunter safety</h3>
          <p>
            A hunter-safety card is still required for many people, and the
            cutoff is a birth date on the MyFWC page, not a haircut. Read that
            page before you assume you are exempt. The same site has the
            course if you need it. New to the woods entirely? FWC’s getting
            started pages are the orientation. This one is not a hunting
            lesson.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://myfwc.com/hunting/safety-education/" target="_blank" rel="noopener noreferrer">
              Hunter safety
            </a>
            <a className="btn btn-ghost btn-sm" href="https://myfwc.com/hunting/get-started/" target="_blank" rel="noopener noreferrer">
              New to hunting
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Ocala and the other WMAs</h3>
          <p>
            Ocala Wildlife Management Area is the big public hunting ground
            next door, inside the national forest. Seasons, quota hunts, dog
            rules, and which roads are open change every year. The brochure
            on MyFWC is the map. A pretty forest road is not an invitation.
            Other areas show up in the same finder when you want a different
            county.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="https://myfwc.com/hunting/" target="_blank" rel="noopener noreferrer">
              MyFWC hunting
            </a>
            <a className="btn btn-ghost btn-sm" href={mapsSearch("Ocala Wildlife Management Area Florida")} target="_blank" rel="noopener noreferrer">
              Ocala WMA
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Clays before the season</h3>
          <p>
            Tenoroc’s sporting clays, trap, and 5-stand are the public way to
            swing at a bird that does not have a season. The per-target price
            is on the FWC page and it is separate from the rifle day fee.
            Rental guns, if they have them that day, are also posted there.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>The Ocala range is unstaffed</h3>
          <p>
            If you use the forest range, you bring the targets, you keep the
            muzzle safe, and you leave when the sign says Wednesday morning
            is closed. Follow the forest and FWC rules for how a firearm rides
            in the car on the way in. The phone on the range page is (352)
            625-2804 if the gate does not match what you expected.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Boats and fish</h3>
          <p>
            Ramps, bass water, and the saltwater license notes live on the
            Boating/Fishing tool. The license exemption for residents 65 and
            older is the same family of rule, and it still has exceptions.
            Read it there before the cooler gets ice.
          </p>
        </article>
      </div>
    </div>
  );
}
