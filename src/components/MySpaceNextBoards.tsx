"use client";

import Link from "next/link";
import { useState } from "react";
import {
  emptyBoards,
  type MemoriesBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

export { MySpaceEntertainmentBoard } from "@/components/MySpaceEntertainmentBoard";
export { MySpaceMaintenanceBoard } from "@/components/MySpaceMaintenanceBoard";
export { MySpaceNewsBoard } from "@/components/MySpaceNewsBoard";
export {
  MySpaceFoodBoard,
  MySpaceGolfLogBoard,
  MySpaceGymBoard,
  MySpacePickleballLogBoard,
} from "@/components/MySpaceLifeBoards";

function Status({ error, saving }: { error: string | null; saving: boolean }) {
  if (error) return <p className="pf-form-error">{error}</p>;
  if (saving) return <p className="panel-hint">Saving to your account…</p>;
  return null;
}

export function MySpaceMemoriesBoard() {
  const empty = emptyBoards().memories;
  const { value, save, ready, saving, error } = useMemberBoard<MemoriesBoard>(
    "memories",
    empty,
    true
  );
  const [caption, setCaption] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  if (!ready) return <p className="panel-hint">Loading photos…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Private album captions on your account. The public Photo Journal stays free.
      </p>
      <p className="panel-hint">
        Public Hub page stays free:{" "}
        <Link href="/photos" className="text-link">
          Photo Journal
        </Link>
      </p>
      <Status error={error} saving={saving} />
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!caption.trim()) return;
          void save({
            photos: [
              {
                id: `ph-${Date.now().toString(36)}`,
                caption: caption.trim().slice(0, 120),
                extra: place.trim().slice(0, 200) || undefined,
                date: date,
              },
              ...value.photos,
            ].slice(0, 60),
          });
          setCaption("");
          setPlace("");
          setDate("");
        }}
      >
        <div className="field">
          <label>Caption</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} required />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Place</label>
          <input value={place} onChange={(e) => setPlace(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add to album
        </button>
      </form>
      <ul className="ms-cal-list">
        {value.photos.map((p) => (
          <li key={p.id}>
            <div>
              <strong>{p.caption}</strong>
              <span>
                {[p.date, p.extra].filter(Boolean).join(" · ")}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void save({ photos: value.photos.filter((x) => x.id !== p.id) })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
