"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { prepareUploadImageFile } from "@/lib/browserImage";
import { emptyBoards, type MemoriesBoard, type MemoryItem } from "@/lib/memberBoardModel";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  MOVIE_HOUSES,
  PHOTO_CLUBS,
  PHOTO_OFFICIAL,
  PHOTO_SECTIONS,
  PHOTO_SPOTS,
  sectionLabel,
  sectionMeta,
} from "@/lib/photoCatalog";
import { useMemberBoard } from "@/components/useMemberBoard";

const MAX_ALBUM = 40;

function uid() {
  return `ph-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function MySpaceMemoriesBoard() {
  const empty = emptyBoards().memories;
  const { value, save, ready, saving, error } = useMemberBoard<MemoriesBoard>(
    "memories",
    empty,
    true
  );
  const native = isNativeAppShell();
  const libraryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(todayIso());
  const [section, setSection] = useState("private");
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  async function persist(next: MemoriesBoard) {
    await save(next);
  }

  async function onFiles(list: FileList | null) {
    const files = [...(list || [])].slice(0, 8);
    if (!files.length) return;
    setBusy(true);
    setLocalErr(null);
    const added: MemoryItem[] = [];
    try {
      for (const file of files) {
        const video = file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name);
        if (video && file.size > 25 * 1024 * 1024) {
          throw new Error(`${file.name} is over 25 MB. Trim it, then try again.`);
        }
        let send = file;
        if (!video) {
          const prep = await prepareUploadImageFile(file);
          send = prep.file;
        }
        const fd = new FormData();
        fd.append("file", send);
        const res = await fetch("/api/members/space/memories/upload", {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Upload failed");
        const kind = json.type === "video" ? "video" : "photo";
        const name = String(json.name || file.name || "file").slice(0, 80);
        added.push({
          id: uid(),
          kind,
          name,
          url: String(json.url || ""),
          caption: (caption.trim() || name).slice(0, 120),
          place: place.trim().slice(0, 200),
          date,
          section,
          addedAt: todayIso(),
        });
      }
      await persist({ photos: [...added, ...value.photos].slice(0, MAX_ALBUM) });
      setCaption("");
      setPlace("");
    } catch (e) {
      setLocalErr(e instanceof Error ? e.message : "Could not add that file");
    } finally {
      setBusy(false);
      if (libraryRef.current) libraryRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  }

  const shown =
    filter === "all"
      ? value.photos
      : value.photos.filter((p) => p.section === filter);
  const dest = sectionMeta(section);

  if (!ready) return <p className="panel-hint">Loading photos…</p>;

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">Photos &amp; movies on this account</p>
      <p className="panel-hint">
        Add stills or short clips from this computer, iPhone, or Android — they follow you when
        you sign in. Tag a Hub or My Space section so you remember where they belong. The public{" "}
        <Link href="/photos" className="text-link">
          Photo Journal
        </Link>{" "}
        stays free and is not this album.
      </p>
      {native ? (
        <p className="panel-hint">
          You&apos;re in the phone app. Use Add photos or Take a photo — Camera Roll is enough.
          The same album shows up on the website.
        </p>
      ) : (
        <p className="panel-hint">
          On a phone, open this site (or the app) while signed in and add from Camera Roll. The
          old PC-only Wi-Fi QR uploader is not needed here.
        </p>
      )}
      {error ? <p className="pf-form-error">{error}</p> : null}
      {localErr ? <p className="pf-form-error">{localErr}</p> : null}
      {saving || busy ? (
        <p className="panel-hint">{busy ? "Uploading…" : "Saving to your account…"}</p>
      ) : null}

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {value.photos.length} / {MAX_ALBUM} on this account
        </span>
        {value.photos.length ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              if (!window.confirm("Remove every photo and movie from this album? Files stay off the public Hub."))
                return;
              void persist({ photos: [] });
            }}
          >
            Clear album
          </button>
        ) : null}
      </div>

      <div className="about-panel ms-module">
        <h4>Add from this device</h4>
        <p className="panel-hint">
          Photos are compressed. Movies should stay under 25 MB. Nothing here is copied into the
          public Photo Journal unless Studio publishes it.
        </p>
        <div className="form-grid ms-module-form">
          <div className="field">
            <label>Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Lanai sunset, cart-path chaos…"
              maxLength={120}
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>Place</label>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Spanish Springs, Rohan, kitchen…"
              maxLength={200}
            />
          </div>
        </div>
        <p className="panel-hint" style={{ marginTop: "0.75rem" }}>
          Where should this live?
        </p>
        <div className="ms-photo-chips">
          {PHOTO_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`ms-photo-chip${section === s.id ? " is-on" : ""}`}
              onClick={() => setSection(s.id)}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
        <p className="panel-hint">{dest.note}</p>
        {dest.href ? (
          <p className="panel-hint">
            Public page stays free:{" "}
            <Link href={dest.href} className="text-link">
              {dest.label}
            </Link>
          </p>
        ) : null}
        <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || value.photos.length >= MAX_ALBUM}
            onClick={() => libraryRef.current?.click()}
          >
            Add photos or movies
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy || value.photos.length >= MAX_ALBUM}
            onClick={() => cameraRef.current?.click()}
          >
            Take a photo
          </button>
        </div>
        <input
          ref={libraryRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => void onFiles(e.target.files)}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => void onFiles(e.target.files)}
        />
      </div>

      <div className="ms-h-toolbar" style={{ marginTop: "1rem" }}>
        <span className="panel-hint">Album</span>
        <div className="ms-photo-chips">
          <button
            type="button"
            className={`ms-photo-chip${filter === "all" ? " is-on" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {PHOTO_SECTIONS.filter((s) => value.photos.some((p) => p.section === s.id)).map((s) => (
            <button
              key={s.id}
              type="button"
              className={`ms-photo-chip${filter === s.id ? " is-on" : ""}`}
              onClick={() => setFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="panel-hint">Nothing here yet. Use the buttons above — phone or computer.</p>
      ) : (
        <div className="ms-photo-grid">
          {shown.map((p) => {
            const meta = sectionMeta(p.section);
            return (
              <figure key={p.id} className="ms-photo-card">
                {p.kind === "video" && p.url ? (
                  <video src={p.url} controls playsInline preload="metadata" />
                ) : p.url ? (
                  <img src={p.url} alt={p.caption} />
                ) : (
                  <div className="ms-photo-missing">No file on this item — caption only</div>
                )}
                <figcaption>
                  <strong>{p.caption}</strong>
                  <span className="panel-hint">
                    {[p.date, p.place, sectionLabel(p.section)].filter(Boolean).join(" · ")}
                  </span>
                  {meta.href ? (
                    <Link href={meta.href} className="text-link">
                      Open {meta.label}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (!window.confirm("Remove this from your album?")) return;
                      void persist({
                        photos: value.photos.filter((x) => x.id !== p.id),
                      });
                    }}
                  >
                    Remove
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      <div className="about-panel ms-module">
        <h4>Villages through the lens</h4>
        <p className="panel-hint">
          Resident clubs and rec desks — confirm the room on the Rec Pub or the club site before
          you roll. Recreation: 352-674-1800.
        </p>
        <div className="hero-actions">
          {PHOTO_OFFICIAL.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.href} className="btn btn-ghost btn-sm" href={l.href}>
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                className="btn btn-ghost btn-sm"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            )
          )}
        </div>
        <div className="ms-food-guide">
          {PHOTO_CLUBS.map((s) => (
            <article key={s.name} className="ms-food-card">
              <span className="panel-hint">{s.kind.toUpperCase()}</span>
              <h4>{s.name}</h4>
              <p className="panel-hint">{s.address}</p>
              {s.phone ? (
                <p>
                  <a className="text-link" href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>
                    {s.phone}
                  </a>
                </p>
              ) : null}
              {s.hours ? <p className="panel-hint">{s.hours}</p> : null}
              <p>{s.note}</p>
              <a className="btn btn-ghost btn-sm" href={s.href} target="_blank" rel="noopener noreferrer">
                Club site
              </a>
            </article>
          ))}
        </div>
        <h4>Places that photograph well</h4>
        <div className="ms-food-guide">
          {PHOTO_SPOTS.map((s) => (
            <article key={s.name} className="ms-food-card">
              <span className="panel-hint">{s.kind.toUpperCase()}</span>
              <h4>{s.name}</h4>
              <p className="panel-hint">{s.address}</p>
              {s.phone ? (
                <p>
                  <a className="text-link" href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>
                    {s.phone}
                  </a>
                </p>
              ) : null}
              {s.hours ? <p className="panel-hint">{s.hours}</p> : null}
              <p>{s.note}</p>
              <a className="btn btn-ghost btn-sm" href={s.href} target="_blank" rel="noopener noreferrer">
                Official page
              </a>
            </article>
          ))}
        </div>
        <h4>Movies nearby</h4>
        <p className="panel-hint">
          Old Mill Playhouse is the in-town screen. Leesburg and Ocala pick up the rest. Showtimes
          change — use the theater site, not a Facebook graphic.
        </p>
        <div className="ms-food-guide">
          {MOVIE_HOUSES.map((s) => (
            <article key={s.name} className="ms-food-card">
              <span className="panel-hint">{s.kind.toUpperCase()}</span>
              <h4>{s.name}</h4>
              <p className="panel-hint">{s.address}</p>
              {s.phone ? (
                <p>
                  <a className="text-link" href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>
                    {s.phone}
                  </a>
                </p>
              ) : null}
              {s.hours ? <p className="panel-hint">{s.hours}</p> : null}
              <p>{s.note}</p>
              <a className="btn btn-ghost btn-sm" href={s.href} target="_blank" rel="noopener noreferrer">
                Showtimes
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
