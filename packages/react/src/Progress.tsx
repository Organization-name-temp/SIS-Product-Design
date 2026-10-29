export interface ProgressProps {
  value: number;
  max?: number;
  label: string;
}

export function Progress({ value, max = 100, label }: ProgressProps) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value)
    ? Math.max(0, Math.min(limit, value))
    : 0;
  const percent = (current / limit) * 100;
  return (
    <div
      className="sis-progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={limit}
    >
      <div
        className="sis-progress-fill"
        style={{ inlineSize: `${percent}%` }}
      />
    </div>
  );
}
