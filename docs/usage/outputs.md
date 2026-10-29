# Outputs: what to consume and where

| Output | Path | Consumers |
|---|---|---|
| Token CSS (all variables) | `packages/sis-tokens/dist/sis-tokens.css` | Every stack |
| TypeScript tokens | `packages/sis-tokens/dist/tokens.js` | Typed consumers |
| Tailwind preset | `packages/sis-tokens/dist/tailwind-preset.js` | Tailwind v4 |
| Figma tokens | `packages/sis-tokens/dist/tokens-studio.json` | Tokens Studio import |
| Figma mode mapping | `foundations/sis-ejust-figma-modes.csv` | Figma variables |
| React components | `packages/react/src/index.ts` | React apps |
| Component stylesheet | `packages/react/src/styles/sis-react.css` | React apps |
| Self-contained bundle | `sis-foundations-prototype/public/exports/` | Copy-own consumers |
| Canonical DTCG sources | `foundations/*.tokens.json` | Token tooling |
| Workbench (interactive docs) | `sis-foundations-prototype/` | Design review |
| Showcase prototype | `apps/showcase/` (`npm run dev`, port 4680) | Full product demo: dashboard, students, assistant, gallery |
| Landing kit | `outputs/landing/index.html` | Marketing pages |
| Email templates | `outputs/email/*.html` (welcome, reset, hold, grades) | Backend engineers |
| Presentation profile | `outputs/presentation/deck.html` | Reviews and stakeholder decks |
| Print profile | `outputs/print/report.html` (A4) | Registrar documents |
| Mobile tokens | `outputs/mobile/` (Swift + Android XML, regenerate with `generate.mjs`) | Native teams |
| Tenant brand tool | `tools/tenant-brand.mjs` | New university brands |
| Showcase prototype | `apps/showcase/` | Stakeholders, onboarding |

Load order: `sis-tokens.css` before `sis-react.css`. Fonts ship in the export bundle and the workbench.
