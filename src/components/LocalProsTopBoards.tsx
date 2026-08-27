"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { LocalServiceDetailLightbox } from "@/components/LocalServiceDetailLightbox";
import { StarRating } from "@/components/StarRating";
import {
  areaServiceArtPath,
  listingMainPhoto,
  type LocalServiceListing,
} from "@/lib/localServicesTypes";

export type LocalProsBoard = {
  category: string;
  leaders: LocalServiceListing[];
};

export function LocalProsTopBoards({ boards }: { boards: LocalProsBoard[] }) {
  const [detail, setDetail] = useState<LocalServiceListing | null>(null);
  const [rows, setRows] = useState(boards);

  const close = useCallback(() => setDetail(null), []);

  function openDetail(l: LocalServiceListing) {
    setDetail(l);
  }

  function applyListingUpdate(next: LocalServiceListing) {
    setDetail(next);
    setRows((prev) =>
      prev.map((board) => ({
        ...board,
        leaders: board.leaders.map((x) => (x.id === next.id ? next : x)),
      }))
    );
  }

  return (
    <>
      <div className="cuisine-boards local-pros-boards">
        {rows.map(({ category, leaders }) => (
          <div
            key={category}
            id={`trade-${slugCategory(category)}`}
            className="cuisine-board about-panel dining-anchor-target"
          >
            <div className="cuisine-board-art">
              <Image
                src={areaServiceArtPath(category)}
                alt=""
                width={640}
                height={640}
                className="cuisine-board-img"
              />
            </div>
            <div className="cuisine-board-head">
              <h3>{category}</h3>
              <span>
                {leaders.length} listed
                {leaders.some((l) => (l.stats?.reviewCount || 0) > 0)
                  ? " · ranked"
                  : ""}
              </span>
            </div>
            {leaders.length === 0 ? (
              <p className="empty-state" style={{ margin: "0.5rem 0 0" }}>
                No listings yet — submit one below.
              </p>
            ) : (
              <ol className="cuisine-leader-list">
                {leaders.map((l, i) => {
                  const thumb = listingMainPhoto(l);
                  const rank = i + 1;
                  return (
                    <li key={l.id} className="cuisine-leader-row">
                      <button
                        type="button"
                        className="cuisine-leader-link local-pros-leader-open"
                        onClick={() => openDetail(l)}
                        aria-label={`Open details for ${l.businessName}`}
                      >
                        <span className="leader-rank">{rank}</span>
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt=""
                            className="local-pros-leader-thumb"
                          />
                        ) : null}
                        <span className="leader-main">
                          <strong>{l.businessName}</strong>
                          <em>
                            {l.contactName}
                            {l.address ? ` · ${l.address}` : ""}
                            {!l.address && l.serviceArea
                              ? ` · ${l.serviceArea}`
                              : ""}
                            {l.phone ? ` · ${l.phone}` : ""}
                          </em>
                        </span>
                        <span className="leader-score">
                          {l.stats && l.stats.reviewCount > 0 ? (
                            <>
                              <StarRating
                                value={l.stats.averageRating}
                                size="sm"
                                showValue
                              />
                              <small>
                                {l.stats.reviewCount} vote
                                {l.stats.reviewCount === 1 ? "" : "s"}
                              </small>
                            </>
                          ) : (
                            <small className="leader-unrated">
                              No ratings yet
                            </small>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
      </div>

      {detail ? (
        <LocalServiceDetailLightbox
          key={detail.id}
          listing={detail}
          onClose={close}
          onListingUpdate={applyListingUpdate}
        />
      ) : null}
    </>
  );
}

function slugCategory(c: string) {
  return c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
