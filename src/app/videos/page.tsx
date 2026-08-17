import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { VideoCard } from "@/components/VideoCard";
import { ensureChannelYoutubeFresh } from "@/lib/channelYoutube";
import { getPostsAsync, getVideosAsync, SITE } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Videos · My Retirement Reboot" };

type FeedItem =
  | { kind: "video"; date: string; id: string; video: ReturnType<typeof getVideos>[number] }
  | { kind: "vlog"; date: string; id: string; post: ReturnType<typeof getPosts>[number] };

export default async function VideosPage() {
  await ensureChannelYoutubeFresh();
  const videos = await getVideosAsync();
  const vlogs = await getPostsAsync("vlog");

  const feed: FeedItem[] = [
    ...videos.map((video) => ({
      kind: "video" as const,
      date: video.publishedAt,
      id: video.id,
      video,
    })),
    ...vlogs.map((post) => ({
      kind: "vlog" as const,
      date: post.publishedAt,
      id: post.id,
      post,
    })),
  ].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <p style={{ margin: "0 0 0.5rem" }}>
              <Link href="/about" className="text-link">
                ← My Retirement Reboot
              </Link>
            </p>
            <span className="kicker">Lights, camera, golf cart</span>
            <h1>Videos</h1>
            <p>
              Episode-style updates and clips from the reboot. New videos you
              publish on YouTube show up here automatically. The main show
              lives on YouTube as{" "}
              <a
                href={SITE.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {SITE.youtube.title}
              </a>{" "}
              ({SITE.youtube.handle}) — subscribe there, then browse what&apos;s
              embedded or uploaded here.
            </p>
            <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
              <a
                href={SITE.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                YouTube · {SITE.youtube.title}
              </a>
              <Link href="/about#youtube" className="btn btn-ghost btn-sm">
                About the reboot
              </Link>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-videos.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
            />
          </div>
        </div>
      </div>
      <section className="section">
        <div className="shell">
          {feed.length === 0 ? (
            <div className="empty-state">
              No videos yet. Add a YouTube URL, upload a clip, or publish a video
              episode in Studio.
            </div>
          ) : (
            <div className="card-grid">
              {feed.map((item) =>
                item.kind === "video" ? (
                  <VideoCard key={`video-${item.id}`} video={item.video} />
                ) : (
                  <PostCard key={`vlog-${item.id}`} post={item.post} />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
