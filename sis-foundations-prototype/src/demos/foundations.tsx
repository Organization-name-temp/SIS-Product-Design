import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Clock,
  Copy,
  Download,
  Ellipsis,
  Eye,
  FileText,
  Filter,
  Folder,
  Globe,
  GraduationCap,
  Heart,
  House,
  Info,
  Layers,
  LayoutGrid,
  Link,
  LockKeyhole,
  Mail,
  Menu,
  Moon,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Callout,
  Disclosure,
  Field,
  ModalExample,
  Panel,
  copyText,
  download,
  number,
  tr,
  type DemoProps,
  type DemoRenderer,
  type Locale,
} from "../shared";
import palette from "../data/palette.json";
import typography from "../data/typography.json";
import decisions from "../data/decisions.json";
import "./foundations.css";
import {UsageGuides}from"./usage-guides";
import {MotionWorkbench}from"./motion-workbench";

const primitives = palette.primitives as Record<string, Record<string, string>>;
const themes = palette.themes as Record<
  "light" | "dark",
  Record<string, string>
>;
const resolve = (reference: string) => {
  const [group, shade] = reference.split(".");
  return primitives[group]?.[shade] ?? "#000000";
};
const color = (theme: DemoProps["theme"], role: string) =>
  resolve(themes[theme][role]);
const luminance = (hex: string) => {
  const channels = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (foreground: string, background: string) => {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
};
const px = (value: number) => `${value / 16}rem`;

const roleNames: Record<string, [string, string, string]> = {
  "bg-canvas": ["Canvas", "خلفية الصفحة", "Canevas"],
  "bg-surface": ["Surface", "السطح", "Surface"],
  "bg-raised": ["Raised surface", "سطح مرتفع", "Surface surélevée"],
  "bg-subtle": ["Subtle surface", "سطح خافت", "Surface discrète"],
  "text-primary": ["Primary text", "النص الأساسي", "Texte principal"],
  "text-secondary": ["Secondary text", "النص الثانوي", "Texte secondaire"],
  "action-primary-bg": [
    "Primary action",
    "الإجراء الأساسي",
    "Action principale",
  ],
  "action-primary-fg": ["Action label", "نص الإجراء", "Libellé d’action"],
  "focus-ring": ["Focus ring", "حلقة التركيز", "Anneau de focus"],
  "border-control": ["Control border", "حدود الحقل", "Bordure du champ"],
  "link-default": ["Link", "رابط", "Lien"],
  "input-bg": ["Input background", "خلفية الإدخال", "Fond du champ"],
};
const roleLabel = (locale: Locale, role: string) =>
  roleNames[role] ? tr(locale, ...roleNames[role]) : role;

function SwatchScale({
  name,
  values,
  props,
}: {
  name: string;
  values: Record<string, string>;
  props: DemoProps;
}) {
  return (
    <div className="fd-swatch-scale">
      {Object.entries(values).map(([step, value]) => (
        <button
          key={step}
          type="button"
          className={`fd-swatch ${name === "brand" && step === "500" ? "fd-reference" : ""}`}
          onClick={() => void copyText(value, props.notify, props.locale)}
          aria-label={`${tr(props.locale, "Copy", "نسخ", "Copier")} ${name}.${step} ${value}`}
        >
          <span
            className="fd-swatch-color"
            style={{ backgroundColor: value }}
          />
          <span>{step}</span>
          <code dir="ltr">{value}</code>
          {name === "brand" && step === "500" && (
            <span className="fd-brand-marker">
              {tr(props.locale, "Brand", "الهوية", "Marque")}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function Colors(props: DemoProps) {
  const { locale, theme, notify, state } = props;
  const [foreground, setForeground] = useState("text-primary");
  const [background, setBackground] = useState("bg-surface");
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    setForeground(state === "selected" ? "action-primary-fg" : "text-primary");
    setBackground(state === "selected" ? "action-primary-bg" : "bg-surface");
  }, [state]);
  const roles = Object.keys(themes.light);
  const shownRoles = query.trim()
    ? roles.filter((role) =>
        `${role} ${roleLabel(locale, role)} ${color(theme, role)}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
      )
    : all
      ? roles
      : Object.keys(roleNames);
  const fg = color(theme, foreground),
    bg = color(theme, background),
    ratio = contrast(fg, bg);
  const mapping = [
    ...new Set([
      foreground,
      background,
      "text-primary",
      "bg-surface",
      "bg-canvas",
      "action-primary-bg",
      "focus-ring",
    ]),
  ];
  return (
    <div className="fd-colors-layout">
      <Panel className="fd-color-library">
        <section className="fd-section" data-specimen="colors-brand">
          <h3>
            {tr(
              locale,
              "University brand",
              "هوية الجامعة",
              "Marque universitaire",
            )}
          </h3>
          <p className="muted">
            {tr(
              locale,
              "E-JUST reference #EA232B. Select a swatch to copy its approved value.",
              "مرجع E-JUST هو #EA232B. اختر لوناً لنسخ قيمته المعتمدة.",
              "Référence E-JUST #EA232B. Sélectionnez une nuance pour copier sa valeur approuvée.",
            )}
          </p>
          <SwatchScale name="brand" values={primitives.brand} props={props} />
        </section>
        <section className="fd-section" data-specimen="colors-neutral">
          <h3>
            {tr(
              locale,
              "Neutral palette",
              "الألوان المحايدة",
              "Palette neutre",
            )}
          </h3>
          <p className="muted">
            {tr(
              locale,
              "Neutrals define surfaces, structure, text, and borders.",
              "تحدد الألوان المحايدة الأسطح والبنية والنص والحدود.",
              "Les neutres définissent les surfaces, la structure, le texte et les bordures.",
            )}
          </p>
          <SwatchScale
            name="neutral"
            values={primitives.neutral}
            props={props}
          />
        </section>
        <section className="fd-section" data-specimen="colors-semantic">
          <h3>
            {tr(
              locale,
              "Semantic roles",
              "الأدوار الدلالية",
              "Rôles sémantiques",
            )}
          </h3>
          <Field
            label={tr(
              locale,
              "Find a role or value",
              "البحث عن دور أو قيمة",
              "Rechercher un rôle ou une valeur",
            )}
          >
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tr(
                locale,
                "Try text, chart, input, or #CD1722",
                "جرّب text أو chart أو input أو #CD1722",
                "Essayez text, chart, input ou #CD1722",
              )}
            />
          </Field>
          <div className="fd-semantic-grid">
            {shownRoles.map((role) => (
              <button
                type="button"
                className="fd-semantic-row"
                key={role}
                onClick={() =>
                  void copyText(
                    `--sys-color-${role}: ${color(theme, role)};`,
                    notify,
                    locale,
                  )
                }
                aria-label={`${tr(locale, "Copy token", "نسخ الرمز", "Copier le jeton")} ${role}`}
              >
                <span
                  className="fd-color-chip"
                  style={{ background: color(theme, role) }}
                />
                <span className="fd-role-label">
                  {roleLabel(locale, role)}
                  <code dir="ltr">{role}</code>
                </span>
                <code dir="ltr">{color(theme, role)}</code>
                <Copy size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
          {shownRoles.length === 0 && (
            <p role="status">
              {tr(
                locale,
                "No matching roles.",
                "لا توجد أدوار مطابقة.",
                "Aucun rôle correspondant.",
              )}
            </p>
          )}
          {!query && (
            <Button variant="ghost" onClick={() => setAll(!all)}>
              {all
                ? tr(
                    locale,
                    "Show core roles",
                    "عرض الأدوار الرئيسية",
                    "Afficher les rôles principaux",
                  )
                : tr(
                    locale,
                    "Show all roles",
                    "عرض جميع الأدوار",
                    "Afficher tous les rôles",
                  )}{" "}
              <span>
                (
                {number(
                  locale,
                  all ? Object.keys(roleNames).length : roles.length,
                )}
                )
              </span>
            </Button>
          )}
        </section>
        <section className="fd-section" data-specimen="colors-feedback">
          <h3>
            {tr(
              locale,
              "Feedback colors",
              "ألوان الملاحظات",
              "Couleurs des messages",
            )}
          </h3>
          <p className="muted">
            {tr(
              locale,
              "Select a status to inspect its text and background contrast.",
              "اختر حالة لفحص التباين بين النص والخلفية.",
              "Sélectionnez un état pour examiner le contraste du texte et du fond.",
            )}
          </p>
          <div className="fd-feedback-grid">
            {(["success", "warning", "danger", "info"] as const).map(
              (tone, index) => (
                <button
                  key={tone}
                  type="button"
                  className="fd-feedback-token"
                  style={{
                    background: color(theme, `${tone}-bg`),
                    color: color(theme, `${tone}-text`),
                    borderColor: color(theme, `${tone}-border`),
                  }}
                  onClick={() => {
                    setForeground(`${tone}-text`);
                    setBackground(`${tone}-bg`);
                    notify(
                      tr(
                        locale,
                        "Contrast pair selected",
                        "تم اختيار زوج التباين",
                        "Paire de contraste sélectionnée",
                      ),
                    );
                  }}
                >
                  <Badge tone={tone}>
                    {tr(
                      locale,
                      ...([
                        ["Success", "نجاح", "Succès"],
                        ["Warning", "تحذير", "Avertissement"],
                        ["Danger", "خطر", "Danger"],
                        ["Information", "معلومات", "Information"],
                      ][index] as [string, string, string]),
                    )}
                  </Badge>
                  <code dir="ltr">{color(theme, `${tone}-icon`)}</code>
                </button>
              ),
            )}
          </div>
        </section>
        <ColorLayers {...props} />
        <Disclosure
          title={tr(
            locale,
            "Supporting reference palettes",
            "لوحات الألوان المرجعية الإضافية",
            "Palettes de référence complémentaires",
          )}
        >
          {["success", "warning", "danger", "info", "violet", "cyan"].map(
            (name) => (
              <section key={name} className="fd-section">
                <h4>{name}</h4>
                <SwatchScale
                  name={name}
                  values={primitives[name]}
                  props={props}
                />
              </section>
            ),
          )}
        </Disclosure>
      </Panel>
      <Panel
        className="fd-contrast-panel"
        title={
          <span data-specimen="colors-contrast">
            {tr(
              locale,
              "Contrast checker",
              "فاحص التباين",
              "Vérificateur de contraste",
            )}
          </span>
        }
      >
        <p className="muted">
          {tr(
            locale,
            "Calculate WCAG 2 contrast for the selected solid colors.",
            "احسب تباين WCAG 2 للألوان المصمتة المختارة.",
            "Calculez le contraste WCAG 2 des couleurs unies sélectionnées.",
          )}
        </p>
        <Field
          label={tr(locale, "Foreground", "اللون الأمامي", "Premier plan")}
        >
          <select
            className="input"
            value={foreground}
            onChange={(event) => setForeground(event.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabel(locale, role)} ({color(theme, role)})
              </option>
            ))}
          </select>
        </Field>
        <Field label={tr(locale, "Background", "الخلفية", "Arrière-plan")}>
          <select
            className="input"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabel(locale, role)} ({color(theme, role)})
              </option>
            ))}
          </select>
        </Field>
        <div
          className={`fd-ratio tone-${ratio >= 4.5 ? "success" : "danger"}`}
          role="status"
        >
          {ratio >= 4.5 ? (
            <CircleCheck size={24} aria-hidden="true" />
          ) : (
            <CircleAlert size={24} aria-hidden="true" />
          )}
          <div>
            <strong>
              {number(locale, ratio, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              :1
            </strong>
            <p>
              {ratio >= 4.5
                ? tr(
                    locale,
                    "Normal text passes AA.",
                    "النص العادي يحقق AA.",
                    "Le texte courant satisfait AA.",
                  )
                : tr(
                    locale,
                    "Normal text fails AA.",
                    "النص العادي لا يحقق AA.",
                    "Le texte courant ne satisfait pas AA.",
                  )}
            </p>
          </div>
        </div>
        <ul className="fd-contrast-rules">
          {[
            [
              4.5,
              tr(
                locale,
                "Normal text AA",
                "النص العادي AA",
                "Texte courant AA",
              ),
            ],
            [
              3,
              tr(
                locale,
                "Large text / UI AA",
                "النص الكبير / الواجهة AA",
                "Grand texte / interface AA",
              ),
            ],
            [
              7,
              tr(
                locale,
                "Normal text AAA",
                "النص العادي AAA",
                "Texte courant AAA",
              ),
            ],
          ].map(([threshold, label]) => (
            <li key={String(label)}>
              {ratio >= Number(threshold) ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <X size={16} aria-hidden="true" />
              )}
              <span>{label}</span>
              <code>{threshold}:1</code>
            </li>
          ))}
        </ul>
        <Field
          label={tr(locale, "Preview text", "نص المعاينة", "Texte d’aperçu")}
        >
          <input
            className="input"
            value={preview}
            onChange={(event) => setPreview(event.target.value)}
            placeholder={tr(
              locale,
              "Write your own sample",
              "اكتب مثالاً",
              "Saisissez votre exemple",
            )}
          />
        </Field>
        <div
          className="fd-contrast-preview"
          style={{ background: bg, color: fg }}
        >
          {preview ||
            tr(
              locale,
              "University registration and course management. CS101 · 2026",
              "التسجيل في الجامعة وإدارة المقررات الدراسية. CS101 · 2026",
              "Inscription universitaire et gestion des cours. CS101 · 2026",
            )}
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            void copyText(
              `${foreground}: ${fg}; ${background}: ${bg}; contrast: ${ratio.toFixed(2)}:1`,
              notify,
              locale,
            )
          }
        >
          <Copy size={16} aria-hidden="true" />
          {tr(
            locale,
            "Copy contrast pair",
            "نسخ زوج التباين",
            "Copier la paire",
          )}
        </Button>
        <section className="fd-section" data-specimen="colors-themes">
          <h3>
            {tr(
              locale,
              "Theme mapping",
              "ربط السمات",
              "Correspondance des thèmes",
            )}
          </h3>
          <div className="fd-table-scroll" tabIndex={0}>
            <table className="sample-table fd-mapping-table">
              <thead>
                <tr>
                  <th>{tr(locale, "Role", "الدور", "Rôle")}</th>
                  <th>{tr(locale, "Light", "فاتح", "Clair")}</th>
                  <th>{tr(locale, "Dark", "داكن", "Sombre")}</th>
                </tr>
              </thead>
              <tbody>
                {mapping.map((role) => (
                  <tr key={role}>
                    <th scope="row">
                      <code>{role}</code>
                    </th>
                    {(["light", "dark"] as const).map((mode) => (
                      <td key={mode}>
                        <span className="fd-mapping-value">
                          <span
                            className="fd-color-chip"
                            style={{ background: color(mode, role) }}
                          />
                          <code dir="ltr">{color(mode, role)}</code>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="muted">
          {tr(
            locale,
            "The checker evaluates solid colors. Browser rendering and focus behavior require separate review.",
            "يفحص هذا الاختبار الألوان المصمتة. يتطلب عرض المتصفح وسلوك التركيز مراجعة منفصلة.",
            "Ce calcul évalue les couleurs unies. Le rendu du navigateur et le focus demandent un examen distinct.",
          )}
        </p>
      </Panel>
    </div>
  );
}

function ColorLayers({ locale, theme, notify }: DemoProps) {
  const aliases = palette.components as Record<string, string>;
  const [alias, setAlias] = useState("button-primary-background");
  const semantic = aliases[alias];
  const reference = themes[theme][semantic];
  const referenceValue = resolve(reference);
  return (
    <>
      <section className="fd-section" data-specimen="colors-charts">
        <h3>
          {tr(
            locale,
            "Chart colors",
            "ألوان الرسوم",
            "Couleurs des graphiques",
          )}
        </h3>
        <p className="muted">
          {tr(
            locale,
            "Eight distinct series use theme-specific roles. Visible series numbers preserve meaning beyond color.",
            "تستخدم ثماني سلاسل أدواراً خاصة بكل سمة. تحفظ أرقام السلاسل المرئية المعنى بجانب اللون.",
            "Huit séries utilisent des rôles propres au thème. Les numéros visibles conservent le sens au-delà de la couleur.",
          )}
        </p>
        <div className="fd-chart-palette">
          {Array.from({ length: 8 }, (_, index) => {
            const role = `chart-${index + 1}`;
            return (
              <button
                type="button"
                key={role}
                className="fd-chart-color"
                onClick={() =>
                  void copyText(
                    `--sys-color-${role}: ${color(theme, role)};`,
                    notify,
                    locale,
                  )
                }
              >
                <span style={{ background: color(theme, role) }} />
                <span>
                  {tr(locale, "Series", "السلسلة", "Série")}{" "}
                  {number(locale, index + 1)}
                </span>
                <code>{color(theme, role)}</code>
              </button>
            );
          })}
        </div>
      </section>
      <section className="fd-section" data-specimen="colors-token-layers">
        <h3>
          {tr(
            locale,
            "Reference, semantic, and component layers",
            "طبقات المرجع والدلالة والمكوّن",
            "Couches de référence, sémantique et de composant",
          )}
        </h3>
        <Field
          label={tr(
            locale,
            "Inspect a component alias",
            "فحص اسم مستعار للمكوّن",
            "Examiner un alias de composant",
          )}
        >
          <select
            className="input"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
          >
            {Object.keys(aliases).map((key) => (
              <option value={key} key={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
        <div className="fd-token-chain">
          {[
            [
              tr(locale, "Reference", "المرجع", "Référence"),
              `--ref-color-${reference.replace(".", "-")}`,
            ],
            [
              tr(locale, "Semantic", "الدلالة", "Sémantique"),
              `--sys-color-${semantic}`,
            ],
            [tr(locale, "Component", "المكوّن", "Composant"), `--cmp-${alias}`],
          ].map(([label, token]) => (
            <button
              type="button"
              className="fd-token-layer"
              key={label}
              onClick={() => void copyText(token, notify, locale)}
            >
              <span
                className="fd-color-chip"
                style={{ background: referenceValue }}
              />
              <strong>{label}</strong>
              <code>{token}</code>
              <code>{referenceValue}</code>
              <Copy size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="muted">
          {tr(
            locale,
            "The component name remains stable when the theme changes. The semantic role resolves to the approved reference value.",
            "يبقى اسم المكوّن ثابتاً عند تغيير السمة. يشير الدور الدلالي إلى القيمة المرجعية المعتمدة.",
            "Le nom du composant reste stable lors du changement de thème. Le rôle sémantique renvoie à la référence approuvée.",
          )}
        </p>
      </section>
    </>
  );
}

function BorderPurposes({ locale }: { locale: Locale }) {
  const items: [string, string, string, string][] = [
    ["border-subtle", "Subtle division", "فاصل خافت", "Séparation discrète"],
    [
      "border-default",
      "Ordinary surface boundary",
      "حد سطح عادي",
      "Limite de surface ordinaire",
    ],
    [
      "border-control",
      "Interactive control boundary",
      "حد عنصر تحكم",
      "Limite de commande",
    ],
    [
      "border-strong",
      "Strong structural boundary",
      "حد بنيوي قوي",
      "Limite structurelle forte",
    ],
  ];
  return (
    <Panel
      title={
        <span data-specimen="borders-purposes">
          {tr(
            locale,
            "Border purposes",
            "استخدامات الحدود",
            "Rôles des bordures",
          )}
        </span>
      }
    >
      <div className="fd-border-purposes">
        {items.map(([token, en, ar, fr]) => (
          <div key={token} style={{ borderColor: `var(--sys-color-${token})` }}>
            <strong>{tr(locale, en, ar, fr)}</strong>
            <code>{token}</code>
            <span>1px</span>
          </div>
        ))}
      </div>
      <p className="muted">
        {tr(
          locale,
          "All standard boundaries use a 1px border. Semantic roles control their contrast and purpose.",
          "تستخدم الحدود القياسية سُمك 1px. تحدد الأدوار الدلالية تباينها وغرضها.",
          "Toutes les limites standard utilisent une bordure de 1px. Les rôles sémantiques définissent leur contraste et leur fonction.",
        )}
      </p>
    </Panel>
  );
}

const typeLabels: Record<string, [string, string, string]> = {
  "page-title": ["Page title", "عنوان الصفحة", "Titre de page"],
  "section-heading": ["Section heading", "عنوان القسم", "Titre de section"],
  "subsection-heading": ["Subsection heading", "عنوان فرعي", "Sous-titre"],
  body: ["Body", "النص الأساسي", "Texte courant"],
  "field-label": ["Field label", "تسمية الحقل", "Libellé de champ"],
  help: ["Help text", "نص المساعدة", "Texte d’aide"],
  button: ["Button", "زر", "Bouton"],
  navigation: ["Navigation", "التنقل", "Navigation"],
  "table-heading": ["Table heading", "عنوان الجدول", "En-tête de tableau"],
  table: ["Table value", "قيمة الجدول", "Valeur de tableau"],
};

function TypographyDemo({ locale, notify, variant }: DemoProps) {
  const [sample, setSample] = useState("");
  const [scale, setScale] = useState(100);
  const [fontStatus, setFontStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const baseContent = tr(
    locale,
    "University registration and course management",
    "التَّسجيل في الجامعة وإدارة المقررات الدِّراسية",
    "Inscription universitaire et gestion des unités d’enseignement",
  );
  const content =
    sample ||
    (variant === "long-content"
      ? `${baseContent}. ${baseContent}. ${baseContent}.`
      : baseContent);
  const loadFonts = () => {
    setLoading(true);
    void Promise.all(
      Object.entries(typography.fontCandidates).map(async ([key, font]) => {
        try {
          const faces = await document.fonts.load(
            `400 16px "${font.family}"`,
            "الجامعة Émilie 0123456789",
          );
          return [
            key,
            faces.length > 0 &&
              document.fonts.check(`400 16px "${font.family}"`),
          ] as const;
        } catch {
          return [key, false] as const;
        }
      }),
    ).then((entries) => {
      setFontStatus(Object.fromEntries(entries));
      setLoading(false);
    });
  };
  useEffect(loadFonts, []);
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="typography-roles">
            {tr(
              locale,
              "Typography scale",
              "مقياس الخط",
              "Échelle typographique",
            )}
          </span>
        }
      >
        <div className="fd-two-fields" data-specimen="typography-wrapping">
          <Field
            label={tr(
              locale,
              "Comparison text",
              "نص المقارنة",
              "Texte de comparaison",
            )}
          >
            <input
              className="input"
              value={sample}
              onChange={(event) => setSample(event.target.value)}
              placeholder={content}
            />
          </Field>
          <Field
            label={`${tr(locale, "Sample text size", "حجم نص المعاينة", "Taille de l’exemple")} ${number(locale, scale)}%`}
          >
            <input
              type="range"
              min="100"
              max="200"
              step="25"
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
            />
          </Field>
        </div>
        <div className="fd-type-roles">
          {Object.entries(typography.roles).map(([role, spec]) => (
            <div className="fd-type-row" key={role}>
              <div>
                <strong>{tr(locale, ...typeLabels[role])}</strong>
                <code>
                  {spec.sizeReferencePx}px /{" "}
                  {locale === "ar"
                    ? spec.lineHeightReferencePx.arabic
                    : spec.lineHeightReferencePx.latin}
                  px · {spec.weight}
                </code>
              </div>
              <div
                className="fd-type-sample"
                style={{
                  fontSize: `${(spec.sizeRem * scale) / 100}rem`,
                  fontWeight: spec.weight,
                  lineHeight: `${((locale === "ar" ? spec.lineHeightRem.arabic : spec.lineHeightRem.latin) * scale) / 100}rem`,
                  letterSpacing: 0,
                }}
                lang={locale}
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                {content}
              </div>
              <Button
                variant="ghost"
                aria-label={`${tr(locale, "Copy typography role", "نسخ دور الخط", "Copier le rôle typographique")} ${role}`}
                onClick={() =>
                  void copyText(
                    `font-size: var(--sys-font-size-${role}); line-height: var(--sys-line-height-${role}); font-weight: var(--sys-font-weight-${role});`,
                    notify,
                    locale,
                  )
                }
              >
                <Copy size={16} aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="typography-fonts">
            {tr(
              locale,
              "IBM Plex: approved weights and language coverage",
              "IBM Plex: الأوزان المعتمدة وتغطية اللغات",
              "Trois familles de polices chargées",
            )}
          </span>
        }
      >
        <p className="muted">
          {tr(
            locale,
            "Use IBM Plex Sans Arabic for Arabic and English. Compare the approved weights with the same content.",
            "تستخدم كل عائلة المحتوى والعرض والأحجام والأوزان نفسها. لا تقلل الكثافة المدمجة حجم النص.",
            "Chaque famille utilise le même contenu, la même largeur, les mêmes tailles et graisses. La densité compacte conserve la taille du texte.",
          )}
        </p>
        <div className="fd-font-comparison">
          {Object.entries(typography.fontCandidates).map(([key, font]) => (
            <article
              key={key}
              className={`fd-font-card ${variant === key ? "fd-selected" : ""}`}
              style={{ fontFamily: `"${font.family}", sans-serif` }}
            >
              <h4>{font.family}</h4>
              <Badge tone={fontStatus[key] ? "success" : "warning"}>
                {fontStatus[key]
                  ? tr(
                      locale,
                      "Font available",
                      "الخط متاح",
                      "Police disponible",
                    )
                  : tr(
                      locale,
                      "Font not confirmed",
                      "لم يتأكد توفر الخط",
                      "Police non confirmée",
                    )}
              </Badge>
              {[400, 500, 600, 700].map((weight) => (
                <div
                  className="fd-font-weight"
                  key={weight}
                  style={{ fontWeight: weight }}
                >
                  <span className="muted">{number(locale, weight)}</span>
                  <p>{content}</p>
                </div>
              ))}
              <p data-specimen="typography-language" lang="ar" dir="rtl">
                الجامعة · مُقَرَّرات · أحمد حسن
              </p>

              <p data-specimen="typography-numbers" dir="ltr">
                0123456789 · CS101 ·{" "}
                {number(locale, 1250.5, { minimumFractionDigits: 2 })}
              </p>
            </article>
          ))}
        </div>
        <Button variant="secondary" onClick={loadFonts} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" />
          {loading
            ? tr(
                locale,
                "Check in progress",
                "جارٍ الفحص",
                "Vérification en cours",
              )
            : tr(
                locale,
                "Check font loading",
                "فحص تحميل الخطوط",
                "Vérifier les polices",
              )}
        </Button>
        <Callout>
          {tr(
            locale,
            "Use weight 700 for limited emphasis. Keep zero added letter spacing. Review Arabic marks and English letter clarity.",
            "استخدم الوزن 700 للتأكيد المحدود. أبقِ تباعد الحروف الإضافي صفراً. راجع التشكيل العربي واللكنات الفرنسية.",
            "Réservez la graisse 700 à une emphase limitée. Conservez un espacement ajouté nul. Examinez les signes arabes et les accents français.",
          )}
        </Callout>
      </Panel>
    </div>
  );
}

function SpacingDemo({ locale, notify, density, variant }: DemoProps) {
  const [padding, setPadding] = useState(24);
  const [gap, setGap] = useState(12);
  const [flow, setFlow] = useState("inline");
  useEffect(
    () => setFlow(variant === "stacked" ? "stacked" : "inline"),
    [variant],
  );
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="spacing-scale">
            {tr(
              locale,
              "The approved spacing scale",
              "مقياس المسافات المعتمد",
              "Échelle d’espacement approuvée",
            )}
          </span>
        }
      >
        <p className="muted">
          {tr(
            locale,
            "All 11 named values use a 2px base. Pixel references assume a 16px browser root.",
            "تستخدم القيم المسماة البالغ عددها 11 أساساً قدره 2px. تفترض القيم المرجعية جذر متصفح قدره 16px.",
            "Les 11 valeurs nommées utilisent une base de 2px. Les références supposent une racine de navigateur de 16px.",
          )}
        </p>
        <div className="fd-spacing-scale">
          {decisions.spacing.approvedValuesPx.map((value) => (
            <button
              type="button"
              className="fd-spacing-row"
              key={value}
              onClick={() => {
                setPadding(value);
                notify(
                  tr(
                    locale,
                    "Padding sample updated",
                    "تم تحديث مثال الحشو",
                    "Exemple de marge intérieure mis à jour",
                  ),
                );
              }}
            >
              <code>space-{value}</code>
              <span className="fd-spacing-meter">
                <span style={{ inlineSize: px(value) }} />
              </span>
              <span>
                {number(locale, value)}px ·{" "}
                {number(locale, value / 16, { maximumFractionDigits: 3 })}rem
              </span>
              <span className="fd-padding-mini" style={{ padding: px(value) }}>
                <span />
              </span>
            </button>
          ))}
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="spacing-measure">
            {tr(
              locale,
              "Measured padding and gap",
              "قياس الحشو والفجوة",
              "Marge intérieure et écart mesurés",
            )}
          </span>
        }
      >
        <div className="fd-two-fields">
          <Field
            label={tr(
              locale,
              "Container padding",
              "حشو الحاوية",
              "Marge intérieure du conteneur",
            )}
          >
            <select
              className="input"
              value={padding}
              onChange={(event) => setPadding(Number(event.target.value))}
            >
              {decisions.spacing.approvedValuesPx.map((value) => (
                <option value={value} key={value}>
                  {number(locale, value)}px
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={tr(
              locale,
              "Gap between elements",
              "الفجوة بين العناصر",
              "Écart entre les éléments",
            )}
          >
            <select
              className="input"
              value={gap}
              onChange={(event) => setGap(Number(event.target.value))}
            >
              {decisions.spacing.approvedValuesPx.map((value) => (
                <option value={value} key={value}>
                  {number(locale, value)}px
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field
          label={tr(locale, "Composition", "ترتيب العناصر", "Composition")}
        >
          <select
            className="input"
            value={flow}
            onChange={(event) => setFlow(event.target.value)}
          >
            <option value="inline">
              {tr(locale, "Inline", "أفقي", "En ligne")}
            </option>
            <option value="stacked">
              {tr(locale, "Stacked", "رأسي", "Empilé")}
            </option>
          </select>
        </Field>
        <div
          className="fd-padding-stage"
          data-specimen="spacing-composition"
          style={{ padding: px(padding) }}
        >
          <span className="fd-measure-label">{number(locale, padding)}px</span>
          <div
            className="fd-padding-content"
            style={{
              gap: px(gap),
              flexDirection: flow === "stacked" ? "column" : "row",
            }}
          >
            <div>
              {tr(locale, "Student record", "سجل الطالب", "Dossier étudiant")}
            </div>
            <div>
              {tr(
                locale,
                "Course registration",
                "تسجيل المقررات",
                "Inscription aux cours",
              )}
            </div>
            <div>
              {tr(locale, "Gap", "الفجوة", "Écart")}: {number(locale, gap)}px
            </div>
          </div>
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="spacing-density">
            {tr(
              locale,
              "Density changes space, not text",
              "الكثافة تغير المساحة وليس النص",
              "La densité modifie l’espace, pas le texte",
            )}
          </span>
        }
      >
        <div className="fd-density-comparison">
          {(["comfortable", "compact"] as const).map((mode) => (
            <article
              key={mode}
              className={`fd-density-card ${density === mode ? "fd-selected" : ""}`}
              style={{ padding: mode === "comfortable" ? "1.5rem" : "1rem" }}
            >
              <h4>
                {mode === "comfortable"
                  ? tr(locale, "Comfortable", "مريحة", "Confortable")
                  : tr(locale, "Compact", "مدمجة", "Compacte")}
              </h4>
              <p>
                {tr(
                  locale,
                  "Body text remains 16px.",
                  "يبقى النص الأساسي بحجم 16px.",
                  "Le texte courant reste à 16px.",
                )}
              </p>
              <label className="field-label">
                {tr(locale, "Student name", "اسم الطالب", "Nom de l’étudiant")}
                <input
                  className="input"
                  defaultValue="Émilie François"
                  style={{
                    minHeight: `${decisions.controls.minimumHeightPx[mode]}px`,
                    paddingBlock: mode === "comfortable" ? ".75rem" : ".5rem",
                  }}
                />
              </label>
              <p className="muted">
                {tr(
                  locale,
                  "Minimum control height",
                  "الحد الأدنى لارتفاع الحقل",
                  "Hauteur minimale du champ",
                )}
                : {number(locale, decisions.controls.minimumHeightPx[mode])}px
              </p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function GridDemo({ locale }: DemoProps) {
  const [width, setWidth] = useState(900);
  const [hostWidth, setHostWidth] = useState(900);
  const [overlay, setOverlay] = useState(true);
  const [wrap, setWrap] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver((entries) =>
      setHostWidth(entries[0].contentRect.width),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const layout =
    width < 768
      ? decisions.responsive.layouts.narrow
      : width < 1200
        ? decisions.responsive.layouts.medium
        : decisions.responsive.layouts.wide;
  const scale = Math.min(1, hostWidth / width);
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="grid-columns">
            {tr(
              locale,
              "Responsive grid",
              "الشبكة المتجاوبة",
              "Grille adaptative",
            )}
          </span>
        }
      >
        <div className="toolbar">
          {[390, 900, 1440].map((value) => (
            <Button
              variant={width === value ? "primary" : "secondary"}
              key={value}
              onClick={() => setWidth(value)}
            >
              {value === 390
                ? tr(locale, "Narrow", "ضيقة", "Étroite")
                : value === 900
                  ? tr(locale, "Medium", "متوسطة", "Moyenne")
                  : tr(locale, "Wide", "واسعة", "Large")}{" "}
              · {number(locale, value)}px
            </Button>
          ))}
          <label className="check-label">
            <input
              type="checkbox"
              checked={overlay}
              onChange={(event) => setOverlay(event.target.checked)}
            />
            {tr(locale, "Show columns", "عرض الأعمدة", "Afficher les colonnes")}
          </label>
        </div>
        <Field
          label={`${tr(locale, "Sample viewport width", "عرض نافذة المعاينة", "Largeur de l’aperçu")} ${number(locale, width)}px`}
        >
          <input
            type="range"
            min="320"
            max="1440"
            step="1"
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
          />
        </Field>
        <div className="fd-grid-statistics" role="status">
          <Badge>
            {number(locale, layout.columns)}{" "}
            {tr(locale, "columns", "أعمدة", "colonnes")}
          </Badge>
          <Badge>
            {number(locale, layout.outerPaddingPx)}px{" "}
            {tr(locale, "outer padding", "حشو خارجي", "marge extérieure")}
          </Badge>
          <Badge>
            {number(locale, layout.columnGapPx)}px{" "}
            {tr(locale, "gap", "فجوة", "écart")}
          </Badge>
        </div>
        <div
          ref={host}
          data-specimen="grid-viewports"
          className="fd-grid-host"
          style={{ height: `${340 * scale}px` }}
        >
          <div
            className="fd-grid-viewport"
            data-columns={layout.columns}
            style={
              {
                width,
                transform: `scale(${scale})`,
                transformOrigin: locale === "ar" ? "top right" : "top left",
                insetInlineStart: 0,
                paddingInline: px(layout.outerPaddingPx),
                "--fd-columns": layout.columns,
                "--fd-grid-gap": px(layout.columnGapPx),
              } as CSSProperties
            }
          >
            <div className="fd-grid-ruler">
              {number(locale, width)}px ·{" "}
              {tr(
                locale,
                "Sample viewport",
                "نافذة المعاينة",
                "Fenêtre d’aperçu",
              )}
            </div>
            <div className="fd-grid-content">
              {overlay && (
                <div className="fd-grid-overlay" aria-hidden="true">
                  {Array.from({ length: layout.columns }, (_, index) => (
                    <span key={index}>{index + 1}</span>
                  ))}
                </div>
              )}
              <div className="fd-grid-banner">
                <GraduationCap size={24} aria-hidden="true" />
                <strong>
                  {tr(
                    locale,
                    "Course registration",
                    "تسجيل المقررات",
                    "Inscription aux cours",
                  )}
                </strong>
              </div>
              <div className="fd-grid-main">
                <h4>
                  {tr(
                    locale,
                    "Student information",
                    "بيانات الطالب",
                    "Informations de l’étudiant",
                  )}
                </h4>
                <div className="fd-grid-dummy-field">
                  {tr(
                    locale,
                    "Student name",
                    "اسم الطالب",
                    "Nom de l’étudiant",
                  )}
                </div>
                <div className="fd-grid-dummy-field">
                  <bdi>CS101 · 2026</bdi>
                </div>
              </div>
              <div className="fd-grid-aside">
                <h4>
                  {tr(
                    locale,
                    "Registration summary",
                    "ملخص التسجيل",
                    "Résumé de l’inscription",
                  )}
                </h4>
                <p>
                  {number(locale, 18)}{" "}
                  {tr(
                    locale,
                    "credits selected",
                    "ساعة معتمدة مختارة",
                    "crédits sélectionnés",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="muted">
          {tr(
            locale,
            "This diagram scales to fit. Its width control changes the actual sample layout. Arabic follows right-to-left direction.",
            "يتغير حجم المخطط ليلائم المساحة. يغير عنصر العرض تخطيط المثال الفعلي. تتبع العربية الاتجاه من اليمين إلى اليسار.",
            "Ce schéma se réduit pour tenir dans l’espace. Le réglage de largeur modifie la disposition réelle. L’arabe suit le sens droite à gauche.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="grid-overflow">
            {tr(
              locale,
              "Wrapping and controlled overflow",
              "التفاف النص والتمرير الأفقي",
              "Retour à la ligne et défilement maîtrisé",
            )}
          </span>
        }
      >
        <label className="check-label">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(event) => setWrap(event.target.checked)}
          />
          {tr(
            locale,
            "Wrap long text",
            "التفاف النص الطويل",
            "Renvoyer les textes longs à la ligne",
          )}
        </label>
        <div
          className="fd-overflow-stage"
          style={{ whiteSpace: wrap ? "normal" : "nowrap" }}
        >
          <p>
            {tr(
              locale,
              "Faculty of Engineering and International Interdisciplinary Studies · CS101 · University registration review for the upcoming academic term",
              "كلية الهندسة والدراسات الدولية متعددة التخصصات · CS101 · مراجعة التسجيل الجامعي للفصل الدراسي القادم",
              "Faculté d’ingénierie et d’études interdisciplinaires internationales · CS101 · Examen des inscriptions pour le prochain semestre",
            )}
          </p>
        </div>
        <p className="muted">
          {tr(
            locale,
            "Wrapped content grows vertically. Unwrapped content scrolls inside its own region.",
            "يمتد النص الملتف رأسياً. يتحرك النص غير الملتف أفقياً داخل منطقته.",
            "Le texte renvoyé grandit verticalement. Le texte sans retour défile dans sa propre zone.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="grid-breakpoints">
            {tr(
              locale,
              "Breakpoint contract",
              "قواعد نقاط التوقف",
              "Règles des points de rupture",
            )}
          </span>
        }
      >
        <div className="fd-table-scroll" tabIndex={0}>
          <table className="sample-table">
            <thead>
              <tr>
                <th>{tr(locale, "Layout", "التخطيط", "Disposition")}</th>
                <th>
                  {tr(
                    locale,
                    "Minimum viewport",
                    "أدنى عرض",
                    "Largeur minimale",
                  )}
                </th>
                <th>{tr(locale, "Columns", "الأعمدة", "Colonnes")}</th>
                <th>{tr(locale, "Padding", "الحشو", "Marge intérieure")}</th>
                <th>{tr(locale, "Gap", "الفجوة", "Écart")}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(decisions.responsive.layouts).map(
                ([name, spec], index) => (
                  <tr key={name}>
                    <th scope="row">
                      {tr(
                        locale,
                        ...([
                          ["Narrow", "ضيقة", "Étroite"],
                          ["Medium", "متوسطة", "Moyenne"],
                          ["Wide", "واسعة", "Large"],
                        ][index] as [string, string, string]),
                      )}
                    </th>
                    <td>{number(locale, spec.minWidthPx)}px</td>
                    <td>{number(locale, spec.columns)}</td>
                    <td>{number(locale, spec.outerPaddingPx)}px</td>
                    <td>{number(locale, spec.columnGapPx)}px</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function BordersDemo({ locale, state, notify }: DemoProps) {
  const [invalid, setInvalid] = useState(
    state === "invalid" || state === "error",
  );
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState("CS101");
  const field = useRef<HTMLInputElement>(null);
  const errorId = useId();
  useEffect(() => {
    setInvalid(state === "invalid" || state === "error");
    setSelected(state === "selected");
  }, [state]);
  const corners: [string, string, string, number | "circle"][] = [
    ["Small elements", "عناصر صغيرة", "Petits éléments", 4],
    ["Controls", "عناصر التحكم", "Commandes", 8],
    ["Cards and panels", "البطاقات واللوحات", "Cartes et panneaux", 12],
    ["Dialogs", "الحوارات", "Dialogues", 16],
    ["Avatars", "الصور الشخصية", "Avatars", "circle"],
  ];
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="borders-corners">
            {tr(
              locale,
              "Approved corners",
              "الزوايا المعتمدة",
              "Angles approuvés",
            )}
          </span>
        }
      >
        <div className="fd-corner-grid">
          {corners.map(([en, ar, fr, radius]) => (
            <button
              type="button"
              className="fd-corner-specimen"
              key={en}
              onClick={() =>
                void copyText(
                  `border-radius: ${radius === "circle" ? "50%" : `${radius}px`};`,
                  notify,
                  locale,
                )
              }
            >
              <span
                style={{
                  borderRadius: radius === "circle" ? "50%" : `${radius}px`,
                }}
              >
                {radius === "circle" ? (
                  <User size={24} aria-hidden="true" />
                ) : (
                  <span>{number(locale, radius)}px</span>
                )}
              </span>
              <strong>{tr(locale, en, ar, fr)}</strong>
              <small>
                {tr(locale, "Copy radius", "نسخ نصف القطر", "Copier le rayon")}
              </small>
            </button>
          ))}
        </div>
        <div className="fd-nested-radii" data-specimen="borders-nested">
          <div>
            <strong>
              {tr(
                locale,
                "Coordinated nested corners",
                "زوايا داخلية منسقة",
                "Angles imbriqués coordonnés",
              )}
            </strong>
            <p>
              {tr(
                locale,
                "A 16px container, 4px padding, and a 12px inner panel align their curves.",
                "تتناسق منحنيات حاوية بزاوية 16px وحشو 4px ولوحة داخلية بزاوية 12px.",
                "Un conteneur de 16px, une marge de 4px et un panneau intérieur de 12px alignent leurs courbes.",
              )}
            </p>
          </div>
        </div>
      </Panel>
      <BorderPurposes locale={locale} />
      <Panel
        title={
          <span data-specimen="borders-states">
            {tr(
              locale,
              "Border, selection, and keyboard focus",
              "الحدود والتحديد وتركيز لوحة المفاتيح",
              "Bordure, sélection et focus clavier",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <label className="check-label">
            <input
              type="checkbox"
              checked={invalid}
              onChange={(event) => setInvalid(event.target.checked)}
            />
            {tr(locale, "Invalid state", "حالة غير صالحة", "État invalide")}
          </label>
          <Button variant="secondary" onClick={() => field.current?.focus()}>
            {tr(
              locale,
              "Focus the field",
              "تركيز الحقل",
              "Placer le focus dans le champ",
            )}
          </Button>
        </div>
        <label className="field-label">
          {tr(locale, "Course code", "رمز المقرر", "Code du cours")}
          <input
            ref={field}
            className="input fd-focus-field"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
          />
        </label>
        {invalid && (
          <p id={errorId} className="fd-invalid-message">
            <CircleAlert size={16} aria-hidden="true" />
            {tr(
              locale,
              "Review this course code. The icon and text explain the invalid state.",
              "راجع رمز المقرر. تشرح الأيقونة والنص الحالة غير الصالحة.",
              "Vérifiez ce code de cours. L’icône et le texte expliquent l’état invalide.",
            )}
          </p>
        )}
        <button
          type="button"
          className={`fd-selection-card ${selected ? "fd-selected" : ""}`}
          aria-pressed={selected}
          onClick={() => setSelected(!selected)}
        >
          {selected ? (
            <CircleCheck size={20} aria-hidden="true" />
          ) : (
            <BookOpen size={20} aria-hidden="true" />
          )}
          <span>
            <strong>
              <bdi>CS101</bdi> ·{" "}
              {tr(
                locale,
                "Introduction to computing",
                "مقدمة في الحوسبة",
                "Introduction à l’informatique",
              )}
            </strong>
            <span>
              {selected
                ? tr(locale, "Selected", "محدد", "Sélectionné")
                : tr(
                    locale,
                    "Select this sample",
                    "حدد هذا المثال",
                    "Sélectionner cet exemple",
                  )}
            </span>
          </span>
        </button>
        <div className="fd-border-facts">
          <code>
            1px {tr(locale, "standard border", "حد قياسي", "bordure standard")}
          </code>
          <code>
            2px {tr(locale, "focus ring", "حلقة التركيز", "anneau de focus")}
          </code>
          <code>
            2px {tr(locale, "focus gap", "فجوة التركيز", "écart de focus")}
          </code>
        </div>
      </Panel>
    </div>
  );
}

const iconEntries: [string, LucideIcon, string, string][] = [
  ["Search", Search, "بحث", "Rechercher"],
  ["Menu", Menu, "قائمة", "Menu"],
  ["House", House, "الرئيسية", "Accueil"],
  ["User", User, "مستخدم", "Utilisateur"],
  ["Users", Users, "مستخدمون", "Utilisateurs"],
  ["GraduationCap", GraduationCap, "التخرج", "Diplôme"],
  ["BookOpen", BookOpen, "مقرر", "Cours"],
  ["CalendarDays", CalendarDays, "تقويم", "Calendrier"],
  ["Clock", Clock, "وقت", "Heure"],
  ["FileText", FileText, "ملف", "Fichier"],
  ["Folder", Folder, "مجلد", "Dossier"],
  ["ClipboardList", ClipboardList, "قائمة مهام", "Liste"],
  ["ChartNoAxesCombined", ChartNoAxesCombined, "مخطط", "Graphique"],
  ["Bell", Bell, "إشعارات", "Notifications"],
  ["Mail", Mail, "بريد", "Courrier"],
  ["Settings", Settings, "إعدادات", "Paramètres"],
  ["Filter", Filter, "تصفية", "Filtrer"],
  ["LayoutGrid", LayoutGrid, "شبكة", "Grille"],
  ["Plus", Plus, "إضافة", "Ajouter"],
  ["Pencil", Pencil, "تعديل", "Modifier"],
  ["Save", Save, "حفظ", "Enregistrer"],
  ["Trash2", Trash2, "حذف", "Supprimer"],
  ["Download", Download, "تنزيل", "Télécharger"],
  ["Upload", Upload, "رفع", "Téléverser"],
  ["Copy", Copy, "نسخ", "Copier"],
  ["Eye", Eye, "عرض", "Voir"],
  ["Check", Check, "تأكيد", "Confirmer"],
  ["X", X, "إغلاق", "Fermer"],
  ["CircleCheck", CircleCheck, "نجاح", "Succès"],
  ["CircleAlert", CircleAlert, "خطأ", "Erreur"],
  ["TriangleAlert", TriangleAlert, "تحذير", "Avertissement"],
  ["Info", Info, "معلومات", "Information"],
  ["ShieldCheck", ShieldCheck, "صلاحيات", "Autorisations"],
  ["LockKeyhole", LockKeyhole, "قفل", "Verrouiller"],
  ["Globe", Globe, "لغة", "Langue"],
  ["Sun", Sun, "فاتح", "Clair"],
  ["Moon", Moon, "داكن", "Sombre"],
  ["ArrowLeft", ArrowLeft, "سهم يسار", "Flèche gauche"],
  ["ArrowRight", ArrowRight, "سهم يمين", "Flèche droite"],
  ["ArrowUp", ArrowUp, "سهم أعلى", "Flèche haut"],
  ["ArrowDown", ArrowDown, "سهم أسفل", "Flèche bas"],
  ["ChevronDown", ChevronDown, "توسيع", "Développer"],
  ["Ellipsis", Ellipsis, "المزيد", "Plus"],
  ["Link", Link, "رابط", "Lien"],
  ["Layers", Layers, "طبقات", "Calques"],
  ["Accessibility", Accessibility, "إمكانية الوصول", "Accessibilité"],
  ["Play", Play, "تشغيل", "Lire"],
  ["RefreshCw", RefreshCw, "تحديث", "Actualiser"],
  ["Heart", Heart, "مفضل", "Favori"],
];

function IconsDemo({ locale, notify, state }: DemoProps) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(20);
  const [selected, setSelected] = useState("GraduationCap");
  const [savedIcon, setSavedIcon] = useState("");
  const [inspectionDirection, setInspectionDirection] = useState("auto");
  const [step, setStep] = useState(1);
  useEffect(() => {
    setQuery(state === "no-results" ? "no-matching-icon-000" : "");
    setSelected(state === "selected" ? "ShieldCheck" : "GraduationCap");
  }, [state]);
  const direction =
    inspectionDirection === "auto"
      ? locale === "ar"
        ? "rtl"
        : "ltr"
      : inspectionDirection;
  const ForwardIcon = direction === "rtl" ? ArrowLeft : ArrowRight;
  const visible = iconEntries.filter(([name, , ar, fr]) =>
    `${name} ${ar} ${fr}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  const current = iconEntries.find(([name]) => name === selected)!;
  const SelectedIcon = current[1];
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="icons-library">
            {tr(
              locale,
              "Lucide outline library",
              "مكتبة Lucide الخطية",
              "Bibliothèque Lucide en contour",
            )}
          </span>
        }
      >
        <div className="fd-two-fields">
          <Field
            label={tr(
              locale,
              "Search icon names or meanings",
              "البحث بأسماء الأيقونات أو معانيها",
              "Rechercher un nom ou un sens",
            )}
          >
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tr(
                locale,
                "Search, calendar, user…",
                "بحث، تقويم، مستخدم…",
                "Rechercher, calendrier, utilisateur…",
              )}
            />
          </Field>
          <Field
            label={tr(
              locale,
              "Visible icon size",
              "حجم الأيقونة المرئي",
              "Taille visible de l’icône",
            )}
          >
            <select
              className="input"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            >
              {[16, 20, 24].map((value) => (
                <option value={value} key={value}>
                  {number(locale, value)}px
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="muted">
          {number(locale, visible.length)} /{" "}
          {number(locale, iconEntries.length)} ·{" "}
          {tr(
            locale,
            "Native 24px canvas, 2px stroke, round joins, and round caps. Shapes scale proportionally.",
            "لوحة أصلية بحجم 24px وسُمك 2px ووصلات ونهايات مستديرة. تتغير الأشكال بنسبة متساوية.",
            "Canevas natif de 24px, trait de 2px, jointures et extrémités arrondies. Les formes gardent leurs proportions.",
          )}
        </p>
        <div className="fd-icon-gallery" data-specimen="icons-search">
          {visible.map(([name, Icon, ar, fr]) => (
            <button
              type="button"
              key={name}
              className={`fd-icon-tile ${selected === name ? "fd-selected" : ""}`}
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
            >
              <Icon size={size} strokeWidth={2} aria-hidden="true" />
              <span>{tr(locale, name, ar, fr)}</span>
              <code>{name}</code>
            </button>
          ))}
        </div>
        {visible.length === 0 && (
          <Callout>
            {tr(
              locale,
              "No icon matches this search.",
              "لا توجد أيقونة مطابقة.",
              "Aucune icône correspondante.",
            )}
          </Callout>
        )}
      </Panel>
      <Panel
        title={
          <span data-specimen="icons-targets">
            {tr(
              locale,
              "Size and target inspection",
              "فحص الحجم ومنطقة التفاعل",
              "Inspection de la taille et de la cible",
            )}
          </span>
        }
      >
        <div className="fd-icon-inspection" data-specimen="icons-sizes">
          {[16, 20, 24].map((value) => (
            <div key={value}>
              <span className="fd-target-outline">
                <SelectedIcon size={value} strokeWidth={2} aria-hidden="true" />
              </span>
              <p>
                {number(locale, value)}px / {number(locale, 44)}px{" "}
                {tr(locale, "target", "منطقة التفاعل", "cible")}
              </p>
            </div>
          ))}
        </div>
        <div className="toolbar">
          <Button
            variant="secondary"
            onClick={() =>
              void copyText(
                `import { ${selected} } from 'lucide-react';\n<${selected} size={${size}} strokeWidth={2} aria-hidden="true" />`,
                notify,
                locale,
              )
            }
          >
            <Copy size={16} aria-hidden="true" />
            {tr(
              locale,
              "Copy selected icon",
              "نسخ الأيقونة المختارة",
              "Copier l’icône sélectionnée",
            )}
          </Button>
        </div>
        <h4 data-specimen="icons-names">
          {tr(
            locale,
            "Named icon-only controls",
            "عناصر أيقونات فقط بأسماء واضحة",
            "Commandes à icône seule nommées",
          )}
        </h4>
        <div className="toolbar">
          <Button
            variant="secondary"
            aria-label={tr(
              locale,
              "Save selected icon locally",
              "حفظ الأيقونة المختارة محلياً",
              "Enregistrer l’icône localement",
            )}
            title={tr(
              locale,
              "Save selected icon locally",
              "حفظ الأيقونة المختارة محلياً",
              "Enregistrer l’icône localement",
            )}
            onClick={() => {
              setSavedIcon(selected);
              notify(
                tr(
                  locale,
                  "Icon saved in this sample",
                  "تم حفظ الأيقونة في هذا المثال",
                  "Icône enregistrée dans cet exemple",
                ),
                "success",
              );
            }}
          >
            <Save size={size} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            aria-label={tr(
              locale,
              "Download icon settings",
              "تنزيل إعدادات الأيقونة",
              "Télécharger les paramètres de l’icône",
            )}
            title={tr(
              locale,
              "Download icon settings",
              "تنزيل إعدادات الأيقونة",
              "Télécharger les paramètres de l’icône",
            )}
            onClick={() => {
              download(
                "lucide-icon-sample.json",
                JSON.stringify(
                  {
                    family: "Lucide",
                    icon: selected,
                    sizePx: size,
                    strokeWidth: 2,
                    minimumTargetPx: 44,
                  },
                  null,
                  2,
                ),
              );
              notify(
                tr(
                  locale,
                  "Icon settings downloaded",
                  "تم تنزيل إعدادات الأيقونة",
                  "Paramètres de l’icône téléchargés",
                ),
                "success",
              );
            }}
          >
            <Download size={size} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            aria-label={tr(
              locale,
              "Reset icon sample",
              "إعادة ضبط مثال الأيقونات",
              "Réinitialiser l’exemple d’icônes",
            )}
            title={tr(
              locale,
              "Reset icon sample",
              "إعادة ضبط مثال الأيقونات",
              "Réinitialiser l’exemple d’icônes",
            )}
            onClick={() => {
              setQuery("");
              setSize(20);
              setSelected("GraduationCap");
              setSavedIcon("");
            }}
          >
            <RefreshCw size={size} aria-hidden="true" />
          </Button>
          {savedIcon && (
            <Badge tone="success">
              {tr(
                locale,
                "Saved locally",
                "محفوظ محلياً",
                "Enregistrée localement",
              )}
              : {savedIcon}
            </Badge>
          )}
        </div>
        <p className="muted">
          {tr(
            locale,
            "Each control has an accessible name and a minimum 44 × 44px target. Decorative icons stay hidden from assistive technology.",
            "لكل عنصر اسم وصول ومنطقة تفاعل لا تقل عن 44 × 44px. تبقى الأيقونات الزخرفية مخفية عن التقنيات المساعدة.",
            "Chaque commande possède un nom accessible et une cible minimale de 44 × 44px. Les icônes décoratives restent masquées aux aides techniques.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="icons-direction">
            {tr(
              locale,
              "Text alignment and direction",
              "محاذاة النص والاتجاه",
              "Alignement du texte et sens",
            )}
          </span>
        }
      >
        <Field
          label={tr(
            locale,
            "Sample direction",
            "اتجاه المثال",
            "Sens de l’exemple",
          )}
        >
          <select
            className="input"
            value={inspectionDirection}
            onChange={(event) => setInspectionDirection(event.target.value)}
          >
            <option value="auto">
              {tr(
                locale,
                "Follow interface language",
                "اتبع لغة الواجهة",
                "Suivre la langue de l’interface",
              )}
            </option>
            <option value="ltr">
              {tr(
                locale,
                "Left to right",
                "من اليسار إلى اليمين",
                "Gauche à droite",
              )}
            </option>
            <option value="rtl">
              {tr(
                locale,
                "Right to left",
                "من اليمين إلى اليسار",
                "Droite à gauche",
              )}
            </option>
          </select>
        </Field>
        <div className="toolbar fd-icon-alignment" dir={direction}>
          {[16, 20, 24].map((value) => (
            <Button
              variant="secondary"
              key={value}
              onClick={() => {
                setSelected("BookOpen");
                setSize(value);
              }}
            >
              <BookOpen size={value} aria-hidden="true" />
              {tr(locale, "Course", "المقرر", "Cours")} {number(locale, value)}
              px
            </Button>
          ))}
        </div>
        <div className="toolbar" dir={direction}>
          <Button variant="secondary" onClick={() => setStep(step + 1)}>
            {tr(locale, "Next sample", "المثال التالي", "Exemple suivant")}
            <ForwardIcon size={20} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => void copyText(selected, notify, locale)}
          >
            <Copy size={20} aria-hidden="true" />
            {tr(
              locale,
              "Copy icon name",
              "نسخ اسم الأيقونة",
              "Copier le nom de l’icône",
            )}
          </Button>
          <Badge>
            {tr(locale, "Sample", "مثال", "Exemple")} {number(locale, step)}
          </Badge>
        </div>
        <p className="muted">
          {tr(
            locale,
            "The forward arrow follows reading direction. Book, copy, and file symbols retain their native direction. Decorative icons accompany visible text.",
            "يتبع سهم التقدم اتجاه القراءة. تحتفظ رموز الكتاب والنسخ والملف باتجاهها الأصلي. ترافق الأيقونات الزخرفية نصاً مرئياً.",
            "La flèche de progression suit le sens de lecture. Les symboles de livre, copie et fichier gardent leur sens natif. Les icônes décoratives accompagnent un texte visible.",
          )}
        </p>
      </Panel>
    </div>
  );
}

function ElevationDemo({ locale, theme, notify, state }: DemoProps) {
  const [dropdown, setDropdown] = useState(false);
  const [modal, setModal] = useState(false);
  const [nested, setNested] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [inside, setInside] = useState(false);
  const [sticky, setSticky] = useState(true);
  const [choice, setChoice] = useState("");
  const [note, setNote] = useState("");
  const dropdownId = useId();
  const dropdownHost = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setDropdown(state === "expanded");
  }, [state]);
  useEffect(() => {
    if (!dropdown) return;
    const close = (event: PointerEvent) => {
      if (!dropdownHost.current?.contains(event.target as Node))
        setDropdown(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [dropdown]);
  const low = decisions.elevation.levels.low,
    high = decisions.elevation.levels.high;
  const closeDialog = () => {
    setModal(false);
    setInside(false);
    setNested(false);
  };
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="elevation-levels">
            {tr(
              locale,
              "Three elevation levels",
              "ثلاثة مستويات للارتفاع",
              "Trois niveaux d’élévation",
            )}
          </span>
        }
      >
        <div className="fd-elevation-levels">
          {(["flat", "low", "high"] as const).map((level, index) => (
            <div
              key={level}
              className="fd-elevation-card"
              style={{ boxShadow: `var(--sys-shadow-${level})` }}
            >
              <Layers size={24} aria-hidden="true" />
              <strong>
                {tr(
                  locale,
                  ...([
                    ["Flat", "مسطح", "Plat"],
                    ["Low", "منخفض", "Bas"],
                    ["High", "مرتفع", "Haut"],
                  ][index] as [string, string, string]),
                )}
              </strong>
              <code dir="ltr">
                {level === "flat"
                  ? "none"
                  : level === "low"
                    ? `0 4px 16px 0 / ${low.opacity[theme] * 100}%`
                    : `0 8px 24px 0 / ${high.opacity[theme] * 100}%`}
              </code>
              <p>
                {tr(
                  locale,
                  ...([
                    [
                      "Pages, fields, tables, ordinary cards",
                      "الصفحات والحقول والجداول والبطاقات العادية",
                      "Pages, champs, tableaux et cartes ordinaires",
                    ],
                    [
                      "Dropdowns, menus, popovers",
                      "القوائم المنسدلة والقوائم والنوافذ الصغيرة",
                      "Listes, menus et fenêtres contextuelles",
                    ],
                    [
                      "Dialogs and floating panels",
                      "الحوارات واللوحات العائمة",
                      "Dialogues et panneaux flottants",
                    ],
                  ][index] as [string, string, string]),
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="fd-table-scroll" tabIndex={0}>
          <table className="sample-table">
            <thead>
              <tr>
                <th>{tr(locale, "Level", "المستوى", "Niveau")}</th>
                <th>
                  {tr(
                    locale,
                    "Light opacity",
                    "عتامة السمة الفاتحة",
                    "Opacité claire",
                  )}
                </th>
                <th>
                  {tr(
                    locale,
                    "Dark opacity",
                    "عتامة السمة الداكنة",
                    "Opacité sombre",
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [tr(locale, "Low", "منخفض", "Bas"), low],
                [tr(locale, "High", "مرتفع", "Haut"), high],
              ].map(([label, level]) => {
                const opacity = (level as typeof low).opacity;
                return (
                  <tr key={String(label)}>
                    <th scope="row">{String(label)}</th>
                    <td>{number(locale, opacity.light * 100)}%</td>
                    <td>{number(locale, opacity.dark * 100)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">
          {tr(
            locale,
            "Neutral shadow color: #09090B. Dark mode uses raised surfaces and clear borders for the main separation.",
            "لون الظل المحايد: #09090B. يستخدم الوضع الداكن أسطحاً مرتفعة وحدوداً واضحة للفصل الأساسي.",
            "Couleur d’ombre neutre : #09090B. Le thème sombre sépare les couches par des surfaces surélevées et des bordures nettes.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="elevation-dropdown">
            {tr(
              locale,
              "Live layer interaction",
              "تفاعل الطبقات",
              "Interaction des couches",
            )}
          </span>
        }
      >
        <div className="fd-layer-stage">
          <div
            className="fd-dropdown-host"
            ref={dropdownHost}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setDropdown(false);
                trigger.current?.focus();
              }
            }}
          >
            <button
              type="button"
              ref={trigger}
              className="button button-secondary"
              aria-expanded={dropdown}
              aria-controls={dropdownId}
              onClick={() => setDropdown(!dropdown)}
            >
              <Ellipsis size={20} aria-hidden="true" />
              {tr(
                locale,
                "Sample actions",
                "إجراءات المثال",
                "Actions de l’exemple",
              )}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            {dropdown && (
              <div id={dropdownId} className="fd-live-dropdown">
                <p className="muted">
                  {tr(
                    locale,
                    "Low elevation",
                    "ارتفاع منخفض",
                    "Élévation basse",
                  )}
                </p>
                {[
                  tr(
                    locale,
                    "Inspect record",
                    "فحص السجل",
                    "Examiner le dossier",
                  ),
                  tr(
                    locale,
                    "Mark for review",
                    "وضع علامة للمراجعة",
                    "Marquer pour révision",
                  ),
                ].map((label) => (
                  <Button
                    variant="ghost"
                    key={label}
                    onClick={() => {
                      setChoice(label);
                      setDropdown(false);
                      trigger.current?.focus();
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDropdown(false);
                    setModal(true);
                  }}
                >
                  {tr(
                    locale,
                    "Open layered dialog",
                    "فتح حوار متعدد الطبقات",
                    "Ouvrir le dialogue avec couches",
                  )}
                </Button>
              </div>
            )}
          </div>
          <Button onClick={() => setModal(true)}>
            <span data-specimen="elevation-dialog">
              {tr(
                locale,
                "Open dialog and backdrop",
                "فتح الحوار والخلفية المعتمة",
                "Ouvrir le dialogue et son voile",
              )}
            </span>
          </Button>
          <Button variant="secondary" onClick={() => setDrawer(true)}>
            <span data-specimen="elevation-drawer">
              {tr(
                locale,
                "Open sample drawer",
                "فتح الدرج التجريبي",
                "Ouvrir le tiroir d’exemple",
              )}
            </span>
          </Button>
          <div className="result-box" role="status">
            {choice ||
              tr(
                locale,
                "Choose an action to update this sample.",
                "اختر إجراءً لتحديث هذا المثال.",
                "Choisissez une action pour modifier cet exemple.",
              )}
          </div>
        </div>
        <p data-specimen="elevation-backdrop" className="muted">
          {tr(
            locale,
            "The dialog backdrop separates active content from the page. Select outside the dialog or press Escape to dismiss it.",
            "تفصل خلفية الحوار المحتوى النشط عن الصفحة. اختر خارج الحوار أو اضغط Escape لإغلاقه.",
            "Le voile du dialogue sépare le contenu actif de la page. Sélectionnez l’extérieur ou appuyez sur Échap pour le fermer.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="elevation-sticky">
            {tr(
              locale,
              "Sticky surface in a scroll region",
              "سطح ثابت داخل منطقة تمرير",
              "Surface fixe dans une zone défilante",
            )}
          </span>
        }
      >
        <label className="check-label">
          <input
            type="checkbox"
            checked={sticky}
            onChange={(event) => setSticky(event.target.checked)}
          />
          {tr(
            locale,
            "Keep the header visible while scrolling",
            "إبقاء العنوان مرئياً أثناء التمرير",
            "Garder l’en-tête visible pendant le défilement",
          )}
        </label>
        <div
          className="fd-sticky-region"
          tabIndex={0}
          role="region"
          aria-label={tr(
            locale,
            "Scrollable sample records",
            "سجلات تجريبية قابلة للتمرير",
            "Dossiers d’exemple défilants",
          )}
        >
          <div className={`fd-sticky-header ${sticky ? "fd-is-sticky" : ""}`}>
            <BookOpen size={20} aria-hidden="true" />
            {tr(locale, "Course review", "مراجعة المقررات", "Examen des cours")}
          </div>
          {Array.from({ length: 8 }, (_, index) => (
            <div className="fd-sticky-row" key={index}>
              <bdi>CS{101 + index}</bdi>
              <span>
                {tr(
                  locale,
                  "Sample course record",
                  "سجل مقرر تجريبي",
                  "Dossier de cours d’exemple",
                )}{" "}
                {number(locale, index + 1)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <ModalExample
        open={modal}
        onClose={closeDialog}
        locale={locale}
        title={tr(
          locale,
          "High elevation dialog",
          "حوار بارتفاع مرتفع",
          "Dialogue à élévation haute",
        )}
      >
        <div className="demo-stack">
          <Callout>
            {tr(
              locale,
              "This dialog traps focus. Escape closes it and returns focus to the trigger.",
              "يحصر هذا الحوار التركيز داخله. يغلقه Escape ويعيد التركيز إلى الزر.",
              "Ce dialogue retient le focus. Échap le ferme et rend le focus au déclencheur.",
            )}
          </Callout>
          <Field
            label={tr(
              locale,
              "Review note",
              "ملاحظة المراجعة",
              "Note de révision",
            )}
          >
            <input
              className="input"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <Button
            variant="secondary"
            aria-expanded={inside}
            onClick={() => setInside(!inside)}
          >
            {tr(
              locale,
              "Show a low layer inside the dialog",
              "عرض طبقة منخفضة داخل الحوار",
              "Afficher une couche basse dans le dialogue",
            )}
          </Button>
          {inside && (
            <div className="fd-live-dropdown fd-inline-popover">
              <Info size={20} aria-hidden="true" />
              <p>
                {tr(
                  locale,
                  "A raised surface and border separate this popover from its dialog.",
                  "يفصل سطح مرتفع وحدّ هذه النافذة الصغيرة عن الحوار.",
                  "Une surface surélevée et une bordure séparent cette fenêtre du dialogue.",
                )}
              </p>
              <Button variant="ghost" onClick={() => setInside(false)}>
                {tr(
                  locale,
                  "Dismiss this layer",
                  "إغلاق هذه الطبقة",
                  "Fermer cette couche",
                )}
              </Button>
            </div>
          )}
          <Button variant="secondary" onClick={() => setNested(true)}>
            {tr(
              locale,
              "Inspect a second dialog layer",
              "فحص طبقة حوار ثانية",
              "Examiner une seconde couche de dialogue",
            )}
          </Button>
          <Button
            onClick={() => {
              const message =
                note ||
                tr(
                  locale,
                  "Sample reviewed",
                  "تمت مراجعة المثال",
                  "Exemple examiné",
                );
              setChoice(message);
              notify(message, "success");
              closeDialog();
            }}
          >
            {tr(
              locale,
              "Save sample note",
              "حفظ ملاحظة المثال",
              "Enregistrer la note",
            )}
          </Button>
        </div>
        <ModalExample
          open={nested}
          onClose={() => setNested(false)}
          locale={locale}
          title={tr(
            locale,
            "Second dialog layer",
            "طبقة الحوار الثانية",
            "Seconde couche de dialogue",
          )}
        >
          <p>
            {tr(
              locale,
              "Focus belongs to this top dialog. Close it to return to the first dialog.",
              "ينتمي التركيز لهذا الحوار العلوي. أغلقه للعودة إلى الحوار الأول.",
              "Le focus appartient au dialogue supérieur. Fermez-le pour revenir au premier dialogue.",
            )}
          </p>
          <Button onClick={() => setNested(false)}>
            {tr(
              locale,
              "Return to the first dialog",
              "العودة إلى الحوار الأول",
              "Revenir au premier dialogue",
            )}
          </Button>
        </ModalExample>
      </ModalExample>
      <ModalExample
        open={drawer}
        drawer
        onClose={() => setDrawer(false)}
        locale={locale}
        title={tr(
          locale,
          "Sample review drawer",
          "درج المراجعة التجريبي",
          "Tiroir de révision d’exemple",
        )}
      >
        <div className="demo-stack">
          <p>
            {tr(
              locale,
              "A side surface preserves the review context. Its placement follows the interface direction.",
              "يحافظ السطح الجانبي على سياق المراجعة. يتبع موضعه اتجاه الواجهة.",
              "Une surface latérale conserve le contexte. Son emplacement suit le sens de l’interface.",
            )}
          </p>
          <Field
            label={tr(
              locale,
              "Review note",
              "ملاحظة المراجعة",
              "Note de révision",
            )}
          >
            <textarea
              className="input"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </Field>
          <Button
            onClick={() => {
              setChoice(
                note ||
                  tr(
                    locale,
                    "Drawer sample reviewed",
                    "تمت مراجعة مثال الدرج",
                    "Exemple de tiroir examiné",
                  ),
              );
              setDrawer(false);
            }}
          >
            {tr(
              locale,
              "Apply sample note",
              "تطبيق ملاحظة المثال",
              "Appliquer la note",
            )}
          </Button>
        </div>
      </ModalExample>
    </div>
  );
}

function MotionDemo({ locale, state, theme }: DemoProps) {
  const [manualReduce, setManualReduce] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const [replay, setReplay] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [sampleTheme, setSampleTheme] = useState(theme);
  useEffect(() => {
    setSaved(state === "success");
    setPending(state === "pending");
  }, [state]);
  useEffect(() => setSampleTheme(theme), [theme]);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSystemReduce(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);
  const reduced = manualReduce || systemReduce;
  return (
    <div
      className={`demo-stack fd-foundation ${reduced ? "fd-reduce-motion" : ""}`}
    >
      <Panel
        title={
          <span data-specimen="motion-timing">
            {tr(
              locale,
              "Approved timing",
              "الأزمنة المعتمدة",
              "Durées approuvées",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <Button onClick={() => setReplay(replay + 1)}>
            <Play size={16} aria-hidden="true" />
            {tr(
              locale,
              "Replay all samples",
              "إعادة تشغيل كل الأمثلة",
              "Rejouer tous les exemples",
            )}
          </Button>
          <label className="check-label">
            <input
              type="checkbox"
              checked={manualReduce}
              onChange={(event) => setManualReduce(event.target.checked)}
            />
            {tr(
              locale,
              "Reduce motion",
              "تقليل الحركة",
              "Réduire les animations",
            )}
          </label>
          <Badge tone={reduced ? "info" : "neutral"}>
            {reduced
              ? tr(
                  locale,
                  "Non-essential motion removed",
                  "أُزيلت الحركة غير الضرورية",
                  "Animations non essentielles supprimées",
                )
              : tr(
                  locale,
                  "Motion enabled",
                  "الحركة مفعلة",
                  "Animations actives",
                )}
          </Badge>
        </div>
        <p role="status" className="muted">
          {systemReduce
            ? tr(
                locale,
                "The operating system requests reduced motion.",
                "يطلب نظام التشغيل تقليل الحركة.",
                "Le système demande une réduction des animations.",
              )
            : tr(
                locale,
                "The operating system allows motion.",
                "يسمح نظام التشغيل بالحركة.",
                "Le système autorise les animations.",
              )}{" "}
          · {tr(locale, "Replay", "إعادة التشغيل", "Relecture")}{" "}
          {number(locale, replay)}
        </p>
        <div className="fd-motion-grid">
          {Object.entries(decisions.motion.durationMs).map(
            ([name, duration], index) => (
              <article className="fd-motion-card" key={name}>
                <strong>{number(locale, duration)}ms</strong>
                <h4>
                  {tr(
                    locale,
                    ...([
                      [
                        "Hover and pressed",
                        "المرور والضغط",
                        "Survol et pression",
                      ],
                      [
                        "Menus and small expansion",
                        "القوائم والتوسع الصغير",
                        "Menus et petits développements",
                      ],
                      [
                        "Dialogs and panels",
                        "الحوارات واللوحات",
                        "Dialogues et panneaux",
                      ],
                    ][index] as [string, string, string]),
                  )}
                </h4>
                <div className="fd-motion-track">
                  <span
                    key={`${name}-${replay}-${reduced}`}
                    className="fd-motion-dot"
                    style={{ animationDuration: `${reduced ? 0 : duration}ms` }}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="fd-hover-demo"
                  style={{ transitionDuration: `${reduced ? 0 : duration}ms` }}
                  onClick={() => setReplay(replay + 1)}
                >
                  {tr(
                    locale,
                    "Replay sample",
                    "إعادة تشغيل المثال",
                    "Rejouer l’exemple",
                  )}
                </Button>
              </article>
            ),
          )}
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="motion-entry-exit">
            {tr(locale, "Entry and exit", "الدخول والخروج", "Entrée et sortie")}
          </span>
        }
      >
        <div className="toolbar">
          <Button
            variant="secondary"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? tr(
                  locale,
                  "Collapse details",
                  "طي التفاصيل",
                  "Réduire les détails",
                )
              : tr(
                  locale,
                  "Expand details",
                  "توسيع التفاصيل",
                  "Développer les détails",
                )}
            <ChevronDown size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen(!panelOpen)}
          >
            {panelOpen
              ? tr(
                  locale,
                  "Close the 240ms panel",
                  "إغلاق لوحة 240ms",
                  "Fermer le panneau de 240ms",
                )
              : tr(
                  locale,
                  "Open the 240ms panel",
                  "فتح لوحة 240ms",
                  "Ouvrir le panneau de 240ms",
                )}
          </Button>
        </div>
        <div
          className="fd-motion-presence"
          data-open={expanded}
          aria-hidden={!expanded}
          style={
            {
              "--fd-presence-duration": reduced ? "0ms" : "180ms",
            } as CSSProperties
          }
        >
          <div>
            <div className="fd-motion-presence-body">
              <p>
                {tr(
                  locale,
                  "This small section enters and exits in 180ms.",
                  "يدخل هذا القسم الصغير ويخرج خلال 180ms.",
                  "Cette petite section entre et sort en 180ms.",
                )}
              </p>
            </div>
          </div>
        </div>
        <div
          className="fd-motion-presence"
          data-open={panelOpen}
          aria-hidden={!panelOpen}
          style={
            {
              "--fd-presence-duration": reduced ? "0ms" : "240ms",
            } as CSSProperties
          }
        >
          <div>
            <div className="fd-motion-presence-body">
              <h4>
                {tr(
                  locale,
                  "Panel content",
                  "محتوى اللوحة",
                  "Contenu du panneau",
                )}
              </h4>
              <p>
                {tr(
                  locale,
                  "The content enters and exits in 240ms. The button responds immediately.",
                  "يدخل المحتوى ويخرج خلال 240ms. يستجيب الزر فوراً.",
                  "Le contenu entre et sort en 240ms. Le bouton répond immédiatement.",
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="fd-reduced-comparison" data-specimen="motion-reduced">
          {[false, true].map((reduce) => (
            <div key={String(reduce)}>
              <h4>
                {reduce
                  ? tr(
                      locale,
                      "Reduced movement",
                      "حركة مخفضة",
                      "Mouvement réduit",
                    )
                  : tr(
                      locale,
                      "Standard movement",
                      "حركة قياسية",
                      "Mouvement standard",
                    )}
              </h4>
              <div className="fd-motion-track">
                <span
                  key={`${replay}-${reduced}`}
                  className="fd-motion-dot"
                  style={{
                    animationDuration: `${reduce || reduced ? 0 : 240}ms`,
                  }}
                />
              </div>
              <p className="muted">
                {reduce
                  ? tr(
                      locale,
                      "The final state appears immediately.",
                      "تظهر الحالة النهائية فوراً.",
                      "L’état final apparaît immédiatement.",
                    )
                  : tr(
                      locale,
                      "System and local reduced-motion choices take precedence.",
                      "تحظى إعدادات تقليل الحركة المحلية وإعدادات النظام بالأولوية.",
                      "Les réglages de mouvement réduit du système et de l’exemple sont prioritaires.",
                    )}
              </p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="motion-feedback">
            {tr(
              locale,
              "Immediate feedback",
              "الاستجابة الفورية",
              "Retour immédiat",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <Button
            onClick={() => {
              setSaved(!saved);
              setPending(false);
            }}
          >
            <Save size={16} aria-hidden="true" />
            {saved
              ? tr(
                  locale,
                  "Reset result",
                  "إعادة ضبط النتيجة",
                  "Réinitialiser le résultat",
                )
              : tr(
                  locale,
                  "Confirm sample",
                  "تأكيد المثال",
                  "Confirmer l’exemple",
                )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPending(!pending);
              setSaved(false);
            }}
          >
            {pending
              ? tr(
                  locale,
                  "Clear pending feedback",
                  "مسح استجابة الانتظار",
                  "Effacer le retour d’attente",
                )
              : tr(
                  locale,
                  "Show pending feedback",
                  "عرض استجابة الانتظار",
                  "Afficher le retour d’attente",
                )}
          </Button>
        </div>
        <div className="result-box" role="status">
          {saved ? (
            <>
              <CircleCheck size={20} aria-hidden="true" />
              {tr(
                locale,
                "The result is confirmed immediately.",
                "تتأكد النتيجة فوراً.",
                "Le résultat est confirmé immédiatement.",
              )}
            </>
          ) : pending ? (
            <>
              <Clock size={20} aria-hidden="true" />
              {tr(
                locale,
                "Pending feedback appears immediately.",
                "تظهر استجابة الانتظار فوراً.",
                "Le retour d’attente apparaît immédiatement.",
              )}
            </>
          ) : (
            tr(
              locale,
              "Confirm the sample to see immediate feedback.",
              "أكد المثال لعرض الاستجابة الفورية.",
              "Confirmez l’exemple pour voir le retour immédiat.",
            )
          )}
        </div>
        <div
          data-specimen="motion-theme"
          className="fd-immediate-theme"
          style={{
            background: color(sampleTheme, "bg-surface"),
            color: color(sampleTheme, "text-primary"),
            borderColor: color(sampleTheme, "border-default"),
          }}
        >
          <strong>
            {sampleTheme === "light"
              ? tr(locale, "Light sample", "مثال فاتح", "Exemple clair")
              : tr(locale, "Dark sample", "مثال داكن", "Exemple sombre")}
          </strong>
          <p>
            {tr(
              locale,
              "Theme values update with no transition.",
              "تتغير قيم السمة دون انتقال.",
              "Les valeurs du thème changent sans transition.",
            )}
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              setSampleTheme(sampleTheme === "light" ? "dark" : "light")
            }
          >
            {tr(
              locale,
              "Switch sample theme immediately",
              "تبديل سمة المثال فوراً",
              "Changer le thème immédiatement",
            )}
          </Button>
        </div>
        <Callout>
          {tr(
            locale,
            "Focus has no delay. Easing curves remain subject to visual review.",
            "لا يتأخر التركيز. تظل منحنيات الحركة خاضعة للمراجعة البصرية.",
            "Le focus ne subit aucun délai. Les courbes d’animation restent soumises à l’examen visuel.",
          )}
        </Callout>
      </Panel>
    </div>
  );
}

function AccessibilityDemo({
  locale,
  density,
  state,
  notify,
  variant,
}: DemoProps) {
  const [long, setLong] = useState(variant === "long-content");
  useEffect(() => setLong(variant === "long-content"), [variant]);
  const [zoom, setZoom] = useState(100);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("CS101");
  const [checked, setChecked] = useState(false);
  const [invalid, setInvalid] = useState(
    state === "invalid" || state === "error",
  );
  const [status, setStatus] = useState("");
  const [announcements, setAnnouncements] = useState(0);
  const field = useRef<HTMLInputElement>(null);
  const formId = useId();
  const errorId = useId();
  useEffect(
    () => setInvalid(state === "invalid" || state === "error"),
    [state],
  );
  const submit = () => {
    if (!name.trim()) {
      setInvalid(true);
      field.current?.focus();
      setStatus(
        tr(
          locale,
          "Enter a student name before confirmation.",
          "أدخل اسم الطالب قبل التأكيد.",
          "Saisissez un nom avant confirmation.",
        ),
      );
      return;
    }
    setInvalid(false);
    const message = tr(
      locale,
      `Sample confirmed for ${name}.`,
      `تم تأكيد المثال للطالب ${name}.`,
      `Exemple confirmé pour ${name}.`,
    );
    setStatus(message);
    notify(message, "success");
  };
  return (
    <div className="demo-stack fd-foundation">
      <Panel
        title={
          <span data-specimen="accessibility-keyboard">
            {tr(
              locale,
              "Keyboard and target inspection",
              "فحص لوحة المفاتيح ومنطقة التفاعل",
              "Inspection du clavier et des cibles",
            )}
          </span>
        }
      >
        <a
          className="fd-visible-skip"
          href={`#${formId}`}
          onClick={() => field.current?.focus()}
        >
          {tr(
            locale,
            "Skip to the sample form",
            "الانتقال إلى نموذج المثال",
            "Aller au formulaire d’exemple",
          )}
        </a>
        <p>
          {tr(
            locale,
            "Use Tab and Shift+Tab to inspect focus. Use Space for checkboxes and Enter for buttons.",
            "استخدم Tab وShift+Tab لفحص التركيز. استخدم المسافة لمربعات الاختيار وEnter للأزرار.",
            "Utilisez Tab et Maj+Tab pour examiner le focus. Utilisez Espace pour les cases et Entrée pour les boutons.",
          )}
        </p>
        <div
          className="fd-target-demonstration"
          data-specimen="accessibility-targets"
        >
          {[16, 20, 24].map((size) => (
            <div key={size}>
              <span className="fd-target-outline">
                <Button
                  variant="ghost"
                  aria-label={`${tr(locale, "Inspect target", "فحص منطقة التفاعل", "Examiner la cible")} ${size}px`}
                  onClick={() =>
                    notify(
                      tr(
                        locale,
                        `${size}px icon inside a 44px target`,
                        `أيقونة ${size}px داخل منطقة 44px`,
                        `Icône de ${size}px dans une cible de 44px`,
                      ),
                    )
                  }
                >
                  <Plus size={size} aria-hidden="true" />
                </Button>
              </span>
              <code>{size}px → 44 × 44px</code>
            </div>
          ))}
        </div>
        <p className="muted">
          {tr(
            locale,
            "Targets never overlap. Comfortable controls start at 48px. Compact controls start at 44px.",
            "لا تتداخل مناطق التفاعل. تبدأ العناصر المريحة من 48px والمدمجة من 44px.",
            "Les cibles ne se chevauchent pas. Les commandes confortables commencent à 48px et les compactes à 44px.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="accessibility-expansion">
            {tr(
              locale,
              "Long labels and text expansion",
              "التسميات الطويلة وتكبير النص",
              "Libellés longs et agrandissement du texte",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <label className="check-label">
            <input
              type="checkbox"
              checked={long}
              onChange={(event) => setLong(event.target.checked)}
            />
            {tr(
              locale,
              "Use long labels",
              "استخدام تسميات طويلة",
              "Utiliser des libellés longs",
            )}
          </label>
          <label className="field-label">
            {tr(
              locale,
              "Sample text scale",
              "مقياس نص المثال",
              "Échelle du texte de l’exemple",
            )}
            <select
              className="input"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            >
              {[100, 150, 200].map((value) => (
                <option key={value} value={value}>
                  {number(locale, value)}%
                </option>
              ))}
            </select>
          </label>
        </div>
        <form
          id={formId}
          className="fd-accessible-form"
          style={{ fontSize: `${zoom / 100}rem` }}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="field-label">
            {long
              ? tr(
                  locale,
                  "Full student name exactly as it appears on the university admission record",
                  "اسم الطالب الكامل كما يظهر بالضبط في سجل القبول بالجامعة",
                  "Nom complet de l’étudiant tel qu’il figure exactement dans le dossier d’admission universitaire",
                )
              : tr(locale, "Student name", "اسم الطالب", "Nom de l’étudiant")}
            <input
              ref={field}
              className="input fd-focus-field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={invalid}
              aria-describedby={invalid ? errorId : undefined}
              autoComplete="off"
            />
          </label>
          {invalid && (
            <p className="fd-invalid-message" id={errorId}>
              <CircleAlert size={20} aria-hidden="true" />
              {tr(
                locale,
                "Enter a student name.",
                "أدخل اسم الطالب.",
                "Saisissez un nom d’étudiant.",
              )}
            </p>
          )}
          <label className="field-label">
            {long
              ? tr(
                  locale,
                  "Course and section for the upcoming academic term",
                  "المقرر والشعبة للفصل الدراسي القادم",
                  "Cours et groupe pour le prochain semestre universitaire",
                )
              : tr(locale, "Course", "المقرر", "Cours")}
            <select
              className="input"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option value="CS101">
                CS101 · {tr(locale, "Computing", "الحوسبة", "Informatique")}
              </option>
              <option value="MATH201">
                MATH201 ·{" "}
                {tr(locale, "Mathematics", "الرياضيات", "Mathématiques")}
              </option>
            </select>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
            />
            {long
              ? tr(
                  locale,
                  "I reviewed the sample student details and understand that this workbench uses demonstration data.",
                  "راجعت بيانات الطالب في المثال وأفهم أن هذه المنصة تستخدم بيانات توضيحية.",
                  "J’ai examiné les données de l’étudiant et je comprends que cet atelier utilise des données de démonstration.",
                )
              : tr(
                  locale,
                  "Details reviewed",
                  "تمت مراجعة البيانات",
                  "Informations examinées",
                )}
          </label>
          <button className="button button-primary" type="submit">
            {long
              ? tr(
                  locale,
                  "Confirm the sample student information and course selection",
                  "تأكيد بيانات الطالب واختيار المقرر في المثال",
                  "Confirmer les informations de l’étudiant et le cours sélectionné",
                )
              : tr(
                  locale,
                  "Confirm sample",
                  "تأكيد المثال",
                  "Confirmer l’exemple",
                )}
          </button>
        </form>
        <div className="result-box" role="status">
          {status ||
            tr(
              locale,
              "Form results appear here.",
              "تظهر نتائج النموذج هنا.",
              "Les résultats du formulaire apparaissent ici.",
            )}
        </div>
        <p className="muted">
          {tr(
            locale,
            "Current minimum height",
            "الحد الأدنى الحالي للارتفاع",
            "Hauteur minimale actuelle",
          )}
          : {number(locale, decisions.controls.minimumHeightPx[density])}px
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="accessibility-language">
            {tr(
              locale,
              "Language, digits, and mixed direction",
              "اللغة والأرقام والاتجاه المختلط",
              "Langue, chiffres et sens mixtes",
            )}
          </span>
        }
      >
        <div className="fd-language-samples">
          <p lang="ar" dir="rtl">
            الطالب <bdi lang="en">Émilie François</bdi> · المقرر{" "}
            <bdi lang="en">CS101</bdi> · المعدل{" "}
            <bdi>{number("ar", 3.75, { minimumFractionDigits: 2 })}</bdi>
          </p>
          <p lang="en" dir="ltr">
            Student{" "}
            <bdi lang="ar" dir="rtl">
              أحمد حسن
            </bdi>{" "}
            · ID <bdi>U-2026-0042</bdi>
          </p>

          <p dir="ltr">
            <bdi>0123456789</bdi> · <bdi>CS101</bdi> · <bdi>U-2026-0042</bdi>
          </p>
        </div>
        <p>
          {tr(
            locale,
            "Quantities use international digits and locale separators. Identifiers retain their original characters. Each language sample declares its language and direction.",
            "تستخدم الكميات الأرقام الدولية وفواصل اللغة. تحتفظ المعرفات بأحرفها الأصلية. يحدد كل مثال لغته واتجاهه.",
            "Les quantités utilisent les chiffres internationaux et les séparateurs locaux. Les identifiants gardent leurs caractères. Chaque exemple déclare sa langue et son sens.",
          )}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            const count = announcements + 1;
            setAnnouncements(count);
            setStatus(
              tr(
                locale,
                `Sample announcement ${number(locale, count)}: review complete.`,
                `إعلان المثال ${number(locale, count)}: اكتملت المراجعة.`,
                `Annonce ${number(locale, count)} : examen terminé.`,
              ),
            );
          }}
        >
          <Bell size={20} aria-hidden="true" />
          <span data-specimen="accessibility-announcements">
            {tr(
              locale,
              "Announce sample result",
              "إعلان نتيجة المثال",
              "Annoncer le résultat",
            )}
          </span>
        </Button>
        <Callout>
          {tr(
            locale,
            "These specimens support manual review. They do not certify complete accessibility.",
            "تدعم هذه الأمثلة المراجعة اليدوية. ولا تؤكد اكتمال إمكانية الوصول.",
            "Ces exemples aident l’examen manuel. Ils ne certifient pas une accessibilité complète.",
          )}
        </Callout>
      </Panel>
    </div>
  );
}

export const foundationRenderers: Record<string, DemoRenderer> = {
  colors: (props) => <Colors {...props} />,
  typography: (props) => <TypographyDemo {...props} />,
  spacing: (props) => <><SpacingDemo {...props}/><UsageGuides {...props} kind="spacing"/></>,
  grid: (props) => <GridDemo {...props} />,
  borders: (props) => <><BordersDemo {...props}/><UsageGuides {...props} kind="radius"/></>,
  icons: (props) => <><IconsDemo {...props}/><UsageGuides {...props} kind="icons"/></>,
  elevation: (props) => <ElevationDemo {...props} />,
  motion: (props) => <><MotionDemo {...props}/><MotionWorkbench {...props}/></>,
  accessibility: (props) => <AccessibilityDemo {...props} />,
};
