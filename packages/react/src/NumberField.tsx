import { forwardRef, useId, type ReactNode } from "react";

export interface NumberFieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, hint, error, min, max, step, value, defaultValue, onChange, disabled },
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
        type="text"
        inputMode="decimal"
        className="sis-field-input sis-number-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? hintId : undefined}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(event) => {
          const filtered = event.target.value.replace(/[^0-9.-]/g, "");
          event.target.value = filtered;
          onChange?.(filtered);
        }}
        {...(min !== undefined ? { "data-min": min } : {})}
        {...(max !== undefined ? { "data-max": max } : {})}
        {...(step !== undefined ? { "data-step": step } : {})}
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
