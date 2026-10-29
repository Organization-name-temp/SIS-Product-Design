import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs";

export interface PageHeaderProps {
  title: ReactNode;
  headingLevel?: 1 | 2 | 3;
  description?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  headingLevel = 1,
}: PageHeaderProps) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";
  return (
    <header className="sis-page-header">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="sis-page-header-row">
        <div>
          <Heading className="sis-page-title">{title}</Heading>
          {description ? (
            <p className="sis-page-description">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="sis-page-actions">{actions}</div> : null}
      </div>
    </header>
  );
}
