import Link from "next/link";
import { LightTour } from "@/components/LightTour";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Build a Holiday Lights tour",
  robots: { index: false, follow: false },
};

/**
 * Admin Center entry to the Holiday Lights tour. It wraps the same member flow
 * as /tour (same terms, same route builder, same tour log), so a tour made here
 * is saved the same way. isAdmin is passed through for admin-only powers later.
 */
export default async function AdminBuildTourPage() {
  const admin = await isAdminAuthenticated();
  const member = admin ? await getSessionMember() : null;
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Site owner</span>
          <h1>Build a Holiday Lights tour</h1>
          <p>
            The same tour members build. Accept the warning with your member account, pick a holiday and a start, then
            drive it.
          </p>
        </div>
      </div>
      {admin ? (
        <LightTour memberStatus={member?.status ?? null} isAdmin />
      ) : (
        <section className="section">
          <div className="shell">
            <div className="about-panel lt-card">
              <h2>Sign in to build a tour here</h2>
              <p>This page is the Admin Center copy of the tour. Members build the same tour on the public tour page.</p>
              <Link href="/admin" className="btn btn-primary lt-go">
                Open admin sign-in
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
