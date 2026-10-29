import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { PageHeader } from "../src/patterns/PageHeader";

it("supports a section-level page heading", () => {
  render(<PageHeader title="Course enrollment" headingLevel={3} />);
  expect(
    screen.getByRole("heading", { level: 3, name: "Course enrollment" }),
  ).toBeInTheDocument();
});
import { KpiCard } from "../src/patterns/KpiCard";
import { FilterBar } from "../src/patterns/FilterBar";
import { EmptyState } from "../src/patterns/EmptyState";
import { ErrorState } from "../src/patterns/ErrorState";
import { LoadingState } from "../src/patterns/LoadingState";
import { SettingsForm } from "../src/patterns/SettingsForm";

describe("PageHeader", () => {
  it("renders the title and actions", () => {
    render(
      <PageHeader
        title="Registration"
        description="Term 2026 fall."
        actions={<button>Enroll</button>}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Registration" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enroll" })).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(<PageHeader title="Registration" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("KpiCard", () => {
  it("maps delta direction to a success badge", () => {
    render(
      <KpiCard
        label="Enrolled"
        value="12,480"
        delta="+4.2%"
        deltaDirection="up"
      />,
    );
    expect(screen.getByText("Enrolled")).toBeInTheDocument();
    expect(screen.getByText("+4.2%")).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(
      <KpiCard
        label="Enrolled"
        value="12,480"
        delta="-1.1%"
        deltaDirection="down"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("FilterBar", () => {
  it("labels the search field", () => {
    render(<FilterBar searchPlaceholder="Search students" />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(
      <FilterBar searchPlaceholder="Search students" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("EmptyState", () => {
  it("renders the action", async () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="No students"
        description="Add the first one."
        action={{ label: "Add student", onClick: onAction }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Add student" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("passes axe", async () => {
    const { container } = render(<EmptyState title="No students" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ErrorState", () => {
  it("retries", async () => {
    const onRetry = vi.fn();
    render(
      <ErrorState
        title="Could not load"
        description="The network dropped."
        onRetry={onRetry}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("passes axe", async () => {
    const { container } = render(
      <ErrorState title="Could not load" onRetry={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("LoadingState", () => {
  it("renders an aria-busy region with skeletons", () => {
    const { container } = render(<LoadingState rows={3} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll(".sis-skeleton").length).toBeGreaterThan(
      0,
    );
  });

  it("passes axe", async () => {
    const { container } = render(<LoadingState rows={2} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SettingsForm", () => {
  it("submits and disables while submitting", async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    const { rerender } = render(
      <SettingsForm title="Preferences" onSubmit={onSubmit}>
        <input aria-label="Language" />
      </SettingsForm>,
    );
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    rerender(
      <SettingsForm title="Preferences" onSubmit={onSubmit} submitting>
        <input aria-label="Language" />
      </SettingsForm>,
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("passes axe", async () => {
    const { container } = render(
      <SettingsForm title="Preferences" onSubmit={() => {}}>
        <input aria-label="Language" />
      </SettingsForm>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
