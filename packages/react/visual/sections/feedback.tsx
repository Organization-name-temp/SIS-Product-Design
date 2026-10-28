import { useState } from "react";
import { DataTable, type Column } from "../../src/DataTable";
import { Alert } from "../../src/Alert";
import { Spinner } from "../../src/Spinner";
import { Skeleton } from "../../src/Skeleton";
import { Toast } from "../../src/Toast";
import { Tooltip } from "../../src/Tooltip";
import { Drawer } from "../../src/Drawer";

type Student = { id: string; name: string; grade: number };
const columns: Column<Student>[] = [
  { key: "name", header: "Student" },
  { key: "grade", header: "Grade", sortable: true },
];
const rows: Student[] = [
  { id: "r1", name: "Omar Khaled", grade: 88 },
  { id: "r2", name: "Mariam Adel", grade: 72 },
  { id: "r3", name: "Youssef Nabil", grade: 45 },
];

export function FeedbackSection() {
  const [toastOpen, setToastOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  return (
    <div style={{ display: "grid", gap: 16, padding: 24, maxWidth: 430 }}>
      <Alert tone="danger" title="Registration blocked">A hold is on this account.</Alert>
      <Alert tone="success" title="Saved">Schedule updated.</Alert>
      <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} selectable />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Spinner />
        <div style={{ flex: 1 }}>
          <Skeleton lines={2} />
        </div>
        <Tooltip label="Enroll the selected student">
          <button type="button">Enroll</button>
        </Tooltip>
      </div>
      {toastOpen ? <Toast message="Schedule saved." onDismiss={() => setToastOpen(false)} /> : null}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Course details">
        MATH 201 · 3 credit hours · Dr. Salma Hassan
      </Drawer>
    </div>
  );
}
