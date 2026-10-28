import StyleDictionary from "style-dictionary";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const sources = [
  "../../foundations/sis-ejust-palette.tokens.json",
  "../../foundations/sis-typography.tokens.json",
  "../../foundations/sis-motion.tokens.json",
  "../../foundations/sis-spacing.tokens.json",
  "../../foundations/sis-radius.tokens.json",
  "../../foundations/sis-elevation.tokens.json",
  "../../foundations/sis-zindex.tokens.json",
  "../../foundations/sis-opacity.tokens.json",
  "../../foundations/sis-breakpoints.tokens.json",
];

const readJSON = async (f) => JSON.parse(await readFile(new URL(f, import.meta.url), "utf8"));
const readText = (f) => readFile(new URL(f, import.meta.url), "utf8");

const palette = await readJSON("../../foundations/sis-ejust-palette.tokens.json");
const typography = await readJSON("../../foundations/sis-typography.tokens.json");
const motion = await readJSON("../../foundations/sis-motion.tokens.json");
const spacing = await readJSON("../../foundations/sis-spacing.tokens.json");
const radius = await readJSON("../../foundations/sis-radius.tokens.json");
const elevation = await readJSON("../../foundations/sis-elevation.tokens.json");
const zindex = await readJSON("../../foundations/sis-zindex.tokens.json");
const opacity = await readJSON("../../foundations/sis-opacity.tokens.json");
const breakpoints = await readJSON("../../foundations/sis-breakpoints.tokens.json");

// Style Dictionary parses and validates every source and resolves aliases; a
// build failure here means the canonical DTCG files are malformed.
const sd = new StyleDictionary({ source: sources, platforms: {} });
await sd.hasInitialized;

const components = palette.$extensions["sis.componentAliases"];
const recipes = motion.$extensions["sis.recipes"];
const leaf = (node) => (node && typeof node === "object" && "$value" in node ? node.$value : node);

const block = (selector, lines) => `${selector} {\n${lines.map((l) => `  ${l}`).join("\n")}\n}`;
const decl = (obj, prefix) =>
  Object.entries(obj).filter(([k]) => !k.startsWith("$")).map(([k, v]) => `--${prefix}${k}: ${leaf(v)};`);
const aliasPath = (alias) => {
  const [family, step] = alias.replace(/^\{|\}$/g, "").split(".").slice(2);
  return `ref-color-${family}-${step}`;
};

// --- CSS: one bundle carrying the same variables the workbench generator emits. ---
const css = [];
css.push(
  block(
    ":root",
    Object.entries(palette.ref.color).flatMap(([family, steps]) =>
      Object.entries(steps).map(([step, token]) => `--ref-color-${family}-${step}: ${token.$value};`),
    ),
  ),
);
css.push(
  block(
    ':root, [data-brand="ejust"]',
    Object.keys(palette.ref.color.brand).map((k) => `--brand-${k}: var(--ref-color-brand-${k});`),
  ),
);
const themeBlock = (theme) => {
  const roles = palette.sys.color[theme];
  return [
    `color-scheme: ${theme};`,
    ...Object.entries(roles).map(([role, token]) => `--sys-color-${role}: var(--${aliasPath(token.$value)});`),
    ...Object.entries(components).map(([alias, role]) => `--cmp-${alias}: var(--sys-color-${role});`),
    ...Object.entries(palette.ref.color).flatMap(([family, steps]) =>
      Object.keys(steps).map(
        (k) => `--color-${family}-${k}: var(--${family === "brand" ? "brand" : `ref-color-${family}`}-${k});`,
      ),
    ),
    "--color-chart-violet: var(--ref-color-violet-700);",
    ...Object.keys(roles).map((role) => `--color-${role}: var(--sys-color-${role});`),
    `--effect-dialog-backdrop: rgb(9 9 11 / ${theme === "light" ? ".40" : ".72"});`,
    `--effect-shadow-raised: 0 4px 16px rgb(9 9 11 / ${theme === "light" ? ".12" : ".40"});`,
    "--sys-shadow-flat: none;",
    `--sys-shadow-low: 0 4px 16px 0 rgb(9 9 11 / ${theme === "light" ? ".12" : ".40"});`,
    `--sys-shadow-high: 0 8px 24px 0 rgb(9 9 11 / ${theme === "light" ? ".16" : ".48"});`,
  ];
};
css.push(block(':root, [data-theme="light"], [data-theme="system"], [data-theme="ejust-light"]', themeBlock("light")));
css.push(block('[data-theme="dark"], [data-theme="ejust-dark"]', themeBlock("dark")));
css.push(`@media (prefers-color-scheme: dark) {\n${block('[data-theme="system"]', themeBlock("dark"))}\n}`);

css.push(
  block(":root", [
      ]),
);

const sizes = [...new Set(Object.values(typography.roles).map((r) => r.$extensions["sis.arabic"].sizeReferencePx))].sort((a, b) => a - b);
const heights = [
  ...new Set(
    Object.values(typography.roles).flatMap((r) =>
      Object.values(r.$extensions["sis.arabic"].lineHeightReferencePx),
    ),
  ),
].sort((a, b) => a - b);
css.push(
  block(":root", [
    `--ref-font-family-ibm: "${typography.ref.font.family.ibm.$value}", sans-serif;`,
    `--sys-font-family-ui: var(--ref-font-family-ibm);`,
    ...[400, 500, 600, 700].map((w) => `--ref-font-weight-${w}: ${w};`),
    ...decl(typography.weights, "sys-font-weight-"),
    ...sizes.map((v) => `--ref-font-size-${v}: ${v / 16}rem;`),
    ...heights.map((v) => `--ref-line-height-${v}: ${v / 16}rem;`),
    ...Object.entries(typography.roles).map(
      ([key, r]) => `--sys-font-size-${key}: var(--ref-font-size-${r.$extensions["sis.arabic"].sizeReferencePx});`,
    ),
    `--sys-letter-spacing: ${typography.letterSpacing.default.$value};`,
  ]),
);
for (const lang of ["ar", "en"]) {
  css.push(
    block(
      `[lang|="${lang}"]`,
      Object.entries(typography.roles).map(([key, r]) => {
        const px = r.$extensions["sis.arabic"].lineHeightReferencePx[lang === "ar" ? "arabic" : "latin"];
        return `--sys-line-height-${key}: var(--ref-line-height-${px});`;
      }),
    ),
  );
}

css.push(
  block(":root", [
    ...decl(motion.duration, "sys-motion-duration-"),
    ...Object.entries(motion.easing)
      .filter(([k]) => !k.startsWith("$"))
      .map(([k, token]) => `--sys-motion-easing-${k}: cubic-bezier(${token.$value.join(", ")});`),
    ...Object.entries(recipes)
      .filter(([, v]) => v.duration)
      .flatMap(([name, v]) => [
        `--sys-motion-${name}-duration: var(--sys-motion-duration-${v.duration});`,
        `--sys-motion-${name}-easing: var(--sys-motion-easing-${v.easing});`,
      ]),
  ]),
);
css.push(
  `@media(prefers-reduced-motion:reduce){:root{${Object.keys(motion.duration)
    .map((k) => `--sys-motion-duration-${k}:0ms;`)
    .join("")}}}`,
);
const foundationsStatic = await readText("../../sis-foundations-prototype/src/foundations.css");
const cssOut = [...css, foundationsStatic.trim()].join("\n\n") + "\n";

// --- Tokens JS ---
const flat = {};
const walk = (node, path) => {
  if (!node || typeof node !== "object") return;
  if ("$value" in node) {
    flat[path] = node.$type === "cubicBezier" ? `cubic-bezier(${node.$value.join(", ")})` : leaf(node);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walk(v, path ? `${path}-${k}` : k);
  }
};
for (const doc of [palette, typography, motion, spacing, radius, elevation, zindex, opacity, breakpoints]) {
  walk(doc, "");
}
const jsOut = "// Generated by sis-tokens. Do not edit.\nexport const tokens = " + JSON.stringify(flat, null, 2) + ";\n";

// --- Tailwind preset ---
const sys = (theme) =>
  Object.fromEntries(Object.keys(palette.sys.color[theme]).map((role) => [role, `var(--sys-color-${role})`]));
const tailwind = {
  theme: {
    extend: {
      colors: {
        canvas: "var(--sys-color-bg-canvas)",
        surface: "var(--sys-color-bg-surface)",
        ink: "var(--sys-color-text-primary)",
        brand: Object.fromEntries(
          Object.entries(palette.ref.color.brand).map(([k]) => [k, `var(--ref-color-brand-${k})`]),
        ),
        role: { light: sys("light"), dark: sys("dark") },
      },
      spacing: Object.fromEntries(Object.entries(spacing.ref.space).map(([k, t]) => [k, leaf(t)])),
      borderRadius: Object.fromEntries(Object.entries(radius.sys.radius).map(([k, t]) => [k, leaf(t)])),
      boxShadow: Object.fromEntries(
        Object.entries(elevation.sys.shadow.light).map(([k, token]) => {
          const s = leaf(token);
          const a = s.color.alpha;
          return [k, `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} rgb(9 9 11 / ${String(a).replace(/^0\./, ".")})`];
        }),
      ),
      zIndex: Object.fromEntries(Object.entries(zindex.sys.z).map(([k, t]) => [k, leaf(t)])),
      opacity: Object.fromEntries(Object.entries(opacity.sys.opacity).map(([k, t]) => [k, leaf(t)])),
      screens: Object.fromEntries(Object.entries(breakpoints.sys.breakpoint).map(([k, t]) => [k, leaf(t)])),
      fontFamily: { ui: [typography.ref.font.family.ibm.$value, "sans-serif"] },
      transitionDuration: Object.fromEntries(Object.entries(motion.duration).map(([k, t]) => [k, leaf(t)])),
    },
  },
};
const tailwindOut = "// Generated by sis-tokens. Do not edit.\nexport default " + JSON.stringify(tailwind, null, 2) + ";\n";

// --- Tokens Studio (Figma) ---
const deepMerge = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object"
      ? deepMerge(out[k], v)
      : v;
  }
  return out;
};
const studio = [palette, typography, motion, spacing, radius, elevation, zindex, opacity, breakpoints].reduce(
  deepMerge,
  { $description: "SIS design tokens for Figma (Tokens Studio import). Generated by sis-tokens." },
);

await mkdir("dist", { recursive: true });
await writeFile("dist/sis-tokens.css", cssOut);
await writeFile("dist/tokens.js", jsOut);
await writeFile("dist/tailwind-preset.js", tailwindOut);
await writeFile("dist/tokens-studio.json", JSON.stringify(studio, null, 2) + "\n");
console.log("sis-tokens built: css, tokens.js, tailwind-preset.js, tokens-studio.json");
