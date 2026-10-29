import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Switch } from "../src/Switch";

describe("Switch accessibility state", () => {
  it("exposes aria-checked after keyboard activation", async () => {
    render(<Switch label="Email updates" defaultChecked />);
    const control = screen.getByRole("switch", { name: "Email updates" });
    expect(control).toHaveAttribute("aria-checked", "true");
    control.focus();
    await userEvent.keyboard(" ");
    expect(control).toHaveAttribute("aria-checked", "false");
  });
});
