import Image from "next/image";
import Link from "next/link";
import {
  NEWS_BEATS,
  NEWS_CREATORS,
  NEWS_OUTLETS,
} from "@/lib/villagesNews";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Local News",
  description:
    "Curated current events for The Villages, Florida — local news outlets, YouTube creators like The Villages Skip Smith, and live channel feeds.",
};

export default function NewsPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Headlines · porch takes · cart-path intel</span>
            <h1>Local News</h1>
            <p>
              Curated doorways to what&apos;s happening now — local papers and
              sites that stay fresh, plus YouTube voices like{" "}
              <strong>The Villages Skip Smith</strong> with live channel feeds.
              We don&apos;t invent the news; we point you at the good sources
              and the entertaining narrators.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#creators" className="btn btn-primary">
                YouTube creators
              </a>
              <a href="#outlets" className="btn btn-ghost">
                News outlets
              </a>
              <a href="#beats" className="btn btn-ghost">
                By topic
              </a>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-local-news.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section" id="creators">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>YouTube creators · video news desk</h2>
              <p>
                Independent channels covering The Villages. Channel feeds embed
                their latest uploads when available — always verify on YouTube
                if something looks off.
              </p>
            </div>
          </div>

          <div className="news-creator-stack">
            {NEWS_CREATORS.map((c) => (
              <article key={c.id} className="about-panel news-creator-card">
                <div className="news-creator-copy">
                  <div className="card-meta">
                    <span className="pill pill-rank">YouTube</span>
                    <span>{c.handle}</span>
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <ul className="fd-strengths">
                    {c.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="fd-creator-actions">
                    <a
                      href={c.channelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Open channel
                    </a>
                    {c.featuredVideoId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${c.featuredVideoId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        Sample video
                      </a>
                    )}
                  </div>
                </div>
                <div className="news-creator-feed">
                  {c.uploadsPlaylistId ? (
                    <>
                      <p className="news-feed-label">Latest from this channel</p>
                      <div className="fd-video-frame">
                        <iframe
                          src={`https://www.youtube.com/embed/videoseries?list=${c.uploadsPlaylistId}`}
                          title={`${c.name} latest uploads`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </>
                  ) : c.featuredVideoId ? (
                    <>
                      <p className="news-feed-label">Featured video</p>
                      <div className="fd-video-frame">
                        <iframe
                          src={`https://www.youtube.com/embed/${c.featuredVideoId}`}
                          title={c.featuredVideoTitle || c.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                      Open the channel for the latest uploads.
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="outlets" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Curated news outlets</h2>
              <p>
                These sites update themselves — open them anytime for current
                headlines, meetings, and entertainment listings.
              </p>
            </div>
          </div>
          <div className="news-outlet-grid">
            {NEWS_OUTLETS.map((o) => (
              <a
                key={o.id}
                href={o.url}
                target={o.url.startsWith("http") ? "_blank" : undefined}
                rel={o.url.startsWith("http") ? "noreferrer" : undefined}
                className="about-panel news-outlet-card"
              >
                <span className="pill pill-cuisine">{o.kind}</span>
                <strong>{o.name}</strong>
                <span>{o.blurb}</span>
                <em className="text-link">Open live →</em>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="beats" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>News by beat</h2>
              <p>
                Jump by topic when you only care about weather, dirt piles, or
                who&apos;s playing at the square.
              </p>
            </div>
          </div>
          <div className="news-beat-grid">
            {NEWS_BEATS.map((beat) => (
              <article key={beat.id} className="about-panel">
                <h3>
                  <span aria-hidden>{beat.emoji} </span>
                  {beat.title}
                </h3>
                <p style={{ color: "var(--muted)" }}>{beat.blurb}</p>
                <ul className="village-related-links">
                  {beat.links.map((l) => (
                    <li key={l.url}>
                      {l.url.startsWith("/") ? (
                        <Link href={l.url}>{l.label}</Link>
                      ) : (
                        <a href={l.url} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="quote-box">
            “I don&apos;t need national cable for Villages news — I need Skip,
            the Daily Sun, and someone to tell me if the square band is any
            good tonight.”
          </div>
          <div className="about-panel">
            <h2>Keep exploring</h2>
            <ul className="village-related-links">
              <li>
                <Link href="/calendar">Calendar</Link> — hub event list
              </li>
              <li>
                <Link href="/future-development">Future Development</Link> —
                drones &amp; construction watch
              </li>
              <li>
                <Link href="/forums">Community Forums</Link> — talk about it
                with neighbors
              </li>
              <li>
                <Link href="/town-squares">Town Squares</Link> — live music
                culture
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="about-panel fd-disclaimer">
            <h2 style={{ marginTop: 0 }}>Fine print</h2>
            <p>
              Outlets and creators are <strong>independent</strong>. This page
              curates links and embeds for convenience — we don&apos;t write
              their headlines or control their uploads. Always verify urgent
              safety, weather, and official notices with primary sources.
            </p>
            <p style={{ marginBottom: 0 }}>
              Not affiliated with The Villages® developer, The Villages Daily
              Sun, Villages-News.com, or any listed YouTube channel.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
