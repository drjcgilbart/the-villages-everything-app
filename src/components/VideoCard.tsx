import Link from "next/link";
import type { Video } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { youtubeWatchUrl } from "@/lib/youtubeLinks";

export function VideoCard({ video }: { video: Video }) {
  const watchOnYoutube =
    video.source === "youtube" && video.youtubeId
      ? youtubeWatchUrl(video.youtubeId)
      : null;
  const href = watchOnYoutube || `/videos/${video.id}`;
  const thumb =
    video.thumbnailUrl ||
    (video.youtubeId
      ? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
      : null);

  const media = (
    <>
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb} alt="" className="video-thumb" />
      ) : (
        <div className="video-thumb placeholder">▶</div>
      )}
      <span className="play-badge" aria-hidden="true">
        ▶
      </span>
      {watchOnYoutube ? (
        <span className="video-yt-chip">Watch on YouTube</span>
      ) : null}
    </>
  );

  return (
    <article className="card video-card">
      {watchOnYoutube ? (
        <a
          href={href}
          className="video-thumb-wrap"
          target="_blank"
          rel="noopener noreferrer"
        >
          {media}
        </a>
      ) : (
        <Link href={href} className="video-thumb-wrap">
          {media}
        </Link>
      )}
      <div className="video-card-body">
        <div className="card-meta">
          <span className="pill pill-video">
            {watchOnYoutube ? "Watch on YouTube" : "Upload"}
          </span>
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
        </div>
        <h3>
          {watchOnYoutube ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {video.title}
            </a>
          ) : (
            <Link href={href}>{video.title}</Link>
          )}
        </h3>
        <p>{video.description}</p>
      </div>
    </article>
  );
}
