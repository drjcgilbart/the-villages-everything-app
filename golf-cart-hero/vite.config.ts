import { defineConfig } from "vite";
import { viteDonatePlugin } from "./server/viteDonatePlugin.mjs";

export default defineConfig({
  plugins: [viteDonatePlugin()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: "es2022",
  },
});
