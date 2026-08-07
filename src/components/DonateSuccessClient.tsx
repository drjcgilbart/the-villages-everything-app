"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function DonateSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<
    "idle" | "checking" | "badge" | "thanks" | "claim" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [badgeLabel, setBadgeLabel] = useState<string | null>(null);
  const [badgeImage, setBadgeImage] = useState<string | null>(null);

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
        if (data.badgeId) {
          setBadgeLabel(data.badgeLabel || data.badgeId);
          setBadgeImage(data.badgeImage || null);
        }
        if (data.badgeId && !data.pendingClaim) {
          setStatus("badge");
          setMessage(data.message || "Badge unlocked!");
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
          setMessage(
            "Could not verify donation. Your payment may still have gone through."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const heroImg =
    status === "badge" && badgeImage
      ? badgeImage
      : status === "claim" && badgeImage
        ? badgeImage
        : "/graphics/mascot-logo.jpg";

  return (
    <div className="shell page-hero-grid">
      <div>
        <span className="kicker">
          {status === "badge"
            ? "Badge earned · tip jar hero"
            : "Transaction complete · vibe elevated"}
        </span>
        <h1>
          {status === "badge"
            ? `You earned ${badgeLabel || "a tip badge"}!`
            : "You kept the lights on!"}
        </h1>
        <p>
          {status === "checking" && "Confirming your tip with Stripe…"}
          {status === "badge" &&
            (message ||
              "Your donation badge now appears next to your name in forums, yard sale, and across the Hub.")}
          {status === "thanks" &&
            (message ||
              "Thank you for the cup of Joe. Your tip helps this retirement reboot stay online, weird, and caffeinated.")}
          {status === "claim" &&
            (message ||
              "Sign in as a Hub member and revisit this page to claim your badge.")}
          {status === "error" && (message || "Something went wrong verifying the tip.")}
          {status === "idle" &&
            "Thank you for supporting The Villages Everything App."}
        </p>
        {status === "badge" && (
          <p className="panel-hint">
            Look for your tip badge next to your display name wherever you post
            as a member.
          </p>
        )}
        <div className="hero-actions" style={{ marginTop: "1.25rem" }}>
          {status === "claim" && (
            <Link href="/yard-sale/login" className="btn btn-primary">
              Sign in to claim badge
            </Link>
          )}
          {status === "badge" && (
            <Link href="/my-space" className="btn btn-primary">
              Open My Space
            </Link>
          )}
          <Link
            href="/"
            className={
              status === "badge" || status === "claim"
                ? "btn btn-ghost"
                : "btn btn-primary"
            }
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
          src={heroImg}
          alt={
            badgeLabel
              ? `${badgeLabel} donation badge`
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
