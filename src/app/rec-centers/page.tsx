import Image from "next/image";
import { RecCenterBrowser } from "@/components/RecCenterBrowser";
import { RecCenterMapLinks } from "@/components/RecCenterMapLinks";
import {
  OFFICIAL_REC_CENTERS_URL,
  OFFICIAL_REC_HUB_URL,
  recCenterCounts,
} from "@/lib/recCenters";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Rec Centers",
  description:
    "Browse The Villages recreation centers — regional complexes, village centers, and neighborhood pools with whimsical guides, maps links, and official resources.",
};

export default function RecCentersPage() {
  const topic = getTopic("rec-centers");
  const counts = recCenterCounts();

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div className="dining-summary-stats">
              <div className="stat">
                <strong>{counts.total}</strong>
                <span>Centers listed</span>
              </div>
              <div className="stat">
                <strong>{counts.regional}</strong>
                <span>Regional</span>
              </div>
              <div className="stat">
                <strong>{counts.village}</strong>
                <span>Village</span>
              </div>
              <div className="stat">
                <strong>{counts.neighborhood}</strong>
                <span>Neighborhood</span>
              </div>
            </div>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#browse" className="btn btn-primary">
                Browse centers
              </a>
              <RecCenterMapLinks variant="buttons" />
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src={topic.image}
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="about-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="about-panel">
              <h2>Three flavors of fun</h2>
              <ul className="topic-highlight-list">
                <li>
                  <strong>Regional complexes</strong>
                  <span>
                    Biggest amenity menus — gathering rooms, arts &amp; crafts,
                    theater spaces, sports pools, outdoor recreation. Open
                    daily 7am–10pm (confirm holidays).
                  </span>
                </li>
                <li>
                  <strong>Village centers</strong>
                  <span>
                    Mid-size hubs for several villages: meeting rooms, cards,
                    billiards, family pools, outdoor courts.
                  </span>
                </li>
                <li>
                  <strong>Neighborhood areas</strong>
                  <span>
                    Adult pools plus bocce, shuffleboard, horseshoes — open
                    roughly 7:30am–dusk.
                  </span>
                </li>
              </ul>
            </div>
            <div className="about-panel">
              <h2>Neighbor notes</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                Addresses and phones come from public District listings. Themes
                and tips are orientation notes for residents — not an official
                amenity inventory. Always confirm hours, guest IDs, and closures
                on{" "}
                <a
                  href={OFFICIAL_REC_CENTERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  districtgov.org
                </a>{" "}
                or{" "}
                <a
                  href={OFFICIAL_REC_HUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  thevillages.com
                </a>
                .{" "}
                <RecCenterMapLinks />
              </p>
              <p style={{ marginBottom: 0, color: "var(--muted)" }}>
                Graphics are original whimsical illustrations (copyright-free
                for this hub), inspired by each center&apos;s vibe — not stock
                marketing photos.
              </p>
              <div className="quote-box" style={{ marginTop: "1rem" }}>
                {topic.quote}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="browse" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Pick a rec center</h2>
              <p>
                Use the dropdown, search, or thumbnail grid. Star favorites so
                they pin to the top on this device — switch filters for regional,
                village, or neighborhood stops.
              </p>
            </div>
          </div>
          <RecCenterBrowser />
        </div>
      </section>
    </>
  );
}
