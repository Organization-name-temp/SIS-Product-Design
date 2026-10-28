# SIS light and dark color system

Prepared on 27 October 2026. Version 2.

Use the same component names in both themes. Change the theme mode to replace the underlying role values.
The exact E-JUST reference red remains `#EA232B`.
Your request for light and dark themes replaces the earlier light-only scope.
The complete visual comparison remains the final foundation step.

## Files

- [Prototype CSS](sis-ejust-palette.css)
- [Theme preference helper](sis-theme.js)
- [Canonical source with both themes](sis-ejust-palette.tokens.json)
- [Light token export](sis-ejust-light.tokens.json)
- [Dark token export](sis-ejust-dark.tokens.json)
- [Figma mode mapping](sis-ejust-figma-modes.csv)
- [Computed contrast results](sis-ejust-palette.contrast.json)
- [Rebuild script](../tools/sis-build-palette.py)

## Naming contract

Use three layers.

| Layer | Purpose | CSS example | Figma example |
|---|---|---|---|
| Reference | Stores an exact color | `--ref-color-brand-500` | `brand/500` |
| Semantic | Describes what the color does | `--sys-color-text-primary` | `color/text/primary` |
| Component | Connects a component part to a role | `--cmp-button-primary-label` | `button/primary/label` |

A component uses semantic or component tokens. It does not choose reference colors directly.
Theme names do not appear in component token names.
For example, do not create `button-light-text` and `button-dark-text`.
Keep `button/primary/label` and resolve its value from the active theme.

## Switching contract

Brand and theme are independent attributes.
Use `data-brand="ejust"` to identify the reference university.
Use `data-theme="light"`, `data-theme="dark"`, or `data-theme="system"` to select the mode.

```html
<html data-brand="ejust" data-theme="light">
```

```css
.example-primary-button {
  background: var(--cmp-button-primary-background);
  color: var(--cmp-button-primary-label);
  border: 1px solid var(--cmp-button-primary-border);
}

.example-primary-button:hover {
  background: var(--cmp-button-primary-background-hover);
  border-color: var(--cmp-button-primary-border-hover);
}

.example-primary-button:active {
  background: var(--cmp-button-primary-background-pressed);
  border-color: var(--cmp-button-primary-border-pressed);
}
```

The example illustrates token use. It is not a completed button component specification.
Load `sis-ejust-palette.css` before the component stylesheet.
Load `sis-theme.js` in the document head before page content to apply a saved preference early.

```javascript
SISTheme.setTheme("dark");
SISTheme.setTheme("light");
SISTheme.setTheme("system");
SISTheme.setBrand("ejust");
```

Light is the default when no saved or explicit preference exists.
System follows the operating-system preference through CSS and updates when that preference changes.
Explicit light and dark choices override the operating-system preference.
The helper stores the choice when browser storage is available.
The active choice still works when storage is unavailable.
An explicit valid HTML attribute takes precedence over a saved value at initial load.
The helper supports E-JUST only until another university palette passes review.

CSS supports nested theme scopes. Place the theme attribute on the container that owns the scoped preview.
Semantic and component aliases redeclare together, so nested components inherit the correct mode.
Place a nested brand attribute and theme attribute on the same container when adding another brand preview.
Earlier `--color-*` names remain compatibility aliases.
Earlier `data-theme="ejust-light"` and `data-theme="ejust-dark"` values remain supported by CSS.
Use the independent brand and theme attributes for new work.

The browser resolves custom properties and native control colors through these CSS mechanisms.
Sources: [MDN custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) and [MDN color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme).

## Figma structure

Create a Reference colors collection with the primitive colors.
Create a Semantic colors collection with Light and Dark modes.
Create one semantic variable per row in the mode mapping file.
Assign each mode an alias to the listed reference variable.
Bind component fills, labels, icons, and borders to semantic variables.
Optional component variables can alias semantic variables without separate light and dark names.
Set the frame mode to Light or Dark to change the result.
The CSV is a mapping reference. It does not create or import Figma variables by itself.
No live Figma edits are part of this palette update.

The standalone JSON exports use typed colors and aliases from the Design Tokens Community Group format.
They are export inputs, not a claim of support by every design-tool importer.
Source: [Design Tokens format 2025.10](https://www.designtokens.org/tr/2025.10/format/).

## Core roles

| Role | Light | Dark |
|---|---|---|
| `brand-reference` | `#EA232B` | `#EA232B` |
| `bg-canvas` | `#FAFAFA` | `#09090B` |
| `bg-surface` | `#FFFFFF` | `#18181B` |
| `bg-raised` | `#FFFFFF` | `#27272A` |
| `bg-subtle` | `#F4F4F5` | `#27272A` |
| `bg-selected` | `#FFF1F2` | `#430A10` |
| `text-primary` | `#18181B` | `#FAFAFA` |
| `text-secondary` | `#52525B` | `#D4D4D8` |
| `text-muted` | `#52525B` | `#A1A1AA` |
| `text-brand` | `#AB1420` | `#FF9BA0` |
| `border-control` | `#71717A` | `#A1A1AA` |
| `action-primary-bg` | `#CD1722` | `#CD1722` |
| `action-primary-fg` | `#FFFFFF` | `#FFFFFF` |
| `action-primary-border` | `#CD1722` | `#F9646D` |
| `link-default` | `#AB1420` | `#FF9BA0` |
| `focus-ring` | `#AB1420` | `#FF9BA0` |
| `nav-bg` | `#FFFFFF` | `#18181B` |
| `nav-selected-bg` | `#FFF1F2` | `#430A10` |
| `nav-selected-text` | `#AB1420` | `#FFC4C7` |
| `input-bg` | `#FFFFFF` | `#18181B` |
| `input-border` | `#71717A` | `#A1A1AA` |
| `table-header-bg` | `#F4F4F5` | `#27272A` |
| `tooltip-bg` | `#18181B` | `#F4F4F5` |

## Color and interaction rules

- Keep the exact brand red for the university identity and selected indicators.
- Use darker brand red for buttons with normal-sized white text in both themes.
- Use lighter brand shades for links and focus indicators on dark surfaces.
- Use explicit primary-button borders in dark mode, including hover and pressed states.
- Keep white labels on red primary buttons. Do not replace them with the general inverse-text token.
- Make dark surface elevation progressively lighter. Do not invert the light palette mechanically.
- Keep navbar and sidebar surfaces neutral. Use the red family to mark the current item.
- Use text, icons, and state semantics alongside feedback colors.
- Distinguish destructive actions through their labels and behavior because brand and danger both use red families.
- Underline inline links.
- Use decorative borders only where their contrast does not communicate a control boundary or essential state.
- Use the stronger control border for inputs, checkboxes, and similar controls.
- Keep a 2px gap between focus rings and filled controls.
- Use the focus-gap token for that gap and the focus-ring token for the indicator.
- Preserve selected, disabled, read-only, invalid, pending, and hover meanings across both themes.
- Keep pending status explicit. Do not assign a separate universal pending color that could conflict with domain meaning.
- Use direct labels and patterns for chart series. Color alone must not distinguish the data.
- Keep chart grids decorative. Use the chart-axis role for readable axis text.
- Recheck any new combination, transparency, image background, gradient, or university override.

## Expanded coverage

The palette covers page surfaces, elevated surfaces, text, icons, borders, buttons, links, focus, navbar, sidebar, fields, and selection.
It also covers checkbox states, tables, tooltips, disabled states, skeletons, scrollbars, feedback, and eight chart series.
Backdrop and shadow effects have separate light and dark values.
Effects need composited checks during the final visual review.

The system defines 89 reference tokens, 88 unique solid colors, 134 semantic roles per theme, and 42 component aliases.

## Verification and limits

All 338 declared foreground/background checks pass their specified threshold.
Calculations use opaque sRGB values and the WCAG relative-luminance formula.
Pass decisions use unrounded ratios.
Text checks use 4.5:1. Essential non-text indicators use 3:1.
Disabled text also meets the chosen text threshold in the listed combinations.

White on `#EA232B` remains below the normal-text minimum at approximately 4.40:1.
White on the button fill `#CD1722` reaches approximately 5.61:1.
The exact brand color remains unchanged.

Sources: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Checks cover specified token pairs. They do not prove full accessibility or pairwise contrast among chart series.
Theme-helper checks use a simulated document and storage. They do not replace a browser rendering check.
The final foundation visual review remains pending.

## Another university

Define the new university's full brand scale under its `data-brand` selector.
Override `--brand-50` through `--brand-950` on the same theme scope.
Keep semantic and component names unchanged.
Provide additional semantic overrides if the new brand cannot satisfy the required role contrast.
Run the contrast checks on the new mappings before approval.
A single replacement hex value does not establish an accessible university theme.

The current helper rejects unregistered brands. Register another brand only after its values and checks exist.

## Complete reference palette

| Family | Shade | Value |
|---|---|---|
| brand | 50 | `#FFF1F2` |
| brand | 100 | `#FFE0E2` |
| brand | 200 | `#FFC4C7` |
| brand | 300 | `#FF9BA0` |
| brand | 400 | `#F9646D` |
| brand | 500 | `#EA232B` |
| brand | 600 | `#CD1722` |
| brand | 700 | `#AB1420` |
| brand | 800 | `#8E1621` |
| brand | 900 | `#761923` |
| brand | 950 | `#430A10` |
| neutral | 0 | `#FFFFFF` |
| neutral | 50 | `#FAFAFA` |
| neutral | 100 | `#F4F4F5` |
| neutral | 200 | `#E4E4E7` |
| neutral | 300 | `#D4D4D8` |
| neutral | 400 | `#A1A1AA` |
| neutral | 500 | `#71717A` |
| neutral | 600 | `#52525B` |
| neutral | 700 | `#3F3F46` |
| neutral | 800 | `#27272A` |
| neutral | 900 | `#18181B` |
| neutral | 950 | `#09090B` |
| success | 50 | `#F0FDF4` |
| success | 100 | `#DCFCE7` |
| success | 200 | `#BBF7D0` |
| success | 300 | `#86EFAC` |
| success | 400 | `#4ADE80` |
| success | 500 | `#22C55E` |
| success | 600 | `#15803D` |
| success | 700 | `#167139` |
| success | 800 | `#166534` |
| success | 900 | `#14532D` |
| success | 950 | `#052E16` |
| warning | 50 | `#FFFBEB` |
| warning | 100 | `#FEF3C7` |
| warning | 200 | `#FDE68A` |
| warning | 300 | `#FCD34D` |
| warning | 400 | `#FBBF24` |
| warning | 500 | `#F59E0B` |
| warning | 600 | `#B45309` |
| warning | 700 | `#A14B08` |
| warning | 800 | `#92400E` |
| warning | 900 | `#78350F` |
| warning | 950 | `#451A03` |
| danger | 50 | `#FFF1F2` |
| danger | 100 | `#FFE4E6` |
| danger | 200 | `#FECDD3` |
| danger | 300 | `#FDA4AF` |
| danger | 400 | `#FB7185` |
| danger | 500 | `#F43F5E` |
| danger | 600 | `#BE123C` |
| danger | 700 | `#AF1238` |
| danger | 800 | `#9F1239` |
| danger | 900 | `#881337` |
| danger | 950 | `#4C0519` |
| info | 50 | `#EFF6FF` |
| info | 100 | `#DBEAFE` |
| info | 200 | `#BFDBFE` |
| info | 300 | `#93C5FD` |
| info | 400 | `#60A5FA` |
| info | 500 | `#3B82F6` |
| info | 600 | `#1D4ED8` |
| info | 700 | `#1E45BB` |
| info | 800 | `#1E40AF` |
| info | 900 | `#1E3A8A` |
| info | 950 | `#172554` |
| violet | 50 | `#F5F3FF` |
| violet | 100 | `#EDE9FE` |
| violet | 200 | `#DDD6FE` |
| violet | 300 | `#C4B5FD` |
| violet | 400 | `#A78BFA` |
| violet | 500 | `#8B5CF6` |
| violet | 600 | `#7C3AED` |
| violet | 700 | `#6D28D9` |
| violet | 800 | `#5B21B6` |
| violet | 900 | `#4C1D95` |
| violet | 950 | `#2E1065` |
| cyan | 50 | `#ECFEFF` |
| cyan | 100 | `#CFFAFE` |
| cyan | 200 | `#A5F3FC` |
| cyan | 300 | `#67E8F9` |
| cyan | 400 | `#22D3EE` |
| cyan | 500 | `#06B6D4` |
| cyan | 600 | `#0891B2` |
| cyan | 700 | `#0E7490` |
| cyan | 800 | `#155E75` |
| cyan | 900 | `#164E63` |
| cyan | 950 | `#083344` |

## Complete semantic mapping

| Role | Light reference | Light value | Dark reference | Dark value |
|---|---|---|---|---|
| `brand-reference` | `brand.500` | `#EA232B` | `brand.500` | `#EA232B` |
| `bg-canvas` | `neutral.50` | `#FAFAFA` | `neutral.950` | `#09090B` |
| `bg-surface` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `bg-subtle` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `bg-hover` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `bg-selected` | `brand.50` | `#FFF1F2` | `brand.950` | `#430A10` |
| `text-primary` | `neutral.900` | `#18181B` | `neutral.50` | `#FAFAFA` |
| `text-secondary` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `text-muted` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `text-placeholder` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `text-inverse` | `neutral.0` | `#FFFFFF` | `neutral.950` | `#09090B` |
| `border-subtle` | `neutral.200` | `#E4E4E7` | `neutral.800` | `#27272A` |
| `border-default` | `neutral.300` | `#D4D4D8` | `neutral.700` | `#3F3F46` |
| `border-control` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `border-control-hover` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `icon-default` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `icon-muted` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `action-primary-bg` | `brand.600` | `#CD1722` | `brand.600` | `#CD1722` |
| `action-primary-hover` | `brand.700` | `#AB1420` | `brand.700` | `#AB1420` |
| `action-primary-pressed` | `brand.800` | `#8E1621` | `brand.800` | `#8E1621` |
| `action-primary-fg` | `neutral.0` | `#FFFFFF` | `neutral.0` | `#FFFFFF` |
| `action-secondary-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `action-secondary-hover` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `action-secondary-pressed` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `action-secondary-fg` | `neutral.900` | `#18181B` | `neutral.50` | `#FAFAFA` |
| `action-secondary-border` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `action-disabled-bg` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `action-disabled-fg` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `action-disabled-border` | `neutral.300` | `#D4D4D8` | `neutral.700` | `#3F3F46` |
| `link-default` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `link-hover` | `brand.800` | `#8E1621` | `brand.200` | `#FFC4C7` |
| `link-visited` | `brand.900` | `#761923` | `brand.100` | `#FFE0E2` |
| `focus-ring` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `focus-gap` | `neutral.0` | `#FFFFFF` | `neutral.950` | `#09090B` |
| `nav-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `nav-text` | `neutral.700` | `#3F3F46` | `neutral.300` | `#D4D4D8` |
| `nav-hover` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `nav-selected-bg` | `brand.50` | `#FFF1F2` | `brand.950` | `#430A10` |
| `nav-selected-text` | `brand.700` | `#AB1420` | `brand.200` | `#FFC4C7` |
| `nav-selected-indicator` | `brand.500` | `#EA232B` | `brand.500` | `#EA232B` |
| `input-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `input-fg` | `neutral.900` | `#18181B` | `neutral.50` | `#FAFAFA` |
| `input-border` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `input-placeholder` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `destructive-bg` | `danger.600` | `#BE123C` | `danger.600` | `#BE123C` |
| `destructive-hover` | `danger.800` | `#9F1239` | `danger.800` | `#9F1239` |
| `destructive-fg` | `neutral.0` | `#FFFFFF` | `neutral.0` | `#FFFFFF` |
| `chart-1` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `chart-2` | `info.600` | `#1D4ED8` | `info.300` | `#93C5FD` |
| `chart-3` | `success.600` | `#15803D` | `success.300` | `#86EFAC` |
| `chart-4` | `warning.600` | `#B45309` | `warning.300` | `#FCD34D` |
| `chart-5` | `violet.700` | `#6D28D9` | `violet.300` | `#C4B5FD` |
| `chart-6` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `success-bg` | `success.50` | `#F0FDF4` | `success.950` | `#052E16` |
| `success-text` | `success.800` | `#166534` | `success.200` | `#BBF7D0` |
| `success-icon` | `success.600` | `#15803D` | `success.400` | `#4ADE80` |
| `success-border` | `success.600` | `#15803D` | `success.400` | `#4ADE80` |
| `success-tint` | `success.100` | `#DCFCE7` | `success.900` | `#14532D` |
| `warning-bg` | `warning.50` | `#FFFBEB` | `warning.950` | `#451A03` |
| `warning-text` | `warning.800` | `#92400E` | `warning.200` | `#FDE68A` |
| `warning-icon` | `warning.600` | `#B45309` | `warning.400` | `#FBBF24` |
| `warning-border` | `warning.600` | `#B45309` | `warning.400` | `#FBBF24` |
| `warning-tint` | `warning.100` | `#FEF3C7` | `warning.900` | `#78350F` |
| `danger-bg` | `danger.50` | `#FFF1F2` | `danger.950` | `#4C0519` |
| `danger-text` | `danger.800` | `#9F1239` | `danger.200` | `#FECDD3` |
| `danger-icon` | `danger.600` | `#BE123C` | `danger.400` | `#FB7185` |
| `danger-border` | `danger.600` | `#BE123C` | `danger.400` | `#FB7185` |
| `danger-tint` | `danger.100` | `#FFE4E6` | `danger.900` | `#881337` |
| `info-bg` | `info.50` | `#EFF6FF` | `info.950` | `#172554` |
| `info-text` | `info.800` | `#1E40AF` | `info.200` | `#BFDBFE` |
| `info-icon` | `info.600` | `#1D4ED8` | `info.400` | `#60A5FA` |
| `info-border` | `info.600` | `#1D4ED8` | `info.400` | `#60A5FA` |
| `info-tint` | `info.100` | `#DBEAFE` | `info.900` | `#1E3A8A` |
| `bg-raised` | `neutral.0` | `#FFFFFF` | `neutral.800` | `#27272A` |
| `bg-sunken` | `neutral.100` | `#F4F4F5` | `neutral.950` | `#09090B` |
| `bg-pressed` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `bg-disabled` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `bg-inverse` | `neutral.900` | `#18181B` | `neutral.100` | `#F4F4F5` |
| `text-on-inverse` | `neutral.0` | `#FFFFFF` | `neutral.950` | `#09090B` |
| `text-disabled` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `text-brand` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `text-on-brand` | `neutral.0` | `#FFFFFF` | `neutral.0` | `#FFFFFF` |
| `border-strong` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `border-selected` | `brand.600` | `#CD1722` | `brand.300` | `#FF9BA0` |
| `icon-brand` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `icon-disabled` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `action-primary-border` | `brand.600` | `#CD1722` | `brand.400` | `#F9646D` |
| `action-primary-border-hover` | `brand.700` | `#AB1420` | `brand.400` | `#F9646D` |
| `action-primary-border-pressed` | `brand.800` | `#8E1621` | `brand.400` | `#F9646D` |
| `action-ghost-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `action-ghost-hover` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `action-ghost-pressed` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `action-ghost-fg` | `neutral.700` | `#3F3F46` | `neutral.200` | `#E4E4E7` |
| `nav-divider` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `nav-icon` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `nav-selected-icon` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `input-hover-border` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `input-focus-border` | `brand.700` | `#AB1420` | `brand.300` | `#FF9BA0` |
| `input-disabled-bg` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `input-disabled-fg` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `input-readonly-bg` | `neutral.50` | `#FAFAFA` | `neutral.950` | `#09090B` |
| `input-readonly-fg` | `neutral.600` | `#52525B` | `neutral.300` | `#D4D4D8` |
| `input-invalid-border` | `danger.600` | `#BE123C` | `danger.400` | `#FB7185` |
| `input-invalid-text` | `danger.800` | `#9F1239` | `danger.200` | `#FECDD3` |
| `input-invalid-bg` | `danger.50` | `#FFF1F2` | `danger.950` | `#4C0519` |
| `control-unchecked-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `control-unchecked-border` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `control-checked-bg` | `brand.600` | `#CD1722` | `brand.600` | `#CD1722` |
| `control-checked-mark` | `neutral.0` | `#FFFFFF` | `neutral.0` | `#FFFFFF` |
| `control-checked-border` | `brand.600` | `#CD1722` | `brand.400` | `#F9646D` |
| `table-header-bg` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `table-header-text` | `neutral.700` | `#3F3F46` | `neutral.200` | `#E4E4E7` |
| `table-row-bg` | `neutral.0` | `#FFFFFF` | `neutral.900` | `#18181B` |
| `table-row-alternate-bg` | `neutral.50` | `#FAFAFA` | `neutral.950` | `#09090B` |
| `table-row-hover-bg` | `neutral.100` | `#F4F4F5` | `neutral.800` | `#27272A` |
| `table-row-selected-bg` | `brand.50` | `#FFF1F2` | `brand.950` | `#430A10` |
| `table-text` | `neutral.900` | `#18181B` | `neutral.50` | `#FAFAFA` |
| `table-border` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `tooltip-bg` | `neutral.900` | `#18181B` | `neutral.100` | `#F4F4F5` |
| `tooltip-text` | `neutral.0` | `#FFFFFF` | `neutral.950` | `#09090B` |
| `selection-bg` | `brand.100` | `#FFE0E2` | `brand.900` | `#761923` |
| `selection-text` | `brand.950` | `#430A10` | `brand.50` | `#FFF1F2` |
| `skeleton-base` | `neutral.200` | `#E4E4E7` | `neutral.800` | `#27272A` |
| `skeleton-highlight` | `neutral.100` | `#F4F4F5` | `neutral.700` | `#3F3F46` |
| `scrollbar-thumb` | `neutral.500` | `#71717A` | `neutral.400` | `#A1A1AA` |
| `scrollbar-track` | `neutral.100` | `#F4F4F5` | `neutral.900` | `#18181B` |
| `chart-grid` | `neutral.200` | `#E4E4E7` | `neutral.700` | `#3F3F46` |
| `chart-axis` | `neutral.600` | `#52525B` | `neutral.400` | `#A1A1AA` |
| `chart-7` | `cyan.700` | `#0E7490` | `cyan.300` | `#67E8F9` |
| `chart-8` | `brand.950` | `#430A10` | `brand.100` | `#FFE0E2` |
| `destructive-pressed` | `danger.950` | `#4C0519` | `danger.950` | `#4C0519` |
| `destructive-border` | `danger.600` | `#BE123C` | `danger.400` | `#FB7185` |
| `destructive-border-hover` | `danger.800` | `#9F1239` | `danger.400` | `#FB7185` |
| `destructive-border-pressed` | `danger.950` | `#4C0519` | `danger.400` | `#FB7185` |

## Complete component mapping

| Component token | Semantic role |
|---|---|
| `button-primary-background` | `action-primary-bg` |
| `button-primary-background-hover` | `action-primary-hover` |
| `button-primary-background-pressed` | `action-primary-pressed` |
| `button-primary-label` | `action-primary-fg` |
| `button-primary-border` | `action-primary-border` |
| `button-primary-border-hover` | `action-primary-border-hover` |
| `button-primary-border-pressed` | `action-primary-border-pressed` |
| `button-secondary-background` | `action-secondary-bg` |
| `button-secondary-label` | `action-secondary-fg` |
| `button-secondary-border` | `action-secondary-border` |
| `field-background` | `input-bg` |
| `field-value` | `input-fg` |
| `field-placeholder` | `input-placeholder` |
| `field-border` | `input-border` |
| `field-border-focus` | `input-focus-border` |
| `navbar-background` | `nav-bg` |
| `navbar-text` | `nav-text` |
| `sidebar-background` | `nav-bg` |
| `sidebar-text` | `nav-text` |
| `sidebar-item-selected-background` | `nav-selected-bg` |
| `sidebar-item-selected-text` | `nav-selected-text` |
| `sidebar-item-selected-indicator` | `nav-selected-indicator` |
| `card-background` | `bg-surface` |
| `card-border` | `border-default` |
| `dialog-background` | `bg-raised` |
| `dialog-title` | `text-primary` |
| `checkbox-background-checked` | `control-checked-bg` |
| `checkbox-mark` | `control-checked-mark` |
| `checkbox-border-checked` | `control-checked-border` |
| `badge-success-background` | `success-bg` |
| `badge-success-text` | `success-text` |
| `badge-warning-background` | `warning-bg` |
| `badge-warning-text` | `warning-text` |
| `badge-danger-background` | `danger-bg` |
| `badge-danger-text` | `danger-text` |
| `badge-info-background` | `info-bg` |
| `badge-info-text` | `info-text` |
| `table-header-background` | `table-header-bg` |
| `table-header-label` | `table-header-text` |
| `table-cell-text` | `table-text` |
| `focus-ring` | `focus-ring` |
| `focus-gap` | `focus-gap` |
