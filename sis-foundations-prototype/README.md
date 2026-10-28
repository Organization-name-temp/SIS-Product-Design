# SIS Foundations

The workbench contains 38 catalog pages and 153 named specimens. It uses local sample data.
Adham controls design approval. The interface does not edit foundation values.

## Preview

Run `npm ci --legacy-peer-deps`, then `npm run dev -- --host 0.0.0.0 --port 4173`.
The local preview opens at http://localhost:4173.
The preview starts with Colors and themes. The sidebar searches Arabic and English.

Presentation settings use URL parameters. Entered values stay in memory and do not enter URLs.
Only the main workbench saves its theme preference. Comparison frames do not save preferences.
Reset clears the selected demonstration. Reload clears all sample interactions.

## Sources

- `src/data/catalog.json` defines navigation, translations, specimens, states, token references, guidance, and verification cases.
- `../foundations/sis-ejust-palette.tokens.json` defines reference colors, semantic roles, and component aliases.
- `../foundations/sis-typography.tokens.json` defines IBM Plex, weights, roles, and number rules.
- `../foundations/sis-foundation-decisions.json` records the active foundation decisions.
- `../foundations/sis-motion.tokens.json` defines named motion values and recipes.
- `../foundations/sis-usage-guidance.json` defines each spacing, corner, and icon use.
- `src/foundations.css` defines approved spacing, radii, targets, layout, and motion values.
- `public/reference/colors-workbench.png` defines the visual structure.
- `public/exports/sis-foundation-contract.md` contains the approved foundation contract.

`npm run tokens:generate` reads the canonical files above and generates application CSS, token exports, and the Figma mapping.
The files under `src/data/` are generated snapshots. A copied project can build from these snapshots when canonical files are absent.
Keep all four exported CSS files together. The foundation file imports color and typography styles. Load sis-motion.css for expanded motion recipes.

The visual reference contains approximate generated colors. Canonical token values take priority.
The reference uses smaller swatch labels. This workbench keeps the approved 14px minimum and wraps the swatch grid.

## Catalog

Foundations cover colors, typography, spacing, grids, borders, icons, layers, motion, and accessibility.
Components cover 16 families. Patterns cover 10 local flows.
Coverage links open named examples. Conditional examples reveal the required step or dialog.
Usage snippets import renderers from this project. They are not an external component package.

Every scenario labels its sample data. Example rules do not establish university policy.
Upload controls keep selected files in this browser. No request sends them to a server.

## Verification

Run `npm run verify` for TypeScript, catalog coverage, token checks, build, and the Sites runtime tests.
Run `npm run test:browser -- --workers=1` for browser interaction tests.
Run `node scripts/audit-browser.mjs` for WCAG scans and narrow layout checks.
The QA report records visual findings, corrections, evidence, and test limits.

The starter retains its Sites build structure. The build does not publish the prototype.

## Fonts and licenses

The project serves four IBM Plex Sans Arabic weights from `public/fonts/`.
The font includes its SIL Open Font License. The interface does not request remote fonts.
Google Fonts source links remain in the typography source file.

## Motion and remaining proposals

The versioned motion registry defines named curves, spring profiles, and interaction recipes.
Exact new profiles are implementation defaults under Adham's authorization.
Layer numbers remain a documented proposal. Personal visual acceptance remains open.
Design changes come through chat and update the source files.
