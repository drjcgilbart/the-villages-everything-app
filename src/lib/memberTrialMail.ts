import fs from "fs";
import path from "path";
import { sendOutboundEmail, type MailAttachment } from "./adminNotify";
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

function reminderPdfAttachment(): MailAttachment | null {
  const filePath = path.join(
    process.cwd(),
    "mail-assets",
    "Seven-Day-Trial-Reminder.pdf"
  );
  try {
    if (!fs.existsSync(filePath)) return null;
    return {
      filename: "A-Gentle-Seven-Day-Wave.pdf",
      contentBase64: fs.readFileSync(filePath).toString("base64"),
      contentType: "application/pdf",
    };
  } catch {
    return null;
  }
}

export function formatTrialReminderEmail(opts: {
  name: string;
  daysLeft: number;
}) {
  const first = (opts.name || "Neighbor").trim().split(/\s+/)[0] || "Neighbor";
  const base = siteBase();
  const days =
    opts.daysLeft <= 1
      ? "about one day"
      : `about ${opts.daysLeft} days`;
  const subject =
    "A Gentle Seven-Day Wave — your complimentary Square Royalty month is almost at the curb";

  const text = [
    `CART FIRST, QUESTIONS LATER`,
    `A Gentle Seven-Day Wave`,
    `Your complimentary Square Royalty month is almost at the curb`,
    ``,
    `Dear ${first},`,
    ``,
    `A few weeks ago the porch light came on and you stepped onto the private lanai as a Square Royalty guest — no card, no fuss, just a chance to see whether the boards felt like home.`,
    ``,
    `This note is a friendly wave from the driveway. Your complimentary month has ${days} left.`,
    ``,
    `When the trial ends, nothing dramatic happens. If you have not chosen a paid plan, your account simply becomes Porch Waver again — the free neighbor membership. The public Hub stays open. Your welcome stays intact.`,
    ``,
    `If the private lanai has earned a place in the daily routine, keeping a membership is a good option. Pick a yearly plan anytime on the Plans page:`,
    `${base}/donate`,
    ``,
    `A friendly reminder — still not a sales pitch`,
    `Purchasing a membership is optional. If you would rather remain a Porch Waver, that is completely fine. I will roll the account back automatically. Either way, you remain a neighbor.`,
    ``,
    `Watch for the cart. Wave anyway.`,
    ``,
    `Sincerely,`,
    `Jonathan Gilbart`,
    `Creator of The Villages Everything App`,
    `www.TheVillagesEverythingApp.com`,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4efe4;font-family:Georgia,'Times New Roman',serif;color:#1c2430">
  <div style="max-width:620px;margin:0 auto;background:#fffdf8;border:1px solid #e6dcc8;border-radius:18px;padding:28px 26px 32px">
    <p style="margin:0 0 6px;color:#1f6b4a;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:11px">Cart first, questions later</p>
    <h1 style="margin:0 0 6px;font-size:28px;line-height:1.2;color:#123d2d">A Gentle Seven-Day Wave</h1>
    <p style="margin:0 0 18px;color:#c45c3a;font-weight:700">Your complimentary Square Royalty month is almost at the curb</p>
    <p>Dear ${escapeHtml(first)},</p>
    <p>A few weeks ago the porch light came on and you stepped onto the private lanai as a Square Royalty guest — no card, no fuss, just a chance to see whether the boards felt like home.</p>
    <p>This note is a friendly wave from the driveway. Your complimentary month has <strong>${escapeHtml(days)}</strong> left.</p>
    <p>When the trial ends, nothing dramatic happens. If you have not chosen a paid plan, your account simply becomes Porch Waver again — the free neighbor membership. The public Hub stays open. Your welcome stays intact. Waving from the porch is still a perfectly honorable Villages lifestyle.</p>
    <p>If the private lanai has earned a place in the daily routine, keeping a membership is a good option. You can pick a yearly plan anytime on the <a href="${escapeHtml(base)}/donate">Plans page</a>.</p>
    <div style="margin:18px 0;padding:14px 16px;background:#eef6f0;border:1px solid #cfe0d4;border-radius:12px">
      <p style="margin:0 0 6px;font-weight:700;color:#123d2d">A friendly reminder — still not a sales pitch</p>
      <p style="margin:0">Purchasing a membership is optional. If you would rather remain a Porch Waver, that is completely fine. I will roll the account back automatically. Either way, you remain a neighbor.</p>
    </div>
    <p><strong>Watch for the cart. Wave anyway.</strong></p>
    <p>Sincerely,<br/>Jonathan Gilbart<br/>Creator of The Villages Everything App<br/><a href="${escapeHtml(base)}">www.TheVillagesEverythingApp.com</a></p>
    <p style="margin:18px 0 0;font-size:13px;color:#5c6675">A PDF copy of this note is attached. Sign in: <a href="${escapeHtml(base)}/yard-sale/login">${escapeHtml(base)}/yard-sale/login</a></p>
  </div>
</body></html>`;

  return { subject, text, html };
}

export async function sendTrialReminderEmail(member: {
  name?: string;
  email?: string;
}, daysLeft: number) {
  const email = String(member.email || "").trim();
  if (!email) return { ok: false as const, error: "Member has no email" };
  const { subject, text, html } = formatTrialReminderEmail({
    name: member.name || "Neighbor",
    daysLeft,
  });
  const pdf = reminderPdfAttachment();
  return sendOutboundEmail({
    to: email,
    subject,
    text,
    html,
    attachments: pdf ? [pdf] : undefined,
  });
}
