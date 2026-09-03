/**
 * Site-owner Hub emails. Signing in as one of these members unlocks Admin
 * on the website and in the store apps — no separate /admin password step.
 *
 * Override with ADMIN_EMAIL or ADMIN_EMAILS (comma-separated) in env.
 */

const DEFAULT_OWNER_EMAILS = [
  "jonathan@thevillageseverythingapp.com",
  "dr.gilbart@comcast.net",
];

export function siteOwnerEmails(): string[] {
  const fromEnv = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([...fromEnv, ...DEFAULT_OWNER_EMAILS])];
}

export function isSiteOwnerEmail(email?: string | null): boolean {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e || !e.includes("@")) return false;
  return siteOwnerEmails().includes(e);
}
