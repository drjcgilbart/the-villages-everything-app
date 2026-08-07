import Link from "next/link";
import { MySpaceDashboard } from "@/components/MySpaceDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Space",
  description:
    "Member dashboard — saved favorites, weather, clubs, investments, yard-sale tools, and personal modules.",
};

export default function MySpacePage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Member · private &amp; saved</span>
          <h1>My Space</h1>
          <p>
            Home for anything that&apos;s <strong>yours</strong> — every star you
            set on The Villages, Town Squares, Rec Centers, Dining, and Clubs is
            copied into <strong>My favorites</strong> below. Plus membership
            modules:
            weather, health lanai, pet parade, investments, and yard-sale
            posting. Unlock more by tier:{" "}
            <strong>Porch Waver</strong> → <strong>Cart Path Regular</strong> →{" "}
            <strong>Lanai Legend</strong> → <strong>Square Royalty</strong>.
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/yard-sale/login" className="text-link">
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
      </div>
      <section className="section">
        <div className="shell">
          <MySpaceDashboard />
        </div>
      </section>
    </>
  );
}
