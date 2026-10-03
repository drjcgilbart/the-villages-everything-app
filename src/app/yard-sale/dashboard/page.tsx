import { MemberDashboard } from "@/components/MemberDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Marketplace listings" };

export default function YardSaleDashboardPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Member area</span>
          <h1>My Marketplace listings</h1>
          <p>
            Create listings with up to 3 photos and one short video (big files shrink automatically). New posts
            wait for admin approval before they appear publicly. After a listing is
            live, you can edit it, refresh it, archive it, or remove it.
          </p>
        </div>
      </div>
      <section className="section">
        <div className="shell">
          <MemberDashboard />
        </div>
      </section>
    </>
  );
}
