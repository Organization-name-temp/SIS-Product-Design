# SIS typography decisions

Confirmed on 27 October 2026.

Use IBM Plex Sans Arabic for Arabic, English, and French.
Keep Noto Sans Arabic and Cairo available for the final visual comparison.
Adham can change the selected family after that comparison.

## Approved weights

| Weight | Use |
|---|---|
| 400 | Body text, help text, and table values |
| 500 | Labels, navigation, and buttons |
| 600 | Headings and important values |
| 700 | Limited emphasis |

Font sizes and line heights are approved as the prototype baseline.
Start with zero added letter spacing. Interface numbers use international digits in every language.
The weight rules apply to both light and dark themes.

## Approved role scale

Values below assume a 16px browser root. CSS uses rem units and does not fix the root size.
Arabic receives additional line height where the approved scale requires it.
The final visual review can change the baseline after comparison.

| Role | Size | Weight | Latin line height | Arabic line height |
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

Use `--sys-font-size-body`, `--sys-font-weight-body`, and `--sys-line-height-body` for the body role.
Other roles follow the same naming pattern.
Declare the actual language with the `lang` attribute on the document and on mixed-language passages.
The language scopes replace line-height values without changing role names.
Font selection remains independent of language and theme.
Use comfortable spacing by default. Compact tables keep the approved text sizes.

## Final prototype requirements

Provide one font selector with IBM Plex Sans Arabic, Noto Sans Arabic, and Cairo.
Keep the same content, widths, roles, and theme during each comparison.
Include Arabic, English, French, mixed-script content, numbers, forms, navigation, and a table.
Show the approved weights in both themes.
Check Arabic shaping, diacritics, French accents, small text, number distinction, zoom, and wrapping.
Review each family's metrics before the final choice.
Confirm that each actual font loads before the comparison. A fallback font must not appear as a candidate.

The selector changes `data-font` between `ibm`, `noto`, and `cairo`.
Components use `--sys-font-family-ui` and the named weight tokens.
Font selection is independent of `data-theme` and `data-brand`.

## Files and status

- [Typography tokens and prototype checklist](sis-typography.tokens.json)
- [Family and weight CSS](sis-typography.css)

These files define the prototype inputs. They do not load font files or create the visual prototype.
The visual comparison remains the final foundation step.

## Sources

- [IBM Plex Sans Arabic](https://github.com/google/fonts/tree/main/ofl/ibmplexsansarabic)
- [Noto Sans Arabic](https://github.com/google/fonts/tree/main/ofl/notosansarabic)
- [Cairo](https://github.com/google/fonts/tree/main/ofl/cairo)

## Number display

Adham confirmed international digits, 0 through 9, for Arabic, English, and French interfaces.
Generated Arabic interface numbers must not use Arabic-Indic digits.
The numbering system is `latn`. Decimal and grouping separators follow the selected locale.
Identifiers retain their original characters and do not receive quantity formatting.
Isolate numbers and identifiers in mixed-direction content. Do not reverse their character order.
The font comparison can show other numeral glyphs as a coverage check only, not as the selected interface format.
