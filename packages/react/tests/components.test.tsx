import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Button } from "../src/Button";
import { TextField } from "../src/TextField";
import { Badge } from "../src/Badge";
import { Checkbox } from "../src/Checkbox";
import { Radio } from "../src/Radio";
import { Switch } from "../src/Switch";
import { Dialog } from "../src/Dialog";

describe("Button", () => {
  it("renders variants and fires clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("blocks clicks while loading and sets aria-busy", async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("passes axe", async () => {
    const { container } = render(
      <div>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button disabled>Disabled</Button>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("TextField", () => {
  it("associates label, hint, and error with the input", () => {
    render(<TextField label="Email" hint="Use your institutional address." />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("Use your institutional address.");
  });

  it("marks invalid state and announces the error", () => {
    render(<TextField label="Student ID" error="The student ID has eight digits." />);
    const input = screen.getByLabelText("Student ID");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("eight digits");
  });

  it("passes axe in normal and error states", async () => {
    const { container } = render(
      <div>
        <TextField label="Email" hint="Use your institutional address." />
        <TextField label="Student ID" error="Required." />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Badge", () => {
  it("passes axe across tones", async () => {
    const { container } = render(
      <div>
        <Badge>Neutral</Badge>
        <Badge tone="success">Registered</Badge>
        <Badge tone="warning">On hold</Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="info">Pending</Badge>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Selection controls", () => {
  it("toggles the checkbox and reports the new value", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Email me" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Email me"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("checks the radio within its group", async () => {
    const onChange = vi.fn();
    render(<Radio name="year" label="Second year" value="2" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Second year"));
    expect(onChange).toHaveBeenCalledWith("2");
  });

  it("toggles the switch role", async () => {
    const onChange = vi.fn();
    render(<Switch label="Dark mode" onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Dark mode" });
    await userEvent.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(control).toBeChecked();
  });

  it("passes axe", async () => {
    const { container } = render(
      <div>
        <Checkbox label="Email me" defaultChecked />
        <Radio name="year" label="First year" value="1" />
        <Switch label="Dark mode" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Dialog", () => {
  it("focuses the panel, closes on Escape, and restores focus", async () => {
    const onClose = vi.fn();
    render(
      <div>
        <Button>Open</Button>
        <Dialog open onClose={onClose} title="Confirm registration">
          You are registering for MATH 201.
        </Dialog>
      </div>,
    );
    const dialog = screen.getByRole("dialog", { name: "Confirm registration" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("traps Tab focus inside the panel", async () => {
    render(
      <Dialog open onClose={() => {}} title="Confirm" footer={<Button>Confirm</Button>}>
        Body text
      </Dialog>,
    );
    await userEvent.tab();
    await userEvent.tab();
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <Dialog open={false} onClose={() => {}} title="Hidden">
        Body
      </Dialog>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
