/**
 * Email the site host as soon as a visitor submits something for approval.
 * Uses Resend or SendGrid HTTP APIs (no extra npm package).
 *
 * Env:
 *   ADMIN_NOTIFY_EMAIL  (default admin@thevillageseverythingapp.com)
 *   ADMIN_NOTIFY_FROM   (optional From header)
 *   RESEND_API_KEY      (preferred)
 *   SENDGRID_API_KEY    (fallback)
 */

export type AdminNotifyPayload = {
  topic: string;
  title: string;
  submittedBy?: string;
  createdAt?: string;
  details?: Record<string, string | number | boolean | null | undefined>;
};

const SENSITIVE = /password|secret|token|hash|cookie/i;

export function adminNotifyEmail() {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    "admin@thevillageseverythingapp.com"
  );
}

export function adminMailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() || process.env.SENDGRID_API_KEY?.trim()
  );
}

function siteBase() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.thevillageseverythingapp.com"
  );
}

function fromAddress() {
  return (
    process.env.ADMIN_NOTIFY_FROM?.trim() ||
    "The Villages Everything App <beth.t@example.com>"
  );
}

function cleanDetails(
  details: AdminNotifyPayload["details"]
): { label: string; value: string }[] {
  if (!details) return [];
  const rows: { label: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(details)) {
    if (SENSITIVE.test(key)) continue;
    if (raw == null) continue;
    const value = String(raw).trim();
    if (!value) continue;
    rows.push({
      label: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
      value: value.slice(0, 2000),
    });
  }
  return rows;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatAdminNotifyEmail(payload: AdminNotifyPayload) {
  const when = payload.createdAt
    ? new Date(payload.createdAt).toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        dateStyle: "medium",
        timeStyle: "short",
      });
  const rows = cleanDetails(payload.details);
  const adminUrl = `${siteBase()}/admin`;
  const subject = `[Approval needed] ${payload.topic}: ${payload.title}`.slice(
    0,
    140
  );

  const textLines = [
    `Something was submitted for approval on The Villages Everything App.`,
    ``,
    `Topic: ${payload.topic}`,
    `Title: ${payload.title}`,
    payload.submittedBy ? `Submitted by: ${payload.submittedBy}` : "",
    `When (Eastern): ${when}`,
    ``,
    ...rows.map((r) => `${r.label}: ${r.value}`),
    ``,
    `Review in Admin Portal: ${adminUrl}`,
    `Open the Pending tab to see every waiting item in one list.`,
  ].filter((line) => line !== "");

  const htmlRows = rows
    .map(
      (r) =>
        `<tr><th style="text-align:left;padding:6px 10px;background:#fff8ee;border:1px solid #eadfce;vertical-align:top;white-space:nowrap">${escapeHtml(r.label)}</th><td style="padding:6px 10px;border:1px solid #eadfce">${escapeHtml(r.value).replace(/\n/g, "<br/>")}</td></tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#fff8ee;color:#1c2430;padding:20px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:2px solid #1f6b4a;border-radius:16px;padding:22px">
    <p style="margin:0 0 8px;color:#1f6b4a;font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px">Needs your approval</p>
    <h1 style="margin:0 0 12px;font-size:22px">${escapeHtml(payload.topic)}</h1>
    <p style="margin:0 0 16px;font-size:17px"><strong>${escapeHtml(payload.title)}</strong></p>
    ${
      payload.submittedBy
        ? `<p style="margin:0 0 8px">Submitted by: <strong>${escapeHtml(payload.submittedBy)}</strong></p>`
        : ""
    }
    <p style="margin:0 0 16px;color:#5c6675">When (Eastern): ${escapeHtml(when)}</p>
    ${
      htmlRows
        ? `<table style="width:100%;border-collapse:collapse;font-size:15px;margin:0 0 18px">${htmlRows}</table>`
        : ""
    }
    <p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#1f6b4a;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:700">Open Admin Portal</a></p>
    <p style="margin:14px 0 0;font-size:13px;color:#5c6675">Use the Pending tab to see every waiting item in one list.</p>
  </div>
</body></html>`;

  return { subject, text: textLines.join("\n"), html };
}

async function sendViaResend(to: string, subject: string, text: string, html: string) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [to],
      subject,
      text,
      html,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 400)}`);
  }
  return true;
}

async function sendViaSendgrid(to: string, subject: string, text: string, html: string) {
  const key = process.env.SENDGRID_API_KEY?.trim();
  if (!key) return false;
  const fromRaw = fromAddress();
  const fromMatch = fromRaw.match(/^(.*)<([^>]+)>$/);
  const from = fromMatch
    ? { name: fromMatch[1].trim().replace(/^"|"$/g, ""), email: fromMatch[2].trim() }
    : { email: fromRaw };
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from,
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`SendGrid ${res.status}: ${body.slice(0, 400)}`);
  }
  return true;
}

export async function sendAdminApprovalEmail(payload: AdminNotifyPayload) {
  const to = adminNotifyEmail();
  const { subject, text, html } = formatAdminNotifyEmail(payload);
  try {
    if (await sendViaResend(to, subject, text, html)) {
      return { ok: true as const };
    }
    if (await sendViaSendgrid(to, subject, text, html)) {
      return { ok: true as const };
    }
    console.error(
      "[admin-mail] skipped — set RESEND_API_KEY or SENDGRID_API_KEY so approvals email",
      to
    );
    return { ok: false as const, skipped: true as const };
  } catch (err) {
    console.error("[admin-mail] send failed", err);
    return { ok: false as const, error: err instanceof Error ? err.message : "send failed" };
  }
}

/** Fire after a public submit. Never throws; never blocks the visitor on failure. */
export async function notifyAdminOfApprovalRequest(payload: AdminNotifyPayload) {
  await sendAdminApprovalEmail(payload);
}
