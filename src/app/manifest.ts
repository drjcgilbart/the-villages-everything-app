import type { MetadataRoute } from "next";
import { SITE_BRAND } from "@/lib/siteBrand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_BRAND.name,
    short_name: "Villages App",
    description: SITE_BRAND.subtitle,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    background_color: "#fff8ee",
    theme_color: "#1f6b4a",
    prefer_related_applications: false,
    icons: [
      {
        src: "/graphics/mascot-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/graphics/mascot-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/graphics/mascot-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/graphics/mascot-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
