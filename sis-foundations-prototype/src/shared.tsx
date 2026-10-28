import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { ModalOverlay, Modal, Dialog } from "react-aria-components";
import {
  Check,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
  ChevronDown,
} from "lucide-react";
export type Locale = "en" | "ar";
export type Tone = "neutral" | "success" | "warning" | "danger" | "info";
export type DemoProps = {
  locale: Locale;
  density: "comfortable" | "compact";
  theme: "light" | "dark";
  state: string;
  variant: string;
  specimen?: string;
  notify: (message: string, tone?: Tone) => void;
};
export type DemoRenderer = (props: DemoProps) => ReactNode;
export function tr(locale: Locale, en: string, ar: string, fr: string) {
  return locale === "ar" ? ar : en;
}
export function number(
  locale: Locale,
  value: number,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(
    locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB",
    { numberingSystem: "latn", ...options },
  ).format(value);
}
export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      type="button"
      className={`button button-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Panel({
  title,
  children,
  className = "",
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`sample-panel ${className}`}>
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
}
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const Icon =
    tone === "success"
      ? Check
      : tone === "danger"
        ? CircleAlert
        : tone === "warning"
          ? TriangleAlert
          : Info;
  return (
    <span className={`badge tone-${tone}`}>
      <Icon size={16} aria-hidden="true" />
      {children}
    </span>
  );
}
export function Callout({
  tone = "info",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <div
      className={`callout tone-${tone}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Badge tone={tone}>{tone === "danger" ? "!" : ""}</Badge>
      <div>{children}</div>
    </div>
  );
}
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}) {
  const uid = useId();
  let controlId = "";
  const description = [hint ? `${uid}-help` : "", error ? `${uid}-error` : ""]
    .filter(Boolean)
    .join(" ");
  function connect(nodes: ReactNode): ReactNode {
    return Children.map(nodes, (node) => {
      if (!isValidElement(node)) return node;
      const element = node as ReactElement<{
        id?: string;
        children?: ReactNode;
        "aria-describedby"?: string;
      }>;
      if (
        !controlId &&
        typeof element.type === "string" &&
        ["input", "select", "textarea"].includes(element.type)
      ) {
        controlId = element.props.id || uid;
        return cloneElement(element, {
          id: controlId,
          "aria-describedby":
            [element.props["aria-describedby"], description]
              .filter(Boolean)
              .join(" ") || undefined,
        });
      }
      return element.props.children
        ? cloneElement(element, { children: connect(element.props.children) })
        : element;
    });
  }
  const content = connect(children);
  return (
    <div className="field">
      <label className="field-label" htmlFor={controlId || undefined}>
        {label}
      </label>
      {content}
      {hint && (
        <small id={`${uid}-help`} className="field-help">
          {hint}
        </small>
      )}
      {error && (
        <small id={`${uid}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
export function ModalExample({
  open,
  onClose,
  title,
  children,
  locale = "en",
  drawer = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  locale?: Locale;
  drawer?: boolean;
}) {
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
      isDismissable
      className={`modal-overlay ${drawer ? "drawer-overlay" : ""}`}
    >
      <Modal className={`modal ${drawer ? "drawer" : ""}`}>
        <Dialog aria-label={title} className="dialog">
          <div className="dialog-heading">
            <h2>{title}</h2>
            <Button
              variant="ghost"
              onClick={onClose}
              aria-label={tr(locale, "Close", "إغلاق", "Fermer")}
            >
              <X size={20} />
            </Button>
          </div>
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
export function Disclosure({
  title,
  children,
  initial = false,
}: {
  title: string;
  children: ReactNode;
  initial?: boolean;
}) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="disclosure">
      <button
        className="disclosure-trigger"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown
          size={20}
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        />
      </button>
      {open && <div className="disclosure-body">{children}</div>}
    </div>
  );
}
export async function copyText(
  text: string,
  notify: DemoProps["notify"],
  locale: Locale = "en",
) {
  try {
    await navigator.clipboard.writeText(text);
    notify(
      tr(
        locale,
        "Copied to clipboard",
        "تم النسخ",
        "Copié dans le presse-papiers",
      ),
      "success",
    );
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    notify(
      copied
        ? tr(locale, "Copied to clipboard", "تم النسخ", "Copié")
        : tr(
            locale,
            "Select the text and copy it",
            "حدد النص وانسخه",
            "Sélectionnez et copiez le texte",
          ),
      copied ? "success" : "info",
    );
  }
}
export function download(
  name: string,
  text: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
