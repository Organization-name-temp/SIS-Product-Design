import { useMemo, useState } from "react";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string | number;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  ariaLabel?: string;
  loading?: boolean;
  emptyMessage?: string;
  onSelectionChange?: (ids: string[]) => void;
}

type SortState = { key: string; direction: "ascending" | "descending" } | null;

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectable = false,
  ariaLabel = "Data table",
  loading = false,
  emptyMessage = "No results",
  onSelectionChange,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = a[sort.key as keyof T];
      const right = b[sort.key as keyof T];
      if (typeof left === "number" && typeof right === "number")
        return (left - right) * factor;
      return String(left).localeCompare(String(right)) * factor;
    });
  }, [rows, sort]);

  const allIds = rows.map(getRowId);
  const allSelected = rows.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = allIds.some((id) => selected.has(id)) && !allSelected;

  const notify = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.(allIds.filter((id) => next.has(id)));
  };

  const toggleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    setSort((current) =>
      current?.key === column.key
        ? {
            key: column.key,
            direction:
              current.direction === "ascending" ? "descending" : "ascending",
          }
        : { key: column.key, direction: "ascending" },
    );
  };

  const headerCell = (column: Column<T>) => {
    const sorted = sort?.key === column.key ? sort.direction : undefined;
    const content = column.sortable ? (
      <button
        type="button"
        className="sis-table-sort"
        onClick={() => toggleSort(column)}
      >
        {column.header}
        <svg
          className="sis-sort-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 4v16m-5-5 5 5 5-5" />
        </svg>
      </button>
    ) : (
      column.header
    );
    return (
      <th
        key={column.key}
        scope="col"
        className="sis-table-header"
        aria-sort={sorted ?? (column.sortable ? "none" : undefined)}
        style={column.width ? { inlineSize: column.width } : undefined}
      >
        {content}
      </th>
    );
  };

  return (
    <div
      className="sis-table-wrap"
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      <table
        className="sis-table"
        aria-rowcount={loading ? undefined : rows.length + 1}
      >
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" className="sis-table-select">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={allSelected}
                  ref={(node) => {
                    if (node) node.indeterminate = someSelected;
                  }}
                  onChange={() =>
                    notify(allSelected ? new Set() : new Set(allIds))
                  }
                />
              </th>
            ) : null}
            {columns.map(headerCell)}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <tr key={`skeleton-${index}`}>
                {selectable ? (
                  <td className="sis-table-select">
                    <span
                      className="sis-skeleton"
                      aria-hidden="true"
                      style={{ inlineSize: 16, blockSize: 16 }}
                    />
                  </td>
                ) : null}
                {columns.map((column) => (
                  <td key={column.key}>
                    <span
                      className="sis-skeleton"
                      aria-hidden="true"
                      style={{ inlineSize: "70%", blockSize: 12 }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedRows.length === 0 ? (
            <tr>
              <td
                className="sis-table-empty"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  className={
                    selected.has(id) ? "sis-table-row-selected" : undefined
                  }
                >
                  {selectable ? (
                    <td className="sis-table-select">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={selected.has(id)}
                        onChange={() => {
                          const next = new Set(selected);
                          if (next.has(id)) next.delete(id);
                          else next.add(id);
                          notify(next);
                        }}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.key}>{String(row[column.key])}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
