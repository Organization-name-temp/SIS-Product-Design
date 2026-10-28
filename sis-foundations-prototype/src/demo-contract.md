# Demo implementation contract

Each module exports a Record<string, DemoRenderer> map from its own file.
Import DemoProps, Button, Panel, Badge, Callout, Field, ModalExample, Disclosure, tr, number, copyText from ../shared.
DemoProps contains locale (en/ar/fr), density (comfortable/compact), theme (light/dark), state, variant, notify.
Call tr(locale, English, Arabic, French) for prose and labels. Use number(locale, value) for quantities.
Keep form state in React. Presentation changes do not remount the demo.
Use semantic CSS variables such as --sys-color-text-primary, --sys-color-bg-surface, --sys-color-input-border.
Shared classes include demo-stack, demo-grid, sample-panel, field, input, button, toolbar, sample-table, badge, callout, row, muted, check-label, result-box.
Controls have 48px height in comfortable density and 44px in compact density. Icons have 44px minimum hit areas.
No backend calls. Every interactive control needs an observable local result.
Use real Lucide icons and Recharts for charts. React Aria Components is installed for accessible behavior.
Do not edit shared.tsx, catalog.ts, styles.css, App.tsx, package.json, or another agent's files.
