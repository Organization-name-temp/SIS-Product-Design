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
Props: `label`, `hint?`, `error?`, `min?`, `max?`, `step?`, `value?`/`defaultValue?`, `onChange?(value: string)`. Uses a native number input with range and step validation. The change callback returns a string.

### DateField
Props: `label`, `hint?`, `error?`, `min?`, `max?`, `defaultValue?`, `onChange?`. Native date input, styled.

### FileUpload
Props: `label`, `accept?`, `multiple?`, `maxSizeMb?`, `maxCount?`, `onFiles?(files: File[])`, `error?`. The keyboard trigger opens the file input. Unsupported file types and oversized files raise `role="alert"`. Single-file selection replaces the previous file.

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
Props: `value`, `max? = 100`, `label`. Progressbar semantics. The component clamps visible and announced values to the valid range.

## Containers and navigation

### Card
Props: `title?`, `actions?`, `children` (required), `footer?`. Surface with `--sys-shadow-low`. Focus within the card raises its shadow without moving the content.

### Accordion
Props: `items: { id, summary, content }[]`. One open at a time; `aria-expanded` + regions; ArrowUp/Down navigation.

### Tabs
Props: `tabs: { id, label, content }[]`, `label`. Roving tabindex, unique instance IDs, and ArrowLeft/Right/Home/End support. Arrow navigation follows the layout direction.

### Breadcrumbs
Props: `items: { label, href? }[]`, `ariaLabel?`. Last item `aria-current="page"`.

### Pagination
Props: `page`, `pageCount`, `onChange`. Window of ±1, first and last always visible, `aria-current="page"`.

### Menu
Props: `trigger`, `items: { id, label, onSelect? }[]`, `onSelect?`. Full ARIA menu: `aria-haspopup`, `aria-expanded`, Escape with focus return, ArrowUp/Down/Home/End, and outside-pointer dismissal. Opening the menu focuses an item.

### List
Props: `items: ReactNode[]`, `ordered?`, `dense?`.

## Overlays

### Dialog
Props: `open`, `onClose`, `title`, `children`, `footer?`. Portal, focus trap, Escape and backdrop close, focus return, scroll lock, and `aria-modal`. Rich titles name the dialog. Nested layers preserve background state.

### Drawer
Props: `open`, `onClose`, `title`, `children`, `side?: "inline-start" | "inline-end"`. The drawer uses the same focus and dismissal behavior as Dialog.

### Tooltip
Props: `label`, `children` (single element). Shows on hover and focus through `aria-describedby`. Escape dismisses the tooltip. Placement stays inside the viewport.

## Files, identity, charts

### Avatar
Props: `name`, `src?`, `size?: 24 | 32 | 40`. Initials replace unavailable or failed images. The component uses `--sys-radius-avatar`.

### BarChart / LineChart
Props: `data: { label, value }[]`, `ariaLabel`, `height? = 200`. SVG charts use chart tokens, readable axes, and accessible value descriptions. Empty charts show an empty state. Narrow containers support keyboard scrolling.

## Patterns (composed)

### PageHeader
Props: `title`, `description?`, `breadcrumbs?`, `actions?`, `headingLevel?: 1 | 2 | 3`. The heading defaults to level 1.

### KpiCard
Props: `label`, `value`, `delta?`, `deltaDirection?: "up" | "down"`. Delta maps to success/danger Badge.

### FilterBar
Props: `searchPlaceholder?`, `children?`, `value?`, `onSearchChange?(value: string)`. The component exposes `role="search"`.

### EmptyState / ErrorState / LoadingState
EmptyState: `title`, `description?`, `action?: { label, onClick }`. ErrorState adds `onRetry` and danger tone. LoadingState: `rows?`, `role="status"` + `aria-busy` + skeletons.

### SettingsForm
Props: `title`, `children`, `onSubmit`, `submitting?`, `cancelLabel?`, `submitLabel?`, `onCancel?`. The fieldset disables during submission. Cancel calls `onCancel` or resets the native form.

## AI assistant family

### ChatMessage
Props: `role: "user" | "assistant"`, `children`, `streaming?`, `citations?: { label, href }[]`. Streaming sets `aria-busy` and a blinking cursor.

### CitationChip
Props: `label`, `href`. External links open a new tab. Hash and root-relative links use the current tab.

### ChatPanel
Props: `messages: ChatEntry[]`, `onSend(message)`, `streaming?`, `ariaLabel? = "Assistant"`. `role="log"` with `aria-live="polite"`; Enter sends, Shift+Enter newlines; send disabled while streaming.

## Theme and density contract

- Themes: `data-theme="light" | "dark" | "system"` on the root element; `SISTheme.setTheme()` from `foundations/sis-theme.js` manages it.
- Density: `data-density="comfortable" | "compact"` on the root element.
- Direction: `dir="rtl"` on the root element; components use logical properties only.
- Brand: `data-brand` swaps the `--ref-color-brand-*` ramp; semantic roles never change per tenant.
