import { MemberDashboard } from "@/components/MemberDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Yard Sale Listings" };

export default function YardSaleDashboardPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Member area</span>
          <h1>My Yard Sale listings</h1>
          <p>
            Create listings with up to 5 photos and one short video. New posts
            wait for admin approval before they appear publicly.
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
