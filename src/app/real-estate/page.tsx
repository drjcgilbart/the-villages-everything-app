import Image from "next/image";
import Link from "next/link";
import { MarketRefreshButton } from "@/components/MarketRefreshButton";
import { RealEstateLeadForm } from "@/components/RealEstateLeadForm";
import {
  agentCardImage,
  formatPrice,
  getAgentById,
  getPublicAgents,
  getPublicListings,
  listingCardImage,
  loadRealEstate,
  marketSummary,
  REAL_ESTATE_YOUTUBE_CREATORS,
} from "@/lib/realEstate";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Real Estate",
  description:
    "Homes for sale in The Villages, FL — featured listings, live market searches, partner agents, and YouTube creators covering the local market.",
};

export default function RealEstatePage() {
  const data = loadRealEstate();
  const listings = getPublicListings();
  const agents = getPublicAgents();
  const summary = marketSummary();
  const preferred = agents.filter((a) => a.tier === "preferred");
  const featuredAgents = agents.filter((a) => a.tier === "featured");
  const listedAgents = agents.filter((a) => a.tier === "listed");

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Buy · sell · get introduced</span>
            <h1>Real Estate in The Villages</h1>
            <p>
              See featured homes on this site, jump to <strong>live market</strong>{" "}
              searches that stay current, watch local YouTube voices (Jerry
              &amp; Linda, Ira Miller, Robyn Cavallaro, and more), and connect
              with partner agents who know Edenfield from the historic side.
              Updated on demand — and hourly when the site is deployed with
              cron.
            </p>
            <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
              <a href="#re-youtube" className="btn btn-ghost btn-sm">
                YouTube creators
              </a>
              <a href="#connect-agent" className="btn btn-ghost btn-sm">
                Connect with an agent
              </a>
            </div>
            <div className="dining-summary-stats">
              <div className="stat">
                <strong>{summary.activeCount}</strong>
                <span>Featured active</span>
              </div>
              <div className="stat">
                <strong>{summary.agentCount}</strong>
                <span>Partner agents</span>
              </div>
              <div className="stat">
                <strong>
                  {summary.lastRefreshedAt
                    ? formatDate(summary.lastRefreshedAt)
                    : "—"}
                </strong>
                <span>Last snapshot</span>
              </div>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-real-estate.jpg"
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
          <div className="about-panel re-market-panel">
            <div className="section-head" style={{ marginBottom: "0.75rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Market snapshot</h2>
                <p style={{ margin: "0.35rem 0 0" }}>{data.market.headline}</p>
              </div>
              <MarketRefreshButton />
            </div>
            <ul className="re-market-notes">
              {data.market.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="re-disclaimer">
              Featured listings are curated on this site (often by partner
              agents). They are <strong>not</strong> a full MLS feed. Always
              confirm price, status, and details on the linked listing or with
              a licensed agent.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Live market searches</h2>
              <p>
                Free, always-current public searches — Homefinder (official
                Villages inventory), Realtor.com, Redfin, Zillow, plus budget and
                style filters. We link out rather than scrape MLS data.
              </p>
            </div>
          </div>
          <div className="re-live-grid">
            {data.market.liveSearches.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="re-live-card about-panel"
              >
                {s.image && (
                  <div className="re-live-card-art">
                    <Image
                      src={s.image}
                      alt=""
                      width={640}
                      height={640}
                      className="re-live-card-img"
                    />
                  </div>
                )}
                <div className="re-live-card-body">
                  {s.source && (
                    <span className="pill re-live-source">{s.source}</span>
                  )}
                  <strong>{s.label}</strong>
                  <span>{s.description}</span>
                  <em>Open live results →</em>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Featured homes</h2>
              <p>
                Site-curated listings from partner agents — great for
                highlight-reel inventory. Pair with live searches for the full
                market.
              </p>
            </div>
          </div>
          {listings.length === 0 ? (
            <div className="empty-state">
              No featured listings yet. Agents can add them via Studio, or use
              the live market buttons above.
            </div>
          ) : (
            <div className="card-grid">
              {listings.map((listing) => {
                const agent = listing.agentId
                  ? getAgentById(listing.agentId)
                  : null;
                return (
                  <article key={listing.id} className="card re-listing-card">
                    <div className="re-listing-card-art">
                      <Image
                        src={listingCardImage(listing)}
                        alt=""
                        width={640}
                        height={480}
                        className="re-listing-card-img"
                      />
                    </div>
                    <div className="re-listing-body">
                      <div className="card-meta">
                        <span className={`pill pill-re-${listing.status}`}>
                          {listing.status}
                        </span>
                        {listing.featured && (
                          <span className="pill pill-rank">Featured</span>
                        )}
                        <span>{listing.propertyType}</span>
                      </div>
                      <h3>{listing.title}</h3>
                      <p className="re-price">{formatPrice(listing.price)}</p>
                      <p className="re-listing-meta">
                        {listing.beds} bd · {listing.baths} ba
                        {listing.sqft ? ` · ${listing.sqft.toLocaleString()} sqft` : ""}
                        {listing.village ? ` · ${listing.village}` : ""}
                      </p>
                      <p>{listing.summary}</p>
                      {agent && (
                        <p className="re-listing-agent">
                          Listed with <strong>{agent.name}</strong> ·{" "}
                          {agent.brokerage}
                        </p>
                      )}
                      <div className="re-listing-actions">
                        {listing.listingUrl ? (
                          <a
                            href={listing.listingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            View full listing
                          </a>
                        ) : null}
                        <a href="#connect-agent" className="btn btn-ghost btn-sm">
                          Ask an agent
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="re-youtube" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>YouTube creators · real estate &amp; living here</h2>
              <p>
                Independent channels many buyers watch before calling an agent.
                Open each channel for home tours, market talk, and newcomer
                Q&amp;A — not affiliated with this site unless listed as a
                partner agent below.
              </p>
            </div>
          </div>
          <div className="news-outlet-grid re-youtube-grid">
            {REAL_ESTATE_YOUTUBE_CREATORS.map((c) => (
              <article key={c.id} className="about-panel news-outlet-card re-youtube-card">
                <span className="pill pill-rank">YouTube</span>
                <strong>{c.name}</strong>
                {c.aka && (
                  <span className="re-youtube-aka">Also known as {c.aka}</span>
                )}
                <span className="re-youtube-handle">{c.handle}</span>
                <span>{c.blurb}</span>
                <a
                  href={c.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: "0.65rem", alignSelf: "flex-start" }}
                >
                  Open YouTube channel
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Partner agents</h2>
              <p>
                Soft monetization that helps readers: preferred and featured
                partners support the site; everyone can accept buyer/seller
                introductions.
              </p>
            </div>
          </div>

          {[
            { title: "Preferred partners", list: preferred },
            { title: "Featured agents", list: featuredAgents },
            { title: "Directory", list: listedAgents },
          ].map(
            (block) =>
              block.list.length > 0 && (
                <div key={block.title} className="re-agent-block">
                  <h3 className="dining-section-title">{block.title}</h3>
                  <div className="card-grid">
                    {block.list.map((agent) => (
                      <article
                        key={agent.id}
                        className={`card re-agent-card tier-${agent.tier}`}
                      >
                        <div className="re-agent-card-art">
                          <Image
                            src={agent.photoUrl || agentCardImage(agent.tier)}
                            alt=""
                            width={640}
                            height={480}
                            className="re-agent-card-img"
                          />
                        </div>
                        <div className="re-agent-body">
                          <div className="card-meta">
                            <span className={`pill pill-tier-${agent.tier}`}>
                              {agent.tier}
                            </span>
                            <span>{agent.brokerage}</span>
                          </div>
                          <h3>{agent.name}</h3>
                          <p>{agent.bio}</p>
                          {agent.specialties?.length > 0 && (
                            <p className="re-specialties">
                              {agent.specialties.join(" · ")}
                            </p>
                          )}
                          <div className="re-agent-contact">
                            {agent.phone && <span>{agent.phone}</span>}
                            {agent.email && (
                              <a href={`mailto:${agent.email}`}>{agent.email}</a>
                            )}
                            {agent.website && (
                              <a
                                href={agent.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Website
                              </a>
                            )}
                          </div>
                          {agent.acceptsLeads && (
                            <a
                              href={`#connect-agent`}
                              className="text-link"
                              style={{ marginTop: "0.5rem", display: "inline-block" }}
                            >
                              Request introduction →
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell dining-detail-grid">
          <div className="about-panel">
            <RealEstateLeadForm agents={agents} />
          </div>
          <aside>
            <div className="quote-box">
              “I don&apos;t just need a house in The Villages — I need the right
              village, the right cart path, and someone who won&apos;t pretend
              every floor plan is perfect.”
            </div>
            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Also explore</h2>
              <ul className="village-related-links">
                <li>
                  <Link href="/my-village">The Villages</Link> — find Edenfield &amp;
                  100+ neighborhoods
                </li>
                <li>
                  <Link href="/town-squares">Town Squares</Link> — lifestyle near
                  the home
                </li>
                <li>
                  <Link href="/rec-centers">Rec Centers</Link> — amenities nearby
                </li>
                <li>
                  <Link href="/donate">Buy me a cup of Joe</Link> — optional tips
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
