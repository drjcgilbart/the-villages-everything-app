import Image from "next/image";
import Link from "next/link";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { ClubLeaderDirectory } from "@/components/ClubLeaderDirectory";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { CLUB_OFFICIAL_RESOURCES } from "@/lib/clubs";
import { clubCategoryCounts, loadClubListingsAsync } from "@/lib/clubListings";
import {
  CLUB_CATEGORY_ART,
  CLUB_CATEGORY_BLURB,
  clubCategoryHref,
} from "@/lib/clubPaths";
import { getTopicContentAsync } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Clubs",
  description:
    "Popular clubs in The Villages, leader-updated open/closed listings with contacts, official directories, and Hub Member favorites.",
};

export default async function ClubZonePage() {
  const topic = getTopic("club-zone");
  const { posts, videos, photos } = await getTopicContentAsync("club-zone");
  const hasRelated = posts.length + videos.length + photos.length > 0;
  const clubData = await loadClubListingsAsync();
  const categories = clubCategoryCounts(clubData);
  const clubTotal = categories.reduce((n, row) => n + row.count, 0);

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#leader-directory" className="btn btn-primary">
                Club directory
              </a>
              <a href="#club-leader-form" className="btn btn-ghost">
                Leaders: update your club
              </a>
              <Link href="/my-space" className="btn btn-ghost">
                My Space favorites
              </Link>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-clubs.jpg"
            alt="Clubs mascot — golf ball with a club pin and a mah-jongg tile"
          />
        </div>
      </div>

      <section className="section" id="leader-directory">
        <div className="shell" id="clubs">
          <div className="section-head">
            <div>
              <h2>Club directory</h2>
              <p>
                {clubTotal.toLocaleString()} clubs from the District Recreation
                list. Pick a category, then a club. Star any group to save it in
                My Space.
              </p>
            </div>
          </div>
          <form className="club-search-form" action="/club-zone/search" method="get">
            <label className="rc-field club-search-field">
              <span>Search all clubs</span>
              <input
                className="rc-search"
                name="q"
                placeholder="Name, rec center, leader…"
              />
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
          <div className="club-grid">
            {categories.map((row) => (
              <Link
                key={row.category}
                href={clubCategoryHref(row.category)}
                className="about-panel club-card"
              >
                <div className="club-card-art">
                  <Image
                    src={CLUB_CATEGORY_ART[row.category]}
                    alt=""
                    width={640}
                    height={640}
                    className="club-card-img"
                  />
                </div>
                <div className="club-card-body">
                  <h3>{row.category}</h3>
                  <p className="club-card-blurb">
                    {CLUB_CATEGORY_BLURB[row.category]}
                  </p>
                  <p className="club-card-meta">
                    <strong>
                      {row.count.toLocaleString()} club
                      {row.count === 1 ? "" : "s"}
                    </strong>
                    {" · tap to browse"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="about-panel club-resources" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ marginTop: 0 }}>Official club finders</h2>
            <p className="ts-detail-muted" style={{ marginTop: 0 }}>
              Confirm meeting times with District Recreation or the club leader
              — listings change.
            </p>
            <ul className="ts-links-list">
              {CLUB_OFFICIAL_RESOURCES.map((r) => (
                <li key={r.id}>
                  {r.href.startsWith("/") ? (
                    <Link href={r.href}>{r.label}</Link>
                  ) : (
                    <a href={r.href} target="_blank" rel="noopener noreferrer">
                      {r.label}
                    </a>
                  )}
                  <span>{r.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <ClubLeaderDirectory />
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
              Tip: tag Studio posts with{" "}
              <code>{topic.tags.slice(0, 3).join(", ")}</code> to land them on
              this page.
            </p>
          </div>
          <div>
            <div className="quote-box">{topic.quote}</div>
            <div className="topic-quick-links">
              <Link href="/my-space" className="btn btn-primary btn-sm">
                My Space
              </Link>
              <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                Rec Centers
              </Link>
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
              <Link href="/forums" className="btn btn-ghost btn-sm">
                Forums
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
              <p>Related posts, videos, and photos for club life.</p>
            </div>
          </div>
          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Clubs yet. Publish in Studio with a matching
              tag.
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
