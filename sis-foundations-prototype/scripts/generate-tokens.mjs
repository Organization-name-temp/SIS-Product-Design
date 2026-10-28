import { readFile, writeFile } from "node:fs/promises";
async function canonical(name,file){
  let data;
  try{data=JSON.parse(await readFile(new URL(`../../../foundations/${file}`,import.meta.url),'utf8'));}
  catch(error){if(error.code!=='ENOENT')throw error;data=JSON.parse(await readFile(`src/data/${name}.json`,'utf8'));}
  await writeFile(`src/data/${name}.json`,JSON.stringify(data,null,2)+'\n');
  return data;
}
const palette=await canonical('palette','sis-ejust-palette.tokens.json');
const usage=await canonical('usage','sis-usage-guidance.json');
await canonical('decisions','sis-foundation-decisions.json');
const motion=await canonical('motion','sis-motion.tokens.json');
const type=await canonical('typography','sis-typography.tokens.json');
const block = (selector, lines) =>
  `${selector} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;
const declarations = (obj, prefix, resolve = (v) => v) =>
  Object.entries(obj).map(([k, v]) => `--${prefix}${k}: ${resolve(v)};`);
const refs = Object.entries(palette.primitives).flatMap(([family, values]) =>
  declarations(values, `ref-color-${family}-`),
);
let css = [
  block(":root", refs),
  block(
    ':root, [data-brand="ejust"]',
    Object.keys(palette.primitives.brand).map(
      (k) => `--brand-${k}: var(--ref-color-brand-${k});`,
    ),
  ),
];
function theme(selector, name) {
  const roles = palette.themes[name];
  return block(selector, [
    `color-scheme: ${name};`,
    ...declarations(roles, "sys-color-", (ref) => {
      const [f, k] = ref.split(".");
      return `var(--${f === "brand" ? "brand" : `ref-color-${f}`}-${k})`;
    }),
    ...declarations(palette.components, "cmp-", (v) => `var(--sys-color-${v})`),
    ...Object.entries(palette.primitives).flatMap(([f, values]) =>
      Object.keys(values).map(
        (k) =>
          `--color-${f}-${k}: var(--${f === "brand" ? "brand" : `ref-color-${f}`}-${k});`,
      ),
    ),
    "--color-chart-violet: var(--ref-color-violet-700);",
    ...Object.keys(roles).map((k) => `--color-${k}: var(--sys-color-${k});`),
    `--effect-dialog-backdrop: rgb(9 9 11 / ${name === "light" ? ".40" : ".72"});`,
    `--effect-shadow-raised: 0 4px 16px rgb(9 9 11 / ${name === "light" ? ".12" : ".40"});`,
    "--sys-shadow-flat: none;",
    `--sys-shadow-low: 0 4px 16px 0 rgb(9 9 11 / ${name === "light" ? ".12" : ".40"});`,
    `--sys-shadow-high: 0 8px 24px 0 rgb(9 9 11 / ${name === "light" ? ".16" : ".48"});`,
  ]);
}
css.push(
  theme(
    ':root, [data-theme="light"], [data-theme="system"], [data-theme="ejust-light"]',
    "light",
  ),
  theme('[data-theme="dark"], [data-theme="ejust-dark"]', "dark"),
  `@media (prefers-color-scheme: dark) {\n${theme('[data-theme="system"]', "dark")}\n}`,
);
css = css.join("\n\n") + "\n";
await writeFile("src/palette.css", css);
await writeFile("public/exports/sis-ejust-palette.css", css);
const sizes = [
  ...new Set(Object.values(type.roles).map((r) => r.sizeReferencePx)),
].sort((a, b) => a - b);
const heights = [
  ...new Set(
    Object.values(type.roles).flatMap((r) =>
      Object.values(r.lineHeightReferencePx),
    ),
  ),
].sort((a, b) => a - b);
let typography = [
  block(":root", [
    ...Object.entries(type.fontCandidates).map(
      ([key, v]) => `--ref-font-family-${key}: "${v.family}", sans-serif;`,
    ),
    ...[400, 500, 600, 700].map((w) => `--ref-font-weight-${w}: ${w};`),
    ...sizes.map((v) => `--ref-font-size-${v}: ${v / 16}rem;`),
    ...heights.map((v) => `--ref-line-height-${v}: ${v / 16}rem;`),
    ...declarations(
      type.weights,
      "sys-font-weight-",
      (v) => `var(--ref-font-weight-${v})`,
    ),
    ...Object.entries(type.roles).flatMap(([key, r]) => [
      `--sys-font-size-${key}: var(--ref-font-size-${r.sizeReferencePx});`,
      `--sys-line-height-${key}: var(--ref-line-height-${r.lineHeightReferencePx.latin});`,
    ]),
    `--sys-letter-spacing: ${type.letterSpacing.default};`,
  ]),
];
for (const [key, v] of Object.entries(type.fontCandidates))
  typography.push(
    block(`${key === type.selectedFont ? ":root, " : ""}[data-font="${key}"]`, [
      `--sys-font-family-ui: var(--ref-font-family-${key});`,
    ]),
  );
for (const lang of ["ar", "en"])
  typography.push(
    block(
      `[lang|="${lang}"]`,
      Object.entries(type.roles).map(
        ([key, r]) =>
          `--sys-line-height-${key}: var(--ref-line-height-${r.lineHeightReferencePx[lang === "ar" ? "arabic" : "latin"]});`,
      ),
    ),
  );
typography = typography.join("\n") + "\n";
await writeFile("src/typography.css", typography);
await writeFile("public/exports/sis-typography.css", typography);
for (const [name, data] of [
  ["sis-ejust-palette.tokens.json", palette],
  ["sis-typography.tokens.json", type],
])
  await writeFile(
    `public/exports/${name}`,
    JSON.stringify(data, null, 2) + "\n",
  );
const value = (ref) => {
  const [f, k] = ref.split(".");
  return palette.primitives[f][k];
};
let csv = "Figma variable,Light reference,Light hex,Dark reference,Dark hex\n";
for (const key of Object.keys(palette.themes.light))
  csv += `color/${key.replaceAll("-", "/")},${palette.themes.light[key]},${value(palette.themes.light[key])},${palette.themes.dark[key]},${value(palette.themes.dark[key])}\n`;
await writeFile("public/exports/sis-ejust-figma-modes.csv", csv);
for (const name of ["light", "dark"]) {
  const refs = Object.fromEntries(
    Object.entries(palette.primitives).map(([family, values]) => [
      family,
      Object.fromEntries(
        Object.entries(values).map(([key, hex]) => [
          key,
          {
            $type: "color",
            $value: {
              colorSpace: "srgb",
              components: hex
                .slice(1)
                .match(/../g)
                .map((x) => parseInt(x, 16) / 255),
              alpha: 1,
            },
          },
        ]),
      ),
    ]),
  );
  const exportData = {
    ref: { color: refs },
    sys: {
      color: Object.fromEntries(
        Object.entries(palette.themes[name]).map(([key, ref]) => [
          key,
          { $type: "color", $value: `{ref.color.${ref}}` },
        ]),
      ),
    },
    component: Object.fromEntries(
      Object.entries(palette.components).map(([key, role]) => [
        key,
        { $type: "color", $value: `{sys.color.${role}}` },
      ]),
    ),
  };
  await writeFile(
    `public/exports/sis-ejust-${name}.tokens.json`,
    JSON.stringify(exportData, null, 2) + "\n",
  );
}
const foundations = await readFile("src/foundations.css", "utf8");
await writeFile(
  "public/exports/sis-foundations.css",
  foundations
    .replace("./palette.css", "./sis-ejust-palette.css")
    .replace("./typography.css", "./sis-typography.css"),
);
console.log(
  "Generated CSS, JSON modes, and Figma mapping from the canonical sources.",
);

const motionCss=block(':root',[...declarations(motion.durationMs,'sys-motion-duration-',v=>`${v}ms`),...declarations(motion.easing,'sys-motion-easing-'),...Object.entries(motion.recipes).filter(([,v])=>v.duration).flatMap(([name,v])=>[`--sys-motion-${name}-duration: var(--sys-motion-duration-${v.duration});`,`--sys-motion-${name}-easing: var(--sys-motion-easing-${v.easing});`])])+'\n@media(prefers-reduced-motion:reduce){:root{'+Object.keys(motion.durationMs).map(k=>`--sys-motion-duration-${k}:0ms;`).join('')+'}}\n';
await writeFile('src/motion.css',motionCss);await writeFile('public/exports/sis-motion.css',motionCss);await writeFile('public/exports/sis-motion.tokens.json',JSON.stringify(motion,null,2)+'\n');

await writeFile('public/exports/sis-usage-guidance.json',JSON.stringify(usage,null,2)+'\n');

for(const [file,dir] of [['sis-foundation-contract.md','foundations'],['sis-ejust-palette.md','foundations'],['sis-foundation-decisions.json','foundations'],['sis-typography.md','foundations'],['sis-theme.js','foundations'],['sis-build-palette.py','tools']]){
 try{await writeFile(`public/exports/${file}`,await readFile(new URL(`../../../${dir}/${file}`,import.meta.url)));}
 catch(error){if(error.code!=='ENOENT')throw error;await readFile(`public/exports/${file}`);}
}
