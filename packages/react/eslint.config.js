import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "test-results/**", "playwright-report/**", "visual/main.tsx"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Design tokens decide: no raw color literals in component code (D22, ADR-0001).
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Use a token variable from sis-tokens instead of a raw color literal.",
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["tests/**", "visual/sections/**"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
);
