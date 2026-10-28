# Design system expansion: source research

Date: 2026-10-28. Author: ZCode agent session. Status: current.

This file backs the expansion PRD. Every claim names its source. The Untitled UI Figma file stayed login-blocked, so its internal structure stays unverified.

## Sources read

| Source | What it contributed |
|---|---|
| [Untitled UI: what is a design system](https://www.untitledui.com/blog/what-is-a-design-system) | Definition and layer model: tokens, components, patterns, docs, code and tooling, governance. Adopt, adapt, or build advice. Six build steps. Figma-code sync habits. Metrics: adoption rate, detach rate, time to ship. |
| [Untitled UI Figma PRO VARIABLES v8.0](https://www.figma.com/design/QERVV4a2Fpa1FmsZ5LGW3S) | Login-blocked. Structure unverified. The companion article above describes the kit's organization. |
| [designsystems.surf: 11 best design system examples in 2026](https://designsystems.surf/articles/11-best-design-system-examples-in-2026) | Material theming, GOV.UK evidence-based governance and experimental stage, Spectrum 1:1.25 density scales, Protocol tokens as npm package, Fluent Figma-code mapping, Atlassian token naming and elevation pairs, Lightning motion as first-class layer, Carbon elevation model, Paste WCAG 2.1 AA, Det Fælles accessibility-first patterns. |
| [UXPilot: design system examples](https://uxpilot.ai/blogs/design-system-examples) | Carbon layering and multi-framework reach, Atlassian status labels and content docs, Lightning HTML blueprints, Polaris docs structure (Properties, Examples, Best Practices), Guardian scenario palettes, Uber base-plus-pattern model, Material theming, Spectrum educational docs. |
| [Figma resource library: design system examples](https://www.figma.com/resource-library/design-system-examples/) | Four ingredients: UI kits, tokens, patterns, docs. Variables should mirror token architecture. Auto Layout, variants, and component properties make Figma behave like code. Dev Mode bridges design and development. TapTap and Arco cited for variable depth. |
| [designsystems.one directory](https://www.designsystems.one/design-systems) | Style Dictionary dominates token pipelines (Carbon, Lightning, Cloudscape, Canvas). React Aria and Radix are the common accessibility foundations. Web components as portability layer. Open source plus official Figma kit is the default pairing. AI-readiness scores are low across famous systems; Carbon leads at 4 of 5. |
| [UXPin: best design system examples](https://www.uxpin.com/studio/blog/best-design-system-examples/) | Material dynamic color, Polaris content guidelines govern communication, Atlassian semantic naming (color.text.brand over blue-700), Uber overrides for multi-brand, Pajamas public lifecycle, Spectrum density modes, Radix headless behavior split, shadcn copy-own distribution, GS data density. |

## Cross-source lessons the SIS system adopts

1. Tokens are the single source of truth, with semantic naming. Atlassian names roles, not values. The SIS system already keeps reference, semantic, and component layers; the pipeline hardens them.
2. Multi-brand theming needs a swappable brand layer over stable semantic roles. Uber Base proves the overrides pattern. The SIS multi-tenant model (sis-docs D-051, D-052) makes this a core requirement, not a later add.
3. Density modes serve professional tools. Spectrum and Salt ship comfortable and compact. The SIS system already carries both; the component library inherits them.
4. Accessibility is a floor, not a feature. React Aria and Radix supply behavior; the audit skills supply verification. Target: WCAG 2.2 AA.
5. Documentation structure follows Polaris: properties, examples, best practices per component. The workbench becomes that docs surface.
6. Governance makes a system real: maturity labels (GOV.UK experimental stage, USWDS lifecycle), status labels (Atlassian), public changelog (Pajamas), contribution rules (Untitled UI).
7. AI-readiness is rare and cheap to add: machine-readable docs, llms.txt, stable component APIs (designsystems.one scoring).
8. Figma and code stay in sync through one token source and matching component APIs (Untitled UI; Figma resource library).

## Gates adopted from the Trystan-SA skill set

The repository `Trystan-SA/claude-design-system-prompt` (MIT) defines a review workflow. Its gates now apply to every SIS design output:

| Gate | Applies to |
|---|---|
| discovery-questions | Every new or ambiguous design request before building. |
| frontend-aesthetic-direction | Greenfield looks; not needed while the approved E-JUST brand holds. |
| design-system-extract | Token work; values come from canonical sources, never invented. |
| component-extract | Pattern and family inventory before building a batch. |
| interaction-states-pass | Every component before merge: six states each. |
| hierarchy-rhythm-review | Every full screen and pattern. |
| ai-slop-check | Every hi-fi build and every UI copy string. |
| accessibility-audit | WCAG AA per component batch and per pattern. |
| polish-pass | Final gate before any milestone delivery. |

Local skills add: `unslop` for prose, the AccessLint suite (`accessibility-scan`, `accessibility-inspect`, `accessibility-fix`, `accessibility-diff`) for verified WCAG 2.2 work, `impeccable` and `design-audit` for craft review, `visual-judge` and `web-gui-tester` for rendered checks, and `ui-typography` for typography rules in generated UI.

## Verification status

- Seven sources read in full on 2026-10-28, except the Figma file (login-blocked).
- The Untitled UI Figma file organization is unverified. Any Figma work imports the SIS token CSV and Tokens Studio JSON, so the unverified file does not gate the plan.
- Example-system facts above are the articles' claims, not primary research.
