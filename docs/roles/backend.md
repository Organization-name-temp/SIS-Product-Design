# I am a backend engineer

1. For admin pages and internal tools: load `sis-tokens.css` and `sis-react.css` and use the components with any server-rendered HTML. No React required for the CSS layer.
2. For emails: use the token CSS variables inline (E13 email templates are backlog work; until then, copy values from `foundations/sis-ejust-palette.tokens.json` and keep the contrast rules).
3. Run the token lint gate on any HTML you ship: no raw hex; use `var(--sys-color-*)`.
4. Read [docs/usage/use-the-design-system.md](../usage/use-the-design-system.md) for the token layers.
