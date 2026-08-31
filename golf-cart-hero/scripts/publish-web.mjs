/**
 * Production-build the game at /golf-cart-hero/ and copy it into
 * the hub public folder so the Everything App can embed it.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = resolve(root, "../public/golf-cart-hero");

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx.cmd", ["tsc", "--noEmit"]);
run("npx.cmd", ["vite", "build", "--base", "/golf-cart-hero/"]);

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
cpSync(resolve(root, "dist"), dest, { recursive: true });
console.log(`Published game → ${dest}`);
