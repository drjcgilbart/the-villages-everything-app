export const REPORT_TARGET_TYPES = [
  "forum_thread",
  "forum_reply",
  "yard_listing",
  "dining_review",
  "member",
] as const;

export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

export type SafetyReportStatus = "open" | "reviewed";

export type SafetyReport = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetMemberId?: string | null;
  targetLabel?: string;
  reason: string;
  details?: string;
  reporterMemberId?: string | null;
  reporterName?: string | null;
  createdAt: string;
  status: SafetyReportStatus;
};

export type SafetyBlock = {
  id: string;
  blockerMemberId: string;
  blockedMemberId: string;
  createdAt: string;
};

export const SAFETY_REPORT_REASONS = [
  "Harassment or bullying",
  "Hate speech or slurs",
  "Spam or scam",
  "Inappropriate or sexual content",
  "Personal information posted without consent",
  "Other",
] as const;
