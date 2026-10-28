# Deterministic output system

The current foundation can supply UI prototypes. Other output formats need explicit templates and export checks.
The following additions remain To Do. This document does not claim that those templates exist.

## Recommended additions

| Addition | What you can derive | Deterministic rule |
|---|---|---|
| Versioned release manifest | Reproduce an accepted system revision | Pin token version, source revision, font files, and renderer version. |
| Artifact configuration schema | Save a repeatable output recipe | Declare output type, language, theme, density, page size, and template ID. |
| Presentation masters | Reviews, pitches, training, and project updates | Define cover, agenda, comparison, data, section, and conclusion layouts. |
| Documentation templates | Specifications, handoff notes, and reference pages | Define heading roles, tables, callouts, code, figures, and navigation. |
| Report templates | Audits, research summaries, and decision records | Require conclusion, evidence, limitations, decisions, and actions. |
| Print profiles | PDF reports, letters, transcripts, and certificates | Define page geometry, breaks, print colors, links, and accessible reading order. |
| Content rules | Consistent labels, errors, help, and confirmations | Define vocabulary, action grammar, tone, date formats, and translation review. |
| Data visualization rules | Charts and dashboards across media | Define series order, labels, scales, missing data, and accessible tables. |
| Asset library | Reusable logos, icons, figures, and illustrations | Pin asset versions, licenses, permitted placement, and alternative text. |
| Release checks | Trusted downstream deliverables | Validate contrast, fonts, overflow, links, exports, and selected output fixtures. |

## Proposed configuration

This shape is a proposal for E07. The current workbench does not save this manifest.

```json
{
  "schemaVersion": 1,
  "systemVersion": "<accepted release>",
  "output": "presentation",
  "template": "project-review",
  "language": "en",
  "direction": "ltr",
  "font": "ibm",
  "theme": "light",
  "density": "comfortable",
  "format": "16:9",
  "motion": "reduced",
  "contentRevision": "<source revision>"
}
```

Derive direction from language. Reject conflicting input instead of guessing.
Pin the renderer and dependencies when identical export files matter.
Browser layout can vary across engines. Define visual tolerances when identical pixels are not realistic.

## Proposed output options

| Output | Options to review later |
|---|---|
| Web UI | Responsive, two densities, two directions, light and dark |
| Presentation | 16:9 first, static and reduced-motion exports |
| Documentation | Web reference, Markdown source, accessible PDF |
| Reports | A4 portrait first, evidence tables, citations, figure captions |
| Prototype | Local deterministic outcomes, explicit sample data, review entry point |
| Operational content | Notifications, email, help, error messages, and audit entries |

Approve one output profile before expanding formats. Keep exceptions explicit.
Start with a project-review presentation and a design handoff document after current visual acceptance.
Use the same semantic color and type roles. Add output-specific aliases where physical media need different values.
