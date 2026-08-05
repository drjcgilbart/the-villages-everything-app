import { MemberLoginForm } from "@/components/MemberLoginForm";

export const metadata = { title: "Yard Sale Login" };

export default function YardSaleLoginPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">Members</span>
          <h1>Yard Sale login</h1>
          <p>Sign in to post or manage your Community Yard Sale listings.</p>
        </div>
      </div>
      <section className="section">
        <div className="shell" style={{ maxWidth: 480 }}>
          <MemberLoginForm />
        </div>
      </section>
    </>
  );
}
