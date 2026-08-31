import Image from "next/image";
import Link from "next/link";
import { MySpaceDashboard } from "@/components/MySpaceDashboard";
import { PRODUCT_NAMES } from "@/lib/mySpaceProduct";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Space",
  description:
    "My Space — Your Private Lanai. Villages weather, health, pets, investments, and more, behind Hub membership.",
};

export default function MySpacePage() {
  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">{PRODUCT_NAMES.doorKicker}</span>
            <h1>{PRODUCT_NAMES.doorTitle}</h1>
            <p>
              {PRODUCT_NAMES.doorBlurb} Unlock more by tier:{" "}
              <strong>Porch Waver</strong> (1 login) →{" "}
              <strong>Cart Path Regular</strong> (2 logins) →{" "}
              <strong>Lanai Legend</strong> (3 logins) →{" "}
              <strong>Square Royalty</strong> (4 logins). Extra household
              members get their own password and boards. If you used the old
              standalone dashboard, this is the new home for those boards —
              subscribe on this website, then sign in.
            </p>
            <p style={{ marginBottom: 0 }}>
              <Link href="/yard-sale/login?next=/my-space" className="text-link">
                Member sign-in
              </Link>
              {" · "}
              <Link href="/yard-sale/dashboard" className="text-link">
                Yard sale dashboard
              </Link>
              {" · "}
              <Link href="/club-zone" className="text-link">
                Clubs
              </Link>
            </p>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/mascot-myspace.jpg"
              alt="My Space mascot — golf ball with a house key and a tiny screened lanai"
              width={280}
              height={280}
              className="about-mascot about-mascot-round"
              priority
            />
          </div>
        </div>
      </div>
      <section className="section">
        <div className="shell">
          <MySpaceDashboard />
        </div>
      </section>
    </>
  );
}
