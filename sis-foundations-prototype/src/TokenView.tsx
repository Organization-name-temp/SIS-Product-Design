import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import type { CatalogEntry } from "./catalog";
import { Button, tr, copyText, type DemoProps, type Locale } from "./shared";
import palette from "./data/palette.json";
function color(ref: string) {
  const [family, key] = ref.split(".");
  return (
    (palette.primitives as Record<string, Record<string, string>>)[family]?.[
      key
    ] || ref
  );
}
export function TokenView({
  entry,
  locale,
  notify,
  settingsKey,
}: {
  entry: CatalogEntry;
  locale: Locale;
  notify: DemoProps["notify"];
  settingsKey: string;
}) {
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const t = (en: string, ar: string, fr: string) => tr(locale, en, ar, fr);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const css = getComputedStyle(document.documentElement);
      setValues(
        Object.fromEntries(
          entry.tokens.map((token) => {
            const name = token.startsWith("--")
              ? token
              : `--sys-color-${token}`;
            return [name, css.getPropertyValue(name).trim()];
          }),
        ),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [entry, settingsKey]);
  const roleRows = Object.entries(palette.themes.light).filter(([name]) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="documentation">
      <h2>
        {t(
          "Reference → semantic → component",
          "مرجع ← دلالي ← مكون",
          "Référence → sémantique → composant",
        )}
      </h2>
      <p>
        {t(
          "Names stay stable across themes. These are the tokens used by this page.",
          "تبقى الأسماء ثابتة بين السمات. هذه الرموز المستخدمة في الصفحة.",
          "Les noms restent stables entre les thèmes. Voici les jetons de cette page.",
        )}
      </p>
      <div className="table-scroll">
        <table className="sample-table">
          <thead>
            <tr>
              <th>{t("Token", "الرمز", "Jeton")}</th>
              <th>{t("Current value", "القيمة الحالية", "Valeur actuelle")}</th>
              <th>{t("Copy", "نسخ", "Copier")}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(values).map(([name, value]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>{value || t("No value", "لا توجد قيمة", "Sans valeur")}</td>
                <td>
                  <Button
                    variant="ghost"
                    aria-label={`${t("Copy", "نسخ", "Copier")} ${name}`}
                    onClick={() => copyText(`var(${name})`, notify, locale)}
                  >
                    <Copy size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details>
        <summary>
          {t(
            "All semantic color mappings",
            "كل روابط الألوان الدلالية",
            "Toutes les correspondances de couleurs",
          )}
        </summary>
        <input
          className="input"
          aria-label={t("Find a token", "البحث عن رمز", "Rechercher un jeton")}
          placeholder={t(
            "Filter role names…",
            "تصفية أسماء الأدوار…",
            "Filtrer les rôles…",
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="table-scroll">
          <table className="sample-table">
            <thead>
              <tr>
                <th>
                  {t("Semantic role", "الدور الدلالي", "Rôle sémantique")}
                </th>
                <th>{t("Light", "فاتح", "Clair")}</th>
                <th>{t("Dark", "داكن", "Sombre")}</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map(([key, ref]) => (
                <tr key={key}>
                  <td>
                    <code>--sys-color-{key}</code>
                  </td>
                  {[
                    ref,
                    (palette.themes.dark as Record<string, string>)[key],
                  ].map((mode, index) => (
                    <td key={index}>
                      <span
                        className="tiny-swatch"
                        style={{ background: color(mode) }}
                      />
                      <code>{color(mode)}</code>
                      <small className="token-reference">{mode}</small>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <details>
        <summary>
          {t("Component aliases", "روابط المكونات", "Alias des composants")}
        </summary>
        <div className="table-scroll">
          <table className="sample-table">
            <thead>
              <tr>
                <th>
                  {t("Component token", "رمز المكون", "Jeton du composant")}
                </th>
                <th>
                  {t("Semantic source", "المصدر الدلالي", "Source sémantique")}
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(palette.components).map(([alias, role]) => (
                <tr key={alias}>
                  <td>
                    <code>--cmp-{alias}</code>
                  </td>
                  <td>
                    <code>var(--sys-color-{role})</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
