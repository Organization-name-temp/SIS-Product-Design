import { test, expect } from "@playwright/test";

const themes = ["light", "dark"] as const;
const dirs = ["ltr", "rtl"] as const;
const densities = ["comfortable", "compact"] as const;

for (const theme of themes) {
  for (const dir of dirs) {
    for (const density of densities) {
      test(`components render correctly in ${theme}, ${dir}, ${density}`, async ({ page }) => {
        await page.goto(`/visual/?theme=${theme}&dir=${dir}&density=${density}`);
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot(`components-${theme}-${dir}-${density}.png`, {
          fullPage: true,
        });
      });
    }
  }
}
