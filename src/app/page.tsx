import Image from "next/image";
import Link from "next/link";
import { PalmFloat, SunBurst, WaveDivider } from "@/components/Decor";
import { DonateMascot } from "@/components/DonateMascot";
import { VillagesWeatherWidget } from "@/components/VillagesWeatherWidget";
import { SITE } from "@/lib/content";
import { MAIN_TOPICS } from "@/lib/topics";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <VillagesWeatherWidget />

      <section className="hero hub-hero">
        <SunBurst className="hero-sun" />
        <PalmFloat className="hero-palm-left" />
        <PalmFloat className="hero-palm-right" />

        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="kicker">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/graphics/cart-icon.svg" alt="" className="kicker-icon" />
              Largest active retirement plot twist on Earth
            </span>
            <h1>
              The Villages <em>everything</em> app
            </h1>
            <p className="subtitle">{SITE.subtitle}</p>
            <div className="hero-actions">
              <Link href="/my-village" className="btn btn-primary">
                Browse The Villages
              </Link>
              <Link href="/dining" className="btn btn-ghost">
                Feed me
              </Link>
              <Link href="/forums" className="btn btn-ghost">
                Forums
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-frame">
              <Image
                src="/graphics/hero-cart-v4.jpg"
                alt="Whimsical illustration of life in The Villages, Florida"
                width={960}
                height={540}
                className="hero-photo"
                priority
              />
              <div className="hero-photo-caption">
                Official mascot energy: cart first, questions later.
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="shell section themes-section">
        <div className="section-head">
          <div>
            <h2>The main-event circus</h2>
            <p>
              Whimsical on purpose. Useful on accident. (Mostly on purpose.)
              Pick a lane — or a cart path.
            </p>
          </div>
        </div>
        <div className="themes-strip themes-graphic hub-main-topic-grid">
          {MAIN_TOPICS.map((t) => (
            <Link key={t.href} href={t.href} className="theme-card">
              <div className="theme-card-art">
                <Image
                  src={t.image}
                  alt=""
                  width={640}
                  height={640}
                  className="theme-card-img"
                />
              </div>
              <div className="theme-card-body">
                <strong>{t.label}</strong>
                <span>{t.blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section hub-useful-section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <aside className="hero-card hub-useful-card">
            <h2>Currently useful…</h2>
            <p>
              Villages tools up top. Personal reboot story tucked away under My
              Retirement Reboot — so the app stays about The Villages, not just
              me.
            </p>
            <div className="hub-quick-list">
              {MAIN_TOPICS.map((q) => (
                <Link key={q.href} href={q.href} className="hub-quick-link">
                  <strong>{q.label}</strong>
                  <span>Go →</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section donate-home-band" style={{ paddingTop: 0 }}>
        <div className="shell">
          <DonateMascot variant="hero" />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell about-grid">
          <div className="about-panel">
            <span className="kicker">Optional side quest</span>
            <h2 style={{ marginTop: "0.35rem" }}>My Retirement Reboot</h2>
            <p style={{ color: "var(--muted)" }}>
              Blog, photos, and videos live here — plus the{" "}
              <a
                href={SITE.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {SITE.youtube.title}
              </a>{" "}
              YouTube channel. Visit when you want the plot twist, not when you
              need a restaurant rating.
            </p>
            <div className="hero-actions">
              <Link href="/about" className="btn btn-primary btn-sm">
                Open My Retirement Reboot
              </Link>
              <a
                href={SITE.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                YouTube
              </a>
            </div>
          </div>
          <div className="quote-box">
            “I didn&apos;t come here to be perfect. I came here to reboot —
            loudly, sunnily, and with better snacks. The hub is just the map.”
          </div>
        </div>
      </section>

      <section className="banner-band">
        <div className="shell">
          <div className="banner-frame">
            <Image
              src="/graphics/banner-sunset.jpg"
              alt="Illustrated Florida retirement sunset with palm trees and a quiet pond"
              width={1400}
              height={788}
              className="banner-img"
            />
            <div className="banner-copy">
              <p className="banner-kicker">Scene from the plot twist</p>
              <h2>Sunsets, carts, and questionable life choices</h2>
              <p>
                Original artwork — no stock photos, no corporate mascots, just
                Florida chaos in watercolor-adjacent pixels.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
