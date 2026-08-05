import Link from "next/link";
import type { Video } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function VideoCard({ video }: { video: Video }) {
  const thumb =
    video.thumbnailUrl ||
    (video.youtubeId
      ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
      : null);

  return (
    <article className="card video-card">
      <Link href={`/videos/${video.id}`} className="video-thumb-wrap">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="video-thumb" />
        ) : (
          <div className="video-thumb placeholder">▶</div>
        )}
        <span className="play-badge" aria-hidden="true">
          ▶
        </span>
      </Link>
      <div className="video-card-body">
        <div className="card-meta">
          <span className="pill pill-video">
            {video.source === "youtube" ? "YouTube" : "Upload"}
          </span>
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
        </div>
        <h3>
          <Link href={`/videos/${video.id}`}>{video.title}</Link>
        </h3>
        <p>{video.description}</p>
      </div>
    </article>
  );
}
