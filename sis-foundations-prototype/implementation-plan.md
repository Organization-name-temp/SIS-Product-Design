# SIS Foundations implementation and handoff plan

## Objective

Build an interactive reference for the approved SIS foundations, components, and reusable patterns.
Keep every interaction local. Preserve the existing Advisor applications.
Adham remains the sole design approver.

## Authority and change flow

The foundation contract controls colors, typography, spacing, radii, targets, icons, layers, and motion.
The canonical palette and typography files remain in the parent artifact folder.
The generator creates application snapshots and downloadable exports from those files.
The catalog contains no token editor. Later design requests update the canonical sources through chat.

The visual reference controls the sidebar, internal tabs, palette region, and inspector region.
Approved text sizes and token values take priority over approximate generated image details.

## Delivery units

| Unit | Delivered behavior | Acceptance evidence |
|---|---|---|
| Shell | Searchable groups, stable destinations, six internal tabs, settings, drawer | Catalog and browser checks |
| Foundations | Nine pages, token layers, contrast inspection, comparisons | Specimen checks and foundation tests |
| Components | Sixteen families, state controls, validation, keyboard interactions | Component browser tests |
| Patterns | Ten deterministic sample flows and recovery paths | Pattern browser tests |
| Handoff | Coverage links, decisions, review checklist, CSS, JSON, and Figma mapping | Export and runtime checks |

## State and presentation

Keep theme, language, density, and width independent. Use IBM Plex for both active languages.
Keep the main demonstration mounted during presentation changes.
Use isolated frames for comparisons and width inspection.
Reset clears sample values. Reload clears in-memory sample interactions.
Store only the existing theme preference. Comparison frames cannot overwrite that preference.
Share selected items, tabs, and presentation settings through URLs.
Exclude entered values from URLs.

Use international digits in every locale. Preserve record identifiers exactly.
Load all four IBM Plex weights from local files. Retain the font license.

## Verification plan

Check every catalog renderer and every named specimen marker.
Check translated metadata, token aliases, source consistency, fonts, and licenses.
Check all 338 approved contrast pairs against current source values.
Exercise primary controls on every page.
Exercise sorting, filtering, selection, validation, overlays, uploads, downloads, and recovery.
Check input retention through presentation changes.
Check keyboard focus, reduced motion, and mobile navigation.

Inspect desktop light, desktop Arabic dark, Arabic narrow, and table captures together.
Compare the visual source and implementation in combined images.
Use one batched visual review, one correction batch, and one confirmation pass.
Record expected differences and remaining limits in design-qa.md.

## Handoff boundary

The workbench demonstrates reusable design decisions and local interactions.
It has no accounts, database, analytics, or SIS integrations.
The project retains the Product Design starter runtime and build structure.
The preview stays open for Adham's review.
