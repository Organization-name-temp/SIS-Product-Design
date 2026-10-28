import { forwardRef, useId, type ReactNode } from "react";

export interface DateFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  min?: string;
  max?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
  { label, hint, error, min, max, defaultValue, onChange, disabled },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const classes = ["sis-field"];
  if (error) classes.push("sis-field-invalid");

  return (
    <div className={classes.join(" ")}>
      <label className="sis-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="date"
        className="sis-field-input"
        min={min}
        max={max}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? hintId : undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {error ? (
        <p className="sis-field-hint sis-field-error" id={hintId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="sis-field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
