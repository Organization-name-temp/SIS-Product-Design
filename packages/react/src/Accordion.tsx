import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  summary: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const root = event.currentTarget.closest(".sis-accordion");
    const buttons = Array.from(root?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const index = buttons.indexOf(event.currentTarget);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    buttons[(next + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div className="sis-accordion">
      {items.map((item) => {
        const expanded = open === item.id;
        const summaryId = `${baseId}-${item.id}-summary`;
        const regionId = `${baseId}-${item.id}-region`;
        return (
          <div className="sis-accordion-item" key={item.id}>
            <button
              type="button"
              id={summaryId}
              className="sis-accordion-summary"
              aria-expanded={expanded}
              aria-controls={regionId}
              onClick={() => setOpen(expanded ? null : item.id)}
              onKeyDown={onKeyDown}
            >
              {item.summary}
            </button>
            {expanded ? (
              <div className="sis-accordion-content" id={regionId} role="region" aria-labelledby={summaryId}>
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
