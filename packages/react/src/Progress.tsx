export interface ProgressProps {
  value: number;
  max?: number;
  label: string;
}

export function Progress({ value, max = 100, label }: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="sis-progress"
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="sis-progress-fill" style={{ inlineSize: `${percent}%` }} />
    </div>
  );
}
