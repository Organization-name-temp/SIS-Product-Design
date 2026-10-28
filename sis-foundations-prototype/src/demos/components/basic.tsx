import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  EyeOff,
  Heart,
  LoaderCircle,
  Mail,
  Minus,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Callout,
  Field,
  ModalExample,
  copyText,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, flags, useLabels } from "./common";

export function ButtonsDemo(props: DemoProps) {
  const t = useLabels(props);
  const resultId = useId();
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [result, setResult] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (props.state === "selected") setPressed(true);
  }, [props.state]);
  const act = (text: string) => {
    setCount((value) => value + 1);
    setResult(text);
    props.notify(text, "success");
  };
  const save = () => {
    setBusy(true);
    setResult(
      t("Saving the sample", "جارٍ حفظ المثال", "Enregistrement de l’exemple"),
    );
    timer.current = setTimeout(() => {
      setBusy(false);
      act(
        t(
          "Sample saved locally",
          "حُفظ المثال محليًا",
          "Exemple enregistré localement",
        ),
      );
    }, 900);
  };
  const primary =
    props.variant === "secondary"
      ? "secondary"
      : props.variant === "danger" || props.variant === "destructive"
        ? "danger"
        : props.variant === "ghost" || props.variant === "tertiary"
          ? "ghost"
          : "primary";
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="buttons-actions-and-links">
            {t("Actions and links", "الإجراءات والروابط", "Actions et liens")}
          </span>
        }
      >
        <div className="toolbar">
          <Button
            variant={primary}
            onClick={() =>
              act(
                t(
                  "Primary action complete",
                  "اكتمل الإجراء الرئيسي",
                  "Action principale terminée",
                ),
              )
            }
          >
            <Plus size={20} />
            {t("Add course", "إضافة مقرر", "Ajouter un cours")}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              act(t("Draft saved", "حُفظت المسودة", "Brouillon enregistré"))
            }
          >
            {t("Save draft", "حفظ المسودة", "Enregistrer")}
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              act(
                t(
                  "Changes cancelled",
                  "أُلغيت التغييرات",
                  "Modifications annulées",
                ),
              )
            }
          >
            {t("Cancel", "إلغاء", "Annuler")}
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              act(
                t(
                  "Sample item removed",
                  "حُذف العنصر التجريبي",
                  "Élément exemple supprimé",
                ),
              )
            }
          >
            <Trash2 size={20} />
            {t("Remove sample", "حذف المثال", "Supprimer")}
          </Button>
          <a
            className="component-link"
            href={`#${resultId}`}
            onClick={() =>
              setResult(
                t(
                  "The link moved focus to the result",
                  "نقل الرابط التركيز إلى النتيجة",
                  "Le lien mène au résultat",
                ),
              )
            }
          >
            {t("View result", "عرض النتيجة", "Voir le résultat")}
          </a>
        </div>
      </Panel>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="buttons-toggle-and-icon-actions">
              {t(
                "Toggle and icon actions",
                "التبديل وأزرار الأيقونات",
                "Boutons bascule et icônes",
              )}
            </span>
          }
        >
          <div className="toolbar">
            <Button
              variant={pressed ? "primary" : "secondary"}
              aria-pressed={pressed}
              onClick={() => setPressed(!pressed)}
            >
              <Heart size={20} fill={pressed ? "currentColor" : "none"} />
              {pressed
                ? t("Saved", "محفوظ", "Enregistré")
                : t("Save course", "حفظ المقرر", "Enregistrer le cours")}
            </Button>
            <Button
              variant="secondary"
              aria-label={t(
                "Copy course identifier",
                "نسخ رمز المقرر",
                "Copier le code du cours",
              )}
              onClick={() => copyText("CSE-201", props.notify, props.locale)}
            >
              <Copy size={20} />
            </Button>
            <Button disabled>
              {t("Unavailable", "غير متاح", "Indisponible")}
            </Button>
            <Button disabled={busy} onClick={save}>
              {busy ? (
                <LoaderCircle className="component-spinner-icon" size={20} />
              ) : (
                <Check size={20} />
              )}
              {busy
                ? t("Saving", "جارٍ الحفظ", "Enregistrement")
                : t("Save sample", "حفظ المثال", "Enregistrer l’exemple")}
            </Button>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="buttons-split-action-and-button-group">
              {t(
                "Split action and button group",
                "إجراء مقسم ومجموعة أزرار",
                "Action divisée et groupe",
              )}
            </span>
          }
        >
          <div className="toolbar">
            <div className="component-split">
              <Button
                onClick={() =>
                  act(t("Report exported", "صُدّر التقرير", "Rapport exporté"))
                }
              >
                <Download size={20} />
                {t("Export", "تصدير", "Exporter")}
              </Button>
              <Button
                aria-expanded={menu}
                aria-label={t(
                  "Export options",
                  "خيارات التصدير",
                  "Options d’export",
                )}
                onClick={() => setMenu(!menu)}
              >
                <ChevronDown size={20} />
              </Button>
            </div>
            {menu && (
              <div className="toolbar">
                {["CSV", "PDF", "JSON"].map((format) => (
                  <Button
                    key={format}
                    variant="secondary"
                    onClick={() => {
                      setMenu(false);
                      act(`${format} ${t("selected", "محدد", "sélectionné")}`);
                    }}
                  >
                    {format}
                  </Button>
                ))}
              </div>
            )}
            <Button
              variant="secondary"
              onClick={() => setCount(Math.max(0, count - 1))}
              aria-label={t(
                "Decrease count",
                "تقليل العدد",
                "Diminuer le nombre",
              )}
            >
              <Minus size={20} />
            </Button>
            <output>{number(props.locale, count)}</output>
            <Button
              variant="secondary"
              onClick={() => setCount(count + 1)}
              aria-label={t(
                "Increase count",
                "زيادة العدد",
                "Augmenter le nombre",
              )}
            >
              <Plus size={20} />
            </Button>
          </div>
        </Panel>
      </div>
      <div
        id={resultId}
        data-testid="button-result"
        className="result-box"
        tabIndex={-1}
        role="status"
      >
        {result ||
          t(
            "Choose an action to see its result.",
            "اختر إجراءً لعرض نتيجته.",
            "Choisissez une action pour voir son résultat.",
          )}
      </div>
    </ComponentFrame>
  );
}

export function FieldsDemo(props: DemoProps) {
  const t = useLabels(props);
  const f = flags(props);
  const [handle, setHandle] = useState("mariam");
  const [name, setName] = useState("Mariam Hassan");
  const [email, setEmail] = useState("mariam@example.edu");
  const [password, setPassword] = useState("sample-password");
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("+20 100 123 4567");
  const [url, setUrl] = useState("portfolio.example");
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !email.includes("@");
  useEffect(() => {
    if (props.state === "empty") {
      setName("");
      setEmail("");
      setNotes("");
      setPassword("");
      setOtp("");
    }
  }, [props.state]);
  return (
    <ComponentFrame props={props}>
      <form
        className="demo-stack"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (email.includes("@"))
            props.notify(
              t(
                "Form validated locally",
                "تم التحقق من النموذج محليًا",
                "Formulaire validé localement",
              ),
              "success",
            );
        }}
      >
        <div className="demo-grid">
          <Panel
            title={
              <span data-specimen="fields-text-fields">
                {t("Text fields", "حقول النص", "Champs de texte")}
              </span>
            }
          >
            <div className="demo-stack">
              <Field
                label={t("Full name", "الاسم الكامل", "Nom complet")}
                hint={t(
                  "Use the name on your academic record.",
                  "استخدم الاسم المسجل في سجلك الأكاديمي.",
                  "Utilisez le nom de votre dossier.",
                )}
              >
                <input
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  readOnly={f.readonly}
                  placeholder={t("Full name", "الاسم الكامل", "Nom complet")}
                />
              </Field>
              <Field
                label={t(
                  "University email",
                  "البريد الجامعي",
                  "Courriel universitaire",
                )}
                hint={t(
                  "Required. Use a valid email address.",
                  "مطلوب. استخدم بريداً إلكترونياً صحيحاً.",
                  "Obligatoire. Utilisez une adresse valide.",
                )}
                error={
                  invalid || f.invalid
                    ? t(
                        "Enter a valid email address.",
                        "أدخل عنوان بريد صحيحًا.",
                        "Saisissez une adresse valide.",
                      )
                    : undefined
                }
              >
                <input
                  className="input"
                  type="email"
                  required
                  readOnly={f.readonly}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={invalid || f.invalid}
                />
              </Field>
              <Field label={t("Password", "كلمة المرور", "Mot de passe")}>
                <span className="component-input-group">
                  <input
                    className="input"
                    type={show ? "text" : "password"}
                    readOnly={f.readonly}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                  <Button
                    variant="ghost"
                    aria-label={
                      show
                        ? t(
                            "Hide password",
                            "إخفاء كلمة المرور",
                            "Masquer le mot de passe",
                          )
                        : t(
                            "Show password",
                            "عرض كلمة المرور",
                            "Afficher le mot de passe",
                          )
                    }
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </span>
              </Field>
              <Field
                label={t(
                  "Search courses",
                  "البحث عن مقررات",
                  "Rechercher des cours",
                )}
              >
                <span className="component-input-group">
                  <Search size={20} aria-hidden="true" />
                  <input
                    className="input"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setQuery("")}
                    aria-label={t(
                      "Clear search",
                      "مسح البحث",
                      "Effacer la recherche",
                    )}
                  >
                    <X size={20} />
                  </Button>
                </span>
              </Field>
              {query && (
                <output className="muted">
                  {t("Search term", "عبارة البحث", "Recherche")}: {query}
                </output>
              )}
            </div>
          </Panel>
          <Panel
            title={
              <span data-specimen="fields-specialized-fields">
                {t(
                  "Specialized fields",
                  "الحقول المتخصصة",
                  "Champs spécialisés",
                )}
              </span>
            }
          >
            <div className="demo-stack">
              <div data-specimen="fields-required-optional-and-suffix">
                <Field
                  label={t(
                    "Sample email username",
                    "اسم مستخدم البريد التجريبي",
                    "Nom du compte exemple",
                  )}
                  hint={t(
                    "Optional. The suffix stays separate from the editable value.",
                    "اختياري. تبقى اللاحقة منفصلة عن القيمة القابلة للتعديل.",
                    "Facultatif. Le suffixe reste séparé de la valeur modifiable.",
                  )}
                >
                  <span className="component-input-group" dir="ltr">
                    <input
                      className="input"
                      value={handle}
                      readOnly={f.readonly}
                      onChange={(event) => setHandle(event.target.value)}
                    />
                    <span>@example.edu</span>
                  </span>
                </Field>
                <output className="muted">
                  <bdi>{handle}@example.edu</bdi>
                </output>
              </div>
              <Field label={t("Phone", "الهاتف", "Téléphone")}>
                <input
                  className="input"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </Field>
              <Field
                label={t(
                  "Portfolio URL",
                  "رابط ملف الأعمال",
                  "Adresse du portfolio",
                )}
              >
                <span className="component-input-group" dir="ltr">
                  <span>https://</span>
                  <input
                    className="input"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </span>
              </Field>
              <Field
                label={t(
                  "Verification code",
                  "رمز التحقق",
                  "Code de vérification",
                )}
                hint={t(
                  "Sample code: 123456",
                  "الرمز التجريبي: 123456",
                  "Code exemple : 123456",
                )}
              >
                <input
                  className="input component-otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/[^0-9]/g, ""))
                  }
                  dir="ltr"
                />
              </Field>
              {otp.length === 6 && (
                <Badge tone={otp === "123456" ? "success" : "danger"}>
                  {otp === "123456"
                    ? t("Code accepted", "الرمز مقبول", "Code accepté")
                    : t(
                        "Code does not match",
                        "الرمز غير مطابق",
                        "Code incorrect",
                      )}
                </Badge>
              )}
              <Field
                label={t("Advising note", "ملاحظة الإرشاد", "Note de conseil")}
                hint={`${t("Optional", "اختياري", "Facultatif")} · ${number(props.locale, notes.length)} / ${number(props.locale, 240)}`}
              >
                <textarea
                  className="input"
                  maxLength={240}
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={t(
                    "Add context for the advisor.",
                    "أضف تفاصيل للمرشد.",
                    "Ajoutez le contexte pour le conseiller.",
                  )}
                />
              </Field>
              <Field
                label={t(
                  "Student identifier",
                  "رقم الطالب",
                  "Identifiant étudiant",
                )}
                hint={t(
                  "Read-only identifier",
                  "معرف للقراءة فقط",
                  "Identifiant en lecture seule",
                )}
              >
                <input
                  className="input"
                  readOnly
                  value="EJ-2026-0042"
                  dir="ltr"
                />
              </Field>
              <Field label={t("Archived field", "حقل مؤرشف", "Champ archivé")}>
                <input
                  className="input"
                  disabled
                  value={t(
                    "Not editable",
                    "غير قابل للتعديل",
                    "Non modifiable",
                  )}
                  readOnly
                />
              </Field>
            </div>
          </Panel>
        </div>
        <div className="toolbar">
          <Button type="submit">
            <Check size={20} />
            {t("Validate form", "التحقق من النموذج", "Valider le formulaire")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setName("");
              setEmail("");
              setNotes("");
              setOtp("");
              setSubmitted(false);
            }}
          >
            {t("Reset fields", "مسح الحقول", "Réinitialiser")}
          </Button>
        </div>
        {submitted && !invalid && (
          <Callout tone="success">
            {t(
              "The sample form is valid. No data leaves this browser.",
              "النموذج التجريبي صحيح. لا تغادر البيانات هذا المتصفح.",
              "Le formulaire est valide. Les données restent dans ce navigateur.",
            )}
          </Callout>
        )}
      </form>
    </ComponentFrame>
  );
}

export function NumbersDemo(props: DemoProps) {
  const t = useLabels(props);
  const [credits, setCredits] = useState(18);
  const [amount, setAmount] = useState("12500.5");
  const [gpa, setGpa] = useState("3.65");
  const [percent, setPercent] = useState(75);
  const [identifier, setIdentifier] = useState("EJ-2026-0042");
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="numbers-numeric-entry">
              {t("Numeric entry", "إدخال الأرقام", "Saisie numérique")}
            </span>
          }
        >
          <div className="demo-stack">
            <Field
              label={t("Credit hours", "الساعات المعتمدة", "Crédits")}
              hint={t(
                "From 0 to 24 credits",
                "من 0 إلى 24 ساعة",
                "De 0 à 24 crédits",
              )}
            >
              <span className="component-input-group">
                <Button
                  variant="ghost"
                  disabled={credits <= 0}
                  onClick={() => setCredits(Math.max(0, credits - 1))}
                  aria-label={t(
                    "Fewer credits",
                    "تقليل الساعات",
                    "Moins de crédits",
                  )}
                >
                  <Minus size={20} />
                </Button>
                <input
                  className="input"
                  type="number"
                  min={0}
                  max={24}
                  value={credits}
                  onChange={(event) =>
                    setCredits(Math.min(24, Math.max(0, +event.target.value)))
                  }
                />
                <Button
                  variant="ghost"
                  disabled={credits >= 24}
                  onClick={() => setCredits(Math.min(24, credits + 1))}
                  aria-label={t(
                    "More credits",
                    "زيادة الساعات",
                    "Plus de crédits",
                  )}
                >
                  <Plus size={20} />
                </Button>
              </span>
            </Field>
            <Field
              label={t("Tuition amount", "قيمة الرسوم", "Montant des frais")}
            >
              <span className="component-input-group">
                <input
                  className="input"
                  type="number"
                  min={0}
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
                <span>EGP</span>
              </span>
            </Field>
            <Field
              label={t(
                "Grade point average",
                "المعدل التراكمي",
                "Moyenne générale",
              )}
              error={
                +gpa > 4 || +gpa < 0
                  ? t(
                      "Use a value from 0 to 4.",
                      "استخدم قيمة من 0 إلى 4.",
                      "Utilisez une valeur de 0 à 4.",
                    )
                  : undefined
              }
            >
              <input
                className="input"
                type="number"
                min={0}
                max={4}
                step="0.01"
                value={gpa}
                onChange={(event) => setGpa(event.target.value)}
              />
            </Field>
            <Field
              label={t(
                "Completion percentage",
                "نسبة الاكتمال",
                "Pourcentage réalisé",
              )}
            >
              <input
                className="input"
                type="number"
                min={0}
                max={100}
                value={percent}
                onChange={(event) =>
                  setPercent(Math.max(0, Math.min(100, +event.target.value)))
                }
              />
            </Field>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="numbers-locale-formatting">
              {t(
                "Locale formatting",
                "تنسيق الأرقام حسب اللغة",
                "Format des nombres",
              )}
            </span>
          }
        >
          <dl className="component-description-list">
            <div>
              <dt>{t("Currency", "العملة", "Devise")}</dt>
              <dd dir="auto">
                <bdi>
                  {number(props.locale, +amount || 0, {
                    style: "currency",
                    currency: "EGP",
                  })}
                </bdi>
              </dd>
            </div>
            <div>
              <dt>{t("Decimal", "عدد عشري", "Décimale")}</dt>
              <dd>
                <bdi>
                  {number(props.locale, +gpa || 0, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </bdi>
              </dd>
            </div>
            <div>
              <dt>{t("Percentage", "النسبة", "Pourcentage")}</dt>
              <dd>
                <bdi>
                  {number(props.locale, percent / 100, { style: "percent" })}
                </bdi>
              </dd>
            </div>
            <div>
              <dt>{t("Credits", "الساعات", "Crédits")}</dt>
              <dd>{number(props.locale, credits)}</dd>
            </div>
          </dl>
          <Field
            label={t(
              "Unformatted identifier",
              "معرف دون تنسيق",
              "Identifiant non formaté",
            )}
          >
            <input
              className="input"
              dir="ltr"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
            />
          </Field>
          <div className="result-box">
            {t("Record", "السجل", "Dossier")}: <bdi>{identifier}</bdi> ·{" "}
            {number(props.locale, 12345.67)}
          </div>
          <p className="muted">
            {t(
              "Quantities use international digits. Identifiers keep their original characters.",
              "تستخدم الكميات الأرقام الدولية. تحتفظ المعرفات بأحرفها الأصلية.",
              "Les quantités utilisent les chiffres internationaux. Les identifiants gardent leurs caractères.",
            )}
          </p>
        </Panel>
      </div>
    </ComponentFrame>
  );
}

export function BadgesDemo(props: DemoProps) {
  const t = useLabels(props);
  const [tags, setTags] = useState(["CSE-201", "MAT-204", "ENG-101"]);
  const [filter, setFilter] = useState("all");
  const [count, setCount] = useState(3);
  const states = [
    { tone: "neutral" as const, label: t("Draft", "مسودة", "Brouillon") },
    { tone: "info" as const, label: t("Submitted", "مقدم", "Soumis") },
    {
      tone: "warning" as const,
      label: t("Needs review", "يحتاج إلى مراجعة", "À vérifier"),
    },
    { tone: "success" as const, label: t("Approved", "معتمد", "Approuvé") },
    { tone: "danger" as const, label: t("Rejected", "مرفوض", "Refusé") },
  ];
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="badges-semantic-status">
            {t("Semantic status", "حالة ذات دلالة", "Statut sémantique")}
          </span>
        }
      >
        <div className="toolbar">
          {states.map((item) => (
            <Badge key={item.tone} tone={item.tone}>
              {item.label}
            </Badge>
          ))}
        </div>
        <p className="muted">
          {t(
            "Each status includes an icon and a text label.",
            "تتضمن كل حالة أيقونة ونصًا.",
            "Chaque statut comprend une icône et un texte.",
          )}
        </p>
      </Panel>
      <Panel
        title={
          <span data-specimen="badges-tags-chips-and-counts">
            {t(
              "Tags, chips, and counts",
              "الوسوم والمرشحات والأعداد",
              "Étiquettes, filtres et compteurs",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          <div className="toolbar">
            {tags.map((tag) => (
              <span className="component-tag" key={tag}>
                <bdi>{tag}</bdi>
                <Button
                  variant="ghost"
                  aria-label={`${t("Remove", "حذف", "Supprimer")} ${tag}`}
                  onClick={() => setTags(tags.filter((value) => value !== tag))}
                >
                  <X size={16} />
                </Button>
              </span>
            ))}
            <Button
              variant="secondary"
              onClick={() => setTags(["CSE-201", "MAT-204", "ENG-101"])}
            >
              {t("Restore tags", "استعادة الوسوم", "Restaurer")}
            </Button>
          </div>
          <div
            className="toolbar"
            aria-label={t(
              "Status filters",
              "مرشحات الحالة",
              "Filtres de statut",
            )}
          >
            {[
              ["all", t("All", "الكل", "Tous")],
              ["active", t("Active", "نشط", "Actifs")],
              ["archived", t("Archived", "مؤرشف", "Archivés")],
            ].map(([value, label]) => (
              <Button
                key={value}
                variant={filter === value ? "primary" : "secondary"}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="toolbar">
            <Button variant="secondary" onClick={() => setCount(count + 1)}>
              <Mail size={20} />
              {t("Inbox", "الوارد", "Boîte de réception")}{" "}
              <Badge>{number(props.locale, count)}</Badge>
            </Button>
            <Button variant="ghost" onClick={() => setCount(0)}>
              {t("Mark all read", "تحديد الكل كمقروء", "Tout marquer comme lu")}
            </Button>
            <span className="component-status-dot" />
            {t("Available", "متاح", "Disponible")}
          </div>
          <output className="result-box">
            {t("Selected filter", "المرشح المحدد", "Filtre sélectionné")}:{" "}
            {filter} · {number(props.locale, tags.length)}{" "}
            {t("tags", "وسوم", "étiquettes")}
          </output>
        </div>
      </Panel>
    </ComponentFrame>
  );
}

export function IdentityDemo(props: DemoProps) {
  const t = useLabels(props);
  const [profile, setProfile] = useState(false);
  const [presence, setPresence] = useState("available");
  const [image, setImage] = useState(true);
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="identity-avatar-and-presence">
            {t("Avatar and presence", "الصورة والحضور", "Avatar et présence")}
          </span>
        }
      >
        <div className="toolbar">
          <span className="component-avatar component-avatar-large">
            {image ? "MH" : <User size={24} />}
          </span>
          <div>
            <h3>{t("Mariam Hassan", "مريم حسن", "Mariam Hassan")}</h3>
            <p className="muted">
              <bdi>EJ-2026-0042</bdi> ·{" "}
              {t(
                "Engineering student",
                "طالبة هندسة",
                "Étudiante en ingénierie",
              )}
            </p>
            <Badge
              tone={
                presence === "available"
                  ? "success"
                  : presence === "busy"
                    ? "warning"
                    : "neutral"
              }
            >
              {presence === "available"
                ? t("Available", "متاح", "Disponible")
                : presence === "busy"
                  ? t("Busy", "مشغول", "Occupée")
                  : t("Offline", "غير متصل", "Hors ligne")}
            </Badge>
          </div>
        </div>
        <div className="toolbar">
          <Button variant="secondary" onClick={() => setImage(!image)}>
            {t(
              "Toggle fallback",
              "تبديل الصورة البديلة",
              "Basculer le remplacement",
            )}
          </Button>
          <label className="check-label">
            {t("Presence", "الحضور", "Présence")}
            <select
              className="input"
              value={presence}
              onChange={(event) => setPresence(event.target.value)}
            >
              <option value="available">
                {t("Available", "متاح", "Disponible")}
              </option>
              <option value="busy">{t("Busy", "مشغول", "Occupée")}</option>
              <option value="offline">
                {t("Offline", "غير متصل", "Hors ligne")}
              </option>
            </select>
          </label>
          <Button onClick={() => setProfile(true)}>
            {t("Open profile", "فتح الملف", "Ouvrir le profil")}
          </Button>
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="identity-avatar-sizes-and-groups">
            {t(
              "Avatar sizes and groups",
              "أحجام الصور والمجموعات",
              "Tailles et groupes",
            )}
          </span>
        }
      >
        <div className="toolbar">
          <span className="component-avatar component-avatar-small">AK</span>
          <span className="component-avatar">YN</span>
          <span className="component-avatar component-avatar-large">FA</span>
          <div
            className="component-avatar-group"
            aria-label={t(
              "Academic review team, 5 members",
              "فريق المراجعة الأكاديمية، 5 أعضاء",
              "Équipe de révision, 5 membres",
            )}
          >
            {["MH", "AK", "YN"].map((value) => (
              <span className="component-avatar" key={value}>
                {value}
              </span>
            ))}
            <Button
              className="component-avatar"
              variant="secondary"
              onClick={() =>
                props.notify(
                  t(
                    "Team: Mariam, Ahmed, Youssef, Farah, Omar",
                    "الفريق: مريم، أحمد، يوسف، فرح، عمر",
                    "Équipe : Mariam, Ahmed, Youssef, Farah, Omar",
                  ),
                )
              }
            >
              +{number(props.locale, 2)}
            </Button>
          </div>
        </div>
      </Panel>
      <Panel
        title={
          <span data-specimen="identity-record-header-and-description-list">
            {t(
              "Record header and metadata",
              "عنوان السجل وبياناته",
              "En-tête et métadonnées du dossier",
            )}
          </span>
        }
      >
        <header className="toolbar">
          <h3>
            {t(
              "Sample academic record",
              "سجل أكاديمي تجريبي",
              "Dossier universitaire exemple",
            )}
          </h3>
          <Badge tone="success">
            {t("Verified sample", "مثال موثق", "Exemple vérifié")}
          </Badge>
        </header>
        <dl className="component-description-list">
          <div>
            <dt>
              {t("Record identifier", "معرف السجل", "Identifiant du dossier")}
            </dt>
            <dd>
              <bdi>EJ-2026-0042</bdi>
            </dd>
          </div>
          <div>
            <dt>
              {t(
                "Academic period",
                "الفترة الأكاديمية",
                "Période universitaire",
              )}
            </dt>
            <dd>{t("Autumn 2026", "خريف 2026", "Automne 2026")}</dd>
          </div>
          <div>
            <dt>
              {t("Completed credits", "الساعات المكتملة", "Crédits acquis")}
            </dt>
            <dd>{number(props.locale, 42)}</dd>
          </div>
          <div>
            <dt>{t("Last review", "آخر مراجعة", "Dernière vérification")}</dt>
            <dd>
              <bdi>2026-10-27</bdi>
            </dd>
          </div>
        </dl>
      </Panel>
      <ModalExample
        open={profile}
        onClose={() => setProfile(false)}
        title={t("Student profile", "ملف الطالب", "Profil étudiant")}
        locale={props.locale}
      >
        <div className="demo-stack">
          <Badge tone="success">{t("Enrolled", "مقيد", "Inscrite")}</Badge>
          <p>
            {t(
              "Mariam Hassan · Computer Engineering · Year 2",
              "مريم حسن · هندسة الحاسبات · السنة 2",
              "Mariam Hassan · Génie informatique · Année 2",
            )}
          </p>
          <p>
            <bdi>EJ-2026-0042</bdi>
          </p>
          <Button
            onClick={() => {
              setProfile(false);
              props.notify(
                t("Profile reviewed", "تمت مراجعة الملف", "Profil vérifié"),
                "success",
              );
            }}
          >
            {t("Mark reviewed", "تحديد كمراجع", "Marquer comme vérifié")}
          </Button>
        </div>
      </ModalExample>
    </ComponentFrame>
  );
}
