import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import App from "../src/App";

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("Registrar workspace", () => {
  it("searches records and shows a useful empty state", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(
      screen.getByRole("searchbox", { name: "Search students" }),
      "Mariam",
    );
    expect(
      screen.getByRole("button", { name: /^Mariam Adel/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Omar Khaled/ }),
    ).not.toBeInTheDocument();
    await user.clear(
      screen.getByRole("searchbox", { name: "Search students" }),
    );
    await user.type(
      screen.getByRole("searchbox", { name: "Search students" }),
      "no match",
    );
    expect(screen.getByText("No students found")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(
      screen.getByRole("button", { name: /^Omar Khaled/ }),
    ).toBeInTheDocument();
  });

  it("filters holds, opens a record, and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /^On hold/ }));
    expect(
      screen.queryByRole("button", { name: /^Omar Khaled/ }),
    ).not.toBeInTheDocument();
    const record = screen.getByRole("button", { name: /^Mariam Adel/ });
    await user.click(record);
    const dialog = screen.getByRole("dialog", { name: "Student record" });
    expect(within(dialog).getByText("Mariam Adel")).toBeInTheDocument();
    expect((await axe(dialog)).violations).toEqual([]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(record).toHaveFocus();
  });

  it("creates a registration and keeps it after navigation and reload", async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await user.click(screen.getByRole("button", { name: "New registration" }));
    const dialog = screen.getByRole("dialog", { name: "New registration" });
    expect((await axe(dialog)).violations).toEqual([]);
    await user.type(
      within(dialog).getByLabelText("Student name"),
      "Nour Ahmed",
    );
    await user.type(
      within(dialog).getByLabelText("University email"),
      "nour@ejust.edu.eg",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Create registration" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Registration created for Nour Ahmed",
    );
    expect(
      screen.getByRole("button", { name: /^Nour Ahmed/ }),
    ).toBeInTheDocument();
    view.unmount();
    render(<App />);
    expect(
      screen.getByRole("button", { name: /^Nour Ahmed/ }),
    ).toBeInTheDocument();
  });

  it("opens course details and saves institution settings", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("link", { name: "Course catalog" }));
    await user.click(
      screen.getByRole("button", { name: "View course MATH 201" }),
    );
    expect(
      screen.getByRole("dialog", { name: "Course details" }),
    ).toHaveTextContent("Calculus II");
    await user.keyboard("{Escape}");
    await user.click(
      screen.getByRole("link", { name: "Institution settings" }),
    );
    await user.clear(screen.getByLabelText("Office name"));
    await user.type(screen.getByLabelText("Office name"), "Student affairs");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Institution settings saved",
    );
    expect(
      JSON.parse(localStorage.getItem("sis.showcase.settings")!),
    ).toHaveProperty("office", "Student affairs");
  });

  it("uses the saved credit limit and closing date in the workspace", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(
      screen.getByRole("link", { name: "Institution settings", exact: true }),
    );
    await user.clear(screen.getByLabelText("Maximum credit hours"));
    await user.type(screen.getByLabelText("Maximum credit hours"), "12");
    await user.clear(screen.getByLabelText("Closing date"));
    await user.type(screen.getByLabelText("Closing date"), "2026-11-01");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await user.click(
      screen.getByRole("link", { name: "Overview", exact: true }),
    );
    expect(screen.getByText("Registration closes Nov 1")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "New registration", exact: true }),
    );
    expect(screen.getByLabelText("Credit hours")).toHaveAttribute("max", "12");
    expect(screen.getByLabelText("Credit hours")).toHaveValue(12);
  });

  it.each([
    "Overview",
    "Students",
    "Course catalog",
    "Registrar assistant",
    "Institution settings",
    "Component gallery",
  ])("has no axe violations on %s", async (name) => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(
      screen.getByRole("link", { name: new RegExp(`^${name}`) }),
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
