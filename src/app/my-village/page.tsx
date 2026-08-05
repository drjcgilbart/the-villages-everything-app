import Image from "next/image";
import { Suspense } from "react";
import { VillageBrowser } from "@/components/VillageBrowser";
import { villageCount } from "@/lib/villages";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Village",
  description:
    "Find your exact village inside The Villages, Florida — Edenfield, Fenney, Spanish Springs side, and 100+ neighborhoods with local context.",
};

export default function MyVillagePage() {
  const count = villageCount();

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">100+ neighborhoods · one hometown</span>
            <h1>My Village</h1>
            <p>
              The Villages isn&apos;t one subdivision — it&apos;s a constellation
              of individual villages (like <strong>Edenfield</strong>, Fenney,
              Bonnybrook, and many more). Search or browse by area to open your
              village&apos;s landing page, then star it so it&apos;s always one
              click away.
            </p>
            <div className="dining-summary-stats">
              <div className="stat">
                <strong>{count}</strong>
                <span>Villages listed</span>
              </div>
              <div className="stat">
                <strong>6</strong>
                <span>Map areas</span>
              </div>
              <div className="stat">
                <strong>★</strong>
                <span>Save yours</span>
              </div>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-my-village.jpg"
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
          <div className="about-panel" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ marginTop: 0 }}>How to use this page</h2>
            <ol className="village-howto">
              <li>
                <strong>Search</strong> by village name (e.g. Edenfield) or filter
                by map area (Eastport, Historic Side, North of 466…).
              </li>
              <li>
                <strong>Open</strong> a village for local context — area, CDD
                when known, and <strong>Meet Your Neighbors</strong> unique to
                that village.
              </li>
              <li>
                <strong>Star “Mine”</strong> to save your village on this device
                for a quick return.
              </li>
            </ol>
            <p style={{ marginBottom: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
              Village lists evolve as The Villages grows. This guide is for
              resident orientation and is not an official developer directory.
              Confirm CDD, utilities, and amenities with{" "}
              <a
                href="https://www.districtgov.org/districts/residential/"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                districtgov.org
              </a>
              .
            </p>
          </div>

          <Suspense fallback={<div className="empty-state">Loading villages…</div>}>
            <VillageBrowser />
          </Suspense>
        </div>
      </section>
    </>
  );
}
