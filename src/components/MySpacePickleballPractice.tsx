"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PICKLE_PRACTICE_TOOLS,
  PICKLE_PRACTICE_TOPICS,
  PICKLE_PRACTICE_VIDEOS,
  type PicklePracticeTopic,
} from "@/lib/pickleballPractice";
import { youtubeWatchUrl } from "@/lib/youtubeLinks";

export function MySpacePickleballPractice() {
  const [topic, setTopic] = useState<PicklePracticeTopic | "all">("all");
  const videos = useMemo(
    () =>
      topic === "all"
        ? PICKLE_PRACTICE_VIDEOS
        : PICKLE_PRACTICE_VIDEOS.filter((v) => v.topic === topic),
    [topic]
  );

  return (
    <>
      <p className="panel-hint">
        A shelf we picked — short tips and a few tools with a job each. Nothing auto-plays.
        Public{" "}
        <Link href="/pickleball" className="text-link">
          Pickleball hub
        </Link>{" "}
        stays free.
      </p>

      <h3>Tips &amp; tricks</h3>
      <div className="ms-photo-chips" style={{ margin: "0.5rem 0 0.85rem" }}>
        {PICKLE_PRACTICE_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-photo-chip${topic === t.id ? " is-on" : ""}`}
            onClick={() => setTopic(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ms-golf-practice-grid">
        {videos.map((v) => {
          const href = youtubeWatchUrl(v.youtubeId);
          const thumb = `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`;
          return (
            <article key={v.id} className="ms-golf-practice-card">
              <a
                href={href}
                className="ms-golf-practice-thumb"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt="" />
                <span aria-hidden>▶</span>
              </a>
              <span className="panel-hint">
                {v.topic.toUpperCase()} · {v.minutes} · {v.channel}
              </span>
              <h4>{v.title}</h4>
              <p>{v.why}</p>
              <a
                href={href}
                className="btn btn-ghost btn-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
            </article>
          );
        })}
      </div>

      <h3 style={{ marginTop: "1.35rem" }}>Apps &amp; tools</h3>
      <p className="panel-hint">
        Opens in a new tab. We do not sell these — they are the usual suspects with a Villages
        note so you know when they actually help here.
      </p>
      <div className="ms-golf-tool-grid">
        {PICKLE_PRACTICE_TOOLS.map((t) => (
          <article key={t.id} className="about-panel ms-module ms-golf-tool">
            <span className="panel-hint">{t.job}</span>
            <h4 style={{ margin: "0.2rem 0 0.45rem" }}>{t.label}</h4>
            <p>{t.villages}</p>
            <a
              href={t.href}
              className="btn btn-ghost btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open {t.label}
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
