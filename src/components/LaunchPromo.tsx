import Link from "next/link";
import { SITE } from "@/lib/content";

/**
 * Homepage / site-wide launch band: share the web app, YouTube, Home Screen,
 * and sister game teaser. Update store URLs when Play / App Store go live.
 */
export function LaunchPromo() {
  return (
    <section className="launch-promo" aria-label="Get the app and share">
      <div className="shell launch-promo-inner">
        <div className="launch-promo-copy">
          <span className="kicker">Share · subscribe · play</span>
          <h2>Help neighbors find this (and the cart game)</h2>
          <p>
            Free, unofficial tools for The Villages — dining, Local Pros,
            forums, calendar, and more. Phone browser works today; store apps
            are rolling out. Not affiliated with The Villages brand or
            developer.
          </p>
        </div>
        <div className="launch-promo-actions">
          <a
            className="btn btn-primary"
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
          <Link href="/donate" className="btn btn-ghost">
            Buy me a cup of Joe
          </Link>
        </div>
        <div className="launch-promo-tips">
          <div className="launch-promo-tip">
            <strong>Add to Home Screen</strong>
            <span>
              iPhone: Safari Share → Add to Home Screen. Android: Chrome menu →
              Install app / Add to Home screen. Feels like an app before the
              stores finish review.
            </span>
          </div>
          <div className="launch-promo-tip">
            <strong>Share one link</strong>
            <span>
              thevillageseverythingapp.com — that&apos;s the only URL friends
              need right now.
            </span>
          </div>
          <div className="launch-promo-tip">
            <strong>Sister game</strong>
            <span>
              The Villages Golf Cart Hero — whimsical cart racing (coming to a
              public link soon; tips optional). Watch gameplay on the YouTube
              channel.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
