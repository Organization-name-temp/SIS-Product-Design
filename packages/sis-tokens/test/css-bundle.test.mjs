import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

test("the CSS bundle excludes DTCG metadata and external imports", async () => {
  const css = await readFile(new URL("../dist/sis-tokens.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /--[\w-]*\$/);
  assert.doesNotMatch(css, /@import/);
  assert.match(css, /--sys-motion-duration-fast:0ms/);
});
