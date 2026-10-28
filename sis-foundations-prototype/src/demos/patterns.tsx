import { useEffect, useId, useState, type ReactNode } from "react";
import {
  ChevronRight,
  FileCheck2,
  FileUp,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  type DemoProps,
  type DemoRenderer,
  Button,
  Panel,
  Badge,
  Callout,
  Field,
  ModalExample,
  Disclosure,
  tr,
  number,
  copyText,
  download,
} from "../shared";
import "./patterns.css";

type Translator = (en: string, ar: string, fr: string) => string;
type SampleState = ReturnType<typeof useSampleState>;
function useSampleState(props: DemoProps) {
  const [recovered, setRecovered] = useState("");
  useEffect(() => {
    setRecovered("");
  }, [props.state]);
  const state = recovered === props.state ? "default" : props.state;
  const t: Translator = (en, ar, fr) => tr(props.locale, en, ar, fr);
  const locked = [
    "pending",
    "loading",
    "denied",
    "unavailable",
    "session-expired",
    "error",
    "disabled",
    "read-only",
  ].includes(state);
  return {
    state,
    t,
    locked,
    empty: state === "empty" || state === "no-results",
    recover: () => {
      setRecovered(props.state);
      props.notify(
        t(
          "Sample data is ready.",
          "البيانات التجريبية جاهزة.",
          "Les données de démonstration sont prêtes.",
        ),
        "success",
      );
    },
  };
}
function StateFeedback({ sample }: { sample: SampleState }) {
  const { state, t, recover } = sample;
  const messages: Record<
    string,
    [string, string, string, string, string, string]
  > = {
    pending: [
      "The sample request is pending. Your input remains available.",
      "الطلب التجريبي قيد الانتظار. تبقى مدخلاتك محفوظة.",
      "La demande de démonstration est en attente. Votre saisie reste disponible.",
      "Complete sample request",
      "إكمال الطلب التجريبي",
      "Terminer la demande de démonstration",
    ],
    loading: [
      "The sample data is loading. Your input remains available.",
      "جار تحميل البيانات التجريبية. تبقى مدخلاتك محفوظة.",
      "Les données de démonstration se chargent. Votre saisie reste disponible.",
      "Complete sample load",
      "إكمال التحميل التجريبي",
      "Terminer le chargement",
    ],
    empty: [
      "This sample has no records. Load the built-in data to continue.",
      "لا توجد سجلات في هذا المثال. حمّل البيانات المضمنة للمتابعة.",
      "Cet exemple ne contient aucun enregistrement. Chargez les données intégrées.",
      "Load sample data",
      "تحميل بيانات تجريبية",
      "Charger les données de démonstration",
    ],
    error: [
      "The sample request failed. No local changes were lost.",
      "فشل الطلب التجريبي. لم تفقد تغييراتك المحلية.",
      "La demande de démonstration a échoué. Vos modifications locales sont conservées.",
      "Retry sample request",
      "إعادة محاولة الطلب التجريبي",
      "Réessayer la demande",
    ],
    denied: [
      "This sample role cannot complete the action. No access rule changed.",
      "لا يستطيع هذا الدور التجريبي إكمال الإجراء. لم تتغير أي صلاحية.",
      "Ce rôle de démonstration ne peut pas effectuer cette action. Aucun droit ne change.",
      "Use permitted sample role",
      "استخدام دور تجريبي مسموح",
      "Utiliser un rôle autorisé",
    ],
    conflict: [
      "The sample contains a conflict. Review the marked records before confirmation.",
      "يتضمن المثال تعارضًا. راجع السجلات المحددة قبل التأكيد.",
      "Cet exemple contient un conflit. Examinez les enregistrements signalés avant confirmation.",
      "Clear scenario conflict",
      "مسح تعارض السيناريو",
      "Effacer le conflit du scénario",
    ],
    partial: [
      "Some sample records need attention. Review each record outcome.",
      "تحتاج بعض السجلات التجريبية إلى مراجعة. افحص نتيجة كل سجل.",
      "Certains enregistrements de démonstration demandent une vérification. Consultez chaque résultat.",
      "Reset partial scenario",
      "إعادة ضبط السيناريو الجزئي",
      "Réinitialiser le scénario partiel",
    ],
    unavailable: [
      "The sample service is unavailable. This demo uses no live service.",
      "الخدمة التجريبية غير متاحة. لا يستخدم هذا العرض خدمة حقيقية.",
      "Le service de démonstration est indisponible. Cet exemple ne contacte aucun service réel.",
      "Restore sample service",
      "استعادة الخدمة التجريبية",
      "Rétablir le service de démonstration",
    ],
    "session-expired": [
      "The sample session expired. Your local input remains available.",
      "انتهت الجلسة التجريبية. تبقى مدخلاتك المحلية محفوظة.",
      "La session de démonstration a expiré. Votre saisie locale reste disponible.",
      "Start sample session",
      "بدء جلسة تجريبية",
      "Ouvrir une session de démonstration",
    ],
  };
  if (state === "success")
    return (
      <Callout tone="success">
        {t(
          "The selected sample scenario completed successfully.",
          "اكتمل السيناريو التجريبي المحدد بنجاح.",
          "Le scénario de démonstration sélectionné est terminé.",
        )}
      </Callout>
    );
  const message = messages[state === "no-results" ? "empty" : state];
  if (!message) return null;
  return (
    <Callout
      tone={
        ["error", "denied", "session-expired"].includes(state)
          ? "danger"
          : "warning"
      }
    >
      <div className="pattern-feedback">
        <span>{t(message[0], message[1], message[2])}</span>
        <Button variant="secondary" onClick={recover}>
          {t(message[3], message[4], message[5])}
        </Button>
      </div>
    </Callout>
  );
}
function Pattern({
  props,
  sample,
  children,
}: {
  props: DemoProps;
  sample: SampleState;
  children: ReactNode;
}) {
  return (
    <div
      className="demo-stack pattern-demo"
      aria-busy={["pending", "loading"].includes(sample.state)}
      lang={props.locale}
      dir={props.locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="pattern-sample-label">
        <Badge>
          {sample.t(
            "Interactive sample data",
            "بيانات تجريبية تفاعلية",
            "Données de démonstration interactives",
          )}
        </Badge>
        <span className="muted">
          {sample.t(
            "Local changes only. No SIS record changes.",
            "تغييرات محلية فقط. لا تتغير سجلات النظام.",
            "Modifications locales uniquement. Aucun dossier SIS ne change.",
          )}
        </span>
      </div>
      <StateFeedback sample={sample} />
      {children}
    </div>
  );
}
function Empty({ t }: { t: Translator }) {
  return (
    <p className="pattern-empty">
      {t(
        "No sample records to display.",
        "لا توجد سجلات تجريبية للعرض.",
        "Aucun enregistrement de démonstration à afficher.",
      )}
    </p>
  );
}
function Table({
  children,
  label,
  specimen,
}: {
  children: ReactNode;
  label: string;
  specimen?: string;
}) {
  return (
    <div
      data-specimen={specimen}
      className="pattern-table-scroll"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className="sample-table">{children}</table>
    </div>
  );
}

function BulkDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, state, locked } = sample;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [review, setReview] = useState(false);
  const [outcomes, setOutcomes] = useState<
    Record<string, "updated" | "blocked">
  >({});
  const [resolved, setResolved] = useState<string[]>([]);
  useEffect(() => {
    if (props.specimen === "review") {
      setSelected(["S-1001", "S-1002"]);
      setReview(true);
    }
    if (props.specimen === "retry" || props.specimen === "outcomes")
      setOutcomes({ "S-1001": "updated", "S-1002": "blocked" });
  }, [props.specimen]);
  const rows = [
    { id: "S-1001", name: "Maya Hassan", evidence: true },
    { id: "S-1002", name: "Omar Ali", evidence: false },
    { id: "S-1003", name: "Lina Martin", evidence: true },
    { id: "S-1004", name: "Noah Aziz", evidence: true },
  ];
  const available = sample.empty ? [] : rows;
  const shown = available.filter(
    (row) =>
      `${row.name} ${row.id}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" ||
        (filter === "ready"
          ? row.evidence || resolved.includes(row.id)
          : !row.evidence && !resolved.includes(row.id))),
  );
  const outcome = (id: string) =>
    outcomes[id] ??
    (state === "partial"
      ? id === "S-1002"
        ? "blocked"
        : id === "S-1001"
          ? "updated"
          : undefined
      : state === "success"
        ? "updated"
        : undefined);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  function apply() {
    setOutcomes((current) => ({
      ...current,
      ...Object.fromEntries(
        rows
          .filter((row) => selected.includes(row.id))
          .map((row) => [
            row.id,
            row.evidence || resolved.includes(row.id) ? "updated" : "blocked",
          ]),
      ),
    }));
    setReview(false);
    props.notify(
      t(
        "Review the result for each selected sample record.",
        "راجع نتيجة كل سجل تجريبي محدد.",
        "Consultez le résultat de chaque enregistrement sélectionné.",
      ),
      "info",
    );
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Bulk record update",
          "تحديث مجموعة سجلات",
          "Modification de plusieurs dossiers",
        )}
      >
        <div className="toolbar pattern-toolbar" data-specimen="filters">
          <Field
            label={t(
              "Find a sample student",
              "البحث عن طالب تجريبي",
              "Rechercher un étudiant de démonstration",
            )}
          >
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="S-1001"
            />
          </Field>
          <Field
            label={t(
              "Evidence filter",
              "تصفية الأدلة",
              "Filtre des justificatifs",
            )}
          >
            <select
              className="input"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">
                {t("All records", "كل السجلات", "Tous les dossiers")}
              </option>
              <option value="ready">{t("Ready", "جاهز", "Prêts")}</option>
              <option value="review">
                {t("Needs evidence", "يحتاج إلى دليل", "Justificatif requis")}
              </option>
            </select>
          </Field>
          <Button
            data-specimen="review"
            disabled={selected.length === 0 || locked || sample.empty}
            onClick={() => setReview(true)}
          >
            {t("Review selected", "مراجعة المحدد", "Vérifier la sélection")} (
            {number(props.locale, selected.length)})
          </Button>
        </div>
        <p className="muted">
          {t(
            "Sample operation: mark each selected record as reviewed. A missing sample document blocks that record.",
            "الإجراء التجريبي: تحديد السجلات كمراجعة. يمنع المستند المفقود تحديث السجل المعني.",
            "Action de démonstration : marquer les dossiers comme vérifiés. Un document absent bloque le dossier concerné.",
          )}
        </p>
        {shown.length === 0 ? (
          <Empty t={t} />
        ) : (
          <Table
            specimen="selection"
            label={t(
              "Bulk sample records",
              "سجلات التحديث التجريبي",
              "Dossiers de modification",
            )}
          >
            <thead>
              <tr>
                <th>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={shown.every((row) => selected.includes(row.id))}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [
                                ...new Set([
                                  ...current,
                                  ...shown.map((row) => row.id),
                                ]),
                              ]
                            : current.filter(
                                (id) => !shown.some((row) => row.id === id),
                              ),
                        )
                      }
                    />
                    {t(
                      "Select visible",
                      "تحديد الظاهر",
                      "Sélectionner les lignes visibles",
                    )}
                  </label>
                </th>
                <th>{t("Student", "الطالب", "Étudiant")}</th>
                <th>{t("Evidence", "الدليل", "Justificatif")}</th>
                <th data-specimen="outcomes">
                  {t("Record outcome", "نتيجة السجل", "Résultat du dossier")}
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id}>
                  <td>
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                      />
                      <bdi>{row.id}</bdi>
                    </label>
                  </td>
                  <td>{row.name}</td>
                  <td>
                    <Badge
                      tone={
                        row.evidence || resolved.includes(row.id)
                          ? "success"
                          : "warning"
                      }
                    >
                      {row.evidence || resolved.includes(row.id)
                        ? t("Available", "متاح", "Disponible")
                        : t(
                            "Missing sample document",
                            "مستند تجريبي مفقود",
                            "Document de démonstration absent",
                          )}
                    </Badge>
                  </td>
                  <td data-specimen={row.id === "S-1002" ? "retry" : undefined}>
                    {outcome(row.id) === "updated" ? (
                      <Badge tone="success">
                        {t("Updated", "تم التحديث", "Modifié")}
                      </Badge>
                    ) : outcome(row.id) === "blocked" ? (
                      <div className="pattern-actions">
                        <Badge tone="danger">
                          {t(
                            "Needs evidence",
                            "يحتاج إلى دليل",
                            "Justificatif requis",
                          )}
                        </Badge>
                        <Button
                          variant="secondary"
                          disabled={locked}
                          onClick={() => {
                            setResolved((current) => [...current, row.id]);
                            setOutcomes((current) => ({
                              ...current,
                              [row.id]: "updated",
                            }));
                          }}
                        >
                          {t(
                            "Add sample evidence and retry",
                            "إضافة دليل تجريبي وإعادة المحاولة",
                            "Ajouter un justificatif et réessayer",
                          )}
                        </Button>
                      </div>
                    ) : (
                      t("Not processed", "لم تتم المعالجة", "Non traité")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      <ModalExample
        open={review}
        onClose={() => setReview(false)}
        title={t(
          "Review bulk update",
          "مراجعة تحديث المجموعة",
          "Vérifier la modification groupée",
        )}
        locale={props.locale}
      >
        <p>
          {t(
            "The demo processes each selected record separately.",
            "يعالج العرض كل سجل محدد على حدة.",
            "La démonstration traite chaque dossier sélectionné séparément.",
          )}
        </p>
        <ul>
          {rows
            .filter((row) => selected.includes(row.id))
            .map((row) => (
              <li key={row.id}>
                <bdi>{row.id}</bdi> · {row.name} ·{" "}
                {row.evidence || resolved.includes(row.id)
                  ? t("Will update", "سيتم التحديث", "Modification possible")
                  : t(
                      "Will need evidence",
                      "سيحتاج إلى دليل",
                      "Justificatif nécessaire",
                    )}
              </li>
            ))}
        </ul>
        <div className="pattern-actions">
          <Button onClick={apply} disabled={locked}>
            {t(
              "Apply sample update",
              "تطبيق التحديث التجريبي",
              "Appliquer la modification de démonstration",
            )}
          </Button>
          <Button variant="secondary" onClick={() => setReview(false)}>
            {t(
              "Return to selection",
              "العودة إلى التحديد",
              "Revenir à la sélection",
            )}
          </Button>
        </div>
      </ModalExample>
    </Pattern>
  );
}

function WizardDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const uid = useId();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [programme, setProgramme] = useState("engineering");
  const [term, setTerm] = useState("2027-01");
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (!props.specimen) return;
    setSubmitted(props.specimen === "submission");
    if (
      ["details", "retention", "review", "submission"].includes(props.specimen)
    )
      setEmail((current) => current || "maya@example.test");
    if (props.specimen === "details" || props.specimen === "retention")
      setStep(1);
    if (props.specimen === "review") {
      setStep(2);
      setChecked(true);
    }
    if (props.specimen === "submission") setSubmitted(true);
  }, [props.specimen]);
  const steps = [
    t("Contact", "التواصل", "Contact"),
    t("Study details", "بيانات الدراسة", "Études"),
    t("Review", "المراجعة", "Vérification"),
  ];
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const programmeLabel =
    programme === "engineering"
      ? t("Engineering", "الهندسة", "Ingénierie")
      : t("Business", "إدارة الأعمال", "Gestion");
  function next() {
    if ((step === 0 && !validEmail) || (step === 1 && !checked)) {
      setErrors(true);
      return;
    }
    setErrors(false);
    setStep((current) => current + 1);
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Application wizard",
          "خطوات طلب الالتحاق",
          "Assistant de candidature",
        )}
      >
        <ol
          className="pattern-step-list"
          aria-label={t(
            "Application steps",
            "خطوات الطلب",
            "Étapes de candidature",
          )}
        >
          {steps.map((label, index) => (
            <li
              data-specimen={["contact", "details", "review"][index]}
              key={index}
              aria-current={step === index ? "step" : undefined}
            >
              <span>{number(props.locale, index + 1)}</span>
              {label}
              {index < 2 && <ChevronRight size={16} aria-hidden="true" />}
            </li>
          ))}
        </ol>
        {submitted || sample.state === "success" ? (
          <div className="result-box" data-specimen="submission">
            <Badge tone="success">
              {t(
                "Sample application submitted",
                "تم إرسال الطلب التجريبي",
                "Candidature de démonstration envoyée",
              )}
            </Badge>
            <p>
              {t("Local receipt", "إيصال محلي", "Reçu local")}:{" "}
              <bdi>DEMO-2027-014</bdi>
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                if (sample.state === "success") sample.recover();
              }}
            >
              {t(
                "Edit retained details",
                "تعديل البيانات المحفوظة",
                "Modifier les informations conservées",
              )}
            </Button>
          </div>
        ) : (
          <form
            data-specimen="retention"
            onSubmit={(event) => {
              event.preventDefault();
              if (step < 2) next();
              else {
                setSubmitted(true);
                props.notify(
                  t(
                    "The sample application is saved locally.",
                    "تم حفظ الطلب التجريبي محليًا.",
                    "La candidature de démonstration est enregistrée localement.",
                  ),
                  "success",
                );
              }
            }}
            noValidate
            className="demo-stack"
          >
            {step === 0 && (
              <div className="demo-grid">
                <Field
                  label={t(
                    "Email address",
                    "البريد الإلكتروني",
                    "Adresse électronique",
                  )}
                  error={
                    errors && !validEmail ? (
                      <span id={`${uid}-email`}>
                        {t(
                          "Enter a valid email address.",
                          "أدخل بريدًا إلكترونيًا صحيحًا.",
                          "Saisissez une adresse électronique valide.",
                        )}
                      </span>
                    ) : undefined
                  }
                >
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={errors && !validEmail}
                    aria-describedby={
                      errors && !validEmail ? `${uid}-email` : undefined
                    }
                    autoComplete="email"
                  />
                </Field>
                <Field
                  label={t(
                    "Sample programme",
                    "البرنامج التجريبي",
                    "Programme de démonstration",
                  )}
                >
                  <select
                    className="input"
                    value={programme}
                    onChange={(event) => setProgramme(event.target.value)}
                  >
                    <option value="engineering">
                      {t("Engineering", "الهندسة", "Ingénierie")}
                    </option>
                    <option value="business">
                      {t("Business", "إدارة الأعمال", "Gestion")}
                    </option>
                  </select>
                </Field>
              </div>
            )}
            {step === 1 && (
              <>
                <Field
                  label={t("Entry term", "فصل الالتحاق", "Période d’entrée")}
                >
                  <select
                    className="input"
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                  >
                    <option value="2027-01">
                      {t("January 2027", "يناير 2027", "Janvier 2027")}
                    </option>
                    <option value="2027-09">
                      {t("September 2027", "سبتمبر 2027", "Septembre 2027")}
                    </option>
                  </select>
                </Field>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    aria-describedby={
                      errors && !checked ? `${uid}-review` : undefined
                    }
                  />
                  {t(
                    "I reviewed these sample details.",
                    "راجعت هذه البيانات التجريبية.",
                    "J’ai vérifié ces informations de démonstration.",
                  )}
                </label>
                {errors && !checked && (
                  <p id={`${uid}-review`} className="field-error" role="alert">
                    {t(
                      "Confirm the sample details before review.",
                      "أكد البيانات التجريبية قبل المراجعة.",
                      "Confirmez les informations avant la vérification.",
                    )}
                  </p>
                )}
              </>
            )}
            {step === 2 && (
              <dl className="pattern-summary">
                <div>
                  <dt>
                    {t("Email", "البريد الإلكتروني", "Adresse électronique")}
                  </dt>
                  <dd>
                    <bdi>{email}</bdi>
                  </dd>
                </div>
                <div>
                  <dt>{t("Programme", "البرنامج", "Programme")}</dt>
                  <dd>{programmeLabel}</dd>
                </div>
                <div>
                  <dt>{t("Entry term", "فصل الالتحاق", "Période d’entrée")}</dt>
                  <dd>
                    <bdi>{term}</bdi>
                  </dd>
                </div>
              </dl>
            )}
            <div className="pattern-actions">
              {step > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setErrors(false);
                    setStep((current) => current - 1);
                  }}
                >
                  {t("Back", "السابق", "Retour")}
                </Button>
              )}
              <Button
                data-specimen="submission"
                type="submit"
                disabled={locked || sample.empty}
              >
                {step === 2
                  ? t(
                      "Submit sample application",
                      "إرسال الطلب التجريبي",
                      "Envoyer la candidature de démonstration",
                    )
                  : t("Continue", "متابعة", "Continuer")}
              </Button>
            </div>
          </form>
        )}
      </Panel>
    </Pattern>
  );
}

type ImportRow = { values: string[]; excluded: boolean };
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}
function ImportDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const [headers, setHeaders] = useState(["student_id", "name", "credits"]);
  const [rows, setRows] = useState<ImportRow[]>([
    { values: ["S-1001", "Maya Hassan", "3"], excluded: false },
    { values: ["S-1002", "Omar Ali", "six"], excluded: false },
    { values: ["S-1003", "Lina Martin", "4"], excluded: false },
  ]);
  const [mapping, setMapping] = useState([0, 1, 2]);
  const [source, setSource] = useState("sample.csv");
  const [validated, setValidated] = useState(false);
  const [imported, setImported] = useState<number | null>(null);
  const [fileError, setFileError] = useState("");
  useEffect(() => {
    if (["validation", "exclusion", "retry"].includes(props.specimen || ""))
      setValidated(true);
    if (props.specimen === "outcome") {
      setRows((current) =>
        current.map((row, index) => ({ ...row, excluded: index === 1 })),
      );
      setValidated(true);
      setImported(2);
    }
  }, [props.specimen]);
  const labels = [
    t("Student ID", "رقم الطالب", "Identifiant étudiant"),
    t("Name", "الاسم", "Nom"),
    t("Credits", "الساعات المعتمدة", "Crédits"),
  ];
  const mappingValid =
    new Set(mapping).size === 3 &&
    mapping.every((index) => index >= 0 && index < headers.length);
  const rowErrors = (row: ImportRow, index: number) => {
    const issues: string[] = [];
    if (!row.values[mapping[0]])
      issues.push(
        t(
          "Student ID is required.",
          "رقم الطالب مطلوب.",
          "L’identifiant étudiant est obligatoire.",
        ),
      );
    if (!row.values[mapping[1]])
      issues.push(
        t("Name is required.", "الاسم مطلوب.", "Le nom est obligatoire."),
      );
    const credits = Number(row.values[mapping[2]]);
    if (!row.values[mapping[2]] || !Number.isFinite(credits) || credits <= 0)
      issues.push(
        t(
          "Credits must be a positive number.",
          "يجب أن تكون الساعات رقمًا موجبًا.",
          "Les crédits doivent être un nombre positif.",
        ),
      );
    if (
      rows.some(
        (other, otherIndex) =>
          otherIndex < index &&
          !other.excluded &&
          other.values[mapping[0]] === row.values[mapping[0]],
      )
    )
      issues.push(
        t(
          "Duplicate student ID.",
          "رقم طالب مكرر.",
          "Identifiant étudiant en double.",
        ),
      );
    return issues;
  };
  const validCount = rows.filter(
    (row, index) => !row.excluded && rowErrors(row, index).length === 0,
  ).length;
  const invalidCount = rows.filter(
    (row, index) => !row.excluded && rowErrors(row, index).length > 0,
  ).length;
  function loadSample() {
    setHeaders(["student_id", "name", "credits"]);
    setRows([
      { values: ["S-1001", "Maya Hassan", "3"], excluded: false },
      { values: ["S-1002", "Omar Ali", "six"], excluded: false },
      { values: ["S-1003", "Lina Martin", "4"], excluded: false },
    ]);
    setMapping([0, 1, 2]);
    setSource("sample.csv");
    setValidated(false);
    setImported(null);
    setFileError("");
    if (sample.empty) sample.recover();
  }
  async function loadFile(file?: File) {
    if (!file) return;
    if (file.size > 100000) {
      setFileError("size");
      return;
    }
    try {
      const parsed = parseCsv(await file.text());
      if (parsed.length < 2 || parsed[0].length < 3 || parsed.length > 101)
        throw new Error("shape");
      setHeaders(parsed[0]);
      setRows(parsed.slice(1).map((values) => ({ values, excluded: false })));
      setMapping([0, 1, 2]);
      setSource(file.name);
      setValidated(false);
      setImported(null);
      setFileError("");
      if (sample.empty) sample.recover();
    } catch {
      setFileError("shape");
    }
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Import sample records",
          "استيراد سجلات تجريبية",
          "Importer des dossiers de démonstration",
        )}
      >
        <div className="pattern-actions" data-specimen="source">
          <Button variant="secondary" onClick={loadSample}>
            <FileUp size={20} aria-hidden="true" />
            {t(
              "Load sample CSV",
              "تحميل CSV تجريبي",
              "Charger le CSV de démonstration",
            )}
          </Button>
          <Field
            label={t(
              "Choose a CSV file",
              "اختيار ملف CSV",
              "Choisir un fichier CSV",
            )}
            hint={t(
              "Local preview only. Up to 100 rows and 100 KB.",
              "معاينة محلية فقط. حتى 100 صف و100 كيلوبايت.",
              "Aperçu local uniquement. Maximum : 100 lignes et 100 Ko.",
            )}
          >
            <input
              className="input"
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => void loadFile(event.target.files?.[0])}
            />
          </Field>
        </div>
        {fileError && (
          <Callout tone="danger">
            {fileError === "size"
              ? t(
                  "Use a CSV file below 100 KB.",
                  "استخدم ملف CSV أصغر من 100 كيلوبايت.",
                  "Utilisez un fichier CSV inférieur à 100 Ko.",
                )
              : t(
                  "Use a CSV with a header, three columns, and 1 to 100 data rows.",
                  "استخدم CSV بعناوين وثلاثة أعمدة و1 إلى 100 صف بيانات.",
                  "Utilisez un CSV avec un en-tête, trois colonnes et 1 à 100 lignes.",
                )}
          </Callout>
        )}
        <p className="muted">
          {t("Source", "المصدر", "Source")}: <bdi>{source}</bdi>
        </p>
        {sample.empty ? (
          <Empty t={t} />
        ) : (
          <>
            <div className="demo-grid" data-specimen="mapping">
              {labels.map((label, index) => (
                <Field key={index} label={label}>
                  <select
                    className="input"
                    value={mapping[index]}
                    onChange={(event) => {
                      setMapping((current) =>
                        current.map((value, item) =>
                          item === index ? Number(event.target.value) : value,
                        ),
                      );
                      setValidated(false);
                      setImported(null);
                    }}
                  >
                    {headers.map((header, column) => (
                      <option value={column} key={column}>
                        {header}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </div>
            {!mappingValid && (
              <Callout tone="danger">
                {t(
                  "Map each field to a different source column.",
                  "اربط كل حقل بعمود مصدر مختلف.",
                  "Associez chaque champ à une colonne différente.",
                )}
              </Callout>
            )}
            <div className="pattern-actions">
              <Button
                data-specimen="validation"
                variant="secondary"
                disabled={!mappingValid || locked}
                onClick={() => {
                  setValidated(true);
                  setImported(null);
                }}
              >
                {t("Validate rows", "التحقق من الصفوف", "Vérifier les lignes")}
              </Button>
              {validated && (
                <Button
                  disabled={invalidCount > 0 || validCount === 0 || locked}
                  onClick={() => setImported(validCount)}
                >
                  {t(
                    "Import valid rows",
                    "استيراد الصفوف الصحيحة",
                    "Importer les lignes valides",
                  )}{" "}
                  ({number(props.locale, validCount)})
                </Button>
              )}
              <Button
                data-specimen="retry"
                variant="secondary"
                disabled={!validated || invalidCount === 0 || locked}
                onClick={() => {
                  setRows((current) =>
                    current.map((row, index) => {
                      const values = [...row.values];
                      if (rowErrors(row, index).length > 0) {
                        values[mapping[0]] = `S-RETRY-${index + 1}`;
                        values[mapping[1]] ||= "Demo Student";
                        values[mapping[2]] = "3";
                      }
                      return { ...row, values };
                    }),
                  );
                  setImported(null);
                }}
              >
                {t(
                  "Correct sample errors and retry",
                  "تصحيح الأخطاء التجريبية وإعادة المحاولة",
                  "Corriger les erreurs de démonstration et réessayer",
                )}
              </Button>
            </div>
            {validated && (
              <p>
                {t(
                  "Exclude invalid rows or correct the sample errors before import.",
                  "استبعد الصفوف غير الصحيحة أو صحح الأخطاء التجريبية قبل الاستيراد.",
                  "Excluez les lignes invalides ou corrigez les erreurs avant l’importation.",
                )}
              </p>
            )}
            <Table
              specimen="exclusion"
              label={t(
                "Import preview",
                "معاينة الاستيراد",
                "Aperçu de l’importation",
              )}
            >
              <thead>
                <tr>
                  <th>{t("Row", "الصف", "Ligne")}</th>
                  {labels.map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                  <th>{t("Validation", "التحقق", "Vérification")}</th>
                  <th>{t("Exclude", "استبعاد", "Exclure")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={row.excluded ? "pattern-row-excluded" : ""}
                  >
                    <td>{number(props.locale, index + 1)}</td>
                    {mapping.map((column, field) => (
                      <td key={field}>
                        <bdi>{row.values[column] || "—"}</bdi>
                      </td>
                    ))}
                    <td>
                      {validated ? (
                        row.excluded ? (
                          <Badge>{t("Excluded", "مستبعد", "Exclue")}</Badge>
                        ) : rowErrors(row, index).length ? (
                          <span className="field-error">
                            {rowErrors(row, index).join(" ")}
                          </span>
                        ) : (
                          <Badge tone="success">
                            {t("Valid", "صحيح", "Valide")}
                          </Badge>
                        )
                      ) : (
                        t("Awaiting validation", "بانتظار التحقق", "À vérifier")
                      )}
                    </td>
                    <td>
                      <label className="check-label">
                        <input
                          type="checkbox"
                          checked={row.excluded}
                          onChange={(event) => {
                            setRows((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, excluded: event.target.checked }
                                  : item,
                              ),
                            );
                            setImported(null);
                          }}
                          aria-label={`${t("Exclude row", "استبعاد الصف", "Exclure la ligne")} ${number(props.locale, index + 1)}`}
                        />
                        <span>{t("Exclude", "استبعاد", "Exclure")}</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div data-specimen="outcome">
              {imported !== null ? (
                <Callout tone="success">
                  {number(props.locale, imported)}{" "}
                  {t(
                    "sample rows imported locally. The source file did not change.",
                    "صفوف تجريبية تم استيرادها محليًا. لم يتغير الملف المصدر.",
                    "lignes de démonstration importées localement. Le fichier source reste inchangé.",
                  )}
                </Callout>
              ) : (
                <p className="muted">
                  {t(
                    "No sample rows imported yet.",
                    "لم تستورد صفوف تجريبية بعد.",
                    "Aucune ligne de démonstration importée pour le moment.",
                  )}
                </p>
              )}
            </div>
          </>
        )}
      </Panel>
    </Pattern>
  );
}

function ApprovalsDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const uid = useId();
  const [evidence, setEvidence] = useState(false);
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (props.specimen) setOpen(props.specimen === "evidence");
    if (props.specimen === "reason") setError("reason");
    if (props.specimen === "changes" || props.specimen === "decision") {
      setReason(
        (current) =>
          current ||
          t(
            "Sample course evidence reviewed.",
            "تمت مراجعة دليل المقرر التجريبي.",
            "Justificatif du cours de démonstration consulté.",
          ),
      );
      setEvidence(true);
      setDecision(props.specimen === "changes" ? "changes" : "approved");
    }
  }, [props.specimen]);
  function decide(value: string) {
    if (!reason.trim()) {
      setError("reason");
      return;
    }
    if (value === "approved" && !evidence) {
      setError("evidence");
      return;
    }
    setError("");
    setDecision(value);
  }
  const decisionLabel =
    decision === "approved"
      ? t("Approved sample", "تمت الموافقة التجريبية", "Exemple approuvé")
      : decision === "changes"
        ? t("Changes requested", "تم طلب تغييرات", "Modifications demandées")
        : t("Declined sample", "تم رفض المثال", "Exemple refusé");
  return (
    <Pattern props={props} sample={sample}>
      <div className="demo-grid" data-specimen="request">
        <Panel
          title={t(
            "Review a sample request",
            "مراجعة طلب تجريبي",
            "Examiner une demande de démonstration",
          )}
        >
          <dl className="pattern-summary">
            <div>
              <dt>{t("Request", "الطلب", "Demande")}</dt>
              <dd>
                <bdi>REQ-2041</bdi>
              </dd>
            </div>
            <div>
              <dt>{t("Student", "الطالب", "Étudiant")}</dt>
              <dd>Maya Hassan</dd>
            </div>
            <div>
              <dt>{t("Request type", "نوع الطلب", "Type de demande")}</dt>
              <dd>
                {t(
                  "Course substitution",
                  "استبدال مقرر",
                  "Remplacement de cours",
                )}
              </dd>
            </div>
          </dl>
          <Disclosure
            title={t(
              "Evidence list",
              "قائمة الأدلة",
              "Liste des justificatifs",
            )}
            initial
          >
            <div className="pattern-actions" data-specimen="evidence">
              <FileCheck2 size={20} aria-hidden="true" />
              <span>
                {t(
                  "Sample transcript and course outline",
                  "كشف درجات ووصف مقرر تجريبيان",
                  "Relevé et programme de cours de démonstration",
                )}
              </span>
              <Button variant="secondary" onClick={() => setOpen(true)}>
                {t(
                  "Open sample evidence",
                  "فتح الدليل التجريبي",
                  "Consulter le justificatif",
                )}
              </Button>
            </div>
          </Disclosure>
          <label className="check-label">
            <input
              type="checkbox"
              checked={evidence}
              onChange={(event) => setEvidence(event.target.checked)}
            />
            {t(
              "I reviewed the sample evidence.",
              "راجعت الدليل التجريبي.",
              "J’ai consulté le justificatif de démonstration.",
            )}
          </label>
        </Panel>
        <Panel
          title={t(
            "Record a sample decision",
            "تسجيل قرار تجريبي",
            "Enregistrer une décision de démonstration",
          )}
        >
          <Field
            label={t("Decision reason", "سبب القرار", "Motif de la décision")}
            error={
              error ? (
                <span id={`${uid}-reason`}>
                  {error === "reason"
                    ? t(
                        "Enter a reason for the sample decision.",
                        "أدخل سببًا للقرار التجريبي.",
                        "Indiquez le motif de la décision de démonstration.",
                      )
                    : t(
                        "Review the sample evidence before approval.",
                        "راجع الدليل التجريبي قبل الموافقة.",
                        "Consultez le justificatif avant l’approbation.",
                      )}
                </span>
              ) : undefined
            }
          >
            <textarea
              data-specimen="reason"
              className="input"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${uid}-reason` : undefined}
            />
          </Field>
          <div className="pattern-actions">
            <Button
              data-specimen="decision"
              disabled={locked || sample.empty}
              onClick={() => decide("approved")}
            >
              {t(
                "Approve sample",
                "الموافقة على المثال",
                "Approuver l’exemple",
              )}
            </Button>
            <Button
              data-specimen="changes"
              variant="secondary"
              disabled={locked || sample.empty}
              onClick={() => decide("changes")}
            >
              {t(
                "Request changes",
                "طلب تغييرات",
                "Demander des modifications",
              )}
            </Button>
            <Button
              variant="danger"
              disabled={locked || sample.empty}
              onClick={() => decide("declined")}
            >
              {t("Decline sample", "رفض المثال", "Refuser l’exemple")}
            </Button>
          </div>
          {decision && (
            <div className="result-box" role="status">
              <Badge tone={decision === "approved" ? "success" : "warning"}>
                {decisionLabel}
              </Badge>
              <p>{reason}</p>
              {decision === "changes" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDecision("");
                    setEvidence(false);
                    setError("");
                    props.notify(
                      t(
                        "The sample request returned with revised evidence.",
                        "عاد الطلب التجريبي بدليل معدل.",
                        "La demande de démonstration revient avec un justificatif révisé.",
                      ),
                      "info",
                    );
                  }}
                >
                  {t(
                    "Simulate revised submission",
                    "محاكاة إرسال معدل",
                    "Simuler une nouvelle soumission",
                  )}
                </Button>
              )}
            </div>
          )}
        </Panel>
      </div>
      <ModalExample
        open={open}
        onClose={() => setOpen(false)}
        title={t(
          "Sample evidence",
          "دليل تجريبي",
          "Justificatif de démonstration",
        )}
        locale={props.locale}
      >
        <p>
          {t(
            "Demonstration document. It does not establish a university decision rule.",
            "مستند للعرض. لا يحدد قاعدة قرار جامعية.",
            "Document de démonstration. Il ne définit aucune règle universitaire.",
          )}
        </p>
        <dl className="pattern-summary">
          <div>
            <dt>{t("Completed course", "المقرر المكتمل", "Cours terminé")}</dt>
            <dd>
              <bdi>SCI-101</bdi>
            </dd>
          </div>
          <div>
            <dt>{t("Credits", "الساعات المعتمدة", "Crédits")}</dt>
            <dd>{number(props.locale, 3)}</dd>
          </div>
          <div>
            <dt>
              {t(
                "Requested equivalent",
                "المقرر المكافئ المطلوب",
                "Équivalence demandée",
              )}
            </dt>
            <dd>
              <bdi>SCI-102</bdi>
            </dd>
          </div>
        </dl>
        <Button
          onClick={() => {
            setEvidence(true);
            setOpen(false);
          }}
        >
          {t(
            "Mark evidence as reviewed",
            "تحديد الدليل كمراجع",
            "Marquer le justificatif comme consulté",
          )}
        </Button>
      </ModalExample>
    </Pattern>
  );
}

function AccessDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const [role, setRole] = useState("advisor");
  const [scope, setScope] = useState("assigned");
  const [saved, setSaved] = useState({ role: "advisor", scope: "assigned" });
  const [review, setReview] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (props.specimen === "rejection") {
      setReview(false);
      setRole("student");
      setScope("department");
      setError("invalid");
    }
    if (props.specimen === "impact" || props.specimen === "save") {
      setRole("advisor");
      setScope("assigned");
      setReview(true);
      setAcknowledged(false);
    }
  }, [props.specimen]);
  const roles = [
    { id: "student", label: t("Student", "طالب", "Étudiant") },
    { id: "advisor", label: t("Advisor", "مرشد", "Conseiller") },
    {
      id: "registrar",
      label: t("Registrar", "مسؤول التسجيل", "Gestionnaire de scolarité"),
    },
  ];
  const scopes = [
    {
      id: "own",
      label: t(
        "Own sample record",
        "السجل التجريبي الشخصي",
        "Dossier personnel de démonstration",
      ),
    },
    {
      id: "assigned",
      label: t(
        "Assigned sample students",
        "الطلاب التجريبيون المعينون",
        "Étudiants de démonstration attribués",
      ),
    },
    {
      id: "department",
      label: t(
        "Sample department",
        "القسم التجريبي",
        "Département de démonstration",
      ),
    },
  ];
  const valid =
    role === "registrar" ||
    (role === "advisor" && scope !== "department") ||
    (role === "student" && scope === "own");
  const label = (items: typeof roles, value: string) =>
    items.find((item) => item.id === value)?.label;
  const count = scope === "own" ? 1 : scope === "assigned" ? 12 : 48;
  function startReview() {
    if (!valid) {
      setError("invalid");
      return;
    }
    setError("");
    setAcknowledged(false);
    setReview(true);
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Role and scope editor",
          "محرر الدور والنطاق",
          "Éditeur de rôle et de périmètre",
        )}
      >
        <Callout>
          {t(
            "These access rules belong only to this sample. They do not describe university permissions.",
            "تخص قواعد الوصول هذا المثال فقط. لا تصف صلاحيات الجامعة.",
            "Ces règles concernent uniquement cet exemple. Elles ne décrivent pas les droits de l’université.",
          )}
        </Callout>
        <div className="demo-grid" data-specimen="draft">
          <Field label={t("Draft role", "الدور المقترح", "Rôle proposé")}>
            <select
              className="input"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setError("");
              }}
            >
              {roles.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("Draft scope", "النطاق المقترح", "Périmètre proposé")}
          >
            <select
              className="input"
              value={scope}
              onChange={(event) => {
                setScope(event.target.value);
                setError("");
              }}
            >
              {scopes.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="pattern-metrics" data-specimen="abilities">
          <div>
            <span className="muted">
              {t(
                "Affected sample records",
                "السجلات التجريبية المتأثرة",
                "Dossiers de démonstration concernés",
              )}
            </span>
            <strong>{number(props.locale, count)}</strong>
          </div>
          <div>
            <span className="muted">
              {t(
                "Proposed abilities",
                "الإمكانات المقترحة",
                "Actions proposées",
              )}
            </span>
            <strong>
              {role === "student"
                ? t("Read own record", "قراءة السجل الشخصي", "Lire son dossier")
                : role === "advisor"
                  ? t(
                      "Read and annotate",
                      "قراءة وإضافة ملاحظات",
                      "Lire et annoter",
                    )
                  : t("Read and edit", "قراءة وتعديل", "Lire et modifier")}
            </strong>
          </div>
        </div>
        {error && (
          <Callout tone="danger">
            {t(
              "This sample combination is invalid. A student requires own-record scope. An advisor cannot use department scope.",
              "هذا الجمع التجريبي غير صالح. يحتاج الطالب إلى سجله الشخصي. لا يستخدم المرشد نطاق القسم.",
              "Cette combinaison est invalide. Un étudiant exige son propre dossier. Un conseiller ne peut pas choisir le département.",
            )}
          </Callout>
        )}
        <div className="pattern-actions" data-specimen="rejection">
          <Button
            data-specimen="impact"
            onClick={startReview}
            disabled={locked || sample.empty}
          >
            <ShieldCheck size={20} aria-hidden="true" />
            {t(
              "Review access impact",
              "مراجعة أثر الوصول",
              "Vérifier l’impact des droits",
            )}
          </Button>
          <Badge tone={valid ? "success" : "danger"}>
            {valid
              ? t(
                  "Valid sample combination",
                  "جمع تجريبي صالح",
                  "Combinaison de démonstration valide",
                )
              : t(
                  "Invalid sample combination",
                  "جمع تجريبي غير صالح",
                  "Combinaison de démonstration invalide",
                )}
          </Badge>
        </div>
        <p data-specimen="save">
          {t(
            "Current local access",
            "الوصول المحلي الحالي",
            "Droits locaux actuels",
          )}
          : {label(roles, saved.role)} · {label(scopes, saved.scope)}
        </p>
      </Panel>
      <ModalExample
        open={review}
        onClose={() => setReview(false)}
        title={t(
          "Review before saving access",
          "المراجعة قبل حفظ الوصول",
          "Vérifier avant d’enregistrer les droits",
        )}
        locale={props.locale}
      >
        <dl className="pattern-summary">
          <div>
            <dt>{t("Current", "الحالي", "Actuel")}</dt>
            <dd>
              {label(roles, saved.role)} · {label(scopes, saved.scope)}
            </dd>
          </div>
          <div>
            <dt>{t("Proposed", "المقترح", "Proposé")}</dt>
            <dd>
              {label(roles, role)} · {label(scopes, scope)}
            </dd>
          </div>
          <div>
            <dt>
              {t("Affected records", "السجلات المتأثرة", "Dossiers concernés")}
            </dt>
            <dd>{number(props.locale, count)}</dd>
          </div>
        </dl>
        <label className="check-label">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          {t(
            "I reviewed this sample impact.",
            "راجعت هذا الأثر التجريبي.",
            "J’ai vérifié cet impact de démonstration.",
          )}
        </label>
        <Button
          disabled={!acknowledged || !valid || locked}
          onClick={() => {
            setSaved({ role, scope });
            setReview(false);
            props.notify(
              t(
                "Sample access saved locally.",
                "تم حفظ الوصول التجريبي محليًا.",
                "Droits de démonstration enregistrés localement.",
              ),
              "success",
            );
          }}
        >
          {t(
            "Save sample access",
            "حفظ الوصول التجريبي",
            "Enregistrer les droits de démonstration",
          )}
        </Button>
      </ModalExample>
    </Pattern>
  );
}

function AcademicDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const [version, setVersion] = useState("2027");
  const [date, setDate] = useState("2027-09-01");
  const [applied, setApplied] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (props.specimen === "versions") setVersion("2026");
    if (props.specimen === "effective-date") {
      setDate("");
      setError("date");
    }
  }, [props.specimen]);
  const units = [
    {
      id: "ENG",
      title: t(
        "Faculty of Engineering",
        "كلية الهندسة",
        "Faculté d’ingénierie",
      ),
      departments: [
        t("Computer Engineering", "هندسة الحاسوب", "Génie informatique"),
        t("Electrical Engineering", "الهندسة الكهربائية", "Génie électrique"),
      ],
    },
    {
      id: "BUS",
      title: t(
        "Faculty of Business",
        "كلية إدارة الأعمال",
        "Faculté de gestion",
      ),
      departments: [
        t("Accounting", "المحاسبة", "Comptabilité"),
        t("Management", "الإدارة", "Gestion"),
      ],
    },
  ];
  const courses = [
    {
      code: "MAT-101",
      name: t("Mathematics", "الرياضيات", "Mathématiques"),
      credits: 3,
      kind: t("Required", "إجباري", "Obligatoire"),
    },
    {
      code: "CSE-101",
      name: t("Programming", "البرمجة", "Programmation"),
      credits: 4,
      kind: t("Required", "إجباري", "Obligatoire"),
    },
    ...(version === "2027"
      ? [
          {
            code: "CSE-120",
            name: t(
              "Data foundations",
              "أساسيات البيانات",
              "Fondements des données",
            ),
            credits: 3,
            kind: t("Required", "إجباري", "Obligatoire"),
          },
        ]
      : [
          {
            code: "ELE-110",
            name: t("Open elective", "مقرر اختياري", "Cours au choix"),
            credits: 3,
            kind: t("Elective", "اختياري", "Au choix"),
          },
        ]),
  ];
  return (
    <Pattern props={props} sample={sample}>
      <div className="demo-grid" data-specimen="units">
        <Panel
          title={t(
            "Academic units",
            "الوحدات الأكاديمية",
            "Unités académiques",
          )}
        >
          {sample.empty ? (
            <Empty t={t} />
          ) : (
            units.map((unit, index) => (
              <Disclosure
                key={unit.id}
                title={unit.title}
                initial={index === 0}
              >
                <ul className="pattern-unit-list">
                  {unit.departments.map((department, item) => (
                    <li
                      key={item}
                      data-specimen={
                        index === 0 && item === 0 ? "programmes" : undefined
                      }
                    >
                      <span>{department}</span>
                      <Badge>
                        {number(props.locale, item === 0 ? 2 : 1)}{" "}
                        {t(
                          "sample programmes",
                          "برامج تجريبية",
                          "programmes de démonstration",
                        )}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            ))
          )}
        </Panel>
        <Panel
          title={t(
            "Curriculum version",
            "نسخة الخطة الدراسية",
            "Version du cursus",
          )}
        >
          <div className="demo-grid">
            <Field
              label={t("Draft version", "النسخة المقترحة", "Version proposée")}
            >
              <select
                data-specimen="versions"
                className="input"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
              >
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </Field>
            <Field
              label={t("Effective date", "تاريخ السريان", "Date d’effet")}
              error={
                error
                  ? t(
                      "Choose an effective date.",
                      "اختر تاريخ السريان.",
                      "Choisissez une date d’effet.",
                    )
                  : undefined
              }
            >
              <input
                data-specimen="effective-date"
                className="input"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                aria-invalid={Boolean(error)}
              />
            </Field>
          </div>
          <p className="muted">
            {version === "2027"
              ? t(
                  "This sample replaces ELE-110 with CSE-120. Existing records remain separate.",
                  "يستبدل هذا المثال ELE-110 بالمقرر CSE-120. تبقى السجلات الحالية مستقلة.",
                  "Cet exemple remplace ELE-110 par CSE-120. Les dossiers existants restent distincts.",
                )
              : t(
                  "This sample version contains an open elective.",
                  "تتضمن هذه النسخة التجريبية مقررًا اختياريًا.",
                  "Cette version de démonstration contient un cours au choix.",
                )}
          </p>
          {!sample.empty && (
            <Table
              specimen="courses"
              label={t(
                "Sample curriculum",
                "الخطة الدراسية التجريبية",
                "Cursus de démonstration",
              )}
            >
              <thead>
                <tr>
                  <th>{t("Course", "المقرر", "Cours")}</th>
                  <th>{t("Credits", "الساعات", "Crédits")}</th>
                  <th>{t("Type", "النوع", "Type")}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.code}>
                    <td>
                      <bdi>{course.code}</bdi>
                      <br />
                      {course.name}
                    </td>
                    <td>{number(props.locale, course.credits)}</td>
                    <td>{course.kind}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Button
            disabled={locked || sample.empty}
            onClick={() => {
              if (!date) {
                setError("date");
                return;
              }
              setError("");
              setApplied(`${version} · ${date}`);
            }}
          >
            {t(
              "Apply sample version",
              "تطبيق النسخة التجريبية",
              "Appliquer la version de démonstration",
            )}
          </Button>
          {applied && (
            <Callout tone="success">
              {t(
                "Local draft applied",
                "تم تطبيق المسودة محليًا",
                "Brouillon local appliqué",
              )}
              : <bdi>{applied}</bdi>
            </Callout>
          )}
        </Panel>
      </div>
    </Pattern>
  );
}

type SectionSample = {
  id: string;
  course: string;
  day: number;
  start: number;
  end: number;
  seats: number;
  room: string;
};
function RegistrationDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked, state } = sample;
  const sections: SectionSample[] = [
    {
      id: "MAT-101-A",
      course: "MAT-101",
      day: 0,
      start: 9,
      end: 11,
      seats: 4,
      room: "A-201",
    },
    {
      id: "PHY-101-A",
      course: "PHY-101",
      day: 0,
      start: 10,
      end: 12,
      seats: 2,
      room: "B-102",
    },
    {
      id: "PHY-101-B",
      course: "PHY-101",
      day: 1,
      start: 11,
      end: 13,
      seats: 6,
      room: "B-104",
    },
    {
      id: "CSE-101-A",
      course: "CSE-101",
      day: 2,
      start: 9,
      end: 12,
      seats: 0,
      room: "C-301",
    },
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [review, setReview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [waitlist, setWaitlist] = useState(false);
  useEffect(() => {
    if (props.specimen && props.specimen !== "confirmation") setReview(false);
    if (props.specimen === "conflicts") {
      setSelected(["MAT-101-A", "PHY-101-A"]);
      setTouched(true);
    }
    if (props.specimen === "timetable" || props.specimen === "confirmation") {
      setSelected(["MAT-101-A", "PHY-101-B"]);
      setTouched(true);
    }
    if (props.specimen === "confirmation") setReview(true);
    if (props.specimen === "waitlist") setWaitlist(true);
  }, [props.specimen]);
  const chosenIds =
    !touched && state === "conflict" ? ["MAT-101-A", "PHY-101-A"] : selected;
  const chosen = sections.filter((section) => chosenIds.includes(section.id));
  const conflicts = chosen.flatMap((section, index) =>
    chosen
      .slice(index + 1)
      .filter(
        (other) =>
          section.day === other.day &&
          section.start < other.end &&
          other.start < section.end,
      )
      .map((other) => [section.id, other.id]),
  );
  const duplicateCourse = chosen.some((section, index) =>
    chosen.some(
      (other, otherIndex) =>
        index !== otherIndex && section.course === other.course,
    ),
  );
  const days = [
    t("Sunday", "الأحد", "Dimanche"),
    t("Monday", "الاثنين", "Lundi"),
    t("Tuesday", "الثلاثاء", "Mardi"),
  ];
  const time = (hour: number) =>
    `${number(props.locale, hour, { minimumIntegerDigits: 2 })}:00`;
  function toggle(id: string) {
    setSelected((current) => {
      const actual =
        !touched && state === "conflict" ? ["MAT-101-A", "PHY-101-A"] : current;
      return actual.includes(id)
        ? actual.filter((item) => item !== id)
        : [...actual, id];
    });
    setTouched(true);
    setConfirmed(false);
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t("Section selection", "اختيار الشعب", "Choix des groupes")}
      >
        <p className="muted">
          {t(
            "Sample seats and meeting times. Selection does not reserve a university place.",
            "المقاعد والمواعيد تجريبية. لا يحجز الاختيار مقعدًا جامعيًا.",
            "Places et horaires de démonstration. La sélection ne réserve aucune place universitaire.",
          )}
        </p>
        {sample.empty ? (
          <Empty t={t} />
        ) : (
          <Table
            specimen="availability"
            label={t(
              "Available sample sections",
              "الشعب التجريبية المتاحة",
              "Groupes de démonstration disponibles",
            )}
          >
            <thead>
              <tr>
                <th>{t("Section", "الشعبة", "Groupe")}</th>
                <th>{t("Meeting", "الموعد", "Horaire")}</th>
                <th>{t("Room", "القاعة", "Salle")}</th>
                <th>
                  {t(
                    "Available seats",
                    "المقاعد المتاحة",
                    "Places disponibles",
                  )}
                </th>
                <th data-specimen="selection">
                  {t("Selection", "الاختيار", "Sélection")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td>
                    <bdi>{section.id}</bdi>
                  </td>
                  <td>
                    {days[section.day]}{" "}
                    <bdi>
                      {time(section.start)}–{time(section.end)}
                    </bdi>
                  </td>
                  <td>
                    <bdi>{section.room}</bdi>
                  </td>
                  <td>
                    <Badge tone={section.seats === 0 ? "warning" : "success"}>
                      {number(props.locale, section.seats)}
                    </Badge>
                  </td>
                  <td>
                    {section.seats > 0 ? (
                      <Button
                        variant={
                          chosenIds.includes(section.id)
                            ? "primary"
                            : "secondary"
                        }
                        disabled={locked}
                        aria-pressed={chosenIds.includes(section.id)}
                        onClick={() => toggle(section.id)}
                      >
                        {chosenIds.includes(section.id)
                          ? t(
                              "Remove section",
                              "إزالة الشعبة",
                              "Retirer le groupe",
                            )
                          : t(
                              "Select section",
                              "اختيار الشعبة",
                              "Choisir le groupe",
                            )}
                      </Button>
                    ) : (
                      <Button
                        data-specimen="waitlist"
                        variant="secondary"
                        disabled={locked || waitlist}
                        onClick={() => setWaitlist(true)}
                      >
                        {waitlist
                          ? t(
                              "Sample request recorded",
                              "تم تسجيل الطلب التجريبي",
                              "Demande de démonstration enregistrée",
                            )
                          : t(
                              "Request sample waitlist",
                              "طلب قائمة انتظار تجريبية",
                              "Demander la liste d’attente",
                            )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      <div data-specimen="timetable">
        <Panel
          title={t(
            "Selected timetable",
            "الجدول المحدد",
            "Emploi du temps sélectionné",
          )}
        >
          {chosen.length === 0 ? (
            <p>
              {t(
                "Select a section to build the sample timetable.",
                "اختر شعبة لإنشاء الجدول التجريبي.",
                "Choisissez un groupe pour créer l’emploi du temps de démonstration.",
              )}
            </p>
          ) : (
            <div className="pattern-timetable">
              {days.map((day, index) => (
                <section key={index}>
                  <h4>{day}</h4>
                  {chosen
                    .filter((section) => section.day === index)
                    .map((section) => (
                      <div
                        className={`pattern-session ${conflicts.some((pair) => pair.includes(section.id)) ? "pattern-session-conflict" : ""}`}
                        key={section.id}
                      >
                        <strong>
                          <bdi>{section.id}</bdi>
                        </strong>
                        <span>
                          <bdi>
                            {time(section.start)}–{time(section.end)}
                          </bdi>
                        </span>
                        {conflicts.some((pair) =>
                          pair.includes(section.id),
                        ) && (
                          <Badge tone="danger">
                            {t(
                              "Time conflict",
                              "تعارض زمني",
                              "Conflit horaire",
                            )}
                          </Badge>
                        )}
                      </div>
                    ))}
                  {!chosen.some((section) => section.day === index) && (
                    <span className="muted">
                      {t(
                        "No selected section",
                        "لا توجد شعبة محددة",
                        "Aucun groupe sélectionné",
                      )}
                    </span>
                  )}
                </section>
              ))}
            </div>
          )}
          {conflicts.length > 0 && (
            <Callout tone="danger">
              {conflicts.map((pair) => (
                <p key={pair.join("-")}>
                  <bdi>{pair[0]}</bdi> {t("overlaps", "يتداخل مع", "chevauche")}{" "}
                  <bdi>{pair[1]}</bdi>.{" "}
                  {t(
                    "Remove one section or choose PHY-101-B.",
                    "أزل شعبة أو اختر PHY-101-B.",
                    "Retirez un groupe ou choisissez PHY-101-B.",
                  )}
                </p>
              ))}
            </Callout>
          )}
          {duplicateCourse && (
            <Callout tone="danger">
              {t(
                "Choose one section for each sample course.",
                "اختر شعبة واحدة لكل مقرر تجريبي.",
                "Choisissez un seul groupe par cours de démonstration.",
              )}
            </Callout>
          )}
          <div className="pattern-actions" data-specimen="conflicts">
            <Button
              data-specimen="confirmation"
              disabled={chosen.length === 0 || locked || sample.empty}
              onClick={() => setReview(true)}
            >
              {t(
                "Review registration",
                "مراجعة التسجيل",
                "Vérifier l’inscription",
              )}
            </Button>
            <span>
              {number(props.locale, chosen.length)}{" "}
              {t("selected sections", "شعب محددة", "groupes sélectionnés")}
            </span>
          </div>
          {confirmed && (
            <Callout tone="success">
              {t(
                "Sample registration confirmed locally. No seat was reserved.",
                "تم تأكيد التسجيل التجريبي محليًا. لم يتم حجز مقعد.",
                "Inscription de démonstration confirmée localement. Aucune place réservée.",
              )}
            </Callout>
          )}
        </Panel>
      </div>
      <ModalExample
        open={review}
        onClose={() => setReview(false)}
        title={t(
          "Review sample registration",
          "مراجعة التسجيل التجريبي",
          "Vérifier l’inscription de démonstration",
        )}
        locale={props.locale}
      >
        <ul>
          {chosen.map((section) => (
            <li key={section.id}>
              <bdi>{section.id}</bdi> · {days[section.day]} ·{" "}
              <bdi>
                {time(section.start)}–{time(section.end)}
              </bdi>
            </li>
          ))}
        </ul>
        {conflicts.length > 0 || duplicateCourse ? (
          <Callout tone="danger">
            {t(
              "Resolve the marked conflicts before confirmation.",
              "عالج التعارضات المحددة قبل التأكيد.",
              "Résolvez les conflits signalés avant confirmation.",
            )}
          </Callout>
        ) : (
          <Badge tone="success">
            {t(
              "No sample timetable conflict",
              "لا يوجد تعارض في الجدول التجريبي",
              "Aucun conflit dans l’emploi du temps",
            )}
          </Badge>
        )}
        <Button
          disabled={conflicts.length > 0 || duplicateCourse || locked}
          onClick={() => {
            setConfirmed(true);
            setReview(false);
          }}
        >
          {t(
            "Confirm sample registration",
            "تأكيد التسجيل التجريبي",
            "Confirmer l’inscription de démonstration",
          )}
        </Button>
      </ModalExample>
    </Pattern>
  );
}

function ResultsDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, state } = sample;
  const uid = useId();
  const [tab, setTab] = useState("grades");
  const [term, setTerm] = useState("2026-09");
  const [transcript, setTranscript] = useState(false);
  useEffect(() => {
    if (props.specimen) setTranscript(props.specimen === "transcript");
    if (props.specimen === "transcript") {
      setTab("transcript");
      setTranscript(true);
    }
    if (props.specimen === "groups" || props.specimen === "unmet")
      setTab("requirements");
    if (props.specimen === "grades" || props.specimen === "average")
      setTab("grades");
  }, [props.specimen]);
  const tabs = [
    { id: "grades", label: t("Grades", "الدرجات", "Notes") },
    {
      id: "transcript",
      label: t("Transcript", "كشف الدرجات", "Relevé de notes"),
    },
    { id: "requirements", label: t("Requirements", "المتطلبات", "Exigences") },
  ];
  const courses = [
    {
      code: "MAT-101",
      label: t("Mathematics", "الرياضيات", "Mathématiques"),
      credits: 3,
      score: term === "2026-09" ? 84 : 88,
    },
    {
      code: "CSE-101",
      label: t("Programming", "البرمجة", "Programmation"),
      credits: 4,
      score: term === "2026-09" ? 91 : 86,
    },
    {
      code: "PHY-101",
      label: t("Physics", "الفيزياء", "Physique"),
      credits: 3,
      score: state === "partial" ? null : 72,
    },
  ];
  const completed = courses.filter((course) => course.score !== null);
  const average =
    completed.reduce((sum, course) => sum + (course.score ?? 0), 0) /
    completed.length;
  const transcriptText = `${t("DEMONSTRATION TRANSCRIPT", "كشف درجات تجريبي", "RELEVÉ DE DÉMONSTRATION")}\nS-1001 · Maya Hassan\n${courses.map((course) => `${course.code}: ${course.score === null ? t("Pending", "قيد الانتظار", "En attente") : number(props.locale, course.score)} / ${number(props.locale, 100)}`).join("\n")}`;
  const courseTable = (
    <Table
      label={t("Sample grades", "الدرجات التجريبية", "Notes de démonstration")}
    >
      <thead>
        <tr>
          <th>{t("Course", "المقرر", "Cours")}</th>
          <th>{t("Credits", "الساعات", "Crédits")}</th>
          <th>{t("Score", "الدرجة", "Note")}</th>
          <th>{t("Result", "النتيجة", "Résultat")}</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.code}>
            <td>
              <bdi>{course.code}</bdi>
              <br />
              {course.label}
            </td>
            <td>{number(props.locale, course.credits)}</td>
            <td>
              {course.score === null
                ? "—"
                : `${number(props.locale, course.score)} / ${number(props.locale, 100)}`}
            </td>
            <td>
              <Badge tone={course.score === null ? "warning" : "success"}>
                {course.score === null
                  ? t(
                      "Awaiting sample result",
                      "بانتظار نتيجة تجريبية",
                      "Résultat de démonstration en attente",
                    )
                  : t("Sample complete", "اكتمل المثال", "Exemple terminé")}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Academic results and progress",
          "النتائج والتقدم الأكاديمي",
          "Résultats et progression académique",
        )}
      >
        <div
          className="pattern-tab-list"
          role="tablist"
          aria-label={t("Results views", "عروض النتائج", "Vues des résultats")}
        >
          {tabs.map((item, index) => (
            <button
              data-specimen={item.id === "requirements" ? "groups" : item.id}
              key={item.id}
              role="tab"
              id={`${uid}-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`${uid}-panel`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                if (
                  ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const delta =
                    event.key === "ArrowRight"
                      ? props.locale === "ar"
                        ? -1
                        : 1
                      : props.locale === "ar"
                        ? 1
                        : -1;
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 2
                        : (index + delta + 3) % 3;
                  setTab(tabs[next].id);
                  document.getElementById(`${uid}-${tabs[next].id}`)?.focus();
                }
              }}
            >
              <span
                data-specimen={item.id === "requirements" ? "unmet" : undefined}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-${tab}`}
          className="demo-stack"
          tabIndex={0}
        >
          {sample.empty ? (
            <Empty t={t} />
          ) : tab === "grades" ? (
            <>
              <Field
                label={t(
                  "Sample term",
                  "الفصل التجريبي",
                  "Période de démonstration",
                )}
              >
                <select
                  className="input"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                >
                  <option value="2026-09">
                    {t("September 2026", "سبتمبر 2026", "Septembre 2026")}
                  </option>
                  <option value="2027-01">
                    {t("January 2027", "يناير 2027", "Janvier 2027")}
                  </option>
                </select>
              </Field>
              {courseTable}
              <p data-specimen="average">
                {t(
                  "Unweighted sample average",
                  "المتوسط التجريبي غير المرجح",
                  "Moyenne de démonstration non pondérée",
                )}
                : {number(props.locale, average, { maximumFractionDigits: 1 })}{" "}
                / {number(props.locale, 100)}
              </p>
            </>
          ) : tab === "transcript" ? (
            <>
              <p>
                {t(
                  "Preview an unofficial sample transcript. No institutional seal or verification is provided.",
                  "عاين كشف درجات تجريبيًا غير رسمي. لا يتضمن ختمًا أو تحققًا مؤسسيًا.",
                  "Consultez un relevé de démonstration non officiel. Aucun sceau ni contrôle institutionnel.",
                )}
              </p>
              <div className="pattern-actions">
                <Button
                  disabled={sample.locked}
                  onClick={() => setTranscript(true)}
                >
                  {t(
                    "Preview sample transcript",
                    "معاينة كشف الدرجات التجريبي",
                    "Aperçu du relevé de démonstration",
                  )}
                </Button>
                <Button
                  variant="secondary"
                  disabled={sample.locked}
                  onClick={() =>
                    download(
                      "sample-transcript.txt",
                      transcriptText,
                      "text/plain;charset=utf-8",
                    )
                  }
                >
                  {t(
                    "Download sample text",
                    "تنزيل النص التجريبي",
                    "Télécharger le texte de démonstration",
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Callout>
                {t(
                  "These groups explain sample progress. They do not establish graduation requirements.",
                  "توضح هذه المجموعات التقدم التجريبي. لا تحدد متطلبات التخرج.",
                  "Ces groupes expliquent la progression de démonstration. Ils ne définissent pas les exigences du diplôme.",
                )}
              </Callout>
              <Disclosure
                title={t(
                  "Core courses",
                  "المقررات الأساسية",
                  "Cours fondamentaux",
                )}
                initial
              >
                <Badge tone="warning">
                  {number(props.locale, state === "partial" ? 2 : 3)} /{" "}
                  {number(props.locale, 4)} {t("complete", "مكتمل", "terminés")}
                </Badge>
                <p>
                  {t(
                    "CSE-201 is unmet because this sample has no completed result for that course.",
                    "لم يتحقق CSE-201 لأن هذا المثال لا يتضمن نتيجة مكتملة للمقرر.",
                    "CSE-201 reste à valider car cet exemple ne contient aucun résultat final pour ce cours.",
                  )}
                </p>
                {state === "partial" && (
                  <p>
                    {t(
                      "PHY-101 also remains unmet while its result is pending.",
                      "يبقى PHY-101 غير مكتمل أيضًا ما دامت نتيجته قيد الانتظار.",
                      "PHY-101 reste également à valider tant que son résultat est en attente.",
                    )}
                  </p>
                )}
              </Disclosure>
              <Disclosure
                title={t(
                  "Elective credits",
                  "الساعات الاختيارية",
                  "Crédits au choix",
                )}
              >
                <Badge tone="warning">
                  {number(props.locale, 3)} / {number(props.locale, 6)}{" "}
                  {t(
                    "sample credits",
                    "ساعات تجريبية",
                    "crédits de démonstration",
                  )}
                </Badge>
                <p>
                  {t(
                    "The sample needs 3 more elective credits. Required course credits do not count in this group.",
                    "يحتاج المثال إلى 3 ساعات اختيارية إضافية. لا تُحسب ساعات المقررات الإجبارية في هذه المجموعة.",
                    "Cet exemple exige encore 3 crédits au choix. Les crédits obligatoires ne comptent pas dans ce groupe.",
                  )}
                </p>
              </Disclosure>
              <Disclosure
                title={t(
                  "Practical project",
                  "المشروع التطبيقي",
                  "Projet pratique",
                )}
              >
                <Badge tone="success">
                  {t("Sample complete", "اكتمل المثال", "Exemple terminé")}
                </Badge>
                <p>
                  {t(
                    "The sample contains a recorded project assessment.",
                    "يتضمن المثال تقييم مشروع مسجلًا.",
                    "Cet exemple contient une évaluation de projet enregistrée.",
                  )}
                </p>
              </Disclosure>
            </>
          )}
        </div>
      </Panel>
      <ModalExample
        open={transcript}
        onClose={() => setTranscript(false)}
        title={t(
          "Unofficial sample transcript",
          "كشف درجات تجريبي غير رسمي",
          "Relevé de démonstration non officiel",
        )}
        locale={props.locale}
      >
        <Badge tone="warning">
          {t(
            "Sample data only",
            "بيانات تجريبية فقط",
            "Données de démonstration uniquement",
          )}
        </Badge>
        <p>
          Maya Hassan · <bdi>S-1001</bdi>
        </p>
        {courseTable}
        <Button
          variant="secondary"
          onClick={() =>
            void copyText(transcriptText, props.notify, props.locale)
          }
        >
          {t(
            "Copy sample transcript",
            "نسخ كشف الدرجات التجريبي",
            "Copier le relevé de démonstration",
          )}
        </Button>
      </ModalExample>
    </Pattern>
  );
}

type LedgerEntry = {
  id: string;
  type: "charge" | "payment" | "award";
  amount: number;
};
function FinanceDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, locked } = sample;
  const uid = useId();
  const [filter, setFilter] = useState("all");
  const [award, setAward] = useState(false);
  const [reconciled, setReconciled] = useState(false);
  const [review, setReview] = useState(false);
  const [received, setReceived] = useState("450");
  const [error, setError] = useState(false);
  useEffect(() => {
    if (props.specimen === "mismatch" || props.specimen === "reconcile")
      setReview(true);
  }, [props.specimen]);
  const ledger: LedgerEntry[] = [
    { id: "INV-100", type: "charge", amount: 1200 },
    { id: "PAY-090", type: "payment", amount: -400 },
    ...(award ? [{ id: "AWD-010", type: "award" as const, amount: -300 }] : []),
    ...(reconciled
      ? [{ id: "PAY-091", type: "payment" as const, amount: -500 }]
      : []),
  ];
  const balance = ledger.reduce((total, entry) => total + entry.amount, 0);
  const shown = sample.empty
    ? []
    : ledger.filter((entry) => filter === "all" || entry.type === filter);
  const money = (value: number) =>
    number(props.locale, value, {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    });
  const typeLabel = (type: string) =>
    type === "charge"
      ? t(
          "Tuition sample charge",
          "رسوم دراسية تجريبية",
          "Frais de scolarité de démonstration",
        )
      : type === "award"
        ? t(
            "Sample award credit",
            "رصيد منحة تجريبية",
            "Crédit de bourse de démonstration",
          )
        : t("Sample payment", "دفعة تجريبية", "Paiement de démonstration");
  function reconcile() {
    if (Number(received) !== 500) {
      setError(true);
      return;
    }
    setReconciled(true);
    setError(false);
    setReview(false);
  }
  return (
    <Pattern props={props} sample={sample}>
      <div className="pattern-metrics" data-specimen="balance">
        <div>
          <span>
            {t(
              "Sample account balance",
              "رصيد الحساب التجريبي",
              "Solde du compte de démonstration",
            )}
          </span>
          <strong>{sample.empty ? "—" : <bdi>{money(balance)}</bdi>}</strong>
        </div>
        <div>
          <span>
            {t("Sample hold", "القيد التجريبي", "Blocage de démonstration")}
          </span>
          <Badge tone={balance > 0 ? "warning" : "success"}>
            {balance > 0
              ? t("Balance outstanding", "يوجد رصيد مستحق", "Solde restant dû")
              : t("Cleared", "تمت التسوية", "Levée")}
          </Badge>
        </div>
      </div>
      <Callout>
        {t(
          "Demo rule: a positive sample balance shows a hold. This rule does not describe university policy.",
          "قاعدة العرض: يظهر قيد عند وجود رصيد تجريبي موجب. لا تصف هذه القاعدة سياسة الجامعة.",
          "Règle de démonstration : un solde positif affiche un blocage. Cette règle ne décrit pas la politique universitaire.",
        )}
      </Callout>
      <Panel title={t("Account ledger", "سجل الحساب", "Journal du compte")}>
        <Field label={t("Ledger filter", "تصفية السجل", "Filtre du journal")}>
          <select
            className="input"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">
              {t("All entries", "كل القيود", "Toutes les écritures")}
            </option>
            <option value="charge">{t("Charges", "الرسوم", "Frais")}</option>
            <option value="payment">
              {t("Payments", "المدفوعات", "Paiements")}
            </option>
            <option value="award">{t("Awards", "المنح", "Bourses")}</option>
          </select>
        </Field>
        {shown.length === 0 ? (
          <Empty t={t} />
        ) : (
          <Table
            specimen="ledger"
            label={t(
              "Sample account ledger",
              "سجل الحساب التجريبي",
              "Journal du compte de démonstration",
            )}
          >
            <thead>
              <tr>
                <th>{t("Reference", "المرجع", "Référence")}</th>
                <th>{t("Entry", "القيد", "Écriture")}</th>
                <th>{t("Amount", "المبلغ", "Montant")}</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <bdi>{entry.id}</bdi>
                  </td>
                  <td>{typeLabel(entry.type)}</td>
                  <td>
                    <bdi>{money(entry.amount)}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
      <div className="demo-grid">
        <Panel
          title={t("Sample award", "منحة تجريبية", "Bourse de démonstration")}
        >
          <p>
            {t("Demonstration award", "منحة للعرض", "Bourse de démonstration")}{" "}
            · <bdi>{money(300)}</bdi>
          </p>
          <Badge tone={award ? "success" : "info"}>
            {award
              ? t(
                  "Applied to local ledger",
                  "تم التطبيق في السجل المحلي",
                  "Appliquée au journal local",
                )
              : t(
                  "Ready for sample application",
                  "جاهزة للتطبيق التجريبي",
                  "Prête pour l’application de démonstration",
                )}
          </Badge>
          <Button
            data-specimen="award"
            variant="secondary"
            disabled={award || locked || sample.empty}
            onClick={() => setAward(true)}
          >
            {t(
              "Apply sample award",
              "تطبيق المنحة التجريبية",
              "Appliquer la bourse de démonstration",
            )}
          </Button>
        </Panel>
        <Panel
          title={t(
            "Payment reconciliation",
            "مطابقة الدفعة",
            "Rapprochement du paiement",
          )}
        >
          <p data-specimen="mismatch">
            {t(
              "Expected sample payment",
              "الدفعة التجريبية المتوقعة",
              "Paiement de démonstration attendu",
            )}
            : <bdi>{money(500)}</bdi>
          </p>
          <Badge tone={reconciled ? "success" : "warning"}>
            {reconciled
              ? t(
                  "Reconciled locally",
                  "تمت المطابقة محليًا",
                  "Rapproché localement",
                )
              : t(
                  "Imported amount differs",
                  "المبلغ المستورد مختلف",
                  "Le montant importé diffère",
                )}
          </Badge>
          <Button
            data-specimen="reconcile"
            variant="secondary"
            disabled={reconciled || locked || sample.empty}
            onClick={() => setReview(true)}
          >
            {t(
              "Review sample payment",
              "مراجعة الدفعة التجريبية",
              "Vérifier le paiement de démonstration",
            )}
          </Button>
        </Panel>
      </div>
      <ModalExample
        open={review}
        onClose={() => setReview(false)}
        title={t(
          "Reconcile sample payment",
          "مطابقة الدفعة التجريبية",
          "Rapprocher le paiement de démonstration",
        )}
        locale={props.locale}
      >
        <p>
          {t(
            "Match the source amount to the expected amount before adding a local credit.",
            "طابق مبلغ المصدر بالمبلغ المتوقع قبل إضافة رصيد محلي.",
            "Faites correspondre le montant source au montant attendu avant d’ajouter un crédit local.",
          )}
        </p>
        <p>
          {t("Expected", "المتوقع", "Attendu")}: <bdi>{money(500)}</bdi>
        </p>
        <Field
          label={t(
            "Source amount in EGP",
            "مبلغ المصدر بالجنيه المصري",
            "Montant source en EGP",
          )}
          error={
            error ? (
              <span id={`${uid}-amount`}>
                {t(
                  "The sample amount must equal 500 EGP.",
                  "يجب أن يساوي المبلغ التجريبي 500 جنيه.",
                  "Le montant de démonstration doit être égal à 500 EGP.",
                )}
              </span>
            ) : undefined
          }
        >
          <input
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={received}
            onChange={(event) => {
              setReceived(event.target.value);
              setError(false);
            }}
            aria-invalid={error}
            aria-describedby={error ? `${uid}-amount` : undefined}
          />
        </Field>
        <div className="pattern-actions">
          <Button onClick={reconcile} disabled={locked}>
            {t(
              "Confirm sample reconciliation",
              "تأكيد المطابقة التجريبية",
              "Confirmer le rapprochement",
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setReceived("500");
              setError(false);
            }}
          >
            {t(
              "Use matching sample amount",
              "استخدام المبلغ التجريبي المطابق",
              "Utiliser le montant correspondant",
            )}
          </Button>
        </div>
      </ModalExample>
    </Pattern>
  );
}

function OperationsDemo(props: DemoProps) {
  const sample = useSampleState(props);
  const { t, state, locked } = sample;
  const [stage, setStage] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (props.specimen === "failure" || props.specimen === "recovery") {
      setStage(2);
      setTouched(true);
    }
    if (props.specimen === "steps" || props.specimen === "confirmation") {
      setStage(1);
      setTouched(true);
    }
  }, [props.specimen]);
  const actualStage = !touched
    ? state === "success"
      ? 4
      : state === "partial" || state === "error"
        ? 2
        : state === "pending" || state === "loading"
          ? 1
          : stage
    : stage;
  const steps = [
    {
      id: "identity",
      label: t("Identity account", "حساب الهوية", "Compte d’identité"),
    },
    {
      id: "mail",
      label: t("Mail account", "حساب البريد", "Compte de messagerie"),
    },
    {
      id: "course",
      label: t("Course workspace", "مساحة المقرر", "Espace de cours"),
    },
  ];
  const requested = actualStage > 0;
  const confirmed = (index: number) =>
    actualStage >= 4 ||
    (index === 0 && actualStage >= 1) ||
    (index === 1 && actualStage >= 3);
  function advance() {
    setTouched(true);
    setStage(
      actualStage === 0 ? 1 : actualStage === 1 ? 2 : actualStage === 2 ? 3 : 4,
    );
  }
  return (
    <Pattern props={props} sample={sample}>
      <Panel
        title={t(
          "Student service provisioning",
          "تجهيز خدمات الطالب",
          "Création des services étudiant",
        )}
      >
        <p className="muted">
          {t(
            "This sample separates a requested action from a confirmed result. It contacts no identity or mail system.",
            "يفصل المثال بين الإجراء المطلوب والنتيجة المؤكدة. لا يتصل بنظام هوية أو بريد.",
            "Cet exemple distingue une demande de son résultat confirmé. Il ne contacte aucun système d’identité ou de messagerie.",
          )}
        </p>
        <div className="pattern-health" data-specimen="health">
          <Badge tone={state === "unavailable" ? "danger" : "success"}>
            {t(
              "Sample connector",
              "الموصل التجريبي",
              "Connecteur de démonstration",
            )}
            :{" "}
            {state === "unavailable"
              ? t("Unavailable", "غير متاح", "Indisponible")
              : t("Available", "متاح", "Disponible")}
          </Badge>
          <span data-specimen="failure">
            <Badge tone={actualStage === 2 ? "danger" : "neutral"}>
              {t("Mail health", "حالة البريد", "État de la messagerie")}:{" "}
              {actualStage === 2
                ? t("Simulated failure", "فشل محاكى", "Échec simulé")
                : t("Ready", "جاهز", "Prêt")}
            </Badge>
          </span>
        </div>
        {sample.empty ? (
          <Empty t={t} />
        ) : (
          <Table
            specimen="steps"
            label={t(
              "Provisioning status",
              "حالة تجهيز الخدمات",
              "État de création des services",
            )}
          >
            <thead>
              <tr>
                <th>{t("Service", "الخدمة", "Service")}</th>
                <th>{t("Requested", "مطلوب", "Demandé")}</th>
                <th data-specimen="confirmation">
                  {t("Confirmed", "مؤكد", "Confirmé")}
                </th>
                <th>
                  {t("Result detail", "تفاصيل النتيجة", "Détail du résultat")}
                </th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => (
                <tr key={step.id}>
                  <td>{step.label}</td>
                  <td>
                    <Badge tone={requested ? "info" : "neutral"}>
                      {requested
                        ? t("Yes", "نعم", "Oui")
                        : t("No", "لا", "Non")}
                    </Badge>
                  </td>
                  <td>
                    <Badge tone={confirmed(index) ? "success" : "neutral"}>
                      {confirmed(index)
                        ? t("Yes", "نعم", "Oui")
                        : t("No", "لا", "Non")}
                    </Badge>
                  </td>
                  <td>
                    {confirmed(index) ? (
                      <span>
                        <bdi>{`DEMO-${step.id.toUpperCase()}-01`}</bdi>
                      </span>
                    ) : actualStage === 2 && index === 1 ? (
                      <span className="field-error">
                        {t(
                          "Sample mail request failed. Retry this step.",
                          "فشل طلب البريد التجريبي. أعد محاولة هذه الخطوة.",
                          "La demande de messagerie a échoué. Réessayez cette étape.",
                        )}
                      </span>
                    ) : requested ? (
                      t(
                        "Awaiting sample confirmation",
                        "بانتظار تأكيد تجريبي",
                        "Confirmation de démonstration en attente",
                      )
                    ) : (
                      t(
                        "No request sent",
                        "لم يرسل طلب",
                        "Aucune demande envoyée",
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {actualStage === 2 && (
          <Callout tone="danger">
            {t(
              "The mail step failed. The confirmed identity step remains complete. Retry continues from the failed step.",
              "فشلت خطوة البريد. تبقى خطوة الهوية المؤكدة مكتملة. تبدأ الإعادة من الخطوة الفاشلة.",
              "L’étape de messagerie a échoué. L’identité confirmée reste créée. La reprise commence à l’étape en échec.",
            )}
          </Callout>
        )}
        {actualStage === 4 && (
          <Callout tone="success">
            {t(
              "All sample services have local confirmations.",
              "كل الخدمات التجريبية لها تأكيدات محلية.",
              "Tous les services de démonstration disposent de confirmations locales.",
            )}
          </Callout>
        )}
        <div className="pattern-actions">
          <Button
            data-specimen="recovery"
            disabled={locked || sample.empty || actualStage === 4}
            onClick={advance}
          >
            {actualStage === 0 ? (
              t(
                "Request sample setup",
                "طلب التجهيز التجريبي",
                "Demander la création de démonstration",
              )
            ) : actualStage === 2 ? (
              <>
                <RefreshCw size={20} aria-hidden="true" />
                {t(
                  "Retry failed mail step",
                  "إعادة محاولة خطوة البريد الفاشلة",
                  "Réessayer la messagerie",
                )}
              </>
            ) : actualStage === 3 ? (
              t(
                "Confirm sample course workspace",
                "تأكيد مساحة المقرر التجريبية",
                "Confirmer l’espace de cours",
              )
            ) : (
              t(
                "Run next sample confirmation",
                "تنفيذ التأكيد التجريبي التالي",
                "Exécuter la confirmation suivante",
              )
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setStage(0);
              setTouched(true);
            }}
          >
            {t(
              "Reset sample setup",
              "إعادة ضبط التجهيز التجريبي",
              "Réinitialiser la création de démonstration",
            )}
          </Button>
        </div>
      </Panel>
    </Pattern>
  );
}

export const patternRenderers: Record<string, DemoRenderer> = {
  bulk: (props) => <BulkDemo {...props} />,
  wizard: (props) => <WizardDemo {...props} />,
  import: (props) => <ImportDemo {...props} />,
  approvals: (props) => <ApprovalsDemo {...props} />,
  access: (props) => <AccessDemo {...props} />,
  academic: (props) => <AcademicDemo {...props} />,
  registration: (props) => <RegistrationDemo {...props} />,
  results: (props) => <ResultsDemo {...props} />,
  finance: (props) => <FinanceDemo {...props} />,
  operations: (props) => <OperationsDemo {...props} />,
};
