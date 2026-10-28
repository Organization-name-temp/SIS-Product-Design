import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  FileText,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  Send,
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

type Message = { id: number; author: "student" | "advisor"; text: string };
type Audit = { id: number; label: string; detail: string };
export function CommunicationDemo(props: DemoProps) {
  const t = useLabels(props);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      read: false,
      en: "Your transcript is ready.",
      ar: "كشف درجاتك جاهز.",
      fr: "Votre relevé de notes est prêt.",
    },
    {
      id: 2,
      read: false,
      en: "Your advisor requested a review.",
      ar: "طلب مرشدك مراجعة.",
      fr: "Votre conseiller demande une révision.",
    },
    {
      id: 3,
      read: true,
      en: "Registration opens on 2 November.",
      ar: "يفتح التسجيل في 2 نوفمبر.",
      fr: "Les inscriptions ouvrent le 2 novembre.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "advisor",
      text: t(
        "Please review your proposed study load before registration.",
        "يرجى مراجعة العبء الدراسي المقترح قبل التسجيل.",
        "Vérifiez votre charge de cours avant l’inscription.",
      ),
    },
  ]);
  const [audit, setAudit] = useState<Audit[]>([
    {
      id: 1,
      label: t("Record created", "أُنشئ السجل", "Dossier créé"),
      detail: "2026-10-26 09:15 · Registrar",
    },
    {
      id: 2,
      label: t(
        "Transcript verified",
        "وُثق كشف الدرجات",
        "Relevé de notes vérifié",
      ),
      detail: "2026-10-27 11:30 · Reviewer",
    },
  ]);
  const [source, setSource] = useState(false);
  const [stream, setStream] = useState("");
  const [streamState, setStreamState] = useState<
    "idle" | "streaming" | "stopped" | "error" | "complete"
  >("idle");
  const [fail, setFail] = useState(false);
  const [name, setName] = useState("Mariam Hassan");
  const [credits, setCredits] = useState("42");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [applied, setApplied] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const sequence = useRef(10);
  useEffect(
    () => () => {
      if (interval.current) clearInterval(interval.current);
    },
    [],
  );
  const log = (
    label: string,
    detail = t(
      "Local sample action · Just now",
      "إجراء تجريبي محلي · الآن",
      "Action locale exemple · À l’instant",
    ),
  ) => setAudit((old) => [...old, { id: ++sequence.current, label, detail }]);
  const send = () => {
    if (!message.trim()) {
      setError(
        t(
          "Enter a message before you send.",
          "أدخل رسالة قبل الإرسال.",
          "Saisissez un message avant l’envoi.",
        ),
      );
      return;
    }
    setMessages((old) => [
      ...old,
      { id: ++sequence.current, author: "student", text: message.trim() },
    ]);
    setMessage("");
    setError("");
    log(
      t(
        "Sample message sent",
        "أُرسلت الرسالة التجريبية",
        "Message exemple envoyé",
      ),
    );
    props.notify(
      t(
        "Message added to the local conversation",
        "أُضيفت الرسالة إلى المحادثة المحلية",
        "Message ajouté à la conversation locale",
      ),
      "success",
    );
  };
  const startStream = (forceSuccess = false) => {
    if (interval.current) clearInterval(interval.current);
    const words = t(
      "The sample record shows 42 completed credits. Review the transcript and confirm each extracted field before you apply changes. This text is a local simulation, not a generated academic recommendation.",
      "يعرض السجل التجريبي 42 ساعة مكتملة. راجع كشف الدرجات وأكد كل حقل مستخرج قبل تطبيق التغييرات. هذا النص محاكاة محلية وليس توصية أكاديمية مولدة.",
      "Le dossier exemple contient 42 crédits acquis. Vérifiez le relevé et confirmez chaque champ extrait avant d’appliquer les modifications. Ce texte est une simulation locale, sans recommandation universitaire générée.",
    ).split(" ");
    let index = 0;
    setStream("");
    setStreamState("streaming");
    interval.current = setInterval(() => {
      index += 1;
      setStream(words.slice(0, index).join(" "));
      if (fail && !forceSuccess && index === 12) {
        if (interval.current) clearInterval(interval.current);
        setStreamState("error");
      } else if (index >= words.length) {
        if (interval.current) clearInterval(interval.current);
        setStreamState("complete");
        log(
          t(
            "Text simulation completed",
            "اكتملت محاكاة النص",
            "Simulation du texte terminée",
          ),
        );
      }
    }, 65);
  };
  const stopStream = () => {
    if (interval.current) clearInterval(interval.current);
    setStreamState("stopped");
  };
  const unread = notifications.filter((item) => !item.read).length;
  return (
    <ComponentFrame props={props}>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="communication-notifications">
              {t("Notifications", "الإشعارات", "Notifications")}
            </span>
          }
        >
          <div className="toolbar">
            <Badge tone="info">
              <Bell size={16} />
              {number(props.locale, unread)}{" "}
              {t("unread", "غير مقروء", "non lues")}
            </Badge>
            <Button
              variant="secondary"
              onClick={() => {
                setNotifications((old) =>
                  old.map((item) => ({ ...item, read: true })),
                );
                log(
                  t(
                    "Notifications marked read",
                    "حُددت الإشعارات كمقروءة",
                    "Notifications marquées comme lues",
                  ),
                );
              }}
            >
              <CheckCheck size={20} />
              {t("Mark all read", "تحديد الكل كمقروء", "Tout marquer comme lu")}
            </Button>
            <label className="check-label">
              {t("Show", "عرض", "Afficher")}
              <select
                className="input"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">{t("All", "الكل", "Toutes")}</option>
                <option value="unread">
                  {t("Unread", "غير المقروءة", "Non lues")}
                </option>
              </select>
            </label>
          </div>
          <ul className="component-notification-list">
            {notifications
              .filter((item) => filter === "all" || !item.read)
              .map((item) => (
                <li key={item.id} data-unread={!item.read}>
                  <button
                    className="component-list-action"
                    type="button"
                    onClick={() =>
                      setNotifications((old) =>
                        old.map((value) =>
                          value.id === item.id
                            ? { ...value, read: !value.read }
                            : value,
                        ),
                      )
                    }
                  >
                    <span>{item[props.locale]}</span>
                    <small className="muted">
                      {item.read
                        ? t(
                            "Read · select to mark unread",
                            "مقروء · اضغط لتحديده كغير مقروء",
                            "Lue · activez pour marquer non lue",
                          )
                        : t(
                            "Unread · select to mark read",
                            "غير مقروء · اضغط لتحديده كمقروء",
                            "Non lue · activez pour marquer lue",
                          )}
                    </small>
                  </button>
                  <Button
                    variant="ghost"
                    aria-label={t(
                      "Dismiss notification",
                      "حذف الإشعار",
                      "Supprimer la notification",
                    )}
                    onClick={() =>
                      setNotifications((old) =>
                        old.filter((value) => value.id !== item.id),
                      )
                    }
                  >
                    <X size={20} />
                  </Button>
                </li>
              ))}
          </ul>
          {!notifications.some((item) => filter === "all" || !item.read) && (
            <p className="muted">
              {t(
                "No notifications in this view.",
                "لا توجد إشعارات في هذا العرض.",
                "Aucune notification dans cette vue.",
              )}
            </p>
          )}
          <Button
            variant="ghost"
            onClick={() =>
              setNotifications((old) => [
                ...old,
                {
                  id: ++sequence.current,
                  read: false,
                  en: "A new sample document needs review.",
                  ar: "يحتاج مستند تجريبي جديد إلى مراجعة.",
                  fr: "Un nouveau document exemple nécessite une révision.",
                },
              ])
            }
          >
            {t(
              "Add sample notification",
              "إضافة إشعار تجريبي",
              "Ajouter une notification exemple",
            )}
          </Button>
        </Panel>
        <Panel
          title={
            <span data-specimen="communication-messages-and-composer">
              {t(
                "Messages and composer",
                "الرسائل وكتابتها",
                "Messages et rédaction",
              )}
            </span>
          }
        >
          <div
            className="component-message-log"
            role="log"
            aria-label={t(
              "Local conversation",
              "المحادثة المحلية",
              "Conversation locale",
            )}
          >
            {messages.map((item) => (
              <div
                className={`component-message message-${item.author}`}
                key={item.id}
              >
                <strong>
                  {item.author === "advisor"
                    ? t("Advisor", "المرشد", "Conseiller")
                    : t("You", "أنت", "Vous")}
                </strong>
                <p>{item.text}</p>
                <small>{t("Local sample", "مثال محلي", "Exemple local")}</small>
              </div>
            ))}
          </div>
          <form
            className="demo-stack"
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
          >
            <Field
              label={t(
                "Message to advisor",
                "رسالة إلى المرشد",
                "Message au conseiller",
              )}
              error={error || undefined}
              hint={`${number(props.locale, message.length)} / ${number(props.locale, 500)}`}
            >
              <textarea
                className="input"
                rows={3}
                value={message}
                maxLength={500}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
              />
            </Field>
            <div className="toolbar">
              <Button type="submit">
                <Send size={20} />
                {t(
                  "Send local message",
                  "إرسال رسالة محلية",
                  "Envoyer le message local",
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setMessage(
                    t(
                      "Please review my planned courses.",
                      "يرجى مراجعة المقررات التي خططت لها.",
                      "Merci de vérifier mes cours prévus.",
                    ),
                  )
                }
              >
                {t(
                  "Use sample reply",
                  "استخدام رد تجريبي",
                  "Utiliser une réponse exemple",
                )}
              </Button>
            </div>
          </form>
        </Panel>
      </div>
      <Panel
        title={
          <span data-specimen="communication-citations-and-streamed-content">
            {t(
              "Citations and streamed content",
              "الاستشهادات والنص المتتابع",
              "Sources et texte progressif",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          <Callout>
            {t(
              "This demonstration uses fixed local text and sample sources.",
              "يستخدم هذا العرض نصًا محليًا ثابتًا ومصادر تجريبية.",
              "Cette démonstration utilise un texte local fixe et des sources exemples.",
            )}
          </Callout>
          <div className="toolbar">
            <Button
              disabled={streamState === "streaming"}
              onClick={() => startStream()}
            >
              <Play size={20} />
              {t(
                "Start text simulation",
                "بدء محاكاة النص",
                "Démarrer la simulation",
              )}
            </Button>
            {streamState === "streaming" && (
              <Button variant="secondary" onClick={stopStream}>
                <Pause size={20} />
                {t("Stop", "إيقاف", "Arrêter")}
              </Button>
            )}
            {(streamState === "error" || streamState === "stopped") && (
              <Button
                variant="secondary"
                onClick={() => {
                  setFail(false);
                  startStream(true);
                }}
              >
                <RefreshCw size={20} />
                {t(
                  "Retry to completion",
                  "إعادة المحاولة حتى الإكمال",
                  "Réessayer jusqu’à la fin",
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                if (interval.current) clearInterval(interval.current);
                setStream("");
                setStreamState("idle");
              }}
            >
              {t("Clear simulation", "مسح المحاكاة", "Effacer la simulation")}
            </Button>
            <label className="check-label">
              <input
                type="checkbox"
                checked={fail}
                onChange={(event) => setFail(event.target.checked)}
                disabled={streamState === "streaming"}
              />
              {t(
                "Simulate interruption",
                "محاكاة انقطاع",
                "Simuler une interruption",
              )}
            </label>
          </div>
          <div className="component-stream">
            <p>
              {stream ||
                t(
                  "The simulated text will appear here.",
                  "سيظهر النص التجريبي هنا.",
                  "Le texte simulé apparaît ici.",
                )}
            </p>
            {streamState === "streaming" && (
              <span className="component-stream-cursor" aria-hidden="true" />
            )}
          </div>
          <div className="toolbar">
            <Badge
              tone={
                streamState === "error"
                  ? "danger"
                  : streamState === "complete"
                    ? "success"
                    : "info"
              }
            >
              {streamState === "complete"
                ? t("Complete", "مكتمل", "Terminé")
                : streamState === "streaming"
                  ? t("Text in progress", "النص قيد العرض", "Texte en cours")
                  : streamState === "error"
                    ? t(
                        "Interrupted · retry available",
                        "متوقف · يمكن إعادة المحاولة",
                        "Interrompu · nouvel essai disponible",
                      )
                    : streamState === "stopped"
                      ? t("Stopped by you", "أوقفته أنت", "Arrêté par vous")
                      : t("Ready to start", "جاهز للبدء", "Prêt à démarrer")}
            </Badge>
            <Button variant="ghost" onClick={() => setSource(true)}>
              <FileText size={20} />
              {t(
                "Source 1 · Sample transcript",
                "المصدر 1 · كشف درجات تجريبي",
                "Source 1 · Relevé exemple",
              )}
            </Button>
          </div>
          <Disclosure
            title={t(
              "Citation details and limits",
              "تفاصيل الاستشهاد وحدوده",
              "Détails et limites de la source",
            )}
          >
            <p>
              {t(
                "The sample transcript contains a name, an identifier, and 42 completed credits. A reviewer must confirm extracted fields.",
                "يتضمن الكشف التجريبي الاسم والمعرف و42 ساعة مكتملة. يجب على المراجع تأكيد الحقول المستخرجة.",
                "Le relevé exemple contient un nom, un identifiant et 42 crédits acquis. Une personne confirme les champs extraits.",
              )}
            </p>
            <Button variant="secondary" onClick={() => setSource(true)}>
              {t(
                "Inspect source text",
                "فحص نص المصدر",
                "Examiner le texte source",
              )}
            </Button>
          </Disclosure>
        </div>
      </Panel>
      <div className="demo-grid">
        <Panel
          title={
            <span data-specimen="communication-reviewed-extraction-fields">
              {t(
                "Reviewed extraction fields",
                "حقول مستخرجة مع مراجعة",
                "Champs extraits à vérifier",
              )}
            </span>
          }
        >
          <div className="demo-stack">
            <Badge tone={applied ? "success" : "warning"}>
              {applied
                ? t(
                    "Applied to local sample",
                    "طُبقت على المثال المحلي",
                    "Appliqué à l’exemple local",
                  )
                : t(
                    "Human review required",
                    "المراجعة البشرية مطلوبة",
                    "Vérification humaine requise",
                  )}
            </Badge>
            <Field
              label={t(
                "Extracted student name",
                "اسم الطالب المستخرج",
                "Nom extrait",
              )}
            >
              <input
                className="input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setReviewed((old) => old.filter((value) => value !== "name"));
                  setApplied(false);
                }}
              />
            </Field>
            <label className="check-label">
              <input
                type="checkbox"
                checked={reviewed.includes("name")}
                onChange={(event) =>
                  setReviewed((old) =>
                    event.target.checked
                      ? [...old, "name"]
                      : old.filter((value) => value !== "name"),
                  )
                }
              />
              {t(
                "I checked the name against the source.",
                "راجعت الاسم بمقارنته بالمصدر.",
                "J’ai comparé le nom avec la source.",
              )}
            </label>
            <Field
              label={t(
                "Extracted completed credits",
                "الساعات المكتملة المستخرجة",
                "Crédits acquis extraits",
              )}
            >
              <input
                className="input"
                type="number"
                min={0}
                max={180}
                value={credits}
                onChange={(event) => {
                  setCredits(event.target.value);
                  setReviewed((old) =>
                    old.filter((value) => value !== "credits"),
                  );
                  setApplied(false);
                }}
              />
            </Field>
            <label className="check-label">
              <input
                type="checkbox"
                checked={reviewed.includes("credits")}
                onChange={(event) =>
                  setReviewed((old) =>
                    event.target.checked
                      ? [...old, "credits"]
                      : old.filter((value) => value !== "credits"),
                  )
                }
              />
              {t(
                "I checked the credits against the source.",
                "راجعت الساعات بمقارنتها بالمصدر.",
                "J’ai comparé les crédits avec la source.",
              )}
            </label>
            <Button
              disabled={
                !name.trim() ||
                !credits ||
                +credits < 0 ||
                +credits > 180 ||
                !reviewed.includes("name") ||
                !reviewed.includes("credits")
              }
              onClick={() => {
                setApplied(true);
                log(
                  t(
                    "Reviewed extraction applied",
                    "طُبقت الحقول المستخرجة بعد المراجعة",
                    "Champs vérifiés appliqués",
                  ),
                  `${name} · ${credits} ${t("credits", "ساعة", "crédits")}`,
                );
                props.notify(
                  t(
                    "Reviewed fields applied locally",
                    "طُبقت الحقول المراجعة محليًا",
                    "Champs vérifiés appliqués localement",
                  ),
                  "success",
                );
              }}
            >
              <Check size={20} />
              {t(
                "Apply reviewed fields",
                "تطبيق الحقول المراجعة",
                "Appliquer les champs vérifiés",
              )}
            </Button>
          </div>
        </Panel>
        <Panel
          title={
            <span data-specimen="communication-timeline-and-audit-log">
              {t(
                "Timeline and audit log",
                "التسلسل الزمني وسجل التدقيق",
                "Chronologie et journal d’audit",
              )}
            </span>
          }
        >
          <ol className="component-timeline">
            {audit.map((item) => (
              <li key={item.id}>
                <span className="component-timeline-point">
                  <Check size={16} />
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <p className="muted">
                    <bdi>{item.detail}</bdi>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Button
            variant="secondary"
            onClick={() =>
              log(
                t(
                  "Manual review note added",
                  "أُضيفت ملاحظة مراجعة يدوية",
                  "Note de révision ajoutée",
                ),
              )
            }
          >
            {t("Add audit event", "إضافة حدث تدقيق", "Ajouter un événement")}
          </Button>
        </Panel>
      </div>
      <ModalExample
        open={source}
        onClose={() => setSource(false)}
        title={t(
          "Source 1: Sample transcript",
          "المصدر 1: كشف درجات تجريبي",
          "Source 1 : Relevé exemple",
        )}
        locale={props.locale}
      >
        <div className="demo-stack">
          <Badge tone="info">
            {t(
              "Explicit sample source",
              "مصدر تجريبي صريح",
              "Source exemple explicite",
            )}
          </Badge>
          <dl className="component-description-list">
            <div>
              <dt>{t("Student", "الطالب", "Étudiante")}</dt>
              <dd>Mariam Hassan</dd>
            </div>
            <div>
              <dt>{t("Identifier", "المعرف", "Identifiant")}</dt>
              <dd>
                <bdi>EJ-2026-0042</bdi>
              </dd>
            </div>
            <div>
              <dt>
                {t("Completed credits", "الساعات المكتملة", "Crédits acquis")}
              </dt>
              <dd>{number(props.locale, 42)}</dd>
            </div>
            <div>
              <dt>{t("Issued", "تاريخ الإصدار", "Émis")}</dt>
              <dd>
                <bdi>2026-10-27</bdi>
              </dd>
            </div>
          </dl>
          <Button variant="secondary" onClick={() => setSource(false)}>
            {t(
              "Return to review",
              "العودة إلى المراجعة",
              "Revenir à la révision",
            )}
          </Button>
        </div>
      </ModalExample>
    </ComponentFrame>
  );
}
