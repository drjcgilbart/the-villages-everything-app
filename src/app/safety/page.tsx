import type { Metadata } from "next";
import Link from "next/link";
import { SITE_BRAND } from "@/lib/siteBrand";

export const metadata: Metadata = {
  title: "Safety",
  description: `Report, block, and delete-account tools for ${SITE_BRAND.name}.`,
};

export default function SafetyPage() {
  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: 720 }}>
        <span className="kicker">House rules</span>
        <h1>Safety</h1>
        <p style={{ color: "var(--muted)" }}>
          {SITE_BRAND.name} is a neighbor community. Public directories work
          without an account. If you join, you can delete that account in the
          app, report posts, and block people you don’t want to see.
        </p>

        <div className="about-panel" style={{ marginTop: "1.25rem" }}>
          <h2>Report content</h2>
          <p>
            On a forum post, yard-sale listing, or dining review, tap{" "}
            <strong>Report</strong>, pick a reason, and send it. Reports go to
            the site host. We hide or remove content that breaks the house
            rules, usually within 24 hours.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Block a neighbor</h2>
          <p>
            Sign in, then tap <strong>Block</strong> on their post or listing.
            While you’re signed in, their posts stay hidden. You can unblock
            from the same control.
          </p>
        </div>

        <div className="about-panel" style={{ marginTop: "1rem" }}>
          <h2>Delete your account</h2>
          <ol>
            <li>
              Sign in and open <Link href="/my-space">My Space</Link>.
            </li>
            <li>Open the <strong>Membership tiers</strong> tab.</li>
            <li>
              Scroll to <strong>Delete my account</strong>, type DELETE, and
              confirm.
            </li>
          </ol>
          <p style={{ marginBottom: 0 }}>
            That removes your membership, private boards, and sign-in. Public
            posts stay as “Deleted neighbor.” Yard-sale listings come down.
          </p>
        </div>

        <p className="panel-hint">
          Questions:{" "}
          <a className="text-link" href="mailto:jonathan@thevillageseverythingapp.com">
            jonathan@thevillageseverythingapp.com
          </a>
        </p>
      </div>
    </div>
  );
}
