import Link from "next/link";
import { MAIN_TOPICS } from "@/lib/topics";
import { SITE } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-art" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/divider-waves.svg" alt="" />
      </div>
      <div className="shell footer-inner">
        <div className="footer-brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/graphics/mascot-logo.jpg"
            alt=""
            className="footer-mascot"
            width={56}
            height={56}
          />
          <div>
            <strong className="footer-brand">{SITE.name}</strong>
            <p className="footer-sub">{SITE.subtitle}</p>
          </div>
        </div>

        <div className="footer-groups">
          <div className="footer-group">
            <strong>Main topics</strong>
            <div className="footer-group-links">
              {MAIN_TOPICS.map((t) => (
                <Link key={t.href} href={t.href}>
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="footer-group">
            <strong>My Space</strong>
            <div className="footer-group-links">
              <Link href="/my-space">Dashboard</Link>
              <Link href="/yard-sale/login">Member sign-in</Link>
              <Link href="/yard-sale/dashboard">Yard sale tools</Link>
            </div>
          </div>
          <div className="footer-group">
            <strong>My Retirement Reboot</strong>
            <div className="footer-group-links">
              <Link href="/about">Overview</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/photos">Photos</Link>
              <Link href="/videos">Videos</Link>
              <Link href="/donate" className="hide-in-native-app">
                Buy me a cup of Joe
              </Link>
              <a href="/golf-cart-hero/">Golf Cart Hero</a>
            </div>
          </div>
        </div>

        {(SITE.stores.android.live ||
          (SITE.stores.ios.live && SITE.stores.ios.url)) && (
          <p className="footer-store-links">
            Get the app:{" "}
            {SITE.stores.android.live ? (
              <a
                href={SITE.stores.android.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Google Play
              </a>
            ) : null}
            {SITE.stores.android.live &&
            SITE.stores.ios.live &&
            SITE.stores.ios.url
              ? " · "
              : null}
            {SITE.stores.ios.live && SITE.stores.ios.url ? (
              <a
                href={SITE.stores.ios.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                App Store
              </a>
            ) : null}
          </p>
        )}

        <p className="footer-note">
          Original site graphics created for this project (not stock photos). Not
          affiliated with The Villages® brand or developer. Just one person
          living the plot twist — and building a map for the rest of us. ©{" "}
          {new Date().getFullYear()}{" "}
          ·{" "}
          <Link href="/privacy" className="text-link">
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
