import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import {
  GOLF_HUB,
  GOLF_LINK_GROUPS,
  GOLF_SNAPSHOT,
  GOLF_TIPS,
} from "@/lib/golfResources";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Golf",
  description:
    "Golf in The Villages — executive trail, trail fees, course maps, championship links, and cart-path resources from The Villages Hub.",
};

export default function GolfZonePage() {
  const topic = getTopic("golf-zone");
  const { posts, videos, photos } = getTopicContent("golf-zone");
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
              <a href="#resources" className="btn btn-primary">
                Golf resources
              </a>
              <a
                href="https://www.golfthevillages.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Golf The Villages
              </a>
              <a
                href="https://www.thevillages.com/golf/executive/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Executive courses
              </a>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src={topic.image}
              alt=""
              width={topic.image.includes("hero") ? 320 : 260}
              height={topic.image.includes("hero") ? 180 : 260}
              className={`page-hero-img${
                topic.image.includes("hero") ? " page-hero-img-wide" : ""
              }`}
              priority
            />
          </div>
        </div>
      </div>

      <section className="section" id="snapshot">
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
                <h3>{item.title}</h3>
                <p>{item.body}</p>
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
