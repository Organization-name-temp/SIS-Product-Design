# SIS design system: expansion to the base system for all SIS work

## Goal

Make the design system the single base for every upcoming SIS surface and every engineer role: tokens first, multi-tenant theming as a core requirement, a production React library, dashboards and admin patterns, docs and enforcement that make all developers, testers, and AI engineers use it. A PRD written with the PRD skill governs the work. You get grilled on every detail in rounds; you can accept a whole round at once or override any answer.

## Locked decisions (your answers)

1. React only for the component library. Neutral token exports; native packages wait for the R1 mobile decision.
2. Styling: plain CSS on token variables, zero runtime styling dependencies, optional Tailwind v4 preset.
3. Multi-tenant theming is core: brand reference values separate from semantic roles, so any university brand maps onto the same roles at runtime. E-JUST stays brand one.
4. The workbench becomes the developer docs site: catalog, API reference, usage guidance, exports, in one app that dogfoods the packages.
5. Enforcement is gradual: token lint rules as warnings plus a review checklist first, CI-blocking after the pilot.
6. Figma: Tokens Studio JSON bridge now; component library later (KAN-217).
7. First-release surface: dashboards and admin patterns. Landing pages, email templates, and presentation plus print profiles become named backlog epics. (Round-two defaults; veto at the M0 grilling round.)

## PRD and write skills

No `/write-prd` skill exists on this machine. I map it to `prd-assistant` (full PRD: background research, competitor analysis, personas, Mermaid flows, Markdown plus PDF). `write-core` and `write-docs` govern every sentence. `write-glossary` extends GLOSSARY.md. `write-jira` writes the stories. `write-report` writes each milestone delivery report.

The PRD lands at `docs/prd/design-system-expansion-prd.md` with: problem statement, five engineer personas (frontend, backend, integration, test, AI) and the solo designer, requirements per surface (web app, dashboards, admin, landing, email, presentation, print, mobile-later), non-functional requirements (WCAG 2.2 AA, AR RTL + EN LTR, comfortable and compact density, light and dark and system, per-tenant theming, AI-readiness), success metrics from the Untitled UI set (adoption rate, detach rate, time to ship, consistency issues), risks, and milestones.

## Grilling protocol

At the start of every milestone I run one `grilling` round on that milestone's full decision frontier: token names, API naming, folder layout, component props, export shapes, release choices. Every question carries my recommended answer. You answer per question or accept the round. Execution of that milestone starts after your round closes. This is how "grill me on every single detail" stays practical.

## Skill installation (M0)

Clone `Trystan-SA/claude-design-system-prompt` (MIT) and install its 14 skills as `~/.agents/skills/<name>/SKILL.md`: discovery-questions, frontend-aesthetic-direction, wireframe, make-a-deck, make-a-prototype, make-tweakable, generate-variations, design-system-extract, component-extract, accessibility-audit, ai-slop-check, hierarchy-rhythm-review, interaction-states-pass, polish-pass. Verify ZCode discovery. The gates then run on all output.

## Gate stack (runs on every component batch and every surface)

Build → vitest + testing-library + jest-axe → accessibility-scan then accessibility-inspect → Playwright visual regression → interaction-states-pass → hierarchy-rhythm-review → ai-slop-check and unslop on all UI copy → impeccable bounded polish → design-audit on full screens → caveman-review plus ponytail-review on PRs → visual-judge on rendered specimens → web-gui-tester on flows → accessibility-diff in CI.

## Phases

**M0 — Setup, PRD, grilling.** Install the 14 skills. Run `prd-assistant` to produce the PRD. Run the first grilling round: round-two defaults (surfaces, AI surface, test kit, npm scope), component primitive base (React Aria Components recommended over Radix for RTL and locale strength), npm workspace layout, monorepo naming, and the milestone order. Then execute autonomously.

**M1 — Research synthesis and direction.** `docs/research/` synthesis of the seven sources with per-claim citations, plus each Trystan gate named as a project gate. Then the brand-aware flow (`design-system-extract → generate-variations → polish-pass`) inside the approved brand: E-JUST red #EA232B, IBM Plex, formal, friendly, practical (D02), AR RTL + EN LTR. Three hi-fi variations of one test surface rendered in the workbench; you pick the direction.

**M2 — Token pipeline v2 with multi-tenant theming.** `foundations/*.tokens.json` stays canonical. New Style Dictionary v4 pipeline emits: current CSS variable files (contract preserved and checked), TypeScript token types, the Tailwind v4 preset, and Tokens Studio JSON for Figma. New token groups: elevation and shadows, z-index, opacity, breakpoints, state tokens. Brand layer: `--ref-color-brand-*` stays swappable per tenant; semantic roles never change per tenant. Outputs: tenant brand onboarding guide (how a second university maps its palette), Figma import guide, contract tests for every target.

**M3 — Component library pilot.** npm workspaces: `packages/tokens`, `packages/react`, `packages/tailwind-preset`; the workbench imports them (dogfooding). React 19 + TypeScript on React Aria Components (ADR records the choice). Pilot: buttons, text fields, badges, selection controls, dialog. Full state matrix (default, hover, active, disabled, focus-visible, loading), full test matrix (RTL × light/dark/system × density), visual regression, and workbench docs pages with live API reference.

**M4 — Full coverage and dashboards.** Remaining families in batches: containers, navigation, lists, tables, feedback, overlays, files, numbers, dates, identity, charts. Then dashboards and admin patterns: KPI cards, filter bars, data-table pages, settings forms, empty, error, and loading states. Token lint rules (stylelint plus ESLint) flip from warnings to CI-blocking here. Test kit ships: data-testid conventions, per-component a11y fixtures, visual baselines, testing recipes for RTL, themes, and density.

**M5 — Docs, governance, AI surface, release.** Workbench upgrade into the docs site: search, versioned pages, maturity labels (experimental, stable, deprecated), copy-paste examples, per-role entry pages (I am a frontend, backend, integration, test, or AI engineer). AI surface: llms.txt, structured component docs, and the AI-assistant component family (chat panel, messages, citations, streaming states) matching the R0.5 assistant in sis-docs. Governance: changesets, GitHub Actions CI (verify, test, visual, a11y-diff, build), contribution guide, code of conduct, ADR folder. npm publish prepared and gated on the org rename (one config flip).

**M6 — Backlog epics and delivery.** Jira epic E11 "Expand to the base design system" with stories per milestone. New named backlog epics so no surface is lost: E12 landing and marketing kit, E13 transactional email templates, E14 presentation plus print and PDF profiles (links existing E08), E15 tenant brand onboarding kit, E16 mobile packages after the R1 decision. Update `docs/jira/` records, README, usage guide, glossary, and memory. Delivery report per `write-report`.

## Engineer-role support map

- Frontend: `packages/react`, TypeScript types, docs pages, copy-paste examples.
- Backend: token CSS with no React required, email templates later, lint rules for any HTML they ship.
- Integration: Tailwind preset, export bundle, CDN-ready CSS build, Tokens Studio JSON.
- Test: test IDs, a11y fixtures, visual baselines, recipes doc.
- AI: llms.txt, structured docs, AI chat component family.

## Checkpoints with you

One grilling round per milestone start, the direction pick at M1, and anything irreversible: repo rename, npm publish, Sprint 1 changes.

## Risks

- Org name `Organization-name-temp` is temporary; npm scope isolated in one config value.
- Untitled UI Figma file structure stays unverified (login-blocked).
- Solo capacity: M3 is one sustained session; M4 batches ship independently.
- PRD-as-PDF is secondary; the Markdown PRD in the repo is the source of truth.
