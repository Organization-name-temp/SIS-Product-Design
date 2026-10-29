import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  Activity,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Contact,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileUp,
  Globe,
  GraduationCap,
  Grid2X2,
  Hash,
  Layers,
  Link2,
  ListChecks,
  ListOrdered,
  ListTree,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  MousePointer2,
  Network,
  Palette,
  PanelLeft,
  PanelTop,
  PanelsTopLeft,
  Play,
  RotateCcw,
  Search,
  Shapes,
  ShieldCheck,
  Space,
  Square,
  Sun,
  Table2,
  Tag,
  TextCursorInput,
  Type,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
const Icons = {
  Accessibility,
  Activity,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Contact,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileUp,
  Globe,
  GraduationCap,
  Grid2X2,
  Hash,
  Layers,
  Link2,
  ListChecks,
  ListOrdered,
  ListTree,
  Maximize2,
  Menu,
  MessageCircle,
  MessagesSquare,
  MousePointer2,
  Network,
  Palette,
  PanelLeft,
  PanelTop,
  PanelsTopLeft,
  Play,
  RotateCcw,
  Search,
  Shapes,
  ShieldCheck,
  Space,
  Square,
  Sun,
  Table2,
  Tag,
  TextCursorInput,
  Type,
  Users,
  Wallet,
  X,
};
import {
  I18nProvider,
  ModalOverlay,
  Modal,
  Dialog,
} from "react-aria-components";
import {
  catalog,
  groups,
  label,
  tabs,
  type CatalogEntry,
  type ContentTab,
} from "./catalog";
import { foundationRenderers } from "./demos/foundations";
import { componentRenderers } from "./demos/components";
import { patternRenderers } from "./demos/patterns";
import {
  Badge,
  Button,
  Callout,
  copyText,
  number,
  tr,
  type DemoProps,
  type Locale,
  type Tone,
} from "./shared";
import palette from "./data/palette.json";
import typography from "./data/typography.json";
import decisions from "./data/decisions.json";
import { ReviewPage } from "./ReviewPage";
import { TokenView } from "./TokenView";
import { presentationName } from "./presentation";
import "./styles.css";

type Config = {
  item: string;
  tab: ContentTab;
  theme: "light" | "dark" | "system";
  font: "ibm";
  locale: Locale;
  density: "comfortable" | "compact";
  width: string;
  state: string;
  variant: string;
  compare: string;
  reset: number;
  specimen: string;
};
const renderers = {
  ...foundationRenderers,
  ...componentRenderers,
  ...patternRenderers,
};
const initialQuery = new URLSearchParams(location.search);
const isEmbed = initialQuery.get("embed") === "1";
function initialConfig(): Config {
  const q = initialQuery;
  const current = catalog.find((x) => x.id === q.get("item")) || catalog[0];
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("sis.theme") || "light";
  } catch {}
  return {
    item: catalog.some((x) => x.id === q.get("item"))
      ? q.get("item")!
      : "colors",
    tab: tabs.includes(q.get("tab") as ContentTab)
      ? (q.get("tab") as ContentTab)
      : "playground",
    theme: ["light", "dark", "system"].includes(q.get("theme") || savedTheme)
      ? ((q.get("theme") || savedTheme) as Config["theme"])
      : "light",
    font: 'ibm',
    locale: q.get('lang')==='ar'?'ar':'en',
    density: q.has('density')?(q.get('density')==='compact'?'compact':'comfortable'):current.recommendedDensity==='compact'?'compact':'comfortable',
    width: ["auto", "360", "834", "1440"].includes(q.get("width") || "")
      ? q.get("width")!
      : "auto",
    state: current.states.includes(q.get("state") || "")
      ? q.get("state")!
      : "default",
    variant: current.variants.includes(q.get("variant") || "")
      ? q.get("variant")!
      : "default",
    compare: ["none", "themes", "density"].includes(
      q.get("compare") || "",
    )
      ? q.get("compare")!
      : "none",
    reset: 0,
    specimen: q.get("specimen") || "",
  };
}
const groupNames = {
  Foundations: ["Foundations", "الأسس", "Fondations"],
  Components: ["Components", "المكونات", "Composants"],
  Patterns: ["Composite patterns", "الأنماط المركبة", "Motifs composés"],
  Review: ["Review and exports", "المراجعة والتصدير", "Révision et exports"],
};
const tabNames: Record<string, string[]> = {
  playground: ["Playground", "التجربة", "Démonstration"],
  variants: ["Variants", "الأشكال", "Variantes"],
  states: ["States", "الحالات", "États"],
  tokens: ["Tokens", "الرموز", "Jetons"],
  usage: ["Usage", "الاستخدام", "Utilisation"],
  accessibility: ["Accessibility", "الإتاحة", "Accessibilité"],
};
function resolveColor(ref: string) {
  const [a, b] = ref.split(".");
  return (
    (palette.primitives as Record<string, Record<string, string>>)[a]?.[b] ??
    ref
  );
}
function configUrl(config: Config, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({
    item: config.item,
    tab: config.tab,
    theme: config.theme,
    font: config.font,
    lang: config.locale,
    density: config.density,
    width: config.width,
    state: config.state,
    variant: config.variant,
    compare: config.compare,
    specimen: config.specimen,
    ...extra,
  });
  return `${location.pathname}?${q}`;
}
function PreviewFrame({
  config,
  title,
  notify,
}: {
  config: Config;
  title: string;
  notify: DemoProps["notify"];
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(580);
  const initial = useRef(config);
  useEffect(() => {
    ref.current?.contentWindow?.postMessage(
      { type: "sis-presentation", config },
      location.origin,
    );
  }, [config]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== ref.current?.contentWindow
      )
        return;
      if (event.data?.type === "sis-height")
        setHeight(Math.min(12000, Math.max(350, event.data.height)));
      if (event.data?.type === "sis-toast")
        notify(event.data.message, event.data.tone);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [notify]);
  return (
    <div className="frame-scroll">
      <iframe
        ref={ref}
        title={title}
        src={configUrl(initial.current, { embed: "1", width: "auto" })}
        onLoad={() =>
          ref.current?.contentWindow?.postMessage(
            { type: "sis-presentation", config },
            location.origin,
          )
        }
        style={{
          height,
          width: config.width === "auto" ? "100%" : `${config.width}px`,
        }}
      />
    </div>
  );
}
function Usage({
  entry,
  config,
  notify,
}: {
  entry: CatalogEntry;
  config: Config;
  notify: DemoProps["notify"];
}) {
  const group =
    entry.group === "Foundations"
      ? "foundation"
      : entry.group === "Patterns"
        ? "pattern"
        : "component";
  const sampleTheme =
    config.theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : config.theme;
  const code = `import { useState } from 'react';
import { I18nProvider } from 'react-aria-components';
import { ${group}Renderers } from './demos/${group === "foundation" ? "foundations" : group === "pattern" ? "patterns" : "components"}';
import './styles.css';

export function Example() {
  const [message, setMessage] = useState('');
  const Specimen = ${group}Renderers['${entry.id}'];
  return <I18nProvider locale="${config.locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB-u-nu-latn"}">
    <div data-theme="${sampleTheme}" data-font="${config.font}"
      data-density="${config.density}" lang="${config.locale}"
      dir="${config.locale === "ar" ? "rtl" : "ltr"}"
      style={{ fontFamily: 'var(--sys-font-family-ui)', color: 'var(--c-text)', background: 'var(--c-bg)' }}>
      <Specimen locale="${config.locale}" theme="${sampleTheme}"
        density="${config.density}" state="${config.state}"
        variant="${config.variant}" notify={setMessage} />
      <p role="status">{message}</p>
    </div>
  </I18nProvider>;
}`;
  return (
    <section className="documentation">
      <h2>
        {tr(
          config.locale,
          "Use this specimen",
          "استخدم هذا المثال",
          "Utiliser cet exemple",
        )}
      </h2>
      <p>
        {tr(
          config.locale,
          "This working example uses the renderer and shared styles in this workbench. It is not a separately published component package.",
          "يستخدم هذا المثال العارض والأنماط المشتركة داخل هذا المشروع. وهو ليس حزمة مكونات منشورة.",
          "Cet exemple utilise le rendu et les styles de cet atelier. Ce n’est pas un paquet publié séparément.",
        )}
      </p>
      <div className="code-heading">
        <span>React · {entry.id}</span>
        <Button
          variant="secondary"
          onClick={() => copyText(code, notify, config.locale)}
        >
          <Icons.Copy size={16} />
          {tr(config.locale, "Copy example", "نسخ المثال", "Copier l’exemple")}
        </Button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      <h3>
        {tr(
          config.locale,
          "Usage rules",
          "قواعد الاستخدام",
          "Règles d’utilisation",
        )}
      </h3>
      <ul>
        {entry.guidance?.map((text, index) => (
          <li key={index}>{label(text, config.locale)}</li>
        ))}
        <li>
          {tr(
            config.locale,
            "Use semantic tokens instead of choosing raw colors in components.",
            "استخدم الرموز الدلالية بدلاً من الألوان المباشرة.",
            "Utilisez les jetons sémantiques plutôt que des couleurs brutes.",
          )}
        </li>
        <li>
          {tr(
            config.locale,
            "Keep labels visible and announce meaningful feedback.",
            "أبق التسميات ظاهرة وأعلن الاستجابات المهمة.",
            "Gardez les libellés visibles et annoncez les retours importants.",
          )}
        </li>
        <li>
          {tr(
            config.locale,
            "Use the States tab to inspect the supported conditions.",
            "استخدم تبويب الحالات لفحص الحالات الاستثنائية والقراءة فقط.",
            "Utilisez les États pour examiner les situations exceptionnelles.",
          )}
        </li>
      </ul>
    </section>
  );
}
export function App() {
  const [config, setConfig] = useState<Config>(initialConfig);
  const densityChosen=useRef(initialQuery.has("density"));
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [mobile, setMobile] = useState(matchMedia("(max-width:899px)").matches);
  const [collapsed, setCollapsed] = useState<string[]>([
    "Components",
    "Patterns",
  ]);
  const [toast, setToast] = useState<{ message: string; tone: Tone } | null>(
    null,
  );
  const [darkSystem, setDarkSystem] = useState(
    matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const resolvedTheme =
    config.theme === "system" ? (darkSystem ? "dark" : "light") : config.theme;
  const entry = catalog.find((x) => x.id === config.item) || catalog[0];
  const notify = useCallback((message: string, tone: Tone = "info") => {
    if (isEmbed) {
      parent.postMessage({ type: "sis-toast", message, tone }, location.origin);
    } else setToast({ message, tone });
  }, []);
  const t = (en: string, ar: string, fr: string) =>
    tr(config.locale, en, ar, fr);
  const update=(patch:Partial<Config>)=>{if(patch.density)densityChosen.current=true;setConfig(old=>({...old,...patch}));};
  const onSelect = (id: string, specimen = "") => {
    setConfig((old) => ({
      ...old,
      item: id,
      density: densityChosen.current?old.density:catalog.find(x=>x.id===id)?.recommendedDensity==='compact'?'compact':'comfortable',
      specimen,
      tab: "playground",
      state: "default",
      variant: "default",
    }));
    setDrawer(false);
  };
  useEffect(() => {
    const media = matchMedia("(max-width:899px)");
    const handler = () => {
      setMobile(media.matches);
      setDrawer(false);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setDarkSystem(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.font = config.font;
    root.dataset.density = config.density;
    root.lang = config.locale;
    root.dir = config.locale === "ar" ? "rtl" : "ltr";
    try {
      if (!isEmbed) localStorage.setItem("sis.theme", config.theme);
    } catch {}
    document.title = `${label(entry.name, config.locale)} · SIS Foundations`;
    if (!isEmbed) history.replaceState(null, "", configUrl(config));
  }, [config, resolvedTheme, entry]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin === location.origin &&
        event.data?.type === "sis-presentation" &&
        isEmbed
      )
        setConfig((old) => ({ ...old, ...event.data.config }));
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
  useEffect(() => {
    if (!isEmbed) return;
    const observer = new ResizeObserver(() =>
      parent.postMessage(
        { type: "sis-height", height: document.body.scrollHeight + 20 },
        location.origin,
      ),
    );
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (mobile) {
          setDrawer(true);
          requestAnimationFrame(() =>
            document.getElementById("catalog-search")?.focus(),
          );
        } else document.getElementById("catalog-search")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobile]);
  useEffect(() => {
    if (isEmbed && config.specimen) {
      document
        .querySelector(`[data-specimen="${CSS.escape(config.specimen)}"]`)
        ?.scrollIntoView({ block: "start" });
    }
  }, [config.specimen, config.item]);
  const props: DemoProps = {
    specimen: config.specimen,
    locale: config.locale,
    density: config.density,
    theme: resolvedTheme,
    state: config.state,
    variant: config.variant,
    notify,
  };
  const Renderer = renderers[entry.id as keyof typeof renderers];
  const result = catalog.filter((item) =>
    [
      ...Object.values(item.name),
      ...Object.values(item.description),
      ...item.keywords,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const content =
    entry.group === "Review" ? (
      <ReviewPage
        entry={entry}
        locale={config.locale}
        onSelect={onSelect}
        notify={notify}
        renderers={renderers}
      />
    ) : Renderer ? (
      <Renderer key={`${entry.id}-${config.reset}`} {...props} />
    ) : (
      <Callout tone="warning">
        {t(
          "This specimen is being connected.",
          "يتم ربط هذا المثال.",
          "Cet exemple est en cours de connexion.",
        )}
      </Callout>
    );
  const configSummary = useMemo(
    () =>
      `${config.item} · ${resolvedTheme} · ${config.font} · ${config.locale} · ${config.density} · ${config.state} · ${config.variant}`,
    [config, resolvedTheme],
  );
  if (isEmbed)
    return (
      <I18nProvider
        locale={
          config.locale === "ar"
            ? "ar-EG-u-nu-latn"
            : "en-GB-u-nu-latn"
        }
      >
        <main
          className={`embed-view ${config.state === "hover" ? "force-hover" : config.state === "focus" ? "force-focus" : config.state === "pressed" ? "force-pressed" : ""}`}
          data-demo-state={config.state}
        >
          <h1 className="embed-page-title">{label(entry.name, config.locale)}</h1>
          <h2 className="embed-page-title">{t("Specimens", "الأمثلة", "Exemples")}</h2>
          {content}
        </main>
      </I18nProvider>
    );
  const renderPreview = () => {
    if (config.compare !== "none") {
      const items =
        config.compare === "density"
            ? (["comfortable", "compact"] as const).map((density) => ({
                ...config,
                density,
                width: "auto",
                compare: "none",
              }))
            : (["light", "dark"] as const).map((theme) => ({
                ...config,
                theme,
                width: "auto",
                compare: "none",
              }));
      return (
        <div className="comparison-grid">
          {items.map((c) => (
            <section className="comparison-pane" key={items.indexOf(c)}>
              <h3>
                {config.compare === "density"
                    ? c.density
                    : c.theme}
              </h3>
              <PreviewFrame
                config={c}
                title={`${entry.name.en} ${c.font} ${c.theme} ${c.density}`}
                notify={notify}
              />
            </section>
          ))}
        </div>
      );
    }
    return null;
  };
  const sidebar = (
    <aside
      id="catalog-sidebar"
      className={`catalog-sidebar ${drawer ? "is-open" : ""}`}
      aria-label={t(
        "Catalog navigation",
        "التنقل في الكتالوج",
        "Navigation du catalogue",
      )}
    >
      {mobile && (
        <Button
          className="nav-close"
          variant="ghost"
          aria-label={t(
            "Close navigation",
            "إغلاق التنقل",
            "Fermer la navigation",
          )}
          onClick={() => setDrawer(false)}
        >
          <Icons.X size={20} />
        </Button>
      )}
      <a
        href={configUrl({ ...config, item: "colors" })}
        className="identity"
        onClick={(e) => {
          e.preventDefault();
          onSelect("colors");
        }}
      >
        <strong>E-JUST</strong>
        <span>SIS Foundations</span>
      </a>
      <div className="sidebar-search">
        <Icons.Search size={20} />
        <input
          id="catalog-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(
            "Find a foundation or component",
            "ابحث عن أساس أو مكون",
            "Rechercher un élément",
          )}
          aria-label={t(
            "Search catalog",
            "البحث في الكتالوج",
            "Rechercher dans le catalogue",
          )}
        />
        <kbd>⌘ K</kbd>
      </div>
      <nav>
        {groups.map((group) => {
          const items = result.filter((item) => item.group === group);
          if (!items.length) return null;
          const isClosed = collapsed.includes(group) && !query;
          return (
            <section className="nav-group" key={group}>
              <button
                className="nav-group-toggle"
                aria-expanded={!isClosed}
                onClick={() =>
                  setCollapsed((old) =>
                    old.includes(group)
                      ? old.filter((x) => x !== group)
                      : [...old, group],
                  )
                }
              >
                {t(...(groupNames[group] as [string, string, string]))}
                <Icons.ChevronDown
                  size={16}
                  className={isClosed ? "closed" : ""}
                />
              </button>
              {!isClosed &&
                items.map((item) => {
                  const Icon =
                    (Icons as unknown as Record<string, LucideIcon>)[
                      item.icon
                    ] || Icons.Circle;
                  return (
                    <a
                      href={configUrl({
                        ...config,
                        item: item.id,
                        tab: "playground",
                      })}
                      key={item.id}
                      className={`nav-item ${entry.id === item.id ? "active" : ""}`}
                      aria-current={entry.id === item.id ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelect(item.id);
                      }}
                    >
                      <Icon size={20} />
                      <span>{label(item.name, config.locale)}</span>
                    </a>
                  );
                })}
            </section>
          );
        })}
        {result.length === 0 && (
          <p className="sidebar-empty">
            {t(
              "No matching specimens",
              "لا توجد أمثلة مطابقة",
              "Aucun exemple trouvé",
            )}
          </p>
        )}
      </nav>
      <div className="sidebar-footer">
        <span className="live-dot" />
        {number(config.locale, catalog.length)}{" "}
        {t("live catalog pages", "صفحة في الكتالوج", "pages du catalogue")}
        <small>
          {t(
            "Personal reference · prototype",
            "مرجع شخصي · نموذج تجريبي",
            "Référence personnelle · prototype",
          )}
        </small>
      </div>
    </aside>
  );
  return (
    <I18nProvider
      locale={
        config.locale === "ar"
          ? "ar-EG-u-nu-latn"
          : "en-GB-u-nu-latn"
      }
    >
      <a className="skip-link" href="#main-content">
        {t("Skip to content", "تخطي إلى المحتوى", "Aller au contenu")}
      </a>
      {mobile ? (
        <ModalOverlay
          className="mobile-nav-overlay"
          isDismissable
          isOpen={drawer}
          onOpenChange={setDrawer}
        >
          <Modal className="nav-drawer-modal">
            <Dialog
              className="nav-drawer-dialog"
              aria-label={t(
                "Catalog navigation",
                "التنقل في الكتالوج",
                "Navigation du catalogue",
              )}
            >
              {sidebar}
            </Dialog>
          </Modal>
        </ModalOverlay>
      ) : (
        sidebar
      )}

      <div className="workbench-main">
        <header className="utility-bar">
          <Button
            variant="ghost"
            className="mobile-menu"
            aria-expanded={drawer}
            aria-controls="catalog-sidebar"
            aria-label={t(
              "Open navigation",
              "فتح التنقل",
              "Ouvrir la navigation",
            )}
            onClick={() => setDrawer(!drawer)}
          >
            <Icons.Menu size={20} />
          </Button>
          <div className="breadcrumb">
            {t(
              ...(groupNames[entry.group as keyof typeof groupNames] as [
                string,
                string,
                string,
              ]),
            )}
            <Icons.ChevronRight size={16} />
            <span>{label(entry.name, config.locale)}</span>
          </div>
          <div className="presentation-controls">
            {[
              {
                key: "theme",
                label: t("Theme", "السمة", "Thème"),
                icon: Icons.Sun,
                options: [
                  ["light", t("Light", "فاتح", "Clair")],
                  ["dark", t("Dark", "داكن", "Sombre")],
                  ["system", t("System", "النظام", "Système")],
                ],
              },
              {
                key: "font",
                label: t("Font", "الخط", "Police"),
                icon: Icons.Type,
                options: [
                  ["ibm", "IBM Plex"],
                ],
              },
              {
                key: "locale",
                label: t("Language", "اللغة", "Langue"),
                icon: Icons.Globe,
                options: [
                  ["en", "English"],
                  ["ar", "العربية"],
                ],
              },
              {
                key: "density",
                label: t("Density", "الكثافة", "Densité"),
                icon: Icons.PanelTop,
                options: [
                  ["comfortable", t("Comfortable", "مريح", "Confortable")],
                  ["compact", t("Compact", "مضغوط", "Compact")],
                ],
              },
              {
                key: "width",
                label: t("Viewport", "العرض", "Aperçu"),
                icon: Icons.Maximize2,
                options: [
                  ["auto", t("Available", "المتاح", "Disponible")],
                  ["360", "360px"],
                  ["834", "834px"],
                  ["1440", "1440px"],
                ],
              },
            ].map((control) => control.key==='font'?<div className="utility-control" key="font"><Icons.Type size={20}/><span><small>{control.label}</small><strong>IBM Plex</strong></span></div>:(
              <label className="utility-control" key={control.key}>
                <control.icon size={20} />
                <span>
                  <small>{control.label}</small>
                  <select
                    aria-label={control.label}
                    value={config[control.key as keyof Config]}
                    onChange={(e) => update({ [control.key]: e.target.value })}
                  >
                    {control.options.map(([value, text]) => (
                      <option key={value} value={value}>
                        {text}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            ))}
          </div>
        </header>
        <main id="main-content" className="page-content">
          <div className="page-intro">
            <div>
              <h1>{label(entry.name, config.locale)}</h1>
              <p>{label(entry.description, config.locale)}</p>
            </div>
            <Button
              variant="ghost"
              aria-label={t(
                "Copy page link",
                "نسخ رابط الصفحة",
                "Copier le lien",
              )}
              onClick={() => copyText(location.href, notify, config.locale)}
            >
              <Icons.Link2 size={20} />
            </Button>
          </div>
          <div
            className="content-tabs"
            role="tablist"
            aria-label={t(
              "Specimen sections",
              "أقسام المثال",
              "Sections de l’exemple",
            )}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                id={`tab-${tab}`}
                aria-controls={`panel-${tab}`}
                aria-selected={config.tab === tab}
                tabIndex={config.tab === tab ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const move =
                      (event.key === "ArrowRight" ? 1 : -1) *
                      (config.locale === "ar" ? -1 : 1);
                    const index =
                      (tabs.indexOf(tab) + move + tabs.length) % tabs.length;
                    update({ tab: tabs[index] });
                    document.getElementById(`tab-${tabs[index]}`)?.focus();
                  }
                }}
                onClick={() => update({ tab })}
              >
                {t(...(tabNames[tab] as [string, string, string]))}
              </button>
            ))}
          </div>
          {entry.group !== "Review" && (
            <div className="specimen-toolbar">
              {entry.variants.length > 1 && (
                <label>
                  {t("Variant", "الشكل", "Variante")}
                  <select
                    className="input"
                    aria-label={t("Variant", "الشكل", "Variante")}
                    value={config.variant}
                    onChange={(e) => update({ variant: e.target.value })}
                  >
                    {entry.variants.map((v) => (
                      <option key={v} value={v}>
                        {presentationName(v, config.locale)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {entry.states.length > 1 && (
                <label>
                  {t("State", "الحالة", "État")}
                  <select
                    className="input"
                    aria-label={t("State", "الحالة", "État")}
                    value={config.state}
                    onChange={(e) => update({ state: e.target.value })}
                  >
                    {entry.states.map((state) => (
                      <option key={state} value={state}>
                        {presentationName(state, config.locale)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                {t("Compare", "قارن", "Comparer")}
                <select
                  className="input"
                  aria-label={t("Compare", "قارن", "Comparer")}
                  value={config.compare}
                  onChange={(e) => update({ compare: e.target.value })}
                >
                  <option value="none">
                    {t("Single preview", "عرض واحد", "Aperçu unique")}
                  </option>
                  <option value="themes">
                    {t("Light / dark", "فاتح / داكن", "Clair / sombre")}
                  </option>

                  <option value="density">
                    {t("Density", "الكثافة", "Densité")}
                  </option>
                </select>
              </label>
              <div className="toolbar-spacer" />
              <Button
                variant="ghost"
                onClick={() => {
                  update({
                    state: "default",
                    variant: "default",
                    reset: config.reset + 1,
                  });
                  window.dispatchEvent(new CustomEvent("sis-reset-demo"));
                  notify(
                    t(
                      "Example reset",
                      "أعيد ضبط المثال",
                      "Exemple réinitialisé",
                    ),
                  );
                }}
              >
                <Icons.RotateCcw size={16} />
                {t("Reset", "إعادة ضبط", "Réinitialiser")}
              </Button>
              <a
                className="button button-secondary"
                href={configUrl(config, { embed: "1", width: "auto" })}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.ExternalLink size={16} />
                {t("Full size", "الحجم الكامل", "Taille réelle")}
              </a>
            </div>
          )}
          <section
            id={config.tab === "states" ? "panel-states" : "panel-playground"}
            role="tabpanel"
            aria-labelledby={
              config.tab === "states" ? "tab-states" : "tab-playground"
            }
            hidden={!["playground", "states"].includes(config.tab)}
            className={`playground ${config.state === "hover" ? "force-hover" : config.state === "focus" ? "force-focus" : config.state === "pressed" ? "force-pressed" : ""}`}
            data-demo-state={config.state}
            key={entry.id}
          >
            {config.tab === "states" && (
              <div className="state-explanation">
                <Badge tone="info">{config.state}</Badge>
                <p>
                  {t(
                    "Choose a state above, then use the example. Reset returns to the default condition.",
                    "اختر حالة ثم جرب المثال. تعيد إعادة الضبط الحالة الافتراضية.",
                    "Choisissez un état, puis utilisez l’exemple. Réinitialisez pour revenir au défaut.",
                  )}
                </p>
              </div>
            )}
            <div hidden={config.compare !== "none"}>
              {entry.group === "Review" ? (
                content
              ) : (
                <PreviewFrame
                  config={config}
                  title={entry.name.en}
                  notify={notify}
                />
              )}
            </div>
            {renderPreview()}
          </section>
          {config.tab === "variants" && (
            <section
              role="tabpanel"
              id="panel-variants"
              aria-labelledby="tab-variants"
            >
              <h2>
                {t(
                  "Supported variations",
                  "الأشكال المدعومة",
                  "Variantes disponibles",
                )}
              </h2>
              <div className="variants-list">
                {entry.variants.map((variant) => (
                  <div key={variant}>
                    <h3>{presentationName(variant, config.locale)}</h3>
                    {Renderer ? (
                      <Renderer {...props} variant={variant} />
                    ) : (
                      content
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {config.tab === "tokens" && (
            <section
              role="tabpanel"
              id="panel-tokens"
              aria-labelledby="tab-tokens"
            >
              <TokenView
                entry={entry}
                locale={config.locale}
                notify={notify}
                settingsKey={configSummary}
              />
            </section>
          )}
          {config.tab === "usage" && (
            <section
              role="tabpanel"
              id="panel-usage"
              aria-labelledby="tab-usage"
            >
              {entry.group === "Review" ? (
                <ReviewPage
                  entry={entry}
                  locale={config.locale}
                  onSelect={onSelect}
                  notify={notify}
                  renderers={renderers}
                />
              ) : (
                <Usage entry={entry} config={config} notify={notify} />
              )}
            </section>
          )}
          {config.tab === "accessibility" && (
            <section
              role="tabpanel"
              id="panel-accessibility"
              aria-labelledby="tab-accessibility"
              className="documentation"
            >
              <h2>
                {t(
                  "Built for clear interaction",
                  "تفاعل واضح ومتاح",
                  "Des interactions claires",
                )}
              </h2>
              <ul className="a11y-checklist">
                {[
                  ...(entry.accessibility?.map((text) =>
                    label(text, config.locale),
                  ) || []),
                  t(
                    "Use Tab to reach controls. Enter or Space activates buttons.",
                    "استخدم Tab للتنقل وEnter أو Space لتفعيل الأزرار.",
                    "Utilisez Tab pour naviguer, puis Entrée ou Espace.",
                  ),
                  t(
                    "Arrow keys navigate tabs, choices, and menus.",
                    "تتنقل الأسهم بين التبويبات والاختيارات والقوائم.",
                    "Les flèches parcourent les onglets, choix et menus.",
                  ),
                  t(
                    "Escape closes dismissible overlays and returns focus to the trigger.",
                    "يغلق Escape النوافذ القابلة للإغلاق ويعيد التركيز للمشغل.",
                    "Échap ferme les superpositions et rend le focus au déclencheur.",
                  ),
                  t(
                    "Targets retain at least 44 × 44px in both density modes.",
                    "تحتفظ الأهداف بمساحة 44 × 44px على الأقل.",
                    "Les cibles gardent au moins 44 × 44px.",
                  ),
                  t(
                    "Visible labels and non-color cues communicate meaning.",
                    "توضح التسميات والمؤشرات غير اللونية المعنى.",
                    "Les libellés et indices non colorés donnent le sens.",
                  ),
                  t(
                    "Arabic uses RTL layout and international digits.",
                    "تستخدم العربية الاتجاه من اليمين إلى اليسار والأرقام الدولية.",
                    "L’arabe utilise RTL et les chiffres internationaux.",
                  ),
                  t(
                    "Reduced motion preserves immediate feedback.",
                    "تحافظ الحركة المخفضة على الاستجابة الفورية.",
                    "Le mouvement réduit garde des retours immédiats.",
                  ),
                ].map((text) => (
                  <li key={text}>
                    <Icons.Check size={20} />
                    {text}
                  </li>
                ))}
              </ul>
              <Callout>
                {t(
                  "Inspect the live example with your keyboard and preferred assistive technology. Automated checks cannot establish complete accessibility.",
                  "افحص المثال بلوحة المفاتيح والتقنية المساعدة. الفحوص الآلية لا تثبت الإتاحة الكاملة.",
                  "Examinez l’exemple au clavier et avec vos aides. Les contrôles automatiques ne prouvent pas toute l’accessibilité.",
                )}
              </Callout>
            </section>
          )}
          <footer className="page-footer">
            <span>
              {t(
                "Inspection only. Request design changes outside the prototype.",
                "للفحص فقط. اطلب تغييرات التصميم خارج النموذج.",
                "Inspection uniquement. Demandez les modifications hors du prototype.",
              )}
            </span>
            <code>{configSummary}</code>
          </footer>
        </main>
      </div>
      {toast && (
        <div className={`toast tone-${toast.tone}`} role="status">
          <Icons.Check size={20} />
          <span>{toast.message}</span>
          <Button
            variant="ghost"
            aria-label={t(
              "Dismiss message",
              "إغلاق الرسالة",
              "Fermer le message",
            )}
            onClick={() => setToast(null)}
          >
            <Icons.X size={16} />
          </Button>
        </div>
      )}
    </I18nProvider>
  );
}
