import { CloseIcon } from "./component-icons";
import type { ReactNode } from "react";

export type AlertTone = "success" | "warning" | "danger" | "info";

export interface AlertProps {
  tone: AlertTone;
  title?: ReactNode;
  children: ReactNode;
  onDismiss?: () => void;
}

export function Alert({ tone, title, children, onDismiss }: AlertProps) {
  const urgent = tone === "danger" || tone === "warning";
  return (
    <div
      className={`sis-alert sis-alert-${tone}`}
      role={urgent ? "alert" : "status"}
    >
      <div className="sis-alert-body">
        {title ? <p className="sis-alert-title">{title}</p> : null}
        <div className="sis-alert-content">{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="sis-alert-dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
