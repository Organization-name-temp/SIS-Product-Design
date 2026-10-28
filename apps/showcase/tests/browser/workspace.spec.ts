import { test, expect } from "@playwright/test";
import axe from "axe-core";

for (const theme of ["light", "dark"]) {
  for (const route of [
    "students",
    "courses",
    "assistant",
    "settings",
    "gallery",
  ]) {
    test(`${route} accessibility in ${theme}`, async ({ page }) => {
      await page.goto(`/?theme=${theme}#${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ content: axe.source });
      const violations = await page.evaluate(
        async () => (await (window as any).axe.run(document)).violations,
      );
      expect(
        violations.map((violation: any) => ({
          id: violation.id,
          nodes: violation.nodes.map((node: any) => node.target),
        })),
      ).toEqual([]);
    });
  }
}

for (const theme of ["light", "dark"]) {
  for (const dir of ["ltr", "rtl"]) {
    for (const density of ["comfortable", "compact"]) {
      test(`overview ${theme} ${dir} ${density}`, async ({ page }) => {
        await page.goto(`/?theme=${theme}&dir=${dir}&density=${density}`);
        await page.evaluate(() => document.fonts.ready);
        await expect(
          page.getByRole("heading", { name: "Registration overview" }),
        ).toBeVisible();
        await page.addScriptTag({ content: axe.source });
        const violations = await page.evaluate(
          async () =>
            (
              await (window as any).axe.run(document, {
                runOnly: {
                  type: "tag",
                  values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
                },
              })
            ).violations,
        );
        expect(
          violations.map((violation: any) => ({
            id: violation.id,
            nodes: violation.nodes.map((node: any) => node.target),
          })),
        ).toEqual([]);
        await expect(page).toHaveScreenshot(
          `overview-${theme}-${dir}-${density}.png`,
          { fullPage: true },
        );
      });
    }
  }
}

test("registration, keyboard focus, persistence, and CSV export", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "New registration",
    exact: true,
  });
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "New registration" });
  await dialog.getByLabel("Student name").fill("Nour Ahmed");
  await dialog.getByLabel("University email").fill("nour@ejust.edu.eg");
  await dialog.getByRole("button", { name: "Create registration" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Registration created for Nour Ahmed",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: /^Nour Ahmed/, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search students", exact: true })
    .fill("Nour");
  await page
    .getByRole("checkbox", { name: "Select Nour Ahmed", exact: true })
    .check();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export selected (1)", exact: true })
    .click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("sis-students-fall-2026.csv");
  const stream = await file.createReadStream();
  let content = "";
  for await (const chunk of stream!) content += chunk.toString();
  expect(content).toContain('"Nour Ahmed"');
  expect(content).not.toContain('"Omar Khaled"');
});

test("course filters and local assistant replies", async ({ page }) => {
  await page.goto("/#courses");
  await page.getByRole("checkbox", { name: "Available seats only" }).check();
  await expect(
    page.getByRole("button", { name: "View course CSE 301", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "View course MATH 201", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Course details" }),
  ).toContainText("Science Building · A204");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: /^Registrar assistant/ }).click();
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("How many seats in MATH 201?");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByRole("log")).toContainText("16 available seats");
  await page.getByRole("link", { name: "MATH 201 · Course catalog" }).click();
  await expect(
    page.getByRole("heading", { name: "Course catalog", exact: true }),
  ).toBeVisible();
});

test("appearance controls persist and system theme follows the browser", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Appearance controls").click();
  await page.getByLabel("Theme", { exact: true }).selectOption("dark");
  await page.getByLabel("Direction", { exact: true }).selectOption("rtl");
  await page.getByLabel("Density", { exact: true }).selectOption("compact");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await page.getByLabel("Appearance controls").click();
  await page.getByLabel("Theme", { exact: true }).selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  expect(
    await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).toBe("rgb(9, 9, 11)");
});

for (const width of [360, 834]) {
  test(`responsive workspace at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page).toHaveScreenshot(`responsive-${width}.png`, {
      fullPage: true,
    });
    if (width === 360) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(
        page.getByRole("dialog", { name: "SIS workspace" }),
      ).toBeVisible();
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Course catalog", exact: true })
        .click();
    } else
      await page
        .getByRole("link", { name: "Course catalog", exact: true })
        .click();
    await expect(
      page.getByRole("heading", { name: "Course catalog", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page).toHaveScreenshot(`courses-${width}.png`, {
      fullPage: true,
    });
  });
}
