import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

// The jest-axe matcher ships Jest typings; the matcher itself works under vitest.
// jest-axe exports the matcher wrapped in its own object; pass it straight through.
expect.extend(toHaveNoViolations as never);
afterEach(() => cleanup());
