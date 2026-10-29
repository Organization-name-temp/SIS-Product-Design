import { forwardRef, useId, useState, type ReactNode } from "react";

export interface SwitchProps {
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked, onChange, disabled },
  ref,
) {
  const id = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internalChecked;
  return (
    <label className="sis-choice sis-switch" htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        className="sis-choice-input sis-switch-input"
        checked={isChecked}
        aria-checked={isChecked}
        onChange={(event) => {
          setInternalChecked(event.target.checked);
          onChange?.(event.target.checked);
        }}
        disabled={disabled}
      />
      <span className="sis-switch-control" aria-hidden="true">
        <span className="sis-switch-thumb" />
      </span>
      <span className="sis-choice-label">{label}</span>
    </label>
  );
});
