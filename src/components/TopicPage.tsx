import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic, type TopicSlug } from "@/lib/topics";

export function TopicPage({ slug }: { slug: TopicSlug }) {
  const topic = getTopic(slug);
  const { posts, videos, photos } = getTopicContent(slug);
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
          </div>
          <div className="page-hero-art">
            <Image
              src={topic.image}
              alt=""
              width={topic.image.includes("banner") || topic.image.includes("hero") ? 320 : 260}
              height={topic.image.includes("banner") || topic.image.includes("hero") ? 180 : 260}
              className={`page-hero-img${
                topic.image.includes("banner") || topic.image.includes("hero")
                  ? " page-hero-img-wide"
                  : ""
              }`}
            />
          </div>
        </div>
      </div>

      <section className="section">
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
              <Link href="/blog" className="btn btn-ghost btn-sm">
                Blog
              </Link>
              <Link href="/videos" className="btn btn-ghost btn-sm">
                Videos
              </Link>
              <Link href="/photos" className="btn btn-ghost btn-sm">
                Photos
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
              <p>Related posts, videos, and photos for this topic.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for {topic.title} yet. Publish something in Studio
              with a matching tag, and it will land here.
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
