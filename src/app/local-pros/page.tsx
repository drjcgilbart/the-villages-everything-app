import Image from "next/image";
import Link from "next/link";
import { LocalProsTopBoards } from "@/components/LocalProsTopBoards";
import { LocalServicesHub } from "@/components/LocalServicesHub";
import { StarRating } from "@/components/StarRating";
import {
  allCategoryLeaders,
  ensureDailyLeaderboard,
  loadLocalServicesAsync,
} from "@/lib/localServices";
import {
  AREA_SERVICE_CATEGORIES,
  areaServiceArtPath,
} from "@/lib/localServicesTypes";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Local Pros — Area Businesses",
  description:
    "Trades and service businesses in and around The Villages — rate electricians, plumbers, salons, vets, dog walkers, house sitters, home watch, and more. Top 5 leaderboards by category.",
};

export default async function LocalProsPage() {
  const data = await loadLocalServicesAsync();
  const daily = await ensureDailyLeaderboard("area");
  // Live top 5 (updates as votes land); minReviews=0 so boards show even without votes yet
  const categoryBoards = allCategoryLeaders("area", 5, 0, data);
  const championCount = daily.champions.length;

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Trades · pets · home watch · ratings</span>
            <h1>Local Pros</h1>
            <p>
              Businesses that serve Villagers from Lady Lake, Wildwood,
              Fruitland Park, Leesburg, and nearby — electricians, plumbers,
              hair &amp; nail salons, vets, dog walkers, pet sitters, house
              sitters, and home watch (packages, sprinklers, and a walk-through
              while you&apos;re out of town). Rate them like dining: 1–5 stars,
              top 5 per trade, and a running champion strip that refreshes at
              least once a day.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#daily-champs" className="btn btn-primary">
                Today&apos;s champs
              </a>
              <a href="#by-trade" className="btn btn-ghost">
                Top 5 by trade
              </a>
              <a href="#directory" className="btn btn-ghost">
                Full directory
              </a>
              <Link href="/support-local-villagers" className="btn btn-ghost">
                Support Local Villagers
              </Link>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-community-resources.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
              priority
            />
          </div>
        </div>
      </div>

      {/* Daily running leaderboard — one champion per category */}
      <section className="section" id="daily-champs" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Running leaderboard · category champs</h2>
              <p>
                Highest-rated pro in each trade (needs at least 1 vote). Snapshot
                refreshes once per day (Eastern) — currently as of{" "}
                <strong>{daily.asOf}</strong>
                {daily.updatedAt ? (
                  <>
                    {" "}
                    · last rebuild {formatDate(daily.updatedAt)}
                  </>
                ) : null}
                . Category boards below update live as neighbors vote.
              </p>
            </div>
          </div>

          {championCount === 0 ? (
            <div className="empty-state about-panel">
              No champs yet — open a listing below, leave a star rating, and
              tomorrow&apos;s board will fill in.
            </div>
          ) : (
            <div className="local-pros-champ-strip">
              {daily.champions.map((c) => (
                <a
                  key={c.category}
                  href={`#trade-${slugCategory(c.category)}`}
                  className="local-pros-champ-card about-panel"
                >
                  <div className="local-pros-champ-art">
                    <Image
                      src={areaServiceArtPath(c.category)}
                      alt=""
                      width={120}
                      height={120}
                      className="local-pros-champ-img"
                    />
                  </div>
                  <div className="local-pros-champ-body">
                    <span className="pill">{c.category}</span>
                    <strong>{c.businessName}</strong>
                    <em>{c.contactName}</em>
                    <span className="local-pros-champ-score">
                      <StarRating
                        value={c.averageRating}
                        size="sm"
                        showValue
                      />
                      <small>
                        {c.reviewCount} vote{c.reviewCount === 1 ? "" : "s"}
                      </small>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Jump chips */}
      <section className="section" style={{ paddingBottom: 0, paddingTop: "1.25rem" }}>
        <div className="shell">
          <div className="dining-jump">
            <span className="dining-jump-label">Jump to trade</span>
            {AREA_SERVICE_CATEGORIES.map((c) => (
              <a
                key={c}
                href={`#trade-${slugCategory(c)}`}
                className="dining-chip"
              >
                {shortTradeLabel(c)}
              </a>
            ))}
            <a href="#directory" className="dining-chip">
              Full directory
            </a>
            <a href="#local-service-form" className="dining-chip">
              List a business
            </a>
          </div>
        </div>
      </section>

      {/* Top 5 by category — dining-style boards with animal art */}
      <section className="section" id="by-trade">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Top 5 by trade</h2>
              <p>
                Same idea as dining&apos;s cuisine boards: cute Florida critters
                for each trade, top five ranked by average star rating (then vote
                count). Click any pro for photos, contact info, and to leave a
                rating.
              </p>
            </div>
          </div>

          <LocalProsTopBoards boards={categoryBoards} />
        </div>
      </section>

      <section className="section" id="directory">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Full area directory</h2>
              <p>
                Browse, search, and rate. Seeded listings use public business
                info (name, address, phone, website) with a map search link —
                always verify hours and licenses yourself. Independent directory
                — not affiliated with The Villages® operators. Hire at your own
                discretion.
              </p>
            </div>
          </div>
          <LocalServicesHub scope="area" />
        </div>
      </section>
    </>
  );
}

function slugCategory(c: string) {
  return c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortTradeLabel(c: string) {
  const map: Record<string, string> = {
    Electricians: "Electric",
    Plumbers: "Plumbing",
    "HVAC & Air Conditioning": "HVAC",
    "Landscaping & Lawn Care": "Lawn",
    "Lightning Protection": "Lightning",
    "Aluminum Screens & Enclosures": "Screens",
    "Pools — Build & Service": "Pools",
    "Birdcages & Lanai Enclosures": "Birdcages",
    "Driveways, Pavers & Staining": "Pavers",
    Roofing: "Roofing",
    Painting: "Painting",
    "Pressure Washing & Window Cleaning": "Pressure wash",
    "Garage Doors": "Garage doors",
    "Irrigation & Sprinklers": "Irrigation",
    "Pest Control": "Pest",
    "Solar Energy": "Solar",
    "Concrete & Hardscape": "Concrete",
    "Tree Service": "Trees",
    "Handyman & Remodeling": "Handyman",
    Flooring: "Flooring",
    "Security Systems": "Security",
    "Moving & Hauling": "Moving",
    "Appliance Repair": "Appliances",
    "Golf Cart Service": "Golf carts",
    "Gutter Cleaning & Installation": "Gutters",
    "Fence & Gate": "Fencing",
    "Hair Salons": "Hair",
    "Nail Salons": "Nails",
    Barbers: "Barbers",
    "Spas & Massage": "Spa",
    "Pet Grooming": "Grooming",
    Veterinarians: "Vets",
    "Dog Walkers": "Walkers",
    "Pet Sitting": "Pet sit",
    "House Sitting": "House sit",
    "Home Watch": "Home watch",
    Other: "Other",
  };
  return map[c] || c;
}
