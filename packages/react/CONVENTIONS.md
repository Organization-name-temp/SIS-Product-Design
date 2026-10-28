# sis-react component conventions (binding for all new families)

- React 19, TypeScript strict, function components, plain named exports.
- NO primitive library and NO new runtime dependencies. Hand-rolled keyboard,
  focus, and ARIA behavior (Dialog.tsx is the reference for overlays).
- Style NATIVE elements where possible (inputs, buttons). ARIA only where
  natives cannot express the pattern.
- Classes are prefixed `sis-`. Styles use ONLY token variables
  (`--sys-*`, `--ref-*`, `--cmp-*`) — never raw hex or px literals, except the
  shadow color `rgb(9 9 11 / <alpha>)` which matches the committed contract.
- Motion: use `--sys-motion-duration-fast/standard/slow` +
  `--sys-motion-easing-standard`; wrap decorative motion in
  `@media (prefers-reduced-motion: reduce)`.
- Density: scope compact overrides under `[data-density="compact"]`.
- RTL: logical properties only (margin-inline, inset-inline). Test fixtures
  rely on `dir` from the page, never on text direction assumptions.
- The V2 Soft-elevation face (D22): surfaces and popovers carry
  `box-shadow: var(--sys-shadow-low)` etc.; hover lifts are translateY(-1px).
- File layout per component: `src/<Name>.tsx`; styles per family in
  `src/styles/<family>.css`; tests in `tests/<family>.test.tsx`; a fixture
  section exported from `visual/sections/<family>.tsx`.
- TDD: write the failing test first (vitest + @testing-library + axe), watch
  it fail, then implement, then pass. Every component gets at least: render,
  interaction, axe-clean test.
- Run `npx vitest run tests/<family>.test.tsx` before reporting; full
  `npx vitest run` at the end; `npx tsc --noEmit` must stay clean.
- Never edit shared files: src/index.ts, src/styles/sis-react.css,
  visual/main.tsx — the controller wires those.
- Never commit; leave changes in the working tree. The controller commits.
- Never dispatch subagents.
