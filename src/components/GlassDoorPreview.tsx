"use client";

import Link from "next/link";
import {
  getBoard,
  unlockCtaLabel,
  type BoardId,
} from "@/lib/mySpaceProduct";
import { HUB_TIERS, type HubPlanId } from "@/lib/membershipTiers";

type Props = {
  boardId: BoardId;
  visitor: boolean;
  currentLabel?: string;
  approved?: boolean;
  nativeApp?: boolean;
  busy?: boolean;
  onUnlock?: (tierId: HubPlanId) => void;
};

/**
 * Glass-door lock for a My Space board: sample chrome, never real personal data.
 */
export function GlassDoorPreview({
  boardId,
  visitor,
  currentLabel,
  approved = false,
  nativeApp = false,
  busy = false,
  onUnlock,
}: Props) {
  const board = getBoard(boardId);
  const need = HUB_TIERS.find((t) => t.rank === board.minRank) || HUB_TIERS[1];
  const cta = unlockCtaLabel(board.minRank);

  return (
    <div className="about-panel ms-glass">
      <span className="pill">Locked · {need.label}+</span>
      <div className="ms-glass-head">
        <span className="ms-glass-icon" aria-hidden>
          {board.icon}
        </span>
        <h3>{board.label}</h3>
      </div>
      <p className="ms-glass-teaser">{board.teaser}</p>

      <div className="ms-glass-chrome" aria-hidden="true">
        <div className="ms-glass-row is-sample">{board.previewLine}</div>
        <div className="ms-glass-row is-skel" />
        <div className="ms-glass-row is-skel" />
      </div>

      {visitor ? (
        <p className="panel-hint">
          Sign in as a neighbor to keep this board on your account. Paid tiers
          unlock the real tools — this preview is sample data only.
        </p>
      ) : (
        <p className="panel-hint">
          You’re on <strong>{currentLabel || "Porch Waver"}</strong>.{" "}
          {cta} (or higher) to use the real board — never someone else’s notes.
        </p>
      )}

      <div className="hero-actions ms-glass-actions">
        {visitor ? (
          <>
            <Link
              href="/yard-sale/login?next=/my-space"
              className="btn btn-primary btn-sm"
            >
              Sign in
            </Link>
            <Link href="/yard-sale/join" className="btn btn-ghost btn-sm">
              Request membership
            </Link>
          </>
        ) : nativeApp ? (
          <p className="panel-hint" style={{ margin: 0 }}>
            Membership isn’t sold in the store app. Subscribe at{" "}
            <strong>thevillageseverythingapp.com</strong>, then sign in here.
          </p>
        ) : !approved ? (
          <p className="pf-form-error" style={{ margin: 0 }}>
            Your neighbor account must be approved before upgrading.
          </p>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm hide-in-native-app"
            disabled={busy}
            onClick={() => onUnlock?.(need.id)}
          >
            {busy ? "Starting…" : cta}
          </button>
        )}
      </div>
    </div>
  );
}
