# SIS registrar prototype

The local prototype uses SIS tokens and components. It includes six pages:

- Registration overview
- Student registrations
- Course catalog
- Registrar assistant
- Institution settings
- Component gallery

## Run

Run these commands from the repository root:

```sh
npm install
npm run build -w packages/sis-tokens
npm run dev -w apps/showcase
```

Open [the prototype](http://localhost:4680).

## Local behavior

Search, program filters, status filters, sorting, pagination, record selection, and CSV export use the local student records.
New registrations and institution settings persist on this device.
Saved settings control the registration deadline and credit limit.

Course details use a fixed sample catalog.
The assistant uses local rules and sample records. It does not call an external AI service.
Institution metrics use a separate sample dataset. They do not change when you add a local student record.
The preview date is October 28, 2026.

Appearance controls support light, dark, and system themes, two directions, and two densities.
The right-to-left layout uses English content. This prototype does not include Arabic translation.

## Checks

```sh
npm run typecheck -w apps/showcase
npm test -w apps/showcase
npm run test:browser -w apps/showcase
npm run build -w apps/showcase
```

The browser checks include accessibility scans, registration persistence, keyboard focus, CSV content, course filters, assistant replies, and appearance persistence.
Visual baselines cover both themes, directions, and densities. Responsive baselines cover 360px and 834px widths.

See the [review record](../../docs/reports/2026-10-28-registrar-prototype.md) for evidence and limits.
