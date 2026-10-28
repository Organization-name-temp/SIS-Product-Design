import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 3,
  use: {
    baseURL: "http://localhost:4680",
    viewport: { width: 1440, height: 1050 },
    reducedMotion: "reduce",
  },
  webServer: {
    command: "npm run dev -- --strictPort",
    url: "http://localhost:4680",
    reuseExistingServer: true,
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
});
