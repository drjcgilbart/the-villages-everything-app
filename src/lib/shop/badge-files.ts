// Print files for the name badges in a paid order: rendered for custom badges, the supplied art for ready-made ones.
// Attached to the admin order email, and copied to Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
import type { MailAttachment } from "@/lib/adminNotify";
import { findVariant } from "./catalog";
import { BADGE_SIZES, getBadgeTheme } from "./badges";
import { readReadyBadge, renderBadgePng } from "./badge-render";
import type { ShopOrderLine } from "./printful";
import { logError } from "./log";

export type BadgeJob = {
  n: number;
  quantity: number;
  kind: "custom" | "ready";
  product: string;
  theme: string;
  name: string;
  village?: string;
  size: string; // e.g. 3" x 1.5"
  files: { filename: string; note: string; bytes?: Buffer; url?: string; error?: string }[];
};

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "badge";

/** Group badge lines (a pair-priced and a single-priced line can be the same badge) and attach their files. */
export async function badgeJobs(lines: ShopOrderLine[]): Promise<BadgeJob[]> {
  const groups = new Map<string, { line: ShopOrderLine; quantity: number }>();
  for (const l of lines) {
    if (!l.badge) continue;
    const key = [l.sku, l.badge.name, l.badge.village ?? ""].join("|");
    const g = groups.get(key);
    if (g) g.quantity += l.quantity;
    else groups.set(key, { line: l, quantity: l.quantity });
  }
  const jobs: BadgeJob[] = [];
  let n = 0;
  for (const { line, quantity } of groups.values()) {
    n += 1;
    const b = line.badge!;
    const found = findVariant(line.sku);
    const job: BadgeJob = {
      n,
      quantity,
      kind: b.kind,
      product: found?.product.name ?? line.name,
      theme: b.kind === "custom" ? getBadgeTheme(b.theme)?.label ?? b.theme : "Edenfield (ready-made)",
      name: b.name,
      village: b.village,
      size: b.kind === "ready" ? BADGE_SIZES.ready.label : BADGE_SIZES.custom.label,
      files: [],
    };
    try {
      if (b.kind === "ready") {
        const art = found?.product.badge?.kind === "ready" ? found.product.badge.file : "";
        const base = art.split("/").pop()!.replace(/\.png$/, "");
        job.files.push({ filename: `badge-${n}-${base}-3.5x2.25in-print.png`, note: '3.5" x 2.25" at 300 dpi (1050 x 675), supplied print-ready art', bytes: await readReadyBadge(art) });
      } else {
        const theme = getBadgeTheme(b.theme);
        if (!theme) throw new Error(`Unknown badge theme ${b.theme}`);
        const text = { name: b.name, village: theme.usesVillage ? b.village : undefined };
        const base = `badge-${n}-${theme.id}-${slug(b.name)}`;
        job.files.push({ filename: `${base}-3x1.5in-print-bleed.png`, note: '3.25" x 1.75" at 300 dpi (976 x 526): 3" x 1.5" trim plus 1/8" bleed each side', bytes: await renderBadgePng(theme, text, { bleed: true }) });
        job.files.push({ filename: `${base}-3x1.5in-trim.png`, note: '3" x 1.5" at 300 dpi (900 x 450), no bleed', bytes: await renderBadgePng(theme, text, { bleed: false }) });
      }
    } catch (err) {
      logError("shop-badge-files", err, { sku: line.sku });
      job.files.push({ filename: "(not rendered)", note: "", error: err instanceof Error ? err.message.slice(0, 200) : "render failed" });
    }
    jobs.push(job);
  }
  return jobs;
}

/** Copy the files to Vercel Blob (private store first, like dataFs). Never throws; leaves url unset on failure. */
export async function storeBadgeFiles(sessionId: string, jobs: BadgeJob[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) return;
  const { put } = await import("@vercel/blob");
  const folder = `shop/badge-orders/${sessionId.slice(-24)}`;
  for (const f of jobs.flatMap((j) => j.files)) {
    if (!f.bytes) continue;
    for (const access of ["private", "public"] as const) {
      try {
        const r = await put(`${folder}/${f.filename}`, f.bytes, { access, contentType: "image/png", addRandomSuffix: false, allowOverwrite: true });
        f.url = r.url;
        break;
      } catch (err) {
        if (access === "public") logError("shop-badge-files", err, { op: "blob", file: f.filename });
      }
    }
  }
}

export function badgeAttachments(jobs: BadgeJob[]): MailAttachment[] {
  return jobs.flatMap((j) => j.files.filter((f) => f.bytes).map((f) => ({ filename: f.filename, contentBase64: f.bytes!.toString("base64"), contentType: "image/png" })));
}

export function badgeEmailLines(jobs: BadgeJob[]): string[] {
  if (!jobs.length) return [];
  const out = ["", "NAME BADGES (make by hand; print files attached):"];
  for (const j of jobs) {
    out.push(
      `#${j.n}  ${j.quantity} x ${j.kind === "ready" ? `${j.product} (ready-made)` : `Custom name badge, theme: ${j.theme}`}`,
      `    Blank / size: ${j.size} magnetic badge`,
      `    Name: ${j.name}${j.village ? `   Village: ${j.village}` : ""}`
    );
    for (const f of j.files) out.push(f.error ? `    PRINT FILE FAILED: ${f.error}` : `    File: ${f.filename}  [${f.note}]${f.url ? `  ${f.url}` : ""}`);
  }
  return out;
}
