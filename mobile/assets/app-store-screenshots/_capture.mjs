import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const BASE = "https://www.thevillageseverythingapp.com";

const SHOTS = [
  { path: "/", file: "iphone-65-01-home.png", wait: "h1" },
  { path: "/dining", file: "iphone-65-02-dining.png", wait: ".restaurant-card", scroll: ".restaurant-card" },
  { path: "/town-squares", file: "iphone-65-03-town-squares.png", wait: ".ts-square-card", scroll: ".ts-square-card" },
  { path: "/calendar", file: "iphone-65-04-calendar.png", wait: ".events-cal-grid", scroll: ".events-cal-grid" },
];

const HIDE_CSS = `
  .mascot-quip-toggle, .mascot-quip-popup, .theme-music,
  .floating-nav-stack,
  [data-cookie], .cookie-banner, #cookie-banner {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

async function waitForImages(page) {
  await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve) => {
                const done = () => resolve();
                img.addEventListener("load", done, { once: true });
                img.addEventListener("error", done, { once: true });
                setTimeout(done, 8000);
              })
      )
    );
  });
}

async function dismissOverlays(page) {
  const labels = ["Accept", "I agree", "Got it", "OK", "Close", "Continue"];
  for (const label of labels) {
    const btn = page.getByRole("button", { name: label, exact: false });
    if (await btn.count()) {
      try {
        await btn.first().click({ timeout: 800 });
      } catch {
        /* ignore */
      }
    }
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1 VillagesEverythingApp/1.1",
  viewport: { width: 428, height: 926 },
  screen: { width: 428, height: 926 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "en-US",
  timezoneId: "America/New_York",
  colorScheme: "light",
});
const page = await context.newPage();
await page.setViewportSize({ width: 428, height: 926 });

for (const shot of SHOTS) {
  const url = BASE + shot.path;
  console.log("Capturing", url);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector(shot.wait, { timeout: 45000 });
  await page.addStyleTag({ content: HIDE_CSS });
  await dismissOverlays(page);
  if (shot.scroll) {
    await page.locator(shot.scroll).first().scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -72));
  }
  await waitForImages(page);
  await page.waitForTimeout(2000);
  const dest = path.join(OUT, shot.file);
  await page.screenshot({
    path: dest,
    type: "png",
    fullPage: false,
    animations: "disabled",
  });
  const box = page.viewportSize();
  console.log("Wrote", shot.file, "viewport", box);
}

await browser.close();
console.log("Done");
