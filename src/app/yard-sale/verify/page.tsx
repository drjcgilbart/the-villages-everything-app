import { Suspense } from "react";
import { MemberEmailVerify } from "@/components/MemberEmailVerify";

export const metadata = { title: "Confirm your email" };

export default function MemberEmailVerifyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Membership</span>
          <h1>Confirm your email</h1>
          <p>This confirms the inbox on the account. It is separate from the Holiday Lights warning.</p>
        </div>
      </div>
      <section className="section">
        <div className="shell" style={{ maxWidth: 480 }}>
          <Suspense fallback={<p className="panel-hint">Loading the confirmation…</p>}>
            <MemberEmailVerify />
          </Suspense>
        </div>
      </section>
    </>
  );
}
