# Design ↔ code comparison channel

Run this after every design change in Figma. The report it produces is the work
list for updating the code.

## Setup (once)

1. Figma desktop → **Plugins → Development → Import plugin from manifest…**
2. Select `tools/figma-sync-plugin/manifest.json` from this repository.
3. Run **Plugins → Development → SIS Sync**.

## Workflow C — compare design changes to the baseline

1. **Baseline (once, after a verified build):** open the plugin → **Build
   components** → **Copy baseline** → save the clipboard content as
   `qa/figma-baseline.json` → commit.
2. **After Adham changes the design in Figma:** open the plugin → **Compare with
   baseline** → paste the committed `qa/figma-baseline.json` → read the report:
   - **ADDED** — new components the design asks for; build them in
     `packages/react` (TDD, CONVENTIONS.md applies).
   - **REMOVED** — components to deprecate in code.
   - **CHANGED** — fill, size, or text drift; update the code to match, run the
     gates, then rebuild components and re-export the baseline.
3. Re-export the baseline after the code is updated, and commit both.

The rule: the baseline in `qa/figma-baseline.json` is the last design state the
code was verified against. Everything the compare reports is the delta Adham
reviewed and approved in Figma.
