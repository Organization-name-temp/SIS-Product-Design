# I am a frontend engineer

1. Load the styles once, in this order:
   ```html
   <link rel="stylesheet" href="sis-tokens.css">
   <link rel="stylesheet" href="sis-react.css">
   ```
   In a bundler, import `sis-tokens/dist/sis-tokens.css` then `sis-react/src/styles/sis-react.css`.
2. Import components from `sis-react/src/index.ts`. Every export is a plain named export.
3. Set the root attributes once: `data-theme="light|dark|system"`, `data-density="comfortable|compact"`, `dir`, `lang`. Use `SISTheme.setTheme()` from `foundations/sis-theme.js`.
4. Copy examples from [docs/ai/sis-react.md](../ai/sis-react.md). Every component is keyboard operable, axe-clean, RTL-ready.
5. Rules: use `--sys-*` semantic tokens in your own CSS, never raw hex. New decisions go through the design owner.
