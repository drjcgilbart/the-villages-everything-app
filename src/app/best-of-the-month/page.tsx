import Image from "next/image";
import { BestOfMonthClub } from "@/components/BestOfMonthClub";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Best of the Month Club",
  description:
    "Pet, car, golf cart, villager, landscaping, house, and Best of the Rest — submit photos, vote once per category, and celebrate last month’s winners.",
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
              month. Totals update live; when the month ends we crown a winner
              and two honorable mentions, then feature them here all next month.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#winners" className="btn btn-primary">
                Last month’s winners
              </a>
              <a href="#vote" className="btn btn-ghost">
                Vote this month
              </a>
              <a href="#submit" className="btn btn-ghost">
                Enter a photo
              </a>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-best-of-month.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
              priority
            />
          </div>
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
