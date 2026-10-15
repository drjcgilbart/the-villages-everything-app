import { formatDate } from "@/lib/format";
import {
  newsVideoUrl,
  type ChannelYoutubeVideo,
} from "@/lib/channelYoutube";
import { SITE_BRAND } from "@/lib/siteBrand";

function thumb(videoId: string) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function RoundupCard({
  video,
  lead = false,
}: {
  video: ChannelYoutubeVideo;
  lead?: boolean;
}) {
  const href = newsVideoUrl(video);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={lead ? "news-roundup-lead" : "news-roundup-card"}
    >
      <span className="video-thumb-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(video.videoId)} alt="" className="video-thumb" />
        <span className="play-badge" aria-hidden="true">
          ▶
        </span>
      </span>
      <span className="news-roundup-copy">
        <span className="card-meta">
          <span className="pill pill-video">Watch on YouTube</span>
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
        </span>
        <strong>{video.title}</strong>
        {lead ? <em>Latest roundup</em> : null}
      </span>
    </a>
  );
}

export function DailyNewsRoundup({
  roundups,
  shorts,
  loadFailed,
}: {
  roundups: ChannelYoutubeVideo[];
  shorts: ChannelYoutubeVideo[];
  loadFailed: boolean;
}) {
  const [latest, ...earlier] = roundups;
  const channel = SITE_BRAND.youtube;

  return (
    <section className="section" id="daily-roundup">
      <div className="shell">
        <div className="section-head">
          <div>
            <h2>Daily news roundup</h2>
            <p>
              The latest roundup from {channel.title}, plus the shorts that go
              with it. A new upload on YouTube shows up here on its own. Older
              roundups stay on this page.
            </p>
          </div>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Open the channel
          </a>
        </div>

        {loadFailed && !latest && shorts.length === 0 ? (
          <p className="lt-error" role="alert">
            The roundup list did not load. Open the channel on YouTube.
          </p>
        ) : null}

        {!latest && shorts.length === 0 && !loadFailed ? (
          <div className="empty-state">
            The next daily roundup will show up here after it is posted on YouTube.
          </div>
        ) : null}

        {latest ? <RoundupCard video={latest} lead /> : null}

        {earlier.length > 0 ? (
          <>
            <h3 className="news-roundup-subhead">Earlier roundups</h3>
            <div className="news-roundup-grid">
              {earlier.map((video) => (
                <RoundupCard key={video.videoId} video={video} />
              ))}
            </div>
          </>
        ) : null}

        {shorts.length > 0 ? (
          <>
            <h3 className="news-roundup-subhead">Shorts</h3>
            <div className="news-shorts-row">
              {shorts.map((video) => (
                <a
                  key={video.videoId}
                  href={newsVideoUrl(video)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-short-card"
                >
                  <span className="news-short-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(video.videoId)} alt="" />
                  </span>
                  <strong>{video.title.replace(/\s*#shorts\b/i, "")}</strong>
                </a>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
