# Contributing to the SIS design system

The design owner, Adham, approves every design decision. Contributions ship
through pull requests, and CI must stay green.

## Quality gates

Run these from the repo root before you finish. Every gate must pass.

```
npm test -w packages/sis-tokens       # token contract parity
npm run typecheck -w packages/react   # strict types
npm run lint -w packages/react        # token-only colors, no raw hex
npm test -w packages/react            # unit + axe accessibility
npm run test:visual -w packages/react # visual baselines, RTL, themes, density
cd sis-foundations-prototype && npm run verify   # workbench contract
```

## Rules

1. Tokens decide. No raw hex or pixel color literals in component code or
   styles; the linters block them. Values come from `foundations/` only.
2. Write the test first for every component or behavior change (TDD).
3. Accessibility is the floor: WCAG 2.2 AA, keyboard first, visible focus.
4. RTL uses logical properties only. Every visual change is verified in both
   directions, both themes, and both densities.
5. New decisions go through the design owner. Record approved decisions in
   `docs/decisions/decision-log.md`; architecture decisions get an ADR under
   `docs/decisions/adr/`.
6. Component APIs stay stable once released. Deprecate before you remove, and
   label maturity (experimental, stable, deprecated) on every docs page.
7. Version and changelog every package change with a changeset
   (`npx changeset`).
8. Keep docs honest. Never claim designed, verified, or approved without a
   link that proves it.
