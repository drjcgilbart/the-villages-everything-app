"use client";

import { useEffect, useMemo, useState } from "react";
import type { Photo } from "@/lib/types";
import { formatDate } from "@/lib/format";

function imagesOf(photo: Photo) {
  if (Array.isArray(photo.images) && photo.images.length) {
    return photo.images.filter((i) => i?.url);
  }
  if (photo.imageUrl) {
    return [{ id: "legacy", url: photo.imageUrl, caption: "" }];
  }
  return [];
}

export function PhotoCard({ photo }: { photo: Photo }) {
  const images = useMemo(() => imagesOf(photo), [photo]);
  const featuredId =
    photo.featuredImageId && images.some((i) => i.id === photo.featuredImageId)
      ? photo.featuredImageId
      : images[0]?.id;

  const [activeId, setActiveId] = useState(featuredId || "");

  // Keep selection in sync when entry data reloads
  useEffect(() => {
    setActiveId(featuredId || images[0]?.id || "");
  }, [photo.id, featuredId, images]);

  const active =
    images.find((i) => i.id === activeId) ||
    images.find((i) => i.id === featuredId) ||
    images[0] ||
    null;

  if (!active) {
    return null;
  }

  const multi = images.length > 1;
  const entryDescription = (photo.caption || "").trim();
  const imageNote = (active.caption || "").trim();

  return (
    <article className="card photo-card">
      <div className="photo-card-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={photo.title || "Photo journal entry"}
          key={active.id}
        />
        {multi && (
          <div className="photo-card-count" aria-hidden="true">
            {images.findIndex((i) => i.id === active.id) + 1} / {images.length}
          </div>
        )}
      </div>

      {multi && (
        <div className="photo-thumbs" role="list" aria-label="Photo thumbnails">
          {images.map((img) => {
            const isOn = img.id === active.id;
            const isFeatured = img.id === featuredId;
            return (
              <button
                key={img.id}
                type="button"
                role="listitem"
                className={`photo-thumb ${isOn ? "active" : ""} ${isFeatured ? "is-featured" : ""}`}
                onClick={() => setActiveId(img.id)}
                aria-label={
                  isFeatured
                    ? `Show featured photo${isOn ? " (current)" : ""}`
                    : `Show photo${isOn ? " (current)" : ""}`
                }
                aria-current={isOn ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" />
                {isFeatured && (
                  <span className="photo-thumb-star" title="Featured">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="photo-card-body">
        <div className="card-meta">
          <span className="pill pill-photo">
            {multi ? `${images.length} photos` : "Photo"}
          </span>
          <time dateTime={photo.publishedAt}>{formatDate(photo.publishedAt)}</time>
        </div>
        <h3>{photo.title}</h3>
        {/* Always show the whole-entry description from Studio */}
        {entryDescription ? (
          <p className="photo-entry-desc">{entryDescription}</p>
        ) : null}
        {/* Optional note for the currently selected image only */}
        {imageNote ? (
          <p className="photo-image-note">
            <span className="photo-image-note-label">This photo:</span> {imageNote}
          </p>
        ) : null}
        {photo.tags?.length > 0 && (
          <div className="tag-row">
            {photo.tags.slice(0, 4).map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
