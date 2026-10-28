import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface MenuItem {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
}

export interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  onSelect?: (id: string) => void;
}

export function Menu({ trigger, items, onSelect }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      return;
    }
    const menuItems = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (menuItems.length === 0) return;
    const index = menuItems.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        event.key === "ArrowDown"
          ? (index + 1 + menuItems.length) % menuItems.length
          : (index - 1 + menuItems.length) % menuItems.length;
      menuItems[next]?.focus();
    }
  };

  return (
    <div className="sis-menu" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        className="sis-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
      </button>
      {open ? (
        <ul className="sis-menu-popup" role="menu">
          {items.map((item) => (
            <li key={item.id} role="none">
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="sis-menu-item"
                onClick={() => {
                  item.onSelect?.();
                  onSelect?.(item.id);
                  setOpen(false);
                  rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
