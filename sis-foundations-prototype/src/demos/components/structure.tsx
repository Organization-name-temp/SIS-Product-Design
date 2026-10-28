import { useId, useState } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  MenuTrigger,
  Button as AriaButton,
  Popover,
  Menu as AriaMenu,
  MenuItem,
} from "react-aria-components";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  GripVertical,
  Home,
  Menu,
  Search,
  X,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Callout,
  Disclosure,
  Field,
  ModalExample,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, useLabels } from "./common";

export function ContainersDemo(props: DemoProps) {
  const t = useLabels(props);
  const [selected, setSelected] = useState(false);
  const [split, setSplit] = useState(50);
  const [tab, setTab] = useState("overview");
  const [dismissed, setDismissed] = useState(false);
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="containers-card-and-section">
              {t("Card and section", "البطاقة والقسم", "Carte et section")}
            </span>
          }
        >
          <div className="component-card" data-selected={selected}>
            <div className="row">
              <Badge tone="info">CSE-201</Badge>
              <Badge tone="success">
                {t("Available", "متاح", "Disponible")}
              </Badge>
            </div>
            <h3>
              {t("Data structures", "هياكل البيانات", "Structures de données")}
            </h3>
            <p>
              {t(
                "Algorithms, lists, trees, and practical analysis.",
                "الخوارزميات والقوائم والأشجار والتحليل العملي.",
                "Algorithmes, listes, arbres et analyse pratique.",
              )}
            </p>
            <hr className="component-divider" />
            <div className="toolbar">
              <span>
                {number(props.locale, 3)} {t("credits", "ساعات", "crédits")}
              </span>
              <Button
                variant={selected ? "secondary" : "primary"}
                aria-pressed={selected}
                onClick={() => setSelected(!selected)}
              >
                {selected
                  ? t("Selected", "محدد", "Sélectionné")
                  : t("Select course", "اختيار المقرر", "Choisir ce cours")}
              </Button>
            </div>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="containers-accordion-and-disclosure">
              {t(
                "Accordion and disclosure",
                "الأكورديون والكشف",
                "Accordéon et détails",
              )}
            </span>
          }
        >
          <Disclosure
            title={t(
              "Admission requirements",
              "متطلبات القبول",
              "Conditions d’admission",
            )}
            initial
          >
            <p>
              {t(
                "Provide a transcript and an identity document.",
                "قدم كشف الدرجات ومستند الهوية.",
                "Fournissez un relevé de notes et une pièce d’identité.",
              )}
            </p>
          </Disclosure>
          <Disclosure
            title={t(
              "Academic policies",
              "السياسات الأكاديمية",
              "Règles universitaires",
            )}
          >
            <p>
              {t(
                "The sample policy permits 18 credits per term.",
                "تسمح السياسة التجريبية بـ18 ساعة في الفصل.",
                "La règle exemple autorise 18 crédits par semestre.",
              )}
            </p>
          </Disclosure>
          <Disclosure
            title={t("Financial support", "الدعم المالي", "Aide financière")}
          >
            <Button
              variant="secondary"
              onClick={() =>
                props.notify(
                  t(
                    "Scholarship information requested",
                    "طُلبت معلومات المنح",
                    "Informations sur les bourses demandées",
                  ),
                )
              }
            >
              {t(
                "Request information",
                "طلب معلومات",
                "Demander des informations",
              )}
            </Button>
          </Disclosure>
        </Panel>
      </div>
      <Panel
        title={
          <span data-specimen="containers-tabs-and-panels">
            {t(
              "Tabs and panels",
              "علامات التبويب واللوحات",
              "Onglets et panneaux",
            )}
          </span>
        }
      >
        <Tabs
          selectedKey={tab}
          onSelectionChange={(key) => setTab(String(key))}
        >
          <TabList
            className="component-tab-list"
            aria-label={t(
              "Student record sections",
              "أقسام سجل الطالب",
              "Sections du dossier",
            )}
          >
            <Tab className="component-tab" id="overview">
              {t("Overview", "نظرة عامة", "Aperçu")}
            </Tab>
            <Tab className="component-tab" id="documents">
              {t("Documents", "المستندات", "Documents")}
            </Tab>
            <Tab className="component-tab" id="history">
              {t("History", "السجل", "Historique")}
            </Tab>
          </TabList>
          <TabPanel className="component-tab-panel" id="overview">
            <h3>{t("Student summary", "ملخص الطالب", "Résumé étudiant")}</h3>
            <p>
              {t(
                "Mariam Hassan · Year 2 · 42 completed credits",
                "مريم حسن · السنة 2 · 42 ساعة مكتملة",
                "Mariam Hassan · Année 2 · 42 crédits acquis",
              )}
            </p>
          </TabPanel>
          <TabPanel className="component-tab-panel" id="documents">
            <Badge tone="success">
              {number(props.locale, 2)}{" "}
              {t("verified documents", "مستندات موثقة", "documents vérifiés")}
            </Badge>
            <p>
              {t(
                "Transcript and identification.",
                "كشف الدرجات ومستند الهوية.",
                "Relevé de notes et identification.",
              )}
            </p>
          </TabPanel>
          <TabPanel className="component-tab-panel" id="history">
            <p>
              {t(
                "Record updated on 27 October 2026.",
                "حُدث السجل في 27 أكتوبر 2026.",
                "Dossier modifié le 27 octobre 2026.",
              )}
            </p>
          </TabPanel>
        </Tabs>
      </Panel>
      <Panel
        title={
          <span data-specimen="containers-resizable-layout-and-banner">
            {t(
              "Resizable layout and banner",
              "تخطيط قابل لتغيير الحجم ولافتة",
              "Disposition réglable et bannière",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          {!dismissed ? (
            <div className="callout tone-info">
              <span>
                {t(
                  "This specimen uses a dismissible banner.",
                  "يستخدم هذا المثال لافتة قابلة للإغلاق.",
                  "Cet exemple comprend une bannière refermable.",
                )}
              </span>
              <Button
                variant="ghost"
                aria-label={t(
                  "Dismiss banner",
                  "إغلاق اللافتة",
                  "Fermer la bannière",
                )}
                onClick={() => setDismissed(true)}
              >
                <X size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setDismissed(false)}>
              {t("Restore banner", "استعادة اللافتة", "Restaurer la bannière")}
            </Button>
          )}
          <Field
            label={`${t("Main panel width", "عرض اللوحة الرئيسية", "Largeur du panneau principal")}: ${number(props.locale, split)}%`}
          >
            <input
              className="component-range"
              type="range"
              min={30}
              max={70}
              value={split}
              onChange={(event) => setSplit(+event.target.value)}
            />
          </Field>
          <div
            className="component-split-panels"
            style={{ gridTemplateColumns: `${split}fr ${100 - split}fr` }}
          >
            <div className="result-box">
              {t("Main content", "المحتوى الرئيسي", "Contenu principal")}
            </div>
            <div className="result-box">
              {t("Related details", "تفاصيل ذات صلة", "Détails associés")}
            </div>
          </div>
        </div>
      </Panel>
    </ComponentFrame>
  );
}

export function NavigationDemo(props: DemoProps) {
  const t = useLabels(props);
  const anchorId = useId();
  const [anchor, setAnchor] = useState("details");
  const [active, setActive] = useState("overview");
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(1);
  const [sidebar, setSidebar] = useState(true);
  const [command, setCommand] = useState(false);
  const [query, setQuery] = useState("");
  const [crumb, setCrumb] = useState("student");
  const items = [
    ["overview", t("Overview", "نظرة عامة", "Aperçu")],
    ["courses", t("Courses", "المقررات", "Cours")],
    ["results", t("Results", "النتائج", "Résultats")],
    ["fees", t("Fees", "الرسوم", "Frais")],
  ];
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="navigation-breadcrumbs-and-navigation">
            {t(
              "Breadcrumbs and navigation",
              "مسار التنقل والتنقل",
              "Fil d’Ariane et navigation",
            )}
          </span>
        }
      >
        <nav aria-label={t("Breadcrumb", "مسار التنقل", "Fil d’Ariane")}>
          <ol className="component-breadcrumb">
            {[
              ["home", t("Home", "الرئيسية", "Accueil")],
              [
                "records",
                t("Student records", "سجلات الطلاب", "Dossiers étudiants"),
              ],
              ["student", t("Mariam Hassan", "مريم حسن", "Mariam Hassan")],
            ].map(([id, label], index) => (
              <li key={id}>
                <button
                  className="component-link"
                  type="button"
                  aria-current={crumb === id ? "page" : undefined}
                  onClick={() => setCrumb(id)}
                >
                  {label}
                </button>
                {index < 2 && <ChevronRight size={16} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </nav>
        <div className="component-navbar">
          <Button
            variant="ghost"
            onClick={() => setSidebar(!sidebar)}
            aria-expanded={sidebar}
            aria-label={t(
              "Toggle sample sidebar",
              "تبديل الشريط التجريبي",
              "Basculer la barre latérale",
            )}
          >
            <Menu size={20} />
          </Button>
          <strong>E-JUST</strong>
          <span className="component-grow" />
          <Button variant="secondary" onClick={() => setCommand(true)}>
            <Search size={20} />
            {t("Find action", "البحث عن إجراء", "Trouver une action")}
          </Button>
        </div>
        <div className="component-navigation-layout">
          {sidebar && (
            <nav
              className="component-sidebar"
              aria-label={t(
                "Sample navigation",
                "التنقل التجريبي",
                "Navigation exemple",
              )}
            >
              {items.map(([id, label]) => (
                <Button
                  key={id}
                  variant={active === id ? "primary" : "ghost"}
                  aria-current={active === id ? "page" : undefined}
                  onClick={() => setActive(id)}
                >
                  {label}
                </Button>
              ))}
            </nav>
          )}
          <div className="result-box component-grow">
            <h3>{items.find(([id]) => id === active)?.[1]}</h3>
            <p>
              {t(
                "Navigation changes this local content panel.",
                "يغير التنقل محتوى هذه اللوحة المحلية.",
                "La navigation modifie ce panneau local.",
              )}
            </p>
            <Badge>{crumb}</Badge>
          </div>
        </div>
      </Panel>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="navigation-pagination">
              {t("Pagination", "ترقيم الصفحات", "Pagination")}
            </span>
          }
        >
          <nav
            className="toolbar"
            aria-label={t(
              "Results pages",
              "صفحات النتائج",
              "Pages de résultats",
            )}
          >
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              {t("Previous", "السابق", "Précédent")}
            </Button>
            {[1, 2, 3].map((value) => (
              <Button
                key={value}
                variant={value === page ? "primary" : "ghost"}
                aria-current={value === page ? "page" : undefined}
                onClick={() => setPage(value)}
              >
                {number(props.locale, value)}
              </Button>
            ))}
            <Button
              variant="secondary"
              disabled={page === 3}
              onClick={() => setPage(page + 1)}
            >
              {t("Next", "التالي", "Suivant")}
            </Button>
          </nav>
          <p className="muted">
            {t("Page", "صفحة", "Page")} {number(props.locale, page)} /{" "}
            {number(props.locale, 3)}
          </p>
        </Panel>
        <Panel
          title={
            <span data-specimen="navigation-step-navigation">
              {t(
                "Step navigation",
                "التنقل بين الخطوات",
                "Navigation par étapes",
              )}
            </span>
          }
        >
          <ol className="component-steps">
            {[
              t("Details", "البيانات", "Détails"),
              t("Documents", "المستندات", "Documents"),
              t("Review", "المراجعة", "Révision"),
            ].map((label, index) => (
              <li key={label}>
                <button
                  type="button"
                  className="component-step"
                  aria-current={step === index + 1 ? "step" : undefined}
                  onClick={() => setStep(index + 1)}
                >
                  <span>
                    {step > index + 1 ? (
                      <Check size={20} />
                    ) : (
                      number(props.locale, index + 1)
                    )}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <Button
            variant="secondary"
            onClick={() => setStep(step === 3 ? 1 : step + 1)}
          >
            {step === 3
              ? t("Restart sample", "إعادة المثال", "Recommencer")
              : t("Continue", "متابعة", "Continuer")}
          </Button>
        </Panel>
      </div>
      <Panel
        title={
          <span data-specimen="navigation-anchors-and-overflow">
            {t(
              "Anchors and overflow navigation",
              "الروابط الداخلية والتنقل الإضافي",
              "Ancres et navigation supplémentaire",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <nav
            className="component-anchor-links"
            aria-label={t(
              "Sample section links",
              "روابط أقسام المثال",
              "Liens des sections exemple",
            )}
          >
            <a
              href={`#${anchorId}-details`}
              onClick={() => setAnchor("details")}
            >
              {t("Jump to details", "انتقل إلى التفاصيل", "Aller aux détails")}
            </a>
            <a
              href={`#${anchorId}-actions`}
              onClick={() => setAnchor("actions")}
            >
              {t("Jump to actions", "انتقل إلى الإجراءات", "Aller aux actions")}
            </a>
          </nav>
          <MenuTrigger>
            <AriaButton className="button button-secondary">
              {t("More destinations", "وجهات إضافية", "Autres destinations")}
              <ChevronDown size={20} />
            </AriaButton>
            <Popover className="component-popover">
              <AriaMenu
                className="component-menu"
                aria-label={t(
                  "Additional destinations",
                  "الوجهات الإضافية",
                  "Destinations supplémentaires",
                )}
                onAction={(key) => setActive(String(key))}
              >
                <MenuItem id="results" className="component-menu-item">
                  {t("Results", "النتائج", "Résultats")}
                </MenuItem>
                <MenuItem id="fees" className="component-menu-item">
                  {t("Fees", "الرسوم", "Frais")}
                </MenuItem>
              </AriaMenu>
            </Popover>
          </MenuTrigger>
        </div>
        <section
          id={`${anchorId}-details`}
          tabIndex={-1}
          className="result-box"
        >
          <h4>{t("Details section", "قسم التفاصيل", "Section des détails")}</h4>
          <p>
            {t(
              "The link moves focus to this local section.",
              "ينقل الرابط التركيز إلى هذا القسم المحلي.",
              "Le lien déplace le focus vers cette section locale.",
            )}
          </p>
        </section>
        <section
          id={`${anchorId}-actions`}
          tabIndex={-1}
          className="result-box"
        >
          <h4>
            {t("Actions section", "قسم الإجراءات", "Section des actions")}
          </h4>
          <output>
            {t("Current anchor", "الرابط الحالي", "Ancre active")}:{" "}
            {anchor === "details"
              ? t("Details", "التفاصيل", "Détails")
              : t("Actions", "الإجراءات", "Actions")}
          </output>
        </section>
      </Panel>
      <ModalExample
        open={command}
        onClose={() => setCommand(false)}
        title={t("Find an action", "البحث عن إجراء", "Trouver une action")}
        locale={props.locale}
      >
        <div className="demo-stack">
          <Field
            label={t(
              "Search actions",
              "البحث في الإجراءات",
              "Rechercher une action",
            )}
          >
            <input
              className="input"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
          {items
            .filter(([, label]) =>
              label.toLowerCase().includes(query.toLowerCase()),
            )
            .map(([id, label]) => (
              <Button
                key={id}
                variant="ghost"
                onClick={() => {
                  setActive(id);
                  setCommand(false);
                  props.notify(label);
                }}
              >
                {label}
              </Button>
            ))}
          {!items.some(([, label]) =>
            label.toLowerCase().includes(query.toLowerCase()),
          ) && (
            <Callout>
              {t(
                "No matching actions",
                "لا توجد إجراءات مطابقة",
                "Aucune action correspondante",
              )}
            </Callout>
          )}
        </div>
      </ModalExample>
    </ComponentFrame>
  );
}

export function ListsDemo(props: DemoProps) {
  const t = useLabels(props);
  const [items, setItems] = useState(["CSE-201", "MAT-204", "PHY-202"]);
  const [selected, setSelected] = useState("CSE-201");
  const [expanded, setExpanded] = useState(["engineering"]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const names: Record<string, string> = {
    "CSE-201": t("Data structures", "هياكل البيانات", "Structures de données"),
    "MAT-204": t("Linear algebra", "الجبر الخطي", "Algèbre linéaire"),
    "PHY-202": t("Applied physics", "الفيزياء التطبيقية", "Physique appliquée"),
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setItems(next);
  };
  const toggle = (id: string) =>
    setExpanded(
      expanded.includes(id)
        ? expanded.filter((value) => value !== id)
        : [...expanded, id],
    );
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="lists-selectable-and-reorderable-list">
              {t(
                "Selectable and reorderable list",
                "قائمة قابلة للاختيار والترتيب",
                "Liste sélectionnable et réorganisable",
              )}
            </span>
          }
        >
          <Field
            label={t("Filter courses", "ترشيح المقررات", "Filtrer les cours")}
          >
            <input
              className="input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
          <ul className="component-record-list">
            {items
              .filter((id) =>
                `${id} ${names[id]}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((id) => {
                const index = items.indexOf(id);
                return (
                  <li
                    key={id}
                    draggable
                    onDragStart={() => setDragged(id)}
                    onDragEnd={() => setDragged(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (dragged) move(items.indexOf(dragged), index);
                      setDragged(null);
                    }}
                    data-selected={selected === id}
                  >
                    <GripVertical size={20} aria-hidden="true" />
                    <button
                      className="component-list-action"
                      type="button"
                      aria-pressed={selected === id}
                      onClick={() => setSelected(id)}
                    >
                      <strong>
                        <bdi>{id}</bdi>
                      </strong>
                      <span>{names[id]}</span>
                    </button>
                    <Button
                      variant="ghost"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                      aria-label={`${t("Move up", "تحريك لأعلى", "Monter")} ${id}`}
                    >
                      <ArrowUp size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, index + 1)}
                      aria-label={`${t("Move down", "تحريك لأسفل", "Descendre")} ${id}`}
                    >
                      <ArrowDown size={20} />
                    </Button>
                  </li>
                );
              })}
          </ul>
          {!items.some((id) =>
            `${id} ${names[id]}`.toLowerCase().includes(query.toLowerCase()),
          ) && (
            <Callout>
              {t(
                "No matching courses. Clear the filter.",
                "لا توجد مقررات مطابقة. امسح المرشح.",
                "Aucun cours correspondant. Effacez le filtre.",
              )}
            </Callout>
          )}
          <div className="result-box">
            <bdi>{selected}</bdi> · {items.join(" → ")}
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="lists-hierarchy-and-description-list">
              {t(
                "Hierarchy and description list",
                "التسلسل الهرمي وقائمة الوصف",
                "Hiérarchie et descriptions",
              )}
            </span>
          }
        >
          <ul className="component-tree">
            <li>
              <button
                type="button"
                onClick={() => toggle("engineering")}
                aria-expanded={expanded.includes("engineering")}
                className="component-tree-trigger"
              >
                {expanded.includes("engineering") ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
                <Folder size={20} />
                {t(
                  "Engineering faculty",
                  "كلية الهندسة",
                  "Faculté d’ingénierie",
                )}
              </button>
              {expanded.includes("engineering") && (
                <ul>
                  <li>
                    <button
                      type="button"
                      onClick={() => toggle("computer")}
                      aria-expanded={expanded.includes("computer")}
                      className="component-tree-trigger"
                    >
                      {expanded.includes("computer") ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                      <Folder size={20} />
                      {t(
                        "Computer Engineering",
                        "هندسة الحاسبات",
                        "Génie informatique",
                      )}
                    </button>
                    {expanded.includes("computer") && (
                      <ul>
                        {items.slice(0, 2).map((id) => (
                          <li key={id}>
                            <button
                              className="component-tree-trigger"
                              type="button"
                              onClick={() => setSelected(id)}
                            >
                              <FileText size={20} />
                              <bdi>{id}</bdi>
                              {selected === id && <Check size={16} />}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <button
                      type="button"
                      className="component-tree-trigger"
                      onClick={() =>
                        props.notify(
                          t(
                            "Energy Engineering selected",
                            "تم اختيار هندسة الطاقة",
                            "Génie énergétique sélectionné",
                          ),
                        )
                      }
                    >
                      <Folder size={20} />
                      {t(
                        "Energy Engineering",
                        "هندسة الطاقة",
                        "Génie énergétique",
                      )}
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <hr className="component-divider" />
          <dl className="component-description-list">
            <div>
              <dt>
                {t("Selected course", "المقرر المحدد", "Cours sélectionné")}
              </dt>
              <dd>
                <bdi>{selected}</bdi>
              </dd>
            </div>
            <div>
              <dt>{t("Credits", "الساعات", "Crédits")}</dt>
              <dd>{number(props.locale, 3)}</dd>
            </div>
            <div>
              <dt>{t("Type", "النوع", "Type")}</dt>
              <dd>
                {t("Core requirement", "متطلب أساسي", "Cours obligatoire")}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>
    </ComponentFrame>
  );
}
