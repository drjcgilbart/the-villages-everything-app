import type { MetadataRoute } from "next";
import { isSiteGateEnabled } from "@/lib/siteGate";

export default function robots(): MetadataRoute.Robots {
  // While beta gate is on, ask crawlers to stay out
  if (isSiteGateEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
