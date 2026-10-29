import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./component-icons";
import { useModalLayer } from "./use-modal-layer";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  side?: "inline-start" | "inline-end";
}
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "inline-end",
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useModalLayer(open, panelRef, onClose);
  if (!open) return null;
  return createPortal(
    <div
      className="sis-dialog-overlay"
      data-testid="sis-drawer-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className={`sis-drawer sis-drawer-${side}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={titleId}
      >
        <div className="sis-drawer-header">
          <h2 id={titleId} className="sis-drawer-title">
            {title}
          </h2>
          <button
            type="button"
            className="sis-drawer-close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="sis-drawer-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
