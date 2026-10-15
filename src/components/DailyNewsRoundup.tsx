"use client";

import { useRef, useState } from "react";
import { formatDate } from "@/lib/format";
import type { ChannelYoutubeVideo } from "@/lib/channelYoutube";
import { isChannelShort, isDailyNewsRoundup } from "@/lib/newsVideoMatch";
import { SITE_BRAND } from "@/lib/siteBrand";

function thumb(videoId: string) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

function embedSrc(videoId: string, autoplay: boolean) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params}`;
}

function shortTitle(title: string) {
  return title.replace(/\s*#shorts\b/i, "").trim();
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
  const [latest] = roundups;
  const channel = SITE_BRAND.youtube;
  const playerRef = useRef<HTMLDivElement>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const playing =
    [...roundups, ...shorts].find((video) => video.videoId === pickedId) || latest || null;
  const playingShort = playing ? isChannelShort(playing) && !isDailyNewsRoundup(playing.title) : false;
  const roundupList =
    roundups.length > 1 || (latest && playing && playing.videoId !== latest.videoId)
      ? roundups
      : [];

  function pick(video: ChannelYoutubeVideo) {
    setPickedId(video.videoId);
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="section" id="daily-roundup">
      <div className="shell">
        <div className="section-head">
          <div>
            <h2>Daily news roundup</h2>
            <p>
              The latest roundup from {channel.title}, plus the shorts that go
              with it. Press play here. You stay on this page. A new upload
              shows up on its own, and older roundups stay.
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

        {loadFailed && !playing && shorts.length === 0 ? (
          <p className="lt-error" role="alert">
            The roundup list did not load. Open the channel on YouTube.
          </p>
        ) : null}

        {!playing && shorts.length === 0 && !loadFailed ? (
          <div className="empty-state">
            The next daily roundup will show up here after it is posted on YouTube.
          </div>
        ) : null}

        {playing ? (
          <div
            ref={playerRef}
            className={playingShort ? "news-roundup-lead is-short" : "news-roundup-lead"}
          >
            <div className={playingShort ? "fd-video-frame news-roundup-short-frame" : "fd-video-frame"}>
              <iframe
                key={playing.videoId}
                src={embedSrc(playing.videoId, pickedId === playing.videoId)}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="news-roundup-copy">
              <span className="card-meta">
                <span className="pill pill-video">{playingShort ? "Short" : "Roundup"}</span>
                <time dateTime={playing.publishedAt}>{formatDate(playing.publishedAt)}</time>
              </span>
              <strong>{playingShort ? shortTitle(playing.title) : playing.title}</strong>
              <em>Plays on this page</em>
            </div>
          </div>
        ) : null}

        {roundupList.length > 0 ? (
          <>
            <h3 className="news-roundup-subhead">Roundups</h3>
            <div className="news-roundup-grid">
              {roundupList.map((video) => (
                <button
                  key={video.videoId}
                  type="button"
                  className={video.videoId === playing?.videoId ? "news-roundup-card is-on" : "news-roundup-card"}
                  onClick={() => pick(video)}
                  aria-pressed={video.videoId === playing?.videoId}
                >
                  <span className="video-thumb-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(video.videoId)} alt="" className="video-thumb" />
                    <span className="play-badge" aria-hidden="true">
                      ▶
                    </span>
                  </span>
                  <span className="news-roundup-copy">
                    <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
                    <strong>{video.title}</strong>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {shorts.length > 0 ? (
          <>
            <h3 className="news-roundup-subhead">Shorts</h3>
            <div className="news-shorts-row">
              {shorts.map((video) => (
                <button
                  key={video.videoId}
                  type="button"
                  className={video.videoId === playing?.videoId ? "news-short-card is-on" : "news-short-card"}
                  onClick={() => pick(video)}
                  aria-pressed={video.videoId === playing?.videoId}
                >
                  <span className="news-short-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(video.videoId)} alt="" />
                  </span>
                  <strong>{shortTitle(video.title)}</strong>
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
