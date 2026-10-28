import { type ReactNode } from "react";
import { Badge, Callout, tr, type DemoProps } from "../../shared";

export function useLabels(props: DemoProps) {
  return (en: string, ar: string, fr: string) => tr(props.locale, en, ar, fr);
}
export function flags(props: DemoProps) {
  const state = props.state.toLowerCase();
  return {
    disabled: state.includes("disabled"),
    invalid: /error|invalid|failure/.test(state),
    pending: /loading|pending|busy/.test(state),
    empty: state.includes("empty"),
    readonly: /read.?only/.test(state),
  };
}
export function ComponentFrame({
  props,
  children,
}: {
  props: DemoProps;
  children: ReactNode;
}) {
  const t = useLabels(props);
  const status = flags(props);
  return (
    <div
      className="component-demo demo-stack"
      data-state={props.state}
      data-variant={props.variant}
    >
      <div className="component-context">
        <Badge>
          {t("Variant", "النمط", "Variante")}: {props.variant}
        </Badge>
        <span className="muted">
          {t("State", "الحالة", "État")}: {props.state}
        </span>
      </div>
      {status.invalid && (
        <Callout tone="danger">
          {t(
            "The sample contains an error. Use the controls to correct it.",
            "يحتوي المثال على خطأ. استخدم عناصر التحكم لتصحيحه.",
            "Cet exemple contient une erreur. Utilisez les commandes pour la corriger.",
          )}
        </Callout>
      )}
      {props.state === "success" && (
        <Callout tone="success">
          {t(
            "The sample action is confirmed.",
            "تأكد الإجراء التجريبي.",
            "L’action exemple est confirmée.",
          )}
        </Callout>
      )}
      {props.state === "selected" && (
        <Badge tone="success">
          {t("Selected sample", "مثال محدد", "Exemple sélectionné")}
        </Badge>
      )}
      {props.variant === "long-content" && (
        <p className="component-long-content">
          {t(
            "A comprehensive academic record may contain a long department name, a scholarship condition, several academic periods, and multilingual document titles.",
            "قد يتضمن السجل الأكاديمي الشامل اسم قسم طويلًا وشرط منحة وعدة فترات أكاديمية وعناوين مستندات متعددة اللغات.",
            "Un dossier universitaire complet peut contenir un long nom de département, une condition de bourse, plusieurs périodes et des titres multilingues.",
          )}
        </p>
      )}
      {status.pending && (
        <div className="row" role="status">
          <span className="component-spinner" />
          {t(
            "Sample operation pending",
            "عملية المثال قيد التنفيذ",
            "Opération en cours",
          )}
        </div>
      )}
      <fieldset
        className="component-fieldset demo-stack"
        disabled={status.disabled}
        aria-disabled={status.disabled || undefined}
        onClickCapture={(event) => {
          if (status.disabled) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDownCapture={(event) => {
          if (status.disabled && event.key !== "Tab") {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        aria-busy={status.pending}
      >
        {children}
      </fieldset>
    </div>
  );
}
