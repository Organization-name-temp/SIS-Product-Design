// Converts W3C design tokens format (DTCG) canonical files to the legacy
// application shape. The workbench app data and the CSS generators consume the
// legacy shape; the canonical sources in foundations/ are DTCG.

const colorAlias = (value) => {
  const match = /^\{ref\.color\.([A-Za-z]+)\.([A-Za-z0-9]+)\}$/.exec(value);
  if (!match) throw new Error("Unresolved color alias: " + value);
  return match[1] + "." + match[2];
};

export function legacyPalette(d) {
  const ext = d.$extensions ?? {};
  const out = {
    metadata: ext["sis.metadata"],
    primitives: {},
    themes: {},
    components: ext["sis.componentAliases"],
    semantic: ext["sis.semantic"],
  };
  for (const [family, steps] of Object.entries(d.ref.color)) {
    if (family.startsWith("$")) continue;
    out.primitives[family] = {};
    for (const [step, token] of Object.entries(steps)) out.primitives[family][step] = token.$value;
  }
  for (const [theme, roles] of Object.entries(d.sys.color)) {
    out.themes[theme] = {};
    for (const [role, token] of Object.entries(roles)) out.themes[theme][role] = colorAlias(token.$value);
  }
  return out;
}

export function legacyTypography(d) {
  const prov = d.$extensions["sis.provenance"];
  const out = {
    metadata: prov.metadata,
    fontCandidates: prov.fontCandidates,
    selectedFont: prov.selectedFont,
    weights: {},
    openDecisions: prov.openDecisions,
    finalPrototype: prov.finalPrototype,
    roles: {},
  };
  for (const [role, token] of Object.entries(d.weights)) {
    if (role.startsWith("$")) continue;
    out.weights[role] = token.$value;
  }
  const dimension = (v) => (typeof v === "string" ? parseFloat(v) : parseFloat(v.$value));
  out.roles = {};
  for (const [role, token] of Object.entries(d.roles)) {
    if (role.startsWith("$")) continue;
    const arabic = token.$extensions["sis.arabic"];
    out.roles[role] = {
      sizeReferencePx: arabic.sizeReferencePx,
      sizeRem: dimension(token.$value.fontSize),
      weight: token.$value.fontWeight,
      lineHeightReferencePx: arabic.lineHeightReferencePx,
      lineHeightRem: arabic.lineHeightRem,
    };
  }
  out.letterSpacing = {
    default: d.letterSpacing.default.$value,
    status: d.$extensions["sis.letterSpacingStatus"],
  };
  out.rules = prov.rules;
  out.numberFormatting = prov.numberFormatting;
  return out;
}


export function legacyMotion(d) {
  const ext = d.$extensions;
  const out = {
    version: d.version,
    authorization: ext["sis.authorization"],
    durationMs: {},
    easing: {},
    springs: ext["sis.springs"],
    recipes: ext["sis.recipes"],
    rules: ext["sis.rules"],
  };
  for (const [name, token] of Object.entries(d.duration)) {
    if (name.startsWith("$")) continue;
    out.durationMs[name] = parseInt(token.$value, 10);
  }
  for (const [name, token] of Object.entries(d.easing)) {
    if (name.startsWith("$")) continue;
    const [x1, y1, x2, y2] = token.$value;
    out.easing[name] =
      x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1
        ? "linear"
        : "cubic-bezier(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")";
  }
  return out;
}
