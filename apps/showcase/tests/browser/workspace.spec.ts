import { test, expect } from "@playwright/test";
import axe from "axe-core";

test("mobile appearance control retains a full touch target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#gallery");
  const target = await page
    .locator('summary[aria-label="Appearance controls"]')
    .boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
});

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
  const overlayZ = await page
    .locator(".sis-dialog-overlay")
    .evaluate((node) => getComputedStyle(node).zIndex);
  const sidebarZ = await page
    .locator(".sis-sidebar")
    .evaluate((node) => getComputedStyle(node).zIndex);
  expect(Number(overlayZ)).toBeGreaterThan(Number(sidebarZ));
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

for (const theme of ["light", "dark"])
  for (const dir of ["ltr", "rtl"])
    for (const density of ["comfortable", "compact"]) {
      test(`gallery visual ${theme} ${dir} ${density}`, async ({ page }) => {
        await page.goto(
          `/?theme=${theme}&dir=${dir}&density=${density}#gallery`,
        );
        await page.evaluate(() => document.fonts.ready);
        await expect(
          page.getByRole("group", { name: "Component family" }),
        ).toBeVisible();
        await expect(page).toHaveScreenshot(
          `gallery-${theme}-${dir}-${density}.png`,
          { fullPage: true },
        );
      });
    }

test("component gallery connects filtering, numeric validation, uploads, and navigation", async ({
  page,
}) => {
  await page.goto("/#gallery");
  const families = page.getByRole("group", { name: "Component family" });
  await families.getByRole("button", { name: "Data", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Filter sample students", exact: true })
    .fill("Salma");
  await expect(
    page.getByRole("cell", { name: "Salma Hassan", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Omar Khaled", exact: true }),
  ).toHaveCount(0);
  await families.getByRole("button", { name: "Inputs", exact: true }).click();
  await page
    .getByRole("spinbutton", { name: "Credit hours", exact: true })
    .fill("25");
  expect(
    await page
      .getByRole("spinbutton", { name: "Credit hours", exact: true })
      .evaluate((node: HTMLInputElement) => node.validity.rangeOverflow),
  ).toBe(true);
  await page.getByLabel("Attach transcript", { exact: true }).setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("notes"),
  });
  await expect(
    page.getByRole("alert").filter({ hasText: "not an accepted file type" }),
  ).toBeVisible();
  await page.getByLabel("Attach transcript", { exact: true }).setInputFiles({
    name: "transcript.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("sample"),
  });
  await expect(page.getByText("transcript.pdf", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Remove transcript.pdf", exact: true })
    .click();
  await families
    .getByRole("button", { name: "Navigation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Course actions", exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: "View details", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", {
    name: "Course details",
    exact: true,
  });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Course actions", exact: true }),
  ).toBeFocused();
});

for (const route of [
  "overview",
  "students",
  "courses",
  "assistant",
  "settings",
  "gallery",
]) {
  test(`large text and narrow layout: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/#${route}`);
    await page.evaluate(
      () => (document.documentElement.style.fontSize = "200%"),
    );
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll("main *")]
        .filter(
          (node) =>
            node.getBoundingClientRect().right > innerWidth + 1 &&
            node.getBoundingClientRect().width > 0 &&
            !node.closest(
              ".sis-record-table-wrap,.sis-record-tabs,.sis-chart-scroll",
            ),
        )
        .slice(0, 16)
        .map((node) => ({
          tag: node.tagName,
          cls: node.className,
          width: node.getBoundingClientRect().width,
          right: node.getBoundingClientRect().right,
          text: node.textContent?.slice(0, 70),
        })),
    }));
    expect(layout.scroll, JSON.stringify(layout)).toBeLessThanOrEqual(
      layout.width,
    );
  });
}
