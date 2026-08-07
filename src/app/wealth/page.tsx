import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { MarketCharts } from "@/components/MarketCharts";
import { PhotoCard } from "@/components/PhotoCard";
import { PortfolioTracker } from "@/components/PortfolioTracker";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { WealthHub } from "@/components/WealthHub";
import {
  mapsUrl,
  resourceKindLabel,
  telHref,
  WEALTH_HUB,
  WEALTH_LOCAL,
  WEALTH_MONEY_PATH,
  WEALTH_OFFICIAL,
  WEALTH_SCAM_TIPS,
  WEALTH_SNAPSHOT,
} from "@/lib/wealthResources";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Wealth",
  description:
    "Wealth hub for The Villages — live markets, portfolio board, local banks, Social Security & Medicare links, scam watch, and light money tools.",
};

function ResourceCard({
  r,
}: {
  r: (typeof WEALTH_LOCAL)[number] | (typeof WEALTH_OFFICIAL)[number];
}) {
  return (
    <article className={`about-panel wealth-resource-card accent-${r.accent}`}>
      <div className="wealth-resource-top">
        <span className="wealth-resource-emoji" aria-hidden>
          {r.emoji}
        </span>
        <span className="pill">{resourceKindLabel(r.kind)}</span>
      </div>
      <h3>{r.name}</h3>
      <p className="wealth-resource-blurb">{r.blurb}</p>
      {r.address || r.city ? (
        <p className="wealth-resource-addr">
          {r.address ? (
            <>
              {r.address}
              <br />
            </>
          ) : null}
          {r.city}
        </p>
      ) : null}
      {r.hours ? <p className="wealth-muted">{r.hours}</p> : null}
      <div className="wealth-resource-actions">
        {r.phone ? (
          <a className="btn btn-primary btn-sm" href={telHref(r.phone)}>
            Call {r.phone}
          </a>
        ) : null}
        {r.mapsQuery ? (
          <a
            className="btn btn-ghost btn-sm"
            href={mapsUrl(r.mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Maps
          </a>
        ) : null}
        {r.href ? (
          r.href.startsWith("/") ? (
            <Link className="btn btn-ghost btn-sm" href={r.href}>
              Open
            </Link>
          ) : (
            <a
              className="btn btn-ghost btn-sm"
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )
        ) : null}
      </div>
    </article>
  );
}

export default function WealthPage() {
  const topic = getTopic("wealth");
  const { posts, videos, photos } = getTopicContent("wealth");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>
              {topic.description} {WEALTH_HUB.blurb}
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#markets" className="btn btn-primary">
                Live markets
              </a>
              <a href="#portfolio" className="btn btn-ghost">
                My portfolio
              </a>
              <a href="#local-money" className="btn btn-ghost">
                Local banks
              </a>
              <a href="#official" className="btn btn-ghost">
                Official links
              </a>
              <a href="#money-tools" className="btn btn-ghost">
                Money tools
              </a>
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

      <p className="shell wealth-disclaimer">{WEALTH_HUB.disclaimer}</p>

      {/* Snapshot */}
      <section className="section" id="snapshot" style={{ paddingTop: "1rem" }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Villager money cheat sheet</h2>
              <p>Four ideas that pair well with golf carts and quarterly statements.</p>
            </div>
          </div>
          <div className="wealth-snapshot-grid">
            {WEALTH_SNAPSHOT.map((item) => (
              <article key={item.title} className="about-panel wealth-snapshot-card">
                <span className="wealth-snapshot-emoji" aria-hidden>
                  {item.emoji}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Existing market + portfolio tools */}
      <MarketCharts />
      <PortfolioTracker />

      {/* Local banks */}
      <section className="section" id="local-money" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Local banks &amp; money places</h2>
              <p>
                Branches and credit unions Villagers actually drive (or cart) to —
                confirm hours and products on their sites.
              </p>
            </div>
          </div>
          <div className="wealth-resource-grid">
            {WEALTH_LOCAL.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Official links */}
      <section className="section" id="official" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Official &amp; educational links</h2>
              <p>
                Social Security, Medicare, IRS, investor education, and scam
                reporting — bookmark the real ones.
              </p>
            </div>
          </div>
          <div className="wealth-resource-grid">
            {WEALTH_OFFICIAL.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Money path */}
      <section className="section" id="money-path" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>A simple money map</h2>
              <p>Day-to-day, retirement income, and protection — without the jargon fog.</p>
            </div>
          </div>
          <div className="wealth-path-grid">
            {WEALTH_MONEY_PATH.map((col) => (
              <article key={col.id} className="about-panel wealth-path-card">
                <div className="wealth-path-title">
                  <span aria-hidden>{col.emoji}</span>
                  <h3>{col.title}</h3>
                </div>
                <ul>
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Scam watch */}
      <section className="section" id="scam-watch" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Scam watch</h2>
              <p>
                Retirees are prime targets. When something feels rushed or secret,
                pause — then verify on an official number.
              </p>
            </div>
          </div>
          <div className="wealth-scam-grid">
            {WEALTH_SCAM_TIPS.map((t) => (
              <article key={t.title} className="about-panel wealth-scam-card">
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions" style={{ marginTop: "1rem" }}>
            <a
              className="btn btn-primary btn-sm"
              href="https://reportfraud.ftc.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report a scam (FTC)
            </a>
            <a
              className="btn btn-ghost btn-sm"
              href="https://brokercheck.finra.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check a broker (FINRA)
            </a>
          </div>
        </div>
      </section>

      {/* Browser tools */}
      <section className="section" id="money-tools" style={{ paddingTop: 0 }}>
        <div className="shell">
          <WealthHub />
        </div>
      </section>

      {/* Highlights + related */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <h2>What you&apos;ll find here</h2>
            <ul className="topic-highlight-list">
              {topic.highlights.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
            <div className="topic-quick-links" style={{ marginTop: "1rem" }}>
              <Link href="/real-estate" className="btn btn-primary btn-sm">
                Real Estate
              </Link>
              <Link href="/health" className="btn btn-ghost btn-sm">
                Health
              </Link>
              <Link href="/donate" className="btn btn-ghost btn-sm">
                Support the hub
              </Link>
            </div>
          </div>
          <div>
            <div className="quote-box">{topic.quote}</div>
            <p className="topic-tip" style={{ marginTop: "1rem" }}>
              Tip: tag Studio posts with{" "}
              <code>{topic.tags.slice(0, 4).join(", ")}</code> and they land
              below.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>From the reboot</h2>
              <p>Related posts, videos, and photos for wealth &amp; markets.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Wealth yet. Publish something in Studio with a
              matching tag, and it will land here.
            </div>
          ) : (
            <div className="topic-feed">
              {posts.length > 0 && (
                <div className="topic-feed-block">
                  <h3>Posts &amp; episodes</h3>
                  <div className="card-grid">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
              {videos.length > 0 && (
                <div className="topic-feed-block">
                  <h3>Videos</h3>
                  <div className="card-grid">
                    {videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}
              {photos.length > 0 && (
                <div className="topic-feed-block">
                  <h3>Photos</h3>
                  <div className="photo-grid">
                    {photos.map((photo) => (
                      <PhotoCard key={photo.id} photo={photo} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="topic-donate">
            <DonateMascot variant="inline" />
          </div>
        </div>
      </section>
    </>
  );
}
