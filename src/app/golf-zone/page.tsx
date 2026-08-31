import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { GolfClubHub } from "@/components/GolfClubHub";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import {
  GOLF_ART,
  GOLF_FEATURE_CARDS,
  GOLF_HUB,
  GOLF_LINK_GROUPS,
  GOLF_SNAPSHOT,
  GOLF_TIPS,
} from "@/lib/golfResources";
import { getTopicContentAsync } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Golf",
  description:
    "Golf in The Villages — leaderboard, find a foursome, holes-in-one wall, executive trail, trail fees, and course maps from The Villages Everything App.",
};

export default async function GolfZonePage() {
  const topic = getTopic("golf-zone");
  const { posts, videos, photos } = await getTopicContentAsync("golf-zone");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>
              {topic.description} {GOLF_HUB.blurb}
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#leaderboard" className="btn btn-primary">
                Leader Board
              </a>
              <a href="#foursome" className="btn btn-ghost">
                Find a foursome
              </a>
              <a href="#aces" className="btn btn-ghost">
                Holes in One
              </a>
              <a href="#resources" className="btn btn-ghost">
                Resources
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-golf.jpg"
            alt="Golf mascot — golf ball with a club and a ball on a tee"
          />
        </div>
      </div>

      <section className="section" id="golf-features" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Tee it up</h2>
              <p>
                Jump to the Leader Board, find a foursome, toast a hole-in-one,
                or dig into trail fees and maps.
              </p>
            </div>
          </div>
          <div className="golf-feature-grid">
            {GOLF_FEATURE_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                className="golf-feature-card about-panel"
              >
                <div className="golf-feature-art">
                  <Image
                    src={card.image}
                    alt=""
                    width={640}
                    height={640}
                    className="golf-feature-img"
                  />
                  <span className="golf-feature-badge" aria-hidden>
                    <Image
                      src={card.badge}
                      alt=""
                      width={96}
                      height={96}
                      className="golf-feature-badge-img"
                    />
                  </span>
                </div>
                <div className="golf-feature-body">
                  <strong>{card.title}</strong>
                  <span>{card.blurb}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="golf-club">
        <div className="shell">
          <div className="about-panel golf-badge-legend" style={{ marginBottom: "1rem" }}>
            <h3 style={{ marginTop: 0 }}>Golf skill badges</h3>
            <p style={{ margin: "0 0 0.65rem", color: "var(--muted)" }}>
              Members <em>and</em> visitors earn metal badges that stick to their
              name after admin-approved rounds or hole-in-ones. No green jackets
              — just fairway flair.
            </p>
            <ul className="golf-badge-legend-list">
              <li>
                <span className="member-badge-wrap member-badge-golf member-badge-metal-bronze">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/graphics/badges/golf-bronze.jpg"
                    alt=""
                    width={36}
                    height={36}
                    className="member-badge"
                  />
                </span>
                <span>
                  <strong>Bronze</strong> — approved rounds on the board
                </span>
              </li>
              <li>
                <span className="member-badge-wrap member-badge-golf member-badge-metal-silver">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/graphics/badges/golf-silver.jpg"
                    alt=""
                    width={36}
                    height={36}
                    className="member-badge"
                  />
                </span>
                <span>
                  <strong>Silver</strong> — handicap ≤ 18 or strong scores /
                  course records
                </span>
              </li>
              <li>
                <span className="member-badge-wrap member-badge-golf member-badge-metal-gold">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/graphics/badges/golf-gold.jpg"
                    alt=""
                    width={36}
                    height={36}
                    className="member-badge"
                  />
                </span>
                <span>
                  <strong>Gold</strong> — handicap ≤ 10 or exceptional gross
                </span>
              </li>
              <li>
                <span className="member-badge-wrap member-badge-golf member-badge-metal-pink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/graphics/badges/golf-pink-ace.jpg"
                    alt=""
                    width={36}
                    height={36}
                    className="member-badge"
                  />
                  <span className="member-badge-emoji" aria-hidden>
                    ⛳
                  </span>
                </span>
                <span>
                  <strong>Pink Ace ⛳</strong> — approved hole-in-one (rare feat)
                </span>
              </li>
            </ul>
            <p className="golf-muted" style={{ margin: "0.75rem 0 0", fontSize: "0.88rem" }}>
              Scores on the board also show rings: single green circle ≈
              birdie-caliber round · double gold ring ≈ eagle-caliber round.
            </p>
          </div>
          <GolfClubHub />
        </div>
      </section>

      <section className="section" id="snapshot" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>How golf works here</h2>
              <p>
                A neighbor-oriented cheat sheet — confirm fees, hours, and cart
                rules on the official sites before you tee off.
              </p>
            </div>
          </div>
          <div className="golf-snapshot-grid">
            {GOLF_SNAPSHOT.map((item) => (
              <article key={item.title} className="about-panel golf-snapshot-card">
                <div className="golf-snapshot-art">
                  <Image
                    src={item.image}
                    alt=""
                    width={640}
                    height={640}
                    className="golf-snapshot-img"
                  />
                </div>
                <div className="golf-snapshot-body">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="resources" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Curated golf resources</h2>
              <p>
                Official trail fees, maps, FAQs, and a few hub links that pair
                well with nine holes and a victory beverage.
              </p>
            </div>
          </div>

          <div className="golf-resource-groups">
            {GOLF_LINK_GROUPS.map((group) => (
              <div key={group.title} className="about-panel golf-resource-group">
                <h3>{group.title}</h3>
                <p className="golf-resource-blurb">{group.blurb}</p>
                <ul className="ts-links-list">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href}>{link.label}</Link>
                      ) : (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      )}
                      <span>{link.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="about-panel golf-tips-panel" style={{ marginTop: "1rem" }}>
            <h3 style={{ marginTop: 0 }}>Cart-path tips</h3>
            <ul className="ts-tips-list">
              {GOLF_TIPS.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
            <p className="topic-tip">
              Tip: tag Studio posts, videos, and photos with related keywords
              (for example{" "}
              <code>{topic.tags.slice(0, 3).join(", ")}</code>) and they&apos;ll
              show up on this page automatically.
            </p>
          </div>
          <div>
            <div className="quote-box">{topic.quote}</div>
            <div className="topic-quick-links">
              <a
                href="https://www.golfthevillages.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Golf The Villages
              </a>
              <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                Rec Centers
              </Link>
              <Link href="/health" className="btn btn-ghost btn-sm">
                Health
              </Link>
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>From the reboot</h2>
              <p>Related posts, videos, and photos for golf &amp; cart culture.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Golf yet. Publish something in Studio with a
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
