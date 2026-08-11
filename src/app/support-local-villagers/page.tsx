import Image from "next/image";
import Link from "next/link";
import { LocalServicesHub } from "@/components/LocalServicesHub";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Support Local Villagers",
  description:
    "Neighbor-run services in The Villages — handyman, landscaping, lessons, pets, tech, and more. Submit your listing for admin approval.",
};

export default function SupportLocalVillagersPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Neighbors · not a corporate directory</span>
            <h1>Support Local Villagers</h1>
            <p>
              Hire a neighbor when you can. This page highlights Villagers who
              offer services — handyman work, landscaping, lessons, pets, tech
              help, and more. Listings are submitted by residents and only go
              live after admin approval.
            </p>
            <div className="hero-actions" style={{ marginTop: "1rem" }}>
              <a href="#directory" className="btn btn-primary">
                Browse listings
              </a>
              <a href="#local-service-form" className="btn btn-ghost">
                List your service
              </a>
              <Link href="/local-pros" className="btn btn-ghost">
                Local Pros (area businesses)
              </Link>
              <Link href="/real-estate" className="btn btn-ghost">
                Real Estate
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

      <section className="section" id="directory">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Local service directory</h2>
              <p>
                Contact providers directly. This is an independent neighbor
                directory — not affiliated with The Villages® operators. Hire
                at your own discretion.
              </p>
            </div>
          </div>
          <LocalServicesHub />
        </div>
      </section>
    </>
  );
}
