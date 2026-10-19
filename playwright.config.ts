import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

// Change the site in .env (PORTAL_URL). See docs/how-to-change.md.
const portalUrl = process.env.PORTAL_URL ?? "https://birlasoftfscdemo-dev-ed.develop.my.site.com";

export default defineConfig({
  testDir: "./tests",
  timeout: 240_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }], ["./src/report/heal-reporter.ts"]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: portalUrl,
    headless: process.env.HEADED === "1" ? false : true,
    screenshot: "on",
    trace: "on",
    video: "off",
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
  },
});
