import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { HealthHub } from "@/components/HealthHub";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import {
  CARE_PATH_GUIDE,
  facilityKindLabel,
  HEALTH_EMERGENCY,
  HEALTH_FACILITIES,
  HEALTH_HUB,
  HEALTH_SNAPSHOT,
  mapsUrl,
  telHref,
} from "@/lib/healthResources";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Health",
  description:
    "Health hub for The Villages — local hospitals & ERs, emergency numbers, wellness check-ins, and neighbor-friendly care guidance.",
};

export default function HealthPage() {
  const topic = getTopic("health");
  const { posts, videos, photos } = getTopicContent("health");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  const carePlaces = HEALTH_FACILITIES.filter(
    (f) => f.kind === "hospital" || f.kind === "er"
  );
  const otherPlaces = HEALTH_FACILITIES.filter(
    (f) => f.kind !== "hospital" && f.kind !== "er"
  );

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>
              {topic.description} {HEALTH_HUB.blurb}
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#local-care" className="btn btn-primary">
                Hospitals &amp; ERs
              </a>
              <a href="#wellness-tools" className="btn btn-ghost">
                Wellness tools
              </a>
              <a href="#care-path" className="btn btn-ghost">
                ER vs urgent care
              </a>
              <a href="#emergency" className="btn btn-ghost">
                Emergency numbers
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

      {/* Emergency strip */}
      <section className="section" id="emergency" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <div className="about-panel health-emergency-banner">
            <div className="health-emergency-copy">
              <span className="pill health-pill-alert">In a real emergency</span>
              <h2 style={{ margin: "0.4rem 0 0.35rem" }}>{HEALTH_EMERGENCY.title}</h2>
              <p style={{ margin: 0 }}>{HEALTH_EMERGENCY.body}</p>
            </div>
            <div className="health-emergency-numbers">
              {HEALTH_EMERGENCY.numbers.map((n) => (
                <a
                  key={n.label}
                  className="health-emergency-num"
                  href={telHref(n.tel)}
                >
                  <strong>{n.value}</strong>
                  <span>{n.label}</span>
                  <em>{n.note}</em>
                </a>
              ))}
            </div>
          </div>
          <p className="health-disclaimer">{HEALTH_HUB.disclaimer}</p>
        </div>
      </section>

      {/* Snapshot */}
      <section className="section" id="snapshot">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Villager health cheat sheet</h2>
              <p>Four ideas that actually fit life on a cart path.</p>
            </div>
          </div>
          <div className="health-snapshot-grid">
            {HEALTH_SNAPSHOT.map((item) => (
              <article key={item.title} className="about-panel health-snapshot-card">
                <span className="health-snapshot-emoji" aria-hidden>
                  {item.emoji}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Local hospitals / ERs */}
      <section className="section" id="local-care" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Local hospitals &amp; emergency rooms</h2>
              <p>
                Contact cards for the places Villagers actually use. Tap to call
                or open maps — always confirm before you head out.
              </p>
            </div>
          </div>
          <div className="health-facility-grid">
            {carePlaces.map((f) => (
              <article
                key={f.id}
                className={`about-panel health-facility-card accent-${f.accent}`}
              >
                <div className="health-facility-top">
                  <span className="health-facility-emoji" aria-hidden>
                    {f.emoji}
                  </span>
                  <span className="pill">{facilityKindLabel(f.kind)}</span>
                </div>
                <h3>{f.name}</h3>
                <p className="health-facility-blurb">{f.blurb}</p>
                {f.address ? (
                  <p className="health-facility-addr">
                    {f.address}
                    {f.city ? (
                      <>
                        <br />
                        {f.city}
                      </>
                    ) : null}
                  </p>
                ) : null}
                {f.hours ? (
                  <p className="health-muted" style={{ margin: "0.25rem 0" }}>
                    {f.hours}
                  </p>
                ) : null}
                <div className="health-facility-actions">
                  {f.phone ? (
                    <a className="btn btn-primary btn-sm" href={telHref(f.phone)}>
                      Call {f.phone}
                    </a>
                  ) : null}
                  {f.phoneAlt ? (
                    <a className="btn btn-ghost btn-sm" href={telHref(f.phoneAlt)}>
                      {f.phoneAltLabel || "Alt"} {f.phoneAlt}
                    </a>
                  ) : null}
                  {f.mapsQuery ? (
                    <a
                      className="btn btn-ghost btn-sm"
                      href={mapsUrl(f.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Maps
                    </a>
                  ) : null}
                  {f.href ? (
                    f.href.startsWith("/") ? (
                      <Link className="btn btn-ghost btn-sm" href={f.href}>
                        Open
                      </Link>
                    ) : (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={f.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    )
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: "1.75rem" }}>
            <div>
              <h2>Pharmacies, helplines &amp; wellness</h2>
              <p>Everyday support that isn&apos;t a hospital campus.</p>
            </div>
          </div>
          <div className="health-facility-grid health-facility-grid-sm">
            {otherPlaces.map((f) => (
              <article
                key={f.id}
                className={`about-panel health-facility-card accent-${f.accent}`}
              >
                <div className="health-facility-top">
                  <span className="health-facility-emoji" aria-hidden>
                    {f.emoji}
                  </span>
                  <span className="pill">{facilityKindLabel(f.kind)}</span>
                </div>
                <h3>{f.name}</h3>
                <p className="health-facility-blurb">{f.blurb}</p>
                {f.phone ? (
                  <p className="health-facility-addr">
                    <a href={telHref(f.phone)}>{f.phone}</a>
                  </p>
                ) : null}
                <div className="health-facility-actions">
                  {f.phone ? (
                    <a className="btn btn-primary btn-sm" href={telHref(f.phone)}>
                      Call
                    </a>
                  ) : null}
                  {f.mapsQuery ? (
                    <a
                      className="btn btn-ghost btn-sm"
                      href={mapsUrl(f.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Maps
                    </a>
                  ) : null}
                  {f.href ? (
                    f.href.startsWith("/") ? (
                      <Link className="btn btn-primary btn-sm" href={f.href}>
                        Open in app
                      </Link>
                    ) : (
                      <a
                        className="btn btn-ghost btn-sm"
                        href={f.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    )
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Care path */}
      <section className="section" id="care-path" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>ER, urgent care, or primary?</h2>
              <p>
                A plain-language guide. When in doubt about something serious —
                call 911 or go to the ER.
              </p>
            </div>
          </div>
          <div className="health-carepath-grid">
            {CARE_PATH_GUIDE.map((col) => (
              <article key={col.id} className="about-panel health-carepath-card">
                <div className="health-carepath-title">
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

      {/* Interactive wellness */}
      <section className="section" id="wellness-tools" style={{ paddingTop: 0 }}>
        <div className="shell">
          <HealthHub />
        </div>
      </section>

      {/* Hub links */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <h2>Pair health with the rest of the app</h2>
            <ul className="topic-highlight-list">
              {topic.highlights.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
            <div className="topic-quick-links" style={{ marginTop: "1rem" }}>
              <Link href="/rec-centers" className="btn btn-primary btn-sm">
                Rec Centers
              </Link>
              <Link href="/golf-zone" className="btn btn-ghost btn-sm">
                Golf
              </Link>
              <Link href="/club-zone" className="btn btn-ghost btn-sm">
                Clubs
              </Link>
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
            </div>
          </div>
          <div>
            <div className="quote-box">{topic.quote}</div>
            <p className="topic-tip" style={{ marginTop: "1rem" }}>
              Tip: tag Studio posts with{" "}
              <code>{topic.tags.slice(0, 4).join(", ")}</code> and they&apos;ll
              show up below.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>From the reboot</h2>
              <p>Related posts, videos, and photos for health &amp; wellness.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Health yet. Publish something in Studio with a
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
