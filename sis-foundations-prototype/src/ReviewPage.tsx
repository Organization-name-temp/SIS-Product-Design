import { useState } from "react";
import { ArrowUpRight, Download, FileCode2, Copy } from "lucide-react";
import { catalog, groups, label, type CatalogEntry } from "./catalog";
import {
  Badge,
  Button,
  Callout,
  copyText,
  number,
  tr,
  type DemoRenderer,
  type DemoProps,
  type Locale,
} from "./shared";
import decisions from "./data/decisions.json";
const names: Record<string, [string, string, string]> = {
  Foundations: ["Foundations", "الأسس", "Fondations"],
  Components: ["Components", "المكونات", "Composants"],
  Patterns: ["Composite patterns", "الأنماط المركبة", "Motifs composés"],
  Review: ["Review and exports", "المراجعة والتصدير", "Révision et exports"],
};
export function ReviewPage({
  entry,
  locale,
  onSelect,
  notify,
  renderers,
}: {
  entry: CatalogEntry;
  locale: Locale;
  onSelect: (id: string, specimen?: string) => void;
  notify: DemoProps["notify"];
  renderers: Record<string, DemoRenderer>;
}) {
  const [checks, setChecks] = useState<string[]>([]);
  const t = (en: string, ar: string, fr: string) => tr(locale, en, ar, fr);
  function destination(id: string, specimen = "") {
    const q = new URLSearchParams(location.search);
    q.set("item", id);
    q.set("tab", "playground");
    q.delete("embed");
    q.set("specimen", specimen);
    return `?${q}`;
  }
  if (entry.id === "coverage")
    return (
      <div className="documentation">
        <h2>
          {t(
            "Every example, one catalog",
            "كل الأمثلة في كتالوج واحد",
            "Tous les exemples, un catalogue",
          )}
        </h2>
        <p>
          {t(
            "Open a page or a named example. Availability checks the renderer; browser results appear in the QA report.",
            "افتح صفحة أو مثالاً محدداً. يفحص التوفر وجود العارض؛ تظهر نتائج المتصفح في تقرير الجودة.",
            "Ouvrez une page ou un exemple précis. La disponibilité vérifie le rendu ; les résultats figurent dans le rapport qualité.",
          )}
        </p>
        {groups.map((group) => (
          <section className="coverage-group" key={group}>
            <h3>{t(...names[group])}</h3>
            {catalog
              .filter((item) => item.group === group)
              .map((item) => (
                <details key={item.id}>
                  <summary>
                    <span>{label(item.name, locale)}</span>
                    <Badge
                      tone={
                        renderers[item.id] || item.group === "Review"
                          ? "success"
                          : "danger"
                      }
                    >
                      {renderers[item.id] || item.group === "Review"
                        ? t("Available", "متاح", "Disponible")
                        : t("Missing", "مفقود", "Absent")}
                    </Badge>
                  </summary>
                  <a
                    href={destination(item.id)}
                    className="button button-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(item.id);
                    }}
                  >
                    {t("Open page", "فتح الصفحة", "Ouvrir la page")}
                    <ArrowUpRight size={16} />
                  </a>
                  <ul className="coverage-links">
                    {item.specimens?.map((specimen) => (
                      <li key={specimen.id}>
                        <a
                          href={destination(item.id, specimen.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelect(item.id, specimen.id);
                          }}
                        >
                          {label(specimen.name, locale)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
          </section>
        ))}
      </div>
    );
  if (entry.id === "decisions") {
    const items = [
      [
        "themes",
        t(
          "Light and dark themes",
          "السمتان الفاتحة والداكنة",
          "Thèmes clair et sombre",
        ),
      ],
      [
        "fonts",
        t(
          "IBM Plex and four weights",
          "IBM Plex وأربعة أوزان",
          "Trois polices et quatre graisses",
        ),
      ],
      [
        "languages",
        t(
          "Arabic RTL and English LTR",
          "العربية والإنجليزية",
          "Arabe, anglais et français",
        ),
      ],
      [
        "density",
        t(
          "Comfortable and compact density",
          "الكثافة المريحة والمضغوطة",
          "Densités confortable et compacte",
        ),
      ],
      [
        "keyboard",
        t(
          "Keyboard, focus, and reduced motion",
          "لوحة المفاتيح والتركيز والحركة المخفضة",
          "Clavier, focus et mouvement réduit",
        ),
      ],
      [
        "width",
        t(
          "320px, medium, and wide layouts",
          "العرض 320px والمتوسط والواسع",
          "Largeurs 320px, moyenne et large",
        ),
      ],
    ];
    return (
      <div className="documentation">
        <h2>
          {t(
            "Approved foundation baseline",
            "الأسس المعتمدة",
            "Fondations approuvées",
          )}
        </h2>
        <Callout>
          {t(
            "Adham is the sole design approver. These values follow the foundation contract.",
            "أدهم هو المعتمد الوحيد للتصميم. تتبع القيم عقد الأسس.",
            "Adham est le seul approbateur. Les valeurs suivent le contrat des fondations.",
          )}
        </Callout>
        <div className="decision-grid">
          {Object.entries(decisions)
            .filter(([k]) => !["status", "updatedOn"].includes(k))
            .map(([key, val]) => (
              <details key={key}>
                <summary>{key}</summary>
                <pre>{JSON.stringify(val, null, 2)}</pre>
              </details>
            ))}
        </div>
        <h3>
          {t(
            "Visual review notes",
            "ملاحظات المراجعة البصرية",
            "Notes de révision visuelle",
          )}
        </h3>
        <ul>
          <li>
            {t(
              "IBM Plex Sans Arabic is the only active family for Arabic and English.",
              "IBM Plex Sans Arabic هو الخط الوحيد للعربية والإنجليزية.",
              "IBM reste sélectionnée. Comparez Noto et Cairo avant un changement.",
            )}
          </li>
          <li>
            {t(
              "Palette values remain fixed. Review their appearance with your display settings.",
              "تبقى قيم الألوان ثابتة. راجع مظهرها مع إعدادات شاشتك.",
              "La palette reste fixe. Examinez son rendu avec votre écran.",
            )}
          </li>
          <li>
            {t(
              "The transition easing and workbench layer numbers are prototype proposals. They do not change foundation tokens.",
              "تستخدم إعدادات الحركة سجلاً ذا إصدار. تبقى أرقام الطبقات تفصيلاً مستقلاً للنموذج.",
              "La courbe de transition et les niveaux de cet atelier sont proposés. Ils ne changent pas les jetons.",
            )}
          </li>
        </ul>
        <h3>
          {t(
            "Your review checklist",
            "قائمة مراجعتك",
            "Votre liste de contrôle",
          )}
        </h3>
        {items.map(([id, text]) => (
          <label className="check-label" key={id}>
            <input
              type="checkbox"
              checked={checks.includes(id)}
              onChange={() =>
                setChecks((old) =>
                  old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
                )
              }
            />
            {text}
          </label>
        ))}
        <p>{number(locale, checks.length)} / 6</p>
      </div>
    );
  }
  const files = [
    ["sis-motion.tokens.json",t("Motion registry","سجل الحركة","Motion registry")],
    ["sis-motion.css",t("Motion CSS","أنماط الحركة","Motion CSS")],
    ["sis-usage-guidance.json",t("Scale usage guidance","إرشادات استخدام المقاييس","Scale usage guidance")],
    [
      "sis-ejust-palette.css",
      t("Color CSS", "أنماط الألوان", "CSS des couleurs"),
    ],
    [
      "sis-ejust-palette.tokens.json",
      t("Canonical color tokens", "مصدر رموز الألوان", "Source des couleurs"),
    ],
    [
      "sis-ejust-light.tokens.json",
      t("Light mode tokens", "رموز السمة الفاتحة", "Jetons du mode clair"),
    ],
    [
      "sis-ejust-dark.tokens.json",
      t("Dark mode tokens", "رموز السمة الداكنة", "Jetons du mode sombre"),
    ],
    [
      "sis-ejust-figma-modes.csv",
      t("Figma mode mapping", "ربط أوضاع Figma", "Correspondance Figma"),
    ],
    [
      "sis-foundations.css",
      t("Foundation CSS", "أنماط الأسس", "CSS des fondations"),
    ],
    [
      "sis-typography.tokens.json",
      t("Typography tokens", "رموز الخطوط", "Jetons typographiques"),
    ],
    [
      "sis-typography.css",
      t("Typography CSS", "أنماط الخطوط", "CSS typographique"),
    ],
    [
      "sis-foundation-contract.md",
      t("Foundation contract", "عقد الأسس", "Contrat des fondations"),
    ],
  ];
  return (
    <div className="documentation">
      <h2>
        {t(
          "Take the foundations with you",
          "احتفظ بالأسس معك",
          "Emportez les fondations",
        )}
      </h2>
      <p>
        {t(
          "Downloads use the canonical sources. The foundation stylesheet imports the two CSS files. Keep those files together.",
          "تستخدم التنزيلات المصادر الأصلية. يستورد ملف الأسس ملفي أنماط الألوان والخطوط. احتفظ بالملفات معاً.",
          "Les exports utilisent les sources. La feuille des fondations importe les deux CSS. Gardez ces fichiers ensemble.",
        )}
      </p>
      <div className="export-list">
        {files.map(([file, name]) => (
          <a
            key={file}
            href={`/exports/${file}`}
            download
            className="export-row"
          >
            <FileCode2 size={24} />
            <span>
              <strong>{name}</strong>
              <small>{file}</small>
            </span>
            <Download size={20} />
          </a>
        ))}
      </div>
      <Button
        variant="secondary"
        onClick={() =>
          copyText(
            ":root {\n  color: var(--sys-color-text-primary);\n  background: var(--sys-color-bg-canvas);\n}",
            notify,
            locale,
          )
        }
      >
        <Copy size={16} />
        {t("Copy token example", "نسخ مثال الرموز", "Copier un exemple")}
      </Button>
    </div>
  );
}
