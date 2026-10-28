import { useEffect, useRef, useState } from "react";
import {
  Check,
  CircleAlert,
  FileSearch,
  LoaderCircle,
  RefreshCw,
  WifiOff,
  X,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Callout,
  Field,
  number,
  type DemoProps,
  type Tone,
} from "../../shared";
import { ComponentFrame, useLabels } from "./common";

export function FeedbackDemo(props: DemoProps) {
  const t = useLabels(props);
  const [tone, setTone] = useState<Tone>("info");
  const [banner, setBanner] = useState(true);
  const [status, setStatus] = useState<
    "idle" | "pending" | "error" | "success"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [fail, setFail] = useState(false);
  const [offline, setOffline] = useState(false);
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(
    () => () => {
      if (interval.current) clearInterval(interval.current);
    },
    [],
  );
  const run = () => {
    if (interval.current) clearInterval(interval.current);
    setStatus("pending");
    setProgress(0);
    let current = 0;
    interval.current = setInterval(() => {
      current += 20;
      setProgress(current);
      if (current >= 100) {
        if (interval.current) clearInterval(interval.current);
        setStatus(fail ? "error" : "success");
        props.notify(
          fail
            ? t(
                "Sample operation failed. Retry is available.",
                "فشلت العملية التجريبية. إعادة المحاولة متاحة.",
                "L’opération exemple a échoué. Réessayez.",
              )
            : t(
                "Sample operation complete",
                "اكتملت العملية التجريبية",
                "Opération exemple terminée",
              ),
          fail ? "danger" : "success",
        );
      }
    }, 220);
  };
  const cancel = () => {
    if (interval.current) clearInterval(interval.current);
    setStatus("idle");
    setProgress(0);
    props.notify(
      t(
        "Sample operation cancelled",
        "أُلغيت العملية التجريبية",
        "Opération exemple annulée",
      ),
    );
  };
  const messages: Record<Tone, string> = {
    neutral: t(
      "The record has no pending changes.",
      "لا توجد تغييرات معلقة في السجل.",
      "Le dossier ne contient aucune modification en attente.",
    ),
    info: t(
      "Registration opens on 2 November.",
      "يفتح التسجيل في 2 نوفمبر.",
      "Les inscriptions ouvrent le 2 novembre.",
    ),
    success: t(
      "The sample changes were saved.",
      "حُفظت التغييرات التجريبية.",
      "Les modifications exemples sont enregistrées.",
    ),
    warning: t(
      "Review the credit limit before you continue.",
      "راجع حد الساعات قبل المتابعة.",
      "Vérifiez la limite de crédits avant de continuer.",
    ),
    danger: t(
      "The requested sample could not load.",
      "تعذر تحميل المثال المطلوب.",
      "L’exemple demandé est indisponible.",
    ),
  };
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="feedback-inline-alerts-and-banners">
              {t(
                "Inline alerts and banners",
                "تنبيهات ولافتات",
                "Alertes et bannières",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Field label={t("Message tone", "نوع الرسالة", "Type de message")}>
              <select
                className="input"
                value={tone}
                onChange={(event) => setTone(event.target.value as Tone)}
              >
                {(
                  ["neutral", "info", "success", "warning", "danger"] as const
                ).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Field>
            <Callout tone={tone}>{messages[tone]}</Callout>
            {banner && (
              <div className="callout tone-warning">
                <span>
                  {t(
                    "The sample session expires in 5 minutes.",
                    "تنتهي الجلسة التجريبية خلال 5 دقائق.",
                    "La session exemple expire dans 5 minutes.",
                  )}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBanner(false);
                    props.notify(
                      t(
                        "Sample session extended",
                        "مُددت الجلسة التجريبية",
                        "Session exemple prolongée",
                      ),
                      "success",
                    );
                  }}
                >
                  {t("Extend", "تمديد", "Prolonger")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setBanner(false)}
                  aria-label={t(
                    "Dismiss session banner",
                    "إغلاق لافتة الجلسة",
                    "Fermer la bannière",
                  )}
                >
                  <X size={20} />
                </Button>
              </div>
            )}
            <div className="toolbar">
              <Button
                variant="secondary"
                onClick={() => props.notify(messages[tone], tone)}
              >
                {t("Show toast", "عرض إشعار عابر", "Afficher une notification")}
              </Button>
              <Button variant="ghost" onClick={() => setBanner(true)}>
                {t(
                  "Restore banner",
                  "استعادة اللافتة",
                  "Restaurer la bannière",
                )}
              </Button>
            </div>
            <Field
              label={t(
                "Email validation",
                "التحقق من البريد",
                "Validation du courriel",
              )}
              error={
                validated && !email.includes("@")
                  ? t(
                      "Enter an email address with @.",
                      "أدخل عنوان بريد يتضمن @.",
                      "Saisissez une adresse avec @.",
                    )
                  : undefined
              }
            >
              <input
                className="input"
                type="text"
                inputMode="email"
                value={email}
                aria-invalid={validated && !email.includes("@")}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            <Button variant="secondary" onClick={() => setValidated(true)}>
              {t("Validate", "تحقق", "Valider")}
            </Button>
            {validated && email.includes("@") && (
              <Badge tone="success">
                {t("Email accepted", "البريد مقبول", "Courriel accepté")}
              </Badge>
            )}
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="feedback-progress-pending-and-retry">
              {t(
                "Progress, pending, and retry",
                "التقدم والانتظار وإعادة المحاولة",
                "Progression, attente et nouvel essai",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <label className="check-label">
              <input
                type="checkbox"
                checked={fail}
                onChange={(event) => setFail(event.target.checked)}
                disabled={status === "pending"}
              />
              {t(
                "Fail the next sample operation",
                "إفشال العملية التجريبية التالية",
                "Faire échouer la prochaine opération",
              )}
            </label>
            <div className="toolbar">
              <Button disabled={status === "pending"} onClick={run}>
                {status === "error" ? (
                  <RefreshCw size={20} />
                ) : (
                  <Check size={20} />
                )}
                {status === "error"
                  ? t("Retry", "إعادة المحاولة", "Réessayer")
                  : t(
                      "Run sample operation",
                      "تشغيل العملية التجريبية",
                      "Exécuter l’exemple",
                    )}
              </Button>
              {status === "pending" && (
                <Button variant="secondary" onClick={cancel}>
                  {t(
                    "Cancel operation",
                    "إلغاء العملية",
                    "Annuler l’opération",
                  )}
                </Button>
              )}
            </div>
            <progress
              className="component-progress"
              max={100}
              value={progress}
              aria-label={t(
                "Sample operation progress",
                "تقدم العملية التجريبية",
                "Progression de l’opération",
              )}
            />
            <output aria-live="polite">
              {number(props.locale, progress)}%
            </output>
            {status === "pending" && (
              <div
                className="component-skeleton-stack"
                aria-label={t(
                  "Content pending",
                  "المحتوى قيد التحميل",
                  "Contenu en attente",
                )}
                aria-busy="true"
              >
                <span />
                <span />
                <span />
              </div>
            )}
            {status === "error" && (
              <Callout tone="danger">
                {t(
                  "The sample failed. Disable the failure option, then retry.",
                  "فشل المثال. عطل خيار الفشل ثم أعد المحاولة.",
                  "L’exemple a échoué. Désactivez l’échec puis réessayez.",
                )}
              </Callout>
            )}
            {status === "success" && (
              <Callout tone="success">
                {t(
                  "The sample completed. The result is confirmed.",
                  "اكتمل المثال. النتيجة مؤكدة.",
                  "L’exemple est terminé. Le résultat est confirmé.",
                )}
              </Callout>
            )}
          </div>
        </Panel>
      </div>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="feedback-empty-and-no-results-states">
              {t(
                "Empty and no-results states",
                "الحالة الفارغة وعدم وجود نتائج",
                "État vide et aucun résultat",
              )}
            </span>
          }
        >
          <div className="component-empty">
            <FileSearch size={24} />
            <h3>
              {t(
                "No matching documents",
                "لا توجد مستندات مطابقة",
                "Aucun document correspondant",
              )}
            </h3>
            <p>
              {t(
                "Clear the filter to restore the sample content.",
                "امسح المرشح لاستعادة المحتوى التجريبي.",
                "Effacez le filtre pour restaurer les exemples.",
              )}
            </p>
            <Button
              variant="secondary"
              onClick={() =>
                props.notify(
                  t(
                    "Filter cleared. Two sample documents are available.",
                    "مُسح المرشح. يتوفر مستندان تجريبيان.",
                    "Filtre effacé. Deux documents exemples sont disponibles.",
                  ),
                  "success",
                )
              }
            >
              {t("Clear filter", "مسح المرشح", "Effacer le filtre")}
            </Button>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="feedback-offline-and-connection-status">
              {t(
                "Offline and connection status",
                "حالة الاتصال وانقطاعه",
                "État de connexion",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Button variant="secondary" onClick={() => setOffline(!offline)}>
              {offline
                ? t(
                    "Restore sample connection",
                    "استعادة الاتصال التجريبي",
                    "Rétablir la connexion exemple",
                  )
                : t(
                    "Simulate offline state",
                    "محاكاة انقطاع الاتصال",
                    "Simuler le mode hors ligne",
                  )}
            </Button>
            {offline ? (
              <Callout tone="warning">
                <WifiOff size={20} />
                <p>
                  {t(
                    "The sample is offline. Your local changes remain available.",
                    "المثال غير متصل. تظل التغييرات المحلية متاحة.",
                    "L’exemple est hors ligne. Vos modifications locales restent disponibles.",
                  )}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOffline(false);
                    props.notify(
                      t(
                        "Sample connection restored",
                        "استُعيد الاتصال التجريبي",
                        "Connexion exemple rétablie",
                      ),
                      "success",
                    );
                  }}
                >
                  {t("Reconnect", "إعادة الاتصال", "Reconnecter")}
                </Button>
              </Callout>
            ) : (
              <Badge tone="success">
                {t(
                  "Sample connection available",
                  "الاتصال التجريبي متاح",
                  "Connexion exemple disponible",
                )}
              </Badge>
            )}
          </div>
        </Panel>
      </div>
    </ComponentFrame>
  );
}
