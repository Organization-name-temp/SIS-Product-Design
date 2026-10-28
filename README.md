# SIS Product Design

This repository preserves Adham's SIS design decisions, foundation sources, interactive workbench, review evidence, and Jira delivery records.
Adham is the sole design approver. The repository remains private.

## Start here

| Need | Reference |
|---|---|
| Inspect the system | [Workbench guide](sis-foundations-prototype/README.md) |
| Choose supported options | [Option reference](docs/system-options/active-profile.md) |
| Read approved rules | [Foundation contract](sis-foundation-contract.md) |
| Understand decisions | [Decision log](docs/decisions/decision-log.md) |
| Trace this chat | [Curated project record](docs/decisions/project-record.md) |
| Check delivery evidence | [Current report](docs/reports/2026-10-28-delivery.md) |
| Find Jira work | [Epics and stories](docs/jira/README.md) |
| Plan later outputs | [Deterministic output plan](docs/system-options/output-system.md) |
| Work within 20 hours | [Solo design workflow](docs/workflow/solo-design.md) |
| Inspect original work | [Archive index](archive/README.md) |

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

## Source boundaries

Root `sis-*` files define the current foundation. The workbench generates its snapshots and exports from these files.
The archive retains earlier proposals and the earlier three-font, three-language prototype.
Current decisions supersede those proposals. Historical reports describe their original revision only.
The workbench uses local sample data. It does not supply production SIS services or university policy.
The repository contains no database, analytics, accounts, or remote font requirement.
Figma publication, production packages, presentation masters, and document templates remain backlog work.
