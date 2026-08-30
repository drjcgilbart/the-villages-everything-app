import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PickleballHub } from "@/components/PickleballHub";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import {
  PICKLEBALL_ART,
  PICKLEBALL_FEATURE_CARDS,
  PICKLEBALL_HUB,
  PICKLEBALL_LINK_GROUPS,
  PICKLEBALL_SNAPSHOT,
} from "@/lib/pickleballResources";
import { getTopicContentAsync } from "@/lib/topicContent";
import { getTopic } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pickleball",
  description:
    "Pickleball in The Villages — DUPR leader board, find a game, rec-center courts, and official links from The Villages Everything App.",
};

export default async function PickleballPage() {
  const topic = getTopic("pickleball");
  const { posts, videos, photos } = await getTopicContentAsync("pickleball");
  const hasRelated = posts.length + videos.length + photos.length > 0;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{topic.kicker}</span>
            <h1>{topic.title}</h1>
            <p>
              {topic.description} {PICKLEBALL_HUB.blurb}
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#dupr-board" className="btn btn-primary">
                DUPR board
              </a>
              <a href="#find-game" className="btn btn-ghost">
                Find a game
              </a>
              <a href="#courts" className="btn btn-ghost">
                Courts
              </a>
              <a href="#resources" className="btn btn-ghost">
                Official links
              </a>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src={PICKLEBALL_ART.theme}
              alt=""
              width={280}
              height={280}
              className="page-hero-img"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section" id="pickleball-features" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Grab a paddle</h2>
              <p>
                Jump to the DUPR board, find a game, pick a rec center, or open
                official Villages pickleball links.
              </p>
            </div>
          </div>
          <div className="golf-feature-grid">
            {PICKLEBALL_FEATURE_CARDS.map((card) => (
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

      <section className="section" id="pickleball-club">
        <div className="shell">
          <PickleballHub />
        </div>
      </section>

      <section className="section" id="snapshot" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>How pickleball works here</h2>
              <p>
                Neighbor-oriented notes — confirm court times and heat policy
                on the official rec pages before you cart over.
              </p>
            </div>
          </div>
          <div className="golf-snapshot-grid">
            {PICKLEBALL_SNAPSHOT.map((item) => (
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
              <h2>Official pickleball links</h2>
              <p>
                DUPR, Pickleballers clubs, the rec calendar, and the kitchen
                diagram.
              </p>
            </div>
          </div>
          <div className="golf-resource-groups">
            {PICKLEBALL_LINK_GROUPS.map((group) => (
              <div key={group.title} className="about-panel golf-resource-group">
                <h3>{group.title}</h3>
                <p className="golf-resource-blurb">{group.blurb}</p>
                <ul className="ts-links-list">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                      <span>{link.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "1.25rem" }}>
            <Link href="/golf-zone" className="btn btn-ghost">
              Golf
            </Link>{" "}
            <Link href="/rec-centers" className="btn btn-ghost">
              Rec Centers
            </Link>{" "}
            <Link href="/club-zone" className="btn btn-ghost">
              Clubs
            </Link>
          </p>
        </div>
      </section>

      {hasRelated ? (
        <section className="section">
          <div className="shell">
            <div className="section-head">
              <div>
                <h2>From the hub</h2>
                <p>Stories, photos, and clips tagged pickleball.</p>
              </div>
            </div>
            <div className="card-grid">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
              {photos.map((ph) => (
                <PhotoCard key={ph.id} photo={ph} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <DonateMascot />
    </>
  );
}
