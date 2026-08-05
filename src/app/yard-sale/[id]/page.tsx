import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import { formatPrice } from "@/components/YardListingCard";
import { ListingGallery } from "@/components/ListingGallery";
import { withSellerBadges } from "@/lib/memberBadges";
import {
  getListingById,
  listingWithSeller,
} from "@/lib/yardSale";
import {
  CONDITION_LABELS,
  MEETUP_LABELS,
} from "@/lib/yardSaleTypes";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);
  return { title: listing?.title || "Listing" };
}

export default async function YardListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = getListingById(id);
  if (!raw || raw.status !== "approved") notFound();
  const listing = withSellerBadges(listingWithSeller(raw));

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <p className="panel-hint" style={{ margin: 0 }}>
            <Link href="/yard-sale" className="text-link">
              ← Community Yard Sale
            </Link>
          </p>
          <div className="card-meta" style={{ marginTop: "0.75rem" }}>
            <span className="pill pill-yard">{listing.category}</span>
            <span className={`yard-price-inline ${listing.isFree ? "free" : ""}`}>
              {formatPrice(listing)}
            </span>
            <time dateTime={listing.createdAt}>{formatDate(listing.createdAt)}</time>
          </div>
          <h1>{listing.title}</h1>
        </div>
      </div>

      <div className="section">
        <div className="shell yard-detail-grid">
          <div>
            <ListingGallery
              images={listing.images || []}
              videoUrl={listing.videoUrl}
              title={listing.title}
            />
          </div>
          <div className="yard-detail-side">
            <div className="about-panel">
              <h2 style={{ marginTop: 0 }}>Details</h2>
              <ul className="yard-detail-list">
                <li>
                  <strong>Condition:</strong>{" "}
                  {CONDITION_LABELS[listing.condition] || listing.condition}
                </li>
                <li>
                  <strong>Meetup:</strong>{" "}
                  {MEETUP_LABELS[listing.meetupType] || listing.meetupType}
                </li>
                {listing.meetupNotes && (
                  <li>
                    <strong>Meetup notes:</strong> {listing.meetupNotes}
                  </li>
                )}
                <li>
                  <strong>Category:</strong> {listing.category}
                </li>
              </ul>
              <h2>Description</h2>
              <p style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>
                {listing.description}
              </p>
            </div>

            <div className="about-panel yard-contact-panel">
              <h2 style={{ marginTop: 0 }}>Connect with seller</h2>
              {listing.seller ? (
                <>
                  <p className="member-name">
                    <strong className="member-name-text">
                      {listing.seller.name || "Seller"}
                    </strong>
                    <MemberBadgesRow badges={listing.seller.badges || []} />
                    {listing.seller.village ? (
                      <span className="panel-hint"> · {listing.seller.village}</span>
                    ) : null}
                  </p>
                  <p className="panel-hint">
                    Reach out using the contact method the seller prefers. Meet in a
                    public place when possible.
                  </p>
                  <div className="yard-contact-actions">
                    {listing.seller.email && (
                      <a
                        className="btn btn-primary"
                        href={`mailto:${listing.seller.email}?subject=${encodeURIComponent(
                          `Yard sale: ${listing.title}`
                        )}`}
                      >
                        Email seller
                      </a>
                    )}
                    {listing.seller.phone && (
                      <a className="btn btn-ghost" href={`tel:${listing.seller.phone}`}>
                        Call / text {listing.seller.phone}
                      </a>
                    )}
                    {!listing.seller.email && !listing.seller.phone && (
                      <p className="panel-hint">
                        Seller contact is limited on this listing. Ask the site admin if
                        you need help connecting.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="panel-hint">Seller information unavailable.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
