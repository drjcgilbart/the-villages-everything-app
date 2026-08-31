import Link from "next/link";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { YardListingCard } from "@/components/YardListingCard";
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
            <span className="kicker">Local Villagers only · moderated</span>
            <h1>Community Yard Sale</h1>
            <p>
              Buy, sell, or give away items among neighbors in The Villages.
              Listings are reviewed by the site admin before they go live.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <Link href="/yard-sale/dashboard" className="btn btn-primary">
                Post an item
              </Link>
              <Link href="/yard-sale/join" className="btn btn-ghost">
                Become a member
              </Link>
              <Link href="/yard-sale/login?next=/yard-sale/dashboard" className="btn btn-ghost">
                Member login
              </Link>
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
              <strong>1. Join</strong>
              <span>Request membership — admin approves local Villagers.</span>
            </div>
            <div className="yard-how-step">
              <strong>2. List</strong>
              <span>Up to 5 photos + 1 short video, price or FREE, meetup details.</span>
            </div>
            <div className="yard-how-step">
              <strong>3. Connect</strong>
              <span>Once approved, buyers contact you and arrange the handoff.</span>
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="empty-state">
              No approved listings yet. Be the first — join as a member and post an item.
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
