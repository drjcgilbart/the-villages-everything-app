import Link from "next/link";
import type { YardListing } from "@/lib/yardSaleTypes";
import { CONDITION_LABELS, MEETUP_LABELS } from "@/lib/yardSaleTypes";
import { formatDate } from "@/lib/format";

export function formatPrice(listing: { isFree: boolean; price: number | null }) {
  if (listing.isFree || listing.price === 0 || listing.price == null) return "FREE";
  return `$${Number(listing.price).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;
}

export function YardListingCard({
  listing,
}: {
  listing: YardListing & {
    seller?: { name?: string; village?: string } | null;
  };
}) {
  const cover = listing.images?.[0];
  return (
    <article className="card yard-card">
      <Link href={`/yard-sale/${listing.id}`} className="yard-card-media">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" />
        ) : (
          <div className="yard-card-placeholder">No photo</div>
        )}
        <span className={`yard-price-badge ${listing.isFree ? "free" : ""}`}>
          {formatPrice(listing)}
        </span>
      </Link>
      <div className="yard-card-body">
        <div className="card-meta">
          <span className="pill pill-yard">{listing.category || "Item"}</span>
          <time dateTime={listing.createdAt}>{formatDate(listing.createdAt)}</time>
        </div>
        <h3>
          <Link href={`/yard-sale/${listing.id}`}>{listing.title}</Link>
        </h3>
        <p className="yard-card-desc">
          {listing.description.slice(0, 120)}
          {listing.description.length > 120 ? "…" : ""}
        </p>
        <div className="yard-card-meta">
          <span>{CONDITION_LABELS[listing.condition] || listing.condition}</span>
          <span>·</span>
          <span>{MEETUP_LABELS[listing.meetupType] || listing.meetupType}</span>
        </div>
        {listing.seller?.name && (
          <p className="yard-seller">
            Seller: {listing.seller.name}
            {listing.seller.village ? ` · ${listing.seller.village}` : ""}
          </p>
        )}
        <Link href={`/yard-sale/${listing.id}`} className="text-link">
          View listing →
        </Link>
      </div>
    </article>
  );
}
