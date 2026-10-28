import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  use: {
    baseURL: "http://localhost:4677",
    viewport: { width: 430, height: 1400 },
  },
  webServer: {
    command: "npx vite visual --port 4677 --strictPort",
    url: "http://localhost:4677",
    reuseExistingServer: true,
    timeout: 60000,
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
});
