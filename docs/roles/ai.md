# I am an AI engineer or agent

1. Machine-readable component docs: [docs/ai/sis-react.md](../ai/sis-react.md). This file is the contract for generating or writing UI with the system.
2. Load [llms.txt](../../../llms.txt) first when discovering this repository.
3. The AI assistant UI ships as components: `ChatPanel`, `ChatMessage` (streaming state, `aria-busy`), `CitationChip`. Compose them; do not rebuild message UI.
4. Tokens: read `foundations/*.tokens.json` (W3C DTCG). `sys.color` roles differ per theme; brand primitives differ per tenant.
5. Never invent token names. If a role is missing, propose it through an issue; the design owner approves additions.
