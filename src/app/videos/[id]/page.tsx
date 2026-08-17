import Link from "next/link";
import { notFound } from "next/navigation";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ensureChannelYoutubeFresh } from "@/lib/channelYoutube";
import { getVideoById } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureChannelYoutubeFresh();
  const video = getVideoById(id);
  if (!video) return { title: "Video" };
  return {
    title: video.title,
    description: video.description,
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await ensureChannelYoutubeFresh();
  const video = getVideoById(id);
  if (!video) notFound();

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <div className="card-meta">
            <span className="pill pill-video">
              {video.source === "youtube" ? "YouTube" : "Upload"}
            </span>
            <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
          </div>
          <h1>{video.title}</h1>
          <p className="subtitle">{video.description}</p>
        </div>
      </div>
      <div className="section">
        <div className="shell">
          <VideoEmbed video={video} />
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/videos" className="text-link">
              ← All videos
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
