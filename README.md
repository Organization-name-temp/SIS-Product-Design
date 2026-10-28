# SIS Product Design

This repository holds the SIS design system: canonical foundation sources, design tokens, an interactive workbench, and the delivery records behind them.
Adham is the sole design approver. Anyone may use the design system under the [MIT license](LICENSE).

## Start here

| Need | Reference |
|---|---|
| Use the tokens | [Usage guide](docs/usage/use-the-design-system.md) |
| Look up a term | [Glossary](GLOSSARY.md) |
| Read product requirements | [sis-docs repository](https://github.com/Organization-name-temp/sis-docs) |
| Inspect the system | [Workbench guide](sis-foundations-prototype/README.md) |
| Choose supported options | [Option reference](docs/system-options/active-profile.md) |
| Read approved rules | [Foundation contract](foundations/sis-foundation-contract.md) |
| Understand decisions | [Decision log](docs/decisions/decision-log.md) |
| Trace this chat | [Curated project record](docs/decisions/project-record.md) |
| Check delivery evidence | [Current report](docs/reports/2026-10-28-delivery.md) |
| Find Jira work | [Epics and stories](docs/jira/README.md) |
| Plan later outputs | [Deterministic output plan](docs/system-options/output-system.md) |
| Work within 20 hours | [Solo design workflow](docs/workflow/solo-design.md) |
| Inspect original work | [Archive index](archive/README.md) |

## Use the design system

Link the theme helper and the foundation stylesheet:

```html
<script src="foundations/sis-theme.js"></script>
<link rel="stylesheet" href="foundations/sis-foundations.css">
```

The [usage guide](docs/usage/use-the-design-system.md) covers the token layers, the Figma import, the fonts, and the export bundle.

## Run the workbench

Use Node.js 24 and npm. The lockfile pins dependencies.

```sh
cd sis-foundations-prototype
npm ci --legacy-peer-deps
npm run dev -- --host 0.0.0.0 --port 4173
```

Open http://localhost:4173. The workbench opens Colors and themes.
Use `npm run verify` for source, token, contrast, build, and runtime checks.
Use `npm run test:browser` with the preview active for interaction checks.

## Repository structure

```text
SIS-Product-Design/
├── foundations/               Canonical foundation sources (tokens, CSS, contracts, guidance)
├── tools/                     Shared build scripts
├── sis-foundations-prototype/ Interactive workbench; exports snapshots of foundations/
├── docs/                      Decisions, plans, workflow, reports, options, and Jira records
├── assets/visual-references/  Generated visual references
└── archive/                   Previous proposals and original supplied text
```

## Source boundaries

`foundations/` holds the canonical foundation sources. `tools/` holds the shared build scripts.
The workbench generates its snapshots and exports from these files.
The archive retains earlier proposals and the earlier three-font, three-language prototype.
Current decisions supersede those proposals. Historical reports describe their original revision only.
The workbench uses local sample data. It does not supply production SIS services or university policy.
The repository contains no database, analytics, accounts, or remote font requirement.
Figma publication, production packages, presentation masters, and document templates remain backlog work.

## License

The repository content uses the [MIT license](LICENSE). The IBM Plex fonts ship under the SIL Open Font License and carry their own notice.
