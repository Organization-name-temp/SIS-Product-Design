import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading = false, disabled, className, children, type = "button", ...rest },
  ref,
) {
  const classes = ["sis-btn", `sis-btn-${variant}`];
  if (loading) classes.push("sis-btn-loading");
  if (className) classes.push(className);
  return (
    <button
      ref={ref}
      type={type}
      className={classes.join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className="sis-btn-label">{children}</span>
    </button>
  );
});
