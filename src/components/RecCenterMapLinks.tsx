import {
  OFFICIAL_REC_FLIPBOOK_URL,
  OFFICIAL_REC_MAP_URL,
} from "@/lib/recCenters";

type Variant = "buttons" | "inline" | "list";

/**
 * Official District rec-center maps: Flipbook (page-turner) + current PDF.
 * Use on Rec Centers, Official Map, and Pickleball court lists.
 */
export function RecCenterMapLinks({
  variant = "inline",
}: {
  variant?: Variant;
}) {
  if (variant === "buttons") {
    return (
      <>
        <a
          href={OFFICIAL_REC_FLIPBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Flipbook rec map
        </a>
        <a
          href={OFFICIAL_REC_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          Rec map PDF
        </a>
      </>
    );
  }

  if (variant === "list") {
    return (
      <>
        <li>
          <a
            href={OFFICIAL_REC_FLIPBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Interactive rec map (Flipbook)
          </a>
          <span>Page-turner map of rec centers and amenities</span>
        </li>
        <li>
          <a
            href={OFFICIAL_REC_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            District recreation map (PDF)
          </a>
          <span>March 2026 update — all centers on one map</span>
        </li>
      </>
    );
  }

  return (
    <span className="pb-court-map-links">
      Maps:{" "}
      <a
        href={OFFICIAL_REC_FLIPBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link"
      >
        Flipbook rec map
      </a>
      {" · "}
      <a
        href={OFFICIAL_REC_MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link"
      >
        District rec map PDF
      </a>
    </span>
  );
}
