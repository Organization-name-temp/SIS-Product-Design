import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  expect: { timeout: 6000 },
  use: {
    baseURL: "http://localhost:4173",
    viewport: { width: 1440, height: 1024 },
    headless: true,
    trace: "retain-on-failure",
  },
  workers: 2,
  reporter: [["list"], ["json", { outputFile: "qa/browser-results.json" }]],
});
