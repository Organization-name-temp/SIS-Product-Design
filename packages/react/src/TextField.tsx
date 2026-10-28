import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, className, ...rest },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const describedBy = hint || error ? hintId : undefined;
  const classes = ["sis-field"];
  if (error) classes.push("sis-field-invalid");
  if (className) classes.push(className);
  return (
    <div className={classes.join(" ")}>
      <label className="sis-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className="sis-field-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
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
