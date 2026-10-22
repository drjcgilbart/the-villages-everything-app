import { BestOfMonthClub } from "@/components/BestOfMonthClub";
import { PageHeroMascot } from "@/components/PageHeroMascot";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Best of the Month Club",
  description:
    "Pet, car, golf cart, villager, landscaping, house, and Best of the Rest — submit photos, vote once per category, and keep each champ up until a new nominee arrives.",
};

export default function BestOfTheMonthPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Neighbor picks · monthly crown</span>
            <h1>Best of the Month Club</h1>
            <p>
              Submit a JPG or PDF of your pet, car, golf cart, favorite
              villager, landscaping, house, or anything for Best of the Rest.
              After admin approval, neighbors vote — one pick per category each
              month. Totals update live. When the month ends we crown a winner
              and two honorable mentions. That champ stays here until a new
              neighbor is nominated in the same category.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#winners" className="btn btn-primary">
                Current champs
              </a>
              <a href="#vote" className="btn btn-ghost">
                Vote this month
              </a>
              <a href="#submit" className="btn btn-ghost">
                Enter a photo
              </a>
            </div>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-best-of.jpg"
            alt="Best of the Month mascot — golf ball with a trophy and a blue ribbon"
          />
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <BestOfMonthClub />
        </div>
      </section>
    </>
  );
}
