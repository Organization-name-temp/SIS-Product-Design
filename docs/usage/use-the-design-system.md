# Use the SIS design system

This guide shows a developer or a designer how to use the SIS foundations in a product or in Figma.

## Link the styles

Add the theme helper and the foundation stylesheet to your page.

```html
<script src="foundations/sis-theme.js"></script>
<link rel="stylesheet" href="foundations/sis-foundations.css">
```

`sis-foundations.css` imports the palette styles and the typography styles. It also defines the spacing, corner, icon, layout, and base motion variables.
`sis-theme.js` applies `data-brand` and `data-theme` on the root element. Call `SISTheme.setTheme("light" | "dark" | "system")` from your code. The `system` value follows the operating-system preference.

Check: the page renders the E-JUST palette and IBM Plex.

## Copy the export bundle instead

For a self-contained copy, copy the files in `sis-foundations-prototype/public/exports/`.
The bundle adds the expanded motion styles in `sis-motion.css`, the token files, the fonts, and the license notices.
Keep all files in one folder, because the foundation stylesheet imports the other files by relative path.

## Use the tokens in CSS

The palette builds three token layers:

| Layer | Prefix | Purpose |
|---|---|---|
| Reference | `--ref-color-` | The raw brand values. |
| Semantic | `--sys-color-` | The named role, such as a surface background or a text color. |
| Component | `--cmp-` | The value a component reads, such as a button background. |

Use the semantic layer in product code. It survives theme changes and brand changes.

```css
.card {
  background: var(--sys-color-bg-surface);
  color: var(--sys-color-text-primary);
  border-radius: var(--sys-radius-panel);
}
```

## Use the tokens in Figma

Import `foundations/sis-ejust-figma-modes.csv` to build the light and dark variable modes in Figma.
Each row maps one variable across the two modes: Figma variable, Light reference, Light hex, Dark reference, Dark hex.

## Install the fonts

The export bundle ships IBM Plex Sans Arabic in weights 400, 500, 600, and 700 under `fonts/`.
The fonts use the SIL Open Font License. Use the digits 0-9 in Arabic and English text.

## Stay inside the approved rules

Read the [foundation contract](../../foundations/sis-foundation-contract.md) before you add new values.
Propose changes through a GitHub issue in this repository. The design owner approves every change.
