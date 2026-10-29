import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
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
  const initialIndex = useRef(0);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItems = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
  useEffect(() => {
    if (!open) return;
    const controls = menuItems();
    controls[initialIndex.current < 0 ? controls.length - 1 : 0]?.focus();
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      initialIndex.current =
        event.key === "ArrowUp" || event.key === "End" ? -1 : 0;
      setOpen(true);
      return;
    }
    const controls = menuItems();
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? controls.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) %
            controls.length;
    controls[next]?.focus();
  }
  return (
    <div
      className="sis-menu"
      ref={rootRef}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className="sis-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => {
          initialIndex.current = 0;
          setOpen(!open);
        }}
      >
        {trigger}
      </button>
      {open && (
        <ul
          id={`${id}-menu`}
          className="sis-menu-popup"
          role="menu"
          aria-labelledby={`${id}-trigger`}
        >
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
                  close();
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
