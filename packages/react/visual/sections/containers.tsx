import { useState } from "react";
import { Card } from "../../src/Card";
import { Accordion } from "../../src/Accordion";
import { Tabs } from "../../src/Tabs";
import { Breadcrumbs } from "../../src/Breadcrumbs";
import { Pagination } from "../../src/Pagination";
import { Menu } from "../../src/Menu";
import { List } from "../../src/List";

export function ContainersSection() {
  const [page, setPage] = useState(2);
  return (
    <div style={{ display: "grid", gap: 16, padding: 24, maxWidth: 430 }}>
      <Breadcrumbs
        items={[{ label: "Home", href: "#" }, { label: "Registration", href: "#" }, { label: "MATH 201" }]}
      />
      <Card title="Course: Applied Mathematics" actions={<Menu trigger="Actions" items={[{ id: "edit", label: "Edit" }, { id: "drop", label: "Drop" }]} />}>
        MATH 201 · 3 credit hours · Dr. Salma Hassan
      </Card>
      <Tabs
        label="Course views"
        tabs={[
          { id: "overview", label: "Overview", content: "Syllabus, schedule, and office hours." },
          { id: "roster", label: "Roster", content: "48 enrolled students." },
        ]}
      />
      <Accordion
        items={[
          { id: "s1", summary: "What are the prerequisites?", content: "MATH 101 or an equivalent placement score." },
          { id: "s2", summary: "How is the grade computed?", content: "40% midterm, 60% final." },
        ]}
      />
      <List items={["Lecture 01 — Integrals", "Lecture 02 — Series", "Lecture 03 — Limits"]} />
      <Pagination page={page} pageCount={10} onChange={setPage} />
    </div>
  );
}
