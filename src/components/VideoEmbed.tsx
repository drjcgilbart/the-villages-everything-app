import type { Video } from "@/lib/types";

export function VideoEmbed({ video }: { video: Video }) {
  if (video.source === "youtube" && video.youtubeId) {
    return (
      <div className="video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
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
