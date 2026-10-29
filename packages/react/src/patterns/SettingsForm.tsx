import type { FormEvent, ReactNode } from "react";

export interface SettingsFormProps {
  title: ReactNode;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting?: boolean;
  onCancel?: () => void;
  cancelLabel?: ReactNode;
  submitLabel?: ReactNode;
}

export function SettingsForm({
  title,
  children,
  onSubmit,
  submitting = false,
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save changes",
}: SettingsFormProps) {
  return (
    <form
      className="sis-settings"
      aria-busy={submitting || undefined}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    >
      <fieldset className="sis-settings-body" disabled={submitting}>
        <legend className="sis-settings-title">{title}</legend>
        {children}
      </fieldset>
      <div className="sis-settings-footer">
        <button
          type="button"
          className="sis-btn sis-btn-ghost"
          disabled={submitting}
          onClick={(event) =>
            onCancel ? onCancel() : event.currentTarget.form?.reset()
          }
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className="sis-btn sis-btn-primary"
          disabled={submitting}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
