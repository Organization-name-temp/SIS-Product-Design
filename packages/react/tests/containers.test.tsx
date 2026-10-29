import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Card } from "../src/Card";
import { Accordion } from "../src/Accordion";
import { Tabs } from "../src/Tabs";
import { Breadcrumbs } from "../src/Breadcrumbs";
import { Pagination } from "../src/Pagination";
import { Menu } from "../src/Menu";
import { List } from "../src/List";

describe("Card", () => {
  it("renders title, actions, and content", () => {
    render(
      <Card title="Course" actions={<button>Action</button>}>
        MATH 201
      </Card>,
    );
    expect(screen.getByText("Course")).toBeInTheDocument();
    expect(screen.getByText("MATH 201")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(
      <Card title="Course" actions={<button>Action</button>} footer={<p>Footer</p>}>
        MATH 201
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Accordion", () => {
  const items = [
    { id: "a", summary: "First", content: "First content" },
    { id: "b", summary: "Second", content: "Second content" },
  ];

  it("opens one item at a time with aria-expanded", async () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole("button", { name: "First" });
    await userEvent.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("First content")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Second" }));
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute("aria-expanded", "true");
  });

  it("moves between summaries with arrow keys", async () => {
    render(<Accordion items={items} />);
    const first = screen.getByRole("button", { name: "First" });
    await userEvent.click(first);
    await userEvent.type(first, "{ArrowDown}");
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
  });

  it("passes axe", async () => {
    const { container } = render(<Accordion items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Tabs", () => {
  const tabs = [
    { id: "one", label: "One", content: "One content" },
    { id: "two", label: "Two", content: "Two content" },
  ];

  it("activates tabs by click with aria-selected and panels", async () => {
    render(<Tabs tabs={tabs} label="Demo" />);
    const one = screen.getByRole("tab", { name: "One" });
    const two = screen.getByRole("tab", { name: "Two" });
    expect(one).toHaveAttribute("aria-selected", "true");
    await userEvent.click(two);
    expect(two).toHaveAttribute("aria-selected", "true");
    expect(one).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Two content")).toBeVisible();
    expect(two.getAttribute("aria-controls")).toBe(screen.getByRole("tabpanel").id);
  });

  it("moves with arrow keys and wraps", async () => {
    render(<Tabs tabs={tabs} label="Demo" />);
    const one = screen.getByRole("tab", { name: "One" });
    await userEvent.click(one);
    await userEvent.type(one, "{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    await userEvent.type(screen.getByRole("tab", { name: "Two" }), "{ArrowRight}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("passes axe", async () => {
    const { container } = render(<Tabs tabs={tabs} label="Demo" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Breadcrumbs", () => {
  it("marks the last item as the current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Registration", href: "/registration" },
          { label: "MATH 201" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText("MATH 201")).toHaveAttribute("aria-current", "page");
  });

  it("passes axe", async () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Here" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Pagination", () => {
  it("reports the current page and emits changes", async () => {
    const onChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
    expect(screen.getByText("…", { exact: true })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "4" }));
    expect(onChange).toHaveBeenCalledWith(4);
    await userEvent.click(screen.getByRole("button", { name: /previous/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables prev on the first page", () => {
    render(<Pagination page={1} pageCount={5} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("passes axe", async () => {
    const { container } = render(<Pagination page={2} pageCount={5} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Menu", () => {
  const items = [
    { id: "edit", label: "Edit" },
    { id: "drop", label: "Drop" },
  ];

  it("opens on click, closes on Escape, returns focus, and selects", async () => {
    const onSelect = vi.fn();
    render(<Menu trigger="Course actions" items={items} onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: "Course actions" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    await userEvent.type(trigger, "{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalledWith("edit");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("navigates items with arrow keys", async () => {
    render(<Menu trigger="Course actions" items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Course actions" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Drop" })).toHaveFocus();
  });

  it("passes axe", async () => {
    const { container } = render(<Menu trigger="Actions" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("List", () => {
  it("renders ordered and unordered lists", () => {
    const unordered = render(<List items={["One", "Two"]} />);
    expect(unordered.container.querySelector("ul")).toBeInTheDocument();
    const ordered = render(<List items={["One", "Two"]} ordered />);
    expect(ordered.container.querySelector("ol")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("passes axe", async () => {
    const { container } = render(<List items={["One", "Two", "Three"]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
