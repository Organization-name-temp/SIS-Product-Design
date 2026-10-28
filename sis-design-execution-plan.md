> Historical planning reference from 27 October 2026. Current language, font, and approval rules appear in docs/decisions/decision-log.md.

# SIS design execution plan

Prepared for Adham, solo product designer and product owner.
Prepared on 27 October 2026.
Status: proposed work plan for team review.

## Foundation decisions confirmed after this plan

Updated on 27 October 2026 from Adham's answers in this chat.

Adham is the sole design approver. Engineering approval does not gate this personal design work.
Foundations come first. A sample-form review precedes component and navigation design.
The direction is formal, friendly, and practical, with controlled university branding.
Spacing uses named values of 0, 2, 4, 6, 8, 12, 16, 24, 32, 48, and 64px.
Comfortable density is the default, with compact staff tables.
Typography uses named roles across Arabic and Latin text.
The initial radius scale is 4px, 8px, 12px, and 16px, with circular avatars as an exception.
Responsive layouts use 4 columns below 768px, 8 columns from 768px, and 12 columns from 1200px.
Outer padding uses 16px, 24px, and 32px respectively. Column gaps use 16px, 24px, and 24px.
The reference university color is #EA232B, supplied by Adham.
The latest request replaces light-only scope with interchangeable light and dark themes.
The visual comparison remains the final foundation step.
Lucide outline icons use 16px, 20px, and 24px sizes, with the native 2px stroke on a 24px canvas.
Interactive targets have a minimum 44 by 44px area in both density modes, without overlapping adjacent targets.
Controls have minimum heights of 48px in comfortable layouts and 44px in compact layouts, and grow for content.
Standard borders use 1px. Keyboard focus uses a 2px ring and a 2px gap.
Motion uses 120ms, 180ms, and 240ms durations. Focus indicators, pending feedback, and theme changes remain immediate.
Reduced-motion preferences remove non-essential movement.
Elevation uses flat, low, and high levels. Low shadows use 0 4px 16px 0; high shadows use 0 8px 24px 0.
Low opacity is 12 percent in light mode and 40 percent in dark mode.
High opacity is 16 percent in light mode and 48 percent in dark mode.
Invalid and selected controls use a label, icon, or state marker alongside color.
IBM Plex Sans Arabic is selected, with approved weights 400, 500, 600, and 700.
The final prototype will also compare Noto Sans Arabic and Cairo so Adham can change the family.
[Typography decisions and prototype requirements](sis-typography.md) record the selection.

[The current palette and theme contract](sis-ejust-palette.md) records the proposed color values and completed checks.
Earlier team-approval and light-only recommendations below remain historical proposals where these decisions replace them.

## Recommended action

Use the first week to agree how design enters development, establish the minimum design system, and review account activation and sign-in wireframes.
Use approximately 20 hours for this work, based on your capacity estimate on 27 October 2026.
Complete the first detailed design packet after the team resolves its open behavior and implementation questions.

The immediate decision is which user outcome the frontend team needs next.
The proposed starting outcome is M01 account activation and sign-in because related backend tickets already show activity.
Confirm this choice with the team before detailed design.

## Evidence and confidence

Observed during the source review in this chat on 27 October 2026:

- The Figma workspace contains ten empty pages. It has no local variables, text styles, or paint styles. Source: [Figma workspace](https://www.figma.com/design/V4PQwf3QN4E5yETXDuvWuc/SIS---Product-Design-Workspace).
- KAN-16 contains eight child tickets. Four show In Progress, and all eight have an assignee. Source: [M01 epic](https://adhamhaithameid.atlassian.net/browse/KAN-16).
- The team retains module-based delivery and phase gates. D-049 withdrew the slice-based delivery proposal. Source: [delivery workflow](https://github.com/Organization-name-temp/sis-docs/blob/main/07-project/delivery-workflow.md).
- Arabic, English, French, and genuine right-to-left layouts are current requirements. Source: [localization](https://github.com/Organization-name-temp/sis-docs/blob/main/02-shared/localization.md).
- The roadmap starts with tenancy, identity-access, and institution. Source: [roadmap](https://github.com/Organization-name-temp/sis-docs/blob/main/00-product/roadmap.md).

Assumed for this proposal: you can provide approximately 20 hours each week, with some variation.
You supplied this estimate on 27 October 2026.
The session budgets below are planning allowances, not measured task durations.

Inferred: M01 offers a useful first design exercise because it connects active work with reusable form and access patterns.
Confidence is medium for this starting order and low for completion dates.
The frontend team's immediate commitment could change the order.
The review did not establish the current frontend component inventory or implementation capacity.

## Working agreement

Use GitHub for product requirements and decisions, Jira for delivery work, and Figma for flows, screens, and component specifications.
Link these sources through the existing requirement and acceptance IDs.
Keep one canonical version of each screen.

Design one complex flow at a time.
Keep the next flow at wireframe level until the current flow passes review.
An early design review does not authorize the frontend phase to bypass module gates.

You own product scope, interaction choices, visual direction, and final design acceptance.
Engineering confirms component feasibility, API behavior, and technical constraints.
University staff supply institutional rules.
The QA owner confirms verification coverage with the team.

## Options

These costs and risks are planning judgments, not measured estimates.

| Option | Cost | Risk | Effect |
|---|---|---|---|
| Build a complete custom library first | High initial design effort | Speculative components delay the first reviewed flow | Broad coverage before evidence of use |
| Design screens independently | Low setup effort, repeated later effort | Screens diverge and require repeated corrections | Fast first drafts, weak reuse |
| Recommended: establish a small system through the first flow | Limited initial setup, repeated refinement | Requires regular design and code alignment | Produces screens and reusable components together |

Inspect existing implementation components before custom component work.
Use the first engineering review to agree which components you can reuse or adapt.

## Work sequence

1. Agree the next frontend outcome, review owners, and source links.
2. Map activation and sign-in, including account states and failure paths.
3. Establish the foundations and components those flows need.
4. Review wireframes before detailed visual work.
5. Complete relevant states, responsive behavior, and language examples.
6. Review the prototype with engineering and a representative user.
7. Prepare the design packet and resolve its blocking questions.
8. Review the implementation when the module reaches its frontend phase.

Next, design scoped access and its pre-save impact report through KAN-20 and KAN-21.
Then cover email administration, account lifecycle, bulk operations, and audit inspection through the remaining M01 tickets.
Maintain an outline of M20 provisioning and initial-administrator activation because these flows meet at the module boundary.

## Main risks and responses

- The frontend team needs M20 first. Confirm its next commitment before detailed M01 work, then change the design queue if necessary.
- Requirements remain open. Design the known behavior and record dependent screens as blocked.
- A component library lacks Arabic support. Review representative forms, dialogs, and tables before adoption.
- Design work exceeds available hours. Reduce visual polish and new component breadth before required states or language coverage.
- Screens receive approval without behavior review. Require API outcomes, permissions, and failure paths in the design packet.
- Source references disagree. Record each conflict and obtain an explicit decision before dependent design.

## First milestone

At the end of the first week, review the team agreement, the first flow maps, initial foundations, and activation/sign-in wireframes.
Record accepted decisions and remaining questions.
Use actual hours to adjust the next week's scope.

The following appendix defines the work sessions, outputs, responsibilities, and review criteria.

## Appendix A: the first 20-hour week

Use five four-hour sessions in your available work periods.
These sessions do not assume consecutive weekdays or a fixed start date.

### Session 1: agree the work, four hours

Your tasks:

- Spend one hour on the current M01 sources and the meeting agenda.
- Spend one hour with Shehab, Yasser, and Rouby on the immediate design and frontend priorities.
- Spend one hour on the decision record and unresolved questions.
- Spend one hour on the first design queue and source links.

Agree the following points:

- The next frontend module and its first user outcome.
- The reviewer for flows, visual design, and implementation behavior.
- Existing components, design tokens, and implementation constraints.
- Required API responses and unresolved behavior.
- The review channel and expected response period.
- The team's meaning of design-ready and implementation-verified.

Propose two business days for routine feedback.
Treat no response as pending review.
Keep the official module gate process separate from this feedback target.

What I prepare for you:

- A meeting agenda with specific decisions.
- A comparison of the current requirements and your proposed flow.
- A draft agreement and ordered design queue from the meeting notes you provide.

Exit evidence: a reviewed agreement, a named reviewer, and one selected starting outcome.
If the team cannot meet, complete a draft agreement and leave unconfirmed decisions open.

### Session 2: map behavior, four hours

Your tasks:

- Spend one hour on the requirement and acceptance references.
- Spend two hours on activation and sign-in flow maps.
- Spend one hour on a behavior review with engineering, or an asynchronous review request you send.

Map the main path and relevant alternatives:

- Invitation, intended-email verification, credential setup, and activation.
- Existing-account access without duplicate identity creation.
- Sign-in with administrator-configured email multi-factor authentication.
- Expired or failed verification and unavailable message delivery.
- An ineligible account and a rejected session.

Record recovery as a connected flow.
Keep its unspecified proofing procedure open until the team defines it.

What I prepare for you:

- Flow descriptions and a screen/state inventory.
- A requirement-to-screen coverage table.
- Questions about missing responses, transitions, and permissions.

Exit evidence: readable flow maps, linked source requirements, and a list of unresolved behavior.

### Session 3: initialize the design system, four hours

Your tasks:

- Spend one hour on the visual direction and reference material you select.
- Spend two hours on the initial design tokens and text styles.
- Spend one hour on Arabic, English, and French content examples.

A design token is a named reusable value, such as a text color or spacing value.
Start with these groups:

- Typography with compatible Arabic and Latin text.
- Semantic colors for text, surfaces, actions, borders, focus, and feedback.
- Spacing, control sizes, border widths, and corner radii.
- Form width, page spacing, and narrow-screen layout rules.
- Icon size, stroke treatment, and direction rules.

Choose values with the frontend engineers after the component review.
Keep brand colors separate from error and permission states.
Review university logo placement and the platform identity separately.
Treat dark mode and custom illustration work as proposals until the scope requires them.

What I prepare for you:

- A proposed token naming table and initial value options.
- A typography and direction checklist.
- A short visual specification based on your selected references.

Exit evidence: initial foundations applied to one representative form in both layout directions.
Mark unvalidated choices as proposed.

### Session 4: build components and wireframes, four hours

Your tasks:

- Spend two and a half hours on the first reusable components.
- Spend one and a half hours on activation and sign-in wireframes.

Start with buttons, links, text fields, password fields, labels, help text, alerts, and verification controls.
Add pending, focus, disabled, and error states where the behavior requires them.
Use automatic layout and reusable component instances.
Keep text flexible enough for Arabic and longer French labels.

Compose the wireframes from those components.
Choose an initial authenticated destination only after the team confirms its scope.
Keep the wider workspace navigation in a separate design task.

What I prepare for you:

- Component properties and state specifications.
- Draft screen content and annotation text.
- A check for missing states, inconsistent names, and duplicated components.

Exit evidence: reusable form components and a connected set of wireframes for the agreed flow.

### Session 5: review and prepare the next week, four hours

Your tasks:

- Spend one hour on the flow and component review with engineering.
- Spend one hour on the highest-priority corrections.
- Spend one hour on the design packet and next-work list.
- Reserve one hour for unresolved work or a representative-user walkthrough.

Review keyboard order, focus, message meaning, request failure, and direction changes.
Record the review result for each unresolved question.
Compare actual hours with the session allowances.

What I prepare for you:

- A review checklist and a summary of the feedback you provide.
- A revised design packet draft.
- A next-week queue based on remaining effort and dependencies.

Exit evidence: reviewed wireframes, initial reusable components, and an explicit next step for each blocking question.
Detailed screens remain a next-week task unless the first-week review and available time support them.

## Appendix B: design-system and Figma setup

Keep the existing file and page structure.
Populate each page only when the current work needs it.

| Existing page | Initial content |
|---|---|
| Cover & Design Governance | Sources, owners, decisions, review status, and naming rules |
| Foundations | Initial tokens, typography, spacing, direction, and accessibility rules |
| Core Components | Reusable components for activation and sign-in |
| Patterns | Verification, validation, recovery, and request feedback |
| Application Shell | Authentication layout and proposed workspace boundaries |
| Product Flows | Flow maps with Jira and requirement references |
| High-Fidelity Screens | Canonical detailed screens after wireframe review |
| Prototypes | Entry links to connected canonical screens |
| Handoff & QA | Design packet references and implementation findings |
| Archive | Superseded work with its replacement link |

For each flow, record the module, Jira ticket, requirement IDs, acceptance IDs, actor, access scope, screen links, and review status.
Preserve existing screen IDs.
Propose missing screen entries and corrections through the source review process.

Use Backlog, Flow, Wireframe, Detailed design, Review, Design-ready, and Implementation review as proposed design statuses.
These statuses supplement the module phase status.

## Appendix C: your responsibilities and my support

| Work | You do | I prepare or check |
|---|---|---|
| Team agreement | Meet the team and confirm commitments | Agenda, decision questions, and agreement draft |
| Product scope | Choose priorities and accept scope changes | Source comparison, dependencies, and scope options |
| User evidence | Arrange access and conduct or observe sessions | Task scripts, note structure, and findings from supplied evidence |
| Flows | Review the task sequence and choose the interaction | Flow drafts, state inventory, and coverage checks |
| Visual direction | Select references and approve the direction | Comparison criteria, token proposals, and consistency review |
| Design system | Approve names, values, and component behavior | Component specifications and design/code mapping drafts |
| Figma work | Review design quality and make final choices | File structure, component creation, and screen work when you request that action |
| Handoff | Confirm the packet with implementation owners | Annotations, acceptance links, and readiness checks |
| Implementation review | Accept the experience or request changes | Comparison against the agreed screens and behavior when implementation access exists |

This document defines proposed support for later work.
This writing task produces the plan only.
It does not create Figma assets, change Jira, or contact the team.
I base meeting summaries and user findings on the evidence you provide.
The team retains its existing approval responsibilities.

## Appendix D: the next week and later work

The next week has a proposed allowance of 20 hours, based on your estimate on 27 October 2026.
Use it for detailed screens, relevant states, language checks, prototype review, and corrections.
Begin the access-administration flow outline only after the first packet has no unresolved blocking behavior.

For access administration, distinguish action permission, assignment authority, and authority to manage assignment authority.
Show explicit scope and the pre-save impact report.
Include rejected changes, current-authority checks, and last-administrator protection.
Use extra email verification only where the agreed assignment-authority behavior requires it.

After M01, follow the team's reviewed module queue.
The current roadmap groups later work into configuration, people and finance, registration and records, then other system capabilities.
The current scope requires AI work before R1 and includes aid and rich finance.
Design priorities do not silently remove those requirements.

At each weekly review, select the next user outcome from the reviewed module requirements and the frontend commitment.
Check the reusable components it needs before new visual work.
Maintain a broad journey map without detailed screens for every future module.

If a week falls to 15 hours, reduce detailed visual work and new component breadth.
If a week reaches 25 hours, use the additional time for validation, corrections, and the next flow outline.
These are proposed capacity scenarios, not additional commitments.

## Appendix E: design packet checklist

- [ ] Link the Jira ticket, requirements, and acceptance scenarios.
- [ ] Name the actor, permissions, and scope.
- [ ] Link the canonical flow and screens.
- [ ] Define input validation and server outcomes.
- [ ] Cover relevant pending, empty, error, denied, and success states.
- [ ] Define narrow-screen behavior and mixed-direction content.
- [ ] Provide Arabic, English, and French coverage for the agreed flow.
- [ ] Specify keyboard order, focus, and accessible labels.
- [ ] Link the reusable components and tokens.
- [ ] Record open questions, reviewers, and the review result.

Design-ready does not mean implemented, user-validated, or module-complete.
Record those results separately with their evidence.

## Appendix F: source links

The project observations above come from the source review in this chat on 27 October 2026.
Later changes require a new check before the affected design starts.

- [Decision log](https://github.com/Organization-name-temp/sis-docs/blob/main/00-product/decisions/decision-log.md)
- [Current scope](https://github.com/Organization-name-temp/sis-docs/blob/main/00-product/scope.md)
- [Roadmap](https://github.com/Organization-name-temp/sis-docs/blob/main/00-product/roadmap.md)
- [Delivery workflow](https://github.com/Organization-name-temp/sis-docs/blob/main/07-project/delivery-workflow.md)
- [Module and release gates](https://github.com/Organization-name-temp/sis-docs/blob/main/07-project/release-gates.md)
- [M01 PRD](https://github.com/Organization-name-temp/sis-docs/blob/main/01-modules/M01-identity-access/prd.md)
- [M20 PRD](https://github.com/Organization-name-temp/sis-docs/blob/main/01-modules/M20-tenancy/prd.md)
- [Screen inventory](https://github.com/Organization-name-temp/sis-docs/blob/main/02-shared/screen-inventory.md)
- [Localization](https://github.com/Organization-name-temp/sis-docs/blob/main/02-shared/localization.md)
- [Frontend proposal](https://github.com/Organization-name-temp/sis-docs/blob/main/03-architecture/adr/0007-web-framework-rtl-i18n.md)
- [M01 Jira epic and child tickets](https://adhamhaithameid.atlassian.net/browse/KAN-16)
- [Figma workspace](https://www.figma.com/design/V4PQwf3QN4E5yETXDuvWuc/SIS---Product-Design-Workspace)
