import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — The Villages Golf Cart Hero",
  description:
    "Privacy policy for The Villages Golf Cart Hero website and mobile apps.",
};

export default function GolfCartHeroPrivacyPage() {
  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <span className="kicker">The Villages Golf Cart Hero</span>
        <h1>Privacy Policy</h1>
        <p style={{ color: "var(--muted)" }}>
          Last updated: August 13, 2026. Applies to the website and the Android /
          iPhone apps that open it.
        </p>

        <div className="about-panel" style={{ marginTop: "1.25rem" }}>
          <h2>Who we are</h2>
          <p>
            The Villages Golf Cart Hero is a fan-made whimsical golf-cart racing
            game and a sister project of The Villages Everything App. It is{" "}
            <strong>not</strong> affiliated with The Villages® operators or brand
            owners.
          </p>
          <p style={{ marginBottom: 0 }}>
            Contact:{" "}
            <a
              className="text-link"
              href="mailto:jonathan@thevillageseverythingapp.com"
            >
              jonathan@thevillageseverythingapp.com
            </a>
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>On-device game data</strong> stored in your browser or app
              (player name, cart/driver choices, local Lanai Legends scores,
              music mute). This stays on your device.
            </li>
            <li>
              <strong>Technical basics</strong> — standard web logs (IP address,
              browser type) from our host so the game can stay online.
            </li>
            <li>
              <strong>Optional tips (website only)</strong> — $1 / $3 / $5 tips
              use Stripe checkout on the website. We do not store full card
              numbers. The Google Play app does not take payments.
            </li>
          </ul>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>What we do not do</h2>
          <ul>
            <li>No required account or login to race.</li>
            <li>No sale of personal information.</li>
            <li>No advertising trackers or third-party ads in the game.</li>
            <li>No precise location, camera, microphone, or contacts access.</li>
          </ul>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Children</h2>
          <p>
            The game is a casual cartoon racer intended for a general audience,
            including adults in The Villages. It is not directed at children
            under 13, and we do not knowingly collect personal information from
            children.
          </p>
        </div>

        <p style={{ marginTop: "1.25rem" }}>
          <Link href="/golf-cart-hero" className="text-link">
            Play Golf Cart Hero
          </Link>
          {" · "}
          <Link href="/privacy" className="text-link">
            Everything App privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
