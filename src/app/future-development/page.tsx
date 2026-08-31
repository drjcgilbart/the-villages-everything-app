import Link from "next/link";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import {
  DEVELOPMENT_AREAS,
  DRONE_CREATORS,
  WATCHER_TIPS,
  WATCH_PICKS,
  creatorById,
  statusLabel,
} from "@/lib/futureDevelopment";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Future Development",
  description:
    "Drone tours and construction watch for The Villages, Florida — DD Aerial Photography, Papa Pineapples, Gold Wingnut, and growth corridors like Eastport.",
};

export default function FutureDevelopmentPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Dirt · drones · “wait, that wasn’t there”</span>
            <h1>Future Development</h1>
            <p>
              The Villages expands faster than your cart battery drains. This is
              the bird’s-eye bleacher seat: local drone creators, construction
              watch picks, and growth corridors to geek out on — with jokes,
              disclaimers, and zero stuffy brochure voice.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#creators" className="btn btn-primary">
                Meet the pilots
              </a>
              <a href="#watch" className="btn btn-ghost">
                Watch picks
              </a>
              <a href="#radar" className="btn btn-ghost">
                Growth radar
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-future.jpg"
            alt="Future Development mascot — golf ball with a hard hat and a construction cone"
          />
        </div>
      </div>

      <section className="section" id="creators">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Local creators &amp; sky crew</h2>
              <p>
                Independent YouTube creators who document The Villages from the
                cart path, the cockpit, and the drone pad. Not affiliated with
                this hub or The Villages® developer — just excellent
                rubbernecking resources.
              </p>
            </div>
          </div>

          <div className="fd-creator-grid">
            {DRONE_CREATORS.map((c) => (
              <article key={c.id} className="about-panel fd-creator-card">
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="watch" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Watch desk · curated flyovers</h2>
              <p>
                A starter playlist of development-flavored videos. Titles and
                availability change — if a clip vanishes, hit the creator’s
                channel for the latest.
              </p>
            </div>
          </div>

          <div className="fd-watch-grid">
            {WATCH_PICKS.map((pick) => {
              const creator = creatorById(pick.creatorId);
              return (
                <article key={pick.id} className="fd-watch-card about-panel">
                  <div className="fd-video-frame">
                    <iframe
                      src={`https://www.youtube.com/embed/${pick.youtubeId}`}
                      title={pick.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <h3>{pick.title}</h3>
                  <p className="fd-watch-why">{pick.why}</p>
                  {creator && (
                    <p className="fd-watch-credit">
                      Via{" "}
                      <a href={creator.channelUrl} target="_blank" rel="noreferrer">
                        {creator.name}
                      </a>
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="radar" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Growth radar</h2>
              <p>
                Where the map is still under construction — pair these notes
                with drone videos and{" "}
                <Link href="/my-village" className="text-link">
                  The Villages
                </Link>{" "}
                for ground-level context.
              </p>
            </div>
          </div>

          <div className="fd-radar-grid">
            {DEVELOPMENT_AREAS.map((area) => (
              <article key={area.id} className="about-panel fd-radar-card">
                <div className="card-meta">
                  <span className="pill pill-re-active">{statusLabel(area.status)}</span>
                  <span>{area.region}</span>
                </div>
                <h3>{area.title}</h3>
                <p>{area.summary}</p>
                <ul className="fd-tips-list">
                  {area.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {area.relatedVillageSlugs && area.relatedVillageSlugs.length > 0 && (
                  <div className="fd-related-villages">
                    <strong>Peek villages:</strong>
                    <div className="village-neighbor-list">
                      {area.relatedVillageSlugs.map((slug) => (
                        <Link key={slug} href={`/my-village/${slug}`}>
                          {slug
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <h2>How to use this page like a pro</h2>
            <div className="fd-howto-grid">
              {WATCHER_TIPS.map((tip) => (
                <div key={tip.title} className="fd-howto-item">
                  <strong>{tip.title}</strong>
                  <p>{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="quote-box">
              “I used to drive for an hour to see dirt. Now I watch dirt from the
              lanai and still need a snack break.”
            </div>
            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Keep exploring</h2>
              <ul className="village-related-links">
                <li>
                  <Link href="/my-village">The Villages</Link> — ground-level
                  village pages (hello, Edenfield)
                </li>
                <li>
                  <Link href="/real-estate">Real Estate</Link> — featured homes
                  &amp; agent intros
                </li>
                <li>
                  <Link href="/forums/homes-and-moving">Forums · Homes &amp; Moving</Link>{" "}
                  — chat about what you just saw from the sky
                </li>
                <li>
                  <Link href="/yard-sale">Yard Sale</Link> — neighbor treasure
                  hunts
                </li>
                <li>
                  <Link href="/best-of-the-month">Best of the Month</Link> —
                  monthly highlight reel
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="about-panel fd-disclaimer">
            <h2 style={{ marginTop: 0 }}>Fine print (the boring but important part)</h2>
            <p>
              This page highlights <strong>independent</strong> YouTube creators
              for educational and community orientation. We don&apos;t own their
              content, don&apos;t control their schedules, and aren&apos;t
              sponsored by them unless we say so out loud someday.
            </p>
            <p style={{ marginBottom: 0 }}>
              Construction, product availability, and pricing change constantly.
              Confirm anything important with official The Villages® sales,
              county/district sources, or a licensed agent — not a drone
              thumbnail.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
