import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonateMascotFloat } from "@/components/DonateMascotFloat";
import { FloatingBackButton } from "@/components/FloatingBackButton";
import { MascotQuipPopup } from "@/components/MascotQuipPopup";
import { ThemeMusicPlayer } from "@/components/ThemeMusicPlayer";
import { PwaRegister } from "@/components/PwaRegister";
import { NativeAppBoot } from "@/components/NativeAppBoot";
import { ensureDurableHydrated } from "@/lib/dataFs";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Villages Everything App",
    template: "%s · The Villages Everything App",
  },
  description:
    "The moderately ridiculous everything app for The Villages, Florida — villages, dining, golf, clubs, calendar, community resources, and a personal retirement reboot notebook.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/graphics/mascot-192.png", sizes: "192x192", type: "image/png" },
      { url: "/graphics/mascot-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/graphics/mascot-180.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "The Villages Everything App",
    description:
      "Everything you need in The Villages — with jokes, cart-path energy, and zero corporate brochure voice.",
    url: siteUrl,
    siteName: "The Villages Everything App",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Pull latest membership/badge data from Vercel Blob when configured
  // so Admin Portal grants show on every page, every serverless instance.
  await ensureDurableHydrated();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <NativeAppBoot />
        <PwaRegister />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingBackButton />
        <DonateMascotFloat />
        <MascotQuipPopup />
        <ThemeMusicPlayer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
