import crypto from "crypto";
import { sendOutboundEmail } from "./adminNotify";
import {
  cacheDurableJson,
  durableConfigured,
  isEphemeralHost,
  pullDurableJson,
  pullJsonFromBlob,
  readJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import { isSiteOwnerEmail } from "./siteOwner";
import { getMemberById, markMemberEmailVerified } from "./yardSale";
import type { Member } from "./yardSaleTypes";

export const MEMBER_EMAIL_VERIFY_FILE = "member-email-verify.json";

const TOKEN_MS = 48 * 60 * 60 * 1000;

type TokenRow = {
  memberId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string;
};

type Store = { tokens: TokenRow[] };

let writeChain: Promise<unknown> = Promise.resolve();

function enqueue<T>(work: () => Promise<T>): Promise<T> {
  const run = writeChain.then(work, work);
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function redisOverLimit(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  return /plan limits|fixed plan/i.test(msg);
}

function siteBase() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.thevillageseverythingapp.com"
  );
}

function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function parseStore(raw: unknown): Store {
  if (raw == null) return { tokens: [] };
  const data = typeof raw === "string" ? (JSON.parse(raw) as { tokens?: unknown }) : (raw as { tokens?: unknown });
  if (!data || typeof data !== "object" || !Array.isArray(data.tokens)) {
    throw new Error("Could not read email confirmations.");
  }
  const tokens: TokenRow[] = [];
  for (const row of data.tokens) {
    if (!row || typeof row !== "object") continue;
    const item = row as Partial<TokenRow>;
    const memberId = clip(item.memberId, 80);
    const tokenHash = clip(item.tokenHash, 64);
    const expiresAt = clip(item.expiresAt, 40);
    if (!memberId || !tokenHash || !expiresAt) continue;
    tokens.push({
      memberId,
      tokenHash,
      expiresAt,
      usedAt: clip(item.usedAt, 40),
    });
  }
  return { tokens: tokens.slice(-2000) };
}

async function pullText(): Promise<string | null> {
  try {
    return await pullDurableJson(MEMBER_EMAIL_VERIFY_FILE);
  } catch (err) {
    if (!redisOverLimit(err)) throw err;
    return pullJsonFromBlob(MEMBER_EMAIL_VERIFY_FILE);
  }
}

async function readStore(): Promise<Store> {
  if (isEphemeralHost() && durableConfigured()) {
    const text = await pullText();
    if (text) {
      cacheDurableJson(MEMBER_EMAIL_VERIFY_FILE, text);
      return parseStore(text);
    }
    return { tokens: [] };
  }
  return parseStore(readJsonFile<Store>(MEMBER_EMAIL_VERIFY_FILE));
}

async function writeStore(store: Store) {
  await writeJsonFileAsync(MEMBER_EMAIL_VERIFY_FILE, {
    tokens: store.tokens.slice(-2000),
  });
}

export function memberEmailIsVerified(member: { email?: string | null; emailVerifiedAt?: string | null }) {
  return Boolean(member.emailVerifiedAt) || isSiteOwnerEmail(member.email);
}

function memberMailError(sent: { ok: false; error?: string; skipped?: boolean }) {
  console.error("[email-verify]", sent.error || "mail skipped");
  return "The confirmation email could not be sent right now. Try again in a few minutes.";
}

function letter(member: Member, url: string) {
  const rawFirst = member.name.trim().split(/\s+/)[0] || "Neighbor";
  const first = rawFirst.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const subject = "Confirm your email for The Villages Everything App";
  const text = [
    `Hello ${rawFirst},`,
    ``,
    `Confirm the email on your membership by opening this link and pressing Confirm my email:`,
    url,
    ``,
    `The link is good for 48 hours. This shows the inbox can receive mail. The Holiday Lights warning is a separate Accept on the tour page.`,
    ``,
    `If you did not create this account, you can ignore this email.`,
  ].join("\n");
  const safeUrl = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const html = `<p>Hello ${first},</p><p>Confirm the email on your membership. Open the link, then press <strong>Confirm my email</strong>.</p><p><a href="${safeUrl}">${safeUrl}</a></p><p>The link is good for 48 hours. This shows the inbox can receive mail. The Holiday Lights warning is a separate Accept on the tour page.</p><p>If you did not create this account, you can ignore this email.</p>`;
  return { subject, text, html };
}

/** Sends a fresh link. A mail-scanner fetch of the link does not confirm the inbox. */
export function sendMemberVerificationEmail(memberId: string) {
  return enqueue(async () => {
    const member = getMemberById(memberId);
    if (!member) return { ok: false as const, error: "Member not found" };
    if (memberEmailIsVerified(member)) return { ok: true as const, already: true };
    const raw = crypto.randomBytes(32).toString("base64url");
    const store = await readStore();
    store.tokens = store.tokens.filter((row) => row.memberId !== member.id);
    store.tokens.push({
      memberId: member.id,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + TOKEN_MS).toISOString(),
      usedAt: "",
    });
    await writeStore(store);
    const url = `${siteBase()}/yard-sale/verify?token=${encodeURIComponent(raw)}`;
    const sent = await sendOutboundEmail({ to: member.email, ...letter(member, url) });
    if (!sent.ok) return { ok: false as const, error: memberMailError(sent) };
    return { ok: true as const, already: false };
  });
}

export function confirmMemberEmail(rawToken: string) {
  return enqueue(async () => {
    const raw = clip(rawToken, 200);
    if (!/^[A-Za-z0-9_-]{20,200}$/.test(raw)) {
      throw Object.assign(new Error("This link has expired or was already used. Sign in and send a new one from Holiday Lights."), {
        status: 400,
      });
    }
    const tokenHash = hashToken(raw);
    const store = await readStore();
    const row = store.tokens.find((item) => item.tokenHash === tokenHash);
    const expired = !row || row.usedAt || Date.parse(row.expiresAt) < Date.now();
    if (!row || expired) {
      throw Object.assign(new Error("This link has expired or was already used. Sign in and send a new one from Holiday Lights."), {
        status: 400,
      });
    }
    row.usedAt = new Date().toISOString();
    await writeStore(store);
    const member = await markMemberEmailVerified(row.memberId);
    if (!member) {
      throw Object.assign(new Error("This link has expired or was already used. Sign in and send a new one from Holiday Lights."), {
        status: 400,
      });
    }
    return member;
  });
}
