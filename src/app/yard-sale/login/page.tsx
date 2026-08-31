import { Suspense } from "react";
import { MemberLoginForm } from "@/components/MemberLoginForm";

export const metadata = { title: "Member sign-in" };

export default function YardSaleLoginPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">One Hub login</span>
          <h1>Member sign-in</h1>
          <p>
            The same account works on PC, iPhone, and Android — My Space boards,
            yard sale tools, and membership travel with you.
          </p>
        </div>
      </div>
      <section className="section">
        <div className="shell" style={{ maxWidth: 480 }}>
          <Suspense fallback={<p className="panel-hint">Loading sign-in…</p>}>
            <MemberLoginForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
