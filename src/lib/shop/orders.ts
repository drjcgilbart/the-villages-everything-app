// Order record for shop sales. Same storage pattern as the rest of the site:
// Upstash Redis REST when UPSTASH_REDIS_REST_URL/TOKEN (or KV_REST_API_*) are set, otherwise a local JSON file
// (.data/shop-orders.json on this PC, /tmp on a serverless host where the project folder is read-only).
import fs from "fs";
import os from "os";
import path from "path";
import type { ShopOrderLine, ShopRecipient } from "./printful";
import { logError } from "./log";

export type ShopOrderStatus = "sent-to-printful" | "needs-manual-fulfillment" | "printful-failed";

export type ShopOrderRecord = {
  sessionId: string;
  createdAt: string;
  status: ShopOrderStatus;
  reason?: string;
  amountTotalCents: number | null;
  shippingCents: number;
  livemode: boolean;
  lines: ShopOrderLine[];
  recipient: ShopRecipient;
  printfulOrderId?: number;
  printfulStatus?: string;
};

const ORDER_KEY = (id: string) => `shop:order:${id}`;
const LIST_KEY = "shop:orders";

function redisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(args: (string | number)[]) {
  const env = redisEnv()!;
  const res = await fetch(env.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return ((await res.json()) as { result?: unknown }).result;
}

function localFile() {
  const onServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const dir = onServerless ? path.join(os.tmpdir(), "tvh-data") : path.join(process.cwd(), ".data");
  return path.join(dir, "shop-orders.json");
}

function readLocal(): ShopOrderRecord[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ localFile(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(record: ShopOrderRecord) {
  const file = localFile();
  const rest = readLocal().filter((o) => o.sessionId !== record.sessionId);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(/*turbopackIgnore: true*/ file, JSON.stringify([record, ...rest].slice(0, 1000), null, 2), "utf8");
}

/** Save or update an order. Returns where it was stored. Never throws. */
export async function saveShopOrder(record: ShopOrderRecord): Promise<"redis" | "file" | "none"> {
  if (redisEnv()) {
    try {
      await redis(["SET", ORDER_KEY(record.sessionId), JSON.stringify(record)]);
      await redis(["LREM", LIST_KEY, 0, record.sessionId]);
      await redis(["LPUSH", LIST_KEY, record.sessionId]);
      return "redis";
    } catch (err) {
      logError("shop-orders", err, { session: record.sessionId, store: "redis" });
    }
  }
  try {
    writeLocal(record);
    return "file";
  } catch (err) {
    logError("shop-orders", err, { session: record.sessionId, store: "file" });
    return "none";
  }
}

export async function getShopOrder(sessionId: string): Promise<ShopOrderRecord | null> {
  if (redisEnv()) {
    try {
      const raw = await redis(["GET", ORDER_KEY(sessionId)]);
      if (typeof raw === "string") return JSON.parse(raw) as ShopOrderRecord;
    } catch (err) {
      logError("shop-orders", err, { session: sessionId, op: "get" });
    }
  }
  return readLocal().find((o) => o.sessionId === sessionId) ?? null;
}
