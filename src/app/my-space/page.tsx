import Link from "next/link";
import { MySpaceDashboard } from "@/components/MySpaceDashboard";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Space",
  description:
    "Member daily dashboard — Villages weather, health, pets, investments, favorites, and yard-sale tools.",
};

export default function MySpacePage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Member · daily dashboard</span>
          <h1>My Space</h1>
          <p>
            Your private Villages command center — the full daily dashboard from
            My Retirement Reboot, built into the site:{" "}
            <strong>weather</strong> (hourly + 7-day), <strong>health</strong>{" "}
            (weight, meds, meals, movement, journal), <strong>pets</strong>{" "}
            (walks, meals, alarms), <strong>investments</strong>, calendar notes,
            and every star you set on the site. Unlock more by tier:{" "}
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
