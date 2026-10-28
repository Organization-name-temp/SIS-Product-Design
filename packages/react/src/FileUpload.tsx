import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";

export interface FileUploadProps {
  label: ReactNode;
  accept?: string;
  multiple?: boolean;
  maxSizeMb?: number;
  maxCount?: number;
  onFiles?: (files: File[]) => void;
  error?: ReactNode;
}

export function FileUpload({ label, accept, multiple = false, maxSizeMb, maxCount, onFiles, error }: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejection, setRejection] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptFiles = (incoming: File[]) => {
    let rejected: string | null = null;
    let allowed = incoming;
    if (maxSizeMb) {
      const tooBig = allowed.find((file) => file.size > maxSizeMb * 1024 * 1024);
      if (tooBig) {
        rejected = `${tooBig.name} exceeds the ${maxSizeMb} MB limit.`;
        allowed = allowed.filter((file) => file.size <= maxSizeMb * 1024 * 1024);
      }
    }
    if (maxCount && allowed.length + files.length > maxCount) {
      rejected = `At most ${maxCount} files are allowed.`;
      allowed = allowed.slice(0, Math.max(0, maxCount - files.length));
    }
    setRejection(rejected);
    if (allowed.length === 0) return;
    const next = multiple ? [...files, ...allowed] : allowed.slice(0, 1);
    setFiles(next);
    onFiles?.(next);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    acceptFiles(Array.from(event.dataTransfer.files));
  };

  const remove = (target: File) => {
    const next = files.filter((file) => file !== target);
    setFiles(next);
    onFiles?.(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hintId = `${inputId}-hint`;
  return (
    <div className="sis-upload">
      <label className="sis-field-label" htmlFor={inputId}>
        {label}
      </label>
      <div
        className={`sis-upload-zone${dragOver ? " sis-upload-dragover" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <button type="button" className="sis-upload-trigger" onClick={() => inputRef.current?.click()}>
          Choose a file{multiple ? "s" : ""} or drop {multiple ? "them" : "it"} here
        </button>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sis-upload-input"
        accept={accept}
        multiple={multiple}
        aria-describedby={rejection || error ? hintId : undefined}
        onChange={(event) => acceptFiles(Array.from(event.target.files ?? []))}
      />
      {rejection || error ? (
        <p className="sis-field-hint sis-field-error" id={hintId} role="alert">
          {rejection ?? error}
        </p>
      ) : null}
      <ul className="sis-upload-list">
        {files.map((file) => (
          <li key={file.name} className="sis-upload-item">
            <span>{file.name}</span>
            <button type="button" className="sis-upload-remove" aria-label={`Remove ${file.name}`} onClick={() => remove(file)}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
