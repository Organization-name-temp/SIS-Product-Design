import { chromium } from "@playwright/test";
import axe from "axe-core";
import { readFile, writeFile, mkdir } from "node:fs/promises";
const catalog = JSON.parse(await readFile("src/data/catalog.json", "utf8"));
await mkdir("qa", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1024 },
  deviceScaleFactor: 1,
});
const report = { errors: [], violations: [], overflow: [], samples: [] };
page.on("pageerror", (e) => report.errors.push(e.message));
for (const entry of catalog) {
  await page.goto(
    `http://localhost:4173/?embed=1&item=${entry.id}&theme=light&lang=en`,
  );
  await page.locator("main").waitFor();
  await page.addScriptTag({ content: axe.source });
  const result = await page.evaluate(
    async () =>
      await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
  );
  for (const violation of result.violations)
    report.violations.push({
      page: entry.id,
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(
    `http://localhost:4173/?embed=1&item=${entry.id}&theme=dark&lang=ar&density=compact`,
  );
  await page.locator("main").waitFor();
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("main *")]
      .filter(
        (el) =>
          el.getBoundingClientRect().right > 322 &&
          getComputedStyle(el).position !== "fixed",
      )
      .slice(0, 5)
      .map((el) => ({ tag: el.tagName, cls: el.className })),
  }));
  if (overflow.width > 320)
    report.overflow.push({ page: entry.id, ...overflow });
  await page.setViewportSize({ width: 1440, height: 1024 });
}
for (const [name, query, width, height] of [
  ["desktop", "item=colors&theme=light&lang=en", 1440, 1024],
  ["arabic-dark", "item=colors&theme=dark&lang=ar", 1440, 1024],
  ["mobile", "item=colors&theme=dark&lang=ar", 320, 900],
  ["table", "item=tables&theme=light&lang=en", 1440, 1024],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(`http://localhost:4173/?${query}`);
  await page.locator("iframe").waitFor();
  await page.frameLocator("iframe").locator("main").waitFor();
  await page.evaluate(async () => await document.fonts.ready);
  await page.screenshot({ path: `qa/${name}-before.png` });
  report.samples.push({ name, width, height, path: `qa/${name}-before.png` });
}
await writeFile("qa/audit-before.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      errors: report.errors,
      violations: report.violations.map((x) => ({
        page: x.page,
        id: x.id,
        impact: x.impact,
      })),
      overflow: report.overflow,
    },
    null,
    2,
  ),
);
await browser.close();
