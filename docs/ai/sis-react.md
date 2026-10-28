# sis-react component reference (machine-readable)

Format: one block per export. Props are TypeScript interfaces from the source.
All components render without extra providers. Load `sis-tokens.css` then
`sis-react.css` before use. Every component is axe-clean and keyboard operable.
Source of truth: `packages/react/src/index.ts`.

## Actions and inputs

### Button
Props: `variant?: "primary" | "secondary" | "ghost" | "destructive"`, `loading?: boolean`, `disabled?`, plus native button attributes. Loading disables the button, sets `aria-busy`, and swaps the label for a spinner.
```tsx
<Button variant="primary" loading>Enroll student</Button>
```

### TextField
Props: `label` (required), `hint?`, `error?`, native input attributes. Error sets `aria-invalid` and `role="alert"` on the message.
```tsx
<TextField label="Email" hint="Use your institutional address." />
```

### NumberField
Props: `label`, `hint?`, `error?`, `min?`, `max?`, `step?`, `value?`/`defaultValue?`, `onChange?(value: string)`. Filters non-numeric input; `inputMode="decimal"`.

### DateField
Props: `label`, `hint?`, `error?`, `min?`, `max?`, `defaultValue?`, `onChange?`. Native date input, styled.

### FileUpload
Props: `label`, `accept?`, `multiple?`, `maxSizeMb?`, `maxCount?`, `onFiles?(files: File[])`, `error?`. Drop zone plus keyboard-reachable input; oversized files raise `role="alert"`.

### Checkbox / Radio / Switch
Props: `label`, `checked?`/`defaultChecked?`, `onChange?`, `disabled?`. Radio adds `name`, `value`. Switch renders `role="switch"`. Native inputs styled; focus rings from `--sys-color-focus-ring`.

## Status and feedback

### Badge
Props: `tone?: "neutral" | "success" | "warning" | "danger" | "info"`.
```tsx
<Badge tone="success">Registered</Badge>
```

### Alert
Props: `tone` (required), `title?`, `children`, `onDismiss?`. `role="alert"` for danger and warning, `role="status"` otherwise.

### Spinner
Props: `size?: number`. `role="status"` with visually hidden "Loading".

### Skeleton
Props: `width?`, `height?`, `lines?`. `aria-hidden`; pair with `aria-busy`.

### Toast
Props: `message`, `tone?`, `onDismiss`, `durationMs? = 5000`. Fixed bottom, `role="status"`, auto-dismiss, Escape and button dismissal.

### Progress
Props: `value`, `max? = 100`, `label`. Full progressbar semantics.

## Containers and navigation

### Card
Props: `title?`, `actions?`, `children` (required), `footer?`. Surface with `--sys-shadow-low`, hover lift.

### Accordion
Props: `items: { id, summary, content }[]`. One open at a time; `aria-expanded` + regions; ArrowUp/Down navigation.

### Tabs
Props: `tabs: { id, label, content }[]`, `label`. Full ARIA tabs pattern with roving tabindex and ArrowLeft/Right/Home/End.

### Breadcrumbs
Props: `items: { label, href? }[]`. Last item `aria-current="page"`.

### Pagination
Props: `page`, `pageCount`, `onChange`. Window of ±1, first and last always visible, `aria-current="page"`.

### Menu
Props: `trigger`, `items: { id, label, onSelect? }[]`, `onSelect?`. Full ARIA menu: `aria-haspopup`, `aria-expanded`, Escape with focus return, ArrowUp/Down, outside-click close.

### List
Props: `items: ReactNode[]`, `ordered?`, `dense?`.

## Overlays

### Dialog
Props: `open`, `onClose`, `title`, `children`, `footer?`. Portal, focus trap, Escape and overlay close, focus return, scroll lock, `aria-modal`.

### Drawer
Props: `open`, `onClose`, `title`, `children`, `side?: "inline-start" | "inline-end"`. Same mechanics as Dialog, panel slides in.

### Tooltip
Props: `label`, `children` (single element). Shows on hover and focus via `aria-describedby`; pointer-events none.

## Files, identity, charts

### Avatar
Props: `name`, `src?`, `size?: 24 | 32 | 40`. Initials fallback, `--sys-radius-avatar`.

### BarChart / LineChart
Props: `data: { label, value }[]`, `ariaLabel`, `height? = 200`. Inline SVG on chart tokens; `role="img"` with `aria-label`.

## Patterns (composed)

### PageHeader
Props: `title`, `description?`, `breadcrumbs?`, `actions?`.

### KpiCard
Props: `label`, `value`, `delta?`, `deltaDirection?: "up" | "down"`. Delta maps to success/danger Badge.

### FilterBar
Props: `searchPlaceholder?`, `children?`. `role="search"`.

### EmptyState / ErrorState / LoadingState
EmptyState: `title`, `description?`, `action?: { label, onClick }`. ErrorState adds `onRetry` and danger tone. LoadingState: `rows?`, `role="status"` + `aria-busy` + skeletons.

### SettingsForm
Props: `title`, `children`, `onSubmit`, `submitting?`, `cancelLabel?`, `submitLabel?`. Fieldset disabled while submitting.

## AI assistant family

### ChatMessage
Props: `role: "user" | "assistant"`, `children`, `streaming?`, `citations?: { label, href }[]`. Streaming sets `aria-busy` and a blinking cursor.

### CitationChip
Props: `label`, `href`. External link chip.

### ChatPanel
Props: `messages: ChatEntry[]`, `onSend(message)`, `streaming?`, `ariaLabel? = "Assistant"`. `role="log"` with `aria-live="polite"`; Enter sends, Shift+Enter newlines; send disabled while streaming.

## Theme and density contract

- Themes: `data-theme="light" | "dark" | "system"` on the root element; `SISTheme.setTheme()` from `foundations/sis-theme.js` manages it.
- Density: `data-density="comfortable" | "compact"` on the root element.
- Direction: `dir="rtl"` on the root element; components use logical properties only.
- Brand: `data-brand` swaps the `--ref-color-brand-*` ramp; semantic roles never change per tenant.
