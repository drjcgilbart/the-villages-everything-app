import Image from "next/image";
import Link from "next/link";
import { DonateMascot } from "@/components/DonateMascot";
import { PhotoCard } from "@/components/PhotoCard";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { ensureChannelYoutubeFresh } from "@/lib/channelYoutube";
import { getPhotosAsync, getPostsAsync, getVideosAsync, SITE } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Retirement Reboot" };

const REBOOT_MEDIA = [
  {
    href: "/blog",
    label: "Blog",
    blurb: "Essays, rants, and field notes from the reboot — half-baked wisdom included.",
    image: "/graphics/theme-blog.jpg",
  },
  {
    href: "/photos",
    label: "Photos",
    blurb: "Cart paths, sunsets, pets, and Florida evidence photos with short captions.",
    image: "/graphics/theme-photos.jpg",
  },
  {
    href: "/videos",
    label: "Videos",
    blurb: "Thumbnails that send neighbors to YouTube — lights, camera, golf cart.",
    image: "/graphics/theme-videos.jpg",
  },
] as const;

export default async function AboutPage() {
  await ensureChannelYoutubeFresh();
  const posts = (await getPostsAsync("blog")).slice(0, 3);
  const photos = (await getPhotosAsync()).slice(0, 3);
  const vlogPosts = await getPostsAsync("vlog");
  const allVideos = await getVideosAsync();
  const videoFeed = [
    ...allVideos.map((video) => ({
      kind: "video" as const,
      date: video.publishedAt,
      video,
    })),
    ...vlogPosts.map((post) => ({
      kind: "vlog" as const,
      date: post.publishedAt,
      post,
    })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">The fine print of the joke</span>
            <h1>My Retirement Reboot</h1>
            <p>
              The personal corner of {SITE.name} — blog, photos, and videos from
              one resident&apos;s moderately ridiculous life in The Villages.
              This page is the public story (free). The private daily boards —
              weather, health, pets, and the rest — live in{" "}
              <Link href="/my-space">My Space</Link> for members. If you used
              the old standalone dashboard, this Hub is the new home.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a
                href={SITE.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                YouTube · {SITE.youtube.title}
              </a>
              <Link href="/blog" className="btn btn-ghost">
                Blog
              </Link>
              <Link href="/photos" className="btn btn-ghost">
                Photos
              </Link>
              <Link href="/videos" className="btn btn-ghost">
                Videos
              </Link>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/mascot-reboot.jpg"
              alt="My Retirement Reboot mascot — golf ball with a pineapple drink"
              width={280}
              height={280}
              className="about-mascot about-mascot-round"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section" id="youtube">
        <div className="shell">
          <div className="about-panel reboot-youtube-feature">
            <div className="reboot-youtube-copy">
              <span className="pill pill-rank">Featured channel</span>
              <h2 style={{ marginTop: "0.5rem" }}>{SITE.youtube.title}</h2>
              <p className="reboot-youtube-handle">{SITE.youtube.handle}</p>
              <p>
                The video home of this reboot — carts, chaos, Florida field
                notes, and whatever happens next on camera. New YouTube uploads
                land on the Videos page automatically. Watch on YouTube, then
                come back here for the blog and photo journal that go with the
                plot twist.
              </p>
              <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
                <a
                  href={SITE.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Open on YouTube →
                </a>
                <Link href="/videos" className="btn btn-ghost">
                  Videos on this site
                </Link>
              </div>
            </div>
            <div className="reboot-youtube-art">
              <Image
                src="/graphics/theme-videos.jpg"
                alt=""
                width={320}
                height={320}
                className="reboot-youtube-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Reboot media</h2>
              <p>
                Everything that used to clutter the homepage lives here now —
                so the hub can focus on Villagers, not just me. Start with{" "}
                <a
                  href={SITE.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  {SITE.youtube.title}
                </a>{" "}
                on YouTube, then dig into the rest.
              </p>
            </div>
          </div>
          <div className="themes-strip themes-graphic hub-main-topic-grid">
            {REBOOT_MEDIA.map((item) => (
              <Link key={item.href} href={item.href} className="theme-card">
                <div className="theme-card-art">
                  <Image
                    src={item.image}
                    alt=""
                    width={640}
                    height={640}
                    className="theme-card-img"
                  />
                </div>
                <div className="theme-card-body">
                  <strong>{item.label}</strong>
                  <span>{item.blurb}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="about-banner">
            <Image
              src="/graphics/banner-sunset.jpg"
              alt="Illustrated Florida retirement sunset over a retirement community pond"
              width={1200}
              height={400}
              className="about-banner-img"
            />
          </div>
        </div>
        <div className="shell about-grid" style={{ marginTop: "1.25rem" }}>
          <div className="about-panel">
            <h2>What this corner is</h2>
            <p>
              A moderately whimsical, occasionally ironic notebook of life inside
              the world&apos;s largest active retirement community — The Villages,
              Florida.
            </p>
            <p>
              Think creator-channel energy: long-form posts, photo journals, and
              videos. Less polished lifestyle brand, more honest reboot with
              better snacks. The <strong>hub tools</strong> (dining, forums, my
              village, etc.) are for everyone; this section is the origin story.
            </p>
            <p style={{ marginBottom: 0 }}>
              <Link href="/" className="text-link">
                ← Back to The Villages Everything App
              </Link>
            </p>
          </div>
          <div>
            <div className="quote-box">
              “I didn&apos;t come here to be perfect. I came here to reboot —
              loudly, sunnily, and with better snacks.”
            </div>
            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Not affiliated</h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Independent personal project. Not owned by, endorsed by, or
                affiliated with The Villages® operators or developers. Graphics
                are original artwork for {SITE.name}.
              </p>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <DonateMascot variant="card" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Latest from the blog</h2>
              <p>Half-baked wisdom — freshly documented.</p>
            </div>
            <Link href="/blog" className="text-link">
              All posts →
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="empty-state">No posts yet.</div>
          ) : (
            <div className="card-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Photo journal</h2>
              <p>Short captions, big Florida energy.</p>
            </div>
            <Link href="/photos" className="text-link">
              All photos →
            </Link>
          </div>
          {photos.length === 0 ? (
            <div className="empty-state">No photos yet.</div>
          ) : (
            <div className="photo-grid">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>On camera</h2>
              <p>Thumbnails open on YouTube so views count for the channel.</p>
            </div>
            <Link href="/videos" className="text-link">
              All videos →
            </Link>
          </div>
          {videoFeed.length === 0 ? (
            <div className="empty-state">No videos yet.</div>
          ) : (
            <div className="card-grid">
              {videoFeed.map((item) =>
                item.kind === "video" ? (
                  <VideoCard key={`video-${item.video.id}`} video={item.video} />
                ) : (
                  <PostCard key={`vlog-${item.post.id}`} post={item.post} />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
