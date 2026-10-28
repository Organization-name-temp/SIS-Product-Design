# Review tour: design system expansion

Date: 2026-10-28. Approval gate: Adham reviews before the Figma token import runs.

## Live apps

| App | URL | What to check |
|---|---|---|
| Showcase prototype | http://localhost:4680 | Four tabs: Dashboard (KPI cards, filter bar, sortable data table, charts), Admin (settings form, alerts), Assistant (chat with streaming and citations), Gallery (every family). Toggle Theme, Direction (RTL), and Compact at the top — the whole app re-renders live. |
| Workbench (design catalog) | http://localhost:4173 | The original foundations catalog: colors, typography, spacing, motion, and the review page. |

## Documentation to skim

| Doc | Path |
|---|---|
| Delivery report | docs/reports/2026-10-28-expansion.md |
| Component reference (machine-readable) | docs/ai/sis-react.md |
| Role pages | docs/roles/ (frontend, backend, integration, test, AI) |
| Outputs map | docs/usage/outputs.md |
| Token pipeline ADR | docs/decisions/adr/0001-token-pipeline.md |
| Decision log | docs/decisions/decision-log.md (D01-D23) |
| Agent entry points | AGENTS.md, llms.txt |
| Figma import guide | docs/usage/figma-import.md |

## Jira

- Epic E11: KAN-221 (In Progress) with stories KAN-222 to KAN-225 (three Done).
- Backlog epics E12 to E16: KAN-226 to KAN-230.

## Verification snapshot

88 unit tests with axe on every component. 16 visual baselines: light/dark ×
LTR/RTL × comfortable/compact. Typecheck clean. Token lint gates blocking.
CI workflow runs all gates on push. The token migration was proven
byte-identical to the pre-migration baseline.

## Pending your approval

The Figma token import via the Tokens Studio plugin in the Figma desktop app
(driven by computer use), then MCP verification of the variables. The
tokens-studio.json and the import guide are ready.
