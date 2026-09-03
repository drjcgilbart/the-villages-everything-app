import crypto from "crypto";
import { readJsonFile, writeJsonFileAsync } from "./dataFs";
import {
  REPORT_TARGET_TYPES,
  type ReportTargetType,
  type SafetyBlock,
  type SafetyReport,
  type SafetyReportStatus,
} from "./safetyTypes";

export type {
  ReportTargetType,
  SafetyBlock,
  SafetyReport,
  SafetyReportStatus,
} from "./safetyTypes";
export { REPORT_TARGET_TYPES, SAFETY_REPORT_REASONS } from "./safetyTypes";

const FILE = "safety.json";

type SafetyFile = {
  reports: SafetyReport[];
  blocks: SafetyBlock[];
  updatedAt: string | null;
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function empty(): SafetyFile {
  return { reports: [], blocks: [], updatedAt: null };
}

export function loadSafety(): SafetyFile {
  const raw = readJsonFile<SafetyFile>(FILE);
  if (!raw || typeof raw !== "object") return empty();
  return {
    reports: Array.isArray(raw.reports) ? raw.reports : [],
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
    updatedAt: raw.updatedAt || null,
  };
}

async function saveSafety(data: SafetyFile) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, data);
  return data;
}

export function isReportTargetType(value: string): value is ReportTargetType {
  return (REPORT_TARGET_TYPES as readonly string[]).includes(value);
}

export async function createSafetyReport(input: {
  targetType: ReportTargetType;
  targetId: string;
  targetMemberId?: string | null;
  targetLabel?: string;
  reason: string;
  details?: string;
  reporterMemberId?: string | null;
  reporterName?: string | null;
}): Promise<SafetyReport> {
  const targetId = String(input.targetId || "").trim().slice(0, 80);
  if (!targetId) throw new Error("Nothing to report");
  const reason = String(input.reason || "").trim().slice(0, 80);
  if (!reason) throw new Error("Pick a reason");
  const details = String(input.details || "").trim().slice(0, 500) || undefined;

  const data = loadSafety();
  const report: SafetyReport = {
    id: uid("rpt"),
    targetType: input.targetType,
    targetId,
    targetMemberId: input.targetMemberId || null,
    targetLabel: String(input.targetLabel || "").trim().slice(0, 140) || undefined,
    reason,
    details,
    reporterMemberId: input.reporterMemberId || null,
    reporterName: String(input.reporterName || "").trim().slice(0, 80) || null,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  data.reports.unshift(report);
  data.reports = data.reports.slice(0, 500);
  await saveSafety(data);
  return report;
}

export function listSafetyReports(): SafetyReport[] {
  return loadSafety().reports;
}

export async function setSafetyReportStatus(
  id: string,
  status: SafetyReportStatus
): Promise<SafetyReport> {
  const data = loadSafety();
  const idx = data.reports.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Report not found");
  data.reports[idx] = { ...data.reports[idx], status };
  await saveSafety(data);
  return data.reports[idx];
}

export function blockedIdsFor(memberId: string): Set<string> {
  if (!memberId) return new Set();
  return new Set(
    loadSafety()
      .blocks.filter((b) => b.blockerMemberId === memberId)
      .map((b) => b.blockedMemberId)
  );
}

export async function blockMember(
  blockerMemberId: string,
  blockedMemberId: string
): Promise<SafetyBlock> {
  const blocker = String(blockerMemberId || "").trim();
  const blocked = String(blockedMemberId || "").trim();
  if (!blocker) throw new Error("Please sign in to block a neighbor");
  if (!blocked) throw new Error("Nothing to block");
  if (blocker === blocked) throw new Error("You can’t block yourself");

  const data = loadSafety();
  const existing = data.blocks.find(
    (b) => b.blockerMemberId === blocker && b.blockedMemberId === blocked
  );
  if (existing) return existing;

  const rec: SafetyBlock = {
    id: uid("blk"),
    blockerMemberId: blocker,
    blockedMemberId: blocked,
    createdAt: new Date().toISOString(),
  };
  data.blocks.push(rec);
  await saveSafety(data);
  return rec;
}

export async function unblockMember(
  blockerMemberId: string,
  blockedMemberId: string
) {
  const data = loadSafety();
  data.blocks = data.blocks.filter(
    (b) =>
      !(
        b.blockerMemberId === blockerMemberId &&
        b.blockedMemberId === blockedMemberId
      )
  );
  await saveSafety(data);
}

export function listBlocksFor(memberId: string): SafetyBlock[] {
  return loadSafety().blocks.filter((b) => b.blockerMemberId === memberId);
}

export async function removeBlocksInvolving(memberId: string) {
  const data = loadSafety();
  const next = data.blocks.filter(
    (b) => b.blockerMemberId !== memberId && b.blockedMemberId !== memberId
  );
  if (next.length === data.blocks.length) return;
  data.blocks = next;
  await saveSafety(data);
}
