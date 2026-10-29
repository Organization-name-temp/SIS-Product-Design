import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "../src/Tabs";
import { Menu } from "../src/Menu";
import { Tooltip } from "../src/Tooltip";
import { Dialog } from "../src/Dialog";
import { FileUpload } from "../src/FileUpload";
import { NumberField } from "../src/NumberField";
import { Avatar } from "../src/Avatar";
import { Progress } from "../src/Progress";
import { FilterBar } from "../src/patterns/FilterBar";
import { SettingsForm } from "../src/patterns/SettingsForm";

const tabs = [
  { id: "overview", label: "Overview", content: "Overview content" },
  { id: "roster", label: "Roster", content: "Roster content" },
  { id: "history", label: "History", content: "History content" },
];

describe("Component quality", () => {
  it("restores the page when a parent and nested dialog unmount together", async () => {
    function Nested() {
      const [childOpen, setChildOpen] = useState(false);
      return (
        <Dialog open onClose={() => {}} title="Parent">
          <button onClick={() => setChildOpen(true)}>Open child</button>
          <Dialog
            open={childOpen}
            onClose={() => setChildOpen(false)}
            title="Child"
          >
            Child content
          </Dialog>
        </Dialog>
      );
    }
    const view = render(<Nested />);
    await userEvent.click(screen.getByRole("button", { name: "Open child" }));
    expect(screen.getByRole("dialog", { name: "Child" })).toBeInTheDocument();
    view.unmount();
    expect(view.container).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).not.toBe("hidden");
  });
  it("keeps tab IDs unique across component instances", () => {
    render(
      <>
        <Tabs label="First" tabs={tabs} />
        <Tabs label="Second" tabs={tabs} />
      </>,
    );
    const controls = screen.getAllByRole("tab");
    expect(new Set(controls.map((control) => control.id)).size).toBe(6);
    for (const control of controls.filter(
      (control) => control.getAttribute("aria-selected") === "true",
    ))
      expect(
        document
          .getElementById(control.getAttribute("aria-controls")!)
          ?.getAttribute("aria-labelledby"),
      ).toBe(control.id);
  });
  it("moves tabs in the visual direction in RTL", async () => {
    render(
      <div dir="rtl">
        <Tabs label="Course" tabs={tabs} />
      </div>,
    );
    screen.getByRole("tab", { name: "Overview" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "History" })).toHaveFocus();
  });
  it("opens a menu with focus and supports the last item shortcut", async () => {
    render(
      <Menu
        trigger="Actions"
        items={[
          { id: "edit", label: "Edit" },
          { id: "drop", label: "Drop" },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Drop" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
  it("dismisses a focused tooltip with Escape", async () => {
    render(
      <Tooltip label="Enroll this student">
        <button>Enroll</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enroll" })).toHaveFocus();
  });
  it("names a dialog with a rich title and keeps focus during form edits", async () => {
    function Form() {
      const [name, setName] = useState("");
      return (
        <Dialog open onClose={() => {}} title={<span>Edit student</span>}>
          <input aria-label="First field" />
          <input
            aria-label="Student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Dialog>
      );
    }
    render(<Form />);
    const dialog = screen.getByRole("dialog", { name: "Edit student" });
    await userEvent.click(within(dialog).getByLabelText("Student name"));
    await userEvent.type(
      within(dialog).getByLabelText("Student name"),
      "Mariam",
    );
    expect(within(dialog).getByLabelText("Student name")).toHaveValue("Mariam");
    expect(within(dialog).getByLabelText("Student name")).toHaveFocus();
    expect(
      within(dialog).getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });
  it("rejects unsupported dropped files and allows single-file replacement", async () => {
    const onFiles = vi.fn();
    render(
      <FileUpload
        label="Transcript"
        accept=".pdf"
        maxCount={1}
        onFiles={onFiles}
      />,
    );
    const input = screen.getByLabelText("Transcript");
    const zone = input.parentElement!.querySelector(".sis-upload-zone")!;
    fireEvent.drop(zone, {
      dataTransfer: {
        files: [new File(["x"], "notes.txt", { type: "text/plain" })],
      },
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "not an accepted file type",
    );
    expect(onFiles).not.toHaveBeenCalled();
    await userEvent.upload(
      input,
      new File(["x"], "first.pdf", { type: "application/pdf" }),
    );
    await userEvent.upload(
      input,
      new File(["y"], "second.pdf", { type: "application/pdf" }),
    );
    expect(screen.getByText("second.pdf")).toBeInTheDocument();
    expect(screen.queryByText("first.pdf")).not.toBeInTheDocument();
  });
  it("enforces numeric limits through the native control", () => {
    render(<NumberField label="Credits" min={1} max={21} step={1} />);
    const input = screen.getByRole("spinbutton", { name: "Credits" });
    fireEvent.change(input, { target: { value: "22" } });
    expect(input).toBeInvalid();
  });
  it("shows initials when an avatar image fails", () => {
    render(<Avatar name="Salma Hassan" src="/missing.png" />);
    fireEvent.error(document.querySelector("img")!);
    expect(screen.getByText("SH")).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });
  it("keeps progress values within the announced range", () => {
    render(<Progress label="Term" value={120} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});

it("connects filter search to its consumer", async () => {
  const onSearchChange = vi.fn();
  render(
    <FilterBar
      searchPlaceholder="Find records"
      onSearchChange={onSearchChange}
    />,
  );
  await userEvent.type(screen.getByRole("searchbox"), "Omar");
  expect(onSearchChange).toHaveBeenLastCalledWith("Omar");
});
it("resets an uncontrolled settings form when Cancel is selected", async () => {
  render(
    <SettingsForm title="Preferences" onSubmit={() => {}}>
      <input aria-label="Office" defaultValue="Registrar" />
    </SettingsForm>,
  );
  await userEvent.clear(screen.getByLabelText("Office"));
  await userEvent.type(screen.getByLabelText("Office"), "Changed");
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.getByLabelText("Office")).toHaveValue("Registrar");
});
