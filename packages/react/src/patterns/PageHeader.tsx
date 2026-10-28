import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <header className="sis-page-header">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="sis-page-header-row">
        <div>
          <h1 className="sis-page-title">{title}</h1>
          {description ? <p className="sis-page-description">{description}</p> : null}
        </div>
        {actions ? <div className="sis-page-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
