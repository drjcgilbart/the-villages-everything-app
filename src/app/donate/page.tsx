import Link from "next/link";
import { DonateForm } from "@/components/DonateForm";
import { PageHeroMascot } from "@/components/PageHeroMascot";
import { MembershipPlans } from "@/components/MembershipPlans";
import { donationPaymentLink, stripeConfigured } from "@/lib/stripe";

export const metadata = {
  title: "Support",
  description:
    "Hub membership ($1–$3/month) unlocks My Space. Optional tips keep the lights on.",
};

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const params = await searchParams;
  const canceled = params.canceled === "1";
  const ready = stripeConfigured();
  const paymentLink = donationPaymentLink();

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Membership · optional tips</span>
            <h1>Support the Hub</h1>
            <p>
              Membership unlocks your private My Space lanai — weather, health,
              pets, and the rest of the personal boards. Tips below are extra
              thanks. They don’t replace a plan.
            </p>
          </div>
          <PageHeroMascot
            src="/graphics/mascot-logo.jpg"
            alt="Golf-ball mascot ready for a cup of Joe"
          />
        </div>
      </div>

      <section className="section">
        <div className="shell">
          {canceled && (
            <div className="msg msg-err" style={{ marginBottom: "1.25rem" }}>
              Checkout was canceled — no charge. Pick a plan whenever you’re
              ready.
            </div>
          )}

          <div className="section-head">
            <div>
              <span className="kicker">The main event</span>
              <h2>Membership levels</h2>
              <p>
                Porch Waver is free. Approved neighbors can try{" "}
                <strong>Square Royalty free for 30 days</strong> — then keep a
                paid plan or go back to waving from the porch. Paid plans are
                monthly: <strong>Cart Path Regular $1</strong> (2 member logins),{" "}
                <strong>Lanai Legend $2</strong> (3 member logins),{" "}
                <strong>Square Royalty $3</strong> (4 member logins). Porch Waver
                is 1 login. Each extra person gets their own password and their
                own My Space boards.
                Each tier keeps everything below it.
              </p>
            </div>
          </div>
          <MembershipPlans />
          <p className="mkt-disclaimer" style={{ marginTop: "1rem" }}>
            Public Hub pages (Dining, Calendar, Golf, Golf Cart Hero, and the
            rest of the main banner) stay free. Membership is sold on the
            website, not in the iPhone/Android store apps.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell donate-layout">
          <div className="about-panel donate-panel">
            <h2>Optional · buy me a cup of Joe</h2>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              Tips are one-time thanks — hosting, tools, and coffee. They do{" "}
              <strong>not</strong> unlock My Space boards. For that, use a
              membership plan above. Sign in first if you want a tip badge on
              your name.
            </p>

            {!ready && !paymentLink && (
              <div className="msg msg-err" style={{ marginBottom: "1rem" }}>
                Stripe isn&apos;t configured on this server yet. Add{" "}
                <code>STRIPE_SECRET_KEY</code> to <code>.env.local</code> (see
                README) to enable live checkout.
              </div>
            )}

            <DonateForm paymentLink={paymentLink} stripeReady={ready} />
          </div>

          <aside className="donate-aside">
            <div className="quote-box">
              “I didn&apos;t come here to be perfect. I came here to reboot —
              loudly, sunnily, and with better snacks.”
            </div>
            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Already a member?</h2>
              <p style={{ color: "var(--muted)" }}>
                Your boards live in My Space. Upgrade any time from this page
                or from the Tiers tab there.
              </p>
              <Link href="/my-space" className="btn btn-ghost btn-sm">
                Open My Space
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
