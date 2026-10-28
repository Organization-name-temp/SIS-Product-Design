import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(
  readFileSync(new URL("../../src/data/catalog.json", import.meta.url), "utf8"),
) as { id: string; group: string; specimens: { id: string }[] }[];

async function openFoundation(
  page: Page,
  item: string,
  extra: Record<string, string> = {},
) {
  const params = new URLSearchParams({
    item,
    embed: "1",
    theme: "light",
    lang: "en",
    ...extra,
  });
  await page.goto(`/?${params}`);
  await expect(page.locator(".embed-view")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          localStorage.setItem("foundation-last-copy", value);
        },
      },
    });
  });
});

test("colors calculate contrast, filter roles, copy approved values, and inspect alias layers", async ({
  page,
}) => {
  await openFoundation(page, "colors");
  await expect(page.locator(".fd-ratio")).toContainText("17.72:1");
  await page
    .getByLabel("Foreground", { exact: true })
    .selectOption("bg-surface");
  await expect(page.locator(".fd-ratio")).toContainText("1.00:1");
  await expect(page.locator(".fd-ratio")).toContainText(
    "Normal text fails AA.",
  );
  await page
    .getByLabel("Preview text", { exact: true })
    .fill("Student record CS101");
  await expect(page.locator(".fd-contrast-preview")).toHaveText(
    "Student record CS101",
  );
  await page
    .getByRole("button", { name: "Copy brand.500 #EA232B", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("foundation-last-copy")),
    )
    .toBe("#EA232B");
  await page.getByLabel("Find a role or value").fill("chart-7");
  await expect(page.locator(".fd-semantic-row")).toHaveCount(1);
  await page.locator(".fd-semantic-row").click();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("foundation-last-copy")),
    )
    .toContain("--sys-color-chart-7");
  await page
    .getByLabel("Inspect a component alias")
    .selectOption("field-border-focus");
  await expect(page.locator(".fd-token-chain")).toContainText(
    "--cmp-field-border-focus",
  );
  await expect(page.locator(".fd-token-chain")).toContainText(
    "--sys-color-input-focus-border",
  );
  await expect(page.locator(".fd-chart-color")).toHaveCount(8);
  await page
    .getByRole("button", { name: "Success", exact: false })
    .filter({ has: page.locator("code") })
    .click();
  await expect(page.getByLabel("Foreground", { exact: true })).toHaveValue(
    "success-text",
  );
});

test("typography renders every role and all loaded families with shared editable text", async ({
  page,
}) => {
  await openFoundation(page, "typography");
  await expect(page.locator(".fd-type-row")).toHaveCount(10);
  await expect(page.locator(".fd-font-card")).toHaveCount(1);
  await expect(page.getByText("Font available", { exact: true })).toHaveCount(1);
  await expect(page.locator(".fd-font-weight")).toHaveCount(4);
  await page
    .getByLabel("Comparison text")
    .fill("Émilie · الجامعة · CS101 · 2026");
  for (const row of await page.locator(".fd-type-sample").all())
    await expect(row).toHaveText("Émilie · الجامعة · CS101 · 2026");
  const families = await page
    .locator(".fd-font-card")
    .evaluateAll((cards) =>
      cards.map((card) => getComputedStyle(card).fontFamily),
    );
  expect(families[0]).toContain("IBM Plex Sans Arabic");
  await openFoundation(page, "typography", { variant: "long-content" });
  await expect(page.locator(".fd-type-sample").first()).toHaveText(
    /University registration.*University registration.*University registration/,
  );
});

test("spacing measures every value and switches padding, gaps, stacking, and density samples", async ({
  page,
}) => {
  await openFoundation(page, "spacing");
  await expect(page.locator(".fd-spacing-row")).toHaveCount(11);
  await page
    .getByLabel("Container padding", { exact: true })
    .selectOption("32");
  await page.getByLabel("Gap between elements").selectOption("24");
  await page.getByLabel("Composition", { exact: true }).selectOption("stacked");
  await expect(page.locator(".fd-padding-stage")).toHaveCSS(
    "padding-top",
    "32px",
  );
  await expect(page.locator(".fd-padding-content")).toHaveCSS("gap", "24px");
  await expect(page.locator(".fd-padding-content")).toHaveCSS(
    "flex-direction",
    "column",
  );
  const inputSizes = await page
    .locator(".fd-density-card input")
    .evaluateAll((inputs) =>
      inputs.map((input) => ({
        font: getComputedStyle(input).fontSize,
        minimum: getComputedStyle(input).minHeight,
      })),
    );
  expect(inputSizes).toEqual([
    { font: "16px", minimum: "48px" },
    { font: "16px", minimum: "44px" },
  ]);
  await openFoundation(page, "spacing", { variant: "stacked" });
  await expect(page.getByLabel("Composition", { exact: true })).toHaveValue(
    "stacked",
  );
});

test("grid presets change columns and long content scrolls only inside its own region", async ({
  page,
}) => {
  await openFoundation(page, "grid");
  for (const [name, columns] of [
    ["Narrow", "4"],
    ["Medium", "8"],
    ["Wide", "12"],
  ]) {
    await page.getByRole("button", { name: new RegExp(`^${name} ·`) }).click();
    await expect(page.locator(".fd-grid-viewport")).toHaveAttribute(
      "data-columns",
      columns,
    );
    await expect(page.locator(".fd-grid-overlay > span")).toHaveCount(
      Number(columns),
    );
  }
  await page.getByLabel("Show columns").uncheck();
  await expect(page.locator(".fd-grid-overlay")).toHaveCount(0);
  await page.getByLabel("Wrap long text").uncheck();
  await expect(page.locator(".fd-overflow-stage")).toHaveCSS(
    "white-space",
    "nowrap",
  );
  expect(
    await page
      .locator(".fd-overflow-stage")
      .evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  await page.getByLabel("Wrap long text").check();
  await expect(page.locator(".fd-overflow-stage")).toHaveCSS(
    "white-space",
    "normal",
  );
});

test("borders show selected and invalid cues and move keyboard focus to the field", async ({
  page,
}) => {
  await openFoundation(page, "borders");
  await expect(page.locator(".fd-corner-specimen")).toHaveCount(5);
  await expect(page.locator(".fd-border-purposes > div")).toHaveCount(4);
  await page.locator(".fd-selection-card").click();
  await expect(page.locator(".fd-selection-card")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByLabel("Invalid state", { exact: true }).check();
  await expect(page.getByLabel("Course code", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator(".fd-invalid-message")).toContainText(
    "Review this course code.",
  );
  await page
    .getByRole("button", { name: "Focus the field", exact: true })
    .click();
  await expect(page.getByLabel("Course code", { exact: true })).toBeFocused();
  await openFoundation(page, "borders", { state: "selected" });
  await expect(page.locator(".fd-selection-card")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await openFoundation(page, "borders", { state: "invalid" });
  await expect(page.getByLabel("Course code", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("icons search real names, expose empty results, download settings, and follow reading direction", async ({
  page,
}) => {
  await openFoundation(page, "icons");
  await page.getByLabel("Search icon names or meanings").fill("CalendarDays");
  await expect(page.locator(".fd-icon-tile")).toHaveCount(1);
  await page.locator(".fd-icon-tile").click();
  await page.getByLabel("Visible icon size").selectOption("24");
  await expect(page.locator(".fd-icon-tile svg")).toHaveAttribute(
    "width",
    "24",
  );
  await page
    .getByRole("button", { name: "Save selected icon locally", exact: true })
    .click();
  await expect(
    page.getByText("Saved locally: CalendarDays", { exact: true }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download icon settings", exact: true })
    .click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "lucide-icon-sample.json",
  );
  await page
    .getByLabel("Sample direction", { exact: true })
    .selectOption("rtl");
  await expect(
    page
      .getByRole("button", { name: "Next sample", exact: true })
      .locator("svg"),
  ).toHaveClass(/lucide-arrow-left/);
  await page.getByRole("button", { name: "Next sample", exact: true }).click();
  await expect(page.getByText("Sample 2", { exact: true })).toBeVisible();
  await openFoundation(page, "icons", { state: "no-results" });
  await expect(
    page.getByText("No icon matches this search.", { exact: true }),
  ).toBeVisible();
});

test("elevation opens dropdowns, nested dialogs, drawers, and a real sticky scroll region", async ({
  page,
}) => {
  await openFoundation(page, "elevation");
  await page
    .getByRole("button", { name: "Sample actions", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Inspect record", exact: true })
    .click();
  await expect(page.locator(".result-box")).toHaveText("Inspect record");
  await expect(page.locator(".fd-sticky-header")).toHaveCSS(
    "position",
    "sticky",
  );
  await page.getByLabel("Keep the header visible while scrolling").uncheck();
  await expect(page.locator(".fd-sticky-header")).toHaveCSS(
    "position",
    "static",
  );
  await page
    .getByRole("button", { name: "Open dialog and backdrop", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "High elevation dialog",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByLabel("Review note", { exact: true })
    .fill("Layer review complete");
  await dialog
    .getByRole("button", { name: "Inspect a second dialog layer", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Second dialog layer", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Second dialog layer", exact: true }),
  ).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Save sample note", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".result-box")).toHaveText("Layer review complete");
  await page
    .getByRole("button", { name: "Open sample drawer", exact: true })
    .click();
  const drawer = page.getByRole("dialog", {
    name: "Sample review drawer",
    exact: true,
  });
  await drawer
    .getByLabel("Review note", { exact: true })
    .fill("Drawer review complete");
  await drawer
    .getByRole("button", { name: "Apply sample note", exact: true })
    .click();
  await expect(page.locator(".result-box")).toHaveText(
    "Drawer review complete",
  );
});

test("motion replays approved samples, removes motion, and preserves immediate feedback and theme changes", async ({
  page,
}) => {
  await openFoundation(page, "motion");
  await page
    .getByRole("button", { name: "Replay all samples", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Replay 1" }),
  ).toBeVisible();
  await page.getByLabel("Reduce motion", { exact: true }).check();
  expect(
    await page
      .locator(".fd-motion-dot")
      .evaluateAll((dots) =>
        dots.every((dot) => getComputedStyle(dot).animationDuration === "0s"),
      ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Open the 240ms panel", exact: true })
    .click();
  await expect(page.locator(".fd-motion-presence").nth(1)).toHaveAttribute(
    "data-open",
    "true",
  );
  await page
    .getByRole("button", { name: "Close the 240ms panel", exact: true })
    .click();
  await expect(page.locator(".fd-motion-presence").nth(1)).toHaveAttribute(
    "data-open",
    "false",
  );
  await page
    .getByRole("button", { name: "Show pending feedback", exact: true })
    .click();
  await expect(page.locator(".result-box").first()).toHaveText(
    "Pending feedback appears immediately.",
  );
  await page
    .getByRole("button", { name: "Confirm sample", exact: true })
    .click();
  await expect(page.locator(".result-box").first()).toHaveText(
    "The result is confirmed immediately.",
  );
  await page
    .getByRole("button", {
      name: "Switch sample theme immediately",
      exact: true,
    })
    .click();
  await expect(page.locator(".fd-immediate-theme")).toContainText(
    "Dark sample",
  );
  await expect(page.locator(".fd-immediate-theme")).toHaveCSS(
    "background-color",
    "rgb(24, 24, 27)",
  );
  await openFoundation(page, "motion", { state: "pending" });
  await expect(page.locator(".result-box").first()).toHaveText(
    "Pending feedback appears immediately.",
  );
});

test("accessibility validates the form, grows long labels, and keeps international digits in Arabic", async ({
  page,
}) => {
  await openFoundation(page, "accessibility");
  await page
    .getByRole("button", { name: "Confirm sample", exact: true })
    .click();
  const name = page.getByLabel("Student name", { exact: true });
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await name.fill("Émilie François");
  await page
    .getByRole("button", { name: "Confirm sample", exact: true })
    .click();
  await expect(page.locator(".result-box")).toHaveText(
    "Sample confirmed for Émilie François.",
  );
  await page.getByLabel("Use long labels", { exact: true }).check();
  await page
    .getByRole("combobox", { name: "Sample text scale", exact: true })
    .selectOption("200");
  await expect(page.locator(".fd-accessible-form")).toHaveCSS(
    "font-size",
    "32px",
  );
  await expect(
    page.getByLabel(
      "Full student name exactly as it appears on the university admission record",
      { exact: true },
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Announce sample result", exact: true })
    .click();
  await expect(page.locator(".result-box")).toHaveText(
    "Sample announcement 1: review complete.",
  );
  await openFoundation(page, "accessibility", { lang: "ar" });
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.locator(".fd-language-samples").innerText()).not.toMatch(
    /[\u0660-\u0669]/,
  );
  await expect(page.locator(".fd-language-samples")).toContainText(
    "0123456789",
  );
});

test("all named foundation specimens render in light English and dark Arabic without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const foundations = catalog.filter((entry) => entry.group === "Foundations");
  for (const presentation of [
    { theme: "light", lang: "en" },
    { theme: "dark", lang: "ar" },
  ]) {
    for (const entry of foundations) {
      await openFoundation(page, entry.id, presentation);
      for (const specimen of entry.specimens)
        await expect(
          page.locator(`[data-specimen="${specimen.id}"]`).first(),
        ).toBeAttached();
      expect(
        await page
          .locator(".embed-view svg")
          .evaluateAll((icons) =>
            icons.every((icon) =>
              ["16", "20", "24"].includes(icon.getAttribute("width") ?? ""),
            ),
          ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
