import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { SquareEntertainmentBoard } from "@/components/SquareEntertainmentBoard";
import { TownSquareBrowser } from "@/components/TownSquareBrowser";
import { VideoCard } from "@/components/VideoCard";
import {
  ensureEntertainmentFresh,
  getEntertainmentUpdatedAt,
  loadActiveLineup,
} from "@/lib/entertainmentFetch";
import { getTopicContent } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";
import { OFFICIAL_LIVE_CAMS_URL } from "@/lib/townSquares";
import {
  OFFICIAL_NIGHTLY_ENTERTAINMENT_URL,
  floridaDateKey,
  getAllSquaresTonight,
} from "@/lib/squareEntertainment";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Town Squares",
  description:
    "Spanish Springs, Lake Sumter Landing, Brownwood, Eastport, Sawgrass Grove — who’s playing tonight, free live entertainment times, shopping, dining, and official live webcams in The Villages.",
};

export default async function TownSquaresPage() {
  await ensureEntertainmentFresh(20);

  const topic = getTopic("town-squares");
  const { posts, videos, photos } = getTopicContent("town-squares");
  const hasRelated = posts.length + videos.length + photos.length > 0;
  const dateKey = floridaDateKey();
  const lineup = loadActiveLineup();
  const tonightRows = getAllSquaresTonight(dateKey, lineup);
  const updatedAt = getEntertainmentUpdatedAt();

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#whats-on" className="btn btn-primary">
                What&apos;s on tonight
              </a>
              <a
                href={OFFICIAL_NIGHTLY_ENTERTAINMENT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Official band schedule
              </a>
              <a
                href={OFFICIAL_LIVE_CAMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Live cams
              </a>
              <a href="#squares" className="btn btn-ghost">
                The squares
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

      <section className="section" id="whats-on-section" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <SquareEntertainmentBoard
            dateKey={dateKey}
            updatedAt={updatedAt}
            lineup={lineup}
            tonightRows={tonightRows}
          />
        </div>
      </section>

      <section className="section" id="live-cams">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Live webcams</h2>
              <p>
                Peek at the squares from your couch before you cart over. We
                send you to{" "}
                <strong>The Villages&apos; official Live Web Cameras page</strong>{" "}
                — the legal, up-to-date source they maintain (including which
                angles are online today).
              </p>
            </div>
          </div>

          <div className="about-panel ts-cam-panel">
            <div className="ts-cam-panel-copy">
              <span className="pill pill-rank">Official</span>
              <h3 style={{ marginTop: "0.5rem" }}>
                Live Web Cameras · thevillages.com
              </h3>
              <p>
                Spanish Springs, Lake Sumter Landing, Brownwood Paddock Square,
                Eastport, and Sawgrass Grove are all listed there. Cams go
                offline for maintenance sometimes — that page is where those
                notices live.
              </p>
              <ul className="ts-cam-bullets">
                <li>
                  Simple outbound link to a public page (no stream embedding on
                  this site)
                </li>
                <li>
                  Avoids unofficial rebroadcasts that can vanish or raise rights
                  questions
                </li>
                <li>
                  Not affiliated with The Villages® brand or developer — just a
                  helpful pointer for neighbors
                </li>
              </ul>
              <a
                href={OFFICIAL_LIVE_CAMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open official live cams →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="squares" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>The squares</h2>
              <p>
                Pick a vibe, plan the cart path, then star your favorites so
                they stay highlighted at the top on this device.
              </p>
            </div>
          </div>

          <TownSquareBrowser
            tonightBySquareId={Object.fromEntries(
              tonightRows.map((r) => [r.squareId, r])
            )}
          />
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
              <Link href="/calendar" className="btn btn-ghost btn-sm">
                Calendar
              </Link>
              <Link href="/dining" className="btn btn-ghost btn-sm">
                Dining
              </Link>
              <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                Rec Centers
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
              <p>Related posts, videos, and photos for town squares.</p>
            </div>
          </div>

          {!hasRelated ? (
            <div className="empty-state">
              Nothing tagged for Town Squares yet. Publish something in Studio
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
