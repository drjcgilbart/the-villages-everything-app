import Link from "next/link";
import { SITE } from "@/lib/content";

/**
 * Homepage / site-wide launch band: share the web app, YouTube, Home Screen,
 * store apps (when live), and sister game teaser.
 * Flip SITE.stores.*.live in siteBrand.ts after each store page is public.
 */
export function LaunchPromo() {
  const playLive = SITE.stores.android.live;
  const iosLive = SITE.stores.ios.live && Boolean(SITE.stores.ios.url);

  return (
    <section className="launch-promo" aria-label="Get the app and share">
      <div className="shell launch-promo-inner">
        <div className="launch-promo-copy">
          <span className="kicker">Share · subscribe · play</span>
          <h2>Help neighbors find this (and the cart game)</h2>
          <p>
            Free, unofficial tools for The Villages — dining, Local Pros,
            forums, calendar, and more.{" "}
            {playLive || iosLive
              ? "Phone browser works; store apps are available below."
              : "Phone browser works today; store apps are rolling out."}{" "}
            Not affiliated with The Villages brand or developer.
          </p>
        </div>
        <div className="launch-promo-actions">
          {playLive ? (
            <a
              className="btn btn-primary"
              href={SITE.stores.android.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it on Google Play
            </a>
          ) : null}
          {iosLive ? (
            <a
              className="btn btn-primary"
              href={SITE.stores.ios.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on the App Store
            </a>
          ) : null}
          <a
            className={playLive || iosLive ? "btn btn-ghost" : "btn btn-primary"}
            href={SITE.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube channel
          </a>
          <Link href="/local-pros" className="btn btn-ghost">
            Local Pros
          </Link>
          <Link href="/dining" className="btn btn-ghost">
            Rate dining
          </Link>
          <Link href="/donate" className="btn btn-ghost hide-in-native-app">
            Buy me a cup of Joe
          </Link>
          <a href="/golf-cart-hero/" className="btn btn-ghost">
            Play Golf Cart Hero
          </a>
        </div>
        <div className="launch-promo-tips">
          <div className="launch-promo-tip">
            <strong>{playLive ? "Android app" : "Add to Home Screen"}</strong>
            <span>
              {playLive ? (
                <>
                  Install from Google Play (
                  <a
                    href={SITE.stores.android.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    open listing
                  </a>
                  ). iPhone: still use Safari Share → Add to Home Screen until
                  the App Store listing is live.
                </>
              ) : (
                <>
                  iPhone: Safari Share → Add to Home Screen. Android: Chrome
                  menu → Install app / Add to Home screen. Feels like an app
                  before the stores finish review.
                </>
              )}
            </span>
          </div>
          <div className="launch-promo-tip">
            <strong>Share one link</strong>
            <span>
              thevillageseverythingapp.com — that&apos;s the main URL.{" "}
              {playLive
                ? "Android friends can also use the Google Play button above."
                : "Store links will appear here as soon as each store is public."}
            </span>
          </div>
          <div className="launch-promo-tip">
            <strong>Sister game</strong>
            <span>
              Free to play:{" "}
              <a href="/golf-cart-hero/" className="text-link">
                The Villages Golf Cart Hero
              </a>{" "}
              — Mario Kart energy on the cart paths. Tips optional. Not
              affiliated with The Villages® brand.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
