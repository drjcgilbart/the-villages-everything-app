import { PageHeroMascot } from "@/components/PageHeroMascot";
import { YardListingCard } from "@/components/YardListingCard";
import { YardSalePostForm } from "@/components/YardSalePostForm";
import { withSellerBadges } from "@/lib/memberBadges";
import { getSessionMember } from "@/lib/memberAuth";
import { getApprovedListings, listingWithSeller } from "@/lib/yardSale";

export const dynamic = "force-dynamic";
export const metadata = { title: "Marketplace" };

export default async function YardSalePage() {
  const member = await getSessionMember();
  const posterName =
    member && member.status === "approved" ? member.name : "";
  const listings = getApprovedListings()
    .map((listing) => listingWithSeller(listing))
    .map(withSellerBadges);

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Free for everyone · moderated</span>
            <h1>Marketplace</h1>
            <p>
              Buy, sell, or give away items among neighbors in The Villages. No
              membership required. Listings are reviewed by the site admin before
              they go live. A live listing can be edited by the person who posted
              it, or by the admin.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#post-item" className="btn btn-primary">
                Post an item
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-yard-sale.jpg"
            alt="Marketplace mascot — golf ball with a lamp, a picture frame, and a price tag"
          />
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="yard-how">
            <div className="yard-how-step">
              <strong>1. List</strong>
              <span>Up to 3 photos + 1 short video (we shrink big files), price or FREE, how to meet.</span>
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
          <p className="panel-hint">
            After a listing has been up for more than 7 days, we email the member
            to Refresh Listing, Archive Listing, or Remove Listing. Refresh moves
            it to the top and can be used 3 times. If they do not choose by day
            14, the listing comes down on its own. Fourteen days after the third
            refresh, it is removed automatically.
          </p>

          <YardSalePostForm posterName={posterName} />

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
