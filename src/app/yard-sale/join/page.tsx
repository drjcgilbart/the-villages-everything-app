import { MemberJoinForm } from "@/components/MemberJoinForm";

export const metadata = { title: "Join Yard Sale Members" };

export default async function YardSaleJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ household?: string }>;
}) {
  const params = await searchParams;
  const householdToken = String(params.household || "").trim();
  return (
    <>
      <div className="page-hero">
        <div className="shell">
          <span className="kicker">
            {householdToken ? "Household invite" : "For local Villagers"}
          </span>
          <h1>
            {householdToken
              ? "Join this household"
              : "Become a Yard Sale member"}
          </h1>
          <p>
            {householdToken
              ? "Create your own login. Your My Space boards stay on your account — they are not shared with the paying neighbor."
              : "Request membership to post items for sale or free. The site admin reviews each request before you can list."}
          </p>
        </div>
      </div>
      <section className="section">
        <div className="shell" style={{ maxWidth: 560 }}>
          <MemberJoinForm householdToken={householdToken} />
        </div>
      </section>
    </>
  );
}
