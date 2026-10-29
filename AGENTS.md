# AGENTS.md: SIS design system repository

Applies to every person and every AI tool working in or consuming this repository.

## What this repository is

The SIS design system: canonical design tokens in the W3C design tokens format (DTCG), a Style Dictionary build, a React component library, dashboard patterns, an AI assistant component family, and the interactive workbench. The design owner and sole approver is Adham Haitham Eid.

## Read before acting

1. [GLOSSARY.md](GLOSSARY.md) for the exact terms.
2. [docs/prd/design-system-expansion-prd.md](docs/prd/design-system-expansion-prd.md) for scope and non-goals.
3. [docs/decisions/decision-log.md](docs/decisions/decision-log.md) for decisions D01 to D23.
4. [docs/decisions/adr/0001-token-pipeline.md](docs/decisions/adr/0001-token-pipeline.md) for the token architecture.
5. [packages/react/CONVENTIONS.md](packages/react/CONVENTIONS.md) before writing any component code.
6. [docs/figma-workflow.md](docs/figma-workflow.md) before any Figma session: the design-to-code channel, connections, and workflows.

## Rules that are never optional

- Canonical token files live in `foundations/` and use DTCG (`$value`, `$type`). Never edit generated output by hand; regenerate instead.
- Tokens decide. No raw color literals in component code or styles. The linters enforce this.
- Every component: TDD (failing test first), jest-axe clean, keyboard operable, logical CSS properties for RTL.
- Visual changes must pass the Playwright baselines: both themes, both directions, both densities.
- Never claim designed, verified, or approved without a link that proves it.
- The design owner approves decisions; record them in the decision log.
- CI runs on every push: token parity, typecheck, lint, unit, visual, and the workbench `verify` gate.

## Commands

```
npm run build -w packages/sis-tokens          # rebuild token targets
npm test -w packages/sis-tokens               # parity tests
npm run typecheck -w packages/react
npm run lint -w packages/react                # stylelint + eslint (blocking)
npm test -w packages/react                    # vitest + axe
npm run test:visual -w packages/react         # Playwright baselines
cd sis-foundations-prototype && npm run verify
```

## Consuming the system (for agents writing product code)

- React: import components from `sis-react` (`packages/react/src/index.ts`); load `sis-tokens.css` then `sis-react.css`.
- Any stack: load `packages/sis-tokens/dist/sis-tokens.css` and use the `--sys-*` variables.
- Tailwind: use `packages/sis-tokens/dist/tailwind-preset.js`.
- Figma: import `packages/sis-tokens/dist/tokens-studio.json` (see `docs/usage/tenant-brand-onboarding.md`).
- Machine-readable component docs for AI tools: [llms.txt](llms.txt) and [docs/ai/sis-react.md](docs/ai/sis-react.md).
