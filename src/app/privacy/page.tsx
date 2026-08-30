import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/content";
import { SITE_BRAND } from "@/lib/siteBrand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name} (website and mobile apps).`,
};

export default function PrivacyPage() {
  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <span className="kicker">Legal-ish, still friendly</span>
        <h1>Privacy Policy</h1>
        <p style={{ color: "var(--muted)" }}>
          Last updated: August 28, 2026 · Applies to the website{" "}
          <strong>{SITE_BRAND.domain}</strong> and the iPhone / Android apps
          that open it.
        </p>

        <div className="about-panel" style={{ marginTop: "1.25rem" }}>
          <h2>Who we are</h2>
          <p>
            {SITE.name} is an independent community project for residents and
            neighbors in The Villages, Florida. It is{" "}
            <strong>not</strong> affiliated with The Villages® operators or
            developers.
          </p>
          <p style={{ marginBottom: 0 }}>
            Contact:{" "}
            <a className="text-link" href="mailto:jonathan@thevillageseverythingapp.com">
              jonathan@thevillageseverythingapp.com
            </a>
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Account / membership info</strong> you choose to provide
              (name, email, village, password or login token) when you join or
              use member features such as My Space, yard sale, or golf club
              tools.
            </li>
            <li>
              <strong>Content you upload</strong> — photos, short videos, listing
              text, reviews, Best of the Month entries, Local Pros
              submissions, and similar community content.
            </li>
            <li>
              <strong>Messages and forms</strong> — for example real-estate lead
              forms, restaurant suggestions, or admin contact through the site.
            </li>
            <li>
              <strong>Technical basics</strong> — standard web logs (IP address,
              browser type, pages viewed) and optional analytics from our host
              (e.g. Vercel Analytics) to keep the site reliable.
            </li>
            <li>
              <strong>Payments</strong> — optional tips (“Buy me a cup of Joe”)
              are processed by <strong>Stripe</strong>. We do not store full card
              numbers on our servers; Stripe handles card data under their
              privacy policy.
            </li>
            <li>
              <strong>Device storage</strong> — some My Space notes (health
              reminders, pet notes, portfolio watchlist, etc.) may be stored on
              your device or in your member account depending on the feature.
            </li>
          </ul>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>How we use information</h2>
          <ul>
            <li>To run community features (directories, ratings, calendar, members).</li>
            <li>To moderate uploads (Best of the Month, Local Pros, yard sale).</li>
            <li>To respond to leads or support requests you send.</li>
            <li>To improve reliability, fix bugs, and understand which pages work.</li>
            <li>To process voluntary donations through Stripe.</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            We do <strong>not</strong> sell your personal information.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Cookies and sign-in</h2>
          <p>
            We use cookies or similar storage for sign-in sessions (admin,
            members), optional site-wide beta password, and basic preferences.
            The mobile apps use the same website and may keep session cookies
            inside the app for a smoother experience.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Photos and public content</h2>
          <p>
            Content you submit for public areas (for example Best of the Month or
            Local Pros) may be shown on the site after approval. Do not upload
            photos of other people without their permission. You can request
            removal by emailing us.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Third-party services</h2>
          <ul>
            <li>Hosting / deployment (e.g. Vercel)</li>
            <li>Optional durable storage (e.g. Redis / object storage)</li>
            <li>Stripe for donations</li>
            <li>YouTube embeds and external links you choose to open</li>
            <li>Map / real-estate / weather sources linked from the app</li>
          </ul>
          <p style={{ marginBottom: 0 }}>
            Those services have their own privacy policies when you leave our
            pages or complete a payment.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Children</h2>
          <p style={{ marginBottom: 0 }}>
            This product is aimed at adults in an active adult community. It is
            not directed at children under 13, and we do not knowingly collect
            their personal information.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Your choices</h2>
          <ul>
            <li>Use many areas of the site without creating an account.</li>
            <li>Request account or content deletion by emailing us.</li>
            <li>Turn off optional analytics in your browser where available.</li>
            <li>Uninstall the mobile app at any time.</li>
          </ul>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Changes</h2>
          <p style={{ marginBottom: 0 }}>
            We may update this page as features grow. The “Last updated” date at
            the top will change when we do. Continued use of the site or apps
            after an update means you accept the revised policy.
          </p>
        </div>

        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/" className="text-link">
            ← Back to home
          </Link>
          {" · "}
          <Link href="/about" className="text-link">
            About / reboot
          </Link>
        </p>
      </div>
    </div>
  );
}
