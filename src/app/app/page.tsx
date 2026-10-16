import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_BRAND } from "@/lib/siteBrand";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/the-villages-everything-app/id6806280544";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get the app",
  description: `Download ${SITE_BRAND.name} for iPhone and iPad.`,
  alternates: { canonical: "/app" },
};

function isAppleMobile(ua: string): boolean {
  // Skip the redirect inside our own native shell.
  if (/VillagesEverythingApp/i.test(ua)) return false;
  return /iPhone|iPad|iPod/i.test(ua);
}

export default async function GetTheAppPage() {
  const ua = (await headers()).get("user-agent") || "";
  if (isAppleMobile(ua)) redirect(APP_STORE_URL);

  return (
    <div className="section">
      <div className="shell" style={{ maxWidth: 640, textAlign: "center" }}>
        <img
          src="/graphics/mascot-logo.jpg"
          alt=""
          width={120}
          height={120}
          style={{ borderRadius: 24, margin: "0 auto 1rem", display: "block" }}
        />
        <span className="kicker">Get the app</span>
        <h1>{SITE_BRAND.name}</h1>
        <p style={{ color: "var(--muted)" }}>
          Villages, dining, golf, pickleball, clubs, the calendar, and your
          neighbors in one place. Built by a resident for life in The Villages,
          Florida.
        </p>
        <p style={{ margin: "1.5rem 0" }}>
          <a className="btn btn-primary" href={APP_STORE_URL}>
            Download on the App Store
          </a>
        </p>
        <p className="panel-hint">
          For iPhone and iPad. Or use it right here in your browser:{" "}
          <Link href="/">{SITE_BRAND.domain}</Link>
        </p>
      </div>
    </div>
  );
}
