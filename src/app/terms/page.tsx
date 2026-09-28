import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for The Villages Everything App subscriptions.",
};

const APPLE_EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function TermsPage() {
  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <span className="kicker">Legal</span>
        <h1>Terms of Use (EULA)</h1>
        <p style={{ color: "var(--muted)" }}>
          Cart Path Regular, Lanai Legend, and Square Royalty are 1-year
          auto-renewing subscriptions sold in the iPhone and iPad app.
        </p>
        <div className="about-panel" style={{ marginTop: "1.25rem" }}>
          <p>
            Those subscriptions are licensed under Apple’s standard Licensed
            Application End User License Agreement.
          </p>
          <p>
            <a href={APPLE_EULA}>Read the Terms of Use (EULA)</a>
          </p>
          <p>
            Payment is charged to the Apple ID. A plan renews for another year
            unless auto-renew is turned off at least 24 hours before the
            current year ends. Manage or cancel in Settings, then the Apple ID,
            then Subscriptions.
          </p>
          <p>
            <Link href="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
