"use client";

import { useEffect, useState } from "react";
import { saveCapeReminder } from "@/lib/capeCalendar";
import { SpaceCoastDesk } from "@/components/SpaceCoastDesk";

function mapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

type Lookout = {
  name: string;
  kind: "Free" | "Fee" | "Closed";
  drive: string;
  blurb: string;
  query: string;
  href?: string;
  hrefLabel?: string;
};

type LaunchRow = {
  id: string;
  name: string;
  status: string;
  statusAbbrev: string;
  net: string;
  precision: string;
  provider: string;
  mission: string;
  pad: string;
  location: string;
};

const LAUNCH_URL =
  "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=6&mode=list&location__ids=12,27";

const PRECISE = new Set(["SEC", "MIN", "HR", "H"]);

const FREE_LOOKOUTS: Lookout[] = [
  {
    name: "Space View Park",
    kind: "Free",
    drive: "About 1 hour 30 minutes · Titusville",
    blurb:
      "The classic free lawn on the west bank of the Indian River, with the Space Walk of Fame monuments. A strong seat for a Launch Complex 39A flight.",
    query: "Space View Park Titusville Florida",
  },
  {
    name: "Sand Point Park",
    kind: "Free",
    drive: "About 1 hour 30 minutes · Titusville",
    blurb:
      "Another city park on the same riverbank. Use it when Space View Park’s grass is already a parking lot of folding chairs.",
    query: "Sand Point Park Titusville Florida",
  },
  {
    name: "Rotary Riverfront Park",
    kind: "Free",
    drive: "About 1 hour 30 minutes · Titusville",
    blurb:
      "A third free lawn on the Titusville waterfront. Same idea: west of the pads, no ticket, bring the chair you actually like.",
    query: "Rotary Riverfront Park Titusville Florida",
  },
  {
    name: "Max Brewer Bridge",
    kind: "Free",
    drive: "About 1 hour 35 minutes · Titusville",
    blurb:
      "People watch from the public ends of the bridge toward the Kennedy pads. Park in a real space. Do not stop on the bridge.",
    query: "Max Brewer Memorial Parkway Bridge Titusville",
  },
  {
    name: "Alan Shepard Park",
    kind: "Free",
    drive: "About 1 hour 45 minutes · Cocoa Beach",
    blurb:
      "A free city park on the Atlantic. A better angle on the southern pads than on 39A. The beach is the backup plan if the countdown slips to sunset.",
    query: "Alan Shepard Park Cocoa Beach Florida",
  },
  {
    name: "Cherie Down Park",
    kind: "Free",
    drive: "About 1 hour 45 minutes · Cocoa Beach",
    blurb:
      "Another free Cocoa Beach park if Shepard fills up. Ocean side, so southern launches read better than a due-north pad.",
    query: "Cherie Down Park Cocoa Beach Florida",
  },
  {
    name: "Lori Wilson Park",
    kind: "Free",
    drive: "About 1 hour 50 minutes · Cocoa Beach",
    blurb:
      "A larger beach park south of the pier. Same rule: free to stand on, and farther from 39A than the Titusville lawns.",
    query: "Lori Wilson Park Cocoa Beach Florida",
  },
  {
    name: "State Road 401",
    kind: "Free",
    drive: "About 1 hour 50 minutes · Cape Canaveral",
    blurb:
      "Roadside spots along SR 401 fill for launches from the southern pads. Park only where the signs allow. A posted tow zone is a tow zone.",
    query: "State Road 401 Cape Canaveral launch viewing",
  },
];

const FEE_LOOKOUTS: Lookout[] = [
  {
    name: "Kennedy Space Center Visitor Complex",
    kind: "Fee",
    drive: "About 1 hour 40 minutes",
    blurb:
      "The closest official visit, launch or no launch: Atlantis, the bus to the Saturn V, and the pads when the tour is running. Launch-viewing packages are a separate ticket and they sell out.",
    query: "Kennedy Space Center Visitor Complex",
    href: "https://www.kennedyspacecenter.com/",
    hrefLabel: "Visitor Complex",
  },
  {
    name: "Jetty Park",
    kind: "Fee",
    drive: "About 1 hour 50 minutes · Port Canaveral",
    blurb:
      "County park at the port inlet. You pay to park. The payoff is proximity to the southern pads, including SLC-40 and SLC-41. Book the lot early on a launch day.",
    query: "Jetty Park Port Canaveral Florida",
    href: "https://www.portcanaveral.com/",
    hrefLabel: "Port Canaveral",
  },
  {
    name: "Exploration Tower",
    kind: "Closed",
    drive: "About 1 hour 50 minutes · Port Canaveral",
    blurb:
      "The seven-story tower at the port used to sell observation-deck tickets. It has been closed since a long maintenance project, and the port has not reopened it. Do not plan a launch around the tower until Port Canaveral says the decks are open. Jetty Park is the working paid spot next door.",
    query: "Exploration Tower Port Canaveral",
    href: "https://www.portcanaveral.com/",
    hrefLabel: "Port Canaveral",
  },
  {
    name: "Playalinda Beach",
    kind: "Fee",
    drive: "About 1 hour 50 minutes · Canaveral National Seashore",
    blurb:
      "The closest beach to Launch Complex 39A when the gate is open. It often closes for a launch. Do not drive up assuming you will be let in. There is an entrance fee when it is open.",
    query: "Playalinda Beach Canaveral National Seashore",
    href: "https://www.nps.gov/cana/",
    hrefLabel: "National seashore",
  },
];

function easternWhen(iso: string, precision: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Time not posted";
  if (precision === "M" || precision === "Q" || precision === "Y") {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "America/New_York",
    });
  }
  if (precision === "D" || precision === "DAY") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "America/New_York",
    });
  }
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
}

function countdown(iso: string, now: number) {
  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) return "Window passed — confirm before you drive";
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m ${seconds}s`;
}

function showClock(row: LaunchRow) {
  return PRECISE.has(row.precision) && row.statusAbbrev === "Go";
}

function LaunchTracker() {
  const [rows, setRows] = useState<LaunchRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const controller = new AbortController();
    fetch(LAUNCH_URL, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          results?: {
            id?: string;
            name?: string;
            status?: { name?: string; abbrev?: string };
            net?: string;
            net_precision?: { abbrev?: string };
            lsp_name?: string;
            mission?: string;
            pad?: string;
            location?: string;
          }[];
        };
        const next = (data.results || [])
          .filter((row) => row.id && row.name && row.net)
          .map((row) => ({
            id: row.id as string,
            name: row.name as string,
            status: row.status?.name || "Status not posted",
            statusAbbrev: row.status?.abbrev || "",
            net: row.net as string,
            precision: row.net_precision?.abbrev || "",
            provider: row.lsp_name || "Provider not posted",
            mission: row.mission || "",
            pad: row.pad || "Pad not posted",
            location: row.location || "Cape Canaveral",
          }));
        setRows(next);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!rows?.some(showClock)) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [rows]);

  if (failed) {
    return (
      <article className="about-panel ms-boat-card">
        <h3>The list did not load</h3>
        <p>
          The pads are still there. A live list can fail without the launch
          moving. Use the company pages, and treat any countdown you see
          elsewhere as a rumor until those pages agree.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary btn-sm" href="https://www.spacex.com/launches" target="_blank" rel="noopener noreferrer">
            SpaceX launches
          </a>
          <a className="btn btn-ghost btn-sm" href="https://www.kennedyspacecenter.com/" target="_blank" rel="noopener noreferrer">
            Kennedy Space Center
          </a>
          <a className="btn btn-ghost btn-sm" href="https://www.ulalaunch.com/" target="_blank" rel="noopener noreferrer">
            ULA
          </a>
        </div>
      </article>
    );
  }

  if (!rows) {
    return (
      <article className="about-panel ms-boat-card">
        <h3>Checking the Cape…</h3>
        <p>Pulling the next launches from Cape Canaveral and Kennedy. A date that says only a month is not a countdown.</p>
      </article>
    );
  }

  if (!rows.length) {
    return (
      <article className="about-panel ms-boat-card">
        <h3>Nothing dated from the Cape right now</h3>
        <p>That can mean a quiet week, or it can mean the list is between updates. The official pages are the second opinion.</p>
      </article>
    );
  }

  return (
    <>
      {rows.map((row) => (
        <article key={row.id} className="about-panel ms-boat-card">
          <p className="ms-boat-meta">{row.provider}</p>
          <h3>{row.mission || row.name}</h3>
          <p className="ms-boat-meta">{row.status}</p>
          <p>
            {easternWhen(row.net, row.precision)}
            {showClock(row) ? ` · ${countdown(row.net, now)}` : ""}
          </p>
          <p>
            {row.pad}. {row.location}.
            {PRECISE.has(row.precision)
              ? " A Go can still scrub. Look again the morning you drive."
              : " This date is only a window. Do not leave at dawn for a month on a calendar."}
          </p>
          <SaveLaunch row={row} />
        </article>
      ))}
    </>
  );
}

function easternStamp(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

function SaveLaunch({ row }: { row: LaunchRow }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!PRECISE.has(row.precision)) return null;
  return (
    <div className="hero-actions">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={busy}
        onClick={() => {
          const stamp = easternStamp(row.net);
          setBusy(true);
          void saveCapeReminder({
            title: row.mission || row.name,
            notes: `${row.pad}. ${row.location}. A Go can still scrub. Check the morning you drive.`,
            startDate: stamp.date,
            startTime: stamp.time,
            endDate: stamp.date,
            endTime: stamp.time,
            timerMinutes: null,
            timerEndsAt: null,
            timerPausedMs: null,
            alarmEnabled: true,
            done: false,
          }).then((message) => {
            setMsg(message);
            setBusy(false);
          });
        }}
      >
        {busy ? "Saving…" : "Remind me on my calendar"}
      </button>
      {msg ? <p>{msg}</p> : null}
    </div>
  );
}

function LookoutCard({ spot }: { spot: Lookout }) {
  return (
    <article className="about-panel ms-boat-card">
      <p className="ms-boat-meta">{spot.kind} · {spot.drive}</p>
      <h3>{spot.name}</h3>
      <p>{spot.blurb}</p>
      <div className="hero-actions">
        <a className="btn btn-primary btn-sm" href={mapsSearch(spot.query)} target="_blank" rel="noopener noreferrer">
          Open in maps
        </a>
        {spot.href ? (
          <a className="btn btn-ghost btn-sm" href={spot.href} target="_blank" rel="noopener noreferrer">
            {spot.hrefLabel || "Official site"}
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function MySpaceSpaceCoast() {
  return (
    <div className="ms-boat">
      <div className="ms-boat-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/graphics/day-trips/ksc.jpg"
          alt="Cartoon family watching a rocket lift off beside a Florida beach"
          className="ms-boat-mascot"
        />
        <div className="ms-boat-hero-copy">
          <span className="kicker">About an hour and a half east</span>
          <p>
            Cape Canaveral and Kennedy Space Center, from the middle of The
            Villages. SpaceX flies most of the rockets. NASA, United Launch
            Alliance, and Blue Origin fly the rest when they have one on the
            pad. Times below come from the public launch list. Confirm them
            before you put gas in the car.
          </p>
        </div>
      </div>

      <div className="ms-boat-jump">
        <a className="btn btn-ghost btn-sm" href="#ms-space-next">Next launches</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-watch">Where to watch</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-pads">Who flies</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-visit">Even without a launch</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-drive">When to leave</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-guides">Where to stand</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-kids">Grandkids</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-weather">Storms</a>
        <a className="btn btn-ghost btn-sm" href="#ms-space-photos">Photos</a>
      </div>

      <div className="ms-boat-section-art" id="ms-space-next">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/cruises/launch.jpg" alt="" />
        <h3 className="my-space-block-title">Next launches</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Cape Canaveral Space Force Station and Kennedy Space Center only.
        Clocks run on Eastern time. A month with no day is a plan to check
        again, not a tee time. Data is the public Launch Library list.
      </p>
      <div className="ms-boat-grid">
        <LaunchTracker />
      </div>
      <div className="hero-actions" style={{ margin: "0.75rem 0 1.25rem" }}>
        <a className="btn btn-ghost btn-sm" href="https://www.spacex.com/launches" target="_blank" rel="noopener noreferrer">
          SpaceX launches
        </a>
        <a className="btn btn-ghost btn-sm" href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer">
          NASA
        </a>
        <a className="btn btn-ghost btn-sm" href="https://www.ulalaunch.com/" target="_blank" rel="noopener noreferrer">
          ULA
        </a>
        <a className="btn btn-ghost btn-sm" href="https://www.blueorigin.com/" target="_blank" rel="noopener noreferrer">
          Blue Origin
        </a>
      </div>

      <div className="ms-boat-section-art" id="ms-space-watch">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/beach.jpg" alt="" />
        <h3 className="my-space-block-title">Where to watch</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Three banks of the same show. Titusville, west of the river, is the
        reliable free seat and the better view of Launch Complex 39A.
        Playalinda is closer and often closed. Cocoa Beach, Jetty Park, and
        State Road 401 face the southern pads. Drive times are from the middle
        of The Villages.
      </p>
      <div className="ms-boat-grid">
        {FREE_LOOKOUTS.map((spot) => (
          <LookoutCard key={spot.name} spot={spot} />
        ))}
        {FEE_LOOKOUTS.map((spot) => (
          <LookoutCard key={spot.name} spot={spot} />
        ))}
      </div>

      <div className="ms-boat-section-art" id="ms-space-pads">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/ksc.jpg" alt="" />
        <h3 className="my-space-block-title">Who flies from here</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>SpaceX</h3>
          <p>
            Falcon 9 flies from Space Launch Complex 40 at Cape Canaveral
            Space Force Station and from Launch Complex 39A at Kennedy Space
            Center. Falcon Heavy uses 39A. The tracker names the pad for each
            flight. Starship’s regular flying has been from South Texas. If a
            Cape Starship flight is actually on the calendar, it will show up
            here and on the SpaceX page. Do not drive over for one that is
            only a rumor.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="https://www.spacex.com/launches" target="_blank" rel="noopener noreferrer">
              SpaceX launches
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>United Launch Alliance</h3>
          <p>
            Vulcan flies from Space Launch Complex 41 at Cape Canaveral when
            ULA has a mission. It is not a weekly cadence. Boeing’s Starliner
            rides a ULA rocket from the Cape on the days a crew flight is
            assigned. It does not keep its own countdown.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://www.ulalaunch.com/" target="_blank" rel="noopener noreferrer">
              ULA
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>NASA</h3>
          <p>
            The big orange Space Launch System leaves from Launch Complex 39B
            when an Artemis mission is real. That is a rare day, not a
            Saturday habit. Between those flights the Visitor Complex is still
            the place to stand under a Saturn V and a shuttle.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer">
              NASA
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Blue Origin</h3>
          <p>
            New Glenn uses Launch Complex 36 at Cape Canaveral. Flights show
            up when they are scheduled. The company’s page is the one to trust
            for whether a New Glenn day is this month or next season.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://www.blueorigin.com/" target="_blank" rel="noopener noreferrer">
              Blue Origin
            </a>
          </div>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-space-visit">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/beach.jpg" alt="" />
        <h3 className="my-space-block-title">Worth the drive with no rocket</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>Visitor Complex</h3>
          <p>
            Atlantis, the Apollo center with the Saturn V, and the bus tour
            are the day when the range is quiet. General admission and a
            launch-viewing package are different purchases. Read which one is
            in the cart.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href="https://www.kennedyspacecenter.com/" target="_blank" rel="noopener noreferrer">
              Kennedy Space Center
            </a>
            <a className="btn btn-ghost btn-sm" href={mapsSearch("Kennedy Space Center Visitor Complex")} target="_blank" rel="noopener noreferrer">
              Open in maps
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Merritt Island refuge</h3>
          <p>
            The wildlife refuge wraps the space center. Black Point Wildlife
            Drive is the birding loop on an ordinary day. Roads close when a
            launch closes them. Check the refuge the morning you go, the same
            way you would check a tee sheet.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href="https://www.fws.gov/refuge/merritt-island" target="_blank" rel="noopener noreferrer">
              Merritt Island refuge
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Port, lighthouse, and a museum</h3>
          <p>
            Port Canaveral is cruise ships and the jetty. The Cape Canaveral
            Lighthouse is the old brick tower when tours are open. The Valiant
            Air Command Warbird Museum in Titusville is airplanes, not
            rockets, and it is a good rainy-day neighbor to Space View Park.
            Each one posts its own tickets and hours.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href={mapsSearch("Cape Canaveral Lighthouse")} target="_blank" rel="noopener noreferrer">
              Lighthouse
            </a>
            <a className="btn btn-ghost btn-sm" href={mapsSearch("Valiant Air Command Warbird Museum Titusville")} target="_blank" rel="noopener noreferrer">
              Warbird museum
            </a>
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Before you roll</h3>
          <p>
            Eastbound roads fill on a launch morning. Leave earlier than the
            map says, start with a full tank, and pick the bathroom before you
            pick the shoulder. Drones stay in the trunk. If the beach gate is
            closed, it is closed. Titusville still works.
          </p>
        </article>
      </div>
      <SpaceCoastDesk />
    </div>
  );
}
