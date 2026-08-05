import Link from "next/link";
import { MySpaceDashboard } from "@/components/MySpaceDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Space",
  description:
    "Private Hub Member dashboard — Villages weather, favorite clubs, investments, and shortcuts.",
};

export default function MySpacePage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Hub Member · private</span>
          <h1>My Space</h1>
          <p>
            Your personal corner of The Villages Hub — weather, clubs, health
            lanai, pet parade, and more. Unlock modules by tier:{" "}
            <strong>Porch Waver</strong> → <strong>Cart Path Regular</strong> →{" "}
            <strong>Lanai Legend</strong> → <strong>Square Royalty</strong>. Same
            account as Yard Sale membership.
          </p>
          <p style={{ marginBottom: 0 }}>
            <Link href="/club-zone" className="text-link">
              ← Clubs
            </Link>
            {" · "}
            <Link href="/yard-sale/login" className="text-link">
              Member sign-in
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
