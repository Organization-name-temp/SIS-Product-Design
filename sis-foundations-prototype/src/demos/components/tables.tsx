import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Columns3,
  Download,
  GripVertical,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Callout,
  Field,
  download,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, flags, useLabels } from "./common";

type Student = {
  id: string;
  en: string;
  ar: string;
  fr: string;
  year: number;
  credits: number;
  status: "active" | "review" | "held";
  gpa: number;
};
const initialRows: Student[] = [
  {
    id: "EJ-0042",
    en: "Mariam Hassan",
    ar: "مريم حسن",
    fr: "Mariam Hassan",
    year: 2,
    credits: 42,
    status: "active",
    gpa: 3.65,
  },
  {
    id: "EJ-0043",
    en: "Ahmed Kamal",
    ar: "أحمد كمال",
    fr: "Ahmed Kamal",
    year: 3,
    credits: 76,
    status: "review",
    gpa: 3.28,
  },
  {
    id: "EJ-0044",
    en: "Farah Ali",
    ar: "فرح علي",
    fr: "Farah Ali",
    year: 1,
    credits: 18,
    status: "active",
    gpa: 3.9,
  },
  {
    id: "EJ-0045",
    en: "Youssef Nabil",
    ar: "يوسف نبيل",
    fr: "Youssef Nabil",
    year: 4,
    credits: 112,
    status: "held",
    gpa: 2.85,
  },
  {
    id: "EJ-0046",
    en: "Laila Mahmoud",
    ar: "ليلى محمود",
    fr: "Laila Mahmoud",
    year: 2,
    credits: 39,
    status: "active",
    gpa: 3.4,
  },
  {
    id: "EJ-0047",
    en: "Omar Saad",
    ar: "عمر سعد",
    fr: "Omar Saad",
    year: 3,
    credits: 81,
    status: "review",
    gpa: 3.1,
  },
  {
    id: "EJ-0048",
    en: "Nour Adel",
    ar: "نور عادل",
    fr: "Nour Adel",
    year: 1,
    credits: 15,
    status: "active",
    gpa: 3.72,
  },
  {
    id: "EJ-0049",
    en: "Hana Mostafa",
    ar: "هنا مصطفى",
    fr: "Hana Mostafa",
    year: 4,
    credits: 108,
    status: "held",
    gpa: 3.02,
  },
  {
    id: "EJ-0050",
    en: "Kareem Sherif",
    ar: "كريم شريف",
    fr: "Kareem Sherif",
    year: 2,
    credits: 45,
    status: "active",
    gpa: 3.56,
  },
  {
    id: "EJ-0051",
    en: "Salma Ibrahim",
    ar: "سلمى إبراهيم",
    fr: "Salma Ibrahim",
    year: 3,
    credits: 72,
    status: "review",
    gpa: 3.81,
  },
  {
    id: "EJ-0052",
    en: "Amr Salah",
    ar: "عمرو صلاح",
    fr: "Amr Salah",
    year: 1,
    credits: 21,
    status: "active",
    gpa: 3.19,
  },
  {
    id: "EJ-0053",
    en: "Dina Samir",
    ar: "دينا سمير",
    fr: "Dina Samir",
    year: 4,
    credits: 117,
    status: "active",
    gpa: 3.95,
  },
];
type Column = "name" | "year" | "credits" | "status" | "gpa";
const allColumns: Column[] = ["name", "year", "credits", "status", "gpa"];
function SelectionBox({
  checked,
  mixed,
  label,
  onChange,
}: {
  checked: boolean;
  mixed?: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!mixed;
  }, [mixed]);
  return (
    <label className="component-table-check">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
export function TablesDemo(props: DemoProps) {
  const t = useLabels(props);
  const f = flags(props);
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<Column>("name");
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState(new Set<string>());
  const [expanded, setExpanded] = useState(new Set<string>());
  const [columns, setColumns] = useState(allColumns);
  const [widths, setWidths] = useState<Record<Column, number>>({
    name: 260,
    year: 144,
    credits: 144,
    status: 190,
    gpa: 144,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [result, setResult] = useState("");
  const [restored, setRestored] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => {
    setRestored(false);
    setRecovered(false);
  }, [props.state]);
  const labels: Record<Column, string> = {
    name: t("Student", "الطالب", "Étudiant"),
    year: t("Year", "السنة", "Année"),
    credits: t("Credits", "الساعات", "Crédits"),
    status: t("Status", "الحالة", "Statut"),
    gpa: t("GPA", "المعدل", "Moyenne"),
  };
  const labelStatus = (status: Student["status"]) =>
    status === "active"
      ? t("Active", "نشط", "Actif")
      : status === "review"
        ? t("Needs review", "يحتاج إلى مراجعة", "À vérifier")
        : t("On hold", "موقوف", "Bloqué");
  const filtered = useMemo(() => {
    if (!restored && (f.empty || props.state === "no-results")) return [];
    return rows
      .filter(
        (row) =>
          (filter === "all" || row.status === filter) &&
          (year === "all" || row.year === +year) &&
          `${row.id} ${row.en} ${row.ar} ${row.fr}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        const aValue = sort === "name" ? a[props.locale] : a[sort];
        const bValue = sort === "name" ? b[props.locale] : b[sort];
        return (
          (typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : String(aValue).localeCompare(String(bValue), props.locale)) *
          direction
        );
      });
  }, [
    rows,
    filter,
    year,
    query,
    sort,
    direction,
    props.locale,
    props.state,
    f.empty,
    restored,
  ]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageSelected = visible.filter((row) => selected.has(row.id)).length;
  const updateSelected = (id: string, value: boolean) =>
    setSelected((old) => {
      const next = new Set(old);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  const bulk = (status: Student["status"]) => {
    setRows(
      rows.map((row) => (selected.has(row.id) ? { ...row, status } : row)),
    );
    const message = `${number(props.locale, selected.size)} ${t("records updated locally", "سجلات حُدثت محليًا", "dossiers modifiés localement")}`;
    setResult(message);
    props.notify(message, "success");
    setSelected(new Set());
  };
  const resize = (event: PointerEvent<HTMLButtonElement>, column: Column) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = widths[column];
    cleanup.current?.();
    const move = (next: globalThis.PointerEvent) =>
      setWidths((old) => ({
        ...old,
        [column]: Math.max(
          120,
          Math.min(
            480,
            startWidth +
              (next.clientX - startX) * (props.locale === "ar" ? -1 : 1),
          ),
        ),
      }));
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: true });
    cleanup.current = stop;
  };
  const exportRows = () => {
    download(
      "sample-students.csv",
      `id,name,year,credits,status,gpa\n${filtered.map((row) => `${row.id},${row[props.locale]},${row.year},${row.credits},${row.status},${row.gpa}`).join("\n")}`,
      "text/csv",
    );
    props.notify(
      t(
        "Filtered sample exported",
        "صُدّرت النتائج التجريبية",
        "Résultats exemples exportés",
      ),
      "success",
    );
  };
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="tables-student-records-table">
            {t(
              "Student records table",
              "جدول سجلات الطلاب",
              "Tableau des dossiers étudiants",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          <div className="component-table-toolbar">
            <Field
              label={t(
                "Search records",
                "البحث في السجلات",
                "Rechercher des dossiers",
              )}
            >
              <span className="component-input-group">
                <Search size={20} />
                <input
                  className="input"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                    setRestored(true);
                  }}
                  placeholder={t(
                    "Name or identifier",
                    "الاسم أو الرقم",
                    "Nom ou identifiant",
                  )}
                />
              </span>
            </Field>
            <Field label={t("Status", "الحالة", "Statut")}>
              <select
                className="input"
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                  setPage(1);
                  setRestored(true);
                }}
              >
                <option value="all">
                  {t("All statuses", "جميع الحالات", "Tous les statuts")}
                </option>
                {(["active", "review", "held"] as const).map((value) => (
                  <option key={value} value={value}>
                    {labelStatus(value)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("Year", "السنة", "Année")}>
              <select
                className="input"
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  setPage(1);
                  setRestored(true);
                }}
              >
                <option value="all">
                  {t("All years", "كل السنوات", "Toutes les années")}
                </option>
                {[1, 2, 3, 4].map((value) => (
                  <option key={value} value={value}>
                    {number(props.locale, value)}
                  </option>
                ))}
              </select>
            </Field>
            <Button variant="secondary" onClick={exportRows}>
              <Download size={20} />
              CSV
            </Button>
          </div>
          <details className="component-column-settings">
            <summary>
              <Columns3 size={20} />
              {t("Visible columns", "الأعمدة الظاهرة", "Colonnes visibles")}
            </summary>
            <div className="toolbar">
              {allColumns.map((column) => (
                <label className="check-label" key={column}>
                  <input
                    type="checkbox"
                    checked={columns.includes(column)}
                    disabled={column === "name"}
                    onChange={(event) =>
                      setColumns(
                        event.target.checked
                          ? allColumns.filter(
                              (value) =>
                                value === column || columns.includes(value),
                            )
                          : columns.filter((value) => value !== column),
                      )
                    }
                  />
                  {labels[column]}
                </label>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  setColumns(allColumns);
                  setWidths({
                    name: 260,
                    year: 144,
                    credits: 144,
                    status: 190,
                    gpa: 144,
                  });
                }}
              >
                {t(
                  "Reset columns",
                  "استعادة الأعمدة",
                  "Réinitialiser les colonnes",
                )}
              </Button>
            </div>
          </details>
          {selected.size > 0 && (
            <div className="component-bulk-bar" role="status">
              <strong>
                {number(props.locale, selected.size)}{" "}
                {t("selected", "محدد", "sélectionnés")}
              </strong>
              <Button variant="secondary" onClick={() => bulk("active")}>
                <Check size={20} />
                {t("Activate selected", "تنشيط المحدد", "Activer la sélection")}
              </Button>
              <Button variant="secondary" onClick={() => bulk("review")}>
                {t(
                  "Flag for review",
                  "تحديد للمراجعة",
                  "Signaler pour révision",
                )}
              </Button>
              <Button variant="ghost" onClick={() => setSelected(new Set())}>
                {t("Clear selection", "مسح الاختيار", "Effacer la sélection")}
              </Button>
            </div>
          )}
          {f.invalid && !recovered ? (
            <Callout tone="danger">
              <p>
                {t(
                  "The sample records could not load.",
                  "تعذر تحميل السجلات التجريبية.",
                  "Les dossiers exemples ne sont pas disponibles.",
                )}
              </p>
              <Button variant="secondary" onClick={() => setRecovered(true)}>
                <RefreshCw size={20} />
                {t(
                  "Retry locally",
                  "إعادة المحاولة محليًا",
                  "Réessayer localement",
                )}
              </Button>
            </Callout>
          ) : (
            <>
              <div
                className="component-table-scroll"
                tabIndex={0}
                aria-label={t(
                  "Scrollable records table",
                  "جدول سجلات قابل للتمرير",
                  "Tableau défilant",
                )}
              >
                <table
                  className="sample-table component-data-table"
                  style={{
                    minWidth:
                      112 +
                      columns.reduce((sum, column) => sum + widths[column], 0),
                  }}
                >
                  <caption>
                    {t(
                      "Sample student records. Sort columns or expand a row for details.",
                      "سجلات طلاب تجريبية. رتب الأعمدة أو وسع صفًا لعرض التفاصيل.",
                      "Dossiers exemples. Triez les colonnes ou dépliez une ligne.",
                    )}
                  </caption>
                  <colgroup>
                    <col style={{ width: 56 }} />
                    <col style={{ width: 56 }} />
                    {columns.map((column) => (
                      <col key={column} style={{ width: widths[column] }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <SelectionBox
                          checked={
                            !!visible.length && pageSelected === visible.length
                          }
                          mixed={
                            pageSelected > 0 && pageSelected < visible.length
                          }
                          label={t(
                            "Select all rows on this page",
                            "تحديد كل صفوف هذه الصفحة",
                            "Sélectionner cette page",
                          )}
                          onChange={(value) =>
                            setSelected((old) => {
                              const next = new Set(old);
                              visible.forEach((row) =>
                                value ? next.add(row.id) : next.delete(row.id),
                              );
                              return next;
                            })
                          }
                        />
                      </th>
                      <th scope="col">
                        <span className="component-sr-only">
                          {t("Expand", "توسيع", "Déplier")}
                        </span>
                      </th>
                      {columns.map((column) => (
                        <th
                          scope="col"
                          key={column}
                          aria-sort={
                            sort === column
                              ? direction === 1
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          <div className="component-column-heading">
                            <button
                              type="button"
                              className="component-sort"
                              onClick={() => {
                                setSort(column);
                                setDirection(sort === column ? -direction : 1);
                              }}
                            >
                              {labels[column]}
                              {sort === column &&
                                (direction === 1 ? (
                                  <ArrowUp size={16} />
                                ) : (
                                  <ArrowDown size={16} />
                                ))}
                            </button>
                            <button
                              type="button"
                              className="component-column-resize"
                              aria-label={`${t("Resize", "تغيير عرض", "Redimensionner")} ${labels[column]}`}
                              onPointerDown={(event) => resize(event, column)}
                              onKeyDown={(event) => {
                                if (
                                  event.key === "ArrowLeft" ||
                                  event.key === "ArrowRight"
                                ) {
                                  event.preventDefault();
                                  setWidths((old) => ({
                                    ...old,
                                    [column]: Math.max(
                                      120,
                                      Math.min(
                                        480,
                                        old[column] +
                                          (event.key === "ArrowRight"
                                            ? 16
                                            : -16),
                                      ),
                                    ),
                                  }));
                                }
                              }}
                            >
                              <GripVertical size={16} />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <Fragment key={row.id}>
                        <tr data-selected={selected.has(row.id)}>
                          <td>
                            <SelectionBox
                              checked={selected.has(row.id)}
                              label={`${t("Select", "تحديد", "Sélectionner")} ${row[props.locale]}`}
                              onChange={(value) =>
                                updateSelected(row.id, value)
                              }
                            />
                          </td>
                          <td>
                            <Button
                              variant="ghost"
                              aria-expanded={expanded.has(row.id)}
                              aria-label={`${t("Expand record", "توسيع السجل", "Déplier le dossier")} ${row[props.locale]}`}
                              onClick={() =>
                                setExpanded((old) => {
                                  const next = new Set(old);
                                  if (next.has(row.id)) next.delete(row.id);
                                  else next.add(row.id);
                                  return next;
                                })
                              }
                            >
                              {expanded.has(row.id) ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronRight size={20} />
                              )}
                            </Button>
                          </td>
                          {columns.map((column) => (
                            <td key={column}>
                              {column === "name" ? (
                                <div className="component-student-cell">
                                  <strong>
                                    {row[props.locale]}
                                    {props.variant === "long-content" &&
                                      ` ${t("Computer Engineering Scholarship Applicant", "متقدم لمنحة هندسة الحاسبات", "Candidature à une bourse de génie informatique")}`}
                                  </strong>
                                  <small className="muted">
                                    <bdi>{row.id}</bdi>
                                  </small>
                                </div>
                              ) : column === "status" ? (
                                <Badge
                                  tone={
                                    row.status === "active"
                                      ? "success"
                                      : row.status === "review"
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {labelStatus(row.status)}
                                </Badge>
                              ) : (
                                number(
                                  props.locale,
                                  row[column],
                                  column === "gpa"
                                    ? { minimumFractionDigits: 2 }
                                    : {},
                                )
                              )}
                            </td>
                          ))}
                        </tr>
                        {expanded.has(row.id) && (
                          <tr className="component-expanded-row">
                            <td colSpan={columns.length + 2}>
                              <div className="demo-grid">
                                <div>
                                  <h4>
                                    {t(
                                      "Academic record",
                                      "السجل الأكاديمي",
                                      "Dossier universitaire",
                                    )}
                                  </h4>
                                  <p>
                                    {t(
                                      "Computer Engineering · Autumn 2026",
                                      "هندسة الحاسبات · خريف 2026",
                                      "Génie informatique · Automne 2026",
                                    )}
                                  </p>
                                  <p>
                                    {t(
                                      "Advisor: Dr. Salma Ali",
                                      "المرشدة: د. سلمى علي",
                                      "Conseillère : Dr Salma Ali",
                                    )}
                                  </p>
                                </div>
                                <Field
                                  label={t(
                                    "Update record status",
                                    "تحديث حالة السجل",
                                    "Modifier le statut",
                                  )}
                                >
                                  <select
                                    className="input"
                                    value={row.status}
                                    onChange={(event) =>
                                      setRows(
                                        rows.map((value) =>
                                          value.id === row.id
                                            ? {
                                                ...value,
                                                status: event.target
                                                  .value as Student["status"],
                                              }
                                            : value,
                                        ),
                                      )
                                    }
                                  >
                                    {(
                                      ["active", "review", "held"] as const
                                    ).map((value) => (
                                      <option key={value} value={value}>
                                        {labelStatus(value)}
                                      </option>
                                    ))}
                                  </select>
                                </Field>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              {!visible.length && (
                <div className="component-empty">
                  <Search size={24} />
                  <h3>
                    {f.empty && !restored
                      ? t(
                          "No records yet",
                          "لا توجد سجلات بعد",
                          "Aucun dossier pour le moment",
                        )
                      : t(
                          "No matching records",
                          "لا توجد سجلات مطابقة",
                          "Aucun dossier correspondant",
                        )}
                  </h3>
                  <p>
                    {t(
                      "Change the filters or restore the sample records.",
                      "غير المرشحات أو استعد السجلات التجريبية.",
                      "Modifiez les filtres ou restaurez les exemples.",
                    )}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                      setYear("all");
                      setRestored(true);
                    }}
                  >
                    {t(
                      "Restore sample records",
                      "استعادة السجلات التجريبية",
                      "Restaurer les exemples",
                    )}
                  </Button>
                </div>
              )}
              <div className="component-table-footer">
                <span aria-live="polite">
                  {number(props.locale, filtered.length)}{" "}
                  {t("records", "سجلات", "dossiers")} ·{" "}
                  {t("Page", "صفحة", "Page")}{" "}
                  {number(props.locale, currentPage)} /{" "}
                  {number(props.locale, pageCount)}
                </span>
                <Field
                  label={t("Rows per page", "صفوف لكل صفحة", "Lignes par page")}
                >
                  <select
                    className="input"
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(+event.target.value);
                      setPage(1);
                    }}
                  >
                    {[4, 8, 12].map((value) => (
                      <option value={value} key={value}>
                        {number(props.locale, value)}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="toolbar">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    {t("Previous", "السابق", "Précédent")}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentPage >= pageCount}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    {t("Next", "التالي", "Suivant")}
                  </Button>
                </div>
              </div>
            </>
          )}
          {result && <output className="result-box">{result}</output>}
          <p className="muted">
            {t(
              "Drag a column handle or use its arrow keys to resize. This table uses local sample data.",
              "اسحب مقبض العمود أو استخدم الأسهم لتغيير عرضه. يستخدم الجدول بيانات تجريبية محلية.",
              "Faites glisser une poignée ou utilisez ses flèches pour redimensionner. Les données sont locales.",
            )}
          </p>
        </div>
      </Panel>
    </ComponentFrame>
  );
}
