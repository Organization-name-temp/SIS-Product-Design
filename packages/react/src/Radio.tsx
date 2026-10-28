import { forwardRef, useId, type ReactNode } from "react";

export interface RadioProps {
  name: string;
  label: ReactNode;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { name, label, value, checked, defaultChecked, onChange, disabled },
  ref,
) {
  const id = useId();
  return (
    <label className="sis-choice" htmlFor={id}>
      <input
        ref={ref}
        id={id}
        type="radio"
        name={name}
        value={value}
        className="sis-choice-input sis-choice-radio"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={() => onChange?.(value)}
        disabled={disabled}
      />
      <span className="sis-choice-control" aria-hidden="true" />
      <span className="sis-choice-label">{label}</span>
    </label>
  );
});
