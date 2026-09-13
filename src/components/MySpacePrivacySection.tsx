"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import { writeDiningFavorites } from "@/lib/diningFavorites";
import type { StoredBoardId } from "@/lib/memberBoardModel";
import {
  clearScopedBoardCache,
  readPageHidden,
  subscribePageHidden,
  writePageHidden,
  type MySpacePrivacyTarget,
} from "@/lib/mySpacePagePrivacy";
import { writeRecFavorites } from "@/lib/recCenterFavorites";
import {
  writeClubFavoritesLocal,
  writeMyVillageSlug,
} from "@/lib/siteFavorites";
import { writeTownSquareFavorites } from "@/lib/townSquareFavorites";

function serverHidden() {
  return false;
}

export function MySpacePrivacySection({
  board,
  extraBoards,
  title,
  memberId,
  children,
}: {
  board: MySpacePrivacyTarget;
  extraBoards?: StoredBoardId[];
  title: string;
  memberId: string | null | undefined;
  children: ReactNode;
}) {
  const id = String(memberId || "");
  const hidden = useSyncExternalStore(
    subscribePageHidden,
    () => (id ? readPageHidden(id, board) : false),
    serverHidden
  );
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const storedBoards: StoredBoardId[] =
    board === "favorites" ? [] : [board, ...(extraBoards || [])];

  const toggleHide = useCallback(() => {
    if (!id) return;
    writePageHidden(id, board, !hidden);
    setNote(
      hidden
        ? "Your notes are visible again. Nothing was deleted."
        : "Hidden on this screen only. Your notes are still saved on this login."
    );
  }, [board, hidden, id]);

  if (!id) return <>{children}</>;

  async function deleteData() {
    if (!id) return;
    const extra =
      storedBoards.length > 1
        ? " This also clears Gym on the same page."
        : board === "favorites"
          ? " This clears starred villages, squares, rec centers, clubs, and dining on this device."
          : "";
    const ok = window.confirm(
      `Permanently delete your ${title} data from this app? Hide only covers it on this screen. Delete cannot be undone, and this login will start this board empty.${extra}`
    );
    if (!ok) return;
    setBusy(true);
    setNote(null);
    try {
      if (board === "favorites") {
        writeDiningFavorites([]);
        writeRecFavorites([]);
        writeTownSquareFavorites([]);
        writeClubFavoritesLocal([]);
        writeMyVillageSlug(null);
      } else {
        const res = await fetch("/api/members/space/boards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "clear", boards: storedBoards }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Could not delete");
        clearScopedBoardCache(id, storedBoards);
      }
      writePageHidden(id, board, false);
      setNonce((n) => n + 1);
      setNote(`Your ${title} data was deleted from this login. This board is empty now.`);
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ms-privacy-section">
      <div className="ms-privacy-bar">
        <p className="ms-privacy-bar-note">
          Private to this login — never shared with another member.
        </p>
        <div className="ms-privacy-actions">
          <button
            type="button"
            className={`btn btn-ghost btn-sm${hidden ? " ms-privacy-hide-on" : ""}`}
            aria-pressed={hidden}
            disabled={!id || busy}
            onClick={toggleHide}
          >
            {hidden ? "Show my data" : "Hide my data"}
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            disabled={!id || busy}
            onClick={() => void deleteData()}
          >
            {busy ? "Deleting…" : "Delete my data"}
          </button>
        </div>
      </div>
      {note ? <p className="club-sync-note">{note}</p> : null}
      <div
        className="ms-privacy-wrap"
        data-hidden={hidden ? "true" : "false"}
      >
        <div className="ms-privacy-body" key={`${board}-${nonce}`}>
          {children}
        </div>
        {hidden ? (
          <div className="ms-privacy-cover" role="status">
            <strong>{title} is hidden</strong>
            <span>Still saved on this login. Press Show my data when you want it back.</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
