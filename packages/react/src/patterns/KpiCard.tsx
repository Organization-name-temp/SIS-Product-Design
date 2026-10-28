import type { ReactNode } from "react";
import { Badge } from "../Badge";
import { Card } from "../Card";

export interface KpiCardProps {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaDirection?: "up" | "down";
}

export function KpiCard({ label, value, delta, deltaDirection }: KpiCardProps) {
  return (
    <Card>
      <div className="sis-kpi">
        <span className="sis-kpi-label">{label}</span>
        <span className="sis-kpi-value">{value}</span>
        {delta ? (
          <Badge tone={deltaDirection === "down" ? "danger" : "success"}>{delta}</Badge>
        ) : null}
      </div>
    </Card>
  );
}
