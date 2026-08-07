import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BetaGateForm } from "@/components/BetaGateForm";
import { isSiteGateEnabledAsync } from "@/lib/siteGate";

export const metadata: Metadata = {
  title: "Beta access",
  robots: { index: false, follow: false },
};

export default async function BetaGatePage() {
  // If gate is off, no reason to land here
  if (!(await isSiteGateEnabledAsync())) {
    redirect("/");
  }

  return (
    <>
      <div className="page-hero beta-gate-hero">
        <div className="shell">
          <span className="kicker">Private beta</span>
          <h1>Password, please</h1>
          <p>
            The Villages Everything App is in private beta. Enter the password you were
            given to explore the site.
          </p>
        </div>
      </div>
      <section className="section">
        <div className="shell beta-gate-shell">
          <div className="about-panel beta-gate-panel">
            <h2 style={{ marginTop: 0 }}>Unlock this browser</h2>
            <p className="ts-detail-muted" style={{ marginTop: 0 }}>
              One shared beta password for testers. It stays in a secure cookie
              on this device (about 30 days) so you don&apos;t re-enter every
              visit.
            </p>
            <Suspense fallback={<p>Loading…</p>}>
              <BetaGateForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
