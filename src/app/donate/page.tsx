import Image from "next/image";
import Link from "next/link";
import { DonateForm } from "@/components/DonateForm";
import { donationPaymentLink, stripeConfigured } from "@/lib/stripe";

export const metadata = {
  title: "Buy me a cup of Joe",
  description:
    "Tip The Villages Everything App — help keep the lights on with a cup of Joe.",
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
            <span className="kicker">Optional · always appreciated</span>
            <h1>Buy me a cup of Joe!</h1>
            <p>
              If the reboot made you smile, learn something, or waste a pleasant
              five minutes — you can toss a tip in the jar. It helps keep the
              lights on: hosting, tools, coffee, and golf-cart operating budget.
            </p>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/mascot-logo.jpg"
              alt="Golf-ball mascot ready for a cup of Joe"
              width={260}
              height={260}
              className="page-hero-img donate-hero-mascot"
              priority
            />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="shell donate-layout">
          <div className="about-panel donate-panel">
            <h2>Keep the lights on…</h2>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              This site is an independent personal project — not a corporate
              lifestyle brand. Tips are completely optional. Pick a preset or
              enter your own amount, then you&apos;ll finish securely on Stripe.
            </p>
            <p style={{ color: "var(--muted)" }}>
              Every tip tier has a funny badge — Cup of Joe, Fancy Latte,
              Early-Bird Brunch, Golden Loofah, and the ultra{" "}
              <strong>Custom Star Loofah</strong> (custom $25+ with extra
              sparkles). Golden Loofah and Custom Star Loofah also nominate you
              for <strong>Square Royalty</strong> (1 year) — the host approves
              that in the Admin Portal. Sign in first so badges stick to your
              name.
            </p>

            {canceled && (
              <div className="msg msg-err" style={{ marginBottom: "1rem" }}>
                Checkout was canceled — no charge. Whenever you&apos;re ready,
                the coffee is still hypothetical.
              </div>
            )}

            {!ready && !paymentLink && (
              <div className="msg msg-err" style={{ marginBottom: "1rem" }}>
                Stripe isn&apos;t configured on this server yet. Add{" "}
                <code>STRIPE_SECRET_KEY</code> to <code>.env.local</code> (see
                README) to enable live donations.
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
              <h2>What tips support</h2>
              <ul>
                <li>Site hosting &amp; bandwidth</li>
                <li>Creator tools &amp; coffee rations</li>
                <li>Keeping new posts, videos &amp; photos coming</li>
              </ul>
              <p
                style={{
                  marginBottom: 0,
                  color: "var(--muted)",
                  fontSize: "0.95rem",
                }}
              >
                Prefer to browse first? No pressure —{" "}
                <Link href="/" className="text-link">
                  back to the reboot →
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
