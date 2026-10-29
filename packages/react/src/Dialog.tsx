import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalLayer } from "./use-modal-layer";
import { CloseIcon } from "./component-icons";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModalLayer(open, panelRef, onClose);
  if (!open) return null;
  return createPortal(
    <div
      className="sis-dialog-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className="sis-dialog"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={titleId}
      >
        <header className="sis-dialog-header">
          <h2 id={titleId} className="sis-dialog-title">
            {title}
          </h2>
          <button
            type="button"
            className="sis-dialog-close"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>
        <div className="sis-dialog-body">{children}</div>
        {footer ? <div className="sis-dialog-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
