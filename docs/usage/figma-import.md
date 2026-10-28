# Import the SIS tokens into Figma

The pipeline generates a Figma-ready token file at
`packages/sis-tokens/dist/tokens-studio.json` (W3C DTCG, with light and dark
values inside `sys.color.light` / `sys.color.dark`). A copy also ships in
`sis-foundations-prototype/public/exports/` and in `~/Downloads`.

## Import with Tokens Studio (five minutes)

1. Open the SIS workspace file in Figma.
2. Run **Resources → Plugins → Tokens Studio for Figma**. Install it once if missing.
3. In the plugin: **Tokens → Import → Paste JSON**, and paste the contents of
   `tokens-studio.json`.
4. Map the token groups: `ref.color` as primitive collections, `sys.color.light`
   and `sys.color.dark` as the Light and Dark modes of one semantic collection.
   The `component` aliases map to the component scopes.
5. Choose **Create variables** (or styles), then apply the Light/Dark modes to
   the frame.
6. Verify against `foundations/sis-ejust-figma-modes.csv`: the reference red
   stays `#EA232B`, and every role resolves per mode.

## Verify after import

- Light mode canvas background resolves to `#FAFAFA` (bg-canvas).
- Dark mode resolves to `#09090B`.
- The primary action color resolves to `#CD172B`'s ramp neighbor `#CD1722`
  (brand 600).
- The E-JUST reference red `#EA232B` appears as `ref.color.brand.500`.

## Cross-check the modes

`sis-ejust-figma-modes.csv` lists every semantic role with its light and dark
references and hex values. After import, spot-check ten rows against the
Figma variables panel. A mismatch means the JSON changed; re-run
`npm run build -w packages/sis-tokens` and re-import.
