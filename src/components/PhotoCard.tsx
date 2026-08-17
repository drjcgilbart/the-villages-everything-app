"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo, PhotoImage } from "@/lib/types";
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
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  // Keep selection in sync when entry data reloads
  useEffect(() => {
    setActiveId(featuredId || images[0]?.id || "");
  }, [photo.id, featuredId, images]);

  const active =
    images.find((i) => i.id === activeId) ||
    images.find((i) => i.id === featuredId) ||
    images[0] ||
    null;

  const openLarge = useCallback((img: PhotoImage) => {
    setActiveId(img.id);
    setLightboxId(img.id);
  }, []);

  const closeLarge = useCallback(() => setLightboxId(null), []);

  const lightboxIndex = lightboxId
    ? images.findIndex((i) => i.id === lightboxId)
    : -1;
  const lightboxImage = lightboxIndex >= 0 ? images[lightboxIndex] : null;

  const showPrev = useCallback(() => {
    if (images.length < 2 || lightboxIndex < 0) return;
    const next = images[(lightboxIndex - 1 + images.length) % images.length];
    setActiveId(next.id);
    setLightboxId(next.id);
  }, [images, lightboxIndex]);

  const showNext = useCallback(() => {
    if (images.length < 2 || lightboxIndex < 0) return;
    const next = images[(lightboxIndex + 1) % images.length];
    setActiveId(next.id);
    setLightboxId(next.id);
  }, [images, lightboxIndex]);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLarge();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxImage, closeLarge, showPrev, showNext]);

  if (!active) {
    return null;
  }

  const multi = images.length > 1;
  const entryDescription = (photo.caption || "").trim();
  const imageNote = (active.caption || "").trim();
  const lightboxNote = (lightboxImage?.caption || "").trim();

  return (
    <article className="card photo-card">
      <div className="photo-card-frame">
        <button
          type="button"
          className="photo-card-open"
          onDoubleClick={() => openLarge(active)}
          onClick={(e) => {
            if (e.detail === 0) openLarge(active);
          }}
          aria-label={`See larger picture: ${photo.title || "Photo journal entry"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.url}
            alt={photo.title || "Photo journal entry"}
            key={active.id}
            draggable={false}
          />
        </button>
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
                onDoubleClick={(e) => {
                  e.preventDefault();
                  openLarge(img);
                }}
                aria-label={
                  isFeatured
                    ? `Show featured photo${isOn ? " (current)" : ""}`
                    : `Show photo${isOn ? " (current)" : ""}`
                }
                aria-current={isOn ? "true" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" draggable={false} />
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
        {entryDescription ? (
          <p className="photo-entry-desc">{entryDescription}</p>
        ) : null}
        {imageNote ? (
          <p className="photo-image-note">
            <span className="photo-image-note-label">This photo:</span> {imageNote}
          </p>
        ) : null}
        <button
          type="button"
          className="text-link photo-see-larger"
          onClick={() => openLarge(active)}
        >
          See larger picture
        </button>
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

      {portalReady && lightboxImage
        ? createPortal(
            <div
              className="photo-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={photo.title || "Larger picture"}
              onClick={closeLarge}
            >
              <div
                className="photo-lightbox-inner"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="photo-lightbox-close"
                  onClick={closeLarge}
                >
                  Close
                </button>
                {multi ? (
                  <button
                    type="button"
                    className="photo-lightbox-nav is-prev"
                    onClick={showPrev}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxImage.url}
                  alt={photo.title || "Larger picture"}
                  className="photo-lightbox-img"
                />
                {multi ? (
                  <button
                    type="button"
                    className="photo-lightbox-nav is-next"
                    onClick={showNext}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                ) : null}
                <div className="photo-lightbox-caption">
                  <strong>{photo.title}</strong>
                  {multi ? (
                    <span>
                      {" "}
                      · {lightboxIndex + 1} of {images.length}
                    </span>
                  ) : null}
                  {lightboxNote ? <p>{lightboxNote}</p> : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </article>
  );
}
