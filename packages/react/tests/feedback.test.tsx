import { describe, expect, it, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { DataTable, type Column } from "../src/DataTable";
import { Alert } from "../src/Alert";
import { Spinner } from "../src/Spinner";
import { Skeleton } from "../src/Skeleton";
import { Toast } from "../src/Toast";
import { Tooltip } from "../src/Tooltip";
import { Drawer } from "../src/Drawer";

const columns: Column<{ id: string; name: string; grade: number }>[] = [
  { key: "name", header: "Student" },
  { key: "grade", header: "Grade", sortable: true },
];
const rows = [
  { id: "r1", name: "Omar Khaled", grade: 88 },
  { id: "r2", name: "Mariam Adel", grade: 72 },
  { id: "r3", name: "Youssef Nabil", grade: 45 },
];

describe("DataTable", () => {
  it("renders rows and sorts a sortable column", async () => {
    render(<DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByText("Omar Khaled")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Grade" }));
    expect(screen.getByRole("columnheader", { name: "Grade" })).toHaveAttribute("aria-sort", "ascending");
    const firstCell = screen.getAllByRole("row")[1];
    expect(firstCell).toHaveTextContent("Youssef Nabil");
    await userEvent.click(screen.getByRole("button", { name: "Grade" }));
    expect(screen.getByRole("columnheader", { name: "Grade" })).toHaveAttribute("aria-sort", "descending");
  });

  it("selects rows with indeterminate header state", async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );
    const firstRow = screen.getAllByRole("checkbox")[1];
    await userEvent.click(firstRow);
    expect(onSelectionChange).toHaveBeenCalledWith(["r1"]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveProperty("indeterminate", true);
    await userEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(["r1", "r2", "r3"]);
  });

  it("shows loading skeletons and the empty message", () => {
    const loading = render(<DataTable columns={columns} rows={[]} getRowId={(row) => row.id} loading />);
    expect(loading.container.querySelectorAll("tbody tr")).toHaveLength(5);
    loading.unmount();
    render(
      <DataTable columns={columns} rows={[]} getRowId={(row) => row.id} emptyMessage="No students found" />,
    );
    expect(screen.getByText("No students found")).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(<DataTable columns={columns} rows={rows} getRowId={(row) => row.id} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Alert", () => {
  it("uses alert role for danger and status for success", () => {
    render(
      <div>
        <Alert tone="danger" title="Failed">Registration blocked.</Alert>
        <Alert tone="success" title="Saved">Schedule updated.</Alert>
      </div>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Registration blocked.");
    expect(screen.getByRole("status")).toHaveTextContent("Schedule updated.");
  });

  it("dismisses via the dismiss button", async () => {
    const onDismiss = vi.fn();
    render(<Alert tone="info" onDismiss={onDismiss}>Term opens soon.</Alert>);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("passes axe", async () => {
    const { container } = render(<Alert tone="warning" title="On hold">A hold blocks registration.</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Spinner and Skeleton", () => {
  it("announces loading politely", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("renders skeleton lines and hides them from readers", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll(".sis-skeleton")).toHaveLength(3);
    expect(container.querySelector(".sis-skeleton")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Toast", () => {
  it("auto-dismisses after the duration", async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast message="Schedule saved." onDismiss={onDismiss} durationMs={5000} />);
    act(() => vi.advanceTimersByTime(5000));
    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("dismisses on Escape and via the close button", async () => {
    const onDismiss = vi.fn();
    render(<Toast message="Saved." onDismiss={onDismiss} />);
    await userEvent.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("passes axe", async () => {
    const { container } = render(<Toast message="Saved." onDismiss={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Tooltip", () => {
  it("describes its trigger", () => {
    render(
      <Tooltip label="Enroll the selected student">
        <button>Enroll</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Enroll" });
    expect(trigger).toHaveAttribute("aria-describedby");
    const tooltip = document.getElementById(trigger.getAttribute("aria-describedby")!);
    expect(tooltip).toHaveTextContent("Enroll the selected student");
  });

  it("passes axe", async () => {
    const { container } = render(
      <Tooltip label="Enroll the selected student">
        <button>Enroll</button>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Drawer", () => {
  it("closes on Escape and returns focus to the trigger", async () => {
    const onClose = vi.fn();
    render(
      <div>
        <button>Open drawer</button>
        <Drawer open onClose={onClose} title="Course details">
          MATH 201 details
        </Drawer>
      </div>,
    );
    const dialog = screen.getByRole("dialog", { name: "Course details" });
    expect(dialog).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on overlay click", async () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Course details">
        Body
      </Drawer>,
    );
    await userEvent.click(screen.getByTestId("sis-drawer-overlay"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("passes axe", async () => {
    const { container } = render(
      <Drawer open onClose={() => {}} title="Course details">
        Body
      </Drawer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
