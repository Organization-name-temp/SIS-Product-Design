import { readFile, readdir, stat } from "node:fs/promises";
import assert from "node:assert/strict";
const json = async (path) => JSON.parse(await readFile(path, "utf8"));
const catalog = await json("src/data/catalog.json");
const palette = await json("src/data/palette.json");
const contrast = await json("src/data/contrast.json");
import { legacyPalette, legacyTypography, legacyMotion } from "./dtcg.mjs";
const toLegacy = { palette: legacyPalette, typography: legacyTypography, motion: legacyMotion };
for(const [name,file]of [['palette','sis-ejust-palette.tokens.json'],['typography','sis-typography.tokens.json'],['motion','sis-motion.tokens.json'],['usage','sis-usage-guidance.json'],['decisions','sis-foundation-decisions.json']]){
  try{
    const canonical=JSON.parse(await readFile(new URL(`../../foundations/${file}`,import.meta.url),'utf8'));
    assert.deepEqual(await json(`src/data/${name}.json`),toLegacy[name]?toLegacy[name](canonical):canonical,`${name}: canonical source drift`);
  }
  catch(error){if(error.code!=='ENOENT')throw error;}
}
const expected = { Foundations: 9, Components: 16, Patterns: 10, Review: 3 };
const ids = new Set();
let specimenCount = 0;
for (const item of catalog) {
  assert(!ids.has(item.id), `Duplicate catalog ID: ${item.id}`);
  ids.add(item.id);
  assert(/^[a-z][a-z-]*$/.test(item.id), `Unstable ID: ${item.id}`);
  for (const key of ["name", "description"])
    for (const lang of ["en", "ar"])
      assert(item[key][lang]?.trim(), `${item.id}: missing ${key}.${lang}`);
  assert(
    item.states.length && item.variants.length && item.verification.length,
    `${item.id}: missing state, variant, or verification`,
  );
  assert(
    new Set(item.states).size === item.states.length,
    `${item.id}: duplicate states`,
  );
  if (item.group !== "Review") {
    assert(
      item.guidance?.length && item.accessibility?.length,
      `${item.id}: missing specimen documentation`,
    );
    assert(item.specimens?.length, `${item.id}: missing specimen inventory`);
    for (const specimen of item.specimens) {
      assert(
        specimen.id && specimen.name.en && specimen.name.ar,
        `${item.id}: incomplete specimen`,
      );
      specimenCount++;
    }
  }
}
for (const [group, count] of Object.entries(expected))
  assert.equal(
    catalog.filter((x) => x.group === group).length,
    count,
    `${group}: wrong page count`,
  );
for (const [theme, roles] of Object.entries(palette.themes)) {
  assert.deepEqual(
    Object.keys(roles).sort(),
    Object.keys(palette.themes.light).sort(),
    `${theme}: semantic role mismatch`,
  );
  for (const [role, ref] of Object.entries(roles)) {
    const [family, key] = ref.split(".");
    assert(
      palette.primitives[family]?.[key],
      `${theme}: unresolved ${role} -> ${ref}`,
    );
  }
}
for (const [name, ref] of Object.entries(palette.components))
  assert(
    palette.themes.light[typeof ref === "string" ? ref : ref.semantic],
    `Unresolved component alias ${name}`,
  );
const luminance = (hex) => {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};
for (const check of contrast.checks) {
  for (const [kind, token] of [
    ["foreground", check.foregroundToken],
    ["background", check.backgroundToken],
  ]) {
    const [f, k] = palette.themes[check.theme][token].split(".");
    assert.equal(
      check[kind],
      palette.primitives[f][k],
      `Stale contrast check: ${token}`,
    );
  }
  const a = luminance(check.foreground),
    b = luminance(check.background);
  assert(
    (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= check.minimum,
    `Contrast failure ${check.theme} ${check.foregroundToken}/${check.backgroundToken}`,
  );
}
const sourcePalette = await json(
  "public/exports/sis-ejust-palette.tokens.json",
);
assert.deepEqual(palette, sourcePalette, "Palette export drift");
assert.deepEqual(
  await json("src/data/typography.json"),
  await json("public/exports/sis-typography.tokens.json"),
  "Typography export drift",
);
const usage=await json("src/data/usage.json");
for(const [kind,values] of Object.entries({spacing:[0,2,4,6,8,12,16,24,32,48,64],radius:[4,8,12,16,"50%"],icons:[16,20,24]})){
 assert.deepEqual(usage[kind].map(x=>x.value),values,`${kind}: missing approved usage value`);
 for(const entry of usage[kind])for(const lang of ['en','ar'])for(const field of ['title','use','avoid'])assert(entry[field][lang]?.trim(),`${kind}: missing ${field}.${lang}`);
}
const typography=await json("src/data/typography.json");
assert.deepEqual(Object.keys(typography.fontCandidates),['ibm']);
for(const [name,file] of [['motion','sis-motion.tokens.json'],['usage','sis-usage-guidance.json']])assert.deepEqual(await json(`src/data/${name}.json`),await json(`public/exports/${file}`),`${name}: export drift`);
for (const [source, target] of [
  ["palette.css", "sis-ejust-palette.css"],
  ["motion.css", "sis-motion.css"],
  ["typography.css", "sis-typography.css"],
])
  assert.equal(
    await readFile(`src/${source}`, "utf8"),
    await readFile(`public/exports/${target}`, "utf8"),
    `CSS export drift: ${source}`,
  );
for (const font of [
  "ibm-400.ttf",
  "ibm-500.ttf",
  "ibm-600.ttf",
  "ibm-700.ttf",
  "ibm-OFL.txt",
])
  assert(
    (await stat(`public/fonts/${font}`)).size > 1000,
    `Missing font or license ${font}`,
  );
async function files(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(`${path}/${e.name}`) : `${path}/${e.name}`,
      ),
    )
  ).flat();
}
const sources = await files("src");
for (const file of sources.filter((x) => /\.(tsx|jsx)$/.test(x))) {
  const text = await readFile(file, "utf8");
  assert(
    !/[\u0660-\u0669\u06f0-\u06f9]/u.test(text),
    `${file}: Arabic-Indic numeral`,
  );
}
const css = (
  await Promise.all(
    sources.filter((x) => x.endsWith(".css")).map((x) => readFile(x, "utf8")),
  )
).join("\n");
const inline = (
  await Promise.all(
    sources.filter((x) => x.endsWith(".tsx")).map((x) => readFile(x, "utf8")),
  )
).join("\n");
const defined = new Set(
  [
    ...inline.matchAll(/['"](--[\w-]+)['"]\s*:/g),
    ...css.matchAll(/(--[\w-]+)\s*:/g),
  ].map((x) => x[1]),
);
const unresolved = [
  ...new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((x) => x[1])),
].filter((x) => !defined.has(x));
assert.deepEqual(
  unresolved,
  [],
  `Unresolved CSS variables: ${unresolved.join(", ")}`,
);
for (const [group, file, exportName] of [
  ["Foundations", "foundations", "foundationRenderers"],
  ["Components", "components", "componentRenderers"],
  ["Patterns", "patterns", "patternRenderers"],
]) {
  const source = await readFile(`src/demos/${file}.tsx`, "utf8");
  assert(source.includes(exportName), `Missing ${exportName}`);
  for (const item of catalog.filter((x) => x.group === group)) {
    assert(
      new RegExp(`(?:['\"]${item.id}['\"]|\\b${item.id})\\s*:`).test(source),
      `Missing renderer: ${item.id}`,
    );
    for (const token of item.tokens) {
      const name = token.startsWith("--") ? token : `--sys-color-${token}`;
      assert(defined.has(name), `${item.id}: unknown token ${name}`);
    }
  }
}
console.log(
  `Catalog: ${catalog.length} pages, ${specimenCount} specimens. Tokens: ${Object.keys(palette.themes.light).length} roles per theme. Contrast: ${contrast.checks.length} pairs. Exports and font licenses match.`,
);
