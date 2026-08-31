import type { Metadata } from "next";
import { Suspense } from "react";
import { GolfCartHeroEmbed } from "@/components/GolfCartHeroEmbed";

export const metadata: Metadata = {
  title: "Golf Cart Hero",
  description:
    "The Villages Golf Cart Hero — race whimsical Florida animals through cart paths, town squares, and rec centers.",
};

export default function GolfCartHeroPage() {
  return (
    <Suspense
      fallback={
        <div className="gch-embed gch-embed-loading">
          <p>Loading Golf Cart Hero…</p>
        </div>
      }
    >
      <GolfCartHeroEmbed />
    </Suspense>
  );
}
