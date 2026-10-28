# I am a test engineer

1. Selectors: components expose roles and labels, not test IDs. Prefer `getByRole`/`getByLabelText` exactly like `packages/react/tests/` does.
2. Visual baselines: `packages/react/tests/visual/` covers every component in both themes, both directions, both densities (16 baselines). Run `npm run test:visual -w packages/react`. A diff means a real visual change; review it and update baselines only after approval.
3. Accessibility: every component passes jest-axe. Re-run `npm test -w packages/react` after any change. For whole pages use the accessibility skills: scan for automated tiers, inspect for keyboard and screen-reader work.
4. Sample data: fixtures use realistic SIS data (MATH 201, E-JUST addresses). Reuse `visual/main.tsx` as the smoke page.
