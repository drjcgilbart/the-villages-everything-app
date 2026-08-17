import type { Video } from "@/lib/types";
import { youtubeWatchUrl } from "@/lib/youtubeLinks";

export function VideoEmbed({ video }: { video: Video }) {
  if (video.source === "youtube" && video.youtubeId) {
    const watchUrl = youtubeWatchUrl(video.youtubeId);
    const thumb =
      video.thumbnailUrl ||
      `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
    return (
      <div className="video-yt-teaser">
        <a
          href={watchUrl}
          className="video-thumb-wrap video-yt-teaser-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="video-thumb" />
          <span className="play-badge" aria-hidden="true">
            ▶
          </span>
          <span className="video-yt-chip">Watch on YouTube</span>
        </a>
        <p className="video-yt-teaser-copy">
          Opens on YouTube so the view, ads, and subscribe button count for the
          channel.
        </p>
        <a
          href={watchUrl}
          className="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube →
        </a>
      </div>
    );
  }

  if (video.videoUrl) {
    return (
      <div className="video-frame">
        <video controls playsInline poster={video.thumbnailUrl || undefined} src={video.videoUrl}>
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return <div className="empty-state">No playable source for this video yet.</div>;
}
