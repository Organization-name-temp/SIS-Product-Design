import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FileUpload } from "../src/FileUpload";
import { NumberField } from "../src/NumberField";
import { DateField } from "../src/DateField";
import { Avatar } from "../src/Avatar";
import { Progress } from "../src/Progress";

describe("FileUpload", () => {
  it("lists chosen files and emits them", async () => {
    const onFiles = vi.fn();
    render(<FileUpload label="Attach transcript" onFiles={onFiles} />);
    const input = screen.getByLabelText("Attach transcript") as HTMLInputElement;
    const file = new File(["pdf"], "transcript.pdf", { type: "application/pdf" });
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByText("transcript.pdf")).toBeInTheDocument();
  });

  it("rejects oversized files with an alert", async () => {
    const onFiles = vi.fn();
    render(<FileUpload label="Attach" maxSizeMb={1} onFiles={onFiles} />);
    const input = screen.getByLabelText("Attach") as HTMLInputElement;
    const big = new File([new ArrayBuffer(2 * 1024 * 1024)], "big.pdf", { type: "application/pdf" });
    await userEvent.upload(input, big);
    expect(screen.getByRole("alert")).toHaveTextContent(/exceeds/i);
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("removes a file from the list", async () => {
    render(<FileUpload label="Attach" onFiles={() => {}} />);
    const input = screen.getByLabelText("Attach") as HTMLInputElement;
    await userEvent.upload(input, new File(["x"], "a.pdf", { type: "application/pdf" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove a.pdf" }));
    expect(screen.queryByText("a.pdf")).not.toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(<FileUpload label="Attach transcript" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("NumberField", () => {
  it("filters non-numeric input", async () => {
    const onChange = vi.fn();
    render(<NumberField label="Credit hours" onChange={onChange} />);
    const input = screen.getByLabelText("Credit hours");
    await userEvent.type(input, "4a2");
    expect(input).toHaveValue(42);
  });

  it("marks invalid and announces the error", () => {
    render(<NumberField label="Credit hours" error="Required." />);
    expect(screen.getByLabelText("Credit hours")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(<NumberField label="Credit hours" hint="1 to 21" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("DateField", () => {
  it("associates label and hint with the date input", () => {
    render(<DateField label="Start date" hint="The term start." />);
    expect(screen.getByLabelText("Start date")).toHaveAccessibleDescription("The term start.");
  });

  it("passes axe", async () => {
    const { container } = render(<DateField label="Start date" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Avatar", () => {
  it("falls back to initials", () => {
    render(<Avatar name="Salma Hassan" />);
    expect(screen.getByText("SH")).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(<Avatar name="Salma Hassan" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Progress", () => {
  it("exposes progressbar semantics", () => {
    render(<Progress value={60} label="Term progress" />);
    const bar = screen.getByRole("progressbar", { name: "Term progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "60");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("passes axe", async () => {
    const { container } = render(<Progress value={60} label="Term progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
