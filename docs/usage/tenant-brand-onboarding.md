# Tenant brand onboarding

This guide maps a second university brand onto the SIS design system without code changes.

## How theming works

The token architecture separates two layers:

- **Brand reference values** (`--ref-color-brand-*`) carry the university palette. E-JUST red `#EA232B` is brand one.
- **Semantic roles** (`--sys-color-*`) carry meaning: surface, text, action, feedback. They never change per tenant.

A tenant replaces the brand layer at runtime. Every semantic role keeps its meaning because it points at a brand reference, not a hard-coded value.

## Steps

1. **Collect the palette.** Gather the university brand color with its tints and shades, or request a ramp from one seed color. The E-JUST brand ramp runs from `50` to `950` in eleven steps.
2. **Map the ramp.** Place each university color at the ramp step that matches its purpose: the primary action color sits at `600` (E-JUST uses `#CD1722` there), hover and pressed states sit at `700` and `800`.
3. **Produce the token file.** Copy `foundations/sis-ejust-palette.tokens.json`, keep every `sys` role unchanged, and replace the hex values under `ref.color.brand`. Keep the same ramp steps.
4. **Regenerate the CSS.** Run the pipeline build. The output emits `--ref-color-brand-*` with the university values; every semantic role follows.
5. **Set the brand attribute.** `SISTheme.setBrand("<tenant>")` applies `data-brand` on the root element. Extend the brand set in `foundations/sis-theme.js` and map `data-brand="<tenant>"` to the new reference values in the generated CSS.
6. **Verify contrast.** Run the contrast checks against the new ramp. Every semantic role must keep its WCAG pass; adjust ramp steps, never role names, until checks pass.
7. **Import to Figma.** Import the regenerated Tokens Studio JSON so the Figma variables match code.

## Rules

- Never edit semantic role names per tenant. Tenants change values, not vocabulary.
- Never hard-code a tenant hex outside the brand layer.
- Contrast results gate every tenant profile. A tenant profile that fails checks does not ship.
- The design owner approves each tenant profile before release.
