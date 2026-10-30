# SIS design ↔ code workflow

This file is the entry point for every future chat that touches the design-to-code
channel. Read it fully before acting. It exists so no session re-scans or
re-derives context: the state, the connections, the workflows, and the rules are here.

Last updated: 2026-10-29.

## The channel in one paragraph

The design system lives twice: canonical tokens in `foundations/` (DTCG) drive the
code side (packages, tests, docs), and Tokens Studio + Figma variables drive the
design side. When Adham changes the design in Figma, the agent fetches the changed
nodes through the Figma MCP, compares them against the code and the saved baseline,
and updates the code through the normal gates. When the code changes the design,
the agent regenerates tokens and re-imports through Tokens Studio. The comparison
baseline lives at `qa/figma-baseline.json`; the sync plugin at
`tools/figma-sync-plugin/` builds and diffs it.

## Connections (verified working)

| Need | How |
|---|---|
| Read design context, metadata, screenshots | Figma desktop Dev Mode MCP, wired as `figma-local` at `http://127.0.0.1:3845/mcp` (figma-wire client: `bash ~/.agents/skills/figma-wire/scripts/figma-wire.sh tools --json`). Tools: `get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs`. Call `get_metadata` without a node to list pages. |
| Drive the Figma desktop UI | computer-use (`agent.computerUse`), **event-strategy clicks only**: `app.click(index, { strategy: "event" })`. Plain a11y clicks do nothing in Figma. |
| Beat index churn | Full `getAXState({ emit: false })`, regex the index from the snapshot text, click that index immediately. Never reuse indices from an older observation. |
| File key | `V4PQwf3QN4E5yETXDuvWuc` ("SIS - Product Design Workspace"). Desktop app is normally open on it. |
| Tokens in the plugin | Tokens Studio for Figma v2.13.2, set `global`, 468 tokens in legacy format (source: `packages/sis-tokens/dist/tokens-studio-legacy.json`). |
| Figma variables | 462 variables in collection `global`: ref 100, sys light+dark 278, cmp 84. |

## Workflow A — design changed in Figma, update the code

1. Ask which page/node changed, or fetch `get_metadata` (no node) to list pages,
   then `get_metadata` + `get_design_context` on the changed node.
2. Compare against the code contract: the component in `packages/react/src/`, the
   tokens in `foundations/`, and `qa/figma-baseline.json` (the saved design state).
3. Update the code: tokens first (`foundations/`), then regenerate
   (`npm run build -w packages/sis-tokens`), then components, then tests.
4. Run the gates listed in `AGENTS.md`. Every gate must pass.
5. Record what changed in `docs/decisions/decision-log.md` if it is a decision.

## Workflow B — code changed, update Figma

1. Regenerate token targets (`npm run build -w packages/sis-tokens`).
2. Open Tokens Studio in the Figma desktop app → JSON editor → replace the `global`
   set content with `packages/sis-tokens/dist/tokens-studio-legacy.json` → Save JSON.
3. Styles & Variables → Export to Figma → Confirm → Export to Figma (updates the
   462 variables).
4. For component changes, run the sync plugin (below) to rebuild the native
   Figma components, then re-export the baseline.

## Workflow C — the sync plugin

`tools/figma-sync-plugin/` is a local Figma plugin (Development → Import plugin
from manifest…). Its UI has three actions:

- **Build components** — creates/updates the native Figma components on the
  Core Components page from the embedded token values.
- **Copy baseline** — serializes the current component tree to JSON; save it as
  `qa/figma-baseline.json` and commit.
- **Compare with baseline** — paste the saved baseline; the plugin reports added,
  removed, and changed components.

That compare step is the design-to-code diff: run it after Adham edits the design,
and the report is the work list for Workflow A.

## Gotchas learned the hard way

- The in-app (guest) browser cannot log in to Figma. Use the desktop app or an
  external browser.
- Figma native menus ignore synthesized a11y clicks; event-strategy clicks work on
  plugin UIs and dialogs but not on the main menu bar. Use the AX tree for the main
  menu and event clicks inside plugins and dialogs.
- Native open panels: the search field accepts `setValue`; commit with the
  magnifier button, not Return (Return can close the panel without selecting).
- Tokens Studio's JSON editor takes the legacy format (`{name: {value, type}}`),
  not raw DTCG. The conversion lives in the git history of
  `packages/sis-tokens/dist/tokens-studio-legacy.json` and the generator pattern in
  this repo's session logs.
- Themes (true Figma modes from token sets) are Tokens Studio Pro. Light and dark
  currently live as parallel groups (`sys.color.light.*` / `sys.color.dark.*`).
- Do not paste the Figma personal access token into any output; it is stored at
  `~/.figma-pat` and lacks the variables scope, so REST variable writes are not
  available.

## State snapshot (update this date stamp when things change)

- 2026-10-30: 462 variables imported; tokens in plugin set `global`; the sync
  plugin (v2, full generator) is fixed and staged at
  `~/Downloads/sis-sync-plugin/` but NOT yet imported into Figma — the manifest
  networkAccess format was corrected (commit 7018f78). Import via Plugins →
  Development → Import plugin from manifest… → select
  `~/Downloads/sis-sync-plugin/manifest.json`, then run Build. React side
  complete through M6; output kits shipped in outputs/.
