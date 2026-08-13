import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  // Ship JSON seeds + any bundled uploads with serverless functions
  outputFileTracingIncludes: {
    "/*": ["./data/**/*"],
  },
  // Allow large direct video uploads in Studio (local / Node host)
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/golf-cart-hero",
        destination: "/golf-cart-hero/index.html",
      },
    ];
  },
};

export default nextConfig;
