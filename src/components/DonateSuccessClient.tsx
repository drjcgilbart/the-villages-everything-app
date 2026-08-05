"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function DonateSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<
    "idle" | "checking" | "loofah" | "thanks" | "claim" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("thanks");
      return;
    }
    let cancelled = false;
    setStatus("checking");
    fetch("/api/donate/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Could not verify donation");
          return;
        }
        if (data.goldenLoofah) {
          setStatus("loofah");
          setMessage(data.message || "Golden Loofah unlocked!");
        } else if (data.pendingClaim) {
          setStatus("claim");
          setMessage(data.message);
        } else {
          setStatus("thanks");
          setMessage(data.message || "Thanks for the tip!");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setMessage("Could not verify donation. Your payment may still have gone through.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="shell page-hero-grid">
      <div>
        <span className="kicker">
          {status === "loofah"
            ? "Badge earned · scrub responsibly"
            : "Transaction complete · vibe elevated"}
        </span>
        <h1>
          {status === "loofah"
            ? "You earned the Golden Loofah!"
            : "You kept the lights on!"}
        </h1>
        <p>
          {status === "checking" && "Confirming your tip with Stripe…"}
          {status === "loofah" &&
            (message ||
              "The highly coveted Golden Loofah now appears next to your name in forums, yard sale, and across the Hub.")}
          {status === "thanks" &&
            (message ||
              "Thank you for the cup of Joe. Your tip helps this retirement reboot stay online, weird, and caffeinated.")}
          {status === "claim" &&
            (message ||
              "Sign in as a Hub member and revisit this page to claim your Golden Loofah.")}
          {status === "error" && (message || "Something went wrong verifying the tip.")}
          {status === "idle" && "Thank you for supporting The Villages Hub."}
        </p>
        {status === "loofah" && (
          <p className="panel-hint">
            Look for the sparkly shower loofah next to your display name wherever
            you post as a member.
          </p>
        )}
        <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
          {status === "claim" && (
            <Link href="/yard-sale/login" className="btn btn-primary">
              Sign in to claim badge
            </Link>
          )}
          {status === "loofah" && (
            <Link href="/my-space" className="btn btn-primary">
              Open My Space
            </Link>
          )}
          <Link
            href="/"
            className={status === "loofah" || status === "claim" ? "btn btn-ghost" : "btn btn-primary"}
          >
            Back home
          </Link>
          <Link href="/forums" className="btn btn-ghost">
            Forums
          </Link>
        </div>
      </div>
      <div className="page-hero-art">
        <Image
          src={
            status === "loofah"
              ? "/graphics/badges/golden-loofah.jpg"
              : "/graphics/mascot-logo.jpg"
          }
          alt={
            status === "loofah"
              ? "Golden Loofah badge — sparkly shower mesh pouf"
              : "Grateful golf-ball mascot"
          }
          width={260}
          height={260}
          className="page-hero-img donate-hero-mascot"
          priority
        />
      </div>
    </div>
  );
}
