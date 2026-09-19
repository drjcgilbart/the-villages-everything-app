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

function welcomePdfAttachment(): MailAttachment | null {
  const filePath = path.join(process.cwd(), "mail-assets", "welcome-letter.pdf");
  try {
    if (!fs.existsSync(filePath)) return null;
    return {
      filename: "Welcome-to-The-Villages-Everything-App.pdf",
      contentBase64: fs.readFileSync(filePath).toString("base64"),
      contentType: "application/pdf",
    };
  } catch {
    return null;
  }
}

export function formatMemberWelcomeEmail(opts: {
  name: string;
  village?: string;
}) {
  const first = (opts.name || "Neighbor").trim().split(/\s+/)[0] || "Neighbor";
  const village = String(opts.village || "").trim();
  const base = siteBase();
  const subject = "Welcome to the Neighborhood — your membership is approved";
  const villageBit = village
    ? ` You listed the Village of ${village} — open The Villages page anytime to star it as yours.`
    : "";

  const text = [
    `CART FIRST, QUESTIONS LATER`,
    `Welcome to the Neighborhood`,
    `Your membership request has been approved`,
    ``,
    `Dear ${first},`,
    ``,
    `Thank you for requesting membership at The Villages Everything App. I am delighted to welcome you — truly. You asked to join, I approved your request, and now the porch light is on for you.${villageBit}`,
    ``,
    `This is the moderately ridiculous everything app for The Villages, Florida — a neighbor-built hub where you can find your village, rate a restaurant, chase live music, and still laugh about the plot twist of starting over here. Whimsical on purpose. Useful on accident. (Mostly on purpose.)`,
    ``,
    `The public Hub stays free for everyone — Town Squares, Rec Centers, Dining, Calendar, Golf, Pickleball, Clubs, Forums, Yard Sale, Best of the Month, and our sister game, Golf Cart Hero. Phone browser works today; store apps are rolling out. Pull up a chair anytime.`,
    ``,
    `A friendly nudge — not a sales pitch`,
    `Membership is optional. If you are happy waving from the porch, that is a perfectly honorable Villages lifestyle. If you would like a more personal lanai — your own weather, boards, household logins, and private tools — I hope you will take a gentle look at the plans below.`,
    `Your Square Royalty free month is already running — no card required. Poke around, see if the private boards feel like home, then keep a paid plan or go back to Porch Waver. Either way, you remain welcome.`,
    ``,
    `What membership unlocks`,
    `Public Hub pages stay free. Membership simply unlocks your private My Space lanai. Each paid tier keeps everything below it, and extra household seats get their own login, password, and boards.`,
    ``,
    `Porch Waver — $0 / year — Free neighbor account, 1 login. Preview the Reboot boards. My Space door, favorites, shortcuts, and yard-sale posting when approved.`,
    `Cart Path Regular — $3 / year — 2 member logins, each with their own password and boards. Daily dashboard energy — full weather, investments, news prefs, and entertainment picks.`,
    `Lanai Legend — $5 / year — 3 member logins. The private Reboot: health, pets, kitchen, gym, maintenance, personal calendar, private photos, golf and pickleball.`,
    `Square Royalty — $10 / year — 4 member logins. Everything on the lanai, plus the royalty lounge, badge flair, and early access to new My Space boards.`,
    ``,
    `A few easy first steps`,
    `1. Sign in and open My Space — that is your private lanai. ${base}/my-space`,
    `2. Add the site to your phone’s Home Screen so it feels like an app (Safari Share on iPhone; Chrome menu on Android).`,
    `3. Wander the Hub — rate a restaurant, peek at tonight’s square, or take Golf Cart Hero for a lap.`,
    `4. Your 30-day Square Royalty free month is already on. Open My Space and try every private board. After that you can keep a paid plan or go back to Porch Waver. ${base}/my-space`,
    ``,
    `I built this place because I came here to reboot — loudly, sunnily, and with better snacks. The hub is just the map. You bringing your own story to it is what makes it a neighborhood.`,
    ``,
    `Welcome home. Watch for the cart. Wave anyway.`,
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
    <h1 style="margin:0 0 6px;font-size:28px;line-height:1.2;color:#123d2d">Welcome to the Neighborhood</h1>
    <p style="margin:0 0 18px;color:#1f6b4a;font-weight:700">Your membership request has been approved</p>
    <p>Dear ${escapeHtml(first)},</p>
    <p>Thank you for requesting membership at The Villages Everything App. I am delighted to welcome you — truly. You asked to join, I approved your request, and now the porch light is on for you.${village ? ` You listed the Village of <strong>${escapeHtml(village)}</strong>.` : ""}</p>
    <p>This is the moderately ridiculous everything app for The Villages, Florida — a neighbor-built hub where you can find your village, rate a restaurant, chase live music, and still laugh about the plot twist of starting over here. Whimsical on purpose. Useful on accident. (Mostly on purpose.)</p>
    <p>The public Hub stays free for everyone — Town Squares, Rec Centers, Dining, Calendar, Golf, Pickleball, Clubs, Forums, Yard Sale, Best of the Month, and our sister game, Golf Cart Hero. Phone browser works today; store apps are rolling out. Pull up a chair anytime.</p>
    <h2 style="margin:22px 0 8px;font-size:18px;color:#123d2d">A friendly nudge — not a sales pitch</h2>
    <p>Membership is optional. If you are happy waving from the porch, that is a perfectly honorable Villages lifestyle. If you would like a more personal lanai — your own weather, boards, household logins, and private tools — I hope you will take a gentle look at the plans below.</p>
    <p>Your Square Royalty free month is already running — no card required. Poke around, see if the private boards feel like home, then keep a paid plan or go back to Porch Waver. Either way, you remain welcome.</p>
    <h2 style="margin:22px 0 8px;font-size:18px;color:#123d2d">What membership unlocks</h2>
    <p>Public Hub pages stay free. Membership simply unlocks your private My Space lanai. Each paid tier keeps everything below it, and extra household seats get their own login, password, and boards.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0 18px">
      <tr style="background:#eef6f0"><td style="padding:8px;border:1px solid #e6dcc8"><strong>Porch Waver</strong> · $0 / year</td><td style="padding:8px;border:1px solid #e6dcc8">1 login. Preview the Reboot boards. My Space door, favorites, shortcuts, and yard-sale posting.</td></tr>
      <tr><td style="padding:8px;border:1px solid #e6dcc8"><strong>Cart Path Regular</strong> · $3 / year</td><td style="padding:8px;border:1px solid #e6dcc8">2 member logins. Full weather, investments, news prefs, and entertainment picks.</td></tr>
      <tr style="background:#eef6f0"><td style="padding:8px;border:1px solid #e6dcc8"><strong>Lanai Legend</strong> · $5 / year</td><td style="padding:8px;border:1px solid #e6dcc8">3 member logins. Health, pets, kitchen, gym, maintenance, personal calendar, private photos, golf and pickleball.</td></tr>
      <tr><td style="padding:8px;border:1px solid #e6dcc8"><strong>Square Royalty</strong> · $10 / year</td><td style="padding:8px;border:1px solid #e6dcc8">4 member logins. Everything on the lanai, plus royalty lounge, badge flair, and early access.</td></tr>
    </table>
    <h2 style="margin:22px 0 8px;font-size:18px;color:#123d2d">A few easy first steps</h2>
    <ol style="margin:0 0 16px;padding-left:20px;line-height:1.55">
      <li>Sign in and open <a href="${escapeHtml(base)}/my-space">My Space</a> — that is your private lanai.</li>
      <li>Add the site to your phone’s Home Screen so it feels like an app (Safari Share on iPhone; Chrome menu on Android).</li>
      <li>Wander the Hub — rate a restaurant, peek at tonight’s square, or take Golf Cart Hero for a lap.</li>
      <li>Your 30-day Square Royalty free month is already on. Open <a href="${escapeHtml(base)}/my-space">My Space</a> and try every private board. After that you can keep a paid plan or go back to Porch Waver.</li>
    </ol>
    <p>I built this place because I came here to reboot — loudly, sunnily, and with better snacks. The hub is just the map. You bringing your own story to it is what makes it a neighborhood.</p>
    <p><strong>Welcome home. Watch for the cart. Wave anyway.</strong></p>
    <p>Sincerely,<br/>Jonathan Gilbart<br/>Creator of The Villages Everything App<br/><a href="${escapeHtml(base)}">www.TheVillagesEverythingApp.com</a></p>
    <p style="margin:18px 0 0;font-size:13px;color:#5c6675">A PDF copy of this welcome letter is attached. Sign in: <a href="${escapeHtml(base)}/yard-sale/login">${escapeHtml(base)}/yard-sale/login</a></p>
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
    name: member.name || "Neighbor",
    village: member.village,
  });
  const pdf = welcomePdfAttachment();
  return sendOutboundEmail({
    to: email,
    subject,
    text,
    html,
    attachments: pdf ? [pdf] : undefined,
  });
}
