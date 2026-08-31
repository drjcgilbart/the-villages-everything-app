import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { EventsCalendar } from "@/components/EventsCalendar";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { getTopicContentAsync } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Calendar of Events",
  description:
    "Local events calendar for The Villages — live entertainment and community listings updated daily, with upcoming and past events this month.",
};

export default async function CalendarPage() {
  const topic = getTopic("calendar");
  const { posts, videos, photos } = await getTopicContentAsync("calendar");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>
              {topic.description} We pull public local entertainment listings
              daily so you can scan the month, jump to a day, and see what&apos;s
              coming up — plus what already happened this month.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#events-calendar" className="btn btn-primary">
                Open calendar
              </a>
              <Link href="/town-squares" className="btn btn-ghost">
                Town Squares
              </Link>
              <Link href="/club-zone" className="btn btn-ghost">
                Clubs
              </Link>
              <a
                href="https://www.thevillagesentertainment.com/nightly-entertainment/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Official entertainment
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-calendar.jpg"
            alt="Calendar mascot — golf ball holding a starred calendar"
          />
        </div>
      </div>

      <section className="section" id="events-calendar">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Local events calendar</h2>
              <p>
                Month grid with event dots · click a day for details · upcoming
                and recently passed lists for the same month. Auto-refreshed
                daily from public listings.
              </p>
            </div>
          </div>
          <EventsCalendar />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <h2>How this works</h2>
            <ul className="topic-highlight-list">
              <li>
                <strong>Daily refresh</strong>
                <span>
                  A scheduled job re-reads public entertainment calendars so the
                  grid stays current without you hunting five websites.
                </span>
              </li>
              <li>
                <strong>Month at a glance</strong>
                <span>
                  Dots mark busy nights; past days this month stay on the grid
                  so you can reminisce (or confirm you didn&apos;t miss
                  anything).
                </span>
              </li>
              <li>
                <strong>Town square energy</strong>
                <span>
                  Most scraped listings are free nightly entertainment at the
                  squares — pair with Town Squares pages for maps and vibes.
                </span>
              </li>
            </ul>
            <div className="topic-quick-links" style={{ marginTop: "1rem" }}>
              <Link href="/town-squares" className="btn btn-primary btn-sm">
                Town Squares
              </Link>
              <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                Rec Centers
              </Link>
              <Link href="/golf-zone" className="btn btn-ghost btn-sm">
                Golf
              </Link>
            </div>
          </div>
          <div>
            <div className="quote-box">{topic.quote}</div>
            <p className="topic-tip" style={{ marginTop: "1rem" }}>
              Tip: tag Studio posts with{" "}
              <code>{topic.tags.slice(0, 3).join(", ")}</code> for the feed
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
              <p>Related posts, videos, and photos for calendar &amp; events.</p>
            </div>
          </div>
          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Calendar yet. Publish something in Studio with
              a matching tag, and it will land here.
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
