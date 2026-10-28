# Active design options

This reference defines the supported choices as of 28 October 2026.
A deterministic system uses named values and explicit recipes. The same inputs select the same tokens and behavior.

## Presentation choices

| Dimension | Allowed choices | Rule |
|---|---|---|
| Theme | `light`, `dark`, `system` | System follows the operating system. Explicit URL selection wins over saved preference. |
| Font | `ibm` | IBM Plex Sans Arabic serves both languages. |
| Language | `en`, `ar` | English uses LTR. Arabic uses RTL. |
| Numbers | `latn` | Use digits 0–9. Format quantities by locale. Preserve identifier text. |
| Density | `comfortable`, `compact` | Recommend by task. Preserve an explicit user override. |
| Preview width | `auto`, `narrow`, `medium`, `wide` | Inspect responsive behavior at preset and intermediate widths. |
| Comparison | `none`, `themes`, `density` | Compare the same specimen. Do not modify canonical files. |
| Page section | Playground, Variants, States, Tokens, Usage, Accessibility | Preserve the selected page through presentation changes. |

Old French and alternative-font URLs normalize to English and IBM. The archive retains the earlier comparison work.
Inputs remain in memory during presentation changes. The URL contains configuration, not entered form values.
Only the main workbench saves theme preference. Comparison frames do not change that preference.

## Color and type

Use `sis-ejust-palette.tokens.json` as the color authority.
The reference red remains `#EA232B`. Primary actions use the accessible semantic action role.
Both themes expose identical semantic and component names.
Choose semantic roles by purpose. Do not choose a raw color for each new screen.

Use `sis-typography.tokens.json` for all ten approved roles.
Use weights 400, 500, 600, and 700. Roles define size, weight, and language-specific line height.
Keep the minimum reading sizes. Compact density does not make text smaller.

## Geometry choices

| Scale | Values | Selection rule |
|---|---|---|
| Spacing | 0, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64px | Use the named purpose from the usage guide. |
| Corners | 4, 8, 12, 16px, circle | Match the surface role. Reserve circles for identity shapes. |
| Icons | 16, 20, 24px | Match supporting, default, or prominent meaning. |
| Control minimum | Comfortable 48px, compact 44px | Allow wrapped content to grow. |
| Interaction target | At least 44 × 44px | Keep targets separate even when the icon is smaller. |
| Grid | 4, 8, 12 columns | Choose by available width and content. |
| Elevation | Flat, low, high | Use borders and surface colors as the main dark-theme separation. |

[Usage guidance](../../foundations/sis-usage-guidance.json) gives a use, example, and misuse rule for each scale value.
The workbench renders every value on its foundation page.

## Motion choices

| Type | Choices | Intended use |
|---|---|---|
| Duration | immediate 0, micro 80, fast 120, standard 180, slow 240, deliberate 320, emphasis 480ms | Select the smallest useful duration. |
| Easing | linear, ease-in, ease-out, ease-in-out, emphasized | Match progress, exit, entry, continuity, or emphasis. |
| Spring | restrained, responsive, expressive | Use bounded continuity. Expressive movement stays in optional demonstrations. |
| Recipe | action, navigation, selection, disclosure, overlay-enter, overlay-exit, feedback, spring-feedback | Reuse the recipe for equivalent behavior. |

[Motion tokens](../../foundations/sis-motion.tokens.json) define exact curves and physical parameters.
Identical parameters produce identical sampled keyframes. Replaced and unmounted animations cancel.
Reduced motion removes nonessential movement. Focus, pending feedback, errors, confirmed data, and theme changes remain immediate.
The new exact motion values are versioned implementation defaults under Adham's authorization.
They are not separate claims that Adham approved each numerical parameter.

## Choose a UI configuration

Select the task first. Select a documented component and its supported variant next.
Then select its applicable state, size, and icon placement.
Use the page controls to inspect allowed combinations. Use the reset action to restore the example.
Request new foundation values through a recorded change. Do not insert arbitrary values into each screen.
