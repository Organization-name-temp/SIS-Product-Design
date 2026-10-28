import { useState } from "react";
import { DataTable, type Column } from "../../src/DataTable";
import { Alert } from "../../src/Alert";
import { Spinner } from "../../src/Spinner";
import { Skeleton } from "../../src/Skeleton";
import { Tooltip } from "../../src/Tooltip";

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
  const [toastOpen, setToastOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      <button type="button" className="sis-btn sis-btn-secondary" onClick={() => setToastOpen(true)}>Show toast</button>
      <button type="button" className="sis-btn sis-btn-secondary" onClick={() => setDrawerOpen(true)}>Open drawer</button>
    </div>
  );
}
