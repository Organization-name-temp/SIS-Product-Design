# SIS foundation contract

Current active profile updated on 28 October 2026. Earlier versions remain in the project archive.
Status: approved prototype baseline, subject to the final visual review.

Adham is the sole design approver.
The direction is formal, friendly, and practical.
Foundations come first. The visual comparison is the final foundation step.

## Brand and themes

Use the E-JUST reference red supplied by Adham, `#EA232B`.
Use separate reference, semantic, and component token layers.
Component names stay the same in light and dark themes.
Brand, theme, font candidate, language, and density remain separate choices.

The theme choices are light, dark, and system.
The selected brand is E-JUST. Another university requires its own reviewed palette.
The system preference follows the operating system. Explicit theme choices take precedence.

[The color contract](sis-ejust-palette.md) defines the complete palette and mode mapping.

## Typography

Use IBM Plex Sans Arabic for Arabic and English.
The active system offers no alternative font family.
Earlier Noto, Cairo, and French proposals remain archived.

| Role | Reference size | Weight | Latin line height | Arabic line height |
|---|---|---|---|---|
| page-title | 28px | 600 | 36px | 40px |
| section-heading | 20px | 600 | 28px | 32px |
| subsection-heading | 18px | 600 | 26px | 30px |
| body | 16px | 400 | 24px | 28px |
| field-label | 14px | 500 | 20px | 24px |
| help | 14px | 400 | 20px | 24px |
| button | 14px | 500 | 20px | 24px |
| navigation | 14px | 500 | 24px | 24px |
| table-heading | 14px | 500 | 20px | 24px |
| table | 14px | 400 | 20px | 24px |

Use weight 700 for limited emphasis.
Use relative units. Reference pixel values assume a 16px browser root.
Start with zero added letter spacing.
Compact density reduces surrounding space rather than text size.
Check Arabic marks, English letter clarity, font metrics, wrapping, and small-text clarity during review.

## Numbers and language

Generated interface numbers use international digits, 0 through 9, in both active languages.
Arabic interfaces do not use Arabic-Indic digits for generated quantities.
Decimal and grouping separators follow the selected locale.
Identifiers retain their original characters and do not receive quantity formatting.
Isolate identifiers and numeric strings in mixed-direction content.
The document and mixed-language passages declare their actual language and direction.

## Spacing and density

Use named spacing values of 0, 2, 4, 6, 8, 12, 16, 24, 32, 48, and 64px.
These are selected multiples of the 2px base.
Comfortable density is the default. Staff tables can use compact density.
Keep readable text and reachable controls in both density modes.

## Corners

| Role | Radius |
|---|---|
| Small elements | 4px |
| Buttons and form controls | 8px |
| Cards and panels | 12px |
| Dialogs and larger containers | 16px |
| Avatars | Circle |

Coordinate nested radii to keep borders aligned.

## Icons

Use Lucide outline icons at 16px, 20px, and 24px.
The native design uses a 24px canvas, 2px strokes, round joins, and round caps on open paths.
Source: [Lucide specification](https://lucide.dev/contribute/icons/specification).

Keep the native proportions initially. Check the smaller sizes during visual review.
Use icons where they improve recognition or communicate meaning.
Keep visible text labels where useful.
Give icon-only controls an accessible name on their interactive wrapper.
Decorative icons must not duplicate text announcements.

## Controls, borders, and focus

Interactive targets have a minimum 44 by 44px area.
Adjacent interaction areas must not overlap.
Comfortable controls start at 48px height. Compact controls start at 44px height.
Controls grow for wrapped labels or larger text.

Standard borders use 1px. Keyboard focus uses a 2px ring with a 2px gap.
Invalid and selected states use an icon, label, or state marker alongside color.
The 2px spacing base does not prohibit 1px borders.

## Elevation

| Level | Geometry | Light opacity | Dark opacity | Use |
|---|---|---|---|---|
| Flat | None | None | None | Pages, fields, tables, ordinary cards |
| Low | 0 4px 16px 0 | 12% | 40% | Menus, dropdowns, popovers |
| High | 0 8px 24px 0 | 16% | 48% | Dialogs and floating panels |

The shadow color is neutral #09090B.
Dark mode uses lighter raised surfaces and clear borders for the main separation.
Check composited effects during the final visual review.

## Responsive layout

| Layout | Minimum viewport width | Columns | Outer padding | Column gap |
|---|---|---|---|---|
| Narrow | 0px | 4 | 16px | 16px |
| Medium | 768px | 8 | 24px | 24px |
| Wide | 1200px | 12 | 32px | 24px |

Grids guide alignment. Forms and tables can span multiple columns.
Layouts follow Arabic direction and allow text to wrap.
Navbar and sidebar behavior belongs to component design after the foundation review.

## Motion

Use 120ms for small hover and pressed transitions.
Use 180ms for menus, dropdowns, and small expanding sections.
Use 240ms for dialog and panel entry or exit.
Focus indicators and pending feedback appear immediately.
Motion never delays interaction or confirmed results.
Theme changes remain immediate.
Reduced-motion preferences remove non-essential movement.
The expanded motion registry defines durations, easing curves, springs, and interaction recipes.
Adham authorized this expansion on 28 October 2026. Exact new profiles are versioned implementation defaults.
Use sis-motion.tokens.json and sis-motion.css as the motion source.

## Proposed final comparison

The prototype is a foundation playground.
It demonstrates the rules through representative interface samples rather than a complete SIS workflow.
Its proposed controls select theme, font family, language, and density independently.
It includes typography samples, palette roles, spacing, radii, icon sizes, control states, and a small table.
It includes a simple navbar and sidebar specimen to evaluate tokens and text fit.
Those specimens do not approve product navigation, routes, permissions, or information architecture.

Show a sample form, validation feedback, keyboard focus, a dropdown, and a dialog.
Compare narrow, medium, and wide layouts.
Keep text and layout constant during font comparison.
Use actual loaded fonts and the selected icon family.
Provide representative Arabic and English copy with international digits.
Make sample data explicit. Avoid claims about completed SIS features.

The sample content and prototype scope require the consolidated review below.
The prototype must record defects and corrections before final acceptance.

## Files and verification

- [Shared stylesheet](sis-foundations.css)
- [Machine-readable foundation decisions](sis-foundation-decisions.json)
- [Color tokens](sis-ejust-palette.tokens.json)
- [Typography tokens](sis-typography.tokens.json)
- [Typography rules](sis-typography.md)
- [Theme preference helper](sis-theme.js)

The existing color report contains 338 passing checks for specified solid-color pairs.
The theme helper and token aliases passed their earlier programmatic checks.
These results do not establish browser rendering quality or complete accessibility.
Browser checks, font rendering, icon optics, and the final visual review remain pending.

## Usage guidance and current profile

Every spacing, radius, and icon value has a documented use, visual example, and misuse rule.
Use sis-usage-guidance.json to inspect that guidance.
Responsive layouts support intermediate widths. Preview presets are inspection tools, not a device support limit.
Use comfortable density for reading and touch-first flows. Use compact density for dense staff work.
An explicit user choice takes precedence over the task recommendation.

The active motion scale includes 0, 80, 120, 180, 240, 320, and 480ms.
Named spring profiles have their own settling durations.
Support linear, ease-in, ease-out, ease-in-out, and emphasized curves.
Use restrained, responsive, and expressive spring profiles according to their documented purpose.
Prefer restrained motion in the SIS. Reserve expressive springs for explicit optional demonstrations.
Cancel interrupted animations. Reduced motion removes non-essential movement.
Do not delay focus, error messages, pending feedback, or confirmed values.

The current QA report records implementation checks. Adham retains final personal visual acceptance.
