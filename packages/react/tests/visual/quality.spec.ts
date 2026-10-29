import { test, expect } from "@playwright/test";

for (const theme of ["light", "dark"])
  for (const dir of ["ltr", "rtl"])
    for (const density of ["comfortable", "compact"]) {
      test(`real component styles and targets: ${theme} ${dir} ${density}`, async ({
        page,
      }) => {
        await page.goto(
          `/visual/?theme=${theme}&dir=${dir}&density=${density}`,
        );
        await expect(
          page.getByRole("heading", {
            name: "SIS component library",
            exact: true,
          }),
        ).toBeVisible();
        expect(
          await page
            .locator("html")
            .evaluate((node) =>
              getComputedStyle(node)
                .getPropertyValue("--sys-color-text-primary")
                .trim(),
            ),
        ).not.toBe("");
        await expect(
          page.getByRole("button", { name: "Primary action", exact: true }),
        ).toHaveCSS("min-height", density === "compact" ? "44px" : "48px");
        const targets = page.locator(
          ".sis-pagination-button:not([disabled]), .sis-menu-trigger, .sis-tab, .sis-choice, .sis-dialog-close, .sis-citation",
        );
        for (const target of await targets.all()) {
          const bounds = await target.boundingBox();
          if (bounds) {
            expect(bounds.height).toBeGreaterThanOrEqual(44);
            expect(bounds.width).toBeGreaterThanOrEqual(44);
          }
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      });
    }

test("menu, tooltip, uploader, and dialog work with keyboard and pointer", async ({
  page,
}) => {
  await page.goto("/visual/?theme=light");
  const actions = page.getByRole("button", { name: "Actions", exact: true });
  await actions.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Edit", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(actions).toBeFocused();
  const enroll = page
    .getByRole("button", { name: "Enroll", exact: true })
    .first();
  await enroll.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toBeHidden();
  await page
    .getByLabel("Attach transcript", { exact: true })
    .setInputFiles({
      name: "transcript.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("sample"),
    });
  await expect(page.getByText("transcript.pdf", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Remove transcript.pdf" }).click();
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Example dialog" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("tooltip remains inside a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/visual/?theme=light");
  const enroll = page
    .getByRole("button", { name: "Enroll", exact: true })
    .first();
  await enroll.focus();
  const bounds = await page.getByRole("tooltip").boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(8);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(312);
});
