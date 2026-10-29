import { PageHeader } from "../../src/patterns/PageHeader";
import { KpiCard } from "../../src/patterns/KpiCard";
import { FilterBar } from "../../src/patterns/FilterBar";
import { EmptyState } from "../../src/patterns/EmptyState";
import { ErrorState } from "../../src/patterns/ErrorState";
import { LoadingState } from "../../src/patterns/LoadingState";
import { SettingsForm } from "../../src/patterns/SettingsForm";

export function PatternsSection() {
  return (
    <div className="fixture-stack">
      <PageHeader
        title="Registration"
        description="Term 2026 fall."
        breadcrumbs={[{ label: "Home", href: "#" }, { label: "Registration" }]}
        actions={<button type="button" className="sis-btn sis-btn-primary">Enroll</button>}
      />
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <KpiCard label="Enrolled" value="12,480" delta="+4.2%" deltaDirection="up" />
        <KpiCard label="Dropped" value="312" delta="-1.1%" deltaDirection="down" />
      </div>
      <FilterBar searchPlaceholder="Search students" />
      <EmptyState title="No schedules yet" description="Create the first schedule." action={{ label: "New schedule", onClick: () => {} }} />
      <ErrorState title="Could not load" description="The network dropped." onRetry={() => {}} />
      <LoadingState rows={3} />
      <SettingsForm title="Preferences" onSubmit={() => {}}>
        <input className="sis-field-input" aria-label="Language" defaultValue="English" />
      </SettingsForm>
    </div>
  );
}
