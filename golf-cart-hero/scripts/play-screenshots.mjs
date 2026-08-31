import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../mobile/assets/play-screenshots");
mkdirSync(outDir, { recursive: true });

const url = "https://www.thevillageseverythingapp.com/golf-cart-hero/index.html";

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForSelector("h1", { timeout: 120000 });
// Art pack load
await page.waitForTimeout(8000);

await page.screenshot({
  path: resolve(outDir, "tablet-01-menu.png"),
  type: "png",
});

const play = page.locator("#btn-play");
if (await play.count()) {
  await play.click();
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: resolve(outDir, "tablet-02-areas.png"),
    type: "png",
  });
}

const cont = page.locator("#btn-continue");
if (await cont.count()) {
  await cont.click();
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: resolve(outDir, "tablet-03-select.png"),
    type: "png",
  });
}

await browser.close();
console.log("Wrote screenshots to", outDir);
