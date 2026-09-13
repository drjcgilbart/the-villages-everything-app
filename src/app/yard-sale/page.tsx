import { PageHeroMascot } from "@/components/PageHeroMascot";
import { YardListingCard } from "@/components/YardListingCard";
import { YardSalePostForm } from "@/components/YardSalePostForm";
import { withSellerBadges } from "@/lib/memberBadges";
import { getApprovedListings, listingWithSeller } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const metadata = { title: "Community Yard Sale" };

export default function YardSalePage() {
  const listings = getApprovedListings()
    .map(listingWithSeller)
    .map(withSellerBadges);

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Free for everyone · moderated</span>
            <h1>Community Yard Sale</h1>
            <p>
              Buy, sell, or give away items among neighbors in The Villages. No
              membership required. Listings are reviewed by the site admin before
              they go live.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#post-item" className="btn btn-primary">
                Post an item
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-yard-sale.jpg"
            alt="Yard Sale mascot — golf ball with a lamp, a picture frame, and a price tag"
          />
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="yard-how">
            <div className="yard-how-step">
              <strong>1. List</strong>
              <span>Up to 5 photos + 1 short video, price or FREE, how to meet.</span>
            </div>
            <div className="yard-how-step">
              <strong>2. Review</strong>
              <span>The site admin checks it, then it appears on this page.</span>
            </div>
            <div className="yard-how-step">
              <strong>3. Connect</strong>
              <span>Buyers email or call you and arrange the handoff.</span>
            </div>
          </div>

          <YardSalePostForm />

          <h2 style={{ marginTop: "2rem" }}>Live listings</h2>
          {listings.length === 0 ? (
            <div className="empty-state">
              No listings yet. Be the first — post an item above.
            </div>
          ) : (
            <div className="yard-grid">
              {listings.map((listing) => (
                <YardListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
