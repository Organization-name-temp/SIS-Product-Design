# ADR-0001: Token pipeline, DTCG format, and package architecture

Status: Accepted, 2026-10-28. Deciders: Adham Haitham Eid (grilling round two), ZCode agent.

## Context

The expansion PRD requires multi-target token output (CSS, TypeScript, Tailwind preset, Figma) and multi-tenant theming. The canonical token files used a custom JSON shape, and two tools (the Python palette builder and the workbench token generator) both wrote overlapping outputs with different formatting.

## Decision

1. Canonical token files use the W3C design tokens format (DTCG, 2025.10). Provenance, component aliases, springs, recipes, and rules live under `$extensions`.
2. Style Dictionary v4 validates the canonical files in `packages/sis-tokens`. The package emits `sis-tokens.css`, `tokens.js`, a Tailwind v4 preset, and a Tokens Studio JSON for Figma. A parity test asserts the package CSS carries every variable the workbench generator emits.
3. Single-writer split: the Python builder (`tools/sis-build-palette.py`) validates contrast and writes the palette token file plus the contrast report. The workbench generator writes all CSS, the light and dark DTCG exports, the Figma CSV, and the app data. No output has two writers.
4. The linear easing keyword round-trips through `cubic-bezier(0, 0, 1, 1)`.
5. The package CSS appends the hand-maintained foundation variables (spacing, radius, targets, layout) from the workbench source so the two surfaces cannot drift.
6. Elevation and effect tokens mirror the committed theme-scoped shadow values; `sys.shadow.flat` stays generator-owned because `none` is not a valid DTCG shadow.

## Consequences

- Figma imports one generated JSON; new targets are config, not code.
- Every generated output is byte-identical to the pre-migration baseline; the migration is proven lossless.
- Package names carry no npm scope; publish stays gated until the org rename.
- Component behavior is hand-rolled (grilling round one); no primitive library dependency.
