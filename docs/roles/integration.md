# I am an integration engineer

1. CDN-ready CSS: `packages/sis-tokens/dist/sis-tokens.css` carries every token as CSS variables. Link it and use the variables in any stack.
2. Tailwind consumers: use `packages/sis-tokens/dist/tailwind-preset.js` (`@plugin` or preset import in Tailwind v4).
3. TypeScript tokens: `packages/sis-tokens/dist/tokens.js` exports a flat typed map.
4. Figma: import `packages/sis-tokens/dist/tokens-studio.json` into the Tokens Studio plugin. Light and dark modes map to the two exported files.
5. The export bundle with fonts lives in `sis-foundations-prototype/public/exports/`.
