# SIS design-system consolidation

Status: approved for implementation through Adham's instruction on 28 October 2026.
Owner and sole design approver: Adham.

## Outcomes

Preserve the project history in SIS-Product-Design. Publish the current design system and its verification evidence.
Create linked Jira epics and stories with evidence-based statuses. Retain later enhancements as backlog work.

## Approved active profile

- Keep light, dark, and system theme selection.
- Use IBM Plex Sans Arabic for every active language. Retain weights 400, 500, 600, and 700.
- Support Arabic with RTL and English with LTR. Keep international digits 0 through 9.
- Select comfortable or compact density by the user, task, and flow. Keep the existing interaction targets.
- Keep responsive web layouts at available widths. Preview presets inspect layouts and do not define supported device limits.
- Keep all ten approved typography roles.
- Keep all eleven approved spacing values. Add a specific use, example, and misuse rule for every value.
- Add equivalent usage examples for the radius and icon scales.
- Expand motion into a named, deterministic system with linear and eased transitions, spring profiles, and interaction recipes.
- Respect reduced motion. Keep focus, pending indicators, and confirmed data immediate.

## Motion implementation choices

Use a small versioned motion registry and browser animation APIs. Add no runtime dependency.
Retain 0, 120, 180, and 240ms. Add named 80, 320, and 480ms options for specific interaction needs.
Define linear, ease-in, ease-out, ease-in-out, and emphasized curves through exact cubic-bezier values.
Define restrained, responsive, and expressive spring profiles with explicit mass, stiffness, damping, sample rate, and duration.
Generate spring keyframes from a deterministic damped oscillator. Cancel replaced animations and clear them on unmount.
Use transforms and opacity for continuity. Do not animate every element continuously.
Apply named recipes to actions, navigation, selection, feedback, disclosures, and overlays.
Retain manual replay, cancellation, and reduced-motion inspection in the catalog.
Exact new motion values are implementation defaults under Adham's authorization. Record them separately from older explicit approvals.

## Archive-first repository

Preserve the initial repository commit and its README history.
Keep canonical sis-* files at the repository root. Keep the working prototype in sis-foundations-prototype.
Use docs for decisions, workflow, reports, option references, and Jira records.
Use assets for generated visual references. Use archive for previous proposals and original supplied text.
Preserve the earlier prototype through a versioned source archive. Exclude dependencies, build caches, and failed-run temporary files.
Index archived files by hash and provenance. Do not publish credentials, environment files, or internal agent instructions.
Retain historical findings as historical evidence. Current reports must identify their revision and tested scope.

## Jira delivery

Use the existing KAN project and inspect its fields and workflow before writes.
Check for matching design issues before creating any issue. Use stable design-record labels to prevent duplicates.
Create complete stories with acceptance criteria, blockers, evidence, and proposed relative estimates.
Use Done only for verified technical deliverables. Keep Adham's visual acceptance in progress until he completes it.
Keep presentations, document templates, Figma publication, and production package work in To Do.
Do not change unrelated engineering work or treat sample flows as production SIS capabilities.
Verify created keys, parents, links, and statuses. Preserve the returned mapping in the repository.

## Verification

Extend meaningful browser checks for the new active profile, usage examples, and motion controls.
Check spring reproducibility, endpoints, cancellation, and reduced-motion behavior.
Run TypeScript, catalog checks, build, runtime checks, and the complete browser suite.
Inspect desktop, Arabic dark, and narrow layouts in a bounded visual review.
Run separate standards and spec reviews before the final commit.
Publish the repository and retain the running local preview.

## Acceptance details from spec review

The exact publication target is https://github.com/Organization-name-temp/SIS-Product-Design.
Keep the initial e72b4350 commit. Verify the remote, branch, published commit, and included archive history.
Record source paths, SHA-256 hashes, provenance, and exclusions before replacing any local source.
Test the earlier prototype archive by extraction and hash comparison. Scan all new publication files and commits for credentials.

The spacing scale is 0, 2, 4, 6, 8, 12, 16, 24, 32, 48, and 64px.
The radius scale is 4, 8, 12, and 16px, plus circular avatars.
The icon scale is 16, 20, and 24px, with the approved 24px native canvas and 2px native stroke.
Every scale entry needs a named use, a real example, and a misuse rule.
IBM Plex Sans Arabic intentionally covers both Arabic and English. Confirm all four local font weights load.

Explicit URL theme selection takes precedence over the saved theme preference. System follows operating-system changes.
Only the main workbench saves theme preference. Comparison frames do not change it.
The user can override recommended task density through the utility control. A presentation change does not erase sample input.
Language, direction, density, and theme changes work without a reload. Old French or alternative-font URLs normalize to the active profile.
Check all catalog pages for overflow at a 320px viewport. Check English LTR and Arabic RTL in both themes through targeted combinations.

Require identical spring samples for identical parameters. First and last samples equal 0 and 1.
Require the unsnapped final sample to fall within 0.002 of the target.
A replacement animation cancels its predecessor. Unmount cancels outstanding animations.
Reduced motion uses immediate state changes. Essential pending feedback remains visible.
Map motion recipes to buttons, selected states, sidebar navigation, disclosures, toasts, and dialogs.

## Approved Jira epic groups

1. Establish the design foundation.
2. Inspect reusable foundations.
3. Exercise component behavior.
4. Demonstrate SIS patterns.
5. Verify and hand off the workbench.
6. Preserve the design project.
7. Establish deterministic output rules.
8. Produce reusable communication assets.
9. Connect design delivery tools.
10. Process later enhancements.

An epic is Done only when all its required stories are Done.
An epic is In Progress when work is active or when completed technical work still awaits required acceptance.
An epic remains To Do when all its stories are deferred.
Keep individual technical stories Done when evidence supports completion. Do not merge visual acceptance into their status.

Credential checks cover every commit reachable from the publication branch, including the retained e72b4350 initial commit.
