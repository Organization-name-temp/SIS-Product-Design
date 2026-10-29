import { test } from "node:test";
import assert from "node:assert/strict";
import preset from "../dist/tailwind-preset.js";
import { readFile } from "node:fs/promises";
test("Tailwind durations exclude token metadata", () => {
  assert.ok(
    Object.keys(preset.theme.extend.transitionDuration).every(
      (key) => !key.startsWith("$"),
    ),
  );
});
test("component shape and opacity roles come from canonical tokens", async () => {
  const css = await readFile(
    new URL("../dist/sis-tokens.css", import.meta.url),
    "utf8",
  );
  for (const [file, path, prefix] of [
    ["sis-radius.tokens.json", ["sys", "radius"], "sys-radius-"],
    ["sis-opacity.tokens.json", ["sys", "opacity"], "sys-opacity-"],
  ]) {
    let data = JSON.parse(
      await readFile(
        new URL(`../../../foundations/${file}`, import.meta.url),
        "utf8",
      ),
    );
    for (const key of path) data = data[key];
    for (const [key, token] of Object.entries(data))
      assert.ok(css.includes(`--${prefix}${key}: ${token.$value};`));
  }
});
test("every component CSS variable exists in the token bundle", async () => {
  const { readdir } = await import("node:fs/promises");
  const css = await readFile(
    new URL("../dist/sis-tokens.css", import.meta.url),
    "utf8",
  );
  const declared = new Set(
    [...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]),
  );
  const required = new Set();
  const folder = new URL("../../react/src/styles/", import.meta.url);
  for (const file of await readdir(folder))
    if (file.endsWith(".css")) {
      const source = await readFile(new URL(file, folder), "utf8");
      for (const match of source.matchAll(
        /var\((--(?:sys|ref|cmp)-[a-z0-9-]+)/gi,
      ))
        required.add(match[1]);
    }
  assert.deepEqual(
    [...required].filter((name) => !declared.has(name)).sort(),
    [],
  );
});
