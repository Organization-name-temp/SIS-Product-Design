import type { ReactNode } from "react";

export interface ErrorStateProps {
  title: ReactNode;
  description?: ReactNode;
  onRetry: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="sis-state sis-state-error">
      <p className="sis-state-title">{title}</p>
      {description ? <p className="sis-state-description">{description}</p> : null}
      <button type="button" className="sis-btn sis-btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
