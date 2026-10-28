import { cloneElement, useId, isValidElement, type ReactElement } from "react";

export interface TooltipProps {
  label: string;
  children: ReactElement;
}

export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();
  if (!isValidElement(children)) return children;
  const child = children as ReactElement<{ "aria-describedby"?: string }>;
  const describedBy = [child.props["aria-describedby"], id].filter(Boolean).join(" ");
  return (
    <span className="sis-tooltip">
      {cloneElement(child, { "aria-describedby": describedBy })}
      <span className="sis-tooltip-bubble" role="tooltip" id={id} data-label={label}>
        {label}
      </span>
    </span>
  );
}
