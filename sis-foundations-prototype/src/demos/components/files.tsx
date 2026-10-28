import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  Button,
  Panel,
  Badge,
  Callout,
  ModalExample,
  download,
  number,
  type DemoProps,
} from "../../shared";
import { ComponentFrame, useLabels } from "./common";

type UploadItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status:
    "queued" | "uploading" | "complete" | "failed" | "cancelled" | "invalid";
  error?: string;
  fail: boolean;
  url?: string;
  text?: string;
};
const allowed = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
  "text/csv",
];
export function FilesDemo(props: DemoProps) {
  const t = useLabels(props);
  const id = useId();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [drag, setDrag] = useState(false);
  const [fail, setFail] = useState(false);
  const [preview, setPreview] = useState<UploadItem | null>(null);
  const [result, setResult] = useState("");
  const urls = useRef(new Set<string>());
  const sequence = useRef(0);
  useEffect(() => {
    if (!["pending", "error", "success"].includes(props.state)) return;
    const text =
      "Explicit local sample document. Student: Mariam Hassan. Credits: 42.";
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    urls.current.add(url);
    setItems([
      {
        id: `${id}-state-${++sequence.current}`,
        name: "sample-academic-record.txt",
        size: text.length,
        type: "text/plain",
        text,
        url,
        progress:
          props.state === "pending" ? 30 : props.state === "error" ? 60 : 100,
        status:
          props.state === "pending"
            ? "uploading"
            : props.state === "error"
              ? "failed"
              : "complete",
        fail: false,
        error:
          props.state === "error"
            ? t(
                "Simulated upload failure. Use Retry to complete it.",
                "فشل رفع تجريبي. استخدم إعادة المحاولة لإكماله.",
                "Échec simulé. Utilisez Réessayer pour terminer.",
              )
            : undefined,
      },
    ]);
  }, [props.state]);
  useEffect(
    () => () => urls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );
  useEffect(() => {
    const interval = setInterval(
      () =>
        setItems((old) =>
          !old.some((item) => item.status === "uploading")
            ? old
            : old.map((item) => {
                if (item.status !== "uploading") return item;
                const progress = Math.min(100, item.progress + 10);
                if (item.fail && progress >= 60)
                  return {
                    ...item,
                    progress,
                    status: "failed",
                    error: t(
                      "Simulated connection failure. Retry is available.",
                      "فشل اتصال تجريبي. إعادة المحاولة متاحة.",
                      "Échec de connexion simulé. Vous pouvez réessayer.",
                    ),
                  };
                return {
                  ...item,
                  progress,
                  status: progress === 100 ? "complete" : "uploading",
                };
              }),
        ),
      180,
    );
    return () => clearInterval(interval);
  }, [props.locale]);
  const add = async (files: File[], simulateFailure = fail) => {
    const remaining = Math.max(0, 5 - items.length);
    if (files.length > remaining)
      props.notify(
        t(
          "The sample accepts up to 5 files.",
          "يقبل المثال حتى 5 ملفات.",
          "L’exemple accepte 5 fichiers au maximum.",
        ),
        "warning",
      );
    const incoming = await Promise.all(
      files.slice(0, remaining).map(async (file) => {
        const type =
          file.type ||
          (file.name.toLowerCase().endsWith(".csv")
            ? "text/csv"
            : file.name.toLowerCase().endsWith(".txt")
              ? "text/plain"
              : "application/octet-stream");
        const error =
          file.size > 5 * 1024 * 1024
            ? t(
                "The file exceeds 5 MB.",
                "يتجاوز الملف 5 ميغابايت.",
                "Le fichier dépasse 5 Mo.",
              )
            : !allowed.includes(type)
              ? t(
                  "Choose PDF, PNG, JPEG, TXT, or CSV.",
                  "اختر PDF أو PNG أو JPEG أو TXT أو CSV.",
                  "Choisissez PDF, PNG, JPEG, TXT ou CSV.",
                )
              : undefined;
        let url: string | undefined;
        if (!error) {
          url = URL.createObjectURL(file);
          urls.current.add(url);
        }
        return {
          id: `${id}-${++sequence.current}`,
          name: file.name,
          size: file.size,
          type,
          progress: 0,
          status: error ? ("invalid" as const) : ("uploading" as const),
          error,
          fail: simulateFailure,
          url,
          text:
            !error && type.startsWith("text/") ? await file.text() : undefined,
        };
      }),
    );
    setItems((old) => [...old, ...incoming].slice(0, 5));
    setResult(
      t(
        "Files stay in this browser. The upload progress is simulated.",
        "تبقى الملفات في هذا المتصفح. تقدم الرفع محاكاة.",
        "Les fichiers restent dans ce navigateur. La progression est simulée.",
      ),
    );
  };
  const sample = (invalid = false) => {
    const content = t(
      "Sample academic record\nStudent: Mariam Hassan\nIdentifier: EJ-2026-0042\nCredits: 42\nStatus: verified sample",
      "سجل أكاديمي تجريبي\nالطالبة: مريم حسن\nالمعرف: EJ-2026-0042\nالساعات: 42\nالحالة: مثال موثق",
      "Dossier universitaire exemple\nÉtudiante : Mariam Hassan\nIdentifiant : EJ-2026-0042\nCrédits : 42\nStatut : exemple vérifié",
    );
    void add([
      new File(
        [content],
        invalid ? "unsupported.exe" : `academic-record-${items.length + 1}.txt`,
        { type: invalid ? "application/octet-stream" : "text/plain" },
      ),
    ]);
  };
  const remove = (item: UploadItem) => {
    if (item.url) {
      URL.revokeObjectURL(item.url);
      urls.current.delete(item.url);
    }
    setItems((old) => old.filter((value) => value.id !== item.id));
    if (preview?.id === item.id) setPreview(null);
  };
  const statusText = (item: UploadItem) =>
    item.status === "complete"
      ? t("Ready", "جاهز", "Prêt")
      : item.status === "uploading"
        ? t("Uploading locally", "رفع تجريبي محلي", "Chargement local")
        : item.status === "cancelled"
          ? t("Cancelled", "ملغى", "Annulé")
          : item.status === "invalid"
            ? t("Invalid file", "ملف غير صالح", "Fichier non valide")
            : t("Failed", "فشل", "Échec");
  return (
    <ComponentFrame props={props}>
      <Panel
        title={
          <span data-specimen="files-document-selection-and-validation">
            {t(
              "Document selection and validation",
              "اختيار المستندات والتحقق",
              "Sélection et validation des documents",
            )}
          </span>
        }
      >
        <div className="demo-stack">
          <div
            className="component-dropzone"
            data-dragging={drag}
            onDragOver={(event) => {
              event.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDrag(false);
              void add([...event.dataTransfer.files]);
            }}
          >
            <Upload size={24} />
            <h3>
              {t(
                "Drop documents here",
                "أفلت المستندات هنا",
                "Déposez les documents ici",
              )}
            </h3>
            <p>
              {t(
                "PDF, PNG, JPEG, TXT, or CSV. Maximum 5 MB per file and 5 files.",
                "PDF أو PNG أو JPEG أو TXT أو CSV. حد كل ملف 5 ميغابايت، وحتى 5 ملفات.",
                "PDF, PNG, JPEG, TXT ou CSV. Maximum 5 Mo par fichier et 5 fichiers.",
              )}
            </p>
            <label className="button button-secondary" htmlFor={id}>
              {t(
                "Choose local files",
                "اختيار ملفات محلية",
                "Choisir des fichiers locaux",
              )}
            </label>
            <input
              id={id}
              className="component-sr-only"
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
              onChange={(event) => {
                if (event.target.files) void add([...event.target.files]);
                event.target.value = "";
              }}
            />
          </div>
          <div className="toolbar">
            <Button
              variant="secondary"
              disabled={items.length >= 5}
              onClick={() => sample()}
            >
              <FileText size={20} />
              {t(
                "Add sample document",
                "إضافة مستند تجريبي",
                "Ajouter un exemple",
              )}
            </Button>
            <Button
              variant="ghost"
              disabled={items.length >= 5}
              onClick={() => sample(true)}
            >
              {t(
                "Try unsupported file",
                "تجربة ملف غير مدعوم",
                "Essayer un fichier non accepté",
              )}
            </Button>
            <label className="check-label">
              <input
                type="checkbox"
                checked={fail}
                onChange={(event) => setFail(event.target.checked)}
              />
              {t(
                "Fail the next upload",
                "إفشال الرفع التالي",
                "Faire échouer le prochain chargement",
              )}
            </label>
          </div>
          {!items.length && (
            <div className="component-empty">
              <FileText size={24} />
              <p>
                {t(
                  "No documents selected. Add a sample to inspect progress and preview.",
                  "لم تُحدد مستندات. أضف مثالًا لفحص التقدم والمعاينة.",
                  "Aucun document. Ajoutez un exemple pour voir la progression et l’aperçu.",
                )}
              </p>
            </div>
          )}
          <ul className="component-upload-list">
            {items.map((item) => (
              <li key={item.id}>
                <div className="component-upload-heading">
                  <FileText size={20} />
                  <div className="component-grow">
                    <strong>{item.name}</strong>
                    <p className="muted">
                      {number(props.locale, item.size / 1024, {
                        maximumFractionDigits: 1,
                      })}{" "}
                      KB · {statusText(item)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      item.status === "complete"
                        ? "success"
                        : item.status === "invalid" || item.status === "failed"
                          ? "danger"
                          : "info"
                    }
                  >
                    {statusText(item)}
                  </Badge>
                </div>
                {item.status === "uploading" && (
                  <div className="demo-stack">
                    <progress
                      className="component-progress"
                      value={item.progress}
                      max={100}
                      aria-label={`${t("Progress for", "تقدم", "Progression de")} ${item.name}`}
                    />
                    <span>{number(props.locale, item.progress)}%</span>
                  </div>
                )}
                {item.error && (
                  <p className="field-error" role="alert">
                    {item.error}
                  </p>
                )}
                <div className="toolbar">
                  {item.status === "uploading" && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setItems((old) =>
                          old.map((value) =>
                            value.id === item.id
                              ? { ...value, status: "cancelled" }
                              : value,
                          ),
                        )
                      }
                    >
                      <X size={20} />
                      {t(
                        "Cancel upload",
                        "إلغاء الرفع",
                        "Annuler le chargement",
                      )}
                    </Button>
                  )}
                  {(item.status === "failed" ||
                    item.status === "cancelled") && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setItems((old) =>
                          old.map((value) =>
                            value.id === item.id
                              ? {
                                  ...value,
                                  status: "uploading",
                                  progress: 0,
                                  error: undefined,
                                  fail: false,
                                }
                              : value,
                          ),
                        )
                      }
                    >
                      <RefreshCw size={20} />
                      {t(
                        "Retry without failure",
                        "إعادة المحاولة دون فشل",
                        "Réessayer sans échec",
                      )}
                    </Button>
                  )}
                  {item.status === "complete" && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => setPreview(item)}
                      >
                        <Eye size={20} />
                        {t("Preview", "معاينة", "Aperçu")}
                      </Button>
                      <a
                        className="button button-ghost"
                        href={item.url}
                        download={item.name}
                      >
                        <Download size={20} />
                        {t(
                          "Download local file",
                          "تنزيل الملف المحلي",
                          "Télécharger le fichier local",
                        )}
                      </a>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => remove(item)}
                    aria-label={`${t("Remove", "حذف", "Supprimer")} ${item.name}`}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {result && <Callout>{result}</Callout>}
        </div>
      </Panel>
      <ModalExample
        open={!!preview}
        onClose={() => setPreview(null)}
        title={
          preview?.name ||
          t("Document preview", "معاينة المستند", "Aperçu du document")
        }
        locale={props.locale}
      >
        <div className="demo-stack">
          {preview?.type.startsWith("image/") ? (
            <img
              className="component-file-preview"
              src={preview.url}
              alt={preview.name}
            />
          ) : preview?.type === "application/pdf" ? (
            <iframe
              className="component-pdf-preview"
              src={preview.url}
              title={preview.name}
            />
          ) : (
            <pre className="component-text-preview">{preview?.text}</pre>
          )}
          <p className="muted">
            {t(
              "Local document preview. No document was uploaded.",
              "معاينة مستند محلي. لم يُرفع أي مستند.",
              "Aperçu local. Aucun document n’a été téléversé.",
            )}
          </p>
          <Button variant="secondary" onClick={() => setPreview(null)}>
            {t("Close preview", "إغلاق المعاينة", "Fermer l’aperçu")}
          </Button>
        </div>
      </ModalExample>
    </ComponentFrame>
  );
}
