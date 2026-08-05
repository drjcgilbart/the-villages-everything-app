import { MemberJoinForm } from "@/components/MemberJoinForm";

export const metadata = { title: "Join Yard Sale Members" };

export default function YardSaleJoinPage() {
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">For local Villagers</span>
          <h1>Become a Yard Sale member</h1>
          <p>
            Request membership to post items for sale or free. The site admin
            reviews each request before you can list.
          </p>
        </div>
      </div>
      <section className="section">
        <div className="shell" style={{ maxWidth: 560 }}>
          <MemberJoinForm />
        </div>
      </section>
    </>
  );
}
