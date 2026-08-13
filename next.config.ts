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
};

export default nextConfig;
