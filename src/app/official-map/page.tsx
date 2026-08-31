import Link from "next/link";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { RecCenterMapLinks } from "@/components/RecCenterMapLinks";
import {
  OFFICIAL_REC_CENTERS_URL,
  OFFICIAL_REC_FLIPBOOK_URL,
  OFFICIAL_REC_HUB_URL,
  OFFICIAL_REC_MAP_URL,
} from "@/lib/recCenters";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Official Map",
  description:
    "Official District recreation map PDF for The Villages — rec centers, pools, and facilities on one map.",
};

export default function OfficialMapPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">District map · cart-path cheat sheet</span>
            <h1>Official Map</h1>
            <p>
              Official District recreation maps — rec centers, pools, and
              outdoor facilities. Use the Flipbook to page through, or the PDF
              to print or save.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a
                href={OFFICIAL_REC_FLIPBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open Flipbook rec map →
              </a>
              <a
                href={OFFICIAL_REC_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Rec map PDF
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-map.jpg"
            alt="Official Map mascot — golf ball with a folded map and compass"
          />
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="about-grid">
            <div className="about-panel">
              <h2 style={{ marginTop: 0 }}>What&apos;s in the PDF</h2>
              <ul className="topic-highlight-list">
                <li>
                  <strong>Recreation centers</strong>
                  <span>
                    Regional, village, and neighborhood facilities placed on the
                    District map so you can plan the cart route.
                  </span>
                </li>
                <li>
                  <strong>Official source</strong>
                  <span>
                    Published by the Community Development Districts (
                    <a
                      href={OFFICIAL_REC_CENTERS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      districtgov.org
                    </a>
                    ) — always the most authoritative version for hours and
                    locations.
                  </span>
                </li>
                <li>
                  <strong>Pair with this app</strong>
                  <span>
                    Use the map for geography, then open{" "}
                    <Link href="/rec-centers">Rec Centers</Link> here for
                    whimsical guides, favorites, and per-center tips.
                  </span>
                </li>
              </ul>
            </div>

            <div className="about-panel">
              <h2 style={{ marginTop: 0 }}>Related official links</h2>
              <ul className="ts-links-list">
                <RecCenterMapLinks variant="list" />
                <li>
                  <a
                    href={OFFICIAL_REC_CENTERS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Centers by type (District)
                  </a>
                  <span>Regional · village · neighborhood lists</span>
                </li>
                <li>
                  <a
                    href={OFFICIAL_REC_HUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    The Villages recreation hub
                  </a>
                  <span>thevillages.com overview</span>
                </li>
                <li>
                  <Link href="/rec-centers">Rec Centers in this app</Link>
                  <span>Browse, search, and star favorites</span>
                </li>
              </ul>
              <p
                style={{
                  margin: "1rem 0 0",
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                }}
              >
                Not affiliated with The Villages® brand or the District
                operators — we just point neighbors to the official map.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
