# SIS design system glossary

One term per concept. The docs, the tokens, and the Jira records use these words.
The product domain glossary lives in the [sis-docs repository](https://github.com/Organization-name-temp/sis-docs/blob/main/00-product/glossary.md).

| Term | Meaning | Used in |
|---|---|---|
| Foundation | The approved base rules for color, typography, spacing, corners, icons, and motion. | `foundations/`, workbench |
| Canonical source | A file in `foundations/` that holds the approved values. Generated files must match it. | `foundations/`, workbench scripts |
| Export | A generated snapshot of the canonical sources that the workbench serves. | `sis-foundations-prototype/public/exports/` |
| Workbench | The interactive catalog application that renders the foundations, components, and patterns. | `sis-foundations-prototype/` |
| Specimen | One rendered example on a workbench catalog page. | workbench catalog |
| Token | A named design value that code or Figma can read. | `foundations/*.tokens.json`, `foundations/*.css` |
| Reference token | The raw value layer, such as a brand hex value or a spacing step. | `--ref-color-*`, `--ref-space-*` |
| Semantic token | The role layer that maps a reference value to a use, such as a surface background. | `--sys-color-*`, `--sys-radius-*` |
| Component token | The layer a component reads, mapped from semantic roles. | `--cmp-*` |
| Profile | The active configuration of brand, font, language, theme, and density. | `docs/system-options/` |
| E-JUST profile | The approved brand profile. Reference red `#EA232B`, IBM Plex Sans Arabic, Arabic RTL, English LTR. | `foundations/` |
| Design record | A stable identifier, `E01` to `E10` for epics and `S01` to `S53` for stories, that links artifacts to Jira issues. | `docs/jira/`, Jira labels |
| DTCG | The W3C design tokens format. The canonical token files use it; tool-specific data lives under `$extensions`. | `foundations/*.tokens.json`, ADR-0001 |
| Token pipeline | The build that turns canonical DTCG files into CSS, TypeScript, a Tailwind preset, and Figma JSON. | `packages/sis-tokens`, ADR-0001 |
| Brand layer | The swappable reference color ramp a tenant replaces. Semantic roles never change per tenant. | `foundations/sis-theme.js`, tenant onboarding guide |
| Density | The control size mode: comfortable or compact. | `foundations/`, workbench |

Merged synonyms: "sources" means canonical sources. "Bundle" means the export set.
