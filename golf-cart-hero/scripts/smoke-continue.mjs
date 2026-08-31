/**
 * One-shot browser smoke for the continue-work slice:
 * menu sister-app link, start a race, Stop, Copy challenge.
 */
import { chromium } from "playwright";

const url = process.env.SMOKE_URL || "http://localhost:5173/";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));

try {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.locator("#btn-play").waitFor({ state: "attached", timeout: 45000 });

  const sisterHref = await page.locator(".footer-note a").first().getAttribute("href");
  if (sisterHref !== "https://www.thevillageseverythingapp.com") {
    throw new Error(`Sister-app href was ${sisterHref}`);
  }

  await page.locator("#btn-play").click({ force: true });
  await page.locator("#btn-continue").waitFor({ state: "attached", timeout: 15000 });
  await page.locator("#btn-continue").click({ force: true });
  await page.locator("#player-name").waitFor({ state: "attached", timeout: 15000 });
  await page.locator("#player-name").fill("SmokeTester");
  await page.locator("#btn-race").click({ force: true });
  await page.locator("#btn-stop-race").waitFor({ state: "attached", timeout: 20000 });

  await page.waitForTimeout(4200);
  await page.locator("#btn-stop-race").click({ force: true });
  await page.locator("#btn-share").waitFor({ state: "attached", timeout: 20000 });
  await page.waitForTimeout(150);
  await page.locator("#btn-share").click({ force: true });
  await page.waitForTimeout(400);

  const shareLabel = await page.locator("#btn-share").innerText();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  if (!clip.includes("Golf Cart Hero") || !clip.includes("thevillageseverythingapp.com/golf-cart-hero")) {
    throw new Error(`Challenge text missing: ${clip}`);
  }

  await page.locator("#btn-menu").click({ force: true });
  await page.locator("#btn-play").waitFor({ state: "attached", timeout: 10000 });

  if (errors.length) {
    throw new Error(`Page errors:\n${errors.join("\n")}`);
  }

  console.log("SMOKE_OK", {
    sisterHref,
    shareLabel,
    clip: clip.slice(0, 140),
  });
} catch (err) {
  await page.screenshot({ path: "smoke-fail.png", fullPage: true }).catch(() => {});
  throw err;
} finally {
  await browser.close();
}
