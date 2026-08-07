import type { MetadataRoute } from "next";
import { isSiteGateEnabledAsync } from "@/lib/siteGate";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // While beta gate is on, ask crawlers to stay out
  if (await isSiteGateEnabledAsync()) {
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
