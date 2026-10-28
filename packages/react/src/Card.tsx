import type { ReactNode } from "react";

export interface CardProps {
  title?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function Card({ title, actions, footer, children }: CardProps) {
  return (
    <section className="sis-card">
      {title || actions ? (
        <header className="sis-card-header">
          {title ? <h3 className="sis-card-title">{title}</h3> : null}
          {actions ? <div className="sis-card-actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="sis-card-body">{children}</div>
      {footer ? <footer className="sis-card-footer">{footer}</footer> : null}
    </section>
  );
}
