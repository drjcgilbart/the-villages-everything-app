import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { ARTISAN_GUILD } from "@/lib/artisanGuild";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Art",
  description:
    "Creative life in The Villages — featuring The Villages Artisan Guild marketplace for pottery, glass, and paintings, plus local art notes from the hub.",
};

export default function ArtsAndCraftsPage() {
  const topic = getTopic("arts-and-crafts");
  const { posts, videos, photos } = getTopicContent("arts-and-crafts");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a
                href={ARTISAN_GUILD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Artisan Guild →
              </a>
              <a
                href={ARTISAN_GUILD.shopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Shop the collection
              </a>
              <a href="#guild" className="btn btn-ghost">
                About the guild
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

      <section className="section" id="guild">
        <div className="shell">
          <div className="about-panel artisan-guild-feature">
            <div className="artisan-guild-copy">
              <span className="pill pill-rank">Featured · local makers</span>
              <h2 style={{ marginTop: "0.5rem" }}>{ARTISAN_GUILD.name}</h2>
              <p className="artisan-guild-tagline">{ARTISAN_GUILD.tagline}</p>
              <p>{ARTISAN_GUILD.blurb}</p>
              <p className="ts-detail-muted" style={{ marginBottom: "0.85rem" }}>
                Pottery · glass fusion · original paintings — made by artists of
                The Villages. Secure online shopping, and a consignment path if
                you create and want to sell.
              </p>
              <div className="hero-actions">
                <a
                  href={ARTISAN_GUILD.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Visit artisan guild site →
                </a>
                <a
                  href={ARTISAN_GUILD.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Shop
                </a>
                <a
                  href={ARTISAN_GUILD.artistsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Meet the artists
                </a>
                <a
                  href={ARTISAN_GUILD.consignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Consign your work
                </a>
              </div>
            </div>
            <div className="artisan-guild-art">
              <Image
                src={topic.image}
                alt=""
                width={320}
                height={320}
                className="artisan-guild-img"
              />
            </div>
          </div>

          <div className="artisan-medium-grid">
            {ARTISAN_GUILD.mediums.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="about-panel artisan-medium-card"
              >
                <h3>{m.label}</h3>
                <p>{m.note}</p>
                <span className="text-link">Browse on guild site →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <h2>What you&apos;ll find here</h2>
            <ul className="topic-highlight-list">
              <li>
                <strong>The Villages Artisan Guild</strong>
                <span>
                  Featured marketplace for local pottery, glass, and paintings —
                  shop or consign at{" "}
                  <a
                    href={ARTISAN_GUILD.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    thevillagesartisanguild.com
                  </a>
                  .
                </span>
              </li>
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
                href={ARTISAN_GUILD.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Artisan Guild
              </a>
              <Link href="/club-zone" className="btn btn-ghost btn-sm">
                Clubs
              </Link>
              <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                Rec Centers
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
              <p>Related posts, videos, and photos for art &amp; making.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Art yet. Publish something in Studio with a
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
