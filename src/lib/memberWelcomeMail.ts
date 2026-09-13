import { sendOutboundEmail } from "./adminNotify";
import { SITE_BRAND } from "./siteBrand";

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

export function formatMemberWelcomeEmail(opts: {
  name: string;
  village?: string;
}) {
  const first = (opts.name || "neighbor").trim().split(/\s+/)[0] || "neighbor";
  const village = String(opts.village || "").trim();
  const base = siteBase();
  const subject = `Welcome to ${SITE_BRAND.name} — you're in`;
  const villageLine = village
    ? `You listed the Village of ${village}. Open The Villages page anytime to star it as yours, look up your CDD bond, and find the Architectural Review application.`
    : `When you have a minute, open The Villages page, find your neighborhood, star it as yours, and peek at CDD bond and ARC links on your village card.`;

  const text = [
    `Hi ${first},`,
    ``,
    `You're approved. Welcome to ${SITE_BRAND.name} — the neighbor-built everything app for ${SITE_BRAND.location}.`,
    ``,
    villageLine,
    ``,
    `What to try first:`,
    `• My Space — ${base}/my-space — private health log, gym, journal, photos`,
    `• Dining, golf, rec centers, pickleball, clubs, calendar`,
    `• Yard Sale — list something for the neighbors`,
    `• Search this website (next to the golf-ball logo) if you get lost`,
    ``,
    `Sign in: ${base}/yard-sale/login`,
    `Plans & support: ${base}/donate`,
    ``,
    `This is not official Villages operator mail. We're neighbors who built a useful (and slightly ridiculous) app. If something's off, reply to this note or use Support on the site.`,
    ``,
    `See you on the cart path,`,
    `Jonathan`,
    `${SITE_BRAND.name}`,
    base,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f1e7;font-family:Georgia,serif;color:#1c2430">
  <div style="max-width:560px;margin:0 auto;background:#fffdf8;border:1px solid #e6dcc8;border-radius:18px;padding:28px 26px">
    <p style="margin:0 0 8px;color:#1f6b4a;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px">You're in</p>
    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.25">Welcome, ${escapeHtml(first)}</h1>
    <p>Your membership is <strong>approved</strong>. ${escapeHtml(SITE_BRAND.name)} is the neighbor-built everything app for ${escapeHtml(SITE_BRAND.location)} — dining, golf, rec centers, your village, and a private My Space notebook.</p>
    <p>${escapeHtml(villageLine)}</p>
    <p><a href="${escapeHtml(base)}/my-space" style="display:inline-block;background:#1f6b4a;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700">Open My Space</a></p>
    <p style="margin:18px 0 8px"><strong>Handy doors</strong></p>
    <ul style="margin:0;padding-left:18px;line-height:1.6">
      <li><a href="${escapeHtml(base)}/yard-sale/login">Sign in</a></li>
      <li><a href="${escapeHtml(base)}/my-village">Find your village</a></li>
      <li><a href="${escapeHtml(base)}/dining">Dining</a> · <a href="${escapeHtml(base)}/golf-zone">Golf</a> · <a href="${escapeHtml(base)}/calendar">Calendar</a></li>
      <li><a href="${escapeHtml(base)}/donate">Plans &amp; support</a></li>
    </ul>
    <p style="margin:18px 0 0;font-size:14px;color:#5c6675">Not official Villages® operator mail — just neighbors. Reply if something's off.</p>
    <p style="margin:8px 0 0">See you on the cart path,<br/>Jonathan<br/>${escapeHtml(SITE_BRAND.name)}</p>
  </div>
</body></html>`;

  return { subject, text, html };
}

export async function sendMemberWelcomeEmail(member: {
  name?: string;
  email?: string;
  village?: string;
}) {
  const email = String(member.email || "").trim();
  if (!email) return { ok: false as const, error: "Member has no email" };
  const { subject, text, html } = formatMemberWelcomeEmail({
    name: member.name || "neighbor",
    village: member.village,
  });
  return sendOutboundEmail({ to: email, subject, text, html });
}
