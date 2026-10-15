import crypto from "crypto";
import { notifyAdminOfApprovalRequest, sendOutboundEmail } from "./adminNotify";
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
import {
  getMemberById,
  hydrateYardSale,
  markMemberEmailVerified,
  memberByEmailChallenge,
  saveMemberEmailChallenge,
} from "./yardSale";
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

async function readStore(): Promise<{ store: Store; found: boolean }> {
  if (isEphemeralHost() && durableConfigured()) {
    const text = await pullText();
    if (text) {
      cacheDurableJson(MEMBER_EMAIL_VERIFY_FILE, text);
      return { store: parseStore(text), found: true };
    }
    return { store: { tokens: [] }, found: false };
  }
  const local = readJsonFile<Store>(MEMBER_EMAIL_VERIFY_FILE);
  if (!local) return { store: { tokens: [] }, found: false };
  return { store: parseStore(local), found: true };
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

/** Admin hears about a sign-up only after Confirm my email. */
export async function notifyAdminOfConfirmedMemberRequest(member: Member) {
  if (member.status !== "pending" || isSiteOwnerEmail(member.email)) return;
  try {
    await notifyAdminOfApprovalRequest({
      topic: "Members",
      title: member.name,
      submittedBy: member.name,
      createdAt: member.createdAt,
      details: {
        name: member.name,
        email: member.email,
        phone: member.phone || "",
        village: member.village || "",
        status: member.status,
        emailConfirmed: "yes",
      },
    });
  } catch (err) {
    console.error("[email-verify] admin notify", err);
  }
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
    `The link is good for 48 hours. Pressing the button confirms this inbox. A membership that is still waiting is sent to the admin only after that. The Holiday Lights warning is a separate Accept on the tour page.`,
    ``,
    `If you did not create this account, you can ignore this email.`,
  ].join("\n");
  const safeUrl = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const html = `<p>Hello ${first},</p><p>Confirm the email on your membership. Open the link, then press <strong>Confirm my email</strong>.</p><p><a href="${safeUrl}">${safeUrl}</a></p><p>The link is good for 48 hours. Pressing the button confirms this inbox. A membership that is still waiting is sent to the admin only after that. The Holiday Lights warning is a separate Accept on the tour page.</p><p>If you did not create this account, you can ignore this email.</p>`;
  return { subject, text, html };
}

const LINK_MISSING = "This link is not on file. Sign in and press Send the confirmation email.";
const LINK_EXPIRED = "This link has expired. Sign in and press Send the confirmation email.";
const LINK_UNREADABLE = "The confirmation list did not load. Press the button again.";
const LINK_EMPTY = "The confirmation did not include the link. Press the button again.";

/** Sends a fresh link. A mail-scanner fetch of the link does not confirm the inbox. */
export function sendMemberVerificationEmail(memberId: string) {
  return enqueue(async () => {
    await hydrateYardSale();
    const member = getMemberById(memberId);
    if (!member) return { ok: false as const, error: "Member not found" };
    if (memberEmailIsVerified(member)) return { ok: true as const, already: true };
    const raw = crypto.randomBytes(32).toString("base64url");
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + TOKEN_MS).toISOString();
    const saved = await saveMemberEmailChallenge(member.id, tokenHash, expiresAt);
    if (!saved) return { ok: false as const, error: "Member not found" };
    try {
      const loaded = await readStore();
      // A missed read looks empty. Writing it would erase links already on file.
      if (loaded.found) {
        loaded.store.tokens = loaded.store.tokens.filter((row) => row.memberId !== member.id);
        loaded.store.tokens.push({ memberId: member.id, tokenHash, expiresAt, usedAt: "" });
        await writeStore(loaded.store);
      }
    } catch (err) {
      console.error("[email-verify] token file", err);
    }
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
      throw Object.assign(new Error(LINK_EMPTY), { status: 400 });
    }
    const tokenHash = hashToken(raw);
    const challenge = await memberByEmailChallenge(tokenHash);
    if (challenge.member && !challenge.expired) {
      const wasVerified = memberEmailIsVerified(challenge.member);
      const member = await markMemberEmailVerified(challenge.member.id);
      if (!member) throw Object.assign(new Error(LINK_MISSING), { status: 400 });
      if (!wasVerified) await notifyAdminOfConfirmedMemberRequest(member);
      return member;
    }
    if (challenge.expired) {
      throw Object.assign(new Error(LINK_EXPIRED), { status: 400 });
    }
    let loaded: { store: Store; found: boolean };
    try {
      loaded = await readStore();
    } catch (err) {
      console.error("[email-verify] read", err);
      throw Object.assign(new Error(LINK_UNREADABLE), { status: 503 });
    }
    const row = loaded.store.tokens.find((item) => item.tokenHash === tokenHash);
    if (!row) {
      throw Object.assign(new Error(LINK_MISSING), { status: 400 });
    }
    if (Date.parse(row.expiresAt) < Date.now()) {
      throw Object.assign(new Error(LINK_EXPIRED), { status: 400 });
    }
    const prior = getMemberById(row.memberId);
    const wasVerified = prior ? memberEmailIsVerified(prior) : false;
    const member = await markMemberEmailVerified(row.memberId);
    if (!member) throw Object.assign(new Error(LINK_MISSING), { status: 400 });
    if (!wasVerified) await notifyAdminOfConfirmedMemberRequest(member);
    if (!row.usedAt) {
      row.usedAt = new Date().toISOString();
      try {
        await writeStore(loaded.store);
      } catch (err) {
        console.error("[email-verify] used stamp", err);
      }
    }
    return member;
  });
}
