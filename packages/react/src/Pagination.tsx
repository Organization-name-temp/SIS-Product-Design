import { ChevronIcon } from "./component-icons";

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

function pageWindow(page: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (p - previous > 1) out.push("…");
    out.push(p);
    previous = p;
  }
  return out;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  return (
    <nav className="sis-pagination" aria-label="Pagination">
      <button
        type="button"
        className="sis-pagination-button"
        disabled={page <= 1}
        aria-label="Previous page"
        onClick={() => onChange(page - 1)}
      >
        <ChevronIcon previous />
      </button>
      {pageWindow(page, pageCount).map((entry, index) =>
        entry === "…" ? (
          <span
            key={`gap-${index}`}
            className="sis-pagination-gap"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            className="sis-pagination-button"
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onChange(entry)}
          >
            {entry}
          </button>
        ),
      )}
      <button
        type="button"
        className="sis-pagination-button"
        disabled={page >= pageCount}
        aria-label="Next page"
        onClick={() => onChange(page + 1)}
      >
        <ChevronIcon />
      </button>
    </nav>
  );
}
