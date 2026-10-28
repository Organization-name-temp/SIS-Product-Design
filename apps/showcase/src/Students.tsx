import { useMemo, useState } from "react";
import { Badge, Button, Dialog, TextField } from "sis-react";
import { downloadStudents, programs, type Student } from "./data";
import { Icon } from "./Icon";

export function StudentAvatar({ name }: { name: string }) {
  return (
    <span className="sis-student-avatar" aria-hidden="true">
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function StatusBadge({ status }: { status: Student["status"] }) {
  const tones: Record<Student["status"], "success" | "warning" | "danger"> = {
    Registered: "success",
    "On hold": "warning",
    "Needs review": "danger",
  };
  return (
    <Badge tone={tones[status]}>
      <span className="sis-status-dot" />
      {status}
    </Badge>
  );
}

export function StudentTable({
  students,
  query,
  setQuery,
  notify,
  creditLimit,
  initialStatus = "All students",
}: {
  students: Student[];
  query: string;
  setQuery: (value: string) => void;
  notify: (message: string) => void;
  creditLimit: number;
  initialStatus?: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [program, setProgram] = useState("All programs");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<Student | null>(null);
  const filtered = useMemo(() => {
    const rows = students.filter(
      (student) =>
        (status === "All students" || student.status === status) &&
        (program === "All programs" || student.program === program) &&
        `${student.name} ${student.id} ${student.email} ${student.program}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
    return sort
      ? [...rows].sort(
          (a, b) => a.name.localeCompare(b.name) * (sort === "asc" ? 1 : -1),
        )
      : rows;
  }, [students, status, program, query, sort]);
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 6)),
  );
  const visible = filtered.slice((currentPage - 1) * 6, currentPage * 6);
  const visibleSelected =
    visible.length > 0 &&
    visible.every((student) => selected.includes(student.id));
  const reset = () => {
    setQuery("");
    setStatus("All students");
    setProgram("All programs");
    setPage(1);
  };
  const exportRows = () => {
    const rows = selected.length
      ? filtered.filter((student) => selected.includes(student.id))
      : filtered;
    downloadStudents(rows);
    notify(`Exported ${rows.length} student records`);
  };

  return (
    <section
      className="sis-records sis-panel"
      aria-label="Student registrations"
    >
      <div className="sis-panel-heading">
        <div>
          <h2>
            Student registrations{" "}
            <span className="sis-count">{students.length}</span>
          </h2>
          <p>Manage enrollment and keep every student on track.</p>
        </div>
        <Button variant="ghost" onClick={exportRows}>
          <Icon name="export" />
          Export {selected.length ? `selected (${selected.length})` : "records"}
        </Button>
      </div>
      <div
        className="sis-record-tabs"
        role="group"
        aria-label="Registration status"
      >
        {["All students", "Registered", "On hold", "Needs review"].map(
          (value) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => {
                setStatus(value);
                setPage(1);
                setSelected([]);
              }}
            >
              {value}
              <span>
                {value === "All students"
                  ? students.length
                  : students.filter((student) => student.status === value)
                      .length}
              </span>
            </button>
          ),
        )}
      </div>
      <div className="sis-table-toolbar">
        <div className="sis-search">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search students"
            placeholder="Search by name, ID, or program…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              setSelected([]);
            }}
          />
        </div>
        <Button
          variant="secondary"
          aria-expanded={filtersOpen}
          aria-controls="student-filters"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <Icon name="filter" />
          Filters
          {program !== "All programs" && <span className="sis-count">1</span>}
        </Button>
      </div>
      {filtersOpen && (
        <div className="sis-filter-options" id="student-filters">
          <label>
            Program
            <select
              value={program}
              onChange={(event) => {
                setProgram(event.target.value);
                setPage(1);
                setSelected([]);
              }}
            >
              <option>All programs</option>
              {programs.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <Button variant="ghost" onClick={reset}>
            Clear filters
          </Button>
        </div>
      )}
      <div className="sis-record-table-wrap">
        <table className="sis-record-table">
          <caption className="sis-sr-only">
            Student registrations for Fall 2026
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sis-checkbox-cell">
                <input
                  type="checkbox"
                  aria-label="Select all visible students"
                  checked={visibleSelected}
                  ref={(node) => {
                    if (node)
                      node.indeterminate =
                        !visibleSelected &&
                        visible.some((student) =>
                          selected.includes(student.id),
                        );
                  }}
                  onChange={() =>
                    setSelected(
                      visibleSelected
                        ? selected.filter(
                            (id) =>
                              !visible.some((student) => student.id === id),
                          )
                        : [
                            ...new Set([
                              ...selected,
                              ...visible.map((student) => student.id),
                            ]),
                          ],
                    )
                  }
                />
              </th>
              <th
                scope="col"
                aria-sort={
                  sort === "asc"
                    ? "ascending"
                    : sort === "desc"
                      ? "descending"
                      : "none"
                }
              >
                <button
                  type="button"
                  onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                >
                  Student
                  <Icon name="sort" />
                </button>
              </th>
              <th scope="col">Program / Year</th>
              <th scope="col">Credit hours</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sis-sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((student) => (
              <tr
                key={student.id}
                data-selected={selected.includes(student.id)}
              >
                <td className="sis-checkbox-cell">
                  <input
                    type="checkbox"
                    aria-label={`Select ${student.name}`}
                    checked={selected.includes(student.id)}
                    onChange={() =>
                      setSelected(
                        selected.includes(student.id)
                          ? selected.filter((id) => id !== student.id)
                          : [...selected, student.id],
                      )
                    }
                  />
                </td>
                <td>
                  <button
                    className="sis-student-link"
                    onClick={() => setDetail(student)}
                  >
                    <StudentAvatar name={student.name} />
                    <span>
                      <strong>{student.name}</strong>
                      <small>{student.id}</small>
                    </span>
                  </button>
                </td>
                <td>
                  <strong>{student.program}</strong>
                  <small>Year {student.year}</small>
                </td>
                <td>
                  <span className="sis-credit-value">
                    {student.credits}
                    <span> / {creditLimit}</span>
                  </span>
                  <span className="sis-credit-track" aria-hidden="true">
                    <span
                      style={{
                        inlineSize: `${Math.min(100, (student.credits / creditLimit) * 100)}%`,
                      }}
                    />
                  </span>
                </td>
                <td>
                  <StatusBadge status={student.status} />
                </td>
                <td>
                  <button
                    className="sis-icon-button"
                    aria-label={`Open record for ${student.name}`}
                    onClick={() => setDetail(student)}
                  >
                    <Icon name="chevron" />
                  </button>
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={6}>
                  <div className="sis-empty">
                    <Icon name="search" />
                    <h3>No students found</h3>
                    <p>Try a different name or remove a filter.</p>
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="sis-table-footer">
        <span>
          {filtered.length
            ? `${(currentPage - 1) * 6 + 1}–${Math.min(currentPage * 6, filtered.length)}`
            : "0"}{" "}
          of {filtered.length} students
          {selected.length > 0 && ` · ${selected.length} selected`}
        </span>
        <div className="sis-table-pagination">
          <button
            className="sis-icon-button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <Icon name="chevron" className="sis-flip" />
          </button>
          {Array.from({ length: Math.ceil(filtered.length / 6) }, (_, i) => (
            <button
              key={i}
              className="sis-icon-button"
              aria-label={`Page ${i + 1}`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="sis-icon-button"
            aria-label="Next page"
            disabled={currentPage * 6 >= filtered.length}
            onClick={() => setPage(currentPage + 1)}
          >
            <Icon name="chevron" />
          </button>
        </div>
      </div>
      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Student record"
        footer={
          <Button variant="secondary" onClick={() => setDetail(null)}>
            Close record
          </Button>
        }
      >
        {detail && (
          <div className="sis-detail">
            <div className="sis-person">
              <StudentAvatar name={detail.name} />
              <div>
                <h3>{detail.name}</h3>
                <p>{detail.email}</p>
              </div>
            </div>
            <StatusBadge status={detail.status} />
            <dl>
              <div>
                <dt>Student ID</dt>
                <dd>{detail.id}</dd>
              </div>
              <div>
                <dt>Program</dt>
                <dd>{detail.program}</dd>
              </div>
              <div>
                <dt>Academic year</dt>
                <dd>Year {detail.year}</dd>
              </div>
              <div>
                <dt>GPA</dt>
                <dd>{detail.gpa.toFixed(2)} / 4.00</dd>
              </div>
              <div>
                <dt>Credit hours</dt>
                <dd>
                  {detail.credits} / {creditLimit}
                </dd>
              </div>
            </dl>
            {detail.status !== "Registered" && (
              <div className="sis-note">
                <Icon name="shield" />
                <p>
                  {detail.status === "On hold"
                    ? "A financial hold requires review by the finance office before registration."
                    : "Academic advising is required before this registration can be confirmed."}
                </p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </section>
  );
}

export function RegistrationDialog({
  open,
  onClose,
  onCreate,
  creditLimit,
}: {
  open: boolean;
  creditLimit: number;
  onClose: () => void;
  onCreate: (student: Student) => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="New registration">
      <form
        className="sis-registration-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const name = String(data.get("name") || "").trim();
          if (!name) return;
          onCreate({
            id: `2026-${Date.now().toString().slice(-6)}`,
            name,
            email: String(data.get("email")).trim(),
            program: String(data.get("program")),
            year: Number(data.get("year")),
            credits: Number(data.get("credits")),
            gpa: 0,
            status: "Registered",
          });
        }}
      >
        <p>
          Create a student registration for Fall 2026. This prototype stores
          records on this device.
        </p>
        <TextField
          label="Student name"
          name="name"
          required
          maxLength={80}
          placeholder="Full name"
        />
        <TextField
          label="University email"
          name="email"
          type="email"
          required
          placeholder="student@ejust.edu.eg"
        />
        <label className="sis-form-label">
          Program
          <select name="program">
            {programs.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <div className="sis-form-columns">
          <label className="sis-form-label">
            Academic year
            <select name="year">
              {[1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                  Year {value}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label="Credit hours"
            name="credits"
            type="number"
            min={1}
            max={creditLimit}
            defaultValue={Math.min(18, creditLimit)}
            required
          />
        </div>
        <div className="sis-form-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create registration</Button>
        </div>
      </form>
    </Dialog>
  );
}
