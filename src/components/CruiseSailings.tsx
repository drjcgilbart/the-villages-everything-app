"use client";

import { useEffect, useState } from "react";

type Sailing = {
  line: string;
  ship: string;
  terminal: string;
  departure: string;
  departureKey: string;
  departureTime: string;
};

const LINES: { name: string; blurb: string; href: string }[] = [
  {
    name: "Disney Cruise Line",
    blurb: "Wish, Fantasy, and Treasure are the ships neighbors see at Canaveral. Castaway Cay is theirs.",
    href: "https://disneycruise.disney.go.com/ships/",
  },
  {
    name: "Royal Caribbean",
    blurb: "Star of the Seas, Utopia, Oasis, Harmony, and Adventure have all used Canaveral. The big ships are the ones with the neighborhoods.",
    href: "https://www.royalcaribbean.com/cruise-ships",
  },
  {
    name: "Carnival",
    blurb: "Mardi Gras, Vista, Glory, and the rest of the Fun Ships. Canaveral, Tampa, and Jacksonville have all been Carnival ports.",
    href: "https://www.carnival.com/cruise-ships",
  },
  {
    name: "Norwegian",
    blurb: "Norwegian Prima has been a Canaveral regular. Freestyle dining is the line’s whole idea.",
    href: "https://www.ncl.com/cruise-ships",
  },
  {
    name: "MSC Cruises",
    blurb: "MSC Seashore and MSC Grandiosa have both homeported at Canaveral. The Yacht Club is the quiet deck, and it is a separate fare.",
    href: "https://www.msccruisesusa.com/",
  },
  {
    name: "Princess",
    blurb: "Caribbean Princess and, in some seasons, other Princess ships. A calmer ship if the group is done with water slides.",
    href: "https://www.princess.com/ships",
  },
  {
    name: "Celebrity",
    blurb: "Celebrity Apex has sailed from Canaveral, and the line’s bigger presence is Port Everglades and Miami. Edge-class ships are the new ones.",
    href: "https://www.celebritycruises.com/ships",
  },
  {
    name: "Holland America",
    blurb: "The traditional ships. Most Florida sailings leave Fort Lauderdale or Miami, not Canaveral. Music and a proper dining room.",
    href: "https://www.hollandamerica.com/en/us/cruise-ships",
  },
  {
    name: "Virgin Voyages",
    blurb: "Adults-only ships from Miami. No kids’ club, no buffet line in the old sense. Read the age rule before you invite the grandkids.",
    href: "https://www.virginvoyages.com/ships",
  },
];

const DEALS: { name: string; blurb: string; href: string }[] = [
  {
    name: "The cruise line itself",
    blurb: "The fare on the line’s site is the one that matches the ship, the cabin categories, and the included drinks or Wi-Fi. Start here, then compare.",
    href: "https://www.portcanaveral.com/cruise/cruise-lines",
  },
  {
    name: "Vacations To Go",
    blurb: "Their 90-day ticker is the old standby for last-minute cabins. A short window usually means a better price and a worse choice of deck.",
    href: "https://www.vacationstogo.com/ticker.cfm",
  },
  {
    name: "Cruise Critic",
    blurb: "Deals, ship reviews, and the roll-call boards where people on your sailing compare notes. Read the recent reviews, not the ones from 2014.",
    href: "https://www.cruisecritic.com/cruise-deals/",
  },
  {
    name: "AAA",
    blurb: "If you already carry a AAA card, ask them. Members sometimes see a cabin credit or an onboard credit the public page does not show.",
    href: "https://www.aaa.com/travel",
  },
  {
    name: "Costco Travel",
    blurb: "Costco members can book a cruise with a shop card or an onboard credit. You still need the membership. Compare the out-the-door total, not the teaser fare.",
    href: "https://www.costcotravel.com/",
  },
];

function prettyDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 16));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

export function CruiseSailings() {
  const [rows, setRows] = useState<Sailing[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/cruises/schedule", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { ok?: boolean; sailings?: Sailing[] };
        if (!data.ok) throw new Error("not ok");
        setRows(data.sailings || []);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <section className="section" id="sailings" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Upcoming sailings from Port Canaveral</h2>
              <p>
                Home-port departures for the next three weeks, read from Port
                Canaveral’s own schedule. A ship can slide a day. Your
                documents still win. This list does not show a price.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {failed ? (
              <article className="about-panel ms-boat-card">
                <h3>The live list did not load</h3>
                <p>
                  The port still publishes the schedule. Open it, and open the
                  cruise line, before you tell the group which ship is in on
                  Sunday.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-primary btn-sm" href="https://www.portcanaveral.com/cruise/cruise-ship-schedule" target="_blank" rel="noopener noreferrer">
                    Port schedule
                  </a>
                </div>
              </article>
            ) : null}
            {!failed && !rows ? (
              <article className="about-panel ms-boat-card">
                <h3>Checking Port Canaveral…</h3>
                <p>Pulling home-port departures. A port-of-call visit is not a sailing you can book.</p>
              </article>
            ) : null}
            {!failed && rows && rows.length === 0 ? (
              <article className="about-panel ms-boat-card">
                <h3>No home-port departure in the next three weeks</h3>
                <p>That can be a quiet gap, or the port page changed shape. The schedule link is the second look.</p>
                <div className="hero-actions">
                  <a className="btn btn-primary btn-sm" href="https://www.portcanaveral.com/cruise/cruise-ship-schedule" target="_blank" rel="noopener noreferrer">
                    Port schedule
                  </a>
                </div>
              </article>
            ) : null}
            {(rows || []).map((row) => (
              <article key={`${row.ship}-${row.departureKey}-${row.terminal}`} className="about-panel ms-boat-card">
                <p className="ms-boat-meta">{row.line}</p>
                <h3>{row.ship}</h3>
                <p className="ms-boat-meta">
                  {prettyDate(row.departureKey)}
                  {row.departureTime ? ` · sails ${row.departureTime}` : ""} · {row.terminal}
                </p>
                <p>
                  Leaves Port Canaveral. The terminal on this card is the one
                  the port listed. Match it to the number on your documents
                  the night before.
                </p>
              </article>
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
            <a className="btn btn-ghost btn-sm" href="https://www.portcanaveral.com/cruise/cruise-ship-schedule" target="_blank" rel="noopener noreferrer">
              Full port schedule
            </a>
            <a className="btn btn-ghost btn-sm" href="https://www.portcanaveral.com/docs/default-source/cruise/2026-master-cruise-schedule.pdf" target="_blank" rel="noopener noreferrer">
              Season PDF
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="deals" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Where the deals actually update</h2>
              <p>
                Fares move every day. These are the pages that move with them.
                A cabin that is cheap because it is next to the elevator is
                still next to the elevator.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {DEALS.map((deal) => (
              <article key={deal.name} className="about-panel ms-boat-card">
                <h3>{deal.name}</h3>
                <p>{deal.blurb}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary btn-sm" href={deal.href} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </div>
              </article>
            ))}
            <article className="about-panel ms-boat-card">
              <h3>Last-minute, plainly</h3>
              <p>
                Inside 90 days the unsold cabins get cheaper and the good
                decks are gone. Compare the line’s site, Vacations To Go, and
                one membership desk you already trust. Add taxes, the gratuity,
                and the drink package before you call it a deal. Do not wire a
                deposit to a Facebook inbox.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="ships" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>The lines and the ships</h2>
              <p>
                Each link is the line’s own ship list. Which hull is in
                Florida this month is what the schedule above is for. Ships
                change home ports. The photographs on the line’s site do not.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {LINES.map((line) => (
              <article key={line.name} className="about-panel ms-boat-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/graphics/cruises/canaveral.jpg" alt="" style={{ width: "100%", borderRadius: "12px", marginBottom: "0.6rem" }} />
                <h3>{line.name}</h3>
                <p>{line.blurb}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary btn-sm" href={line.href} target="_blank" rel="noopener noreferrer">
                    Ships
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
