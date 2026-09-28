"use client";

import Link from "next/link";

/** Required on the iPhone and iPad screen where a yearly plan is bought. */
export function AppleSubscriptionNotes({
  onRestore,
  restoring = false,
}: {
  onRestore?: () => void;
  restoring?: boolean;
}) {
  return (
    <div className="apple-sub-notes">
      <p>
        Cart Path Regular ($3/year), Lanai Legend ($5/year), and Square Royalty
        ($10/year) are 1-year subscriptions that renew automatically. Payment is
        charged to your Apple ID. The plan renews unless you turn off auto-renew
        at least 24 hours before the year ends. Apple charges the renewal within
        24 hours before that date. Manage or cancel in Settings, then your Apple
        ID, then Subscriptions.
      </p>
      <p>
        <Link href="/privacy">Privacy Policy</Link>
        {" · "}
        <Link href="/terms">Terms of Use (EULA)</Link>
      </p>
      {onRestore ? (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={restoring}
          onClick={onRestore}
        >
          {restoring ? "Restoring…" : "Restore Purchases"}
        </button>
      ) : null}
    </div>
  );
}
