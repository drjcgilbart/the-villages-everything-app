"use client";

import { useEffect } from "react";
import { isIosNativeApp } from "@/lib/appleIapClient";

type PurchaseDetail = {
  ok?: boolean;
  error?: string;
  signedTransaction?: string;
  signedTransactions?: string[];
  transactionId?: string;
  transactionIds?: string[];
};

/**
 * The iPhone shell reports StoreKit results here. This saves the plan
 * on the signed-in neighbor, including a purchase that finished after a refresh.
 */
export function ApplePurchaseBridge() {
  useEffect(() => {
    if (!isIosNativeApp()) return;
    const onPurchase = async (ev: Event) => {
      const detail = ((ev as CustomEvent).detail || {}) as PurchaseDetail;
      if (!detail.ok) {
        window.dispatchEvent(new CustomEvent("vea-apple-done", { detail }));
        return;
      }
      const tokens = (
        detail.signedTransactions?.length
          ? detail.signedTransactions
          : detail.signedTransaction
            ? [detail.signedTransaction]
            : []
      ).filter(Boolean);
      const ids = detail.transactionIds?.length
        ? detail.transactionIds
        : detail.transactionId
          ? [detail.transactionId]
          : [];
      try {
        let last: { plan?: string; planLabel?: string; active?: boolean } = {};
        if (!tokens.length) throw new Error("Apple did not return a purchase.");
        for (const signedTransaction of tokens) {
          const res = await fetch("/api/members/apple/confirm", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signedTransaction }),
          });
          const data = (await res.json()) as { error?: string; plan?: string; planLabel?: string; active?: boolean };
          if (!res.ok) throw new Error(data.error || "Could not save the Apple membership");
          last = data;
        }
        const view = (window as Window & { ReactNativeWebView?: { postMessage: (s: string) => void } })
          .ReactNativeWebView;
        for (const transactionId of ids) {
          view?.postMessage(JSON.stringify({ type: "apple-finish", transactionId }));
        }
        window.dispatchEvent(
          new CustomEvent("vea-apple-done", { detail: { ok: true, ...last } })
        );
      } catch (e) {
        window.dispatchEvent(
          new CustomEvent("vea-apple-done", {
            detail: {
              ok: false,
              error: e instanceof Error ? e.message : "Could not save the Apple membership",
            },
          })
        );
      }
    };
    window.addEventListener("vea-apple-purchase", onPurchase);
    return () => window.removeEventListener("vea-apple-purchase", onPurchase);
  }, []);
  return null;
}
