import Image from "next/image";
import Link from "next/link";
import { COMMUNITY_RESOURCES } from "@/lib/topics";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Community Resources",
  description:
    "Town squares, rec centers, real estate, yard sale, and more community tools for The Villages, Florida.",
};

export default function CommunityResourcesPage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">The “everything else” drawer, labeled</span>
            <h1>Community Resources</h1>
            <p>
              Town squares with free bands, rec centers with pickleball
              diplomacy, real estate without the brochure voice, yard-sale
              treasure hunts, and the monthly highlight reel. Looking for{" "}
              <strong>Meet Your Neighbors</strong>? That&apos;s unique to each
              village — open <a href="/my-village">My Village</a>, pick yours,
              and say hello there.
            </p>
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

      <section className="section">
        <div className="shell">
          <div className="hub-group-grid">
            {COMMUNITY_RESOURCES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hub-group-card about-panel community-resource-card"
              >
                <div className="community-resource-card-top">
                  <Image
                    src={item.image}
                    alt=""
                    width={88}
                    height={88}
                    className="community-resource-thumb"
                  />
                  <div>
                    <h3 style={{ margin: 0 }}>{item.label}</h3>
                    <p style={{ margin: "0.35rem 0 0", color: "var(--muted)" }}>
                      {item.blurb}
                    </p>
                  </div>
                </div>
                <span className="text-link">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
