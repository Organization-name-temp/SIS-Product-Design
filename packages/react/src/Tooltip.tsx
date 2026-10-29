import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useId,
  useState,
  isValidElement,
  type ReactElement,
} from "react";
export interface TooltipProps {
  label: string;
  children: ReactElement;
}
export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({
    insetInlineStart: 0,
    insetBlockStart: 0,
  });
  const [active, setActive] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!active) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDismissed(true);
        event.stopPropagation();
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [active]);
  useLayoutEffect(() => {
    if (!active || dismissed) return;
    const place = () => {
      const root = rootRef.current;
      const bubble = bubbleRef.current;
      if (!root || !bubble) return;
      const anchor = root.getBoundingClientRect();
      const bounds = bubble.getBoundingClientRect();
      const gap = 8;
      const left = Math.max(
        gap,
        Math.min(
          window.innerWidth - bounds.width - gap,
          anchor.left + anchor.width / 2 - bounds.width / 2,
        ),
      );
      const top = anchor.top - bounds.height - gap;
      const rtl = getComputedStyle(bubble).direction === "rtl";
      setPosition({
        insetInlineStart: rtl ? window.innerWidth - left - bounds.width : left,
        insetBlockStart: top >= gap ? top : anchor.bottom + gap,
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [active, dismissed]);
  if (!isValidElement(children)) return children;
  const child = children as ReactElement<{ "aria-describedby"?: string }>;
  const describedBy = [child.props["aria-describedby"], id]
    .filter(Boolean)
    .join(" ");
  const show = () => {
    setActive(true);
    setDismissed(false);
  };
  const hide = () => {
    setActive(false);
    setDismissed(false);
  };
  return (
    <span
      ref={rootRef}
      className="sis-tooltip"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) hide();
      }}
    >
      {cloneElement(child, { "aria-describedby": describedBy })}
      <span
        ref={bubbleRef}
        style={position}
        className="sis-tooltip-bubble"
        role="tooltip"
        id={id}
        hidden={!active || dismissed}
      >
        {label}
      </span>
    </span>
  );
}
