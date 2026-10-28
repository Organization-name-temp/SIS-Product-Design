import { useEffect, useRef, type ReactNode } from "react";

export type ToastTone = "success" | "warning" | "danger" | "info";

export interface ToastProps {
  message: ReactNode;
  tone?: ToastTone;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, tone = "success", onDismiss, durationMs = 5000 }: ToastProps) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    const timer = window.setTimeout(() => dismissRef.current(), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`sis-toast sis-toast-${tone}`} role="status">
      <span className="sis-toast-message">{message}</span>
      <button type="button" className="sis-toast-dismiss" aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}
