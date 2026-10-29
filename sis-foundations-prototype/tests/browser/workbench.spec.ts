import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { CatalogEntry } from "../../src/catalog";

test("toolbar and disclosure controls retain full touch targets", async ({ page }) => {
  await page.goto("/?item=colors&tab=tokens&theme=light");
  const controls = await page.locator(".utility-control select, main summary").evaluateAll(nodes => nodes.map(node => ({width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height})));
  expect(controls.length).toBeGreaterThanOrEqual(4);
  expect(controls.every(control => control.width >= 44 && control.height >= 44)).toBe(true);
  await page.goto("/?item=navigation&tab=variants&theme=light");
  const breadcrumbs = await page.locator(".component-breadcrumb .component-link").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
  expect(breadcrumbs.length).toBeGreaterThan(0);
  expect(breadcrumbs.every(width => width >= 44)).toBe(true);
});
const catalog: CatalogEntry[] = JSON.parse(
  readFileSync(new URL("../../src/data/catalog.json", import.meta.url), "utf8"),
);
for (const entry of catalog) {
  test(`catalog: ${entry.id}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/?item=${entry.id}&theme=light&lang=en`);
    await expect(
      page.getByRole("heading", { name: entry.name.en, exact: true }).first(),
    ).toBeVisible();
    if (entry.group !== "Review") {
      const demo = page.frameLocator("iframe").first();
      await expect(demo.locator("main")).toBeVisible();
      await expect(demo.locator("main")).not.toContainText("being connected");
      const meta = entry as typeof entry & { specimens?: { id: string }[] };
      for (const specimen of meta.specimens || []) {
        await expect(
          demo.locator(`[data-specimen="${specimen.id}"]`).first(),
          `${entry.id}/${specimen.id}`,
        ).toBeAttached();
      }
    }
    expect(errors).toEqual([]);
  });
}
test('presentation changes preserve input; reset clears it',async({page})=>{
 await page.goto('/?item=fields&theme=light');const frame=page.frameLocator('iframe').first();const input=frame.getByRole('textbox').first();await input.fill('Retained sample');
 await page.getByLabel('Theme',{exact:true}).selectOption('dark');await page.getByLabel('Language',{exact:true}).selectOption('ar');await expect(input).toHaveValue('Retained sample');
 await page.getByLabel('الكثافة',{exact:true}).selectOption('compact');await page.getByLabel('العرض',{exact:true}).selectOption('360');await expect(input).toHaveValue('Retained sample');
 await page.getByLabel('قارن',{exact:true}).selectOption('density');await expect(page.locator('iframe:visible')).toHaveCount(2);await page.getByLabel('قارن',{exact:true}).selectOption('none');await expect(input).toHaveValue('Retained sample');
 await page.getByRole('button',{name:'إعادة ضبط',exact:true}).click();await expect(input).not.toHaveValue('Retained sample');expect(page.url()).not.toContain('Retained');
});
test("overlay focus enters, stays, and returns", async ({ page }) => {
  await page.goto("/?item=overlays&theme=light");
  const frame = page.frameLocator("iframe").first();
  const trigger = frame.getByRole("button", {
    name: "Edit record",
    exact: true,
  });
  await trigger.click();
  const dialog = frame.getByRole("dialog", {
    name: "Edit sample record",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox")).toBeFocused();
  for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
  expect(
    await dialog.evaluate((el) => el.contains(el.ownerDocument.activeElement)),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test('IBM Plex loads locally in Arabic with international digits',async({page})=>{
 await page.goto('/?item=typography&lang=ar&theme=dark');await expect(page.locator('html')).toHaveAttribute('dir','rtl');const text=await page.frameLocator('iframe').first().locator('main').innerText();expect(text).not.toMatch(/[\u0660-\u0669\u06f0-\u06f9]/);expect(await page.evaluate(async()=>{await document.fonts.load('400 16px "IBM Plex Sans Arabic"');return document.fonts.check('400 16px "IBM Plex Sans Arabic"');})).toBeTruthy();
});
test("320px layout contains app controls; drawer works", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/?item=colors&lang=ar&theme=dark");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page
    .getByRole("button", { name: "فتح التنقل", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "التنقل في الكتالوج" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "فتح التنقل", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "فتح التنقل", exact: true })
    .click();
  await page.getByRole("link", { name: "الخطوط", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "الخطوط", exact: true }),
  ).toBeVisible();
});
test("state preview uses approved hover and pressed colors inside the isolated frame", async ({
  page,
}) => {
  await page.goto("/?item=buttons&state=hover&theme=light");
  const demo = page.frameLocator("iframe").first();
  const button = demo.getByRole("button", { name: "Add course", exact: true });
  await expect(button).toHaveCSS("background-color", "rgb(171, 20, 32)");
  await page.getByLabel("State", { exact: true }).selectOption("pressed");
  await expect(button).toHaveCSS("background-color", "rgb(142, 22, 33)");
  await page.goto('/?item=fields&state=hover&theme=light');
  await expect(page.frameLocator('iframe').first().getByRole('textbox',{name:'Full name',exact:true})).toHaveCSS('border-color','rgb(82, 82, 91)');
});
test("downloads match canonical values; real clipboard copy works", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?item=exports&theme=light");
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Canonical color tokens", exact: false })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sis-ejust-palette.tokens.json");
  await page
    .getByRole("button", { name: "Copy token example", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "var(--sys-color-text-primary)",
  );
});
test("reduced motion and offline font weights preserve the foundation contract", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto("/?item=motion&theme=system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page
      .locator("html")
      .evaluate((el) =>
        getComputedStyle(el)
          .getPropertyValue("--sys-motion-duration-standard")
          .trim(),
      ),
  ).toBe("0ms");
  for (const family of ["IBM Plex Sans Arabic"])
    for (const weight of [400, 500, 600, 700])
      expect(
        await page.evaluate(
          async ({ family, weight }) => {
            await document.fonts.load(`${weight} 16px "${family}"`);
            return document.fonts.check(`${weight} 16px "${family}"`);
          },
          { family, weight },
        ),
      ).toBeTruthy();
});
test("theme comparison preserves the saved preference", async ({ page }) => {
  await page.goto("/?item=buttons&theme=light");
  await page.getByLabel("Compare", { exact: true }).selectOption("themes");
  await expect(page.locator("iframe:visible")).toHaveCount(2);
  expect(await page.evaluate(() => localStorage.getItem("sis.theme"))).toBe(
    "light",
  );
});
