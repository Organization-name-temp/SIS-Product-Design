import { forwardRef, useId, type ReactNode } from "react";

export interface CheckboxProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, checked, defaultChecked, onChange, disabled, error },
  ref,
) {
  const id = useId();
  const classes = ["sis-choice"];
  if (error) classes.push("sis-choice-invalid");
  return (
    <label className={classes.join(" ")} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="sis-choice-input sis-choice-checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event) => onChange?.(event.target.checked)}
        disabled={disabled}
      />
      <span className="sis-choice-control" aria-hidden="true" />
      <span className="sis-choice-label">{label}</span>
    </label>
  );
});
