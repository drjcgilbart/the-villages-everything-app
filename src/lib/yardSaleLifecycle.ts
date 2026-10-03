import { sendOutboundEmail } from "./adminNotify";
import { SITE_BRAND } from "./siteBrand";
import {
  getMemberById,
  hydrateYardSale,
  loadYardSale,
  saveYardSaleAsync,
} from "./yardSale";
import {
  LISTING_MAX_REFRESHES,
  LISTING_REMOVE_AFTER_MS,
  listingActivityAt,
  listingLifecycleDecision,
  type YardListing,
} from "./yardSaleTypes";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function siteBase() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || SITE_BRAND.url
  );
}

function listingNotifyEmail(listing: YardListing) {
  const member = listing.memberId ? getMemberById(listing.memberId) : null;
  const email = (member?.email || listing.sellerEmail || "").trim();
  return email.includes("@") ? email : "";
}

function daysUntilRemoval(listing: YardListing, nowMs: number) {
  const start = Date.parse(listingActivityAt(listing));
  if (!Number.isFinite(start)) return 1;
  const left = LISTING_REMOVE_AFTER_MS - (nowMs - start);
  return Math.max(1, Math.ceil(left / (24 * 60 * 60 * 1000)));
}

function reminderCopy(listing: YardListing, nowMs: number) {
  const base = siteBase();
  const title = listing.title || "your listing";
  const used = listing.refreshCount || 0;
  const daysLeft = daysUntilRemoval(listing, nowMs);
  const listingUrl = `${base}/yard-sale/${listing.id}`;
  const dashUrl = `${base}/yard-sale/dashboard`;
  const refreshLeft = Math.max(0, LISTING_MAX_REFRESHES - used);
  const refreshLine =
    refreshLeft > 0
      ? `Refresh Listing — keep it on the Marketplace and move it to the top. You can do this ${refreshLeft} more time${refreshLeft === 1 ? "" : "s"}.`
      : "Refresh Listing is closed. This listing has already been refreshed 3 times, so it comes down 14 days after that last refresh unless you archive or remove it sooner.";
  const subject = `Your Marketplace listing needs a choice: ${title}`.slice(0, 180);
  const text = [
    `Your Marketplace listing "${title}" has been up for more than 7 days.`,
    ``,
    `Sign in and choose one:`,
    refreshLine,
    `Archive Listing — take it off the public Marketplace and keep it in your listings.`,
    `Remove Listing — take it down.`,
    ``,
    `If you don't choose, it is removed automatically in about ${daysLeft} day${daysLeft === 1 ? "" : "s"} (14 days after it was posted or last refreshed).`,
    ``,
    `Open the listing: ${listingUrl}`,
    `Your listings: ${dashUrl}`,
  ].join("\n");
  const html = `
    <p>Your Marketplace listing <strong>${escapeHtml(title)}</strong> has been up for more than 7 days.</p>
    <p>Sign in and choose one:</p>
    <ul>
      <li>${escapeHtml(refreshLine)}</li>
      <li>Archive Listing — take it off the public Marketplace and keep it in your listings.</li>
      <li>Remove Listing — take it down.</li>
    </ul>
    <p>If you don't choose, it is removed automatically in about ${daysLeft} day${daysLeft === 1 ? "" : "s"} (14 days after it was posted or last refreshed).</p>
    <p><a href="${escapeHtml(listingUrl)}">Open the listing</a><br/>
    <a href="${escapeHtml(dashUrl)}">Your listings</a></p>
  `;
  return { subject, text, html };
}

function removedCopy(listing: YardListing) {
  const title = listing.title || "your listing";
  const dashUrl = `${siteBase()}/yard-sale/dashboard`;
  const subject = `Your Marketplace listing was removed: ${title}`.slice(0, 180);
  const text = [
    `Your Marketplace listing "${title}" was removed automatically.`,
    `It had been up for 14 days since it was posted or last refreshed, and Refresh, Archive, or Remove was not chosen.`,
    ``,
    `Your listings: ${dashUrl}`,
  ].join("\n");
  const html = `
    <p>Your Marketplace listing <strong>${escapeHtml(title)}</strong> was removed automatically.</p>
    <p>It had been up for 14 days since it was posted or last refreshed, and Refresh, Archive, or Remove was not chosen.</p>
    <p><a href="${escapeHtml(dashUrl)}">Your listings</a></p>
  `;
  return { subject, text, html };
}

/**
 * Daily pass: one reminder after 7 days on the current run, then remove at 14 days.
 * Archived listings are left alone. A refresh starts a new 14-day run.
 */
export async function sweepMarketplaceListings(opts: { sendMail: boolean }) {
  await hydrateYardSale();
  const data = loadYardSale();
  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();
  let reminded = 0;
  let removed = 0;
  let changed = false;

  for (const listing of data.listings) {
    const decision = listingLifecycleDecision(listing, nowMs);
    if (decision === "none") continue;

    if (decision === "remind") {
      const activity = listingActivityAt(listing);
      const to = listingNotifyEmail(listing);
      if (!to) {
        listing.reminderSentFor = activity;
        listing.updatedAt = nowIso;
        changed = true;
        continue;
      }
      if (!opts.sendMail) continue;
      const copy = reminderCopy(listing, nowMs);
      const sent = await sendOutboundEmail({ to, ...copy });
      if (!sent.ok) continue;
      listing.reminderSentFor = activity;
      listing.updatedAt = nowIso;
      reminded += 1;
      changed = true;
      continue;
    }

    listing.status = "removed";
    listing.updatedAt = nowIso;
    const note = "Removed automatically after 14 days on the Marketplace.";
    listing.adminNote = [listing.adminNote, note].filter(Boolean).join(" ").slice(0, 500);
    removed += 1;
    changed = true;
    if (opts.sendMail) {
      const to = listingNotifyEmail(listing);
      if (to) {
        const copy = removedCopy(listing);
        await sendOutboundEmail({ to, ...copy });
      }
    }
  }

  if (changed) await saveYardSaleAsync(data);
  return { reminded, removed, checked: data.listings.length };
}
