"use client";

import { useState } from "react";

export function ListingGallery({
  images,
  videoUrl,
  title,
}: {
  images: string[];
  videoUrl?: string | null;
  title: string;
}) {
  const items = [
    ...images.map((url, i) => ({ type: "image" as const, url, id: `img-${i}` })),
    ...(videoUrl
      ? [{ type: "video" as const, url: videoUrl, id: "video" }]
      : []),
  ];
  const [active, setActive] = useState(0);
  const current = items[active] || items[0];

  if (!current) {
    return <div className="empty-state">No media</div>;
  }

  return (
    <div className="listing-gallery">
      <div className="listing-gallery-main">
        {current.type === "video" ? (
          <video src={current.url} controls playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={title} />
        )}
      </div>
      {items.length > 1 && (
        <div className="photo-thumbs listing-thumbs">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`photo-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={item.type === "video" ? "Show video" : `Show photo ${i + 1}`}
            >
              {item.type === "video" ? (
                <span className="listing-thumb-video">▶</span>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
