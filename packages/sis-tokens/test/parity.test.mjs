import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const varNames = (css) => new Set([...css.matchAll(/--[a-z0-9-]+(?=\s*:)/gi)].map((m) => m[0]));

test("package css carries every variable the workbench generator emits", async () => {
  const pkg = varNames(await readFile(new URL("../dist/sis-tokens.css", import.meta.url), "utf8"));
  const generator = [
    "../../../sis-foundations-prototype/src/palette.css",
    "../../../sis-foundations-prototype/src/foundations.css",
    "../../../sis-foundations-prototype/src/typography.css",
    "../../../sis-foundations-prototype/src/motion.css",
  ];
  const missing = [];
  for (const file of generator) {
    const css = await readFile(new URL(file, import.meta.url), "utf8");
    for (const name of varNames(css)) {
      if (!pkg.has(name)) missing.push(`${file}: ${name}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("package css agrees with generator values for spot-checked roles", async () => {
  const pkg = await readFile(new URL("../dist/sis-tokens.css", import.meta.url), "utf8");
  for (const expected of [
    "--sys-color-action-primary-bg: var(--ref-color-brand-600);",
    "--sys-color-bg-canvas: var(--ref-color-neutral-50);",
    "--cmp-button-primary-background: var(--sys-color-action-primary-bg);",
  ]) {
    assert.ok(pkg.includes(expected), `missing: ${expected}`);
  }
});

test("tokens studio json is valid DTCG with alias leaves", async () => {
  const doc = JSON.parse(await readFile(new URL("../dist/tokens-studio.json", import.meta.url), "utf8"));
  assert.ok(doc.ref.color.brand[600].$value === "#CD1722");
  assert.equal(doc.sys.color.light["bg-canvas"].$value, "{ref.color.neutral.50}");
});
