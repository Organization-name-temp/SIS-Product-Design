import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: { label: ReactNode; onClick: () => void };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="sis-state sis-state-empty">
      <p className="sis-state-title">{title}</p>
      {description ? <p className="sis-state-description">{description}</p> : null}
      {action ? (
        <button type="button" className="sis-btn sis-btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
